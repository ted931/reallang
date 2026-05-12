"use client";

import { useState } from "react";
import Link from "next/link";

const FISH_OPTIONS = ["갈치", "감성돔", "참돔", "벵에돔", "볼락", "광어", "방어", "한치", "참치", "쥐치", "농어", "고등어", "직접입력"];
const WEATHER_OPTIONS = ["☀️ 맑음", "⛅ 흐림", "🌧️ 비", "💨 강풍", "🌫️ 안개"];
const METHOD_OPTIONS = ["찌낚시", "원투낚시", "루어낚시", "선상낚시", "선상지깅", "좌대낚시", "에기낚시", "갈치채비"];
const MOOD_OPTIONS = ["🤩 최고", "😄 좋음", "😊 보통", "😞 아쉬움", "😤 꽝"];
const TIDE_OPTIONS = ["1물", "2물", "3물", "4물", "5물", "6물", "7물", "8물", "9물", "10물", "11물", "12물", "13물"];

interface FishEntry { name: string; count: string; size: string; }

export default function LogbookWritePage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("☀️ 맑음");
  const [wind, setWind] = useState("");
  const [tide, setTide] = useState("9물");
  const [method, setMethod] = useState("찌낚시");
  const [bait, setBait] = useState("");
  const [fish, setFish] = useState<FishEntry[]>([{ name: "갈치", count: "", size: "" }]);
  const [memo, setMemo] = useState("");
  const [mood, setMood] = useState("😄 좋음");
  const [submitted, setSubmitted] = useState(false);

  function addFish() {
    if (fish.length >= 5) return;
    setFish(f => [...f, { name: "갈치", count: "", size: "" }]);
  }
  function updateFish(i: number, field: keyof FishEntry, val: string) {
    setFish(f => f.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  }
  function removeFish(i: number) {
    setFish(f => f.filter((_, idx) => idx !== i));
  }

  const canSubmit = location.trim() !== "";

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center", minHeight: "60vh" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <svg viewBox="0 0 80 80" width="60" height="60">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.3"/>
            <path d="m22 40 12 12 24-28" stroke="#22c55e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="0.6s" fill="freeze"/>
            </path>
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-strong)", marginBottom: 8 }}>일지 저장 완료!</h2>
        <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 28 }}>{date} · {location}<br />소중한 조과 기록이 저장되었습니다.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/logbook" style={{ padding: "12px 24px", background: "var(--hook)", color: "var(--ocean-950)", borderRadius: 12, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
            일지 목록 보기
          </Link>
          <button onClick={() => { setSubmitted(false); setLocation(""); setMemo(""); setFish([{ name: "갈치", count: "", size: "" }]); }}
            style={{ padding: "12px 24px", background: "var(--ocean-800)", border: "1px solid var(--ocean-700)", color: "var(--text-strong)", borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            새 기록 추가
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fl-content" style={{ maxWidth: 600 }}>
      {/* 헤더 */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/logbook" style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 700, textDecoration: "none" }}>← 낚시 일지</Link>
      </div>
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1px", color: "var(--hook)", marginBottom: 6 }}>LOGBOOK</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", margin: 0 }}>오늘의 낚시 기록</h1>
        <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 4 }}>나만의 조과 일지를 작성하세요</p>
      </div>

      {/* 기분 선택 */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-dim)", marginBottom: 10, letterSpacing: "0.3px" }}>오늘 낚시는?</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {MOOD_OPTIONS.map(m => (
            <button key={m} onClick={() => setMood(m)}
              style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${mood === m ? "var(--hook)" : "var(--ocean-700)"}`, background: mood === m ? "rgba(245,158,11,0.12)" : "var(--ocean-900)", color: mood === m ? "var(--hook)" : "var(--text-dim)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 기본 정보 */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ background: "var(--ocean-900)", border: "1px solid var(--ocean-800)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="fl-ss-field">
            <label>날짜</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="fl-ss-field">
            <label>장소 <span style={{ color: "#f87171" }}>*</span></label>
            <input type="text" placeholder="예: 서귀포 황금좌대 / 한림 갯바위 P-12" value={location} onChange={e => setLocation(e.target.value)} />
          </div>
        </div>
      </div>

      {/* 날씨/환경 */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-dim)", marginBottom: 10, letterSpacing: "0.3px" }}>날씨 · 환경</div>
        <div style={{ background: "var(--ocean-900)", border: "1px solid var(--ocean-800)", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-dim)", marginBottom: 8 }}>날씨</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {WEATHER_OPTIONS.map(w => (
                <button key={w} onClick={() => setWeather(w)}
                  style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${weather === w ? "var(--ocean-300)" : "var(--ocean-700)"}`, background: weather === w ? "rgba(95,163,207,0.12)" : "transparent", color: weather === w ? "var(--ocean-300)" : "var(--text-dim)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="fl-ss-field">
              <label>풍속 (m/s)</label>
              <input type="text" placeholder="예: 2.5" value={wind} onChange={e => setWind(e.target.value)} />
            </div>
            <div className="fl-ss-field">
              <label>물때</label>
              <select value={tide} onChange={e => setTide(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: "var(--ocean-800)", border: "1px solid var(--ocean-700)", borderRadius: 8, color: "var(--text-strong)", fontSize: 14, fontFamily: "inherit" }}>
                {TIDE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 낚시 방법 */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-dim)", marginBottom: 10, letterSpacing: "0.3px" }}>낚시 방법</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {METHOD_OPTIONS.map(m => (
            <button key={m} onClick={() => setMethod(m)}
              style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${method === m ? "var(--hook)" : "var(--ocean-700)"}`, background: method === m ? "rgba(245,158,11,0.12)" : "var(--ocean-900)", color: method === m ? "var(--hook)" : "var(--text-dim)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {m}
            </button>
          ))}
        </div>
        <div className="fl-ss-field">
          <label>미끼</label>
          <input type="text" placeholder="예: 크릴새우, 꽁치토막, 지그" value={bait} onChange={e => setBait(e.target.value)} />
        </div>
      </div>

      {/* 조과 */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-dim)", letterSpacing: "0.3px" }}>조과 기록</div>
          {fish.length < 5 && (
            <button onClick={addFish} style={{ fontSize: 12, fontWeight: 800, color: "var(--hook)", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>
              + 어종 추가
            </button>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fish.map((f, i) => (
            <div key={i} style={{ background: "var(--ocean-900)", border: "1px solid var(--ocean-800)", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <select value={f.name} onChange={e => updateFish(i, "name", e.target.value)}
                  style={{ flex: 1, padding: "8px 10px", background: "var(--ocean-800)", border: "1px solid var(--ocean-700)", borderRadius: 8, color: "var(--text-strong)", fontSize: 13, fontFamily: "inherit" }}>
                  {FISH_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                {fish.length > 1 && (
                  <button onClick={() => removeFish(i)} style={{ width: 28, height: 28, borderRadius: 6, background: "var(--ocean-800)", border: "1px solid var(--ocean-700)", color: "var(--text-dim)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}>×</button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div className="fl-ss-field">
                  <label>마릿수</label>
                  <input type="number" min="0" placeholder="0" value={f.count} onChange={e => updateFish(i, "count", e.target.value)} />
                </div>
                <div className="fl-ss-field">
                  <label>최대 사이즈 (cm)</label>
                  <input type="number" min="0" placeholder="0" value={f.size} onChange={e => updateFish(i, "size", e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 메모 */}
      <div style={{ padding: "0 20px 20px" }}>
        <div className="fl-ss-field">
          <label>오늘의 메모</label>
          <textarea
            placeholder="조황 후기, 특이사항, 다음에 시도할 것 등 자유롭게 기록하세요"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "10px 12px", background: "var(--ocean-800)", border: "1px solid var(--ocean-700)", borderRadius: 8, color: "var(--text-strong)", fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div style={{ padding: "0 20px 40px" }}>
        <button
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
          style={{ width: "100%", padding: "14px", background: canSubmit ? "var(--hook)" : "var(--ocean-800)", color: canSubmit ? "var(--ocean-950)" : "var(--text-dim)", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 900, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.15s" }}>
          📓 일지 저장하기
        </button>
        {!canSubmit && <p style={{ fontSize: 12, color: "var(--text-dim)", textAlign: "center", marginTop: 8 }}>장소를 입력해 주세요</p>}
      </div>
    </div>
  );
}
