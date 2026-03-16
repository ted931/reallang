<script setup>
import { ref, nextTick, computed } from 'vue'
import api from '../api/index.js'
import { useTTS } from '../composables/useTTS'

const { isSpeaking, isSupported: ttsSupported, speak, speakSlow, stop } = useTTS()

// AI 메시지에서 영어 부분 추출
function extractEnglish(content) {
  // 영어 문장만 추출 (한글이 포함되지 않은 줄)
  const lines = content.split('\n').filter(line => line.trim())
  const englishLines = lines.filter(line => !/[\uAC00-\uD7A3]/.test(line) && /[a-zA-Z]/.test(line))
  return englishLines.join(' ').trim()
}

const messages = ref([
  {
    role: 'assistant',
    content:
      '안녕하세요! 저는 RealLang AI 영어 대화 파트너예요. 영어로 자유롭게 대화해 보세요. 한국어로 도움이 필요하면 말씀해 주세요!\n\nHi! I\'m your RealLang AI conversation partner. Feel free to talk to me in English!',
    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    corrections: [],
    suggestions: [],
  },
])

const inputMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)
const selectedScenario = ref(null)

// Conversation history for API context (only role + content)
const conversationHistory = computed(() => {
  return messages.value
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content }))
})

const scenarios = [
  {
    id: 'cafe',
    icon: '\u2615',
    title: '\uce74\ud398 \uc8fc\ubb38',
    description: '\uc74c\ub8cc\uc640 \ub514\uc800\ud2b8\ub97c \uc8fc\ubb38\ud574\ubcf4\uc138\uc694',
    prompt: "I'd like to order a coffee, please.",
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'airport',
    icon: '\u2708\ufe0f',
    title: '\uacf5\ud56d \uccb4\ud06c\uc778',
    description: '\ube44\ud589\uae30 \ud0d1\uc2b9 \uc218\uc18d\uc744 \ud574\ubcf4\uc138\uc694',
    prompt: "Hi, I'd like to check in for my flight.",
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'interview',
    icon: '\ud83d\udcbc',
    title: '\uc601\uc5b4 \uba74\uc811',
    description: '\uc790\uae30\uc18c\uac1c\uc640 \uc9c8\ubb38\uc5d0 \ub2f5\ud574\ubcf4\uc138\uc694',
    prompt: 'Thank you for having me today.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 'shopping',
    icon: '\ud83d\uded2',
    title: '\uc1fc\ud551\ud558\uae30',
    description: '\uc637\uac00\uac8c\uc5d0\uc11c \ub300\ud654\ud574\ubcf4\uc138\uc694',
    prompt: 'Excuse me, do you have this in a different size?',
    gradient: 'from-rose-500 to-pink-500',
  },
]

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}

function selectScenario(scenario) {
  selectedScenario.value = scenario
  inputMessage.value = scenario.prompt
}

// Map frontend scenario IDs to backend scenario IDs
function getBackendScenario() {
  const id = selectedScenario.value?.id
  if (!id) return null
  // 'travel' in frontend maps to 'airport' in backend
  if (id === 'airport') return 'airport'
  return id
}

// Fallback demo responses
function getDemoResponse() {
  const responses = [
    "That's great! Your English is really improving. Let me help you with a more natural way to say that...\n\n(\uc798\ud558\uace0 \uc788\uc5b4\uc694! \uc880 \ub354 \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ud45c\ud604\uc744 \uc54c\ub824\ub4dc\ub9b4\uac8c\uc694.)",
    "Good job! Here's a tip: try using \"would\" to make your sentences sound more polite.\n\n(\uc88b\uc544\uc694! \ud301: \"would\"\ub97c \uc0ac\uc6a9\ud558\uba74 \ub354 \uacf5\uc190\ud558\uac8c \ub4e4\ub824\uc694.)",
    "Nice! You can also say it this way for a more casual tone. Keep practicing!\n\n(\uc88b\uc544\uc694! \uc880 \ub354 \uce90\uc8fc\uc5bc\ud55c \ud1a4\uc73c\ub85c\ub294 \uc774\ub807\uac8c \ub9d0\ud560 \uc218\ub3c4 \uc788\uc5b4\uc694. \uacc4\uc18d \uc5f0\uc2b5\ud574 \ubcf4\uc138\uc694!)",
  ]
  return {
    reply: responses[Math.floor(Math.random() * responses.length)],
    corrections: [],
    suggestions: [],
  }
}

async function sendMessage() {
  const text = inputMessage.value.trim()
  if (!text || isLoading.value) return

  messages.value.push({
    role: 'user',
    content: text,
    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    corrections: [],
    suggestions: [],
  })
  inputMessage.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    // Build conversation history excluding the message we just pushed
    // (the API expects history + current message separately)
    const history = messages.value
      .slice(0, -1) // exclude the just-added user message
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))

    const payload = {
      message: text,
      scenario: getBackendScenario(),
      conversation_history: history,
    }

    const { data } = await api.post('/chat/', payload, { timeout: 30000 })

    messages.value.push({
      role: 'assistant',
      content: data.reply,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      corrections: data.corrections || [],
      suggestions: data.suggestions || [],
    })
  } catch (err) {
    console.error('Chat API error:', err)
    // Fallback to demo response
    const demo = getDemoResponse()
    messages.value.push({
      role: 'assistant',
      content: demo.reply,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      corrections: demo.corrections,
      suggestions: demo.suggestions,
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

function useSuggestion(suggestion) {
  inputMessage.value = suggestion
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div class="mb-6 animate-fade-in">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">AI 대화 연습</h1>
      <p class="text-gray-500 mt-2">AI와 실전 영어 대화를 연습하세요.</p>
    </div>

    <!-- 시나리오 선택 카드 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-slide-up">
      <button
        v-for="scenario in scenarios"
        :key="scenario.id"
        @click="selectScenario(scenario)"
        :class="[
          'group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 min-h-[48px]',
          selectedScenario?.id === scenario.id
            ? 'glass-strong ring-2 ring-indigo-200 shadow-md'
            : 'glass card-hover-sm',
        ]"
      >
        <div
          :class="[
            'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl mb-2.5 shadow-md',
            scenario.gradient,
          ]"
        >
          {{ scenario.icon }}
        </div>
        <h3 class="font-semibold text-sm text-gray-900">{{ scenario.title }}</h3>
        <p class="text-[10px] text-gray-400 mt-0.5 leading-tight hidden sm:block">
          {{ scenario.description }}
        </p>
      </button>
    </div>

    <!-- 채팅 영역 -->
    <div
      class="glass rounded-3xl overflow-hidden flex flex-col animate-slide-up stagger-2"
      style="height: calc(100vh - 380px); min-height: 400px"
    >
      <!-- 메시지 목록 -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']"
          class="animate-slide-up"
        >
          <!-- AI avatar -->
          <div
            v-if="message.role === 'assistant'"
            class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 shadow-sm"
          >
            <svg
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div class="max-w-[75%]">
            <!-- 메시지 버블 -->
            <div
              :class="[
                'rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-br-lg shadow-md shadow-indigo-200/50'
                  : 'bg-white/80 text-gray-900 rounded-bl-lg shadow-sm border border-gray-100/50',
              ]"
            >
              <p class="text-sm sm:text-base whitespace-pre-line leading-relaxed">
                {{ message.content }}
              </p>
            </div>
            <div class="flex items-center gap-1.5 mt-1 px-1">
              <p
                :class="[
                  'text-[10px]',
                  message.role === 'user' ? 'text-right text-gray-400 flex-1' : 'text-gray-400',
                ]"
              >
                {{ message.time }}
              </p>
              <!-- AI 메시지에 TTS 버튼 -->
              <button
                v-if="message.role === 'assistant' && ttsSupported && extractEnglish(message.content)"
                @click="speak(extractEnglish(message.content))"
                class="w-7 h-7 rounded-full bg-white/60 backdrop-blur border border-gray-200/60 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                :class="{ 'animate-pulse': isSpeaking }"
                title="영어 발음 듣기"
              >
                <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072M6.5 8.8l4.7-3.5c.7-.5 1.6-.1 1.6.8v11.8c0 .9-.9 1.3-1.6.8L6.5 15.2H4a1.5 1.5 0 01-1.5-1.5v-3.4A1.5 1.5 0 014 8.8h2.5z" />
                </svg>
              </button>
            </div>

            <!-- 교정 카드 (assistant 메시지에만 표시) -->
            <div
              v-if="message.role === 'assistant' && message.corrections && message.corrections.length > 0"
              class="mt-2 space-y-2"
            >
              <div
                v-for="(correction, cIdx) in message.corrections"
                :key="cIdx"
                class="bg-white/90 rounded-xl border border-gray-200/60 p-3 shadow-sm"
              >
                <div class="flex items-center gap-1.5 mb-2">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="text-xs font-semibold text-gray-600">교정</span>
                </div>
                <!-- 원래 문장 (빨간 취소선) -->
                <div class="flex items-start gap-2 mb-1">
                  <span class="text-[10px] font-medium text-red-400 mt-0.5 shrink-0">Before</span>
                  <p class="text-sm text-red-500 line-through decoration-red-400/60">{{ correction.original }}</p>
                </div>
                <!-- 수정 문장 (초록) -->
                <div class="flex items-start gap-2 mb-2">
                  <span class="text-[10px] font-medium text-emerald-500 mt-0.5 shrink-0">After</span>
                  <p class="text-sm text-emerald-600 font-medium">{{ correction.corrected }}</p>
                </div>
                <!-- 설명 (한국어) -->
                <div class="bg-gray-50 rounded-lg px-3 py-2">
                  <p class="text-xs text-gray-600 leading-relaxed">{{ correction.explanation }}</p>
                </div>
              </div>
            </div>

            <!-- 제안 표현 칩 (assistant 메시지에만 표시) -->
            <div
              v-if="message.role === 'assistant' && message.suggestions && message.suggestions.length > 0"
              class="mt-2"
            >
              <p class="text-[10px] font-medium text-gray-400 mb-1.5 px-1">이렇게도 말할 수 있어요</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="(suggestion, sIdx) in message.suggestions"
                  :key="sIdx"
                  @click="useSuggestion(suggestion)"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all duration-200 cursor-pointer"
                >
                  <svg class="w-3 h-3 mr-1 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 로딩 표시 (typing indicator) -->
        <div v-if="isLoading" class="flex justify-start animate-fade-in">
          <div
            class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shrink-0 mr-2 mt-1 shadow-sm"
          >
            <svg
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="bg-white/80 rounded-2xl rounded-bl-lg px-5 py-4 shadow-sm border border-gray-100/50">
            <div class="flex gap-1.5 items-center">
              <span
                class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                style="animation-delay: 0ms"
              ></span>
              <span
                class="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                style="animation-delay: 150ms"
              ></span>
              <span
                class="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style="animation-delay: 300ms"
              ></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 입력 영역 -->
      <div class="border-t border-gray-100/50 p-4 bg-white/50">
        <div class="flex gap-2 items-end">
          <div class="flex-1 relative">
            <textarea
              v-model="inputMessage"
              @keydown="handleKeydown"
              placeholder="영어로 메시지를 입력하세요..."
              class="w-full resize-none glass rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder:text-gray-400 min-h-[48px]"
              rows="1"
            ></textarea>
          </div>
          <button
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isLoading"
            class="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl flex items-center justify-center hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200/50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
