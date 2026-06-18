import { load } from "cheerio";

export type NationStory = {
  title: string;
  url: string;
  summary: string | null;
  topic: string | null;
  time: string | null;
};

const BASE_URL = "https://nation.africa";

export async function getTopNationStories(limit = 5): Promise<NationStory[]> {
  const response = await fetch(`${BASE_URL}/kenya`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return [];
  }

  const html = await response.text();
  const $ = load(html);
  const stories: NationStory[] = [];

  const teaserAnchors = $("a.article-collection-teaser").toArray();

  for (const anchor of teaserAnchors) {
    if (stories.length >= limit) {
      break;
    }

    const element = $(anchor);
    const href = element.attr("href")?.trim() ?? "";
    const title = element.attr("aria-label")?.trim() || element.find("h3").text().trim();
    const summary = element.find("p").first().text().trim() || null;
    const topic = element.find(".article-topic").first().text().trim() || null;
    const time = element.find(".date").first().text().trim() || null;

    if (!href || !title) {
      continue;
    }

    stories.push({
      title,
      url: href.startsWith("http") ? href : `${BASE_URL}${href}`,
      summary,
      topic,
      time,
    });
  }

  return stories;
}
