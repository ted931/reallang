import { NextResponse } from "next/server";

/**
 * 파티 참여 결제 API
 * 현재: 모의 결제 (PG 연동 전)
 * 추후: 토스페이먼츠 or 아임포트 연동
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "initialize": {
        // 결제 초기화 — PG사 결제창 호출 전 주문 생성
        const { partyId, partyTitle, amount, userName, phone } = body;

        if (!partyId || !amount || !userName) {
          return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
        }

        const orderId = `PARTY-${partyId.slice(0, 8)}-${Date.now()}`;

        // TODO: Supabase에 결제 레코드 생성
        // await supabase.from('payments').insert({
        //   order_id: orderId, party_id: partyId,
        //   amount, user_name: userName, status: 'pending'
        // });

        return NextResponse.json({
          orderId,
          amount,
          orderName: `파티 참여: ${partyTitle}`,
          customerName: userName,
          customerPhone: phone || "",
          // PG 연동 시 아래 필드 추가:
          // pgProvider: "tosspayments",
          // clientKey: process.env.TOSS_CLIENT_KEY,
          // successUrl: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/payments?action=success`,
          // failUrl: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/payments?action=fail`,
        });
      }

      case "confirm": {
        // 모의 결제 완료 처리
        const { orderId } = body;

        // TODO: PG 연동 시 결제 승인 API 호출
        // const toss = await fetch('https://api.tosspayments.com/v1/payments/confirm', { ... });

        // TODO: Supabase 결제 상태 업데이트
        // await supabase.from('payments').update({ status: 'completed', paid_at: new Date() }).eq('order_id', orderId);

        return NextResponse.json({
          success: true,
          transactionId: `TXN-${Date.now()}`,
          message: "결제가 완료되었습니다.",
          orderId,
        });
      }

      case "cafe-pass-purchase": {
        const { passId, passName, amount, userName } = body;

        if (!passId || !amount || !userName) {
          return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
        }

        const passOrderId = `PASS-${passId}-${Date.now()}`;

        return NextResponse.json({
          success: true,
          orderId: passOrderId,
          transactionId: `TXN-PASS-${Date.now()}`,
          message: `${passName} 구매가 완료되었습니다.`,
          passId,
          amount,
        });
      }

      case "refund": {
        const { orderId, reason } = body;

        // TODO: PG 환불 API 호출
        // TODO: Supabase 상태 업데이트

        return NextResponse.json({
          success: true,
          message: "환불이 처리되었습니다.",
          orderId,
          reason,
        });
      }

      default:
        return NextResponse.json({ error: "알 수 없는 액션입니다." }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: "결제 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
