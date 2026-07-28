"use client";

import { useEffect, useState } from "react";
import { LinkItem, loadLinks, saveLinks, uid } from "@/lib/storage";

const EMOJIS = ["🔗", "📘", "🎵", "🎬", "🛒", "📰", "💼", "🎮", "🏦", "✈️"];

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [emoji, setEmoji] = useState("🔗");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLinks(loadLinks());
    setLoaded(true);
  }, []);

  function update(next: LinkItem[]) {
    setLinks(next);
    saveLinks(next);
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    let u = url.trim();
    if (!t || !u) return;
    if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
    update([...links, { id: uid(), emoji, title: t, url: u }]);
    setTitle("");
    setUrl("");
  }

  function remove(id: string) {
    update(links.filter((l) => l.id !== id));
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">🔖 즐겨찾기</h1>
      <p className="mb-6 text-sm text-slate-500">
        자주 가는 곳을 모아 두면 마이룸 홈에서도 바로 갈 수 있어요.
      </p>

      <form
        onSubmit={add}
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-3 flex flex-wrap gap-1">
          {EMOJIS.map((em) => (
            <button
              type="button"
              key={em}
              onClick={() => setEmoji(em)}
              className={`grid h-9 w-9 place-items-center rounded-lg text-xl transition ${
                emoji === em
                  ? "bg-brand-100 ring-2 ring-brand-500"
                  : "border border-slate-200 hover:bg-slate-50"
              }`}
              aria-label={`아이콘 ${em}`}
            >
              {em}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="이름 (예: 유튜브)"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="주소 (예: youtube.com)"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            disabled={!title.trim() || !url.trim()}
            className="shrink-0 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-40"
          >
            추가
          </button>
        </div>
      </form>

      {loaded && links.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          아직 즐겨찾기가 없어요.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {links.map((l) => (
            <li
              key={l.id}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-50 text-xl">
                {l.emoji}
              </span>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1"
              >
                <span className="block truncate text-sm font-semibold text-slate-800 group-hover:text-brand-600">
                  {l.title}
                </span>
                <span className="block truncate text-xs text-slate-400">{l.url}</span>
              </a>
              <button
                onClick={() => remove(l.id)}
                className="text-xs text-slate-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
