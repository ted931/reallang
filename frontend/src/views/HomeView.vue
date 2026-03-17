<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { useLessonsStore } from '../stores/lessons'

const progress = useProgressStore()
const lessons = useLessonsStore()

// Fetch data on mount
onMounted(async () => {
  await lessons.fetchCategories()
})

// Progress ring calculation
const progressCircumference = 2 * Math.PI * 45
const progressOffset = computed(() => {
  const pct = progress.dailyProgress / 100
  return progressCircumference * (1 - pct)
})

const quickActions = [
  { to: '/learn', icon: '📚', title: '학습 시작', description: '새로운 패턴과 표현을 배워보세요' },
  { to: '/review', icon: '🔄', title: '복습하기', description: '배운 내용을 복습해서 기억을 강화하세요' },
  { to: '/stats', icon: '📊', title: '학습 통계', description: '나의 학습 진도와 성과를 확인하세요' },
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <!-- 히어로 섹션 (간결한 인사) -->
    <div class="mb-6 sm:mb-8 animate-fade-in">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xl sm:text-2xl">👋</span>
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">안녕하세요, 학습자님</h1>
      </div>
      <p class="text-sm sm:text-base text-gray-500">오늘도 영어 실력을 키워봐요</p>
    </div>

    <!-- 오늘의 학습 요약 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
      <!-- 스켈레톤 로딩 상태 -->
      <template v-if="lessons.loading">
        <div v-for="i in 4" :key="'skeleton-' + i" class="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 animate-pulse">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg"></div>
            <div class="flex-1 min-w-0">
              <div class="h-3 bg-gray-100 rounded w-12 sm:w-16 mb-2"></div>
              <div class="h-5 bg-gray-100 rounded w-10 sm:w-12"></div>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <!-- 프로그레스 링 카드 -->
        <div class="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 animate-slide-up">
          <div class="flex items-center gap-2 sm:gap-4">
            <div class="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
              <svg class="w-12 h-12 sm:w-16 sm:h-16 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="6" class="text-gray-100" />
                <circle
                  cx="50" cy="50" r="45" fill="none" stroke="#4f46e5" stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="progressCircumference"
                  :stroke-dashoffset="progressOffset"
                  class="transition-all duration-700"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs sm:text-sm font-bold text-gray-700">{{ progress.dailyProgress }}%</span>
              </div>
            </div>
            <div class="min-w-0">
              <div class="text-[10px] sm:text-xs text-gray-500 mb-0.5">오늘 학습</div>
              <div class="text-base sm:text-xl font-bold text-gray-900">{{ progress.todayLearned }}<span class="text-xs sm:text-sm font-normal text-gray-400"> / {{ progress.dailyGoal }}</span></div>
            </div>
          </div>
        </div>

        <!-- 연속 학습 배지 -->
        <div class="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 animate-slide-up">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
              <span class="text-lg sm:text-xl">🔥</span>
            </div>
            <div class="min-w-0">
              <div class="text-[10px] sm:text-xs text-gray-500 mb-0.5">연속 학습</div>
              <div class="text-base sm:text-xl font-bold text-gray-900">{{ progress.streak }}<span class="text-xs sm:text-sm font-normal text-gray-400">일</span></div>
            </div>
          </div>
          <div class="mt-2 sm:mt-3 flex gap-0.5 sm:gap-1">
            <div v-for="i in 7" :key="i" class="h-1 sm:h-1.5 flex-1 rounded-full" :class="i <= progress.streak ? 'bg-indigo-500' : 'bg-gray-100'"></div>
          </div>
        </div>

        <!-- 복습 정확도 -->
        <div class="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 animate-slide-up">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
              <span class="text-lg sm:text-xl">🎯</span>
            </div>
            <div class="min-w-0">
              <div class="text-[10px] sm:text-xs text-gray-500 mb-0.5">복습 정확도</div>
              <div class="text-base sm:text-xl font-bold text-gray-900">{{ progress.accuracy }}<span class="text-xs sm:text-sm font-normal text-gray-400">%</span></div>
            </div>
          </div>
          <div class="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3">총 {{ progress.totalReviews }}회 복습</div>
        </div>

        <!-- 전체 패턴 -->
        <div class="bg-white border border-gray-200 rounded-xl p-3 sm:p-5 animate-slide-up">
          <div class="flex items-center gap-2 sm:gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
              <span class="text-lg sm:text-xl">📚</span>
            </div>
            <div class="min-w-0">
              <div class="text-[10px] sm:text-xs text-gray-500 mb-0.5">전체 패턴</div>
              <div class="text-base sm:text-xl font-bold text-gray-900">{{ lessons.totalPatterns }}<span class="text-xs sm:text-sm font-normal text-gray-400">개</span></div>
            </div>
          </div>
          <div class="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3">{{ progress.learnedPatterns.size }}개 학습 완료</div>
        </div>
      </template>
    </div>

    <!-- 빠른 실행 -->
    <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 animate-fade-in">빠른 시작</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <RouterLink
        v-for="action in quickActions"
        :key="action.to"
        :to="action.to"
        class="group block bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-indigo-300 transition-colors animate-slide-up min-h-[56px]"
      >
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-11 h-11 sm:w-14 sm:h-14 bg-gray-50 rounded-lg flex items-center justify-center text-xl sm:text-2xl shrink-0">
            {{ action.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-indigo-600 transition-colors">{{ action.title }}</h3>
            <p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-relaxed line-clamp-2">{{ action.description }}</p>
          </div>
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
