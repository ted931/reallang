<script setup>
import { computed, onMounted } from 'vue'
import { useProgressStore } from '../stores/progress'
import { useLessonsStore } from '../stores/lessons'

const progress = useProgressStore()
const lessons = useLessonsStore()

// Fetch progress and lesson data from API on mount
onMounted(async () => {
  await Promise.all([
    progress.fetchProgress(),
    lessons.fetchCategories(),
  ])
})

const maxWeeklyCount = computed(() => {
  return Math.max(...progress.weeklyData.map(d => d.count), 1)
})

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
    <div class="mb-8 animate-fade-in">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">학습 통계</h1>
      <p class="text-gray-500 mt-2">나의 학습 현황과 성과를 한눈에 확인하세요.</p>
    </div>

    <!-- 로딩 스켈레톤 -->
    <div v-if="progress.loading || lessons.loading" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      <div v-for="i in 4" :key="'skeleton-' + i" class="glass rounded-2xl p-5 animate-pulse">
        <div class="w-12 h-12 bg-gray-200 rounded-2xl mb-3"></div>
        <div class="h-6 bg-gray-200 rounded w-16 mb-1"></div>
        <div class="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>

    <!-- 주요 지표 -->
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      <div class="glass rounded-2xl p-5 card-hover-sm animate-slide-up stagger-1">
        <div class="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-amber-200/50">
          <span class="text-xl">🔥</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ progress.streak }}일</div>
        <div class="text-sm text-gray-500">연속 학습</div>
      </div>

      <div class="glass rounded-2xl p-5 card-hover-sm animate-slide-up stagger-2">
        <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-emerald-200/50">
          <span class="text-xl">📚</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ progress.learnedPatterns.size }}</div>
        <div class="text-sm text-gray-500">학습한 패턴</div>
      </div>

      <div class="glass rounded-2xl p-5 card-hover-sm animate-slide-up stagger-3">
        <div class="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-violet-200/50">
          <span class="text-xl">🔄</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ progress.totalReviews }}</div>
        <div class="text-sm text-gray-500">총 복습 횟수</div>
      </div>

      <div class="glass rounded-2xl p-5 card-hover-sm animate-slide-up stagger-4">
        <div class="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-indigo-200/50">
          <span class="text-xl">🎯</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ progress.accuracy }}%</div>
        <div class="text-sm text-gray-500">복습 정확도</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <!-- 주간 학습량 차트 -->
      <div class="glass rounded-2xl p-6 animate-slide-up stagger-5">
        <h2 class="text-lg font-bold text-gray-900 mb-6">주간 학습량</h2>
        <div class="flex items-end justify-between gap-2 h-40">
          <div
            v-for="(day, i) in progress.weeklyData"
            :key="day.day"
            class="flex flex-col items-center flex-1"
          >
            <div class="text-xs text-gray-500 mb-1 font-medium">{{ day.count }}</div>
            <div
              class="w-full rounded-xl transition-all duration-500"
              :class="day.count > 0 ? 'bg-gradient-to-t from-indigo-500 to-violet-400 shadow-sm' : 'bg-gray-100'"
              :style="{
                height: day.count > 0 ? Math.max((day.count / maxWeeklyCount) * 120, 8) + 'px' : '8px',
                transitionDelay: (i * 80) + 'ms'
              }"
            ></div>
            <div class="text-xs text-gray-400 mt-2 font-medium">{{ day.day }}</div>
          </div>
        </div>
      </div>

      <!-- 오늘의 목표 -->
      <div class="glass rounded-2xl p-6 animate-slide-up stagger-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">오늘의 목표</h2>
        <div class="space-y-6">
          <!-- 일일 학습 목표 -->
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">일일 학습</span>
              <span class="font-medium text-gray-900">{{ progress.todayLearned }} / {{ progress.dailyGoal }}개</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                class="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full h-3 transition-all duration-700"
                :style="{ width: progress.dailyProgress + '%' }"
              ></div>
            </div>
          </div>

          <!-- 전체 학습 진도 -->
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">전체 패턴 학습 진도</span>
              <span class="font-medium text-gray-900">{{ progress.learnedPatterns.size }} / {{ lessons.totalPatterns }}개</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                class="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full h-3 transition-all duration-700"
                :style="{ width: lessons.totalPatterns > 0 ? (progress.learnedPatterns.size / lessons.totalPatterns) * 100 + '%' : '0%' }"
              ></div>
            </div>
          </div>

          <!-- 복습 정확도 -->
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">복습 정확도</span>
              <span class="font-medium text-gray-900">{{ progress.accuracy }}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                class="rounded-full h-3 transition-all duration-700"
                :class="progress.accuracy >= 80 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : progress.accuracy >= 50 ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : 'bg-gradient-to-r from-rose-400 to-red-500'"
                :style="{ width: progress.accuracy + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 카테고리별 학습 현황 -->
      <div class="glass rounded-2xl p-6 lg:col-span-2 animate-slide-up">
        <h2 class="text-lg font-bold text-gray-900 mb-4">카테고리별 현황</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="(category, catIdx) in lessons.categories"
            :key="category.id"
            class="relative overflow-hidden rounded-xl p-4 glass card-hover-sm"
          >
            <!-- Accent bar -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r" :class="categoryGradients[catIdx % categoryGradients.length]"></div>
            <div class="flex items-center gap-2 mb-3 mt-1">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg shadow-sm" :class="categoryGradients[catIdx % categoryGradients.length]">
                {{ category.icon }}
              </div>
              <span class="font-medium text-gray-900">{{ category.name }}</span>
            </div>
            <div class="text-sm text-gray-500 mb-3">
              {{ category.patterns.filter(p => progress.isLearned(p.id)).length }} / {{ category.patterns.length }}개 학습
            </div>
            <div class="flex gap-1.5">
              <div
                v-for="pattern in category.patterns"
                :key="pattern.id"
                :class="[
                  'h-2 flex-1 rounded-full transition-colors duration-500',
                  progress.isLearned(pattern.id)
                    ? 'bg-gradient-to-r ' + categoryGradients[catIdx % categoryGradients.length]
                    : 'bg-gray-200'
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
