import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/index.js'

// ── localStorage helpers ──
const STORAGE_KEYS = {
  LEARNED_PATTERNS: 'reallang_learned_patterns',
  REVIEW_QUEUE: 'reallang_review_queue',
  TOTAL_REVIEWS: 'reallang_total_reviews',
  CORRECT_REVIEWS: 'reallang_correct_reviews',
  TODAY_LEARNED: 'reallang_today_learned',
  STREAK: 'reallang_streak',
  WEEKLY_DATA: 'reallang_weekly_data',
  PROGRESS_DATA: 'reallang_progress_data',
  LAST_DATE: 'reallang_last_date',
}

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) return JSON.parse(stored)
  } catch (e) {
    console.warn(`Failed to load ${key} from localStorage:`, e)
  }
  return fallback
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage:`, e)
  }
}

export const useProgressStore = defineStore('progress', () => {
  // ── State (initialized from localStorage with fallbacks) ──
  const learnedPatterns = ref(new Set(loadFromStorage(STORAGE_KEYS.LEARNED_PATTERNS, [])))
  const reviewQueue = ref(loadFromStorage(STORAGE_KEYS.REVIEW_QUEUE, []))
  const dailyGoal = ref(5)
  const todayLearned = ref(loadFromStorage(STORAGE_KEYS.TODAY_LEARNED, 0))
  const streak = ref(loadFromStorage(STORAGE_KEYS.STREAK, 3))

  const totalReviews = ref(loadFromStorage(STORAGE_KEYS.TOTAL_REVIEWS, 42))
  const correctReviews = ref(loadFromStorage(STORAGE_KEYS.CORRECT_REVIEWS, 35))

  const loading = ref(false)
  const error = ref(null)

  // Reset todayLearned if the date has changed
  const lastDate = loadFromStorage(STORAGE_KEYS.LAST_DATE, null)
  const today = new Date().toISOString().slice(0, 10)
  if (lastDate && lastDate !== today) {
    todayLearned.value = 0
    saveToStorage(STORAGE_KEYS.TODAY_LEARNED, 0)
  }
  saveToStorage(STORAGE_KEYS.LAST_DATE, today)

  // ── Computed ──
  const accuracy = computed(() => {
    if (totalReviews.value === 0) return 0
    return Math.round((correctReviews.value / totalReviews.value) * 100)
  })

  const dailyProgress = computed(() => {
    return Math.min(Math.round((todayLearned.value / dailyGoal.value) * 100), 100)
  })

  const weeklyData = ref(loadFromStorage(STORAGE_KEYS.WEEKLY_DATA, [
    { day: '월', count: 8 },
    { day: '화', count: 5 },
    { day: '수', count: 12 },
    { day: '목', count: 3 },
    { day: '금', count: 7 },
    { day: '토', count: 10 },
    { day: '일', count: 0 },
  ]))

  // ── Persist helpers ──
  function persistState() {
    saveToStorage(STORAGE_KEYS.LEARNED_PATTERNS, Array.from(learnedPatterns.value))
    saveToStorage(STORAGE_KEYS.REVIEW_QUEUE, reviewQueue.value)
    saveToStorage(STORAGE_KEYS.TOTAL_REVIEWS, totalReviews.value)
    saveToStorage(STORAGE_KEYS.CORRECT_REVIEWS, correctReviews.value)
    saveToStorage(STORAGE_KEYS.TODAY_LEARNED, todayLearned.value)
    saveToStorage(STORAGE_KEYS.STREAK, streak.value)
    saveToStorage(STORAGE_KEYS.WEEKLY_DATA, weeklyData.value)
  }

  // ── Local actions ──
  function markAsLearned(patternId) {
    learnedPatterns.value.add(patternId)
    todayLearned.value++
    persistState()
  }

  function addToReviewQueue(item) {
    reviewQueue.value.push({
      ...item,
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
    })
    persistState()
  }

  function isLearned(patternId) {
    return learnedPatterns.value.has(patternId)
  }

  // ── API: Record a review (POST /progress/review) ──
  async function recordReview(patternIdOrCorrect, score = null) {
    // Support both old signature recordReview(correct: boolean) and
    // new signature recordReview(patternId: string, score: number)
    let correct
    let patternId = null

    if (score !== null) {
      // New API-style call: recordReview(patternId, score)
      patternId = patternIdOrCorrect
      correct = score >= 3
    } else {
      // Legacy call: recordReview(correct: boolean)
      correct = patternIdOrCorrect
    }

    // Update local state immediately (optimistic update)
    totalReviews.value++
    if (correct) correctReviews.value++
    persistState()

    // If we have a patternId, also call the backend API
    if (patternId) {
      try {
        await api.post('/progress/review', {
          pattern_id: String(patternId),
          score: score,
        })
      } catch (err) {
        console.warn('Failed to record review to API, local state updated:', err.message)
        // Local state already updated, so the app still works
      }
    }
  }

  // ── API: Fetch today's due reviews (GET /progress/today) ──
  async function fetchTodayReviews() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/progress/today')
      const data = response.data
      return {
        dueCount: data.due_count || 0,
        patterns: data.patterns || [],
      }
    } catch (err) {
      console.warn('Failed to fetch today reviews from API:', err.message)
      error.value = err.message || 'Failed to fetch today reviews'
      return { dueCount: 0, patterns: [] }
    } finally {
      loading.value = false
    }
  }

  // ── API: Fetch all progress data (GET /progress/) ──
  async function fetchProgress() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/progress/')
      const progressList = response.data.progress || []

      // Cache in localStorage
      saveToStorage(STORAGE_KEYS.PROGRESS_DATA, progressList)

      // Update local state from API data
      if (progressList.length > 0) {
        // Count total and correct reviews from progress data
        let apiTotal = 0
        let apiCorrect = 0
        const learnedIds = []

        for (const p of progressList) {
          apiTotal += p.repetitions || 0
          if (p.last_score >= 3) apiCorrect += (p.repetitions || 0)
          learnedIds.push(p.pattern_id)
        }

        // Only override if API has data
        if (apiTotal > 0) {
          totalReviews.value = apiTotal
          correctReviews.value = apiCorrect
        }

        // Mark patterns as learned
        for (const id of learnedIds) {
          learnedPatterns.value.add(id)
        }

        persistState()
      }

      return progressList
    } catch (err) {
      console.warn('Failed to fetch progress from API, using local data:', err.message)
      error.value = err.message || 'Failed to fetch progress'
      // Return cached data from localStorage
      return loadFromStorage(STORAGE_KEYS.PROGRESS_DATA, [])
    } finally {
      loading.value = false
    }
  }

  return {
    learnedPatterns,
    reviewQueue,
    dailyGoal,
    todayLearned,
    streak,
    totalReviews,
    correctReviews,
    accuracy,
    dailyProgress,
    weeklyData,
    loading,
    error,
    markAsLearned,
    addToReviewQueue,
    recordReview,
    isLearned,
    fetchTodayReviews,
    fetchProgress,
  }
})
