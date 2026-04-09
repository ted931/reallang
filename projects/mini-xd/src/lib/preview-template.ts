export function buildPreviewHTML(rawCode: string): string {
  // AI 출력 정리
  let code = rawCode
    .replace(/```html\s*/g, '').replace(/```\s*/g, '') // 마크다운 펜스 제거
    .trim();

  // 거부 메시지 제거 (<!DOCTYPE 전의 텍스트)
  const doctypeIdx = code.indexOf('<!DOCTYPE');
  const htmlIdx = code.indexOf('<html');
  const startIdx = doctypeIdx >= 0 ? doctypeIdx : (htmlIdx >= 0 ? htmlIdx : -1);

  if (startIdx > 0) {
    code = code.substring(startIdx);
  }

  // 이미 완전한 HTML 문서면 그대로 반환
  if (code.includes('<!DOCTYPE') || code.includes('<html')) {
    return code;
  }

  // <!-- HTML --> 마커가 있는 경우
  const htmlMatch = code.match(/<!-- HTML -->\s*([\s\S]*?)(?=<!-- CSS -->|$)/);
  const cssMatch = code.match(/<!-- CSS -->\s*([\s\S]*?)(?=<!-- JS -->|$)/);
  const jsMatch = code.match(/<!-- JS -->\s*([\s\S]*?)$/);

  if (htmlMatch) {
    const html = htmlMatch[1].trim();
    const css = cssMatch?.[1]?.trim() || '';
    const js = jsMatch?.[1]?.trim() || '';
    const hasSwiper = html.includes('swiper') || js.includes('Swiper');

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></${'script'}>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  ${hasSwiper ? '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />' : ''}
  <style>body { font-family: 'Noto Sans KR', sans-serif; margin: 0; } ${css}</style>
</head>
<body>
${html}
${hasSwiper ? '<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></' + 'script>' : ''}
<script>${js}</${'script'}>
</body>
</html>`;
  }

  // 그 외: body 내용만 있는 경우 Tailwind 감싸기
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></${'script'}>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>body { font-family: 'Noto Sans KR', sans-serif; margin: 0; }</style>
</head>
<body>
${code}
</body>
</html>`;
}
