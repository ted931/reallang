import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CanvasEditorClient } from "./canvas-editor-client";

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: canvas } = await supabase
    .from("canvases")
    .select("*")
    .eq("id", id)
    .single();

  if (!canvas) redirect("/dashboard");

  return (
    <CanvasEditorClient
      canvasId={id}
      title={canvas.title}
      initialSnapshot={canvas.canvas_snapshot}
      visibility={canvas.visibility}
      user={{ id: user.id, email: user.email! }}
    />
  );
}
