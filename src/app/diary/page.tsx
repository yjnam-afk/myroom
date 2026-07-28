"use client";

import { useEffect, useState } from "react";
import {
  DiaryEntry,
  loadDiary,
  saveDiary,
  uid,
  todayStr,
} from "@/lib/storage";

const MOODS = ["😊", "🔥", "😴", "🥲", "😤", "🤓", "🎉"];

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("😊");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(loadDiary());
    setLoaded(true);
  }, []);

  function update(next: DiaryEntry[]) {
    setEntries(next);
    saveDiary(next);
  }

  function addEntry(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    update([
      { id: uid(), date: todayStr(), mood, text: trimmed },
      ...entries,
    ]);
    setText("");
  }

  function removeEntry(id: string) {
    update(entries.filter((en) => en.id !== id));
  }

  const wroteToday = entries.some((en) => en.date === todayStr());

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">📔 다이어리</h1>
      <p className="mb-6 text-sm text-slate-500">
        하루 한 줄이면 충분해요. 기분과 함께 오늘을 남겨 보세요.
      </p>

      <form
        onSubmit={addEntry}
        className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">
            오늘 · {todayStr()}
          </span>
          {loaded && wroteToday && (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
              🌟 오늘 이미 썼어요 — 더 써도 좋아요
            </span>
          )}
        </div>
        <div className="mb-3 flex gap-1">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMood(m)}
              className={`grid h-9 w-9 place-items-center rounded-lg text-xl transition ${
                mood === m
                  ? "bg-brand-100 ring-2 ring-brand-500"
                  : "border border-slate-200 hover:bg-slate-50"
              }`}
              aria-label={`기분 ${m}`}
            >
              {m}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="오늘 하루는 어땠나요?"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-3 text-right">
          <button
            disabled={!text.trim()}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-40"
          >
            남기기 ✍️
          </button>
        </div>
      </form>

      {loaded && entries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          아직 일기가 없어요. 첫 한 줄을 남겨 볼까요?
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((en) => (
            <li
              key={en.id}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {en.date} {en.mood}
                </span>
                <button
                  onClick={() => removeEntry(en.id)}
                  className="text-xs text-slate-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                >
                  삭제
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {en.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
