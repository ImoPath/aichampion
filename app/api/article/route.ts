import { NextResponse } from "next/server";
import { fetchArticleText, summarizeArticleText } from "../../../lib/article";

export async function POST(request: Request) {
  const body = await request.json();
  const url = String(body?.url ?? "").trim();
  const mode = body?.mode === "full" ? "full" : "summary";

  if (!url) {
    return NextResponse.json({ error: "Missing article URL" }, { status: 400 });
  }

  try {
    const articleText = await fetchArticleText(url);

    if (mode === "full") {
      return NextResponse.json({ content: articleText });
    }

    const summary = await summarizeArticleText(articleText);
    return NextResponse.json({ content: summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
