"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DUMMY_CATCHES } from "@/lib/dummy-catch";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";
import { DUMMY_GATHERINGS } from "@/lib/dummy-gatherings";

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const IcoFlame = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C8 9 7 11 7 13a5 5 0 0 0 10 0c0-5-5-9-5-11Z"/></svg>;
const IcoArrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
const IcoPin = ({s=10}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IcoSun = ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;
const IcoMoon = ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>;
const IcoWaves = ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/></svg>;
const IcoWind = ({s=14}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/></svg>;
const IcoUsers = ({s=18}:{s?:number}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

function Hero() {
  const stars = Array.from({length:14},(_,i)=>({left:`${(i*73)%100}%`,top:`${(i*41)%60}%`,delay:`${(i%5)*0.4}s`}));
  return (
    <section className="fl-hero">
      <div className="fl-hero-glow"/>
      <div className="fl-hero-stars">{stars.map((s,i)=><span key={i} style={{left:s.left,top:s.top,animationDelay:s.delay}}/>)}</div>
      <div className="fl-hero-content">
        <div className="fl-hero-greet">안녕하세요, 낚시인님 🎣</div>
        <h1 className="fl-hero-title">오늘은 바다가<br/><span className="fl-hero-accent">출조하기 좋은 날</span>이에요</h1>
        <div className="fl-tide-card">
          <div className="fl-tide-row">
            {[
              {label:<><IcoWaves/>만조</>,val:"14:32"},
              {label:<><IcoWaves/>간조</>,val:"08:15"},
              {label:<><IcoWind/>바람</>,val:<>3<span className="fl-unit">m/s</span></>},
              {label:<><IcoSun/>일출</>,val:"06:21"},
            ].map((item,i,arr)=>(
              <><div key={i} className="fl-tide-item"><div className="fl-tide-label">{item.label}</div><div className="fl-tide-value">{item.val}</div></div>{i<arr.length-1&&<div className="fl-tide-divider"/>}</>
            ))}
          </div>
        </div>
      </div>
      <svg className="fl-wave fl-wave-3" viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M0,40 C60,20 120,60 200,40 C280,20 340,60 400,40 L400,80 L0,80 Z"/></svg>
      <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z"/></svg>
      <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none"><path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z"/></svg>
    </section>
  );
}

function StatsBar() {
  const tiles = [
    {icon:"🐟",label:"오늘 조황",value:142,suffix:"건",accent:"#fbbf24"},
    {icon:"🎣",label:"활동 낚시꾼",value:1284,suffix:"명",accent:"#5fa3cf"},
    {icon:"🛖",label:"좌대 예약",value:38,suffix:"석",accent:"#86efac"},
    {icon:"🤝",label:"진행 모임",value:12,suffix:"개",accent:"#f0abfc"},
  ];
  return (
    <div className="fl-stats">
      {tiles.map(t=>{
        const n = useCountUp(t.value);
        return (
          <div key={t.label} className="fl-stat">
            <div className="fl-stat-icon" style={{color:t.accent,fontSize:18}}>{t.icon}</div>
            <div className="fl-stat-num">{n.toLocaleString()}<span className="fl-stat-suf">{t.suffix}</span></div>
            <div className="fl-stat-label">{t.label}</div>
          </div>
        );
      })}
    </div>
  );
}

const HUE: Record<string,number> = {"갈치":215,"참돔":350,"감성돔":220,"방어":30,"부시리":190,"벵에돔":150,"볼락":260,"농어":210,"광어":195};

function HotCatchCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [idx,setIdx] = useState(0);
  const hot = DUMMY_CATCHES.slice(0,5);
  useEffect(()=>{
    const el=ref.current; if(!el)return;
    const fn=()=>setIdx(Math.round(el.scrollLeft/244));
    el.addEventListener("scroll",fn,{passive:true});
    return ()=>el.removeEventListener("scroll",fn);
  },[]);
  return (
    <div>
      <div className="fl-sec-head">
        <div className="fl-sec-bar" style={{background:"#f59e0b"}}/>
        <div className="fl-sec-text">
          <div className="fl-sec-kicker" style={{color:"#f59e0b"}}>HOT</div>
          <div className="fl-sec-title">실시간 조황</div>
          <div className="fl-sec-sub">지금 막 올라온 한 마리</div>
        </div>
        <Link href="/catch" className="fl-sec-more">더보기 <IcoArrow/></Link>
      </div>
      <div className="fl-carousel" ref={ref}>
        {hot.map((c,i)=>{
          const fish=c.catches[0]?.fishName??"물고기";
          const hue=HUE[fish]??210;
          return (
            <Link key={c.id} href={`/catch/${c.id}`} className="fl-catch" style={{"--hue":hue} as React.CSSProperties}>
              <div className="fl-catch-img">
                {i===0&&<div className="fl-hot-badge"><IcoFlame/> HOT</div>}
                <div className="fl-catch-img-fish">
                  <svg viewBox="0 0 100 60" width="80%" height="60%" style={{opacity:0.18}}>
                    <path d="M10 30 Q 30 10, 60 30 T 90 30 L 95 22 L 95 38 Z" fill="white"/>
                    <circle cx="55" cy="28" r="2" fill="rgba(0,0,0,0.6)"/>
                  </svg>
                </div>
                <div className="fl-catch-size">📏 {c.catches[0]?.size??""}</div>
              </div>
              <div className="fl-catch-body">
                <div className="fl-catch-fish">{fish}</div>
                <div className="fl-catch-meta"><IcoPin/> {c.location.slice(0,12)}</div>
                <div className="fl-catch-foot">
                  <div className="fl-avatar">{c.authorName[0]}</div>
                  <div className="fl-catch-angler">{c.authorName}</div>
                  <div className="fl-catch-time">🕐 {c.region}</div>
                </div>
              </div>
            </Link>
          );
        })}
        <div style={{flex:"0 0 4px"}}/>
      </div>
      <div className="fl-dots">{hot.map((_,i)=><span key={i} className={i===idx?"on":""}/>)}</div>
    </div>
  );
}

function SeatSection() {
  const seats = DUMMY_JWAEDAE.slice(0,4);
  return (
    <div>
      <div className="fl-sec-head">
        <div className="fl-sec-bar" style={{background:"#5fa3cf"}}/>
        <div className="fl-sec-text">
          <div className="fl-sec-kicker" style={{color:"#5fa3cf"}}>좌대 예약</div>
          <div className="fl-sec-title">오늘 입실 가능한 좌대</div>
          <div className="fl-sec-sub">잔여석 실시간</div>
        </div>
        <Link href="/jwaedae" className="fl-sec-more">더보기 <IcoArrow/></Link>
      </div>
      <div className="fl-seat-list">
        {seats.map(s=>{
          const urgent=s.availableSeats<=2;
          const pct=((s.capacity-s.availableSeats)/s.capacity)*100;
          return (
            <article key={s.id} className={`fl-seat${urgent?" urgent":""}`}>
              {urgent&&<div className="fl-seat-pulse"/>}
              <div className="fl-seat-top">
                <div className="fl-seat-icon">
                  <svg viewBox="0 0 40 40" width="40" height="40">
                    <defs><linearGradient id={`sg${s.id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5fa3cf"/><stop offset="100%" stopColor="#1e6595"/></linearGradient></defs>
                    <rect width="40" height="40" rx="10" fill={`url(#sg${s.id})`}/>
                    <path d="M8 22 Q 15 18 22 22 T 36 22" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                <div className="fl-seat-name">
                  <div className="fl-seat-title">{s.name}</div>
                  <div className="fl-seat-loc"><IcoPin/> {s.location.slice(0,14)}</div>
                </div>
                <div className={`fl-rate fl-rate-${s.catchRate}`}><em>조황 {s.catchRate}</em></div>
              </div>
              <div className="fl-seat-bar-wrap">
                <div className="fl-seat-bar-head">
                  <div className="fl-seat-left">잔여 <strong className={urgent?"urgent":""}>{s.availableSeats}</strong><span>/{s.capacity}석</span></div>
                  {urgent&&<div className="fl-urgent-tag"><IcoFlame/> 마감임박</div>}
                </div>
                <div className="fl-seat-bar">
                  <div className="fl-seat-bar-fill" style={{width:`${pct}%`,background:urgent?"linear-gradient(90deg,#f59e0b,#ef4444)":"linear-gradient(90deg,#3a82b3,#1e6595)"}}/>
                </div>
              </div>
              <div className="fl-price-row">
                <div className="fl-price"><div className="fl-price-h"><IcoSun/> 주간</div><div className="fl-price-v">{(s.priceDay/10000).toFixed(0)}<span>만원</span></div></div>
                <div className="fl-price"><div className="fl-price-h"><IcoMoon/> 야간</div><div className="fl-price-v">{(s.priceNight/10000).toFixed(0)}<span>만원</span></div></div>
                <Link href={`/jwaedae/${s.id}`} className="fl-book-btn">예약</Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function GatheringSection() {
  const clubs = DUMMY_GATHERINGS.slice(0,3);
  return (
    <div>
      <div className="fl-sec-head">
        <div className="fl-sec-bar" style={{background:"#86efac"}}/>
        <div className="fl-sec-text">
          <div className="fl-sec-kicker" style={{color:"#86efac"}}>CLUB</div>
          <div className="fl-sec-title">낚시 동아리</div>
        </div>
        <Link href="/gathering" className="fl-sec-more">더보기 <IcoArrow/></Link>
      </div>
      <div className="fl-party-list">
        {clubs.map(c=>{
          const dday=Math.max(0,Math.ceil((new Date(c.nextOuting).getTime()-Date.now())/86400000));
          return (
            <Link key={c.id} href={`/gathering/${c.id}`} className="fl-party">
              <div className="fl-dday">D-{dday}</div>
              <div className="fl-party-body">
                <div className="fl-party-title">{c.name}</div>
                <div className="fl-party-meta"><IcoUsers s={11}/> {c.memberCount}/{c.maxMembers}명 · {c.meetingFrequency}</div>
              </div>
              <div className="fl-party-cta"><IcoArrow/></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CameraFAB() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modal, setModal] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [fishName, setFishName] = useState("");
  const [fishSize, setFishSize] = useState("");
  const [stamped, setStamped] = useState<string | null>(null);

  function handleCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    setStamped(null);
    setModal(true);
  }

  function applyStamp() {
    const canvas = canvasRef.current;
    if (!canvas || !imgSrc) return;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      // 배경 스트립
      const now = new Date();
      const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")}`;
      const timeStr = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      const lines = [
        `📍 제주도  🕒 ${dateStr} ${timeStr}`,
        fishName ? `🐟 ${fishName}${fishSize ? `  📏 ${fishSize}cm` : ""}` : null,
        "🎣 퐁당 — fishing.realang.store",
      ].filter(Boolean) as string[];
      const stripH = 36 * lines.length + 24;
      ctx.fillStyle = "rgba(8,15,30,0.82)";
      ctx.fillRect(0, img.height - stripH, img.width, stripH);
      ctx.font = `bold ${Math.round(img.width / 28)}px 'Noto Sans KR', sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      lines.forEach((line, i) => {
        ctx.fillText(line, 20, img.height - stripH + 32 + i * 36);
      });
      setStamped(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = imgSrc;
  }

  function handleRegister() {
    setModal(false);
    router.push("/catch/upload");
  }

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          position: "fixed", bottom: 90, right: 20, zIndex: 50,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--hook), #ef4444)",
          color: "#fff", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(245,158,11,0.4)",
          fontSize: 24,
        }}
        title="📸 조황 촬영"
      >📸</button>
      <input ref={inputRef} type="file" accept="image/*" capture="environment"
        onChange={handleCapture} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {modal && imgSrc && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "var(--ocean-900)", borderRadius: 20, width: "100%", maxWidth: 420, padding: 20, border: "1px solid var(--line-2)" }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text-strong)", marginBottom: 12 }}>📸 조황 사진 등록</div>
            <img src={stamped ?? imgSrc} alt="capture" style={{ width: "100%", borderRadius: 12, marginBottom: 12, maxHeight: 280, objectFit: "cover" }} />
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input value={fishName} onChange={e => setFishName(e.target.value)} placeholder="어종 (예: 갈치)"
                style={{ flex: 1, height: 40, background: "var(--ocean-800)", border: "1px solid var(--line)", borderRadius: 10, padding: "0 12px", color: "var(--text-strong)", fontSize: 13 }} />
              <input value={fishSize} onChange={e => setFishSize(e.target.value)} placeholder="길이 cm"
                style={{ width: 90, height: 40, background: "var(--ocean-800)", border: "1px solid var(--line)", borderRadius: 10, padding: "0 12px", color: "var(--text-strong)", fontSize: 13 }} />
            </div>
            <button onClick={applyStamp}
              style={{ width: "100%", height: 42, background: "var(--ocean-800)", border: "1px solid var(--line-2)", borderRadius: 10, color: "var(--text-dim)", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 8 }}>
              🗓 날짜·어종 스탬프 찍기
            </button>
            <button onClick={handleRegister}
              style={{ width: "100%", height: 46, background: "var(--hook)", border: "none", borderRadius: 12, color: "var(--ocean-950)", fontWeight: 900, fontSize: 15, cursor: "pointer", marginBottom: 8 }}>
              🎣 조황 등록하기
            </button>
            <button onClick={() => setModal(false)}
              style={{ width: "100%", height: 38, background: "transparent", border: "1px solid var(--line)", borderRadius: 10, color: "var(--text-mute)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <div className="fl-home-pad">
      <Hero/>
      <StatsBar/>
      <div className="fl-section"><HotCatchCarousel/></div>
      <div className="fl-section"><SeatSection/></div>
      <div className="fl-section"><GatheringSection/></div>
      <CameraFAB/>
    </div>
  );
}
