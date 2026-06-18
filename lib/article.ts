import { load } from "cheerio";

export async function fetchArticleText(url: string): Promise<string> {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== "https:" || parsedUrl.hostname !== "nation.africa") {
    throw new Error("Invalid article URL");
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://nation.africa/kenya",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = load(html);

  $("script, style, iframe, noscript, header, footer, nav, aside, form, svg, button, video, link").remove();

  const selectors = [
    "article",
    "main",
    "section.article",
    "section[id*='article']",
    ".article",
    ".article-body",
    ".article-content",
    ".content-body",
  ];

  let container = null;
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim().length > 200) {
      container = element;
      break;
    }
  }

  if (!container || !container.text().trim()) {
    container = $("body");
  }

  const paragraphs = container
    .find("p")
    .toArray()
    .map((p) => $(p).text().trim())
    .filter((text) => text.length > 0);

  const text = paragraphs.length > 0 ? paragraphs.join("\n\n") : container.text();
  const cleaned = text
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n\s*/g, "\n\n")
    .trim();

  if (!cleaned) {
    throw new Error("Could not extract readable article text");
  }

  return cleaned;
}

export async function summarizeArticleText(text: string): Promise<string> {
  const apiKey = process.env.OPEN_AI_KEY;
  if (!apiKey) {
    throw new Error("OPEN_AI_KEY is not configured");
  }

  const prompt = `Summarize the following news article into a concise plain-text summary. Keep the main facts, names, and key context. Do not include HTML or markup.\n\n${text}`;
  const truncatedText = prompt.length > 24000 ? prompt.slice(0, 24000) : prompt;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes news articles into concise, factual summaries.",
        },
        {
          role: "user",
          content: truncatedText,
        },
      ],
      temperature: 0.2,
      max_tokens: 450,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText} ${errorBody}`);
  }

  const data = await response.json();
  const message = data?.choices?.[0]?.message?.content;

  if (!message) {
    throw new Error("OpenAI did not return a summary");
  }

  return message.trim();
}
