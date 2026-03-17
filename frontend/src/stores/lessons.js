import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/index.js'
import seedData from '../data/seed_patterns.json'

// ── Category icon mapping (Backend has no icon, so we map by name) ──
const CATEGORY_ICONS = {
  'Greeting': '👋',
  'Daily Life': '💬',
  'Business': '💼',
  'Travel': '✈️',
  'Shopping': '🛒',
  'Restaurant': '🍽️',
  'Health': '🏥',
  'Education': '📖',
  'Technology': '💻',
  'Entertainment': '🎬',
  'Phone': '📞',
  'Social': '🤝',
  'Tech': '💻',
  'Culture': '🎭',
  'Ordering': '🛎️',
  '일상 회화': '💬',
  '비즈니스': '💼',
  '여행': '✈️',
}
const DEFAULT_ICON = '📚'

function getCategoryIcon(name) {
  return CATEGORY_ICONS[name] || DEFAULT_ICON
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
        name: catName,
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
