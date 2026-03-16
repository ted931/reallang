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
const showConfetti = ref(false)

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
  // Call recordReview with patternId and score for API integration
  // The currentItem may have a patternId from the API data
  const patternId = currentItem.value?.patternId || null
  if (patternId) {
    progress.recordReview(patternId, rating)
  } else {
    // Fallback to legacy boolean-based call
    progress.recordReview(rating >= 3)
  }
  showAnswer.value = false
  isFlipped.value = false
  currentIndex.value++

  if (currentIndex.value >= reviewItems.value.length) {
    sessionComplete.value = true
    showConfetti.value = true
    setTimeout(() => { showConfetti.value = false }, 3000)
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
  // 모드 전환 시 상태 초기화
  restart()
}

function onSlotDrillComplete(result) {
  // SlotDrill 완료 시 결과를 progress store에 기록
  for (let i = 0; i < result.total; i++) {
    progress.recordReview(i < result.correct)
  }
}

const ratingButtons = [
  { rating: 1, emoji: '😰', label: '전혀 모름', color: 'from-red-400 to-rose-500', bg: 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' },
  { rating: 2, emoji: '😣', label: '어려움', color: 'from-orange-400 to-amber-500', bg: 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100' },
  { rating: 3, emoji: '🤔', label: '애매함', color: 'from-yellow-400 to-amber-400', bg: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' },
  { rating: 4, emoji: '😊', label: '기억남', color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' },
  { rating: 5, emoji: '🤩', label: '완벽!', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' },
]

// Confetti pieces
const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 1,
  duration: 2 + Math.random() * 2,
  color: ['bg-indigo-400', 'bg-violet-400', 'bg-amber-400', 'bg-emerald-400', 'bg-rose-400', 'bg-cyan-400'][Math.floor(Math.random() * 6)],
  size: 4 + Math.random() * 8,
}))
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div class="mb-6 animate-fade-in">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">복습하기</h1>
      <p class="text-gray-500 mt-2">간격 반복(SRS)으로 배운 내용을 효과적으로 기억하세요.</p>
    </div>

    <!-- 복습 모드 선택 -->
    <div class="flex gap-1 p-1 bg-gray-100/60 rounded-2xl mb-6 animate-slide-up">
      <button
        @click="switchMode('card')"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
        :class="reviewMode === 'card'
          ? 'bg-white text-indigo-600 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        카드 뒤집기
      </button>
      <button
        @click="switchMode('slot')"
        class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
        :class="reviewMode === 'slot'
          ? 'bg-white text-indigo-600 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        빈칸 채우기
      </button>
    </div>

    <!-- 빈칸 채우기 모드 -->
    <div v-if="reviewMode === 'slot'">
      <div v-if="slotDrillExamples.length > 0" class="animate-scale-in">
        <SlotDrill
          :examples="slotDrillExamples"
          patternTemplate="복습"
          @complete="onSlotDrillComplete"
        />
      </div>
      <div v-else class="glass rounded-3xl p-8 sm:p-10 text-center animate-scale-in">
        <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <span class="text-4xl">📭</span>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">복습할 항목이 없습니다</h2>
        <p class="text-gray-500 mb-6">먼저 학습을 진행해 주세요.</p>
        <RouterLink
          to="/learn"
          class="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200"
        >
          학습 시작하기
        </RouterLink>
      </div>
    </div>

    <!-- 카드 뒤집기 모드 (기존 UI) -->
    <div v-else>
      <!-- 세션 완료 -->
      <div v-if="sessionComplete" class="relative animate-scale-in">
        <!-- Confetti -->
        <div v-if="showConfetti" class="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div
            v-for="piece in confettiPieces"
            :key="piece.id"
            :class="['absolute rounded-sm', piece.color]"
            :style="{
              left: piece.left + '%',
              top: '-10px',
              width: piece.size + 'px',
              height: piece.size + 'px',
              animation: `confetti-fall ${piece.duration}s ease-in ${piece.delay}s forwards`
            }"
          ></div>
        </div>

        <div class="glass rounded-3xl p-8 sm:p-10 text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-200/50 animate-bounce-in">
            <span class="text-4xl">🎉</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">복습 완료!</h2>
          <p class="text-gray-500 mb-6">
            {{ reviewItems.length }}문제 중 {{ correctCount }}개를 맞혔습니다.
          </p>

          <!-- Result ring -->
          <div class="relative w-28 h-28 mx-auto mb-6">
            <svg class="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="6" class="text-gray-100" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="url(#resultGradient)" stroke-width="6"
                stroke-linecap="round"
                :stroke-dasharray="264"
                :stroke-dashoffset="264 * (1 - accuracyPercent / 100)"
                class="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="resultGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" :stop-color="accuracyPercent >= 60 ? '#10b981' : '#f59e0b'" />
                  <stop offset="100%" :stop-color="accuracyPercent >= 60 ? '#06d6a0' : '#f97316'" />
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-2xl font-bold text-gray-900">{{ accuracyPercent }}%</span>
            </div>
          </div>

          <!-- Result emoji summary -->
          <div class="flex justify-center gap-2 mb-8">
            <div v-for="(result, i) in sessionResults" :key="i" class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" :class="result >= 3 ? 'bg-emerald-50' : 'bg-red-50'">
              {{ ratingButtons.find(b => b.rating === result)?.emoji }}
            </div>
          </div>

          <div class="flex gap-3 justify-center">
            <button
              @click="restart"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl"
            >
              다시 복습하기
            </button>
            <RouterLink
              to="/learn"
              class="px-6 py-3 glass rounded-2xl font-medium text-gray-700 hover:bg-white/90 transition-all"
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
            <div class="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full h-2 transition-all duration-500" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>

        <!-- 3D Flip Card -->
        <div class="card-flip-container mb-6 animate-scale-in">
          <div class="card-flip-inner rounded-3xl" :class="{ 'flipped': isFlipped }" style="min-height: 320px;">
            <!-- Front (질문) -->
            <div class="card-flip-front glass rounded-3xl overflow-hidden w-full h-full">
              <!-- 카테고리 정보 -->
              <div class="px-6 py-3 border-b border-gray-100/50 flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ currentItem.categoryName }} · {{ currentItem.patternTitle }}</span>
                <span v-if="currentItem.note" class="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{{ currentItem.note }}</span>
              </div>

              <!-- 문제 -->
              <div class="p-8 sm:p-10 text-center flex flex-col items-center justify-center" style="min-height: 250px;">
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mb-5">
                  <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-sm text-gray-400 mb-3">이 표현을 영어로 말해보세요</p>
                <p class="text-xl sm:text-2xl font-medium text-gray-900 leading-relaxed">{{ currentItem.korean }}</p>
              </div>
            </div>

            <!-- Back (정답) -->
            <div class="card-flip-back glass rounded-3xl overflow-hidden w-full">
              <div class="px-6 py-3 border-b border-gray-100/50 flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ currentItem.categoryName }} · {{ currentItem.patternTitle }}</span>
                <span class="text-xs text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">정답</span>
              </div>

              <div class="p-8 sm:p-10 text-center flex flex-col items-center justify-center" style="min-height: 250px;">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-5">
                  <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p class="text-sm text-gray-400 mb-3">정답</p>
                <p class="text-xl sm:text-2xl font-medium text-indigo-600 leading-relaxed">{{ currentItem.english }}</p>
                <!-- TTS 버튼 -->
                <div v-if="ttsSupported" class="flex gap-2 mt-3 justify-center">
                  <button
                    @click.stop="speak(currentItem.english)"
                    class="w-9 h-9 rounded-full bg-white/60 backdrop-blur border border-gray-200/60 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                    :class="{ 'animate-pulse': isSpeaking }"
                    title="발음 듣기"
                  >
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l4.7-3.5c.7-.5 1.6-.1 1.6.8v11.8c0 .9-.9 1.3-1.6.8L6.5 15.2H4a1.5 1.5 0 01-1.5-1.5v-3.4A1.5 1.5 0 014 8.8h2.5z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="speakSlow(currentItem.english)"
                    class="w-9 h-9 rounded-full bg-white/60 backdrop-blur border border-gray-200/60 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-all relative"
                    title="느리게 듣기"
                  >
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M6.5 8.8l4.7-3.5c.7-.5 1.6-.1 1.6.8v11.8c0 .9-.9 1.3-1.6.8L6.5 15.2H4a1.5 1.5 0 01-1.5-1.5v-3.4A1.5 1.5 0 014 8.8h2.5z" />
                    </svg>
                    <span class="absolute text-[8px] text-indigo-400 -bottom-0.5 right-0.5 font-medium">느림</span>
                  </button>
                </div>
                <p class="text-gray-500 mt-3 text-sm">{{ currentItem.korean }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 버튼 영역 -->
        <div class="animate-slide-up stagger-2">
          <div v-if="!showAnswer" class="flex justify-center">
            <button
              @click="reveal"
              class="px-10 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 min-h-[48px]"
            >
              정답 보기
            </button>
          </div>
          <div v-else>
            <p class="text-center text-sm text-gray-400 mb-3">얼마나 잘 알고 있나요?</p>
            <div class="flex gap-2 justify-center flex-wrap">
              <button
                v-for="btn in ratingButtons"
                :key="btn.rating"
                @click="answer(btn.rating)"
                :class="['flex flex-col items-center gap-1 px-4 py-3 rounded-2xl font-medium border transition-all hover:-translate-y-0.5 active:translate-y-0 min-w-[56px] min-h-[48px]', btn.bg]"
              >
                <span class="text-xl">{{ btn.emoji }}</span>
                <span class="text-[10px]">{{ btn.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 복습할 항목이 없을 때 -->
      <div v-else class="glass rounded-3xl p-8 sm:p-10 text-center animate-scale-in">
        <div class="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <span class="text-4xl">📭</span>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">복습할 항목이 없습니다</h2>
        <p class="text-gray-500 mb-6">먼저 학습을 진행해 주세요.</p>
        <RouterLink
          to="/learn"
          class="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200"
        >
          학습 시작하기
        </RouterLink>
      </div>
    </div>
  </div>
</template>
