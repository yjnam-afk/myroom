"use client";

import { useState } from "react";
import type { MyNote } from "@/data/myNotes";

/**
 * 📝 내 정리 — 사용자가 손으로 정리한 공책에서 이 토픽 문항을 잘라 붙인 것(myNotes.ts).
 * 한 문항이 여러 쪽에 걸쳐 있으면 쪽 경계 없이 세로로 이어 붙여 한 장처럼 보인다
 * (2026-10-19 "다음 문제가 나올 때까지를 전체 이어서"). 첫 정리는 펼쳐 두고 나머지는 접는다.
 */
export default function MyNotes({ items }: { items: MyNote[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(items.slice(0, 1).map((n) => n.id)));
  const [zoom, setZoom] = useState(false);
  if (!items.length) return null;
  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-50/40 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 bg-amber-100/60 px-4 py-2">
        <h3 className="text-sm font-bold text-amber-900">
          📝 내 정리 <span className="font-normal text-amber-700">({items.length})</span>
        </h3>
        <button
          onClick={() => setZoom((z) => !z)}
          className="rounded-md border border-amber-300 bg-white px-2 py-0.5 text-[11px] font-medium text-amber-800 hover:bg-amber-50"
        >
          {zoom ? "↙ 화면 폭에 맞추기" : "↗ 크게 보기"}
        </button>
      </div>
      <ol className="divide-y divide-amber-200">
        {items.map((n) => {
          const on = open.has(n.id);
          return (
            <li key={n.id}>
              <button
                onClick={() => toggle(n.id)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-amber-100/50"
              >
                <span className="shrink-0 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                  {n.book} {/^\d+$/.test(n.no) ? `문${n.no}` : n.no}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-slate-800">{n.title}</span>
                <span className="shrink-0 text-xs text-amber-700">{on ? "접기 ▲" : "펼치기 ▼"}</span>
              </button>
              {on && (
                <div className="px-2 pb-3 sm:px-4">
                  {n.note && <p className="mb-1.5 text-[11px] text-amber-800">⚠️ {n.note}</p>}
                  <div className={zoom ? "overflow-x-auto" : ""}>
                    <div className={`mx-auto bg-white ${zoom ? "w-[1000px]" : "max-w-[760px]"}`}>
                      {n.pages.map((src, i) => (
                        // 쪽 경계 없이 이어 붙인다 — 한 문항이 한 장처럼 읽히게
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={src} src={src} alt={`${n.title} ${i + 1}`} loading="lazy" className="block w-full" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
