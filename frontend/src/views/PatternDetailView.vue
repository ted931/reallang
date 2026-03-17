<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLessonsStore } from '../stores/lessons'
import { useProgressStore } from '../stores/progress'
import { useTTS } from '../composables/useTTS'
import SlotDrill from '../components/SlotDrill.vue'

const { isSpeaking, isSupported: ttsSupported, speak, speakSlow, stop } = useTTS()

const route = useRoute()
const router = useRouter()
const lessons = useLessonsStore()
const progress = useProgressStore()

// Fetch pattern detail from API on mount and when route changes
onMounted(async () => {
  const id = route.params.id
  if (id) {
    await lessons.fetchPatternDetail(id)
  }
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    currentExampleIndex.value = 0
    showStructure.value = null
    await lessons.fetchPatternDetail(newId)
  }
})

const pattern = computed(() => {
  // Prefer currentPattern from API, fallback to local lookup
  if (lessons.currentPattern) return lessons.currentPattern
  return lessons.getPatternById(route.params.id)
})

const isLearned = computed(() => {
  return pattern.value ? progress.isLearned(pattern.value.id) : false
})

const showStructure = ref(null)
const currentExampleIndex = ref(0)
const completedAnimation = ref(false)

// 탭 상태: 'examples' | 'practice'
const activeTab = ref('examples')

function markComplete() {
  if (pattern.value) {
    progress.markAsLearned(pattern.value.id)
    progress.addToReviewQueue(pattern.value)
    completedAnimation.value = true
    setTimeout(() => { completedAnimation.value = false }, 1500)
  }
}

function goBack() {
  router.push('/learn')
}

function getDifficultyLabel(difficulty) {
  switch (difficulty) {
    case '초급': return 'A1-A2'
    case '중급': return 'B1-B2'
    case '고급': return 'C1-C2'
    default: return ''
  }
}

function toggleStructure(index) {
  showStructure.value = showStructure.value === index ? null : index
}

// Break sentence into colored parts for visualization
function getSentenceParts(english) {
  const words = english.split(' ')
  const colors = [
    'bg-indigo-100 text-indigo-700 border-indigo-200',
    'bg-violet-100 text-violet-700 border-violet-200',
    'bg-amber-100 text-amber-700 border-amber-200',
    'bg-emerald-100 text-emerald-700 border-emerald-200',
    'bg-rose-100 text-rose-700 border-rose-200',
    'bg-cyan-100 text-cyan-700 border-cyan-200',
  ]
  return words.map((word, i) => ({
    word,
    color: colors[i % colors.length],
  }))
}

function prevExample() {
  if (currentExampleIndex.value > 0) currentExampleIndex.value--
}

function nextExample() {
  if (pattern.value && currentExampleIndex.value < pattern.value.examples.length - 1) {
    currentExampleIndex.value++
  }
}

function switchTab(tab) {
  activeTab.value = tab
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
    <!-- 뒤로가기 -->
    <button @click="goBack" class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4 sm:mb-6 group animate-fade-in min-h-[44px]">
      <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      학습 목록으로 돌아가기
    </button>

    <!-- 로딩 상태 -->
    <div v-if="lessons.loading" class="animate-pulse">
      <div class="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <div class="h-4 bg-gray-100 rounded w-20"></div>
          <div class="h-4 bg-gray-100 rounded w-16"></div>
        </div>
        <div class="h-8 bg-gray-100 rounded w-48 mb-2"></div>
        <div class="h-4 bg-gray-100 rounded w-full"></div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-8 h-60">
        <div class="h-full bg-gray-50 rounded-xl"></div>
      </div>
    </div>

    <div v-else-if="pattern">
      <!-- 헤더 -->
      <div class="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 animate-slide-up">
        <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm text-gray-500 mb-3 sm:mb-4">
          <span class="text-base sm:text-lg">{{ pattern.categoryIcon }}</span>
          <span class="text-xs sm:text-sm">{{ pattern.categoryName }}</span>
          <span class="text-gray-300">|</span>
          <span class="px-2 sm:px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-indigo-50 text-indigo-600">
            {{ getDifficultyLabel(pattern.difficulty) }} {{ pattern.difficulty }}
          </span>
        </div>
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">{{ pattern.title }}</h1>
        <p class="text-sm sm:text-base text-gray-500 leading-relaxed">{{ pattern.description }}</p>
      </div>

      <!-- 탭 전환 -->
      <div class="flex border-b border-gray-200 mb-4 sm:mb-6 animate-slide-up">
        <button
          @click="switchTab('examples')"
          class="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-colors min-h-[44px] border-b-2 -mb-px"
          :class="activeTab === 'examples'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          예문 보기
        </button>
        <button
          @click="switchTab('practice')"
          class="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-colors min-h-[44px] border-b-2 -mb-px"
          :class="activeTab === 'practice'
            ? 'border-indigo-600 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          연습하기
        </button>
      </div>

      <!-- 예문 보기 탭 -->
      <div v-if="activeTab === 'examples'">
        <!-- 예문 캐러셀 -->
        <div class="mb-6 sm:mb-8 animate-slide-up">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <h2 class="text-base sm:text-lg font-bold text-gray-900">예문</h2>
            <div class="flex items-center gap-2">
              <span class="text-xs sm:text-sm text-gray-400">{{ currentExampleIndex + 1 }} / {{ pattern.examples.length }}</span>
              <div class="flex gap-1">
                <button @click="prevExample" :disabled="currentExampleIndex === 0" class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button @click="nextExample" :disabled="currentExampleIndex === pattern.examples.length - 1" class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center disabled:opacity-30 hover:bg-gray-50 transition-colors">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Carousel dots -->
          <div class="flex gap-1 sm:gap-1.5 justify-center mb-3 sm:mb-4 flex-wrap px-4">
            <button
              v-for="(ex, i) in pattern.examples"
              :key="i"
              @click="currentExampleIndex = i"
              class="h-1.5 rounded-full transition-all duration-300 min-w-[6px]"
              :class="i === currentExampleIndex ? 'w-5 sm:w-6 bg-indigo-600' : 'w-1.5 bg-gray-200 hover:bg-gray-300'"
            ></button>
          </div>

          <!-- Example cards -->
          <TransitionGroup name="page">
            <div
              v-for="(example, index) in pattern.examples"
              :key="index"
              v-show="index === currentExampleIndex"
              class="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <!-- 영어 문장 -->
              <div class="p-4 sm:p-5 md:p-6">
                <p class="text-lg sm:text-xl font-medium text-gray-900 leading-relaxed break-words mb-3">
                  {{ example.english }}
                </p>
                <!-- TTS 버튼 -->
                <div v-if="ttsSupported" class="flex gap-2">
                  <button
                    @click.stop="speak(example.english)"
                    class="flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                    :class="{ 'opacity-60': isSpeaking }"
                    title="발음 듣기"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l4.7-3.5c.7-.5 1.6-.1 1.6.8v11.8c0 .9-.9 1.3-1.6.8L6.5 15.2H4a1.5 1.5 0 01-1.5-1.5v-3.4A1.5 1.5 0 014 8.8h2.5z" />
                    </svg>
                    듣기
                  </button>
                  <button
                    @click.stop="speakSlow(example.english)"
                    class="flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                    title="느리게 듣기"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M6.5 8.8l4.7-3.5c.7-.5 1.6-.1 1.6.8v11.8c0 .9-.9 1.3-1.6.8L6.5 15.2H4a1.5 1.5 0 01-1.5-1.5v-3.4A1.5 1.5 0 014 8.8h2.5z" />
                    </svg>
                    느리게
                  </button>
                </div>
              </div>

              <!-- Korean + note -->
              <div class="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 border-t border-gray-100 pt-4">
                <p class="text-gray-700 text-base sm:text-lg mb-2 sm:mb-3">{{ example.korean }}</p>
                <p v-if="example.note" class="text-xs sm:text-sm text-indigo-600 bg-indigo-50 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                  <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="break-words">{{ example.note }}</span>
                </p>

                <!-- Show Me (구조 분해 시각화) -->
                <button
                  @click="toggleStructure(index)"
                  class="mt-3 sm:mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 font-medium transition-colors group min-h-[44px]"
                >
                  <svg class="w-4 h-4 transition-transform shrink-0" :class="showStructure === index ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  문장 구조 보기
                </button>

                <Transition name="page">
                  <div v-if="showStructure === index" class="mt-2 sm:mt-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p class="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3 font-medium">문장 구조 분석</p>
                    <div class="flex flex-wrap gap-1 sm:gap-1.5">
                      <span
                        v-for="(part, pi) in getSentenceParts(example.english)"
                        :key="pi"
                        :class="['px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium border break-all', part.color]"
                      >
                        {{ part.word }}
                      </span>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- 전체 예문 목록 (compact) -->
        <div class="space-y-2 mb-6 sm:mb-8 animate-slide-up">
          <h2 class="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">전체 예문</h2>
          <div
            v-for="(example, index) in pattern.examples"
            :key="'list-' + index"
            @click="currentExampleIndex = index"
            class="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-colors"
            :class="index === currentExampleIndex ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-300'"
          >
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-xs font-bold text-white shrink-0">
                {{ index + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 text-sm truncate">{{ example.english }}</p>
                <p class="text-gray-500 text-xs mt-0.5 truncate">{{ example.korean }}</p>
              </div>
              <button
                v-if="ttsSupported"
                @click.stop="speak(example.english)"
                class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
                :class="{ 'opacity-60': isSpeaking }"
                title="발음 듣기"
              >
                <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M6.5 8.8l4.7-3.5c.7-.5 1.6-.1 1.6.8v11.8c0 .9-.9 1.3-1.6.8L6.5 15.2H4a1.5 1.5 0 01-1.5-1.5v-3.4A1.5 1.5 0 014 8.8h2.5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 연습하기 탭 -->
      <div v-if="activeTab === 'practice'" class="animate-slide-up">
        <SlotDrill
          :examples="pattern.examples"
          :patternTemplate="pattern.title"
        />
      </div>

      <!-- 학습 완료 버튼 -->
      <div class="flex justify-center px-4 animate-slide-up">
        <button
          v-if="!isLearned"
          @click="markComplete"
          class="relative w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors min-w-[200px] min-h-[48px]"
        >
          <span :class="completedAnimation ? 'opacity-0' : 'opacity-100'" class="transition-opacity">학습 완료로 표시하기</span>
          <!-- Check animation overlay -->
          <span v-if="completedAnimation" class="absolute inset-0 flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </button>
        <div v-else class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-emerald-50 text-emerald-600 rounded-lg font-medium border border-emerald-200 min-h-[48px]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          학습 완료!
        </div>
      </div>
    </div>

    <!-- 패턴을 찾을 수 없을 때 -->
    <div v-else class="text-center py-20 animate-fade-in">
      <div class="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-gray-400 text-lg mb-4">패턴을 찾을 수 없습니다.</p>
      <button @click="goBack" class="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
        학습 목록으로 돌아가기
      </button>
    </div>
  </div>
</template>
