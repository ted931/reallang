import { ref } from 'vue'

export function useTTS() {
  const isSpeaking = ref(false)
  const isSupported = ref('speechSynthesis' in window)

  function speak(text, lang = 'en-US', rate = 0.9) {
    if (!isSupported.value) return

    // 기존 재생 중지
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = 1

    utterance.onstart = () => { isSpeaking.value = true }
    utterance.onend = () => { isSpeaking.value = false }
    utterance.onerror = () => { isSpeaking.value = false }

    window.speechSynthesis.speak(utterance)
  }

  function stop() {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  // 느린 속도로 재생
  function speakSlow(text, lang = 'en-US') {
    speak(text, lang, 0.6)
  }

  return { isSpeaking, isSupported, speak, speakSlow, stop }
}
