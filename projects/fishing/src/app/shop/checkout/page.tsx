"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  cat: string;
  shop: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "꽁치 토막 (냉동) 1팩", price: 5000, emoji: "🐟", cat: "미끼", shop: "한림낚시마트" },
  { id: 2, name: "크릴새우 (생) 1봉", price: 3500, emoji: "🦐", cat: "미끼", shop: "서귀포낚시점" },
  { id: 3, name: "갈치 6단 채비", price: 8500, emoji: "🪝", cat: "채비·소품", shop: "애월낚시" },
  { id: 4, name: "반유동 찌 세트", price: 12000, emoji: "🎣", cat: "채비·소품", shop: "성산낚시" },
  { id: 5, name: "발광체 10개", price: 4000, emoji: "💡", cat: "소모품", shop: "한림낚시마트" },
  { id: 6, name: "메탈 지그 200g", price: 18500, emoji: "🐠", cat: "채비·소품", shop: "모슬포낚시점" },
  { id: 7, name: "낚시줄 3호 100m", price: 9000, emoji: "🧵", cat: "소모품", shop: "구좌낚시점" },
  { id: 8, name: "갈치바늘 10개입", price: 3000, emoji: "🪝", cat: "소모품", shop: "한림낚시마트" },
  { id: 9, name: "루어 케이스 대형", price: 22000, emoji: "📦", cat: "장비", shop: "제주낚시월드" },
  { id: 10, name: "릴 손잡이 교체", price: 15000, emoji: "⚙️", cat: "장비", shop: "서귀포낚시점" },
  { id: 11, name: "낚시 장갑 (방수)", price: 13000, emoji: "🧤", cat: "장비", shop: "한림낚시마트" },
  { id: 12, name: "케미라이트 50개", price: 6000, emoji: "✨", cat: "소모품", shop: "애월낚시" },
];

const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

type DeliveryMethod = "pickup" | "delivery" | "parcel";
type PaymentMethod = "onsite" | "kakaopay" | "transfer";

const PICKUP_TIMES = [
  "오전 8:00", "오전 9:00", "오전 10:00", "오전 11:00",
  "오후 12:00", "오후 1:00", "오후 2:00", "오후 3:00",
  "오후 4:00", "오후 5:00", "오후 6:00",
];

function randomOrderNum() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Record<number, number>>({});
  const [mounted, setMounted] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryMethod>("pickup");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState(PICKUP_TIMES[2]);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("onsite");

  const [showComplete, setShowComplete] = useState(false);
  const [orderNum] = useState(() => randomOrderNum());

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("fl-cart");
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    // 오늘 날짜를 픽업 날짜 기본값으로
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setPickupDate(`${yyyy}-${mm}-${dd}`);
    setMounted(true);
  }, []);

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ product: PRODUCT_MAP[Number(id)], qty }))
    .filter((item) => item.product);

  const total = cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0);

  function handleOrder() {
    if (!name.trim()) { alert("예약자 이름을 입력해주세요."); return; }
    if (!phone.trim()) { alert("전화번호를 입력해주세요."); return; }
    if (delivery !== "pickup" && !address.trim()) { alert("배송 주소를 입력해주세요."); return; }
    sessionStorage.removeItem("fl-cart");
    setShowComplete(true);
  }

  if (!mounted) return null;

  /* 주문 완료 화면 */
  if (showComplete) {
    return (
      <>
        <style>{`
          .co-wrap { max-width: 640px; margin: 0 auto; padding: 0 20px 100px; }
        `}</style>
        <div className="co-wrap" style={{ textAlign: "center", paddingTop: 80 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎣</div>
          <div
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#4ade80",
              background: "rgba(74,222,128,0.12)",
              border: "1px solid rgba(74,222,128,0.3)",
              borderRadius: 999,
              padding: "4px 14px",
              marginBottom: 20,
            }}
          >
            주문 완료
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-strong)", marginBottom: 8 }}>
            주문이 접수되었습니다!
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 32, lineHeight: 1.6 }}>
            낚시점에서 확인 후 연락드립니다.<br />즐거운 출조 되세요!
          </p>
          <div
            style={{
              borderRadius: "var(--r-card, 16px)",
              border: "1px solid var(--line)",
              background: "var(--tint-04)",
              padding: "20px 24px",
              marginBottom: 32,
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 6 }}>주문번호</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--hook, #f59e0b)", letterSpacing: "0.12em" }}>
              #{orderNum}
            </div>
            <div
              style={{
                borderTop: "1px solid var(--line)",
                marginTop: 16,
                paddingTop: 16,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>결제 예정 금액</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: "var(--text-strong)" }}>
                {total.toLocaleString()}원
              </span>
            </div>
          </div>
          <Link
            href="/shop"
            style={{
              display: "inline-block",
              padding: "13px 32px",
              borderRadius: "var(--r-sm, 10px)",
              background: "var(--hook)",
              color: "#0a1628",
              fontWeight: 800,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            쇼핑 계속하기
          </Link>
        </div>
      </>
    );
  }

  const sectionStyle: React.CSSProperties = {
    borderRadius: "var(--r-card, 16px)",
    border: "1px solid var(--line)",
    background: "var(--tint-04)",
    padding: "18px 20px",
    marginBottom: 12,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--text-dim)",
    marginBottom: 6,
    display: "block",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    borderRadius: "var(--r-sm, 10px)",
    border: "1px solid var(--line)",
    background: "var(--tint-08)",
    color: "var(--text-strong)",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  };

  function MethodBtn({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) {
    return (
      <button
        onClick={onClick}
        style={{
          flex: 1,
          padding: "10px 6px",
          borderRadius: "var(--r-sm, 10px)",
          border: `1.5px solid ${active ? "var(--hook)" : "var(--line)"}`,
          background: active ? "rgba(245,158,11,0.1)" : "transparent",
          color: active ? "var(--hook, #f59e0b)" : "var(--text-dim)",
          fontWeight: active ? 800 : 600,
          fontSize: 13,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.15s",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      <style>{`
        .co-wrap { max-width: 640px; margin: 0 auto; padding: 0 20px 100px; }
        .co-footer { position: fixed; bottom: 0; left: 0; right: 0; background: var(--tint-04); border-top: 1px solid var(--line); padding: 14px 20px; z-index: 50; }
        .co-footer-inner { max-width: 640px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .btn-order { padding: 13px 28px; border-radius: var(--r-sm, 10px); border: none; background: var(--hook); color: #0a1628; font-weight: 800; font-size: 15px; cursor: pointer; font-family: inherit; }
        select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
        @media (min-width: 768px) {
          .co-name-phone { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        }
      `}</style>

      <div className="co-wrap">
        {/* 헤더 */}
        <div style={{ padding: "24px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => router.back()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "var(--r-sm, 10px)",
              border: "1px solid var(--line)",
              background: "var(--tint-08)",
              color: "var(--text-dim)",
              fontSize: 18,
              cursor: "pointer",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-strong)", margin: 0 }}>
            주문하기
          </h1>
        </div>

        {/* 주문 상품 목록 (읽기 전용) */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)", marginBottom: 12 }}>
            주문 상품 ({cartItems.length}종)
          </div>
          {cartItems.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text-dim)", textAlign: "center", padding: "20px 0" }}>
              장바구니가 비었습니다.{" "}
              <Link href="/shop" style={{ color: "var(--hook)", textDecoration: "underline" }}>
                쇼핑하러 가기
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cartItems.map(({ product, qty }) => (
                <div
                  key={product.id}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--r-sm, 10px)",
                      background: "var(--tint-08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {product.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)", lineHeight: 1.3 }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{product.shop}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>× {qty}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--hook, #f59e0b)" }}>
                      {(product.price * qty).toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 배송 방법 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)", marginBottom: 12 }}>
            배송 방법
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <MethodBtn active={delivery === "pickup"} onClick={() => setDelivery("pickup")}>
              📍 픽업
            </MethodBtn>
            <MethodBtn active={delivery === "delivery"} onClick={() => setDelivery("delivery")}>
              🚴 당일 배달
            </MethodBtn>
            <MethodBtn active={delivery === "parcel"} onClick={() => setDelivery("parcel")}>
              📦 택배
            </MethodBtn>
          </div>

          {delivery === "pickup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={labelStyle}>픽업 날짜</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>픽업 시간</label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  style={inputStyle}
                >
                  {PICKUP_TIMES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#60a5fa",
                  background: "rgba(96,165,250,0.08)",
                  border: "1px solid rgba(96,165,250,0.2)",
                  borderRadius: "var(--r-sm, 10px)",
                  padding: "10px 14px",
                  lineHeight: 1.6,
                }}
              >
                📍 낚시점 주소는 주문 확인 후 문자로 안내드립니다.
              </div>
            </div>
          )}

          {(delivery === "delivery" || delivery === "parcel") && (
            <div>
              <label style={labelStyle}>
                {delivery === "delivery" ? "배달 주소" : "택배 받을 주소"}
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="제주특별자치도 제주시 ..."
                rows={3}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              />
              {delivery === "delivery" && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "#4ade80",
                    background: "rgba(74,222,128,0.08)",
                    border: "1px solid rgba(74,222,128,0.2)",
                    borderRadius: "var(--r-sm, 10px)",
                    padding: "10px 14px",
                    lineHeight: 1.6,
                  }}
                >
                  🚴 당일 배달 — 오전 11시 전 주문 시 당일 배송 가능합니다.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 예약자 정보 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)", marginBottom: 12 }}>
            예약자 정보
          </div>
          <div className="co-name-phone" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={labelStyle}>이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* 결제 방법 */}
        <div style={sectionStyle}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)", marginBottom: 12 }}>
            결제 방법
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <MethodBtn active={payment === "onsite"} onClick={() => setPayment("onsite")}>
              💵 현장결제
            </MethodBtn>
            <MethodBtn active={payment === "kakaopay"} onClick={() => setPayment("kakaopay")}>
              💛 카카오페이
            </MethodBtn>
            <MethodBtn active={payment === "transfer"} onClick={() => setPayment("transfer")}>
              🏦 계좌이체
            </MethodBtn>
          </div>
          {payment === "kakaopay" && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "#fbbf24",
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.2)",
                borderRadius: "var(--r-sm, 10px)",
                padding: "10px 14px",
              }}
            >
              주문 완료 후 카카오페이 결제 링크를 문자로 발송해드립니다.
            </div>
          )}
          {payment === "transfer" && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "var(--text-dim)",
                background: "var(--tint-08)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-sm, 10px)",
                padding: "10px 14px",
                lineHeight: 1.7,
              }}
            >
              계좌번호는 주문 완료 후 문자로 안내드립니다.
            </div>
          )}
        </div>

        {/* 금액 요약 */}
        <div style={{ ...sectionStyle, marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--text-dim)" }}>상품 합계</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)" }}>
              {total.toLocaleString()}원
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: "var(--text-dim)" }}>배송비</span>
            <span style={{ fontSize: 13, color: "#4ade80", fontWeight: 700 }}>
              {delivery === "pickup" ? "무료 (픽업)" : delivery === "delivery" ? "무료 (당일배달)" : "3,000원"}
            </span>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--line)",
              marginTop: 12,
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)" }}>최종 결제 금액</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: "var(--hook, #f59e0b)" }}>
              {(total + (delivery === "parcel" ? 3000 : 0)).toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      {/* 하단 주문 완료 버튼 */}
      <div className="co-footer">
        <div className="co-footer-inner">
          <div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 2 }}>
              {delivery === "pickup" ? "픽업 " + pickupDate + " " + pickupTime : delivery === "delivery" ? "당일 배달" : "택배"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text-strong)" }}>
              {(total + (delivery === "parcel" ? 3000 : 0)).toLocaleString()}원
            </div>
          </div>
          <button className="btn-order" onClick={handleOrder}>
            주문 완료
          </button>
        </div>
      </div>
    </>
  );
}
