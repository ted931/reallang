"use client";
import { useState } from "react";
import Link from "next/link";

type Category = "전체" | "미끼" | "채비·소품" | "장비" | "소모품";
type DeliveryOption = "픽업 가능" | "당일 배달" | "전국 배송";

const CATEGORY_COLORS: Record<Category, string> = {
  "전체": "var(--ocean-400)",
  "미끼": "#4ade80",
  "채비·소품": "var(--hook-300)",
  "장비": "#60a5fa",
  "소모품": "#c084fc",
};

interface Product {
  id: number;
  name: string;
  category: Exclude<Category, "전체">;
  price: number;
  shop: string;
  emoji: string;
  options: string[];
  region: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "꽁치 토막 (냉동) 1팩",
    category: "미끼",
    price: 5000,
    shop: "한림낚시마트",
    emoji: "🐟",
    options: ["픽업가능", "재고있음"],
    region: "한림",
  },
  {
    id: 2,
    name: "크릴새우 (생) 1봉",
    category: "미끼",
    price: 3500,
    shop: "서귀포낚시점",
    emoji: "🦐",
    options: ["픽업가능", "당일배달", "재고있음"],
    region: "서귀포",
  },
  {
    id: 3,
    name: "갈치 6단 채비",
    category: "채비·소품",
    price: 8500,
    shop: "애월낚시",
    emoji: "🪝",
    options: ["픽업가능", "재고있음"],
    region: "애월",
  },
  {
    id: 4,
    name: "반유동 찌 세트",
    category: "채비·소품",
    price: 12000,
    shop: "성산낚시",
    emoji: "🎣",
    options: ["픽업가능", "전국배송", "재고있음"],
    region: "성산",
  },
  {
    id: 5,
    name: "발광체 10개",
    category: "소모품",
    price: 4000,
    shop: "한림낚시마트",
    emoji: "💡",
    options: ["픽업가능", "재고있음"],
    region: "한림",
  },
  {
    id: 6,
    name: "메탈 지그 200g",
    category: "채비·소품",
    price: 18500,
    shop: "모슬포낚시",
    emoji: "🐠",
    options: ["픽업가능", "전국배송", "재고있음"],
    region: "모슬포",
  },
  {
    id: 7,
    name: "낚시줄 3호 100m",
    category: "소모품",
    price: 9000,
    shop: "구좌낚시점",
    emoji: "🧵",
    options: ["픽업가능", "재고있음"],
    region: "구좌",
  },
  {
    id: 8,
    name: "갈치바늘 10개입",
    category: "소모품",
    price: 3000,
    shop: "한림낚시마트",
    emoji: "🪝",
    options: ["픽업가능", "재고있음"],
    region: "한림",
  },
  {
    id: 9,
    name: "릴 낚시대 세트 (입문)",
    category: "장비",
    price: 85000,
    shop: "서귀포낚시점",
    emoji: "🎿",
    options: ["픽업가능", "전국배송", "재고있음"],
    region: "서귀포",
  },
  {
    id: 10,
    name: "아이스박스 30L",
    category: "장비",
    price: 45000,
    shop: "애월낚시",
    emoji: "🧊",
    options: ["픽업가능", "당일배달"],
    region: "애월",
  },
  {
    id: 11,
    name: "집어등 (LED)",
    category: "장비",
    price: 32000,
    shop: "성산낚시",
    emoji: "🔦",
    options: ["픽업가능", "전국배송", "재고있음"],
    region: "성산",
  },
  {
    id: 12,
    name: "목줄 1.5호",
    category: "소모품",
    price: 6500,
    shop: "모슬포낚시",
    emoji: "🧶",
    options: ["픽업가능", "재고있음"],
    region: "모슬포",
  },
];

const CATEGORIES: Category[] = ["전체", "미끼", "채비·소품", "장비", "소모품"];
const DELIVERY_OPTIONS: DeliveryOption[] = ["픽업 가능", "당일 배달", "전국 배송"];

const OPTION_BADGE_STYLE: Record<string, React.CSSProperties> = {
  픽업가능: { background: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.3)" },
  당일배달: { background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" },
  전국배송: { background: "rgba(192,132,252,0.15)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" },
  재고있음: { background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" },
};

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");
  const [activeDelivery, setActiveDelivery] = useState<DeliveryOption | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});

  const cartTotal = Object.values(cart).reduce((a, b) => a + b, 0);

  const filtered = PRODUCTS.filter((p) => {
    if (activeCategory !== "전체" && p.category !== activeCategory) return false;
    if (activeDelivery === "픽업 가능" && !p.options.includes("픽업가능")) return false;
    if (activeDelivery === "당일 배달" && !p.options.includes("당일배달")) return false;
    if (activeDelivery === "전국 배송" && !p.options.includes("전국배송")) return false;
    return true;
  });

  function addToCart(id: number) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  return (
    <>
      {/* 히어로 */}
      <section
        className="fl-hero"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(160deg, #0a1628 0%, #0f2a45 50%, #163a56 100%)",
          padding: "48px 20px 56px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--hook) 0px, var(--hook) 1px, transparent 1px, transparent 50px)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(var(--hook-rgb,245,158,11),0.1)",
              border: "1px solid rgba(var(--hook-rgb,245,158,11),0.3)",
              color: "var(--hook)",
              fontSize: 12,
              padding: "5px 14px",
              borderRadius: 999,
              marginBottom: 16,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            🛒 FISHING SHOP
          </div>
          <h1
            style={{
              fontSize: "clamp(26px, 7vw, 40px)",
              fontWeight: 900,
              color: "#f1f5f9",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            채비·미끼 주문
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, marginBottom: 0 }}>
            출조 전날 주문 → 당일 픽업 or 배달
          </p>
        </div>
        <svg
          style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block" }}
          viewBox="0 0 400 32"
          preserveAspectRatio="none"
        >
          <path d="M0,20 C80,8 160,28 240,18 C320,8 360,24 400,18 L400,32 L0,32 Z" fill="var(--tint-04, #0f172a)" />
        </svg>
      </section>

      {/* 카테고리 탭 */}
      <div
        className="fl-cm-tabs"
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          padding: "16px 20px 4px",
          scrollbarWidth: "none",
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              fontFamily: "inherit",
              flexShrink: 0,
              padding: "7px 16px",
              borderRadius: 999,
              border: "1px solid",
              fontSize: 13,
              fontWeight: activeCategory === cat ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.15s",
              background: activeCategory === cat ? CATEGORY_COLORS[cat] : "transparent",
              borderColor: activeCategory === cat ? CATEGORY_COLORS[cat] : "var(--line)",
              color: activeCategory === cat ? (cat === "전체" ? "#fff" : "#0a1628") : "var(--text-dim)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 배달 옵션 칩 */}
      <div
        className="fl-chips"
        style={{ display: "flex", gap: 8, padding: "10px 20px 16px", overflowX: "auto", scrollbarWidth: "none" }}
      >
        {DELIVERY_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setActiveDelivery(activeDelivery === opt ? null : opt)}
            style={{
              fontFamily: "inherit",
              flexShrink: 0,
              padding: "5px 14px",
              borderRadius: 999,
              border: "1px solid",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              background: activeDelivery === opt ? "var(--hook)" : "var(--tint-06)",
              borderColor: activeDelivery === opt ? "var(--hook)" : "var(--line-2)",
              color: activeDelivery === opt ? "#0a1628" : "var(--text-dim)",
            }}
          >
            {opt === "픽업 가능" ? "📍 픽업 가능" : opt === "당일 배달" ? "🚴 당일 배달" : "📦 전국 배송"}
          </button>
        ))}
        <span style={{ fontSize: 12, color: "var(--text-mute)", alignSelf: "center", marginLeft: 4 }}>
          {filtered.length}개
        </span>
      </div>

      {/* 상품 그리드 */}
      <style>{`
        @media (min-width: 768px) {
          .shop-grid { grid-template-columns: repeat(4, 1fr) !important; max-width: 960px; margin-left: auto; margin-right: auto; }
        }
      `}</style>
      <div
        className="shop-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          padding: "0 16px 120px",
        }}
      >
        {filtered.map((product) => {
          const qty = cart[product.id] ?? 0;
          const catColor = CATEGORY_COLORS[product.category];
          return (
            <div
              key={product.id}
              style={{
                borderRadius: "var(--r-card, 16px)",
                border: "1px solid var(--line)",
                background: "var(--tint-04)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* 카드 상단 배지 + 낚시점명 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px 0",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: `${catColor}22`,
                    color: catColor,
                    border: `1px solid ${catColor}44`,
                  }}
                >
                  {product.category}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-mute)" }}>{product.shop}</span>
              </div>

              {/* 이모지 영역 */}
              <div
                style={{
                  background: "var(--tint-06)",
                  margin: "8px 10px",
                  borderRadius: "var(--r-sm, 10px)",
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 38,
                }}
              >
                {product.emoji}
              </div>

              {/* 상품 정보 */}
              <div style={{ padding: "0 10px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-strong)", lineHeight: 1.3 }}>
                  {product.name}
                </div>
                <div style={{ fontSize: 17, fontWeight: 900, color: "var(--hook-300)" }}>
                  {product.price.toLocaleString()}
                  <span style={{ fontSize: 12, fontWeight: 600 }}>원</span>
                </div>

                {/* 옵션 배지 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {product.options.map((opt) => (
                    <span
                      key={opt}
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 999,
                        ...(OPTION_BADGE_STYLE[opt] ?? {}),
                      }}
                    >
                      {opt}
                    </span>
                  ))}
                </div>

                {/* 담기 버튼 + 수량 */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <button
                    onClick={() => addToCart(product.id)}
                    style={{
                      fontFamily: "inherit",
                      flex: 1,
                      padding: "7px 0",
                      borderRadius: "var(--r-sm, 10px)",
                      border: "none",
                      background: "var(--hook)",
                      color: "#0a1628",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: "pointer",
                      transition: "opacity 0.15s",
                    }}
                  >
                    담기
                  </button>
                  {qty > 0 && (
                    <span
                      style={{
                        flexShrink: 0,
                        minWidth: 24,
                        height: 24,
                        borderRadius: 999,
                        background: "var(--tint-08)",
                        color: "var(--text-strong)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {qty}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 낚시점 입점 안내 */}
      <div
        style={{
          margin: "0 16px 32px",
          padding: "16px 20px",
          borderRadius: "var(--r-card, 16px)",
          border: "1px solid var(--line-2)",
          background: "var(--tint-05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)", marginBottom: 3 }}>
            낚시점 사장님이라면?
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>상품 올리고 주문 받기</div>
        </div>
        <Link href="/biz">
          <button
            style={{
              fontFamily: "inherit",
              flexShrink: 0,
              padding: "8px 16px",
              borderRadius: "var(--r-sm, 10px)",
              border: "1px solid var(--hook)",
              background: "transparent",
              color: "var(--hook)",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            입점 신청 →
          </button>
        </Link>
      </div>

      {/* 장바구니 플로팅 버튼 */}
      {cartTotal > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 20,
            zIndex: 100,
          }}
        >
          <button
            onClick={() => alert(`장바구니 ${cartTotal}개 담겼습니다.\n주문 기능은 준비 중입니다.`)}
            style={{
              fontFamily: "inherit",
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "none",
              background: "var(--hook)",
              color: "#0a1628",
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            🛒
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#ef4444",
                color: "#fff",
                fontSize: 11,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cartTotal}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
