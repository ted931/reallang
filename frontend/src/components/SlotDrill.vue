<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTTS } from '../composables/useTTS'

const { isSpeaking, isSupported: ttsSupported, speak, speakSlow, stop } = useTTS()

const props = defineProps({
  examples: {
    type: Array,
    required: true,
  },
  patternTemplate: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['complete'])

// 상태
const currentIndex = ref(0)
const userAnswer = ref('')
const answerState = ref('idle') // idle | correct | wrong
const correctAnswer = ref('')
const hintUsed = ref(false)
const hintText = ref('')
const results = ref([]) // { correct: boolean, answer: string, expected: string }
const sessionComplete = ref(false)
const startTime = ref(null)
const elapsedTime = ref(0)
const inputRef = ref(null)
const shakeInput = ref(false)

// 퀴즈 문제 생성
const quizItems = computed(() => {
  return props.examples.slice(0, 5).map(ex => {
    const { blank, answer } = generateBlank(ex.english || ex.sentence_en)
    return {
      original: ex.english || ex.sentence_en,
      korean: ex.korean || ex.sentence_ko,
      note: ex.note || ex.native_tip || '',
      difficulty: ex.difficulty || '',
      blanked: blank,
      answer: answer,
    }
  })
})

const totalQuestions = computed(() => quizItems.value.length)

const currentItem = computed(() => {
  if (currentIndex.value < quizItems.value.length) {
    return quizItems.value[currentIndex.value]
  }
  return null
})

const progressPercent = computed(() => {
  return Math.round((currentIndex.value / totalQuestions.value) * 100)
})

const correctCount = computed(() => {
  return results.value.filter(r => r.correct).length
})

const accuracyPercent = computed(() => {
  if (results.value.length === 0) return 0
  return Math.round((correctCount.value / results.value.length) * 100)
})

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// 핵심 단어를 추출하여 빈칸 생성
function generateBlank(sentence) {
  if (!sentence) return { blank: '___', answer: '' }

  const words = sentence.replace(/[.!?]/g, '').split(' ')

  // 패턴 템플릿에서 변수 부분을 찾아서 해당 단어를 빈칸으로 만들기
  // 기본 전략: 문장의 핵심 동사/명사를 찾아서 빈칸으로 만들기
  // 일반적인 기능어(관사, 전치사 등)를 제외하고 의미 있는 단어 선택
  const functionWords = new Set([
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'my', 'your', 'his', 'her', 'our', 'their',
    'a', 'an', 'the', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might',
    'have', 'has', 'had', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by',
    'from', 'that', 'this', 'not', 'but', 'and', 'or', 'if', 'so', 'no', 'yes',
  ])

  // 의미 있는 단어들 (2글자 이상, 기능어 아닌 것) 중 하나를 선택
  const candidates = words.filter(w => w.length > 2 && !functionWords.has(w.toLowerCase()))

  let targetWord
  if (candidates.length > 0) {
    // 문장 뒤쪽에 있는 단어를 우선 (보통 핵심 내용어가 뒤에 위치)
    targetWord = candidates[Math.floor(candidates.length / 2)]
  } else {
    // 후보가 없으면 마지막 단어 사용
    targetWord = words[words.length - 1]
  }

  // 원래 문장에서 해당 단어 위치를 찾아 빈칸으로 치환
  const originalWords = sentence.split(' ')
  const targetIndex = originalWords.findIndex(w => w.replace(/[.!?,]/g, '') === targetWord)

  if (targetIndex >= 0) {
    const blankedWords = [...originalWords]
    // 구두점 보존
    const punctuation = originalWords[targetIndex].match(/[.!?,]+$/)?.[0] || ''
    blankedWords[targetIndex] = '___' + punctuation
    return {
      blank: blankedWords.join(' '),
      answer: targetWord.toLowerCase(),
    }
  }

  // fallback: 마지막 단어를 빈칸으로
  const lastWord = originalWords[originalWords.length - 1]
  const punct = lastWord.match(/[.!?,]+$/)?.[0] || ''
  const cleanLast = lastWord.replace(/[.!?,]+$/, '')
  const blankedWords = [...originalWords]
  blankedWords[blankedWords.length - 1] = '___' + punct
  return {
    blank: blankedWords.join(' '),
    answer: cleanLast.toLowerCase(),
  }
}

// 정답 확인
function checkAnswer() {
  if (!currentItem.value || !userAnswer.value.trim()) return

  const userInput = userAnswer.value.trim().toLowerCase()
  const expected = currentItem.value.answer.toLowerCase()

  if (userInput === expected) {
    answerState.value = 'correct'
    correctAnswer.value = currentItem.value.answer
    results.value.push({
      correct: true,
      answer: userAnswer.value.trim(),
      expected: currentItem.value.answer,
    })
    setTimeout(() => {
      goNext()
    }, 1200)
  } else {
    answerState.value = 'wrong'
    correctAnswer.value = currentItem.value.answer
    shakeInput.value = true
    results.value.push({
      correct: false,
      answer: userAnswer.value.trim(),
      expected: currentItem.value.answer,
    })
    setTimeout(() => {
      shakeInput.value = false
    }, 500)
  }
}

// 다음 문제
function goNext() {
  currentIndex.value++
  userAnswer.value = ''
  answerState.value = 'idle'
  correctAnswer.value = ''
  hintUsed.value = false
  hintText.value = ''

  if (currentIndex.value >= totalQuestions.value) {
    sessionComplete.value = true
    elapsedTime.value = Math.round((Date.now() - startTime.value) / 1000)
    emit('complete', {
      correct: correctCount.value,
      total: totalQuestions.value,
      time: elapsedTime.value,
    })
  } else {
    // 다음 문제로 넘어간 뒤 input에 포커스
    setTimeout(() => {
      inputRef.value?.focus()
    }, 100)
  }
}

// 다시 시도
function retry() {
  userAnswer.value = ''
  answerState.value = 'idle'
  correctAnswer.value = ''
  setTimeout(() => {
    inputRef.value?.focus()
  }, 100)
}

// 힌트 보기 (첫 글자 공개)
function showHint() {
  if (!currentItem.value) return
  hintUsed.value = true
  const answer = currentItem.value.answer
  hintText.value = answer.charAt(0) + '_'.repeat(answer.length - 1)
}

// 엔터키로 제출
function onKeyDown(e) {
  if (e.key === 'Enter') {
    if (answerState.value === 'wrong') {
      retry()
    } else if (answerState.value === 'idle') {
      checkAnswer()
    }
  }
}

// 다시 하기
function restart() {
  currentIndex.value = 0
  userAnswer.value = ''
  answerState.value = 'idle'
  correctAnswer.value = ''
  hintUsed.value = false
  hintText.value = ''
  results.value = []
  sessionComplete.value = false
  startTime.value = Date.now()
  elapsedTime.value = 0
  setTimeout(() => {
    inputRef.value?.focus()
  }, 100)
}

// 결과 등급
const resultGrade = computed(() => {
  const pct = accuracyPercent.value
  if (pct === 100) return { label: '완벽해요!', emoji: '🏆', color: 'from-amber-400 to-yellow-500' }
  if (pct >= 80) return { label: '훌륭해요!', emoji: '🌟', color: 'from-emerald-400 to-teal-500' }
  if (pct >= 60) return { label: '잘했어요!', emoji: '👍', color: 'from-blue-400 to-indigo-500' }
  if (pct >= 40) return { label: '조금 더 연습해요!', emoji: '💪', color: 'from-orange-400 to-amber-500' }
  return { label: '다시 도전해요!', emoji: '🔄', color: 'from-rose-400 to-red-500' }
})

onMounted(() => {
  startTime.value = Date.now()
  setTimeout(() => {
    inputRef.value?.focus()
  }, 300)
})
</script>

<template>
  <div class="space-y-6">
    <!-- 결과 화면 -->
    <div v-if="sessionComplete" class="animate-scale-in">
      <div class="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 text-center">
        <!-- 등급 아이콘 -->
        <div
          class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg animate-bounce-in bg-gradient-to-br"
          :class="resultGrade.color"
        >
          <span class="text-3xl sm:text-4xl">{{ resultGrade.emoji }}</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{{ resultGrade.label }}</h2>
        <p class="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
          {{ totalQuestions }}문제 중 {{ correctCount }}개를 맞혔습니다.
        </p>

        <!-- 결과 원형 그래프 -->
        <div class="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4">
          <svg class="w-24 h-24 sm:w-28 sm:h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="6" class="text-gray-100" />
            <circle
              cx="50" cy="50" r="42" fill="none" stroke="url(#slotDrillGradient)" stroke-width="6"
              stroke-linecap="round"
              :stroke-dasharray="264"
              :stroke-dashoffset="264 * (1 - accuracyPercent / 100)"
              class="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="slotDrillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" :stop-color="accuracyPercent >= 60 ? '#10b981' : '#f59e0b'" />
                <stop offset="100%" :stop-color="accuracyPercent >= 60 ? '#06d6a0' : '#f97316'" />
              </linearGradient>
            </defs>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xl sm:text-2xl font-bold text-gray-900">{{ accuracyPercent }}%</span>
          </div>
        </div>

        <!-- 소요 시간 -->
        <div class="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>소요 시간: {{ formattedTime }}</span>
        </div>

        <!-- 문제별 결과 -->
        <div class="flex justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 flex-wrap">
          <div
            v-for="(result, i) in results"
            :key="i"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-lg transition-all"
            :class="result.correct ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'"
          >
            <svg v-if="result.correct" class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="flex justify-center">
          <button
            @click="restart"
            class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 min-h-[48px]"
          >
            다시 도전하기
          </button>
        </div>
      </div>
    </div>

    <!-- 퀴즈 진행 중 -->
    <div v-else-if="currentItem">
      <!-- 진행률 바 -->
      <div class="mb-5 animate-fade-in">
        <div class="flex justify-between text-sm text-gray-500 mb-2">
          <span class="font-medium">{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
          <span>{{ progressPercent }}%</span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            class="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full h-2 transition-all duration-500"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>

      <!-- 문제 번호 도트 인디케이터 -->
      <div class="flex gap-1.5 sm:gap-2 justify-center mb-4 sm:mb-5 flex-wrap px-4">
        <div
          v-for="i in totalQuestions"
          :key="i"
          class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300"
          :class="[
            i - 1 < currentIndex
              ? (results[i - 1]?.correct ? 'bg-emerald-400' : 'bg-red-400')
              : i - 1 === currentIndex
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 w-5 sm:w-6'
                : 'bg-gray-200'
          ]"
        ></div>
      </div>

      <!-- 퀴즈 카드 -->
      <div class="glass rounded-2xl sm:rounded-3xl overflow-hidden animate-scale-in" :key="currentIndex">
        <!-- 한글 힌트 상단 -->
        <div class="bg-gradient-to-r from-slate-800 to-slate-900 p-4 sm:p-5 md:p-6">
          <div class="flex items-center gap-2 mb-2 sm:mb-3">
            <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
            <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
            <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400"></div>
            <span class="text-[10px] sm:text-xs text-slate-400 ml-1 sm:ml-2 font-mono">quiz_{{ currentIndex + 1 }}.fill</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">다음 뜻에 맞는 영어 단어를 채우세요</p>
          <p class="text-base sm:text-lg md:text-xl font-medium text-white leading-relaxed break-words">
            <span class="text-indigo-400">"</span>{{ currentItem.korean }}<span class="text-indigo-400">"</span>
          </p>
        </div>

        <!-- 빈칸 문장 + 입력 영역 -->
        <div class="p-4 sm:p-5 md:p-6">
          <!-- 빈칸 문장 표시 -->
          <div class="mb-4 sm:mb-6">
            <p class="text-base sm:text-lg md:text-xl font-medium text-gray-900 leading-relaxed tracking-wide break-words">
              <template v-for="(part, pi) in currentItem.blanked.split('___')" :key="pi">
                <span>{{ part }}</span>
                <span
                  v-if="pi < currentItem.blanked.split('___').length - 1"
                  class="inline-block mx-0.5 sm:mx-1 min-w-[60px] sm:min-w-[80px] border-b-2 text-center align-bottom pb-0.5 transition-colors duration-300"
                  :class="{
                    'border-gray-300': answerState === 'idle',
                    'border-emerald-500 text-emerald-600': answerState === 'correct',
                    'border-red-400 text-red-500': answerState === 'wrong',
                  }"
                >
                  <span v-if="answerState === 'correct'" class="font-bold animate-bounce-in">
                    {{ currentItem.answer }}
                  </span>
                  <span v-else-if="answerState === 'wrong'" class="font-bold line-through opacity-60">
                    {{ userAnswer }}
                  </span>
                </span>
              </template>
            </p>
          </div>

          <!-- 노트 -->
          <p v-if="currentItem.note" class="text-sm text-indigo-600 bg-indigo-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ currentItem.note }}
          </p>

          <!-- 정답일 때: 체크 애니메이션 -->
          <div v-if="answerState === 'correct'" class="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 animate-slide-up">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center animate-bounce-in shadow-md shadow-emerald-200">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-bold text-emerald-700">정답이에요!</p>
              <p class="text-sm text-emerald-600">다음 문제로 넘어갑니다...</p>
            </div>
            <!-- TTS 버튼 -->
            <button
              v-if="ttsSupported"
              @click="speak(currentItem.original)"
              class="w-9 h-9 rounded-full bg-white/60 backdrop-blur border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-all shrink-0"
              :class="{ 'animate-pulse': isSpeaking }"
              title="발음 듣기"
            >
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l4.7-3.5c.7-.5 1.6-.1 1.6.8v11.8c0 .9-.9 1.3-1.6.8L6.5 15.2H4a1.5 1.5 0 01-1.5-1.5v-3.4A1.5 1.5 0 014 8.8h2.5z" />
              </svg>
            </button>
          </div>

          <!-- 오답일 때 -->
          <div v-else-if="answerState === 'wrong'" class="space-y-3 animate-slide-up">
            <div class="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-200">
              <div class="w-10 h-10 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl flex items-center justify-center shadow-md shadow-red-200">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-bold text-red-700">아쉬워요!</p>
                <p class="text-sm text-red-600">
                  정답: <span class="font-bold">{{ correctAnswer }}</span>
                </p>
              </div>
              <!-- TTS 버튼 -->
              <button
                v-if="ttsSupported"
                @click="speak(currentItem.original)"
                class="w-9 h-9 rounded-full bg-white/60 backdrop-blur border border-red-200 flex items-center justify-center hover:bg-red-100 transition-all shrink-0"
                :class="{ 'animate-pulse': isSpeaking }"
                title="발음 듣기"
              >
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l4.7-3.5c.7-.5 1.6-.1 1.6.8v11.8c0 .9-.9 1.3-1.6.8L6.5 15.2H4a1.5 1.5 0 01-1.5-1.5v-3.4A1.5 1.5 0 014 8.8h2.5z" />
                </svg>
              </button>
            </div>
            <div class="flex gap-2">
              <button
                @click="retry"
                class="flex-1 px-3 sm:px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl sm:rounded-2xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 min-h-[48px] text-sm sm:text-base"
              >
                다시 시도
              </button>
              <button
                @click="goNext"
                class="px-3 sm:px-4 py-3 glass rounded-xl sm:rounded-2xl font-medium text-gray-600 hover:bg-white/90 transition-all min-h-[48px] text-sm sm:text-base"
              >
                건너뛰기
              </button>
            </div>
          </div>

          <!-- 입력 영역 (idle 상태) -->
          <div v-else class="space-y-3">
            <!-- 힌트 표시 -->
            <div v-if="hintUsed" class="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 animate-fade-in">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>힌트: <span class="font-mono font-bold tracking-widest">{{ hintText }}</span></span>
            </div>

            <!-- 입력 필드 -->
            <div
              class="relative"
              :class="{ 'animate-shake': shakeInput }"
            >
              <input
                ref="inputRef"
                v-model="userAnswer"
                @keydown="onKeyDown"
                type="text"
                placeholder="빈칸에 들어갈 단어를 입력하세요"
                autocomplete="off"
                autocapitalize="off"
                class="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-white/60 border-2 border-gray-200 rounded-xl sm:rounded-2xl text-gray-900 font-medium placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all text-center text-base sm:text-lg tracking-wide min-h-[48px]"
              />
            </div>

            <!-- 버튼들 -->
            <div class="flex gap-2">
              <button
                @click="checkAnswer"
                :disabled="!userAnswer.trim()"
                class="flex-1 px-3 sm:px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl sm:rounded-2xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg min-h-[48px] text-sm sm:text-base"
              >
                확인하기
              </button>
              <button
                v-if="!hintUsed"
                @click="showHint"
                class="px-3 sm:px-4 py-3 glass rounded-xl sm:rounded-2xl font-medium text-amber-600 hover:bg-amber-50/60 transition-all border border-amber-200/50 flex items-center gap-1 sm:gap-1.5 min-h-[48px] text-sm sm:text-base"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                힌트
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 예문이 없을 때 -->
    <div v-else class="glass rounded-3xl p-8 text-center animate-fade-in">
      <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p class="text-gray-400">연습할 예문이 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
