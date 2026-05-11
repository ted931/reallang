"use client";
import { useState } from "react";
import Link from "next/link";

const STAY_TYPES = [
  { k: 'pension', l: '펜션', icon: '🏡', color: '#5fa3cf' },
  { k: 'minbak', l: '민박', icon: '🏠', color: '#f59e0b' },
  { k: 'guest', l: '게스트하우스', icon: '🛏️', color: '#86efac' },
  { k: 'camping', l: '캠핑', icon: '⛺', color: '#a78bfa' },
];

const FISH_POINTS = ['한림', '애월', '서귀포', '성산', '모슬포', '구좌'];

const PHOTO_COLORS = ['#5fa3cf', '#f59e0b', '#86efac', '#a78bfa', '#f87171', '#fbbf24'];

export default function StaySharePage() {
  const [stayType, setStayType] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(2);
  const [photos, setPhotos] = useState<number[]>([]);
  const [points, setPoints] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [done, setDone] = useState(false);

  const canSubmit = name.trim() && date.trim() && price.trim() && photos.length > 0;

  function togglePoint(p: string) {
    setPoints(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }

  function addPhoto() {
    if (photos.length < 6) {
      setPhotos(prev => [...prev, prev.length]);
    }
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setDone(true);
  }

  if (done) {
    return (
      <div className="fl-page-inner">
        <div className="fl-ss-done">
          <div className="fl-ss-done-circle">
            <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="48" cy="48" r="46" fill="rgba(245,158,11,0.15)" stroke="var(--hook)" strokeWidth="3" />
              <path d="M28 50 L42 64 L68 36" stroke="var(--hook)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="fl-ss-done-title">등록 완료!</h2>
          <p className="fl-ss-done-sub">
            방 쉐어 등록이 완료되었습니다.<br />
            출조 동지의 연락을 기다려 보세요!
          </p>
          <div className="fl-ss-done-actions">
            <Link href="/stay" className="fl-ss-done-btn primary">숙소 목록 바로가기</Link>
            <Link href="/" className="fl-ss-done-btn">홈으로</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fl-page-inner">
      {/* Hero */}
      <div className="fl-ss-hero">
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--hook)', letterSpacing: '1.5px', marginBottom: 6 }}>ROOM SHARE</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-strong)', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          남는 방 함께 쓰기
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-dim)', margin: 0 }}>
          <span className="fl-hero-accent" style={{ color: 'var(--hook)' }}>출조 동지를 모집해요</span>
        </p>
      </div>

      {/* Step 1: 숙소 유형 */}
      <div className="fl-ss-step">
        <div className="fl-ss-step-num">①</div>
        <h2 className="fl-ss-step-title">숙소 유형</h2>
      </div>
      <div className="fl-ss-types">
        {STAY_TYPES.map(t => (
          <button
            key={t.k}
            className="fl-ss-type"
            onClick={() => setStayType(t.k)}
            style={stayType === t.k ? { borderColor: t.color, background: `${t.color}18` } : {}}
          >
            <div
              className="fl-ss-type-icon"
              style={{ background: stayType === t.k ? `${t.color}33` : 'var(--ocean-800)' }}
            >
              {t.icon}
            </div>
            <span className="fl-ss-type-label">{t.l}</span>
          </button>
        ))}
      </div>

      {/* Step 2: 기본 정보 */}
      <div className="fl-ss-step">
        <div className="fl-ss-step-num">②</div>
        <h2 className="fl-ss-step-title">기본 정보</h2>
      </div>
      <div className="fl-ss-form-card">
        <div className="fl-ss-field">
          <label htmlFor="ss-name">숙소 이름</label>
          <input
            id="ss-name"
            type="text"
            placeholder="예: 성산 오션뷰 펜션"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="fl-ss-field">
          <label htmlFor="ss-date">이용 날짜</label>
          <input
            id="ss-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Step 3: 인원 */}
      <div className="fl-ss-step">
        <div className="fl-ss-step-num">③</div>
        <h2 className="fl-ss-step-title">인원</h2>
      </div>
      <div className="fl-ss-people">
        <span className="fl-ss-people-label">쉐어 인원</span>
        <div className="fl-ss-people-ctrl">
          <button onClick={() => setPeople(p => Math.max(1, p - 1))}>−</button>
          <span className="fl-ss-people-num">{people}</span>
          <button onClick={() => setPeople(p => Math.min(8, p + 1))}>+</button>
        </div>
        <span className="fl-ss-people-unit">명</span>
      </div>

      {/* Step 4: 사진 */}
      <div className="fl-ss-step">
        <div className="fl-ss-step-num">④</div>
        <h2 className="fl-ss-step-title">사진</h2>
      </div>
      <div className="fl-ss-photos">
        {photos.map((idx, i) => (
          <div key={idx} className="fl-ss-photo">
            <div
              className="fl-ss-photo-img"
              style={{ background: `${PHOTO_COLORS[i % PHOTO_COLORS.length]}33` }}
            >
              🏠
            </div>
            {i === 0 && <span className="fl-ss-photo-tag">대표</span>}
          </div>
        ))}
        {photos.length < 6 && (
          <button className="fl-ss-photo-add" onClick={addPhoto}>
            <span style={{ fontSize: 22 }}>+</span>
            <span>사진 추가</span>
          </button>
        )}
      </div>
      <p className="fl-ss-photos-hint">최대 6장 · 첫 번째 사진이 대표 이미지로 사용됩니다</p>

      {/* Step 5: 가까운 낚시 포인트 */}
      <div className="fl-ss-step">
        <div className="fl-ss-step-num">⑤</div>
        <h2 className="fl-ss-step-title">가까운 낚시 포인트</h2>
      </div>
      <div className="fl-ss-points">
        {FISH_POINTS.map(p => (
          <button
            key={p}
            className={`fl-chip ${points.includes(p) ? 'on' : ''}`}
            onClick={() => togglePoint(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Step 6: 1인 분담금 */}
      <div className="fl-ss-step">
        <div className="fl-ss-step-num">⑥</div>
        <h2 className="fl-ss-step-title">1인 분담금</h2>
      </div>
      <div className="fl-ss-form-card">
        <div className="fl-ss-field">
          <label htmlFor="ss-price">분담금</label>
          <input
            id="ss-price"
            type="number"
            placeholder="0"
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={{ paddingRight: 52 }}
          />
          <span className="fl-ss-price-unit">원/인</span>
        </div>
      </div>

      {/* Submit */}
      <div className="fl-ss-submit">
        <button
          className={`fl-ss-submit-btn ${canSubmit ? 'on' : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          쉐어 등록하기
        </button>
        {!canSubmit && (
          <p className="fl-ss-submit-hint">숙소 이름, 날짜, 사진, 분담금을 모두 입력해 주세요</p>
        )}
      </div>
    </div>
  );
}
