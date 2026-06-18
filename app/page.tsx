import Image from "next/image";
import AuthControls from "../components/AuthControls";
import { getTopNationStories } from "../lib/nation";

export default async function Home() {
  const stories = await getTopNationStories(5);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-12 py-20 px-6 sm:px-10 lg:px-16">
        <section className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">Daily Breakdown</h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                The top 5 Kenya headlines from Nation Africa, ready to click through to the full article.
              </p>
            </div>
            <AuthControls />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Nation Africa</p>
              <h2 className="mt-2 text-2xl font-semibold text-black dark:text-zinc-50">Top 5 Kenya stories</h2>
            </div>
            <a
              href="https://nation.africa/kenya"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-sky-600 transition hover:text-sky-500 dark:text-sky-400"
            >
              View source
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            {stories.length > 0 ? (
              stories.map((story) => (
                <a
                  key={story.url}
                  href={story.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-3xl border border-black/5 bg-white p-6 transition hover:border-sky-500 hover:bg-sky-50 dark:border-white/10 dark:bg-zinc-950 dark:hover:border-sky-400 dark:hover:bg-zinc-900"
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
                  <p className="mt-4 text-sm font-semibold text-sky-600 dark:text-sky-400">
                    Read article →
                  </p>
                </a>
              ))
            ) : (
              <div className="rounded-3xl border border-black/5 bg-white p-10 text-center text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
                Unable to load top stories right now. Please refresh the page.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Updated live from Nation Africa. Click any headline to open the full story on the publisher's site.
          </p>
        </section>
      </main>
    </div>
  );
}
