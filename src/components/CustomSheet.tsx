"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomSheet as Sheet } from "@/data/customSheets";

/** 답안지 원래 너비(번호란 56 + 본문 + 줄번호 34) */
const W = 740;

/**
 * 내 답안지 — 아티팩트에서 가져온 22줄 괘선 답안지를 그대로 그린다(자동 템플릿 대신).
 * 칸 너비·줄 높이가 px 로 짜여 있어 좁은 화면에서는 통째로 줄인다(가로 스크롤을 만들지 않는다).
 * 마크업은 가져올 때 허용한 태그·속성만 남긴 것이다(scripts/import-artifact-sheet.py).
 */
export default function CustomSheet({ sheet }: { sheet: Sheet }) {
  const box = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setZoom(Math.min(1, el.clientWidth / W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="csheet bg-[#e9ebe6] px-3 py-4 sm:px-5">
      <div className="mx-auto" style={{ maxWidth: W }}>
        <div className="mb-3">
          <p className="text-[15px] font-bold text-slate-900">{sheet.title}</p>
          <p className="text-[12px] text-slate-500">
            {sheet.sub}
            <span className="ml-2 rounded bg-white px-1.5 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-emerald-200">내 답안지</span>
          </p>
        </div>
        <div ref={box} className="overflow-hidden">
          <div style={{ width: W, zoom }}>
            <div className="sheets" dangerouslySetInnerHTML={{ __html: sheet.html }} />
          </div>
        </div>
        {sheet.verify && <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">{sheet.verify}</p>}
        {sheet.source && (
          <a href={sheet.source} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[11px] text-slate-400 hover:text-brand-700 hover:underline">
            원본 아티팩트 열기 →
          </a>
        )}
      </div>
    </div>
  );
}
