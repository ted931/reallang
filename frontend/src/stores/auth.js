import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    id: 1,
    name: '학습자',
    email: 'learner@reallang.kr',
    level: '중급',
    joinDate: '2025-01-15',
  })

  const token = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  function login(email, password) {
    // TODO: 실제 API 연동
    user.value = {
      id: 1,
      name: '학습자',
      email,
      level: '중급',
      joinDate: '2025-01-15',
    }
    token.value = 'mock-token'
  }

  function logout() {
    user.value = null
    token.value = null
  }

  function updateProfile(data) {
    if (user.value) {
      user.value = { ...user.value, ...data }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateProfile,
  }
})
