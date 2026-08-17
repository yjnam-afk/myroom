"use client";

import { useCallback, useEffect, useState } from "react";
import { useRef } from "react";
import {
  DiagramView,
  addDiagramView,
  diagramKey,
  diagramServerEnabled,
  listDiagramsView,
  removeDiagramView,
} from "@/lib/myDiagrams";

/**
 * 내 도식 — 교재의 도식을 사진 찍거나 캡처해서 그 토픽에 붙인다.
 * AI가 다시 그린 그림이 아니라 ★교재 원본 그대로★ 를 보는 게 목적.
 * 로그인 상태면 서버(내 계정)에 저장되어 어느 기기에서든 같이 뜨고,
 * 개인 모드(비로그인)에서는 이 브라우저(IndexedDB)에만 저장된다.
 */
export default function MyDiagrams({
  topicId,
  title,
}: {
  topicId?: string;
  title?: string;
}) {
  const key = diagramKey(topicId, title);
  const [items, setItems] = useState<DiagramView[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [zoom, setZoom] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const server = diagramServerEnabled();

  const refresh = useCallback(async () => {
    if (!key) return;
    try {
      setItems(await listDiagramsView(key));
      setErr("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "도식을 불러오지 못했습니다.");
    }
  }, [key]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // 로컬 모드에서 만든 objectURL 은 목록이 바뀔 때 해제한다(메모리 누수 방지).
  useEffect(() => {
    const blobUrls = items.map((it) => it.src).filter((s) => s.startsWith("blob:"));
    return () => {
      for (const u of blobUrls) URL.revokeObjectURL(u);
    };
  }, [items]);

  async function onPick(files: FileList | null) {
    if (!files?.length || !key) return;
    setBusy(true);
    setErr("");
    try {
      for (const f of Array.from(files)) {
        if (!f.type.startsWith("image/")) continue;
        await addDiagramView(key, f);
      }
      await refresh();
    } catch (e) {
      setErr(
        e instanceof Error ? e.message : "저장에 실패했습니다. 이미지 파일인지 확인해 주세요.",
      );
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onDelete(id: string) {
    try {
      await removeDiagramView(id, key);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    }
  }

  if (!key) return null;

  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold text-brand-700">
          📐 내 도식 <span className="text-slate-400">(교재 원본)</span>
          {server ? (
            <span className="ml-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
              ☁️ 서버 저장
            </span>
          ) : (
            <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              이 브라우저만
            </span>
          )}
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
          교재의 도식을 사진 찍거나 캡처해서 넣어 두면 이 토픽을 볼 때마다 같이 뜹니다.
          여러 장 넣을 수 있어요.{" "}
          {server ? (
            <>
              <strong>서버(내 계정)에 저장</strong>되어 폰·PC 어디서든 같이 보입니다.
            </>
          ) : (
            <>
              지금은 개인 모드라 <strong>이 브라우저에만</strong> 저장돼요 — 로그인하면
              서버에 저장되어 기기 간 공유됩니다.
            </>
          )}
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
                src={it.src}
                alt="내 도식"
                onClick={() => setZoom(it.src)}
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
