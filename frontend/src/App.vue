<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

function toggleMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMenu() {
  mobileMenuOpen.value = false
}

const navLinks = [
  { to: '/', label: '홈', icon: 'home' },
  { to: '/learn', label: '학습', icon: 'learn' },
  { to: '/review', label: '복습', icon: 'review' },
  { to: '/stats', label: '통계', icon: 'stats' },
]

const isActive = (to) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen bg-white overflow-x-hidden">
    <!-- 상단 네비게이션 바 (데스크톱) -->
    <nav class="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- 로고 -->
          <RouterLink to="/" class="flex items-center gap-2" @click="closeMenu">
            <span class="text-xl font-bold text-gray-900">RealLang</span>
          </RouterLink>

          <!-- 데스크톱 네비게이션 -->
          <div class="flex items-center gap-6">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="relative flex items-center gap-1.5 px-1 py-5 text-sm font-medium transition-colors"
              :class="isActive(link.to)
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'"
            >
              <!-- Nav Icons -->
              <svg v-if="link.icon === 'home'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <svg v-if="link.icon === 'learn'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <svg v-if="link.icon === 'review'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-if="link.icon === 'stats'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>{{ link.label }}</span>
            </RouterLink>
          </div>

          <!-- 사용자 정보 (데스크톱) -->
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">안녕하세요, 학습자님</span>
            <div class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
              <span class="text-sm text-gray-600 font-semibold">학</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 모바일 상단 바 -->
    <div class="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="flex justify-between items-center h-14 px-4">
        <RouterLink to="/" class="flex items-center">
          <span class="text-lg font-bold text-gray-900">RealLang</span>
        </RouterLink>
        <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <span class="text-xs text-gray-600 font-semibold">학</span>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="pb-28 md:pb-8">
      <Transition name="page" mode="out-in">
        <RouterView :key="route.path" />
      </Transition>
    </main>

    <!-- 모바일 하단 탭 바 -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-gray-200 bottom-tab-bar">
      <div class="flex justify-around items-center px-1 pt-2 pb-2">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex flex-col items-center gap-0.5 min-w-[48px] min-h-[48px] justify-center px-3 py-1 transition-colors"
          :class="isActive(link.to)
            ? 'text-indigo-600'
            : 'text-gray-400'"
          @click="closeMenu"
        >
          <!-- Tab Icons -->
          <svg v-if="link.icon === 'home'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive(link.to) ? 2.5 : 1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <svg v-if="link.icon === 'learn'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive(link.to) ? 2.5 : 1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <svg v-if="link.icon === 'review'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive(link.to) ? 2.5 : 1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-if="link.icon === 'stats'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" :stroke-width="isActive(link.to) ? 2.5 : 1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="text-[10px] font-medium" :class="isActive(link.to) ? 'text-indigo-600' : 'text-gray-400'">{{ link.label }}</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>
