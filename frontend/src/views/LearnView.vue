<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useLessonsStore } from '../stores/lessons'
import { useProgressStore } from '../stores/progress'

const lessons = useLessonsStore()
const progress = useProgressStore()

const expandedCategory = ref(null)
const selectedLevel = ref('all')

const levelTabs = [
  { key: 'all', label: '전체' },
  { key: 'A1', label: 'A1 입문' },
  { key: 'A2', label: 'A2 초급' },
  { key: 'B1', label: 'B1 중급' },
  { key: 'B2', label: 'B2 중상급' },
]

const filteredCategories = computed(() => {
  if (selectedLevel.value === 'all') return lessons.categories
  return lessons.categories
    .map(cat => ({
      ...cat,
      patterns: cat.patterns.filter(p => p.cefrLevel === selectedLevel.value),
    }))
    .filter(cat => cat.patterns.length > 0)
})

const filteredPatternCount = computed(() => {
  return filteredCategories.value.reduce((sum, cat) => sum + cat.patterns.length, 0)
})

onMounted(async () => {
  await lessons.fetchPatterns()
})

function toggleCategory(id) {
  expandedCategory.value = expandedCategory.value === id ? null : id
}

function getCategoryProgress(category) {
  const learned = category.patterns.filter(p => progress.isLearned(p.id)).length
  return Math.round((learned / category.patterns.length) * 100)
}

function getCefrBg(cefr) {
  switch (cefr) {
    case 'A1': return 'bg-emerald-50 text-emerald-600'
    case 'A2': return 'bg-teal-50 text-teal-600'
    case 'B1': return 'bg-amber-50 text-amber-600'
    case 'B2': return 'bg-rose-50 text-rose-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}

// 패턴 제목에서 첫 번째 예문 영어를 보여주기
function getPatternPreview(pattern) {
  if (pattern.examples && pattern.examples.length > 0) {
    return pattern.examples[0].english
  }
  return pattern.title
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8 animate-fade-in">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">학습하기</h1>
      <p class="text-sm sm:text-base text-gray-500 mt-1">레벨을 선택하고 원하는 카테고리를 학습하세요</p>
    </div>

    <!-- 레벨 필터 탭 -->
    <div class="mb-6 animate-fade-in">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in levelTabs"
          :key="tab.key"
          @click="selectedLevel = tab.key"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="selectedLevel === tab.key
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ tab.label }}
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-2.5">
        총 <strong class="text-gray-600">{{ filteredPatternCount }}</strong>개 패턴
        <span v-if="selectedLevel !== 'all'" class="ml-1">· {{ selectedLevel }} 레벨</span>
      </p>
    </div>

    <!-- 로딩 -->
    <div v-if="lessons.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      <div v-for="i in 8" :key="'skeleton-' + i" class="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
        <div class="w-10 h-10 bg-gray-100 rounded-lg mb-3"></div>
        <div class="h-4 bg-gray-100 rounded w-20 mb-1.5"></div>
        <div class="h-3 bg-gray-100 rounded w-12"></div>
      </div>
    </div>

    <!-- 카테고리 카드 그리드 -->
    <div v-if="!lessons.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      <div
        v-for="(category, catIdx) in filteredCategories"
        :key="category.id"
        class="animate-slide-up"
      >
        <button
          @click="toggleCategory(category.id)"
          class="w-full text-left group"
        >
          <div
            class="relative overflow-hidden rounded-xl p-4 sm:p-5 transition-colors cursor-pointer"
            :class="expandedCategory === category.id
              ? 'bg-indigo-50 border border-indigo-500'
              : 'bg-white border border-gray-200 hover:border-indigo-300'"
          >
            <!-- Icon -->
            <div class="text-2xl sm:text-3xl mb-2.5">{{ category.icon }}</div>

            <!-- Name -->
            <h2 class="text-sm sm:text-base font-bold text-gray-900 leading-tight">{{ category.name }}</h2>

            <!-- Count + Progress -->
            <div class="flex items-center justify-between mt-2">
              <span class="text-[11px] text-gray-400">{{ category.patterns.length }}개</span>
              <span v-if="getCategoryProgress(category) > 0" class="text-[11px] font-medium text-indigo-500">
                {{ getCategoryProgress(category) }}%
              </span>
            </div>

            <!-- Mini progress bar -->
            <div class="mt-1.5 bg-gray-100 rounded-full h-1 overflow-hidden">
              <div
                class="h-full rounded-full bg-indigo-500 transition-all duration-500"
                :style="{ width: getCategoryProgress(category) + '%' }"
              ></div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- 선택된 카테고리의 패턴 목록 -->
    <Transition name="page">
      <div v-if="expandedCategory" class="mb-8 animate-fade-in">
        <div v-for="category in filteredCategories.filter(c => c.id === expandedCategory)" :key="category.id">
          <!-- 카테고리 헤더 -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">{{ category.icon }}</span>
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ category.name }}</h2>
                <p class="text-xs text-gray-400">{{ category.patterns.length }}개 패턴</p>
              </div>
            </div>
            <button @click="expandedCategory = null" class="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              접기
            </button>
          </div>

          <!-- 패턴 카드 그리드 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <RouterLink
              v-for="(pattern, idx) in category.patterns"
              :key="pattern.id || idx"
              :to="`/learn/${pattern.id || pattern.difficultyOrder}`"
              class="group block"
            >
              <div class="bg-white rounded-lg p-3.5 sm:p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <!-- 패턴 제목 (한국어 설명) -->
                    <h3 class="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {{ pattern.description }}
                    </h3>
                    <!-- 영어 미리보기 -->
                    <p class="text-xs text-gray-500 mt-1 truncate italic">
                      "{{ getPatternPreview(pattern) }}"
                    </p>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0 mt-0.5">
                    <!-- CEFR 뱃지 -->
                    <span :class="['text-[10px] px-2 py-0.5 rounded-md font-bold', getCefrBg(pattern.cefrLevel)]">
                      {{ pattern.cefrLevel }}
                    </span>
                    <!-- 학습 완료 체크 -->
                    <span v-if="progress.isLearned(pattern.id)" class="text-emerald-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                </div>
                <!-- 예문 수 + 화살표 -->
                <div class="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                  <span class="text-[10px] text-gray-400">예문 {{ pattern.examples.length }}개</span>
                  <svg class="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
