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
  options?: string[];
}

const PRODUCTS: Product[] = [
  { id: 1, name: "꽁치 토막 (냉동) 1팩", price: 5000, emoji: "🐟", cat: "미끼", shop: "한림낚시마트", options: ["픽업가능"] },
  { id: 2, name: "크릴새우 (생) 1봉", price: 3500, emoji: "🦐", cat: "미끼", shop: "서귀포낚시점", options: ["픽업가능", "당일배달"] },
  { id: 3, name: "갈치 6단 채비", price: 8500, emoji: "🪝", cat: "채비·소품", shop: "애월낚시", options: ["픽업가능"] },
  { id: 4, name: "반유동 찌 세트", price: 12000, emoji: "🎣", cat: "채비·소품", shop: "성산낚시", options: ["픽업가능", "전국배송"] },
  { id: 5, name: "발광체 10개", price: 4000, emoji: "💡", cat: "소모품", shop: "한림낚시마트", options: ["픽업가능"] },
  { id: 6, name: "메탈 지그 200g", price: 18500, emoji: "🐠", cat: "채비·소품", shop: "모슬포낚시점", options: ["픽업가능", "전국배송"] },
  { id: 7, name: "낚시줄 3호 100m", price: 9000, emoji: "🧵", cat: "소모품", shop: "구좌낚시점", options: ["픽업가능"] },
  { id: 8, name: "갈치바늘 10개입", price: 3000, emoji: "🪝", cat: "소모품", shop: "한림낚시마트", options: ["픽업가능"] },
  { id: 9, name: "루어 케이스 대형", price: 22000, emoji: "📦", cat: "장비", shop: "제주낚시월드", options: ["픽업가능", "전국배송"] },
  { id: 10, name: "릴 손잡이 교체", price: 15000, emoji: "⚙️", cat: "장비", shop: "서귀포낚시점", options: ["픽업가능", "당일배달"] },
  { id: 11, name: "낚시 장갑 (방수)", price: 13000, emoji: "🧤", cat: "장비", shop: "한림낚시마트", options: ["픽업가능"] },
  { id: 12, name: "케미라이트 50개", price: 6000, emoji: "✨", cat: "소모품", shop: "애월낚시", options: ["픽업가능"] },
];

const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Record<number, number>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("fl-cart");
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    setMounted(true);
  }, []);

  function changeQty(id: number, delta: number) {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[id] ?? 0) + delta;
      if (newQty <= 0) delete next[id];
      else next[id] = newQty;
      return next;
    });
  }

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ product: PRODUCT_MAP[Number(id)], qty }))
    .filter((item) => item.product);

  const total = cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const totalCount = cartItems.reduce((sum, { qty }) => sum + qty, 0);

  function goCheckout() {
    sessionStorage.setItem("fl-cart", JSON.stringify(cart));
    router.push("/shop/checkout");
  }

  if (!mounted) return null;

  return (
    <>
      <style>{`
        .cart-wrap { max-width: 860px; margin: 0 auto; padding: 0 20px 100px; }
        .cart-item { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--line); }
        .cart-item-emoji { width: 54px; height: 54px; border-radius: var(--r-sm, 10px); background: var(--tint-06); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-qty-row { display: flex; align-items: center; gap: 8px; }
        .qty-btn { width: 28px; height: 28px; border-radius: 999px; border: 1px solid var(--line); background: var(--tint-08); color: var(--text-strong); font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; }
        .qty-btn:hover { border-color: var(--hook); color: var(--hook); }
        .cart-subtotal { font-size: 15px; font-weight: 800; color: var(--hook-300, #f59e0b); white-space: nowrap; }
        .cart-footer { position: fixed; bottom: 0; left: 0; right: 0; background: var(--tint-04); border-top: 1px solid var(--line); padding: 14px 20px; z-index: 50; }
        .cart-footer-inner { max-width: 860px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .btn-checkout { padding: 13px 28px; border-radius: var(--r-sm, 10px); border: none; background: var(--hook); color: #0a1628; font-weight: 800; font-size: 15px; cursor: pointer; font-family: inherit; }
        .badge-pickup { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 999px; background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.3); }
        .badge-delivery { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 999px; background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
        @media (min-width: 768px) {
          .cart-item-emoji { width: 64px; height: 64px; font-size: 32px; }
        }
      `}</style>

      <div className="cart-wrap">
        {/* 헤더 */}
        <div style={{ padding: "24px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            href="/shop"
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
              textDecoration: "none",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ←
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-strong)", margin: 0 }}>
            장바구니
          </h1>
          {totalCount > 0 && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 999,
                background: "var(--tint-08)",
                color: "var(--text-dim)",
              }}
            >
              {totalCount}개
            </span>
          )}
        </div>

        {/* 비어 있는 경우 */}
        {cartItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "var(--text-dim)",
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-strong)", marginBottom: 8 }}>
              장바구니가 비었습니다
            </div>
            <div style={{ fontSize: 14, marginBottom: 28 }}>채비·미끼 상품을 담아보세요</div>
            <Link
              href="/shop"
              style={{
                display: "inline-block",
                padding: "11px 28px",
                borderRadius: "var(--r-sm, 10px)",
                background: "var(--hook)",
                color: "#0a1628",
                fontWeight: 800,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <>
            {/* 상품 목록 */}
            <div
              style={{
                borderRadius: "var(--r-card, 16px)",
                border: "1px solid var(--line)",
                background: "var(--tint-04)",
                padding: "0 16px",
                marginBottom: 16,
              }}
            >
              {cartItems.map(({ product, qty }, idx) => (
                <div className="cart-item" key={product.id}>
                  <div className="cart-item-emoji">{product.emoji}</div>
                  <div className="cart-item-info">
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)", marginBottom: 3, lineHeight: 1.3 }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 6 }}>
                      {product.shop}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                      {product.options?.includes("픽업가능") && (
                        <span className="badge-pickup">📍 픽업</span>
                      )}
                      {product.options?.includes("당일배달") && (
                        <span className="badge-delivery">🚴 당일배달</span>
                      )}
                    </div>
                    <div className="cart-qty-row">
                      <button className="qty-btn" onClick={() => changeQty(product.id, -1)}>−</button>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)", minWidth: 20, textAlign: "center" }}>
                        {qty}
                      </span>
                      <button className="qty-btn" onClick={() => changeQty(product.id, 1)}>+</button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 4 }}>
                      {product.price.toLocaleString()}원 × {qty}
                    </div>
                    <div className="cart-subtotal">
                      {(product.price * qty).toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 합계 요약 */}
            <div
              style={{
                borderRadius: "var(--r-card, 16px)",
                border: "1px solid var(--line)",
                background: "var(--tint-04)",
                padding: "16px 20px",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-dim)" }}>상품 합계</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)" }}>{total.toLocaleString()}원</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "var(--text-dim)" }}>배송비</span>
                <span style={{ fontSize: 13, color: "#4ade80", fontWeight: 700 }}>픽업 시 무료</span>
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
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)" }}>결제 예정 금액</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "var(--hook, #f59e0b)" }}>
                  {total.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 계속 쇼핑 링크 */}
            <div style={{ textAlign: "center", paddingBottom: 20 }}>
              <Link
                href="/shop"
                style={{
                  fontSize: 13,
                  color: "var(--text-dim)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                ← 계속 쇼핑하기
              </Link>
            </div>
          </>
        )}
      </div>

      {/* 하단 주문하기 바 */}
      {cartItems.length > 0 && (
        <div className="cart-footer">
          <div className="cart-footer-inner">
            <div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 2 }}>총 {totalCount}개 상품</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text-strong)" }}>
                {total.toLocaleString()}원
              </div>
            </div>
            <button className="btn-checkout" onClick={goCheckout}>
              주문하기 →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
