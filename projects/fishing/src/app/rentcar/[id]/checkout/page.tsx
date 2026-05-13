"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const RC_CARS = [
  { id: 1, name: '아반떼 CN7', cls: '준중형', region: '제주공항', pickup: '제주공항 1층', orig: 65000, sale: 38000, off: 42, seats: 5, fuel: '가솔린', deadline: '오늘 17:00' },
  { id: 2, name: 'SM6', cls: '중형', region: '서귀포', pickup: '서귀포 지점', orig: 85000, sale: 54000, off: 36, seats: 5, fuel: '가솔린', deadline: '오늘 18:00' },
  { id: 3, name: '카니발 9인승', cls: '승합', region: '제주공항', pickup: '공항 셔틀존', orig: 145000, sale: 89000, off: 39, seats: 9, fuel: '디젤', deadline: '오늘 19:30' },
  { id: 4, name: '레이', cls: '경차', region: '제주시', pickup: '제주시 지점', orig: 48000, sale: 28000, off: 42, seats: 4, fuel: '가솔린', deadline: '오늘 16:00' },
  { id: 5, name: '스타리아', cls: '승합', region: '성산', pickup: '성산항 인근', orig: 165000, sale: 99000, off: 40, seats: 11, fuel: '디젤', deadline: '오늘 20:00' },
  { id: 6, name: '쏘렌토 하이브리드', cls: 'SUV', region: '서귀포', pickup: '서귀포 지점', orig: 125000, sale: 76000, off: 39, seats: 7, fuel: 'HEV', deadline: '오늘 17:30' },
];

const RETURN_LOCATIONS = [
  '제주공항 1층',
  '서귀포 지점',
  '제주시 지점',
  '성산항 인근',
  '공항 셔틀존',
  '한림 지점',
];

function makeTimeOptions() {
  const times: string[] = [];
  for (let h = 6; h <= 22; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 22) times.push(`${String(h).padStart(2, '0')}:30`);
  }
  return times;
}
const TIME_OPTIONS = makeTimeOptions();

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function calcDays(from: string, to: string) {
  if (!from || !to) return 0;
  const d1 = new Date(from).getTime();
  const d2 = new Date(to).getTime();
  const diff = Math.round((d2 - d1) / 86400000);
  return diff > 0 ? diff : 0;
}

function randomBookingNo() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `RC${n}`;
}

export default function CheckoutPage() {
  const params = useParams();
  const id = Number(params.id);
  const car = RC_CARS.find(c => c.id === id);

  const [pickupDate, setPickupDate] = useState(todayStr());
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState(tomorrowStr());
  const [returnSame, setReturnSame] = useState(true);
  const [returnLoc, setReturnLoc] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');
  const [request, setRequest] = useState('');

  const [payMethod, setPayMethod] = useState<'onsite' | 'kakao' | 'transfer' | ''>('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingNo] = useState(() => randomBookingNo());

  const days = calcDays(pickupDate, returnDate);
  const totalPrice = car ? car.sale * Math.max(days, 1) : 0;

  const actualReturnLoc = returnSame ? (car?.pickup ?? '') : returnLoc;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payMethod) return;
    setShowConfirm(true);
  }

  if (!car) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
        <p style={{ marginBottom: 16 }}>차량 정보를 찾을 수 없습니다.</p>
        <Link href="/rentcar" style={{ color: 'var(--hook)', fontWeight: 700 }}>목록으로 돌아가기</Link>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <>
        <style>{confirmStyles}</style>
        <div className="co-wrap">
          <div className="co-confirm-card">
            <div className="co-confirm-icon">✓</div>
            <h2 className="co-confirm-title">예약이 완료되었습니다</h2>
            <div className="co-confirm-no">예약번호 <strong>{bookingNo}</strong></div>
            <div className="co-confirm-rows">
              <div className="co-confirm-row">
                <span className="co-confirm-k">차량</span>
                <span className="co-confirm-v">{car.name} ({car.cls} · {car.seats}인승)</span>
              </div>
              <div className="co-confirm-row">
                <span className="co-confirm-k">픽업</span>
                <span className="co-confirm-v">{car.pickup}</span>
              </div>
              <div className="co-confirm-row">
                <span className="co-confirm-k">픽업 시간</span>
                <span className="co-confirm-v">{pickupDate} {pickupTime}</span>
              </div>
              <div className="co-confirm-row">
                <span className="co-confirm-k">반납</span>
                <span className="co-confirm-v">{actualReturnLoc || car.pickup} ({returnDate})</span>
              </div>
              <div className="co-confirm-row">
                <span className="co-confirm-k">결제</span>
                <span className="co-confirm-v">
                  {payMethod === 'onsite' ? '현장결제 (픽업 시 카드)' : payMethod === 'kakao' ? '카카오페이' : '계좌이체'}
                </span>
              </div>
              <div className="co-confirm-row total">
                <span className="co-confirm-k">총 금액</span>
                <span className="co-confirm-v hook">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
            <p className="co-confirm-note">예약 확인 문자가 {phone} 으로 전송됩니다.</p>
            <Link href="/rentcar" className="co-confirm-back">← 렌터카 목록으로</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{pageStyles}</style>
      <div className="co-wrap">
        {/* 상단 타이틀 */}
        <div className="co-header">
          <Link href="/rentcar" className="co-back-btn">← 목록</Link>
          <h1 className="co-title">땡처리 예약 체크아웃</h1>
        </div>

        <form className="co-layout" onSubmit={handleSubmit}>
          {/* 왼쪽: 차량 정보 */}
          <aside className="co-car-panel">
            <div className="co-car-badge">-{car.off}% 땡처리</div>
            <h2 className="co-car-name">{car.name}</h2>
            <div className="co-car-meta">
              <span>{car.cls}</span>
              <span className="co-dot">·</span>
              <span>{car.seats}인승</span>
              <span className="co-dot">·</span>
              <span>{car.fuel}</span>
            </div>

            <div className="co-car-pickup">
              <span className="co-car-pickup-icon">📍</span>
              <span>{car.pickup}</span>
            </div>

            <div className="co-price-box">
              <div className="co-price-orig">{car.orig.toLocaleString()}원 / 1일</div>
              <div className="co-price-sale">{car.sale.toLocaleString()}원 <span className="co-price-unit">/ 1일</span></div>
              <div className="co-price-deadline">마감 {car.deadline}</div>
            </div>

            {days > 0 && (
              <div className="co-total-box">
                <div className="co-total-label">{days}일 × {car.sale.toLocaleString()}원</div>
                <div className="co-total-price">{totalPrice.toLocaleString()}원</div>
              </div>
            )}
          </aside>

          {/* 오른쪽: 예약 폼 */}
          <div className="co-form-panel">
            {/* 예약 정보 */}
            <section className="co-section">
              <h3 className="co-section-title">예약 일정</h3>

              <div className="co-field-row">
                <div className="co-field">
                  <label className="co-label" htmlFor="pickupDate">픽업 날짜</label>
                  <input
                    id="pickupDate"
                    type="date"
                    className="co-input"
                    value={pickupDate}
                    min={todayStr()}
                    onChange={e => setPickupDate(e.target.value)}
                    required
                  />
                </div>
                <div className="co-field">
                  <label className="co-label" htmlFor="pickupTime">픽업 시간</label>
                  <select
                    id="pickupTime"
                    className="co-input co-select"
                    value={pickupTime}
                    onChange={e => setPickupTime(e.target.value)}
                  >
                    {TIME_OPTIONS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="co-field">
                <label className="co-label" htmlFor="returnDate">반납 날짜</label>
                <input
                  id="returnDate"
                  type="date"
                  className="co-input"
                  value={returnDate}
                  min={pickupDate || todayStr()}
                  onChange={e => setReturnDate(e.target.value)}
                  required
                />
                {days > 0 && (
                  <div className="co-days-badge">{days}일 대여</div>
                )}
              </div>

              <div className="co-field">
                <label className="co-label">반납 장소</label>
                <div className="co-return-opts">
                  <button
                    type="button"
                    className={`co-return-opt ${returnSame ? 'on' : ''}`}
                    onClick={() => setReturnSame(true)}
                  >
                    픽업 장소와 동일
                    {returnSame && <span className="co-return-sub">{car.pickup}</span>}
                  </button>
                  <button
                    type="button"
                    className={`co-return-opt ${!returnSame ? 'on' : ''}`}
                    onClick={() => setReturnSame(false)}
                  >
                    다른 지점 반납
                  </button>
                </div>
                {!returnSame && (
                  <select
                    className="co-input co-select"
                    value={returnLoc}
                    onChange={e => setReturnLoc(e.target.value)}
                    required={!returnSame}
                    style={{ marginTop: 8 }}
                  >
                    <option value="">반납 지점 선택</option>
                    {RETURN_LOCATIONS.filter(l => l !== car.pickup).map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                )}
              </div>
            </section>

            {/* 예약자 정보 */}
            <section className="co-section">
              <h3 className="co-section-title">예약자 정보</h3>

              <div className="co-field">
                <label className="co-label" htmlFor="name">이름 <span className="co-required">*</span></label>
                <input
                  id="name"
                  type="text"
                  className="co-input"
                  placeholder="홍길동"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="co-field">
                <label className="co-label" htmlFor="phone">전화번호 <span className="co-required">*</span></label>
                <input
                  id="phone"
                  type="tel"
                  className="co-input"
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="co-field">
                <label className="co-label" htmlFor="license">운전면허번호 <span className="co-optional">(선택)</span></label>
                <input
                  id="license"
                  type="text"
                  className="co-input"
                  placeholder="12-34-567890-12"
                  value={license}
                  onChange={e => setLicense(e.target.value)}
                />
              </div>

              <div className="co-field">
                <label className="co-label" htmlFor="request">특별 요청 <span className="co-optional">(선택)</span></label>
                <textarea
                  id="request"
                  className="co-input co-textarea"
                  placeholder="낚시대 적재 공간 필요, 아이스박스 추가 요청 등"
                  value={request}
                  onChange={e => setRequest(e.target.value)}
                  rows={3}
                />
              </div>
            </section>

            {/* 결제 방법 */}
            <section className="co-section">
              <h3 className="co-section-title">결제 방법</h3>
              <div className="co-pay-opts">
                <button
                  type="button"
                  className={`co-pay-opt ${payMethod === 'onsite' ? 'on' : ''}`}
                  onClick={() => setPayMethod('onsite')}
                >
                  <span className="co-pay-icon">💳</span>
                  <span className="co-pay-label">현장결제</span>
                  <span className="co-pay-sub">픽업 시 카드</span>
                </button>
                <button
                  type="button"
                  className={`co-pay-opt ${payMethod === 'kakao' ? 'on' : ''}`}
                  onClick={() => setPayMethod('kakao')}
                >
                  <span className="co-pay-icon">🟡</span>
                  <span className="co-pay-label">카카오페이</span>
                  <span className="co-pay-sub">간편결제</span>
                </button>
                <button
                  type="button"
                  className={`co-pay-opt ${payMethod === 'transfer' ? 'on' : ''}`}
                  onClick={() => setPayMethod('transfer')}
                >
                  <span className="co-pay-icon">🏦</span>
                  <span className="co-pay-label">계좌이체</span>
                  <span className="co-pay-sub">무통장입금</span>
                </button>
              </div>
            </section>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className={`co-submit-btn ${!payMethod ? 'disabled' : ''}`}
              disabled={!payMethod}
            >
              {totalPrice > 0
                ? `${totalPrice.toLocaleString()}원 예약 완료`
                : '예약 완료'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const pageStyles = `
  .co-wrap {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 20px 100px;
  }
  .co-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 0 16px;
    border-bottom: 1px solid var(--line);
    margin-bottom: 24px;
  }
  .co-back-btn {
    font-size: 13px;
    color: var(--text-dim);
    text-decoration: none;
    padding: 4px 10px;
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    white-space: nowrap;
  }
  .co-back-btn:hover { color: var(--text); }
  .co-title {
    font-size: 17px;
    font-weight: 800;
    color: var(--text-strong);
    margin: 0;
  }

  /* 2-column layout */
  .co-layout {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  @media (min-width: 768px) {
    .co-layout {
      flex-direction: row;
      align-items: flex-start;
      gap: 28px;
    }
    .co-car-panel {
      flex: 0 0 220px;
      position: sticky;
      top: 20px;
    }
    .co-form-panel {
      flex: 1;
      min-width: 0;
    }
  }

  /* 차량 패널 */
  .co-car-panel {
    background: var(--tint-04);
    border: 1px solid var(--line);
    border-radius: var(--r-card);
    padding: 20px;
  }
  .co-car-badge {
    display: inline-block;
    background: var(--hook);
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 10px;
    letter-spacing: 0.3px;
  }
  .co-car-name {
    font-size: 20px;
    font-weight: 800;
    color: var(--text-strong);
    margin: 0 0 6px;
  }
  .co-car-meta {
    font-size: 12px;
    color: var(--text-dim);
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 12px;
  }
  .co-dot { opacity: 0.4; }
  .co-car-pickup {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--text);
    background: var(--tint-08);
    border-radius: var(--r-sm);
    padding: 8px 10px;
    margin-bottom: 16px;
  }
  .co-car-pickup-icon { font-size: 14px; }

  .co-price-box {
    border-top: 1px solid var(--line);
    padding-top: 14px;
  }
  .co-price-orig {
    font-size: 12px;
    color: var(--text-dim);
    text-decoration: line-through;
    margin-bottom: 2px;
  }
  .co-price-sale {
    font-size: 22px;
    font-weight: 800;
    color: var(--hook);
    line-height: 1.2;
  }
  .co-price-unit {
    font-size: 13px;
    font-weight: 400;
    color: var(--text-dim);
  }
  .co-price-deadline {
    font-size: 11px;
    color: var(--text-dim);
    margin-top: 4px;
  }

  .co-total-box {
    margin-top: 14px;
    background: var(--tint-08);
    border-radius: var(--r-sm);
    padding: 10px 12px;
    border-left: 3px solid var(--hook);
  }
  .co-total-label {
    font-size: 12px;
    color: var(--text-dim);
    margin-bottom: 4px;
  }
  .co-total-price {
    font-size: 20px;
    font-weight: 800;
    color: var(--hook);
  }

  /* 폼 섹션 */
  .co-section {
    background: var(--tint-04);
    border: 1px solid var(--line);
    border-radius: var(--r-card);
    padding: 20px;
    margin-bottom: 16px;
  }
  .co-section-title {
    font-size: 13px;
    font-weight: 800;
    color: var(--text-dim);
    letter-spacing: 0.4px;
    text-transform: uppercase;
    margin: 0 0 16px;
  }

  .co-field {
    margin-bottom: 14px;
  }
  .co-field:last-child { margin-bottom: 0; }

  .co-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 14px;
  }

  .co-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-dim);
    margin-bottom: 6px;
  }
  .co-required { color: var(--hook); }
  .co-optional { font-weight: 400; opacity: 0.7; }

  .co-input {
    width: 100%;
    box-sizing: border-box;
    background: var(--tint-08);
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    padding: 10px 12px;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.15s;
  }
  .co-input:focus { border-color: var(--hook); }
  .co-select { cursor: pointer; }
  .co-textarea { resize: vertical; min-height: 72px; font-family: inherit; }

  .co-days-badge {
    display: inline-block;
    margin-top: 6px;
    font-size: 12px;
    font-weight: 700;
    color: var(--hook);
    background: var(--tint-08);
    border: 1px solid var(--hook);
    padding: 2px 8px;
    border-radius: 4px;
  }

  /* 반납 장소 */
  .co-return-opts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .co-return-opt {
    background: var(--tint-08);
    border: 1.5px solid var(--line);
    border-radius: var(--r-sm);
    padding: 10px 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 2px;
    transition: border-color 0.15s, background 0.15s;
  }
  .co-return-opt.on {
    border-color: var(--hook);
    background: var(--tint-04);
    color: var(--hook);
  }
  .co-return-sub {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-dim);
  }

  /* 결제 방법 */
  .co-pay-opts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .co-pay-opt {
    background: var(--tint-08);
    border: 1.5px solid var(--line);
    border-radius: var(--r-sm);
    padding: 14px 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: border-color 0.15s, background 0.15s;
  }
  .co-pay-opt.on {
    border-color: var(--hook);
    background: var(--tint-04);
  }
  .co-pay-icon { font-size: 22px; }
  .co-pay-label {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-strong);
  }
  .co-pay-sub {
    font-size: 11px;
    color: var(--text-dim);
  }

  /* 제출 버튼 */
  .co-submit-btn {
    width: 100%;
    padding: 16px;
    background: var(--hook);
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    border: none;
    border-radius: var(--r-card);
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .co-submit-btn:hover:not(.disabled) { opacity: 0.88; }
  .co-submit-btn.disabled {
    background: var(--line);
    color: var(--text-dim);
    cursor: not-allowed;
  }
`;

const confirmStyles = `
  .co-wrap {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 20px 100px;
  }
  .co-confirm-card {
    margin-top: 48px;
    background: var(--tint-04);
    border: 1px solid var(--line);
    border-radius: var(--r-card);
    padding: 40px 28px;
    text-align: center;
  }
  .co-confirm-icon {
    width: 56px;
    height: 56px;
    background: var(--hook);
    color: #fff;
    font-size: 28px;
    font-weight: 800;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
  }
  .co-confirm-title {
    font-size: 22px;
    font-weight: 800;
    color: var(--text-strong);
    margin: 0 0 10px;
  }
  .co-confirm-no {
    font-size: 14px;
    color: var(--text-dim);
    margin-bottom: 28px;
  }
  .co-confirm-no strong {
    color: var(--hook);
    font-size: 18px;
    font-weight: 800;
  }
  .co-confirm-rows {
    text-align: left;
    border: 1px solid var(--line);
    border-radius: var(--r-sm);
    overflow: hidden;
    margin-bottom: 20px;
  }
  .co-confirm-row {
    display: flex;
    align-items: flex-start;
    padding: 12px 16px;
    border-bottom: 1px solid var(--line);
    gap: 12px;
  }
  .co-confirm-row:last-child { border-bottom: none; }
  .co-confirm-row.total { background: var(--tint-08); }
  .co-confirm-k {
    flex: 0 0 80px;
    font-size: 12px;
    font-weight: 700;
    color: var(--text-dim);
    padding-top: 1px;
  }
  .co-confirm-v {
    flex: 1;
    font-size: 14px;
    color: var(--text);
    font-weight: 500;
  }
  .co-confirm-v.hook {
    color: var(--hook);
    font-weight: 800;
    font-size: 16px;
  }
  .co-confirm-note {
    font-size: 12px;
    color: var(--text-dim);
    margin: 0 0 24px;
  }
  .co-confirm-back {
    display: inline-block;
    padding: 12px 28px;
    background: var(--hook);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border-radius: var(--r-card);
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .co-confirm-back:hover { opacity: 0.88; }
`;
