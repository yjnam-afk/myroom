"use client";

import { useEffect, useState } from "react";

/**
 * 라우트 에러 바운더리.
 * - 새 배포로 옛 JS 청크가 사라져 생기는 ChunkLoadError(페이지 이동 시 흔함)는
 *   "에러 화면"을 보이지 않고 조용히 새로고침해 최신 빌드로 복구한다.
 * - 그 외 에러는 부드러운 안내 + 다시 시도 버튼.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isChunk =
    /ChunkLoadError|Loading chunk|Loading CSS chunk|dynamically imported module|Failed to fetch/i.test(
      `${error?.name} ${error?.message}`,
    );
  // 청크 에러로 자동 새로고침을 이미 한 번 했는데도 또 났으면 빈 화면 대신 안내를 보여 준다.
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    if (isChunk) {
      // 배포 갱신으로 청크가 바뀐 경우 → 한 번만 하드 리로드해 최신 빌드 로드.
      const key = "chunk-reload-at";
      let last = 0;
      try {
        last = Number(sessionStorage.getItem(key) || "0");
      } catch {
        /* 저장소 차단 환경 */
      }
      const now = Date.now();
      // 리로드 루프 방지: 10초 내 재발이면 리로드하지 않고 안내 표시.
      if (now - last > 10000) {
        try {
          sessionStorage.setItem(key, String(now));
        } catch {
          /* 무시 */
        }
        setReloading(true);
        window.location.reload();
      }
    }
  }, [isChunk]);

  // 리로드가 진행 중일 때만 잠깐 비운다. 리로드가 막힌 경우엔 아래 안내가 뜬다.
  if (isChunk && reloading) return null;

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="text-4xl">📘</div>
      <h2 className="mt-3 text-lg font-bold text-slate-800">
        앗, 잠깐 문제가 생겼어요
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        일시적인 오류예요. 다시 시도하면 대부분 해결됩니다.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <button
          onClick={() => reset()}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
        >
          다시 시도
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
