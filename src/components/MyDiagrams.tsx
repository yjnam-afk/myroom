"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MyDiagram,
  addDiagram,
  diagramKey,
  listDiagrams,
  removeDiagram,
  shrinkImage,
} from "@/lib/myDiagrams";

/**
 * 내 도식 — 교재의 도식을 사진 찍거나 캡처해서 그 토픽에 붙인다.
 * AI가 다시 그린 그림이 아니라 ★교재 원본 그대로★ 를 보는 게 목적.
 * 이미지는 이 브라우저(IndexedDB)에만 저장되고 서버로 올라가지 않는다.
 */
export default function MyDiagrams({
  topicId,
  title,
}: {
  topicId?: string;
  title?: string;
}) {
  const key = diagramKey(topicId, title);
  const [items, setItems] = useState<MyDiagram[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [zoom, setZoom] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    if (!key) return;
    try {
      setItems(await listDiagrams(key));
    } catch {
      setErr("도식을 불러오지 못했습니다.");
    }
  }, [key]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Blob → objectURL. 목록이 바뀔 때마다 새로 만들고 이전 것은 반드시 해제(메모리 누수 방지).
  useEffect(() => {
    const made: Record<string, string> = {};
    for (const it of items) made[it.id] = URL.createObjectURL(it.blob);
    setUrls(made);
    return () => {
      for (const u of Object.values(made)) URL.revokeObjectURL(u);
    };
  }, [items]);

  async function onPick(files: FileList | null) {
    if (!files?.length || !key) return;
    setBusy(true);
    setErr("");
    try {
      for (const f of Array.from(files)) {
        if (!f.type.startsWith("image/")) continue;
        await addDiagram(key, await shrinkImage(f));
      }
      await refresh();
    } catch {
      setErr("저장에 실패했습니다. 이미지 파일인지 확인해 주세요.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onDelete(id: string) {
    await removeDiagram(id);
    await refresh();
  }

  if (!key) return null;

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold text-brand-700">
          📐 내 도식 <span className="text-slate-400">(교재 원본)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {busy ? "저장 중…" : "＋ 도식 넣기"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onPick(e.target.files)}
          />
        </div>
      </div>

      {err && <p className="mb-2 text-xs text-red-600">{err}</p>}

      {items.length === 0 ? (
        <p className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
          교재의 도식을 사진 찍거나 캡처해서 넣어 두면 이 토픽을 볼 때마다 같이
          뜹니다. 여러 장 넣을 수 있고, <strong>이 브라우저에만</strong> 저장돼요
          (서버로 안 올라갑니다).
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <figure
              key={it.id}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={urls[it.id]}
                alt="내 도식"
                onClick={() => setZoom(urls[it.id])}
                className="max-h-72 w-full cursor-zoom-in bg-white object-contain"
              />
              <button
                onClick={() => onDelete(it.id)}
                aria-label="삭제"
                className="absolute right-1.5 top-1.5 rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-slate-500 opacity-0 ring-1 ring-slate-200 transition group-hover:opacity-100 hover:text-red-600"
              >
                삭제
              </button>
            </figure>
          ))}
        </div>
      )}

      {zoom && (
        <div
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zoom}
            alt="내 도식 확대"
            className="max-h-full max-w-full rounded-lg bg-white"
          />
        </div>
      )}
    </div>
  );
}
