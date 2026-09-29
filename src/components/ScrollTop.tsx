"use client";

import { useEffect, useState } from "react";

/**
 * 맨 위로 가는 버튼 — 모든 화면 공통.
 *
 * 토픽 설명·모범답안 화면은 슬라이드·표·답안지 스캔이 이어져 한 화면이 길다.
 * 한 화면 넘게 내려갔을 때만 오른쪽 아래에 뜬다 — 처음부터 떠 있으면
 * 휴대폰에서 내용을 가린다.
 */
export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="맨 위로"
      className="fixed bottom-5 right-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/90 text-lg text-slate-700 shadow-lg backdrop-blur transition hover:bg-brand-50 hover:text-brand-600 md:bottom-8 md:right-8"
    >
      ↑
    </button>
  );
}
