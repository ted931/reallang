export async function consumeSSE(
  url: string,
  body: object,
  onChunk: (text: string) => void,
  onDone: (fullText: string) => void,
  onError: (error: string) => void
) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    onError(`API error ${response.status}: ${text}`);
    return;
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          onDone(fullText);
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            onError(parsed.error);
            return;
          }
          if (parsed.text) {
            fullText += parsed.text;
            onChunk(parsed.text);
          }
        } catch {
          // ignore malformed SSE lines
        }
      }
    }
  }
  onDone(fullText);
}

export function extractJSON(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  return text.trim();
}

export function extractCode(text: string): string {
  const fenceMatch = text.match(/```(?:tsx?|jsx?|javascript|typescript)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  return text.trim();
}

// AI 출력에서 불필요한 부분 정리
export function cleanAIOutput(text: string): string {
  // "I'm unable to..." 같은 거부 메시지 제거
  let cleaned = text.replace(/^[\s\S]*?(?=<!-- HTML -->|```html|<\!DOCTYPE|<html|<header|<div|<body)/, '');
  // 마크다운 코드 펜스 제거
  cleaned = cleaned.replace(/```html\s*/g, '').replace(/```css\s*/g, '').replace(/```javascript\s*/g, '').replace(/```js\s*/g, '').replace(/```\s*/g, '');
  // ### HTML, ### CSS 같은 마크다운 헤더를 마커로 변환
  cleaned = cleaned.replace(/###\s*HTML\s*/gi, '<!-- HTML -->\n');
  cleaned = cleaned.replace(/###\s*CSS\s*/gi, '<!-- CSS -->\n');
  cleaned = cleaned.replace(/###\s*JS\s*/gi, '<!-- JS -->\n');
  cleaned = cleaned.replace(/###\s*JavaScript\s*/gi, '<!-- JS -->\n');
  return cleaned.trim();
}

// HTML + CSS + JS 분리 추출
export function extractHtmlCssJs(text: string): { html: string; css: string; js: string } {
  let html = '';
  let css = '';
  let js = '';

  // <!-- HTML --> ... <!-- CSS --> ... <!-- JS --> 마커 기반 파싱
  const htmlMatch = text.match(/<!-- HTML -->\s*([\s\S]*?)(?=<!-- CSS -->|$)/);
  const cssMatch = text.match(/<!-- CSS -->\s*([\s\S]*?)(?=<!-- JS -->|$)/);
  const jsMatch = text.match(/<!-- JS -->\s*([\s\S]*?)$/);

  if (htmlMatch) html = htmlMatch[1].trim();
  if (cssMatch) css = cssMatch[1].trim();
  if (jsMatch) js = jsMatch[1].trim();

  // 마커가 없으면 코드 펜스에서 추출 시도
  if (!html && !css) {
    const htmlFence = text.match(/```html\s*([\s\S]*?)```/);
    const cssFence = text.match(/```css\s*([\s\S]*?)```/);
    const jsFence = text.match(/```(?:javascript|js)\s*([\s\S]*?)```/);
    if (htmlFence) html = htmlFence[1].trim();
    if (cssFence) css = cssFence[1].trim();
    if (jsFence) js = jsFence[1].trim();
  }

  // 그래도 없으면 전체를 HTML로 취급
  if (!html && !css) {
    html = text.trim();
  }

  return { html, css, js };
}
