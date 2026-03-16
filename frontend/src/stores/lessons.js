import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/index.js'

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

// ── Fallback demo data (used when API is unavailable) ──
const FALLBACK_DATA = [
  {
    id: 1,
    name: '일상 회화',
    icon: '💬',
    patterns: [
      {
        id: 101,
        title: '인사하기',
        description: '기본적인 인사 표현을 배워봅시다.',
        difficulty: '초급',
        examples: [
          { english: 'How are you doing?', korean: '어떻게 지내세요?', note: '일상적 안부 인사' },
          { english: 'Long time no see!', korean: '오랜만이에요!', note: '오래간만에 만났을 때' },
          { english: 'What have you been up to?', korean: '그동안 뭐 하고 지냈어요?', note: '근황을 물을 때' },
        ],
      },
      {
        id: 102,
        title: '감사와 사과',
        description: '감사와 사과의 다양한 표현을 알아봅시다.',
        difficulty: '초급',
        examples: [
          { english: 'I really appreciate it.', korean: '정말 감사합니다.', note: '진심 어린 감사' },
          { english: 'I\'m sorry for the trouble.', korean: '불편을 끼쳐서 죄송합니다.', note: '폐를 끼쳤을 때' },
          { english: 'Thank you for your help.', korean: '도와주셔서 감사합니다.', note: '도움에 감사할 때' },
        ],
      },
      {
        id: 103,
        title: '약속 잡기',
        description: '약속을 잡고 조율하는 표현을 배워봅시다.',
        difficulty: '중급',
        examples: [
          { english: 'Are you free this weekend?', korean: '이번 주말에 시간 있어요?', note: '약속을 제안할 때' },
          { english: 'Let\'s meet at 3 o\'clock.', korean: '3시에 만나요.', note: '시간을 정할 때' },
          { english: 'Can we reschedule?', korean: '일정을 변경할 수 있을까요?', note: '일정 변경 요청' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '비즈니스',
    icon: '💼',
    patterns: [
      {
        id: 201,
        title: '회의 표현',
        description: '비즈니스 회의에서 자주 쓰는 표현입니다.',
        difficulty: '중급',
        examples: [
          { english: 'Let\'s get started.', korean: '시작하겠습니다.', note: '회의 시작' },
          { english: 'I\'d like to add something.', korean: '한 가지 덧붙이고 싶습니다.', note: '의견 추가' },
          { english: 'Could you elaborate on that?', korean: '좀 더 자세히 설명해 주시겠어요?', note: '상세 설명 요청' },
        ],
      },
      {
        id: 202,
        title: '이메일 작성',
        description: '비즈니스 이메일에서 자주 사용하는 표현입니다.',
        difficulty: '중급',
        examples: [
          { english: 'I\'m writing to follow up on...', korean: '...에 대해 후속 연락드립니다.', note: '후속 이메일' },
          { english: 'Please find attached...', korean: '첨부 파일을 확인해 주세요.', note: '첨부 파일 안내' },
          { english: 'I look forward to hearing from you.', korean: '답변 기다리겠습니다.', note: '마무리 인사' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '여행',
    icon: '✈️',
    patterns: [
      {
        id: 301,
        title: '공항/호텔',
        description: '여행 시 공항과 호텔에서 쓰는 표현입니다.',
        difficulty: '초급',
        examples: [
          { english: 'I\'d like to check in, please.', korean: '체크인하고 싶습니다.', note: '호텔 체크인' },
          { english: 'Where is the boarding gate?', korean: '탑승구가 어디인가요?', note: '공항에서 길 찾기' },
          { english: 'Could I get a window seat?', korean: '창가 좌석으로 할 수 있을까요?', note: '좌석 요청' },
        ],
      },
      {
        id: 302,
        title: '길 묻기',
        description: '길을 물을 때 쓰는 유용한 표현입니다.',
        difficulty: '초급',
        examples: [
          { english: 'How do I get to the station?', korean: '역까지 어떻게 가나요?', note: '길 묻기' },
          { english: 'Is it within walking distance?', korean: '걸어갈 수 있는 거리인가요?', note: '거리 확인' },
          { english: 'Could you show me on the map?', korean: '지도에서 보여주시겠어요?', note: '지도로 확인' },
        ],
      },
    ],
  },
]

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
      console.warn('Failed to fetch patterns from API, using fallback data:', err.message)
      error.value = err.message || 'Failed to load patterns'
      if (categories.value.length === 0) {
        categories.value = [...FALLBACK_DATA]
      }
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
