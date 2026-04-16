/**
 * 생성된 HTML 코드를 자동 정리하는 후처리 파이프라인
 * AI 비용 없이 규칙 기반으로 동작
 */

/** 시맨틱 HTML 교정 */
function fixSemanticHTML(html: string): string {
  let result = html;

  // onclick 있는 div → button
  result = result.replace(
    /<div(\s[^>]*?)onclick/gi,
    "<button$1onclick"
  );
  result = result.replace(
    /<\/div>(\s*<!--\s*\/?\s*button\s*-->)/gi,
    "</button>$1"
  );

  // role="navigation" 있는 div → nav
  result = result.replace(
    /<div(\s[^>]*?)role=["']navigation["']/gi,
    "<nav$1"
  );
  result = result.replace(
    /<\/div>(\s*<!--\s*\/?\s*nav(igation)?\s*-->)/gi,
    "</nav>$1"
  );

  // role="banner" 있는 div → header
  result = result.replace(
    /<div(\s[^>]*?)role=["']banner["']/gi,
    "<header$1"
  );

  // role="contentinfo" 있는 div → footer
  result = result.replace(
    /<div(\s[^>]*?)role=["']contentinfo["']/gi,
    "<footer$1"
  );

  return result;
}

/** 접근성 자동 보완 */
function fixAccessibility(html: string): string {
  let result = html;

  // alt 속성 없는 img 태그에 alt="" 추가 (빈 값이라도 있어야 함)
  result = result.replace(
    /<img(?![^>]*alt=)([^>]*?)(\s*\/?>)/gi,
    '<img$1 alt=""$2'
  );

  // lang 속성 없는 html 태그에 ko 추가
  result = result.replace(
    /<html(?![^>]*lang=)([^>]*?)>/gi,
    '<html$1 lang="ko">'
  );

  // main 태그에 id 없으면 추가 (skip-nav 연동)
  result = result.replace(
    /<main(?![^>]*id=)([^>]*?)>/gi,
    '<main$1 id="main">'
  );

  // button에 type 없으면 type="button" 추가
  result = result.replace(
    /<button(?![^>]*type=)([^>]*?)>/gi,
    '<button type="button"$1>'
  );

  return result;
}

/** Tailwind 클래스 정렬 (간략 버전 — 레이아웃 > 박스모델 > 타이포 > 비주얼 > 기타) */
const CLASS_ORDER: Record<string, number> = {
  // Position & Display
  relative: 0, absolute: 0, fixed: 0, sticky: 0,
  block: 1, inline: 1, flex: 1, grid: 1, hidden: 1,
  // Flex/Grid
  "flex-row": 2, "flex-col": 2, "items-": 2, "justify-": 2, "gap-": 2,
  // Sizing
  "w-": 3, "h-": 3, "min-": 3, "max-": 3,
  // Spacing
  "p-": 4, "px-": 4, "py-": 4, "pt-": 4, "pb-": 4, "pl-": 4, "pr-": 4,
  "m-": 5, "mx-": 5, "my-": 5, "mt-": 5, "mb-": 5, "ml-": 5, "mr-": 5,
  "space-": 5,
  // Typography
  "text-": 6, "font-": 6, "leading-": 6, "tracking-": 6,
  // Visual
  "bg-": 7, "border": 8, "rounded": 9, "shadow": 10, "opacity-": 10,
  // Transitions
  "transition": 11, "duration-": 11, "ease-": 11,
  // Hover/Focus
  "hover:": 12, "focus:": 12, "active:": 12,
  // Responsive
  "sm:": 13, "md:": 13, "lg:": 13, "xl:": 13,
};

function getClassOrder(cls: string): number {
  for (const [prefix, order] of Object.entries(CLASS_ORDER)) {
    if (cls.startsWith(prefix) || cls === prefix) return order;
  }
  return 50; // 기본값: 뒤쪽 배치
}

function sortTailwindClasses(html: string): string {
  return html.replace(/class="([^"]+)"/g, (match, classes: string) => {
    const sorted = classes
      .split(/\s+/)
      .filter(Boolean)
      .sort((a, b) => getClassOrder(a) - getClassOrder(b))
      .join(" ");
    return `class="${sorted}"`;
  });
}

/** HTML 인덴트 간단 정리 */
function formatIndentation(html: string): string {
  const lines = html.split("\n");
  const result: string[] = [];
  let indent = 0;
  const INDENT = "  ";

  const selfClosing = /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i;
  const closingTag = /^<\//;
  const openingTag = /^<[a-zA-Z]/;
  const voidTag = /\/>\s*$/;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    if (closingTag.test(trimmed)) {
      indent = Math.max(0, indent - 1);
    }

    result.push(INDENT.repeat(indent) + trimmed);

    if (
      openingTag.test(trimmed) &&
      !closingTag.test(trimmed) &&
      !selfClosing.test(trimmed) &&
      !voidTag.test(trimmed) &&
      !trimmed.includes("</")
    ) {
      indent += 1;
    }
  }

  return result.join("\n");
}

/** 메인 정리 함수 — 모든 후처리를 순서대로 적용 */
export function cleanupCode(html: string): string {
  let result = html;
  result = fixSemanticHTML(result);
  result = fixAccessibility(result);
  result = sortTailwindClasses(result);
  result = formatIndentation(result);
  return result;
}
