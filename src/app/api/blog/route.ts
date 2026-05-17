import { NextResponse } from "next/server";
import { addPost, type BlogPost } from "@/lib/blog";

export async function POST(request: Request) {
  try {
    const post: BlogPost = await request.json();
    if (!post.slug || !post.title) {
      return NextResponse.json({ error: "slug와 title은 필수입니다." }, { status: 400 });
    }
    addPost(post);
    return NextResponse.json({ url: `/blog/${post.slug}`, slug: post.slug });
  } catch {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
