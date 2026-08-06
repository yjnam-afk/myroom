"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import topics from "@/data/topics.json";
import { ReviewItem, loadReview, getItem, isDue } from "@/lib/storage";
import { QuizStats, loadStats, loadNotes } from "@/lib/notes";
import { loadSession } from "@/lib/auth";
import { CoachPlan, buildPlan } from "@/lib/coach";
import ShareButton from "@/components/ShareButton";
import {
  Priority,
  TodayPlan,
  planForToday,
  loadDone,
  saveDone,
  doneKey,
} from "@/data/curriculum";
import { subnoteByTopicId, subnoteByTitle } from "@/data/textbookSubnotes";

/** 교재 Priority 뱃지 — ★★★=상(빨강), ★★=중(파랑), ★=하(회색) */
const PRIORITY_STYLE: Record<Priority, { cls: string; star: string }> = {
  상: { cls: "bg-red-100 text-red-700 ring-red-200", star: "★★★" },
  중: { cls: "bg-blue-100 text-blue-700 ring-blue-200", star: "★★" },
  하: { cls: "bg-slate-100 text-slate-600 ring-slate-200", star: "★" },
};

function PriorityBadge({ p }: { p: Priority }) {
  const s = PRIORITY_STYLE[p];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ring-1 ${s.cls}`}
      title={`중요도 ${p}`}
    >
      {p}
      <span className="text-[8px] leading-none">{s.star}</span>
    </span>
  );
}

const toneClass: Record<string, string> = {
  rose: "border-slate-200 bg-slate-50 hover:border-slate-300",
  amber: "border-amber-200 bg-amber-50 hover:border-amber-300",
  violet: "border-slate-200 bg-slate-50 hover:border-slate-300",
  emerald: "border-amber-200 bg-amber-50 hover:border-amber-300",
  sky: "border-sky-200 bg-sky-50 hover:border-sky-300",
};

const menuGroups = [
  {
    group: "🧠 1단계 · 키워드 암기 (소설의 재료)",
    items: [
      {
        href: "/mnemonic",
        emoji: "🥷",
        title: "암기 훈련장",
        desc: "가리고-떠올리기 인출 훈련 · 교재 두음은 힌트로 · 확인 퀴즈",
        color: "from-brand-600 to-brand-800",
      },
      {
        href: "/plan",
        emoji: "🗓️",
        title: "학습 계획",
        desc: "심화반 커리큘럼 — 주차별 토픽·중요도·진도",
        color: "from-brand-500 to-brand-600",
      },
      {
        href: "/commute",
        emoji: "🚇",
        title: "지하철 모드 (틈새 두음)",
        desc: "한 손으로 넘기는 두음 카드 · AI 없이 즉시 · 통신 약해도 OK",
        color: "from-slate-500 to-gray-600",
      },
      {
        href: "/memorize",
        emoji: "🧠",
        title: "암기 (카드·퀴즈)",
        desc: "플래시카드·퀴즈로 키워드 반복 암기",
        color: "from-amber-500 to-orange-600",
      },
      {
        href: "/notes",
        emoji: "📕",
        title: "오답노트",
        desc: "자주 틀린 키워드 집중 복습",
        color: "from-slate-400 to-brand-500",
      },
    ],
  },
  {
    group: "✍️ 2단계 · 문제 풀기",
    items: [
      {
        href: "/exam",
        emoji: "📜",
        title: "기출문제",
        desc: "실제 기출문제로 답안 연습 (회차·교시별)",
        color: "from-amber-500 to-yellow-600",
      },
      {
        href: "/bank",
        emoji: "🏦",
        title: "문제은행",
        desc: "교시·문항 수 선택 → 기출·모의·셀테에서 랜덤 출제",
        color: "from-brand-600 to-brand-800",
      },
    ],
  },
  {
    group: "📚 보조 · 개념 이해 · 복습",
    items: [
      {
        href: "/map",
        emoji: "🗺️",
        title: "토픽 지도",
        desc: "서로 연관된 토픽을 묶음으로 모아 한눈에",
        color: "from-brand-600 to-brand-800",
      },
      {
        href: "/explain",
        emoji: "💡",
        title: "토픽 설명",
        desc: "어려운 개념을 비유·도식으로 이해",
        color: "from-amber-500 to-amber-600",
      },
      {
        href: "/review",
        emoji: "🔁",
        title: "회독 관리",
        desc: "망각곡선 간격으로 오늘 복습 추천",
        color: "from-brand-500 to-brand-600",
      },
      {
        href: "/room",
        emoji: "🛋️",
        title: "마이룸 꾸미기",
        desc: "공부 쉬는 시간, 이모지 스티커로 내 방 꾸미기",
        color: "from-yellow-500 to-amber-600",
      },
    ],
  },
];

export default function Home() {
  const [review, setReview] = useState<Record<string, ReviewItem>>({});
  const [stats, setStats] = useState<QuizStats>({
    total: 0,
    correct: 0,
    lastAt: null,
  });
  const [notesCount, setNotesCount] = useState(0);
  const [plan, setPlan] = useState<CoachPlan | null>(null);
  const [userName, setUserName] = useState("");

  // 심화반 커리큘럼 — 오늘의 토픽(내가 정한 계획)
  const [today, setToday] = useState<TodayPlan | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    setToday(planForToday());
    setDone(loadDone());
  }, []);

  function toggleDone(key: string) {
    const next = new Set(done);
    next.has(key) ? next.delete(key) : next.add(key);
    setDone(next);
    saveDone(next);
  }

  useEffect(() => {
    const refresh = () => {
      const rev = loadReview();
      const st = loadStats();
      const notes = loadNotes();
      setReview(rev);
      setStats(st);
      setNotesCount(notes.length);
      // 코치는 회독·오답·퀴즈 기록만 보고 오늘 할 일을 추천한다(토픽 자동 배정 없음).
      setPlan(buildPlan(rev, notes, st, Date.now()));
      setUserName(loadSession()?.name || "");
    };
    refresh();
    // 계정 동기화가 끝나면 코치를 다시 계산(다른 기기 진도 반영)
    window.addEventListener("progress-synced", refresh);
    return () => window.removeEventListener("progress-synced", refresh);
  }, []);

  const total = topics.length;
  const doneCount = topics.filter(
    (t) => getItem(review, t.id).status === "done",
  ).length;
  const learningCount = topics.filter(
    (t) => getItem(review, t.id).status === "learning",
  ).length;
  const totalRounds = topics.reduce(
    (sum, t) => sum + getItem(review, t.id).rounds,
    0,
  );
  const progress = total ? Math.round((doneCount / total) * 100) : 0;
  const accuracy =
    stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const dueCount = topics.filter((t) => isDue(getItem(review, t.id))).length;

  const categories = Array.from(new Set(topics.map((t) => t.category)));
  const byCategory = categories.map((cat) => {
    const items = topics.filter((t) => t.category === cat);
    const done = items.filter(
      (t) => getItem(review, t.id).status === "done",
    ).length;
    return { cat, done, total: items.length };
  });

  return (
    <div>
      {/* 나의 공간 — 개인 아지트 선언 배너 */}
      <section className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 p-5 text-white shadow-lg ring-1 ring-brand-900/40 sm:p-9">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/20">
          🏠 나만의 학습 아지트
        </span>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
          {userName ? (
            <>
              어서 와요,{" "}
              <span className="underline decoration-amber-200 decoration-4 underline-offset-4">
                {userName}
              </span>{" "}
              님 👋
            </>
          ) : (
            <>나의 공간에 어서 와요 👋</>
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100 sm:mt-3 sm:text-base">
          기술사 답안은 <b className="font-bold text-white">&lsquo;소설&rsquo;</b>이다 ✍️
          <br className="hidden sm:block" />
          <span className="hidden sm:inline">
            내 페이스대로, 꾸준히. 오늘도 한 걸음 나아가요.
          </span>
        </p>
        {/* 단계 안내 칩 — 모바일에서는 접어 '오늘의 토픽'이 첫 화면에 들어오게 한다 */}
        <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
          <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15">
            🥷 1단계 · 키워드 암기(인출 훈련)
          </span>
          <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/15">
            ✍️ 2단계 · 키워드로 답안 쓰기
          </span>
        </div>

        {/* 개인화 코치 — 소개 아래에 자연스럽게 */}
        <div className="mt-5 rounded-xl bg-white/95 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-800">
            {userName ? `${userName} 님 — ` : ""}
            {plan ? plan.headline : "오늘부터 시작해 볼까요? 🚀"}
          </p>
          {plan?.subline && (
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {plan.subline}
            </p>
          )}
          {plan?.primary && (
            <Link
              href={plan.primary.href}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
            >
              지금 시작하기 →
            </Link>
          )}
        </div>
      </section>


      {/* 오늘의 토픽 — 심화반 커리큘럼(내가 정한 계획)에서 가져온다 */}
      {today && (
        <div className="mb-6 rounded-2xl border-2 border-brand-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex flex-wrap items-center gap-x-1 text-base font-extrabold text-slate-800 sm:text-sm sm:font-bold">
              🗓️ 오늘의 토픽{" "}
              <span className="text-brand-500">
                · {today.dayName}요일 · {today.day.label}
              </span>
              {!today.isToday && (
                <span
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
                  title="오늘 날짜가 계획에 없어 가장 가까운 학습일을 보여줍니다"
                >
                  {today.date} 분량
                </span>
              )}
            </h2>
            <Link
              href="/plan"
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              전체 계획 →
            </Link>
          </div>

          {today.day.kind === "study" ? (
            <>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                <span className="text-xs font-semibold text-slate-500">
                  학습한 토픽을 체크하세요 ·{" "}
                  {today.day.topics.filter((t) => done.has(doneKey(today.week.start, t.title))).length}/
                  {today.day.topics.length} 완료
                </span>
                <span className="hidden text-[11px] text-slate-400 sm:inline">
                  중요도 <b className="text-red-600">상★★★</b>{" "}
                  <b className="text-blue-600">중★★</b>{" "}
                  <b className="text-slate-500">하★</b>
                </span>
              </div>
              <ol className="space-y-2">
                {today.day.topics.map((t, i) => {
                  const checked = done.has(doneKey(today.week.start, t.title));
                  // 교재 원본 서브노트가 있으면 AI 없이 바로 볼 수 있다
                  const sub =
                    subnoteByTopicId(t.topicId) || subnoteByTitle(t.title);
                  return (
                    // 폰 화면: 제목 줄(체크·중요도·제목)과 버튼 줄을 나눠 제목이
                    // truncate 로 잘리지 않게 한다. sm 이상에서는 기존처럼 한 줄.
                    <li
                      key={t.title}
                      className={`flex flex-wrap items-center gap-x-2 gap-y-2 rounded-lg border p-2.5 sm:flex-nowrap sm:p-2 ${
                        checked
                          ? "border-amber-200 bg-amber-50"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-200 text-[11px] font-bold tabular-nums text-slate-500">
                        {i + 1}
                      </span>
                      <button
                        onClick={() => toggleDone(doneKey(today.week.start, t.title))}
                        aria-label="완료"
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border text-sm font-bold transition sm:h-6 sm:w-6 sm:text-xs ${
                          checked
                            ? "border-amber-400 bg-amber-500 text-white"
                            : "border-slate-300 bg-white text-transparent hover:border-amber-400"
                        }`}
                      >
                        ✓
                      </button>
                      <PriorityBadge p={t.priority} />
                      <span
                        className={`min-w-0 flex-1 break-keep text-sm leading-snug ${
                          checked ? "text-slate-400 line-through" : "text-slate-800"
                        }`}
                      >
                        {t.title}
                      </span>
                      {/* 버튼 묶음 — 모바일에서는 제 줄을 차지해 손가락으로 누르기 쉽게 */}
                      <span className="flex w-full items-center gap-1.5 sm:w-auto sm:shrink-0">
                        {sub && (
                          <span
                            className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
                            title="교재 서브노트 원본이 있어요"
                          >
                            📖 교재
                          </span>
                        )}
                        {/* 두음신공은 topicId 가 없어도 교재 서브노트만 있으면 열린다
                            (제목으로 찾는다). topicId 유무로 버튼을 감추면
                            프로세스 상태 전이도·CPU 스케줄링처럼 topics.json 에
                            없는 교재 전용 토픽이 학습을 못 하게 된다. */}
                        {(t.topicId || sub) && (
                          <Link
                            href={`/mnemonic?topic=${encodeURIComponent(t.title)}${t.topicId ? `&topicId=${t.topicId}` : ""}`}
                            className="flex-1 rounded-md bg-brand-600 px-2.5 py-1.5 text-center text-xs font-medium text-white hover:bg-brand-700 sm:flex-initial sm:py-1"
                          >
                            🥷 학습
                          </Link>
                        )}
                        <Link
                          href={`/explain?topic=${encodeURIComponent(t.title)}${t.topicId ? `&topicId=${t.topicId}` : ""}`}
                          className="flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-center text-xs font-medium text-slate-600 hover:bg-slate-100 sm:flex-initial sm:py-1"
                        >
                          💡 설명
                        </Link>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </>
          ) : today.day.kind === "review" ? (
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-slate-50 p-5">
              <p className="text-2xl">🔁</p>
              <p className="mt-1 text-sm font-bold text-amber-700">회독하는 날</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {today.day.note}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/commute"
                  className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  🚇 지하철 모드로 카드 넘기기
                </Link>
                <Link
                  href="/review"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  🔁 회독 관리
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 p-5 text-center">
              <p className="text-2xl">🌙</p>
              <p className="mt-1 text-sm font-bold text-indigo-700">
                {today.day.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {today.day.note}
              </p>
            </div>
          )}
        </div>
      )}

      {plan && plan.tasks.length > 0 && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              ✅ 오늘의 학습 순서
            </h2>
            <span className="text-xs text-slate-400">
              코치가 급한 순으로 정렬했어요
            </span>
          </div>

          {plan.goal.target > 0 && (
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-medium text-slate-600">
                  🎯 오늘의 목표 {plan.goal.done}/{plan.goal.target} 회독
                </span>
                <span className="text-slate-400">
                  {Math.round((plan.goal.done / plan.goal.target) * 100)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((plan.goal.done / plan.goal.target) * 100))}%`,
                  }}
                />
              </div>
              {plan.goal.done >= plan.goal.target && (
                <p className="mt-1 text-xs font-medium text-amber-600">
                  🎉 오늘 목표 달성! 새 토픽으로 더 나아가도 좋아요.
                </p>
              )}
            </div>
          )}

          <ol className="space-y-2">
            {plan.tasks.map((t, i) => (
              <li key={t.kind + i}>
                <Link
                  href={t.href}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition hover:shadow-sm ${toneClass[t.tone]}`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/70 text-xs font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <span className="text-lg">{t.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      {t.title}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {t.detail}
                    </span>
                  </span>
                  <span className="shrink-0 text-slate-400">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      <h2 className="mb-3 mt-10 text-lg font-bold text-slate-900">
        📊 내 학습 현황
      </h2>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="완료 진도" value={`${progress}%`} accent />
        <Stat label="퀴즈 정답률" value={stats.total > 0 ? `${accuracy}%` : "—"} />
        <Stat label="총 회독 수" value={`${totalRounds}회`} />
        <Stat label="오늘 복습" value={`${dueCount}개`} />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-slate-700">
              토픽 완료 ({doneCount}/{total})
            </span>
            <span className="text-slate-500">{progress}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            학습 중 {learningCount}개 · 시작 전{" "}
            {total - doneCount - learningCount}개
          </p>

          <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
            {stats.total > 0 ? (
              <>
                퀴즈 <span className="font-semibold">{stats.total}</span>문제 중{" "}
                <span className="font-semibold text-amber-600">
                  {stats.correct}
                </span>
                문제 정답 (정답률 {accuracy}%).
                {notesCount > 0 && (
                  <>
                    {" "}
                    <Link
                      href="/notes"
                      className="font-medium text-brand-600 hover:underline"
                    >
                      오답노트
                    </Link>
                    에서 복습하세요.
                  </>
                )}
              </>
            ) : (
              <>
                아직 푼 퀴즈가 없습니다.{" "}
                <Link
                  href="/memorize"
                  className="font-medium text-brand-600 hover:underline"
                >
                  암기 퀴즈
                </Link>
                를 풀면 정답률이 기록됩니다.
              </>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            분야별 완료 현황
          </h3>
          <div className="space-y-3">
            {byCategory.map((c) => {
              const pct = c.total ? Math.round((c.done / c.total) * 100) : 0;
              return (
                <div key={c.cat}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600">{c.cat}</span>
                    <span className="text-slate-400">
                      {c.done}/{c.total}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <h2 className="mb-1 mt-10 text-lg font-bold text-slate-900">메뉴</h2>
      <p className="mb-4 text-sm text-slate-500">
        이해 → 암기 → 답안 → 복습 순서로 학습하면 효과적입니다.
      </p>
      <div className="space-y-6">
        {menuGroups.map((g) => (
          <section key={g.group}>
            <h3 className="mb-2 text-sm font-semibold text-slate-600">
              {g.group}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {g.items.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md"
                >
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${m.color} text-xl`}
                  >
                    {m.emoji}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-900 group-hover:text-brand-600">
                      {m.title}
                    </h4>
                    <p className="truncate text-xs text-slate-500">{m.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-slate-600">
          🛋️ 공부하다 지치면 <b>마이룸</b>에서 잠깐 쉬어 가요.
        </p>
        <Link
          href="/room"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
        >
          내 방 꾸미러 가기 →
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <div
        className={`text-2xl font-bold ${accent ? "text-brand-600" : "text-slate-900"}`}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}
