"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DUMMY_STAY, STAY_TYPE_LABEL } from "@/lib/dummy-stay";

export default function StayCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);

  const s = DUMMY_STAY.find((x) => x.id === id);

  const checkIn = searchParams.get("checkIn") || "2026-05-23";
  const checkOut = searchParams.get("checkOut") || "2026-05-24";
  const guests = parseInt(searchParams.get("guests") || "2", 10);

  const nights = Math.max(1, (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
  const total = s ? s.pricePerNight * nights : 0;

  // 예약자 정보
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");
  const [payMethod, setPayMethod] = useState<"onsite" | "kakaopay" | "transfer">("onsite");

  // 예약 완료 상태
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingNo] = useState(() => String(Math.floor(100000 + Math.random() * 900000)));

  if (!s) return <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-mute)" }}>숙소를 찾을 수 없습니다.</div>;

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return `${dt.getMonth() + 1}월 ${dt.getDate()}일`;
  };

  const PAY_LABELS: Record<string, string> = {
    onsite: "현장 결제",
    kakaopay: "카카오페이",
    transfer: "계좌이체",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { alert("이름을 입력해주세요."); return; }
    if (!phone.trim()) { alert("전화번호를 입력해주세요."); return; }
    setShowConfirm(true);
  };

  return (
    <>
      <style>{`
        .co-wrap {
          max-width: 640px;
          margin: 0 auto;
          padding: 0 20px 100px;
        }
        .co-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-mute);
          font-size: 13px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px 0 16px;
          transition: color 0.15s;
        }
        .co-back:hover { color: var(--text); }
        .co-section {
          border: 1px solid var(--line);
          background: var(--tint-04);
          border-radius: var(--r-card);
          padding: 20px;
          margin-bottom: 16px;
        }
        .co-section-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-mute);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 14px;
        }
        .co-stay-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .co-stay-emoji {
          width: 56px;
          height: 56px;
          border-radius: var(--r-sm);
          background: var(--tint-08);
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
        }
        .co-stay-type {
          font-size: 11px;
          color: var(--text-mute);
          margin-bottom: 3px;
        }
        .co-stay-name {
          font-size: 16px;
          font-weight: 900;
          color: var(--text-strong);
          line-height: 1.2;
        }
        .co-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-top: 1px solid var(--line);
        }
        .co-row:first-child { border-top: none; }
        .co-row-label { font-size: 13px; color: var(--text-mute); }
        .co-row-value { font-size: 13px; color: var(--text); font-weight: 600; }
        .co-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          margin-top: 6px;
          border-top: 1px solid var(--line);
        }
        .co-total-label { font-size: 14px; font-weight: 700; color: var(--text-strong); }
        .co-total-amount { font-size: 22px; font-weight: 900; color: var(--hook); }
        .co-field { margin-bottom: 14px; }
        .co-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-mute);
          margin-bottom: 6px;
        }
        .co-input {
          width: 100%;
          height: 44px;
          border-radius: var(--r-sm);
          border: 1px solid var(--line);
          background: var(--tint-08);
          color: var(--text);
          font-size: 14px;
          padding: 0 14px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .co-input:focus { border-color: var(--hook); }
        .co-textarea {
          width: 100%;
          min-height: 80px;
          border-radius: var(--r-sm);
          border: 1px solid var(--line);
          background: var(--tint-08);
          color: var(--text);
          font-size: 14px;
          padding: 12px 14px;
          outline: none;
          box-sizing: border-box;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .co-textarea:focus { border-color: var(--hook); }
        .co-pay-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        .co-pay-btn {
          padding: 12px 8px;
          border-radius: var(--r-sm);
          border: 1.5px solid var(--line);
          background: var(--tint-08);
          color: var(--text);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          line-height: 1.3;
        }
        .co-pay-btn:hover { border-color: var(--hook); }
        .co-pay-btn.selected {
          border-color: var(--hook);
          background: color-mix(in srgb, var(--hook) 12%, transparent);
          color: var(--hook);
        }
        .co-pay-icon { font-size: 20px; display: block; margin-bottom: 4px; }
        .co-submit {
          width: 100%;
          height: 52px;
          border-radius: var(--r-card);
          background: var(--hook);
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          border: none;
          cursor: pointer;
          margin-top: 8px;
          transition: opacity 0.15s;
        }
        .co-submit:hover { opacity: 0.88; }
        /* 예약 완료 */
        .co-confirm-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--hook) 15%, transparent);
          border: 2px solid var(--hook);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin: 0 auto 16px;
        }
        .co-confirm-title {
          text-align: center;
          font-size: 20px;
          font-weight: 900;
          color: var(--text-strong);
          margin-bottom: 6px;
        }
        .co-confirm-no {
          text-align: center;
          font-size: 12px;
          color: var(--text-mute);
          margin-bottom: 20px;
        }
        .co-confirm-no span {
          font-weight: 800;
          color: var(--hook);
          font-size: 15px;
        }
        .co-confirm-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--line);
          font-size: 13px;
        }
        .co-confirm-row:last-child { border-bottom: none; }
        .co-confirm-key { color: var(--text-mute); }
        .co-confirm-val { color: var(--text-strong); font-weight: 700; }
        .co-save-btn {
          width: 100%;
          height: 48px;
          border-radius: var(--r-card);
          background: var(--tint-08);
          border: 1.5px solid var(--line);
          color: var(--text);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 16px;
          transition: border-color 0.15s;
        }
        .co-save-btn:hover { border-color: var(--hook); }
        .co-list-link {
          display: block;
          text-align: center;
          margin-top: 14px;
          font-size: 13px;
          color: var(--text-mute);
          text-decoration: none;
          transition: color 0.15s;
        }
        .co-list-link:hover { color: var(--hook); }

        @media (min-width: 768px) {
          .co-wrap {
            max-width: 960px;
            padding: 0 32px 80px;
          }
          .co-desktop-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            align-items: start;
          }
          .co-left { position: sticky; top: 24px; }
        }
      `}</style>

      <div className="co-wrap">
        <button className="co-back" onClick={() => router.back()}>
          ← 숙소 상세로 돌아가기
        </button>

        {!showConfirm ? (
          <>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-strong)", marginBottom: 20 }}>예약 확인 및 결제</h1>

            <form onSubmit={handleSubmit}>
              <div className="co-desktop-grid">
                {/* 왼쪽: 예약 요약 */}
                <div className="co-left">
                  {/* Step 1 — 예약 정보 확인 */}
                  <div className="co-section">
                    <div className="co-section-title">예약 정보 확인</div>
                    <div className="co-stay-header" style={{ marginBottom: 16 }}>
                      <div className="co-stay-emoji">{s.images[0]}</div>
                      <div>
                        <div className="co-stay-type">{STAY_TYPE_LABEL[s.type]} · {s.region}</div>
                        <div className="co-stay-name">{s.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 3 }}>
                          ★ {s.rating} ({s.reviewCount}개 리뷰)
                        </div>
                      </div>
                    </div>

                    <div className="co-row">
                      <span className="co-row-label">체크인</span>
                      <span className="co-row-value">{formatDate(checkIn)}</span>
                    </div>
                    <div className="co-row">
                      <span className="co-row-label">체크아웃</span>
                      <span className="co-row-value">{formatDate(checkOut)}</span>
                    </div>
                    <div className="co-row">
                      <span className="co-row-label">숙박 기간</span>
                      <span className="co-row-value">{nights}박</span>
                    </div>
                    <div className="co-row">
                      <span className="co-row-label">인원</span>
                      <span className="co-row-value">{guests}명</span>
                    </div>

                    <div className="co-total-row">
                      <span className="co-total-label">{s.pricePerNight.toLocaleString()}원 × {nights}박</span>
                      <span className="co-total-amount">{total.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 입력 폼 */}
                <div>
                  {/* Step 2 — 예약자 정보 */}
                  <div className="co-section">
                    <div className="co-section-title">예약자 정보</div>

                    <div className="co-field">
                      <label className="co-label" htmlFor="guest-name">이름 *</label>
                      <input
                        id="guest-name"
                        className="co-input"
                        type="text"
                        placeholder="홍길동"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className="co-field">
                      <label className="co-label" htmlFor="guest-phone">전화번호 *</label>
                      <input
                        id="guest-phone"
                        className="co-input"
                        type="tel"
                        placeholder="010-0000-0000"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        autoComplete="tel"
                      />
                    </div>
                    <div className="co-field" style={{ marginBottom: 0 }}>
                      <label className="co-label" htmlFor="guest-request">특별 요청사항 (선택)</label>
                      <textarea
                        id="guest-request"
                        className="co-textarea"
                        placeholder="새벽 픽업 요청, 어구 보관 필요 등 자유롭게 작성해 주세요."
                        value={request}
                        onChange={e => setRequest(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Step 3 — 결제 방법 */}
                  <div className="co-section">
                    <div className="co-section-title">결제 방법</div>
                    <div className="co-pay-grid">
                      <button
                        type="button"
                        className={`co-pay-btn${payMethod === "onsite" ? " selected" : ""}`}
                        onClick={() => setPayMethod("onsite")}
                        aria-pressed={payMethod === "onsite"}
                      >
                        <span className="co-pay-icon">💳</span>
                        현장 결제
                        <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2, color: "inherit", opacity: 0.7 }}>체크인 시 카드/현금</div>
                      </button>
                      <button
                        type="button"
                        className={`co-pay-btn${payMethod === "kakaopay" ? " selected" : ""}`}
                        onClick={() => setPayMethod("kakaopay")}
                        aria-pressed={payMethod === "kakaopay"}
                      >
                        <span className="co-pay-icon">💛</span>
                        카카오페이
                        <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2, color: "inherit", opacity: 0.7 }}>간편 결제</div>
                      </button>
                      <button
                        type="button"
                        className={`co-pay-btn${payMethod === "transfer" ? " selected" : ""}`}
                        onClick={() => setPayMethod("transfer")}
                        aria-pressed={payMethod === "transfer"}
                      >
                        <span className="co-pay-icon">🏦</span>
                        계좌이체
                        <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2, color: "inherit", opacity: 0.7 }}>무통장 입금</div>
                      </button>
                    </div>

                    {payMethod === "transfer" && (
                      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: "var(--r-sm)", background: "var(--tint-08)", border: "1px solid var(--line)", fontSize: 12, color: "var(--text-dim)" }}>
                        입금 계좌: 제주은행 123-456-789012 (예금주: {s.hostName})
                      </div>
                    )}
                    {payMethod === "kakaopay" && (
                      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: "var(--r-sm)", background: "var(--tint-08)", border: "1px solid var(--line)", fontSize: 12, color: "var(--text-dim)" }}>
                        예약 완료 후 카카오페이 결제 링크가 문자로 발송됩니다. (시뮬레이션)
                      </div>
                    )}
                  </div>

                  {/* 제출 버튼 */}
                  <button type="submit" className="co-submit">
                    🏠 {total.toLocaleString()}원 예약 확정
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          /* 예약 완료 화면 */
          <div style={{ maxWidth: 480, margin: "40px auto 0" }}>
            <div className="co-section" style={{ textAlign: "left" }}>
              <div className="co-confirm-badge">✅</div>
              <div className="co-confirm-title">예약이 완료되었습니다!</div>
              <div className="co-confirm-no">예약번호 <span>#{bookingNo}</span></div>

              <div className="co-confirm-row">
                <span className="co-confirm-key">숙소</span>
                <span className="co-confirm-val">{s.name}</span>
              </div>
              <div className="co-confirm-row">
                <span className="co-confirm-key">체크인</span>
                <span className="co-confirm-val">{formatDate(checkIn)}</span>
              </div>
              <div className="co-confirm-row">
                <span className="co-confirm-key">체크아웃</span>
                <span className="co-confirm-val">{formatDate(checkOut)} ({nights}박)</span>
              </div>
              <div className="co-confirm-row">
                <span className="co-confirm-key">인원</span>
                <span className="co-confirm-val">{guests}명</span>
              </div>
              <div className="co-confirm-row">
                <span className="co-confirm-key">예약자</span>
                <span className="co-confirm-val">{name}</span>
              </div>
              <div className="co-confirm-row">
                <span className="co-confirm-key">결제 방법</span>
                <span className="co-confirm-val">{PAY_LABELS[payMethod]}</span>
              </div>
              <div className="co-confirm-row" style={{ borderBottom: "none" }}>
                <span className="co-confirm-key">총 금액</span>
                <span style={{ fontWeight: 900, fontSize: 18, color: "var(--hook)" }}>{total.toLocaleString()}원</span>
              </div>
            </div>

            <button
              className="co-save-btn"
              onClick={() => alert("저장 기능 준비중입니다")}
            >
              📄 예약 확인서 저장
            </button>

            <Link href="/stay" className="co-list-link">
              ← 숙소 목록으로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
