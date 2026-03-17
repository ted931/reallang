import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/index.js'
import seedData from '../data/seed_patterns.json'

// ── Category icon mapping (Backend has no icon, so we map by name) ──
const CATEGORY_MAP = {
  'Greeting': { icon: '👋', ko: '인사' },
  'Daily': { icon: '💬', ko: '일상 회화' },
  'Daily Life': { icon: '💬', ko: '일상 회화' },
  'Business': { icon: '💼', ko: '비즈니스' },
  'Travel': { icon: '✈️', ko: '여행' },
  'Shopping': { icon: '🛒', ko: '쇼핑' },
  'Restaurant': { icon: '🍽️', ko: '식당' },
  'Ordering': { icon: '🍽️', ko: '주문·식당' },
  'Health': { icon: '🏥', ko: '건강' },
  'Hospital & Pharmacy': { icon: '🏥', ko: '병원·약국' },
  'Education': { icon: '📖', ko: '교육' },
  'Technology': { icon: '💻', ko: '기술' },
  'Tech': { icon: '💻', ko: '기술' },
  'Entertainment': { icon: '🎬', ko: '엔터테인먼트' },
  'Entertainment & Hobbies': { icon: '🎬', ko: '취미·여가' },
  'Phone': { icon: '📞', ko: '전화' },
  'Social': { icon: '🤝', ko: '사교' },
  'Culture': { icon: '🎭', ko: '문화' },
  'Emergency': { icon: '🚨', ko: '긴급상황' },
  'Weather': { icon: '🌤️', ko: '날씨' },
  'Weather & Seasons': { icon: '🌤️', ko: '날씨' },
  'Directions': { icon: '🧭', ko: '길찾기' },
  'Directions & Navigation': { icon: '🧭', ko: '길찾기' },
  'Complaints': { icon: '📢', ko: '불만·민원' },
  'Complaints & Problems': { icon: '📢', ko: '불만·민원' },
  'Appointments': { icon: '📅', ko: '약속·일정' },
  'Appointments & Scheduling': { icon: '📅', ko: '약속·일정' },
  'Small Talk & Socializing': { icon: '🗣️', ko: '스몰토크' },
  'Hotel & Accommodation': { icon: '🏨', ko: '숙소' },
  'Work & Office': { icon: '💼', ko: '직장' },
  'Banking & Money': { icon: '🏦', ko: '금융' },
  'Immigration & Customs': { icon: '🛂', ko: '출입국' },
  'Gym & Fitness': { icon: '💪', ko: '운동' },
  'Moving & Housing': { icon: '🏠', ko: '주거' },
  'Job Interview': { icon: '🤵', ko: '면접' },
  'Dating & Relationships': { icon: '💕', ko: '연애' },
  'Online Shopping & Delivery': { icon: '📦', ko: '온라인쇼핑' },
  'Pets & Animals': { icon: '🐾', ko: '반려동물' },
  'SNS & Technology': { icon: '📱', ko: 'SNS·기기' },
  'Cleaning & Laundry': { icon: '🧺', ko: '세탁·청소' },
  'Post Office & Shipping': { icon: '📮', ko: '우체국' },
  'Car & Driving': { icon: '🚗', ko: '자동차' },
  'Salon & Beauty': { icon: '💇', ko: '미용실' },
  'Sports & Games': { icon: '⚽', ko: '스포츠' },
  'Library & Books': { icon: '📚', ko: '도서관' },
  'Cooking & Kitchen': { icon: '🍳', ko: '요리' },
  'Photography & Art': { icon: '📷', ko: '사진·예술' },
  'Congratulations & Celebrations': { icon: '🎉', ko: '축하' },
  'Advice & Suggestions': { icon: '💡', ko: '조언' },
  'Negotiations & Bargaining': { icon: '🤝', ko: '협상' },
  'Education & Study': { icon: '📖', ko: '학습' },
}
const DEFAULT_ICON = '📚'

function getCategoryIcon(name) {
  return (CATEGORY_MAP[name] || {}).icon || DEFAULT_ICON
}

function getCategoryKoName(name) {
  return (CATEGORY_MAP[name] || {}).ko || name
}

// ── CEFR level to Korean difficulty mapping ──
function cefrToDifficulty(cefr) {
  switch (cefr) {
    case 'A1': case 'A2': return '초급'
    case 'B1': case 'B2': return '중급'
    case 'C1': case 'C2': return '고급'
    default: return '초급'
  }
}

// ── Map a single backend pattern to frontend format ──
function mapPatternFromApi(apiPattern) {
  return {
    id: apiPattern.id,
    title: apiPattern.pattern_template,
    description: apiPattern.explanation_ko,
    difficulty: cefrToDifficulty(apiPattern.cefr_level),
    cefrLevel: apiPattern.cefr_level,
    devAnalogy: apiPattern.dev_analogy,
    subcategory: apiPattern.subcategory,
    difficultyOrder: apiPattern.difficulty_order,
    examples: (apiPattern.examples || []).map(ex => ({
      english: ex.sentence_en,
      korean: ex.sentence_ko,
      note: ex.native_tip || '',
    })),
  }
}

// ── Map backend patterns list into frontend categories structure ──
function groupPatternsIntoCategories(apiPatterns) {
  const catMap = new Map()
  let catIdCounter = 1

  for (const p of apiPatterns) {
    const catName = p.category
    if (!catMap.has(catName)) {
      catMap.set(catName, {
        id: catIdCounter++,
        name: getCategoryKoName(catName),
        nameEn: catName,
        icon: getCategoryIcon(catName),
        patterns: [],
      })
    }
    catMap.get(catName).patterns.push(mapPatternFromApi(p))
  }

  return Array.from(catMap.values())
}

// ── Build fallback data from embedded seed_patterns.json ──
function buildFallbackFromSeed() {
  const patterns = seedData.patterns || []
  if (patterns.length === 0) return []
  return groupPatternsIntoCategories(patterns)
}

const FALLBACK_DATA = buildFallbackFromSeed()

export const useLessonsStore = defineStore('lessons', () => {
  // ── State ──
  const categories = ref([...FALLBACK_DATA])
  const currentPattern = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ── Computed ──
  const allPatterns = computed(() => {
    return categories.value.flatMap(cat =>
      cat.patterns.map(p => ({ ...p, categoryName: cat.name, categoryIcon: cat.icon }))
    )
  })

  const totalPatterns = computed(() => allPatterns.value.length)

  // ── API: Fetch categories with their patterns ──
  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      // Fetch all patterns (which include category info) and group them
      const response = await api.get('/lessons/')
      const apiPatterns = response.data.patterns || []
      if (apiPatterns.length > 0) {
        categories.value = groupPatternsIntoCategories(apiPatterns)
      } else {
        // API returned empty data, keep fallback
        categories.value = [...FALLBACK_DATA]
      }
    } catch (err) {
      console.warn('Failed to fetch categories from API, using fallback data:', err.message)
      error.value = err.message || 'Failed to load categories'
      // Keep existing data (fallback)
      if (categories.value.length === 0) {
        categories.value = [...FALLBACK_DATA]
      }
    } finally {
      loading.value = false
    }
  }

  // ── API: Fetch patterns optionally filtered by category ──
  async function fetchPatterns(category = null) {
    loading.value = true
    error.value = null
    try {
      const params = {}
      if (category) params.category = category
      const response = await api.get('/lessons/', { params })
      const apiPatterns = response.data.patterns || []
      if (apiPatterns.length > 0) {
        categories.value = groupPatternsIntoCategories(apiPatterns)
      }
    } catch (err) {
      // API 없이 임베디드 데이터 사용 - 에러 표시 안 함
      console.warn('Using embedded data:', err.message)
    } finally {
      loading.value = false
    }
  }

  // ── API: Fetch single pattern detail ──
  async function fetchPatternDetail(patternId) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/lessons/${patternId}`)
      const apiPattern = response.data
      if (apiPattern) {
        const mapped = mapPatternFromApi(apiPattern)
        currentPattern.value = {
          ...mapped,
          categoryName: apiPattern.category,
          categoryIcon: getCategoryIcon(apiPattern.category),
        }
        return currentPattern.value
      }
    } catch (err) {
      console.warn('Failed to fetch pattern detail from API, using local data:', err.message)
      error.value = err.message || 'Failed to load pattern detail'
      // Fallback: try to find in local data
      const localPattern = getPatternById(patternId)
      if (localPattern) {
        currentPattern.value = localPattern
      }
    } finally {
      loading.value = false
    }
    return currentPattern.value
  }

  // ── API: Fetch scenes ──
  async function fetchScenes() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/lessons/scenes')
      return response.data.scenes || []
    } catch (err) {
      console.warn('Failed to fetch scenes from API:', err.message)
      error.value = err.message || 'Failed to load scenes'
      return []
    } finally {
      loading.value = false
    }
  }

  // ── Local helpers (kept for backward compatibility) ──
  function getPatternById(id) {
    // First try matching by exact id (string comparison for API ids like "pattern-001")
    for (const cat of categories.value) {
      const pattern = cat.patterns.find(p => String(p.id) === String(id))
      if (pattern) {
        return { ...pattern, categoryName: cat.name, categoryIcon: cat.icon }
      }
    }
    // Also try numeric comparison for fallback data
    for (const cat of categories.value) {
      const pattern = cat.patterns.find(p => p.id === Number(id))
      if (pattern) {
        return { ...pattern, categoryName: cat.name, categoryIcon: cat.icon }
      }
    }
    return null
  }

  function setCurrentPattern(id) {
    currentPattern.value = getPatternById(id)
  }

  return {
    categories,
    currentPattern,
    allPatterns,
    totalPatterns,
    loading,
    error,
    getPatternById,
    setCurrentPattern,
    fetchCategories,
    fetchPatterns,
    fetchPatternDetail,
    fetchScenes,
  }
})
