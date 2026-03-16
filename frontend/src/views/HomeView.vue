<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { useLessonsStore } from '../stores/lessons'

const progress = useProgressStore()
const lessons = useLessonsStore()

// Fetch data on mount
onMounted(async () => {
  await lessons.fetchCategories()
})

// Typing animation
const typingPhrases = [
  'How are you doing today?',
  'Let\'s get started!',
  'Could you elaborate on that?',
  'I really appreciate it.',
  'Long time no see!',
]
const currentPhrase = ref('')
const phraseIndex = ref(0)
const charIndex = ref(0)
const isDeleting = ref(false)
let typingTimer = null

function typeEffect() {
  const phrase = typingPhrases[phraseIndex.value]

  if (!isDeleting.value) {
    currentPhrase.value = phrase.slice(0, charIndex.value + 1)
    charIndex.value++
    if (charIndex.value >= phrase.length) {
      isDeleting.value = true
      typingTimer = setTimeout(typeEffect, 2000)
      return
    }
    typingTimer = setTimeout(typeEffect, 60)
  } else {
    currentPhrase.value = phrase.slice(0, charIndex.value - 1)
    charIndex.value--
    if (charIndex.value <= 0) {
      isDeleting.value = false
      phraseIndex.value = (phraseIndex.value + 1) % typingPhrases.length
      typingTimer = setTimeout(typeEffect, 400)
      return
    }
    typingTimer = setTimeout(typeEffect, 30)
  }
}

onMounted(() => {
  typeEffect()
})

onUnmounted(() => {
  clearTimeout(typingTimer)
})

// Progress ring calculation
const progressCircumference = 2 * Math.PI * 45
const progressOffset = computed(() => {
  const pct = progress.dailyProgress / 100
  return progressCircumference * (1 - pct)
})

const quickActions = [
  { to: '/learn', icon: '📚', title: '학습 시작', description: '새로운 패턴과 표현을 배워보세요', gradient: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50' },
  { to: '/review', icon: '🔄', title: '복습하기', description: '배운 내용을 복습해서 기억을 강화하세요', gradient: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50' },
  { to: '/chat', icon: '💬', title: 'AI 대화', description: 'AI와 실전 영어 대화를 연습하세요', gradient: 'from-violet-500 to-purple-400', bg: 'bg-violet-50' },
  { to: '/stats', icon: '📊', title: '학습 통계', description: '나의 학습 진도와 성과를 확인하세요', gradient: 'from-amber-500 to-orange-400', bg: 'bg-amber-50' },
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- 히어로 섹션 -->
    <div class="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white mb-8 animate-fade-in">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
      <div class="absolute top-1/2 right-1/4 w-3 h-3 bg-amber-300 rounded-full animate-float opacity-60"></div>
      <div class="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-300 rounded-full animate-float opacity-40" style="animation-delay: 1s"></div>

      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-2xl">👋</span>
          <span class="text-indigo-200 text-sm font-medium">안녕하세요, 학습자님!</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
          오늘도 영어 실력을<br class="sm:hidden" /> 키워봐요
        </h1>
        <!-- Typing animation -->
        <div class="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 inline-block">
          <p class="text-sm text-indigo-200 mb-1">오늘의 표현</p>
          <p class="text-lg sm:text-xl font-medium min-h-[1.75rem]">
            {{ currentPhrase }}<span class="inline-block w-0.5 h-5 bg-white/80 ml-0.5 align-middle" style="animation: typing-cursor 1s infinite"></span>
          </p>
        </div>
      </div>
    </div>

    <!-- 오늘의 학습 요약 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      <!-- 스켈레톤 로딩 상태 -->
      <template v-if="lessons.loading">
        <div v-for="i in 4" :key="'skeleton-' + i" class="glass rounded-2xl p-5 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gray-200 rounded-2xl"></div>
            <div class="flex-1">
              <div class="h-3 bg-gray-200 rounded w-16 mb-2"></div>
              <div class="h-5 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <!-- 프로그레스 링 카드 -->
        <div class="glass rounded-2xl p-5 card-hover-sm animate-slide-up stagger-1">
          <div class="flex items-center gap-4">
            <div class="relative w-16 h-16 shrink-0">
              <svg class="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6" class="text-gray-100" />
                <circle
                  cx="50" cy="50" r="45" fill="none" stroke="url(#progressGradient)" stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="progressCircumference"
                  :stroke-dashoffset="progressOffset"
                  class="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#6366f1" />
                    <stop offset="100%" stop-color="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-sm font-bold text-gray-700">{{ progress.dailyProgress }}%</span>
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-0.5">오늘 학습</div>
              <div class="text-xl font-bold text-gray-900">{{ progress.todayLearned }}<span class="text-sm font-normal text-gray-400"> / {{ progress.dailyGoal }}</span></div>
            </div>
          </div>
        </div>

        <!-- 연속 학습 배지 -->
        <div class="glass rounded-2xl p-5 card-hover-sm animate-slide-up stagger-2">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md shadow-amber-200/50">
              <span class="text-xl">🔥</span>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-0.5">연속 학습</div>
              <div class="text-xl font-bold text-gray-900">{{ progress.streak }}<span class="text-sm font-normal text-gray-400">일</span></div>
            </div>
          </div>
          <div class="mt-3 flex gap-1">
            <div v-for="i in 7" :key="i" class="h-1.5 flex-1 rounded-full" :class="i <= progress.streak ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gray-100'"></div>
          </div>
        </div>

        <!-- 복습 정확도 -->
        <div class="glass rounded-2xl p-5 card-hover-sm animate-slide-up stagger-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-200/50">
              <span class="text-xl">🎯</span>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-0.5">복습 정확도</div>
              <div class="text-xl font-bold text-gray-900">{{ progress.accuracy }}<span class="text-sm font-normal text-gray-400">%</span></div>
            </div>
          </div>
          <div class="text-xs text-gray-400 mt-3">총 {{ progress.totalReviews }}회 복습</div>
        </div>

        <!-- 전체 패턴 -->
        <div class="glass rounded-2xl p-5 card-hover-sm animate-slide-up stagger-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-200/50">
              <span class="text-xl">📚</span>
            </div>
            <div>
              <div class="text-xs text-gray-500 mb-0.5">전체 패턴</div>
              <div class="text-xl font-bold text-gray-900">{{ lessons.totalPatterns }}<span class="text-sm font-normal text-gray-400">개</span></div>
            </div>
          </div>
          <div class="text-xs text-gray-400 mt-3">{{ progress.learnedPatterns.size }}개 학습 완료</div>
        </div>
      </template>
    </div>

    <!-- 빠른 실행 -->
    <h2 class="text-xl font-bold text-gray-900 mb-4 animate-fade-in">빠른 시작</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <RouterLink
        v-for="(action, index) in quickActions"
        :key="action.to"
        :to="action.to"
        class="group block glass rounded-2xl p-6 card-hover animate-slide-up"
        :class="'stagger-' + (index + 1)"
      >
        <div class="flex items-start gap-4">
          <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br shadow-lg', action.gradient]">
            <span class="drop-shadow-sm">{{ action.icon }}</span>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{{ action.title }}</h3>
            <p class="text-sm text-gray-500 mt-1 leading-relaxed">{{ action.description }}</p>
          </div>
          <svg class="w-5 h-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
