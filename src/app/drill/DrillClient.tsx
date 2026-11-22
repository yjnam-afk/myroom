"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * 암기 연습 — 브라우저에 남기는 것(localStorage `drill-v1`): 토픽마다 써 본 날짜, 오늘 고른 토픽.
 * 「하루 3~4개 토픽씩 목차와 도식만 5~10분」 — 오늘 분량은 덜 써 본 토픽부터(같으면 중요도 상 → 지도 차례) 4개.
 */
const KEY = "drill-v1";
type Store = { code?: string; done: Record<string, string[]>; today?: { date: string; code: string; ids: string[] } };
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
function load(): Store {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "{}") as Partial<Store>;
    return { ...s, done: s.done ?? {} };
  } catch {
    return { done: {} };
  }
}
function save(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* 저장이 막힌 브라우저 — 기록 없이 쓴다 */
  }
}

export type DrillTopic = { id: string; title: string; priority?: string };
export type DrillSubject = { code: string; label: string; topics: DrillTopic[] };
const RANK: Record<string, number> = { 상: 0, 중: 1, 하: 2 };

function pick(sub: DrillSubject, done: Record<string, string[]>): string[] {
  return sub.topics
    .map((t, i) => ({ t, i, n: (done[`${sub.code}/${t.id}`] ?? []).length }))
    .sort((a, b) => a.n - b.n || (RANK[a.t.priority ?? "하"] ?? 2) - (RANK[b.t.priority ?? "하"] ?? 2) || a.i - b.i)
    .slice(0, 4)
    .map((x) => x.t.id);
}

/** 오늘의 토픽 4개 — 과목을 고르면 덜 써 본 토픽부터 뽑는다. 하루 동안은 같은 4개가 유지된다 */
export function Today({ subjects }: { subjects: DrillSubject[] }) {
  const [st, setSt] = useState<Store | null>(null);
  useEffect(() => {
    const s = load();
    const code = s.code && subjects.some((x) => x.code === s.code) ? s.code : subjects[0].code;
    if (!s.today || s.today.date !== today() || s.today.code !== code) {
      s.code = code;
      s.today = { date: today(), code, ids: pick(subjects.find((x) => x.code === code)!, s.done) };
      save(s);
    }
    setSt(s);
  }, [subjects]);
  if (!st?.today) return <div className="h-40 rounded-2xl border border-slate-200 bg-white" />;
  const sub = subjects.find((x) => x.code === st.today!.code)!;
  const change = (code: string) => {
    const s = load();
    s.code = code;
    s.today = { date: today(), code, ids: pick(subjects.find((x) => x.code === code)!, s.done) };
    save(s);
    setSt(s);
  };
  const again = () => {
    const s = load();
    // 오늘 고른 것을 뺀 나머지에서 다시 4개
    const rest = { ...sub, topics: sub.topics.filter((t) => !st.today!.ids.includes(t.id)) };
    s.today = { date: today(), code: sub.code, ids: pick(rest.topics.length >= 4 ? rest : sub, s.done) };
    save(s);
    setSt(s);
  };
  const doneToday = (id: string) => (st.done[`${sub.code}/${id}`] ?? []).includes(today());
  const total = sub.topics.filter((t) => (st.done[`${sub.code}/${t.id}`] ?? []).length > 0).length;
  return (
    <div className="rounded-2xl border-2 border-slate-900 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-bold text-slate-900">오늘의 토픽 4개</p>
        <select value={sub.code} onChange={(e) => change(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          {subjects.map((s) => (
            <option key={s.code} value={s.code}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-slate-400">
          {sub.label} {total} / {sub.topics.length} 토픽 써 봄
        </span>
        <button onClick={again} className="ml-auto rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500">
          다른 4개
        </button>
      </div>
      <ol className="mt-3 space-y-2">
        {st.today.ids.map((id, i) => {
          const t = sub.topics.find((x) => x.id === id);
          if (!t) return null;
          const ok = doneToday(id);
          return (
            <li key={id}>
              <Link
                href={`/drill/${sub.code}#${id}`}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[15px] ${ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-900 hover:border-brand-400"}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500">{ok ? "✓" : i + 1}</span>
                <span className="min-w-0 flex-1 font-semibold">{t.title}</span>
                {t.priority === "상" && <span className="shrink-0 text-[11px] text-rose-500">★★★</span>}
                <span className="shrink-0 text-xs text-slate-400">{(st.done[`${sub.code}/${id}`] ?? []).length}회</span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        토픽마다 ① 키워드 한 장을 읽고 ② 그림을 백지에 그려 보고 ③ 문제 하나에 목차와 도식만 5~10분 안에 씁니다. 덜 써 본 토픽부터, 같으면 중요도 높은 것부터 고릅니다.
      </p>
    </div>
  );
}

/** 5분·10분 타이머 — 목차와 도식만 쓰는 시간 */
export function Timer() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (left == null || left <= 0) return;
    const t = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const mm = left == null ? "" : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {left == null ? (
        <>
          <span className="text-slate-500">⏱ 시간을 재며 쓰기</span>
          {[5, 10].map((m) => (
            <button key={m} onClick={() => setLeft(m * 60)} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 font-semibold text-slate-700">
              {m}분
            </button>
          ))}
        </>
      ) : left > 0 ? (
        <>
          <span className="rounded-md bg-slate-900 px-2.5 py-1 font-mono text-sm font-bold text-white">{mm}</span>
          <button onClick={() => setLeft(null)} className="text-slate-400 underline">
            멈춤
          </button>
        </>
      ) : (
        <>
          <span className="rounded-md bg-rose-600 px-2.5 py-1 font-bold text-white">시간 끝</span>
          <span className="text-slate-600">아래 목차를 펼쳐 견줘 보세요.</span>
          <button onClick={() => setLeft(null)} className="text-slate-400 underline">
            다시
          </button>
        </>
      )}
    </div>
  );
}

/** 「써 봤다」 — 오늘 날짜를 그 토픽에 적는다 */
export function Done({ code, id }: { code: string; id: string }) {
  const [dates, setDates] = useState<string[] | null>(null);
  const k = `${code}/${id}`;
  useEffect(() => setDates(load().done[k] ?? []), [k]);
  if (!dates) return null;
  const ok = dates.includes(today());
  const toggle = () => {
    const s = load();
    const cur = s.done[k] ?? [];
    s.done[k] = ok ? cur.filter((d) => d !== today()) : [...cur, today()];
    if (!s.done[k].length) delete s.done[k];
    save(s);
    setDates(s.done[k] ?? []);
  };
  return (
    <button
      onClick={toggle}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${ok ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-slate-700"}`}
    >
      {ok ? "✓ 오늘 써 봄" : "써 봤다"}
      {dates.length > 0 && <span className="ml-1.5 font-normal opacity-80">누적 {dates.length}회</span>}
    </button>
  );
}
