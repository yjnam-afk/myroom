"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * 이 탭에서 앱 안을 몇 번 이동했는지 센다.
 *
 * "← 뒤로" 버튼이 window.history.length 를 보면 안 되는 이유:
 * history.length 는 탭 전체의 기록 수라서, 검색 결과나 카톡 링크를 타고
 * 들어오면 이미 2 이상이다. 그 상태로 router.back() 을 부르면 앱이 아니라
 * 들어온 사이트로 나가버린다. 그래서 앱 안에서의 이동만 따로 센다.
 */
const KEY = "myroom:navDepth";

function read(): number {
  try {
    return Number(sessionStorage.getItem(KEY) || "0");
  } catch {
    return 0;
  }
}

/** 앱 안에서 이동한 횟수(첫 진입이면 1). 뒤로 갈 곳이 있으면 2 이상. */
export function navDepth(): number {
  return read();
}

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, String(read() + 1));
    } catch {
      // 사생활 보호 모드 등에서 sessionStorage 가 막히면 그냥 세지 않는다.
    }
  }, [pathname, searchParams]);
  return null;
}

export default function NavDepth() {
  // useSearchParams 는 Suspense 경계가 필요하다(정적 렌더 시 빌드 에러 방지).
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
