"use client";

import { useState } from "react";
import type { NationStory } from "../lib/nation";

type StoryFetchState = {
  status: "idle" | "loading" | "ready" | "error";
  content?: string;
  error?: string;
};

export default function TopStories({ stories }: { stories: NationStory[] }) {
  const [storyStates, setStoryStates] = useState<Record<string, StoryFetchState>>({});
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleAction = async (story: NationStory, mode: "summary" | "full") => {
    const key = `${story.url}::${mode}`;
    setActiveKey(key);
    setStoryStates((prev) => ({
      ...prev,
      [key]: {
        status: "loading",
      },
    }));

    try {
      const response = await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: story.url, mode }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to load article");
      }

      setStoryStates((prev) => ({
        ...prev,
        [key]: {
          status: "ready",
          content: payload.content,
        },
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStoryStates((prev) => ({
        ...prev,
        [key]: {
          status: "error",
          error: message,
        },
      }));
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1">
      {stories.map((story) => {
        const summaryKey = `${story.url}::summary`;
        const fullKey = `${story.url}::full`;
        const selectedKey = activeKey === summaryKey || activeKey === fullKey ? activeKey : null;
        const fetchState = selectedKey ? storyStates[selectedKey] : null;

        return (
          <div
            key={story.url}
            className="group rounded-3xl border border-black/5 bg-white p-6 transition hover:border-sky-500 hover:bg-sky-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:border-sky-400 dark:hover:bg-zinc-900"
          >
            <div className="flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <span>{story.topic || "Kenya"}</span>
              {story.time ? <span>{story.time}</span> : null}
            </div>
            <h3 className="mt-3 text-xl font-semibold text-black dark:text-zinc-100 group-hover:text-sky-600">
              {story.title}
            </h3>
            {story.summary ? (
              <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                {story.summary}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:border-sky-400 dark:text-sky-300 dark:hover:bg-sky-500/10"
                onClick={() => handleAction(story, "summary")}
              >
                Summarize
              </button>
              <button
                type="button"
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/5"
                onClick={() => handleAction(story, "full")}
              >
                Show full article
              </button>
              <a
                href={story.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/5"
              >
                Open original
              </a>
            </div>

            {fetchState ? (
              <div className="mt-6 rounded-3xl border border-black/5 bg-zinc-50 p-5 text-sm leading-7 text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200">
                {fetchState.status === "loading" ? (
                  <p>Loading content…</p>
                ) : fetchState.status === "error" ? (
                  <p className="text-rose-500">{fetchState.error || "Unable to load article content."}</p>
                ) : fetchState.status === "ready" ? (
                  <div className="space-y-4 whitespace-pre-line">{fetchState.content}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
