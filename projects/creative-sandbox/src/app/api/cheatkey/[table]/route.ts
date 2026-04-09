import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAllowedTable } from "@/lib/cheatkey/whitelist";
import { createServerSupabase } from "@/lib/supabase/server";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;

  if (!isAllowedTable(table)) {
    return Response.json({ error: "허용되지 않은 테이블입니다." }, { status: 403 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter");

  const serviceClient = getServiceClient();
  let query = serviceClient.from(`sandbox_${table}`).select("*");

  if (filter) {
    try {
      const parsed = JSON.parse(filter);
      Object.entries(parsed).forEach(([key, value]) => {
        query = query.eq(key, value as string);
      });
    } catch {
      return Response.json({ error: "잘못된 필터 형식입니다." }, { status: 400 });
    }
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;

  if (!isAllowedTable(table)) {
    return Response.json({ error: "허용되지 않은 테이블입니다." }, { status: 403 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await req.json();

  const serviceClient = getServiceClient();
  const { data, error } = await serviceClient
    .from(`sandbox_${table}`)
    .insert({ ...body, _created_by: user.id })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
