import AuthControls from "../components/AuthControls";
import TopStories from "../components/TopStories";
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
                The top 5 Kenya headlines from Nation Africa, with quick options to read the full article text or generate a summary.
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

          <TopStories stories={stories} />
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Updated live from Nation Africa. Use the buttons in each card to fetch the full cleaned article text or an AI-generated summary.
          </p>
        </section>
      </main>
    </div>
  );
}
