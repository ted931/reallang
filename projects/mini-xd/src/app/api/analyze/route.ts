import { NextRequest } from "next/server";
import { getClient, createStreamingResponse } from "@/lib/claude";

export const maxDuration = 60;

const DIRECT_CODE_PROMPT = `You are a code generator. Output ONLY a single complete HTML file. No explanations. No markdown fences. No apologies. Start with <!DOCTYPE html> immediately.

Convert the design screenshot into a SINGLE self-contained HTML file using Tailwind CSS CDN.

RULES:
1. Start output with <!DOCTYPE html> — nothing before it
2. Include <script src="https://cdn.tailwindcss.com"></script> in <head>
3. Use ONLY Tailwind CSS utility classes for ALL styling. No custom CSS. No <style> tags.
4. Use standard HTML tags with Tailwind classes: <header class="flex items-center justify-between px-6 py-4 bg-white shadow">
5. Read EVERY text in the image exactly (Korean, Japanese, English) and include it
6. Match colors precisely using Tailwind arbitrary values: bg-[#1a2b5f], text-[#6b7280]
7. Navigation must be horizontal: flex flex-row items-center gap-6
8. For carousels/sliders with dots or arrows: use Swiper.js CDN
9. For images: <img src="https://placehold.co/WIDTHxHEIGHT" class="w-full h-auto object-cover" />
10. Make it responsive with max-w-[1200px] mx-auto container
11. Include ALL sections from top to bottom, miss nothing
12. For search forms: recreate each input field exactly as shown
13. Add hover effects: hover:bg-blue-700, hover:text-blue-600, etc.
14. Use proper spacing: p-4, px-6, py-3, gap-4, space-x-4, mb-8, etc.
15. Font: <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet">

ACCESSIBILITY (WCAG 2.1 AA):
16. Navigation: <nav role="navigation" aria-label="메인 메뉴"><ul class="flex ..."><li><a href="#">메뉴</a></li></ul></nav>
17. Buttons: <button type="button"> or <button type="submit"> — not <div> or <span>
18. Images: always include meaningful alt text
19. Form inputs: always pair with <label> or aria-label
20. Heading hierarchy: h1 → h2 → h3 in order, no skipping
21. Links: use <a href="#"> for navigation, <button> for actions
22. Landmarks: <header>, <main>, <footer>, <nav>, <section> with aria-label if multiple
23. Skip navigation: add <a href="#main" class="sr-only focus:not-sr-only">본문 바로가기</a> as first element`;

export async function POST(req: NextRequest) {
  const { image, mediaType, siteType } = await req.json();

  if (!image) {
    return Response.json({ error: "이미지가 제공되지 않았습니다." }, { status: 400 });
  }

  const client = getClient();

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 8192,
    temperature: 0.1,
    stream: true,
    messages: [
      { role: "system", content: DIRECT_CODE_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${mediaType || "image/webp"};base64,${image}` },
          },
          {
            type: "text",
            text: `Convert this design to a single HTML file with Tailwind CSS. Site type: ${siteType || "auto-detect"}. Include every section, every text, every color.`,
          },
        ],
      },
    ],
  });

  return new Response(createStreamingResponse(stream), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
