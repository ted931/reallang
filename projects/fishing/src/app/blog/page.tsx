"use client";
import { useState } from "react";

type TemplateKey = "catch" | "point" | "gear" | "guide";
type FormatKey = "text" | "naver";

interface Template {
  key: TemplateKey;
  catColor: string;
  icon: string;
  title: string;
  desc: string;
}

const TEMPLATES: Template[] = [
  { key: "catch", catColor: "#f59e0b", icon: "🐟", title: "조황 후기", desc: "날씨·어종·채비 총정리" },
  { key: "point", catColor: "#86efac", icon: "📍", title: "포인트 소개", desc: "장소·물때·접근법 안내" },
  { key: "gear",  catColor: "#5fa3cf", icon: "🎣", title: "채비/장비 팁", desc: "채비·릴·낚싯대 추천" },
  { key: "guide", catColor: "#a78bfa", icon: "📚", title: "입문 가이드", desc: "초보자를 위한 단계별 안내" },
];

/* ── 필드 정의 ── */
type FieldType = "text" | "textarea" | "multiline";
interface Field { key: string; label: string; type?: FieldType; placeholder?: string; }

const FIELDS: Record<TemplateKey, Field[]> = {
  catch: [
    { key: "date",    label: "날짜",           placeholder: "예) 2026-05-10" },
    { key: "place",   label: "장소",           placeholder: "예) 서귀포 외돌개" },
    { key: "species", label: "어종",           placeholder: "예) 감성돔, 벵에돔" },
    { key: "count",   label: "마릿수",         placeholder: "예) 3" },
    { key: "size",    label: "최대 사이즈(cm)", placeholder: "예) 42" },
    { key: "weather", label: "날씨",           placeholder: "예) 맑음, 북동풍 3m/s" },
    { key: "tide",    label: "물때",           placeholder: "예) 7물" },
    { key: "bait",    label: "미끼",           placeholder: "예) 크릴, 참갯지렁이" },
    { key: "rig",     label: "채비",           placeholder: "예) 구멍찌 채비 0호" },
    { key: "tip",     label: "포인트 팁",      type: "textarea", placeholder: "예) 썰물 시간대 외돌개 북쪽 암초 근처가 핫했습니다." },
    { key: "memo",    label: "추가 메모",      type: "textarea", placeholder: "자유롭게 후기를 작성하세요." },
  ],
  point: [
    { key: "name",    label: "포인트명",       placeholder: "예) 외돌개 갯바위" },
    { key: "region",  label: "지역",           placeholder: "예) 서귀포" },
    { key: "type",    label: "포인트 유형",    placeholder: "갯바위 / 방파제 / 선상 / 좌대" },
    { key: "species", label: "추천 어종",      placeholder: "예) 감성돔, 벵에돔" },
    { key: "season",  label: "최적 시기",      placeholder: "예) 10월~3월" },
    { key: "tide",    label: "물때",           placeholder: "예) 5~8물" },
    { key: "access",  label: "접근 방법",      type: "textarea", placeholder: "예) 주차장에서 도보 10분, 조심스러운 암반 구간 있음" },
    { key: "caution", label: "주의사항",       type: "textarea", placeholder: "예) 파도 높을 때 위험, 구명조끼 필수" },
    { key: "summary", label: "총평",           type: "textarea", placeholder: "이 포인트에 대한 전체 평가를 작성하세요." },
  ],
  gear: [
    { key: "fishType", label: "낚시 종류",    placeholder: "예) 찌낚시, 루어낚시" },
    { key: "target",   label: "대상어",       placeholder: "예) 감성돔" },
    { key: "rig",      label: "추천 채비",    placeholder: "예) 구멍찌 0호, 목줄 2호" },
    { key: "reel",     label: "추천 릴/낚싯대", placeholder: "예) 시마노 BB-X 3000, 1.5호 5.3m" },
    { key: "bait",     label: "미끼",         placeholder: "예) 크릴, 참갯지렁이" },
    { key: "tips",     label: "팁 포인트",    type: "multiline", placeholder: "팁을 한 줄씩 입력하세요 (엔터로 구분)" },
    { key: "caution",  label: "주의사항",     type: "textarea", placeholder: "주의할 점을 작성하세요." },
  ],
  guide: [
    { key: "title",    label: "가이드 제목",  placeholder: "예) 제주 갯바위 찌낚시 입문 가이드" },
    { key: "audience", label: "대상 독자",    placeholder: "예) 낚시 첫 도전자, 제주 여행객" },
    { key: "content",  label: "핵심 내용",    type: "multiline", placeholder: "핵심 내용을 한 줄씩 입력하세요 (엔터로 구분)" },
    { key: "gear",     label: "추천 장비",    placeholder: "예) 입문용 세트 낚시대 + 3000번 릴" },
    { key: "caution",  label: "주의사항",     type: "textarea", placeholder: "초보자가 주의해야 할 사항을 작성하세요." },
    { key: "closing",  label: "마무리 메시지", type: "textarea", placeholder: "독자에게 전하는 따뜻한 마무리 메시지" },
  ],
};

/* ── 블로그 생성 ── */
function generateBlog(template: TemplateKey, form: Record<string, string>, format: FormatKey): string {
  if (format === "text") return generateText(template, form);
  return generateNaver(template, form);
}

function generateText(template: TemplateKey, f: Record<string, string>): string {
  switch (template) {
    case "catch":
      return `📍 ${f.place || "장소"} 조황 후기

안녕하세요, 피싱로그입니다 🎣

${f.date || "날짜"}에 ${f.place || "장소"}에서 낚시를 다녀왔습니다.

🐟 오늘의 조과
• 어종: ${f.species || "-"}
• 마릿수: ${f.count || "-"}마리
• 최대 사이즈: ${f.size || "-"}cm
• 날씨: ${f.weather || "-"}
• 물때: ${f.tide || "-"}

🎣 사용한 채비
• 미끼: ${f.bait || "-"}
• 채비: ${f.rig || "-"}

💡 포인트 팁
${f.tip || "-"}

📝 후기
${f.memo || "-"}

#낚시 #제주낚시 #${f.place || "제주"} #${f.species || "낚시"} #조황 #피싱로그`;

    case "point":
      return `📍 ${f.name || "포인트명"} 포인트 소개

안녕하세요, 피싱로그입니다 🎣

오늘은 ${f.region || ""}의 명소 <${f.name || "포인트"}>를 소개합니다.

📌 포인트 정보
• 포인트명: ${f.name || "-"}
• 지역: ${f.region || "-"}
• 유형: ${f.type || "-"}
• 추천 어종: ${f.species || "-"}
• 최적 시기: ${f.season || "-"}
• 물때: ${f.tide || "-"}

🗺 접근 방법
${f.access || "-"}

⚠️ 주의사항
${f.caution || "-"}

⭐ 총평
${f.summary || "-"}

#낚시 #제주낚시 #${f.region || "제주"} #${f.name || "포인트"} #포인트소개 #피싱로그`;

    case "gear":
      return `🎣 ${f.fishType || "낚시"} 채비/장비 팁

안녕하세요, 피싱로그입니다 🎣

${f.target || "대상어"} 낚시를 위한 채비와 장비를 소개합니다.

🎣 추천 세팅
• 낚시 종류: ${f.fishType || "-"}
• 대상어: ${f.target || "-"}
• 추천 채비: ${f.rig || "-"}
• 추천 릴/낚싯대: ${f.reel || "-"}
• 미끼: ${f.bait || "-"}

💡 팁 포인트
${(f.tips || "-").split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n")}

⚠️ 주의사항
${f.caution || "-"}

#낚시 #채비팁 #${f.target || "낚시"} #장비추천 #피싱로그`;

    case "guide":
      return `📚 ${f.title || "입문 가이드"}

안녕하세요, 피싱로그입니다 🎣

대상 독자: ${f.audience || "-"}

📋 핵심 내용
${(f.content || "-").split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n")}

🎣 추천 장비
${f.gear || "-"}

⚠️ 주의사항
${f.caution || "-"}

💬 마무리
${f.closing || "-"}

#낚시입문 #제주낚시 #낚시가이드 #피싱로그`;

    default:
      return "";
  }
}

function generateNaver(template: TemplateKey, f: Record<string, string>): string {
  switch (template) {
    case "catch":
      return `<h2 style="color:#1a6b4a;font-size:22px;font-weight:900;margin:20px 0 10px;">📍 ${f.place || "장소"} 조황 후기</h2>
<p style="color:#333;line-height:1.8;">안녕하세요, 피싱로그입니다 🎣</p>
<p style="color:#333;line-height:1.8;">${f.date || "날짜"}에 <strong>${f.place || "장소"}</strong>에서 낚시를 다녀왔습니다.</p>
<h3 style="background:#fff3cd;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">🐟 오늘의 조과</h3>
<ul style="line-height:2;color:#333;">
  <li>어종: ${f.species || "-"}</li>
  <li>마릿수: ${f.count || "-"}마리</li>
  <li>최대 사이즈: ${f.size || "-"}cm</li>
  <li>날씨: ${f.weather || "-"}</li>
  <li>물때: ${f.tide || "-"}</li>
</ul>
<h3 style="background:#e0f2fe;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">🎣 사용한 채비</h3>
<ul style="line-height:2;color:#333;">
  <li>미끼: ${f.bait || "-"}</li>
  <li>채비: ${f.rig || "-"}</li>
</ul>
<h3 style="background:#dcfce7;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">💡 포인트 팁</h3>
<p style="color:#333;line-height:1.8;">${(f.tip || "-").replace(/\n/g, "<br>")}</p>
<h3 style="background:#f3e8ff;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">📝 후기</h3>
<p style="color:#333;line-height:1.8;">${(f.memo || "-").replace(/\n/g, "<br>")}</p>
<p style="color:#888;font-size:13px;">#낚시 #제주낚시 #${f.place || "제주"} #${f.species || "낚시"} #조황 #피싱로그</p>`;

    case "point":
      return `<h2 style="color:#1a6b4a;font-size:22px;font-weight:900;margin:20px 0 10px;">📍 ${f.name || "포인트명"} 포인트 소개</h2>
<p style="color:#333;line-height:1.8;">안녕하세요, 피싱로그입니다 🎣</p>
<p style="color:#333;line-height:1.8;">오늘은 ${f.region || ""}의 명소 <strong>${f.name || "포인트"}</strong>를 소개합니다.</p>
<h3 style="background:#fff3cd;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">📌 포인트 정보</h3>
<ul style="line-height:2;color:#333;">
  <li>지역: ${f.region || "-"}</li>
  <li>유형: ${f.type || "-"}</li>
  <li>추천 어종: ${f.species || "-"}</li>
  <li>최적 시기: ${f.season || "-"}</li>
  <li>물때: ${f.tide || "-"}</li>
</ul>
<h3 style="background:#e0f2fe;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">🗺 접근 방법</h3>
<p style="color:#333;line-height:1.8;">${(f.access || "-").replace(/\n/g, "<br>")}</p>
<h3 style="background:#fee2e2;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">⚠️ 주의사항</h3>
<p style="color:#333;line-height:1.8;">${(f.caution || "-").replace(/\n/g, "<br>")}</p>
<h3 style="background:#dcfce7;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">⭐ 총평</h3>
<p style="color:#333;line-height:1.8;">${(f.summary || "-").replace(/\n/g, "<br>")}</p>
<p style="color:#888;font-size:13px;">#낚시 #제주낚시 #${f.region || "제주"} #${f.name || "포인트"} #포인트소개 #피싱로그</p>`;

    case "gear":
      return `<h2 style="color:#1a6b4a;font-size:22px;font-weight:900;margin:20px 0 10px;">🎣 ${f.fishType || "낚시"} 채비/장비 팁</h2>
<p style="color:#333;line-height:1.8;">안녕하세요, 피싱로그입니다 🎣</p>
<p style="color:#333;line-height:1.8;"><strong>${f.target || "대상어"}</strong> 낚시를 위한 채비와 장비를 소개합니다.</p>
<h3 style="background:#fff3cd;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">🎣 추천 세팅</h3>
<ul style="line-height:2;color:#333;">
  <li>낚시 종류: ${f.fishType || "-"}</li>
  <li>대상어: ${f.target || "-"}</li>
  <li>추천 채비: ${f.rig || "-"}</li>
  <li>추천 릴/낚싯대: ${f.reel || "-"}</li>
  <li>미끼: ${f.bait || "-"}</li>
</ul>
<h3 style="background:#dcfce7;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">💡 팁 포인트</h3>
<ol style="line-height:2;color:#333;">
${(f.tips || "-").split("\n").map(l => `  <li>${l}</li>`).join("\n")}
</ol>
<h3 style="background:#fee2e2;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">⚠️ 주의사항</h3>
<p style="color:#333;line-height:1.8;">${(f.caution || "-").replace(/\n/g, "<br>")}</p>
<p style="color:#888;font-size:13px;">#낚시 #채비팁 #${f.target || "낚시"} #장비추천 #피싱로그</p>`;

    case "guide":
      return `<h2 style="color:#1a6b4a;font-size:22px;font-weight:900;margin:20px 0 10px;">📚 ${f.title || "입문 가이드"}</h2>
<p style="color:#333;line-height:1.8;">안녕하세요, 피싱로그입니다 🎣</p>
<p style="color:#333;line-height:1.8;">대상 독자: <strong>${f.audience || "-"}</strong></p>
<h3 style="background:#fff3cd;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">📋 핵심 내용</h3>
<ol style="line-height:2;color:#333;">
${(f.content || "-").split("\n").map(l => `  <li>${l}</li>`).join("\n")}
</ol>
<h3 style="background:#e0f2fe;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">🎣 추천 장비</h3>
<p style="color:#333;line-height:1.8;">${f.gear || "-"}</p>
<h3 style="background:#fee2e2;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">⚠️ 주의사항</h3>
<p style="color:#333;line-height:1.8;">${(f.caution || "-").replace(/\n/g, "<br>")}</p>
<h3 style="background:#dcfce7;padding:12px 16px;border-radius:8px;margin:20px 0 10px;">💬 마무리</h3>
<p style="color:#333;line-height:1.8;">${(f.closing || "-").replace(/\n/g, "<br>")}</p>
<p style="color:#888;font-size:13px;">#낚시입문 #제주낚시 #낚시가이드 #피싱로그</p>`;

    default:
      return "";
  }
}

export default function BlogPage() {
  const [template, setTemplate] = useState<TemplateKey | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<FormatKey>("text");

  function handleTemplateSelect(key: TemplateKey) {
    setTemplate(key);
    setForm({});
    setPreview("");
  }

  function handleField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleGenerate() {
    if (!template) return;
    setPreview(generateBlog(template, form, format));
  }

  function handleFormatChange(f: FormatKey) {
    setFormat(f);
    if (template && preview) {
      setPreview(generateBlog(template, form, f));
    }
  }

  async function handleCopy() {
    if (!preview) return;
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* silent */
    }
  }

  const fields = template ? FIELDS[template] : [];

  return (
    <main>
      {/* 히어로 */}
      <section className="fl-blog-hero">
        <div className="fl-page-inner">
          <p className="fl-kicker">BLOG DRAFT</p>
          <h1 className="fl-page-title">블로그 초안 작성</h1>
          <p className="fl-page-sub">템플릿을 선택하고 내용을 입력하면 블로그 초안을 자동 생성해 드립니다.</p>
        </div>
      </section>

      {/* 템플릿 선택 */}
      <div className="fl-page-inner">
        <div className="fl-blog-tmpl-grid">
          {TEMPLATES.map(t => (
            <button
              key={t.key}
              className={`fl-blog-tmpl-card${template === t.key ? " active" : ""}`}
              onClick={() => handleTemplateSelect(t.key)}
              style={template === t.key ? { borderColor: t.catColor } : {}}
            >
              <span className="fl-blog-tmpl-icon">{t.icon}</span>
              <span className="fl-blog-tmpl-title" style={{ color: t.catColor }}>{t.title}</span>
              <span className="fl-blog-tmpl-desc">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 폼 */}
      {template && (
        <div className="fl-page-inner">
          <div className="fl-blog-form">
            {fields.map(field => (
              <div key={field.key} className="fl-ss-field">
                <label className="fl-ss-label" htmlFor={`blog-${field.key}`}>{field.label}</label>
                {field.type === "textarea" || field.type === "multiline" ? (
                  <textarea
                    id={`blog-${field.key}`}
                    className="fl-ss-textarea"
                    rows={field.type === "multiline" ? 4 : 3}
                    placeholder={field.placeholder}
                    value={form[field.key] ?? ""}
                    onChange={e => handleField(field.key, e.target.value)}
                  />
                ) : (
                  <input
                    id={`blog-${field.key}`}
                    className="fl-ss-input"
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key] ?? ""}
                    onChange={e => handleField(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}

            <button
              className={`fl-ss-submit-btn on`}
              onClick={handleGenerate}
            >
              ✍️ 블로그 초안 생성
            </button>
          </div>
        </div>
      )}

      {/* 미리보기 */}
      {preview && (
        <div className="fl-page-inner">
          <div className="fl-blog-preview">
            <div className="fl-blog-preview-tabs">
              <button
                className={`fl-blog-preview-tab${format === "text" ? " on" : ""}`}
                onClick={() => handleFormatChange("text")}
              >
                일반 텍스트
              </button>
              <button
                className={`fl-blog-preview-tab${format === "naver" ? " on" : ""}`}
                onClick={() => handleFormatChange("naver")}
              >
                네이버 HTML
              </button>
            </div>
            <pre className="fl-blog-preview-content">{preview}</pre>
            <button
              className={`fl-blog-copy-btn${copied ? " done" : ""}`}
              onClick={handleCopy}
            >
              {copied ? "✓ 복사완료!" : "📋 클립보드에 복사"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
