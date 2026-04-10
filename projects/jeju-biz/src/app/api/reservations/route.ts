import { NextResponse } from "next/server";
import { getRecentReservations } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ reservations: getRecentReservations(20) });
}
