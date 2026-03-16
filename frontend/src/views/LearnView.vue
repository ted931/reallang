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
  { key: 'all', label: '전체', color: 'from-gray-500 to-gray-600' },
  { key: 'A1', label: 'A1 입문', color: 'from-emerald-400 to-green-500' },
  { key: 'A2', label: 'A2 초급', color: 'from-teal-400 to-cyan-500' },
  { key: 'B1', label: 'B1 중급', color: 'from-amber-400 to-orange-500' },
  { key: 'B2', label: 'B2 중상급', color: 'from-rose-400 to-red-500' },
]

// 레벨 필터링된 카테고리
const filteredCategories = computed(() => {
  if (selectedLevel.value === 'all') return lessons.categories

  return lessons.categories
    .map(cat => ({
      ...cat,
      patterns: cat.patterns.filter(p => p.cefrLevel === selectedLevel.value),
    }))
    .filter(cat => cat.patterns.length > 0)
})

// 필터된 총 패턴 수
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

function getCefrColor(cefr) {
  switch (cefr) {
    case 'A1': return 'from-emerald-400 to-green-500 text-white'
    case 'A2': return 'from-teal-400 to-cyan-500 text-white'
    case 'B1': return 'from-amber-400 to-orange-500 text-white'
    case 'B2': return 'from-rose-400 to-red-500 text-white'
    default: return 'from-gray-400 to-gray-500 text-white'
  }
}

function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case '초급': return 'from-emerald-400 to-teal-500 text-white'
    case '중급': return 'from-amber-400 to-orange-500 text-white'
    case '고급': return 'from-rose-400 to-red-500 text-white'
    default: return 'from-gray-400 to-gray-500 text-white'
  }
}

function getDifficultyLabel(difficulty) {
  switch (difficulty) {
    case '초급': return 'A1-A2'
    case '중급': return 'B1-B2'
    case '고급': return 'C1-C2'
    default: return ''
  }
}

const categoryGradients = [
  'from-indigo-500 to-violet-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-blue-500',
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8 animate-fade-in">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">학습하기</h1>
      <p class="text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">카테고리별로 영어 패턴과 표현을 학습하세요.</p>
    </div>

    <!-- 레벨 필터 탭 -->
    <div class="mb-6 animate-fade-in">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in levelTabs"
          :key="tab.key"
          @click="selectedLevel = tab.key"
          class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200"
          :class="selectedLevel === tab.key
            ? `bg-gradient-to-r ${tab.color} text-white shadow-md scale-105`
            : 'bg-white/60 text-gray-500 hover:bg-white/80 border border-gray-200'"
        >
          {{ tab.label }}
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-2">
        {{ filteredPatternCount }}개 패턴
        <span v-if="selectedLevel !== 'all'"> ({{ selectedLevel }})</span>
      </p>
    </div>

    <!-- 로딩 스켈레톤 -->
    <div v-if="lessons.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
      <div v-for="i in 3" :key="'skeleton-' + i" class="glass rounded-2xl p-6 animate-pulse">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-gray-200 rounded-2xl"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div class="h-2 bg-gray-200 rounded-full"></div>
      </div>
    </div>

    <!-- 에러 메시지 (API 실패 시 안내, 폴백 데이터로 계속 동작) -->
    <div v-if="lessons.error && !lessons.loading" class="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 animate-fade-in">
      서버와의 연결에 실패했습니다. 오프라인 데이터를 사용합니다.
    </div>

    <!-- 카테고리 카드 그리드 -->
    <div v-if="!lessons.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
      <div
        v-for="(category, catIdx) in filteredCategories"
        :key="category.id"
        class="animate-slide-up"
        :class="'stagger-' + (catIdx + 1)"
      >
        <button
          @click="toggleCategory(category.id)"
          class="w-full text-left group"
        >
          <div class="relative overflow-hidden rounded-2xl p-6 card-hover-sm cursor-pointer" :class="expandedCategory === category.id ? 'glass-strong shadow-lg ring-2 ring-indigo-200' : 'glass'">
            <!-- Gradient accent bar -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="categoryGradients[catIdx % categoryGradients.length]"></div>

            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-md" :class="categoryGradients[catIdx % categoryGradients.length]">
                  {{ category.icon }}
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900">{{ category.name }}</h2>
                  <span class="text-xs text-gray-400">{{ category.patterns.length }}개 패턴</span>
                </div>
              </div>
              <svg
                class="w-5 h-5 text-gray-400 transition-transform duration-300"
                :class="expandedCategory === category.id ? 'rotate-180' : ''"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Progress bar -->
            <div class="flex items-center gap-3">
              <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r transition-all duration-500"
                  :class="categoryGradients[catIdx % categoryGradients.length]"
                  :style="{ width: getCategoryProgress(category) + '%' }"
                ></div>
              </div>
              <span class="text-xs font-medium text-gray-500">{{ getCategoryProgress(category) }}%</span>
            </div>
          </div>
        </button>

        <!-- Expanded pattern list -->
        <Transition name="page">
          <div v-if="expandedCategory === category.id" class="mt-3 space-y-2">
            <RouterLink
              v-for="(pattern, idx) in category.patterns"
              :key="pattern.id"
              :to="`/learn/${pattern.id}`"
              class="block glass rounded-xl p-3 sm:p-4 card-hover-sm group animate-slide-up min-h-[48px]"
              :class="'stagger-' + (idx + 1)"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div class="flex items-center shrink-0">
                    <span v-if="progress.isLearned(pattern.id)" class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span v-else class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-sm sm:text-base text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{{ pattern.title }}</h3>
                    <p class="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">{{ pattern.description }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-1 sm:gap-2 shrink-0">
                  <!-- CEFR level badge -->
                  <span v-if="pattern.cefrLevel" :class="['text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold bg-gradient-to-r', getCefrColor(pattern.cefrLevel)]">
                    {{ pattern.cefrLevel }}
                  </span>
                  <span :class="['text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium bg-gradient-to-r', getDifficultyColor(pattern.difficulty)]">
                    {{ pattern.difficulty }}
                  </span>
                  <svg class="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div class="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-400 pl-8 sm:pl-9">예문 {{ pattern.examples.length }}개</div>
            </RouterLink>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
