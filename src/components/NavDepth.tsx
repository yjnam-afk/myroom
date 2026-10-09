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

/**
 * 뒤로 왔을 때 보던 자리로 되돌린다(2026-10-09 — "백버튼 누르면 맨 위가 아니라 그 위치로").
 * 토픽 설명·학습계획은 돌아올 때 서버 데이터로 다시 그려져 Next 가 맨 위로 올려 버린다.
 * 그래서 주소마다 스크롤 위치를 이 탭에 적어 두고, 뒤로/앞으로(popstate)로 온 경우에만
 * 내용 높이가 그 위치까지 자랄 때를 기다려 되돌린다. 링크를 눌러 새로 간 경우는 맨 위 그대로.
 */
const POS_KEY = "myroom:scrollPos";
let popped = false;
let cancelRestore: (() => void) | null = null;

const hereNow = () => location.pathname + location.search;

function readPos(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(POS_KEY) || "{}");
  } catch {
    return {};
  }
}

function savePos(url: string, y: number) {
  try {
    const m = readPos();
    delete m[url]; // 최근 것을 뒤로 보내 오래된 것부터 버린다
    m[url] = Math.round(y);
    const keys = Object.keys(m);
    for (const k of keys.slice(0, Math.max(0, keys.length - 80))) delete m[k];
    sessionStorage.setItem(POS_KEY, JSON.stringify(m));
  } catch {
    // sessionStorage 가 막히면 위치를 기억하지 않는다(맨 위로 열림).
  }
}

if (typeof window !== "undefined") {
  try {
    // 브라우저 자체 복원은 내용이 다 그려지기 전에 일어나 맨 위에 걸린다 — 직접 한다.
    history.scrollRestoration = "manual";
  } catch {
    // 지원 안 하는 브라우저는 그냥 둔다.
  }
  window.addEventListener("popstate", () => {
    popped = true;
  });
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking || cancelRestore) return; // 되돌리는 중의 스크롤은 적지 않는다
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        savePos(hereNow(), window.scrollY);
      });
    },
    { passive: true },
  );
  // 링크·버튼을 누른 순간의 자리 — 이동하면서 맨 위로 올라가기 전에 적어 둔다.
  document.addEventListener("click", () => savePos(hereNow(), window.scrollY), true);
}

function restoreScroll(url: string) {
  cancelRestore?.();
  const target = readPos()[url];
  if (!target) return;
  let stop = false;
  const started = Date.now();
  let reachedAt = 0;
  const end = () => {
    stop = true;
    cancelRestore = null;
    window.removeEventListener("wheel", end);
    window.removeEventListener("touchstart", end);
    window.removeEventListener("keydown", end);
  };
  // 사용자가 직접 스크롤을 시작하면 그만둔다.
  window.addEventListener("wheel", end, { passive: true });
  window.addEventListener("touchstart", end, { passive: true });
  window.addEventListener("keydown", end);
  cancelRestore = end;
  const tick = () => {
    if (stop) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.min(target, max));
    if (max >= target && !reachedAt) reachedAt = Date.now();
    // 닿은 뒤에도 잠깐 붙잡아 둔다 — 화면이 늦게 맨 위·오늘 카드로 옮기는 경우가 있다.
    const done = reachedAt ? Date.now() - reachedAt > 500 : Date.now() - started > 4000;
    if (done) end();
    else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    // 로그인 화면은 거쳐 가는 곳이라 돌아갈 대상이 아니다.
    if (pathname === "/login") return;
    const qs = searchParams.toString();
    const here = qs ? `${pathname}?${qs}` : pathname;
    if (popped) {
      popped = false;
      restoreScroll(hereNow()); // 저장할 때와 같은 표기(location) — searchParams 는 공백을 + 로 바꾼다
    } else {
      cancelRestore?.();
    }
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
