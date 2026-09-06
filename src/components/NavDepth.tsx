"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * 이 탭에서 앱 안을 어떻게 이동했는지 경로 스택으로 추적한다.
 *
 * window.history.length 를 보면 안 되는 이유:
 *  - 탭 전체의 기록 수라서, 검색 결과나 메신저 링크를 타고 들어오면 이미 2 이상이다.
 *    그 상태로 router.back() 을 부르면 앱이 아니라 들어온 사이트로 나가버린다.
 *  - 뒤로 가도 값이 줄지 않아, 첫 화면까지 돌아온 뒤 또 누르면 역시 앱 밖으로 나간다.
 *
 * 그래서 방문 경로를 직접 쌓되, 새 경로가 스택의 바로 앞 항목과 같으면
 * "뒤로 간 것"으로 보고 쌓는 대신 하나 걷어낸다. 스택에 두 개 이상 남아 있을 때만
 * 앱 안에 돌아갈 곳이 있는 것이다.
 */
const KEY = "myroom:navStack";

function read(): string[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(stack: string[]) {
  try {
    // 무한히 쌓이지 않게 최근 50개만 유지한다.
    sessionStorage.setItem(KEY, JSON.stringify(stack.slice(-50)));
  } catch {
    // 사생활 보호 모드 등에서 sessionStorage 가 막히면 추적을 포기한다.
  }
}

/** 앱 안에 돌아갈 페이지가 있는가. */
export function canGoBack(): boolean {
  return read().length > 1;
}

/** 뒤로 갔을 때 도착할 앱 안 경로(없으면 null). */
export function previousPath(): string | null {
  const s = read();
  return s.length > 1 ? s[s.length - 2] : null;
}

/**
 * 이 모듈이 평가된 시점 = 새 문서가 열린 시점.
 * 주소 직접 입력·새로고침·로그인 후 location.replace 처럼 문서가 통째로 다시
 * 뜨면 브라우저의 앱 내 기록도 이 페이지 하나뿐이다. 그런데 sessionStorage 는
 * 살아남으므로, 초기화하지 않으면 이전 스택을 보고 "돌아갈 곳이 있다"고
 * 잘못 판단해 router.back() 이 아무 데도 못 간다.
 */
let freshDocument = true;

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    // 로그인 화면은 거쳐 가는 곳이라 돌아갈 대상이 아니다.
    if (pathname === "/login") return;
    const qs = searchParams.toString();
    const here = qs ? `${pathname}?${qs}` : pathname;
    if (freshDocument) {
      freshDocument = false;
      write([here]); // 새 문서 — 여기서부터 다시 센다
      return;
    }
    const stack = read();
    const last = stack[stack.length - 1];
    if (last === here) return; // 같은 주소로 다시 렌더된 경우
    if (stack[stack.length - 2] === here) {
      stack.pop(); // 뒤로 간 것 — 쌓지 말고 걷어낸다
    } else {
      stack.push(here);
    }
    write(stack);
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
