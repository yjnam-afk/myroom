"use client";

import { useEffect, useState } from "react";

/**
 * 새 배포 감지 배너.
 * 현재 탭이 받은 빌드 ID(NEXT_PUBLIC_BUILD_ID)와, 라이브 서버의 /api/version 빌드 ID를
 * 주기적으로 비교한다. 다르면 = 새 버전이 배포된 것 → "새로고침" 안내를 띄우고,
 * 탭으로 돌아온 순간이면 한 번 자동 새로고침한다.
 * (브라우저는 Vercel의 '빌드 중' 상태를 직접 알 수 없어, 새 버전이 라이브로 올라온 순간을 잡는다.)
 */
export default function DeployBanner() {
  const mine = process.env.NEXT_PUBLIC_BUILD_ID || "dev";
  const [stale, setStale] = useState(false);

  useEffect(() => {
    if (mine === "dev") return; // 로컬 개발은 무시
    let active = true;
    // 입력 중(답안 작성 등)이면 자동 새로고침을 미룬다 — 작업 방해 방지.
    const isTyping = () => {
      const el = document.activeElement as HTMLElement | null;
      const t = el?.tagName;
      return t === "INPUT" || t === "TEXTAREA" || el?.isContentEditable === true;
    };
    const safeGet = (k: string) => {
      try {
        return sessionStorage.getItem(k);
      } catch {
        return "1"; // 저장소를 못 쓰면 자동 새로고침을 하지 않는다(루프 방지)
      }
    };
    const safeSet = (k: string) => {
      try {
        sessionStorage.setItem(k, "1");
      } catch {
        /* 무시 */
      }
    };
    /**
     * 새 배포를 받았을 때.
     * - 자동 새로고침은 "탭으로 돌아온 순간"에만 한다. 보고 있는 도중에 화면이
     *   갑자기 갈리면 읽던 자리를 잃는다 — 배포가 잇달아 올라간 날은 몇 번씩 그랬다.
     * - 같은 빌드로는 한 번만 시도한다(무한 새로고침 방지). 못 했으면 배너로 안내.
     */
    const handleStale = (liveId: string, returning: boolean) => {
      const key = `deploy-reloaded-${liveId}`;
      if (returning && !safeGet(key) && document.visibilityState === "visible" && !isTyping()) {
        safeSet(key);
        window.location.reload();
        return;
      }
      setStale(true);
    };
    const check = async (returning = false) => {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { id?: string };
        if (active && data.id && data.id !== mine) handleStale(data.id, returning);
      } catch {
        // 네트워크 일시 오류는 무시
      }
    };
    check();
    const iv = setInterval(() => check(), 30000); // 30초마다 — 배너만 띄운다
    const onFocus = () => check(true); // 탭으로 돌아왔을 때 — 이때만 자동 새로고침
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      active = false;
      clearInterval(iv);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [mine]);

  if (!stale) return null;

  return (
    <div className="sticky top-[57px] z-20 border-b border-amber-300 bg-amber-50">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2 text-sm text-amber-800">
        <span className="font-semibold">🚀 새 버전이 배포됐어요!</span>
        <span className="hidden sm:inline text-amber-700">
          새로고침하면 최신 기능·데이터가 적용됩니다.
        </span>
        <button
          onClick={() => window.location.reload()}
          className="ml-auto rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600"
        >
          새로고침
        </button>
      </div>
    </div>
  );
}
