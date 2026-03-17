<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { useLessonsStore } from '../stores/lessons'
import { useTTS } from '../composables/useTTS'
import SlotDrill from '../components/SlotDrill.vue'

const { isSpeaking, isSupported: ttsSupported, speak, speakSlow, stop } = useTTS()

const progress = useProgressStore()
const lessons = useLessonsStore()

// Fetch data on mount
onMounted(async () => {
  // Ensure patterns are loaded (needed for review items)
  if (lessons.categories.length === 0 || lessons.allPatterns.length === 0) {
    await lessons.fetchPatterns()
  }
  // Also try to load today's due reviews from API
  await progress.fetchTodayReviews()
})

// 복습 모드: 'card' (카드 뒤집기) | 'slot' (빈칸 채우기)
const reviewMode = ref('card')

const currentIndex = ref(0)
const showAnswer = ref(false)
const sessionResults = ref([])
const sessionComplete = ref(false)
const isFlipped = ref(false)

// 복습 데이터 (데모용)
const reviewItems = computed(() => {
  return lessons.allPatterns.flatMap(pattern =>
    pattern.examples.map(ex => ({
      patternId: pattern.id,
      patternTitle: pattern.title,
      categoryName: pattern.categoryName,
      english: ex.english,
      korean: ex.korean,
      note: ex.note,
    }))
  ).slice(0, 5) // 5문제씩 복습
})

// SlotDrill용 데이터
const slotDrillExamples = computed(() => {
  return reviewItems.value.map(item => ({
    english: item.english,
    korean: item.korean,
    note: item.note,
  }))
})

const currentItem = computed(() => {
  if (currentIndex.value < reviewItems.value.length) {
    return reviewItems.value[currentIndex.value]
  }
  return null
})

const progressPercent = computed(() => {
  return Math.round((currentIndex.value / reviewItems.value.length) * 100)
})

const correctCount = computed(() => {
  return sessionResults.value.filter(r => r >= 3).length
})

const accuracyPercent = computed(() => {
  if (sessionResults.value.length === 0) return 0
  return Math.round((correctCount.value / sessionResults.value.length) * 100)
})

function reveal() {
  isFlipped.value = true
  showAnswer.value = true
}

function answer(rating) {
  sessionResults.value.push(rating)
  const patternId = currentItem.value?.patternId || null
  if (patternId) {
    progress.recordReview(patternId, rating)
  } else {
    progress.recordReview(rating >= 3)
  }
  showAnswer.value = false
  isFlipped.value = false
  currentIndex.value++

  if (currentIndex.value >= reviewItems.value.length) {
    sessionComplete.value = true
  }
}

function restart() {
  currentIndex.value = 0
  showAnswer.value = false
  isFlipped.value = false
  sessionResults.value = []
  sessionComplete.value = false
}

function switchMode(mode) {
  reviewMode.value = mode
  restart()
}

function onSlotDrillComplete(result) {
  for (let i = 0; i < result.total; i++) {
    progress.recordReview(i < result.correct)
  }
}

// 3개로 축소된 평가 버튼
const ratingButtons = [
  { rating: 1, label: '모름', bg: 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' },
  { rating: 3, label: '애매함', bg: 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' },
  { rating: 5, label: '알겠음', bg: 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' },
]
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
    <div class="mb-4 sm:mb-6 animate-fade-in">
      <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">복습하기</h1>
      <p class="text-sm sm:text-base text-gray-500 mt-1.5 sm:mt-2">간격 반복(SRS)으로 배운 내용을 효과적으로 기억하세요.</p>
    </div>

    <!-- 복습 모드 선택 -->
    <div class="flex border-b border-gray-200 mb-4 sm:mb-6 animate-slide-up">
      <button
        @click="switchMode('card')"
        class="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-colors min-h-[44px] border-b-2 -mb-px"
        :class="reviewMode === 'card'
          ? 'border-indigo-600 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        카드 뒤집기
      </button>
      <button
        @click="switchMode('slot')"
        class="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 text-sm font-medium transition-colors min-h-[44px] border-b-2 -mb-px"
        :class="reviewMode === 'slot'
          ? 'border-indigo-600 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        빈칸 채우기
      </button>
    </div>

    <!-- 빈칸 채우기 모드 -->
    <div v-if="reviewMode === 'slot'">
      <div v-if="slotDrillExamples.length > 0" class="animate-fade-in">
        <SlotDrill
          :examples="slotDrillExamples"
          patternTemplate="복습"
          @complete="onSlotDrillComplete"
        />
      </div>
      <div v-else class="bg-white border border-gray-200 rounded-xl p-8 sm:p-10 text-center animate-fade-in">
        <div class="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-5">
          <span class="text-4xl">📭</span>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">복습할 항목이 없습니다</h2>
        <p class="text-gray-500 mb-6">먼저 학습을 진행해 주세요.</p>
        <RouterLink
          to="/learn"
          class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          학습 시작하기
        </RouterLink>
      </div>
    </div>

    <!-- 카드 뒤집기 모드 -->
    <div v-else>
      <!-- 세션 완료 -->
      <div v-if="sessionComplete" class="animate-fade-in">
        <div class="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 md:p-10 text-center">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">복습 완료!</h2>
          <p class="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
            {{ reviewItems.length }}문제 중 {{ correctCount }}개를 맞혔습니다.
          </p>

          <!-- Result ring -->
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6">
            <svg class="w-24 h-24 sm:w-28 sm:h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="6" class="text-gray-100" />
              <circle
                cx="50" cy="50" r="42" fill="none" :stroke="accuracyPercent >= 60 ? '#4f46e5' : '#f59e0b'" stroke-width="6"
                stroke-linecap="round"
                :stroke-dasharray="264"
                :stroke-dashoffset="264 * (1 - accuracyPercent / 100)"
                class="transition-all duration-1000"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xl sm:text-2xl font-bold text-gray-900">{{ accuracyPercent }}%</span>
            </div>
          </div>

          <!-- Result text summary -->
          <p class="text-sm text-gray-500 mb-6 sm:mb-8">정확도 {{ accuracyPercent }}%</p>

          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <button
              @click="restart"
              class="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors min-h-[48px]"
            >
              다시 복습하기
            </button>
            <RouterLink
              to="/learn"
              class="px-6 py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center min-h-[48px] flex items-center justify-center"
            >
              새로운 학습하기
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- 복습 카드 -->
      <div v-else-if="currentItem">
        <!-- 진행 표시줄 -->
        <div class="mb-6 animate-fade-in">
          <div class="flex justify-between text-sm text-gray-500 mb-2">
            <span class="font-medium">{{ currentIndex + 1 }} / {{ reviewItems.length }}</span>
            <span>{{ progressPercent }}%</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div class="bg-indigo-600 rounded-full h-2 transition-all duration-500" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>

        <!-- 3D Flip Card -->
        <div class="card-flip-container mb-4 sm:mb-6 animate-fade-in">
          <div class="card-flip-inner rounded-xl" :class="{ 'flipped': isFlipped }" style="min-height: 280px;">
            <!-- Front (질문) -->
            <div class="card-flip-front bg-white border border-gray-200 rounded-xl overflow-hidden w-full h-full">
              <!-- 카테고리 정보 -->
              <div class="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-gray-200 flex items-center justify-between gap-2">
                <span class="text-xs sm:text-sm text-gray-500 truncate">{{ currentItem.categoryName }} · {{ currentItem.patternTitle }}</span>
                <span v-if="currentItem.note" class="text-[10px] sm:text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md shrink-0">{{ currentItem.note }}</span>
              </div>

              <!-- 문제 -->
              <div class="p-5 sm:p-8 md:p-10 text-center flex flex-col items-center justify-center" style="min-height: 220px;">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-5">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">이 표현을 영어로 말해보세요</p>
                <p class="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 leading-relaxed break-words px-2">{{ currentItem.korean }}</p>
              </div>
            </div>

            <!-- Back (정답) -->
            <div class="card-flip-back bg-white border border-gray-200 rounded-xl overflow-hidden w-full">
              <div class="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-gray-200 flex items-center justify-between gap-2">
                <span class="text-xs sm:text-sm text-gray-500 truncate">{{ currentItem.categoryName }} · {{ currentItem.patternTitle }}</span>
                <span class="text-[10px] sm:text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium shrink-0">정답</span>
              </div>

              <div class="p-5 sm:p-8 md:p-10 text-center flex flex-col items-center justify-center" style="min-height: 220px;">
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-5">
                  <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p class="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">정답</p>
                <p class="text-lg sm:text-xl md:text-2xl font-medium text-indigo-600 leading-relaxed break-words px-2">{{ currentItem.english }}</p>
                <!-- TTS 버튼 -->
                <div v-if="ttsSupported" class="flex gap-2 mt-3 justify-center">
                  <button
                    @click.stop="speak(currentItem.english)"
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
                    @click.stop="speakSlow(currentItem.english)"
                    class="flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                    title="느리게 듣기"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M6.5 8.8l4.7-3.5c.7-.5 1.6-.1 1.6.8v11.8c0 .9-.9 1.3-1.6.8L6.5 15.2H4a1.5 1.5 0 01-1.5-1.5v-3.4A1.5 1.5 0 014 8.8h2.5z" />
                    </svg>
                    느리게
                  </button>
                </div>
                <p class="text-gray-500 mt-3 text-sm">{{ currentItem.korean }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 버튼 영역 -->
        <div class="animate-slide-up">
          <div v-if="!showAnswer" class="flex justify-center px-4">
            <button
              @click="reveal"
              class="w-full sm:w-auto px-10 py-3.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors min-h-[48px]"
            >
              정답 보기
            </button>
          </div>
          <div v-else>
            <p class="text-center text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">얼마나 잘 알고 있나요?</p>
            <div class="flex gap-2 sm:gap-3 justify-center px-4">
              <button
                v-for="btn in ratingButtons"
                :key="btn.rating"
                @click="answer(btn.rating)"
                :class="['flex-1 sm:flex-none flex items-center justify-center px-4 sm:px-6 py-3 rounded-lg font-medium border transition-colors min-h-[48px] text-sm', btn.bg]"
              >
                {{ btn.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 복습할 항목이 없을 때 -->
      <div v-else class="bg-white border border-gray-200 rounded-xl p-8 sm:p-10 text-center animate-fade-in">
        <div class="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-5">
          <span class="text-4xl">📭</span>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">복습할 항목이 없습니다</h2>
        <p class="text-gray-500 mb-6">먼저 학습을 진행해 주세요.</p>
        <RouterLink
          to="/learn"
          class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          학습 시작하기
        </RouterLink>
      </div>
    </div>
  </div>
</template>
