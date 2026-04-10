import { NextResponse } from "next/server";
import { getWeeklyStats } from "@/lib/mock-data";

// TODO: Supabase로 교체 시 이 파일만 수정
export async function GET() {
  const stats = getWeeklyStats();
  const today = stats[stats.length - 1];
  return NextResponse.json({
    weekly: stats,
    today: {
      revenue: today.revenue,
      reservations: today.reservations,
      cancelations: today.cancelations,
      visitors: today.visitors,
    },
    summary: {
      weeklyRevenue: stats.reduce((a, s) => a + s.revenue, 0),
      weeklyReservations: stats.reduce((a, s) => a + s.reservations, 0),
      avgDaily: Math.round(stats.reduce((a, s) => a + s.revenue, 0) / 7),
    },
  });
}
