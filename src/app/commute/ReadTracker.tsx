"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * 읽던 자리 기억 — 지금 화면 맨 위에 걸린 토픽을 localStorage 에 적어 두고, 다시 오면 「이어 읽기」를 띄운다.
 * 아래 고정 막대에는 「몇 번째 / 전체 · 지금 토픽」만 보인다(누를 것이 없다 — 내려 읽기만 하면 된다).
 */
const KEY = "commute-read-v1";
type Saved = { d: string; id: string; title: string; name: string };

function load(): Saved | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

/** 과목 고르는 화면의 「이어 읽기」 */
export function ResumeLink() {
  const [s, setS] = useState<Saved | null>(null);
  useEffect(() => setS(load()), []);
  if (!s) return null;
  return (
    <Link
      href={`/commute/${s.d}#${s.id}`}
      className="mb-4 block rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-100"
    >
      ▶ 이어 읽기 — {s.name} · {s.title}
    </Link>
  );
}

export default function ReadTracker({ d, name, items }: { d: string; name: string; items: { id: string; title: string }[] }) {
  const [cur, setCur] = useState(0);
  const [resume, setResume] = useState<Saved | null>(null);

  useEffect(() => {
    const s = load();
    // 닻(#)으로 들어왔으면 그 자리가 먼저다
    if (s && s.d === d && !window.location.hash && s.id !== items[0]?.id) setResume(s);
    const els = items.map((it) => document.getElementById(it.id)).filter((e): e is HTMLElement => !!e);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // 화면 위쪽 1/3 선을 지난 마지막 토픽
        const line = window.innerHeight / 3;
        let i = 0;
        for (let k = 0; k < els.length; k++) if (els[k].getBoundingClientRect().top <= line) i = k;
        setCur(i);
        if (window.scrollY > 200) {
          try {
            window.localStorage.setItem(KEY, JSON.stringify({ d, id: items[i].id, title: items[i].title, name }));
          } catch {
            /* 저장을 못 해도 읽는 데는 지장 없다 */
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [d, name, items]);

  return (
    <>
      {resume && (
        <button
          type="button"
          onClick={() => {
            document.getElementById(resume.id)?.scrollIntoView({ block: "start" });
            setResume(null);
          }}
          className="mb-4 block w-full rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-left text-sm font-semibold text-brand-800"
        >
          ▶ 읽던 곳부터 — {resume.title}
        </button>
      )}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-3">
        <div className="max-w-full truncate rounded-full bg-slate-900/85 px-4 py-1.5 text-xs font-medium text-white shadow-lg">
          {name} {cur + 1} / {items.length} · {items[cur]?.title}
        </div>
      </div>
    </>
  );
}
