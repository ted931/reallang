import { NextResponse } from "next/server";
import { getCSTickets } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ tickets: getCSTickets(15) });
}
