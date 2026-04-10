import { NextRequest, NextResponse } from "next/server";
import satori from "satori";

/**
 * OG 이미지 생성 API
 * 사용: /api/og?title=제주힐링코스&days=2&cost=35만원&spots=5
 * 카카오톡/인스타 공유 시 미리보기 이미지로 사용
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "AI 추천 제주 코스";
    const days = searchParams.get("days") || "2";
    const cost = searchParams.get("cost") || "";
    const spots = searchParams.get("spots") || "";
    const type = searchParams.get("type") || "course"; // course | plan | drive

    const colors = {
      course: { bg: "#7C3AED", light: "#EDE9FE" },
      plan: { bg: "#059669", light: "#D1FAE5" },
      drive: { bg: "#0284C7", light: "#E0F2FE" },
    };
    const c = colors[type as keyof typeof colors] || colors.course;

    // satori로 SVG 생성
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(135deg, ${c.bg}, ${c.bg}dd)`,
            fontFamily: "sans-serif",
            padding: "60px",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "20px",
                  padding: "40px 60px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: { fontSize: "24px", color: "rgba(255,255,255,0.7)", marginBottom: "12px" },
                      children: type === "course" ? "AI 제주 코스" : type === "plan" ? "AI 여행 일정" : "날씨 드라이브",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { fontSize: "48px", fontWeight: 700, color: "white", textAlign: "center", marginBottom: "24px" },
                      children: title,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", gap: "24px" },
                      children: [
                        days && {
                          type: "div",
                          props: {
                            style: { background: "rgba(255,255,255,0.2)", borderRadius: "12px", padding: "8px 20px", color: "white", fontSize: "20px" },
                            children: `${days}일`,
                          },
                        },
                        spots && {
                          type: "div",
                          props: {
                            style: { background: "rgba(255,255,255,0.2)", borderRadius: "12px", padding: "8px 20px", color: "white", fontSize: "20px" },
                            children: `${spots}곳`,
                          },
                        },
                        cost && {
                          type: "div",
                          props: {
                            style: { background: "rgba(255,255,255,0.2)", borderRadius: "12px", padding: "8px 20px", color: "white", fontSize: "20px" },
                            children: cost,
                          },
                        },
                      ].filter(Boolean),
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: { marginTop: "30px", fontSize: "18px", color: "rgba(255,255,255,0.6)" },
                children: "realang.store",
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [],
      }
    );

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("OG image error:", error);
    return NextResponse.json({ error: "OG 이미지 생성 실패" }, { status: 500 });
  }
}
