"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import {
  WEEKS,
  Priority,
  CurriculumTopic,
  planForToday,
  loadDone,
  saveDone,
  doneKey,
  curriculumMonths,
  monthGrid,
  todayISO,
} from "@/data/curriculum";
import type { StudyLevel } from "@/data/curriculum";
import { subnoteByTopicId, subnoteByTitle } from "@/data/textbookSubnotes";

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

/** 읽기 방식 — 정독은 한 줄씩, 평독은 아는 곳을 넘기며 빠르게. */
const MODE_STYLE: Record<string, string> = {
  정독: "bg-indigo-600 text-white",
  평독: "bg-indigo-100 text-indigo-700",
};

function ModeBadge({ mode }: { mode: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${MODE_STYLE[mode] || "bg-slate-100 text-slate-600"}`}
      title={mode === "정독" ? "한 줄씩 뜯어 읽습니다" : "아는 곳은 넘기며 빠르게 훑습니다"}
    >
      {mode}
    </span>
  );
}

const PRIORITY_STYLE: Record<Priority, { cls: string; star: string }> = {
  상: { cls: "bg-red-100 text-red-700 ring-red-200", star: "★★★" },
  중: { cls: "bg-blue-100 text-blue-700 ring-blue-200", star: "★★" },
  하: { cls: "bg-slate-100 text-slate-600 ring-slate-200", star: "★" },
};

/**
 * 출제 대비 강도 — 교재 중요도(상·중·하)와 다른 축이라 색·모양을 따로 준다.
 * 중요도는 채워진 배지, 레벨은 테두리만 있는 배지로 한눈에 구분한다.
 */
const LEVEL_STYLE: Record<StudyLevel, { cls: string; mark: string }> = {
  암기: { cls: "border-rose-400 text-rose-700 bg-rose-50", mark: "●●●" },
  숙지: { cls: "border-amber-400 text-amber-700 bg-amber-50", mark: "●●" },
  점검: { cls: "border-sky-400 text-sky-700 bg-sky-50", mark: "●" },
  참고: { cls: "border-slate-300 text-slate-500 bg-white", mark: "○" },
};

function LevelBadge({ level, note }: { level: StudyLevel; note?: string }) {
  const s = LEVEL_STYLE[level];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold ${s.cls}`}
      title={note ? `${level} — ${note}` : level}
    >
      {level}
      <span className="text-[8px] leading-none">{s.mark}</span>
    </span>
  );
}

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

/** YYYY-MM-DD + n일 → Date */
function shift(start: string, offset: number): Date {
  const [y, m, d] = start.split("-").map(Number);
  return new Date(y, m - 1, d + offset);
}
/** YYYY-MM-DD + n일 → "M/D" */
function dateLabel(start: string, offset: number): string {
  const dt = shift(start, offset);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}
/** 달력 → 주차 카드로 점프할 때 쓰는 앵커 id */
function dateId(start: string, offset: number): string {
  const dt = shift(start, offset);
  const p = (n: number) => String(n).padStart(2, "0");
  return `d-${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

const MONTH_LABEL = (ym: string) => {
  const [y, m] = ym.split("-");
  return `${y}년 ${Number(m)}월`;
};

/** 달력 — 커리큘럼이 걸친 달을 넘겨보며 어느 날 무슨 토픽인지 한눈에 본다. */
function Calendar({
  today,
  done,
  onPick,
}: {
  today: string | null;
  done: Set<string>;
  /** 학습일 클릭 → 그 주차를 아래 리스트에 펼치고 해당 날짜로 스크롤 */
  onPick: (weekStart: string, date: string) => void;
}) {
  const months = curriculumMonths();
  // 오늘이 포함된 달을 기본으로, 없으면 첫 달.
  const initial = months.find((m) => today?.startsWith(m)) ?? months[0];
  const [ym, setYm] = useState(initial);
  const idx = months.indexOf(ym);
  const cells = monthGrid(ym);

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => idx > 0 && setYm(months[idx - 1])}
          disabled={idx <= 0}
          className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-600 disabled:opacity-30"
          aria-label="이전 달"
        >
          ‹
        </button>
        <h2 className="text-sm font-bold text-slate-900">{MONTH_LABEL(ym)}</h2>
        <button
          onClick={() => idx < months.length - 1 && setYm(months[idx + 1])}
          disabled={idx >= months.length - 1}
          className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-600 disabled:opacity-30"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
        {DAY_NAMES.map((d, i) => (
          <div key={d} className={i === 6 ? "text-red-400" : ""}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c.date) return <div key={i} />;
          const day = c.plan?.day;
          const isToday = c.date === today;
          // 정독일도 그 주 범위를 토픽으로 들고 있으므로 달력에서도 같이 센다.
          const topics =
            day?.kind === "study" || day?.kind === "review"
              ? (day.topics ?? [])
              : [];
          const ws = c.plan?.week.start ?? "";
          const scope = day?.kind === "review" ? `d${c.plan?.dayIndex ?? 0}` : "";
          const dDone = topics.filter((tp) =>
            done.has(doneKey(ws, tp.title, scope)),
          ).length;
          const allDone = topics.length > 0 && dDone === topics.length;
          const tone =
            day?.kind === "study"
              ? allDone
                ? "border-amber-300 bg-amber-50"
                : "border-brand-200 bg-brand-50"
              : day?.kind === "review"
                ? allDone
                  ? "border-amber-300 bg-amber-50"
                  : "border-emerald-200 bg-emerald-50"
                : day?.kind === "open"
                  ? "border-dashed border-slate-300 bg-white"
                  : day?.kind === "class"
                    ? "border-indigo-200 bg-indigo-50"
                    : day?.kind === "rest"
                      ? "border-slate-200 bg-slate-50"
                      : "border-transparent bg-white";
          const body = (
            <div
              className={`flex h-full min-h-[62px] flex-col rounded-lg border p-1 text-left ${tone} ${
                isToday ? "ring-2 ring-brand-500" : ""
              }`}
            >
              <span
                className={`text-[10px] font-bold ${
                  isToday ? "text-brand-700" : "text-slate-500"
                }`}
              >
                {c.day}
              </span>
              {day?.kind === "study" && (
                <>
                  <span className="mt-0.5 line-clamp-2 text-[9px] font-semibold leading-tight text-slate-700">
                    {day.label}
                  </span>
                  <span className="mt-auto text-[9px] font-bold tabular-nums text-brand-700">
                    {dDone}/{topics.length}
                  </span>
                </>
              )}
              {day?.kind === "review" && (
                <>
                  <span className="mt-0.5 line-clamp-2 text-[9px] font-semibold leading-tight text-emerald-800">
                    🔁 {day.label}
                  </span>
                  {topics.length > 0 && (
                    <span className="mt-auto text-[9px] font-bold tabular-nums text-emerald-700">
                      {dDone}/{topics.length}
                    </span>
                  )}
                </>
              )}
              {day?.kind === "class" && (
                <span className="mt-0.5 text-[9px] font-semibold text-indigo-700">
                  🏫 학원
                </span>
              )}
              {day?.kind === "rest" && (
                <span className="mt-0.5 text-[9px] font-semibold text-slate-400">
                  🌙 휴식
                </span>
              )}
              {day?.kind === "open" && (
                <span className="mt-0.5 text-[9px] font-medium text-slate-400">
                  + 대기
                </span>
              )}
            </div>
          );
          return day?.kind === "study" ||
            (day?.kind === "review" && topics.length > 0) ? (
            <button
              key={i}
              type="button"
              onClick={() => onPick(ws, c.date!)}
              className="block w-full text-left"
            >
              {body}
            </button>
          ) : (
            <div key={i}>{body}</div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2.5 text-[10px] text-slate-500">
        <Legend cls="border-brand-200 bg-brand-50" label="학습" />
        <Legend cls="border-amber-300 bg-amber-50" label="완료" />
        <Legend cls="border-emerald-200 bg-emerald-50" label="회독" />
        <Legend cls="border-dashed border-slate-300 bg-white" label="토픽 대기" />
        <Legend cls="border-slate-200 bg-slate-50" label="휴식" />
      </div>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`inline-block h-3 w-3 rounded border ${cls}`} />
      {label}
    </span>
  );
}

/** 주차 선택 칩 라벨 — "선행 1주" / "심화 5주" */
function weekChipLabel(title: string): string {
  const n = title.match(/(\d)주차/)?.[1] ?? "?";
  return `${title.startsWith("선행") ? "선행" : "심화"} ${n}주`;
}

/** 이 탭에서 마지막으로 보던 주차·날짜 */
const SEEN_KEY = "myroom:planSeen";

export default function PlanPage() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [todayKey, setTodayKey] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);
  // 아래 리스트에 펼칠 주차 — 기본은 오늘이 속한 주차 하나만("all"이면 전체).
  const [sel, setSel] = useState<string | "all">("all");

  /**
   * 보고 있던 주차를 이 탭에만 기억해 둔다.
   * 토픽을 보고 뒤로 돌아오면 컴포넌트가 다시 마운트되는데, 기억해 두지
   * 않으면 늘 오늘 주차로 되돌아가 보던 자리를 잃는다.
   * 주소(?w=)에 남기지 않는 이유는, replace 로 주소를 바꾸면 뒤로가기
   * 추적(NavDepth)이 이동으로 오해해 스택이 엉키기 때문이다.
   */
  const remember = useCallback((weekStart: string | "all", date?: string) => {
    try {
      sessionStorage.setItem(SEEN_KEY, JSON.stringify({ w: weekStart, d: date }));
    } catch {
      // 사생활 보호 모드 등에서 막히면 기억하지 않는다(오늘 주차로 열림).
    }
  }, []);

  useEffect(() => {
    setDone(loadDone());
    setToday(todayISO());
    const t = planForToday();
    // "오늘" 강조는 진짜 오늘일 때만. 커리큘럼 밖이라 대신 채운 날은 강조하지 않는다.
    if (t?.isToday) setTodayKey(`${t.week.start}#${t.dayIndex}`);
    // 보던 주차가 있으면 그것을 먼저 연다(뒤로 돌아온 경우).
    let seen: { w?: string; d?: string } | null = null;
    try {
      const raw = sessionStorage.getItem(SEEN_KEY);
      seen = raw ? JSON.parse(raw) : null;
    } catch {
      seen = null;
    }
    if (seen?.w) {
      setSel(seen.w);
      if (seen.d) {
        setTimeout(() => {
          document.getElementById(`d-${seen!.d}`)?.scrollIntoView({ block: "start" });
        }, 60);
      }
      return;
    }
    if (t) setSel(t.week.start);
  }, []);

  /** 달력 학습일 클릭 — 그 주차만 펼치고 해당 날짜 카드로 스크롤 */
  function pick(weekStart: string, date: string) {
    setSel(weekStart);
    remember(weekStart, date);
    setTimeout(() => {
      document
        .getElementById(`d-${date}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  function toggle(weekStart: string, title: string, scope = "") {
    const k = doneKey(weekStart, title, scope);
    const next = new Set(done);
    next.has(k) ? next.delete(k) : next.add(k);
    setDone(next);
    saveDone(next);
  }

  function toggleDay(
    weekStart: string,
    topics: CurriculumTopic[],
    allDone: boolean,
    scope = "",
  ) {
    const next = new Set(done);
    for (const t of topics) {
      const k = doneKey(weekStart, t.title, scope);
      allDone ? next.delete(k) : next.add(k);
    }
    setDone(next);
    saveDone(next);
  }

  // 전체 진행률 — 주차별로 따로 센다(선행 학습 + 심화반).
  const allTopics = WEEKS.flatMap((w) =>
    w.days.flatMap((d) =>
      d.kind === "study"
        ? d.topics.map((t) => ({ ...t, key: doneKey(w.start, t.title) }))
        : [],
    ),
  );
  const doneN = allTopics.filter((t) => done.has(t.key)).length;
  const pct = allTopics.length
    ? Math.round((doneN / allTopics.length) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title="🗓️ 학습 계획"
        desc="심화반 커리큘럼 — 내가 정한 주차별 토픽. 중요도는 교재 Priority(상★★★·중★★·하★) 그대로입니다."
      />

      <Link
        href="/basics"
        className="mb-6 block rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-[14.5px] leading-relaxed text-slate-800 hover:bg-amber-100"
      >
        🧱 <b>모르는 용어가 나오면</b> — 용어 사전에서 검색하고 바로
        복귀하세요. 전문용어 없는 한 줄 정의 + 관련 토픽 링크. <b className="text-brand-700">용어 사전 →</b>
      </Link>

      <Calendar key={today ?? "init"} today={today} done={done} onPick={pick} />

      {/* 전체 진행률 */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-medium text-slate-700">
            전체 진도 {doneN}/{allTopics.length}
          </span>
          <span className="text-slate-500">{pct}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
          {(["상", "중", "하"] as Priority[]).map((p) => {
            const list = allTopics.filter((t) => t.priority === p);
            const d = list.filter((t) => done.has(t.key)).length;
            return (
              <span key={p} className="inline-flex items-center gap-1.5">
                <PriorityBadge p={p} />
                {d}/{list.length}
              </span>
            );
          })}
        </div>
      </div>

      {/* 주차 선택 — 달력에서 날짜를 눌러도 해당 주차로 바뀐다 */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => { setSel("all"); remember("all"); }}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
            sel === "all"
              ? "border-brand-500 bg-brand-600 text-white"
              : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          전체
        </button>
        {[...WEEKS]
          .sort((a, b) => a.start.localeCompare(b.start))
          .map((w) => (
            <button
              key={w.start}
              type="button"
              onClick={() => { setSel(w.start); remember(w.start); }}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                sel === w.start
                  ? "border-brand-500 bg-brand-600 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {weekChipLabel(w.title)}
              <span className={`ml-1 font-medium ${sel === w.start ? "text-brand-100" : "text-slate-400"}`}>
                {dateLabel(w.start, 0)}
              </span>
            </button>
          ))}
      </div>

      {WEEKS.filter((w) => sel === "all" || w.start === sel).map((week) => (
        <section key={week.start} className="mb-8">
          <h2 className="mb-3 text-base font-bold text-slate-900">
            {week.title}{" "}
            <span className="text-sm font-medium text-slate-400">
              ({dateLabel(week.start, 0)} ~ {dateLabel(week.start, 6)})
            </span>
          </h2>

          <div className="space-y-3">
            {week.days.map((day, di) => {
              const isToday = todayKey === `${week.start}#${di}`;
              // 정독일(review)도 그 주 범위 전체를 토픽으로 들고 있다.
              const topics =
                day.kind === "study" || day.kind === "review"
                  ? (day.topics ?? [])
                  : [];
              // 회독 차수를 따로 센다 — 월 정독에서 체크한 것이 진도 완료로
              // 보이면 안 되고, 토 정독도 월과 별개로 세야 한다.
              const scope = day.kind === "review" ? `d${di}` : "";
              const dDone = topics.filter((t) =>
                done.has(doneKey(week.start, t.title, scope)),
              ).length;
              const allDone = topics.length > 0 && dDone === topics.length;
              return (
                <div
                  key={di}
                  id={dateId(week.start, di)}
                  className={`scroll-mt-20 overflow-hidden rounded-2xl border-2 bg-white shadow-sm ${
                    isToday ? "border-brand-400" : "border-slate-200"
                  }`}
                >
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 ${
                      isToday ? "bg-brand-50" : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-extrabold ${
                          isToday
                            ? "bg-brand-600 text-white"
                            : "bg-white text-slate-500 ring-1 ring-slate-200"
                        }`}
                      >
                        {DAY_NAMES[di]}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {dateLabel(week.start, di)}
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {day.label}
                      </span>
                      {"mode" in day && day.mode && <ModeBadge mode={day.mode} />}
                      {isToday && (
                        <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          오늘
                        </span>
                      )}
                    </div>
                    {topics.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                          {dDone}/{topics.length}
                        </span>
                        <button
                          onClick={() => toggleDay(week.start, topics, allDone, scope)}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                        >
                          {allDone ? "전체 해제" : "전체 완료"}
                        </button>
                      </div>
                    )}
                  </div>

                  {topics.length > 0 ? (
                    <>
                      {day.kind === "review" && (
                        <p className="border-b border-slate-100 bg-indigo-50/50 px-4 py-2.5 text-sm text-indigo-900">
                          🔁 {day.note}
                        </p>
                      )}
                    <ol className="divide-y divide-slate-100">
                      {topics.map((t, i) => {
                        const checked = done.has(
                          doneKey(week.start, t.title, scope),
                        );
                        const sub =
                          subnoteByTopicId(t.topicId) || subnoteByTitle(t.title);
                        return (
                          <li
                            key={t.title}
                            className={`flex items-center gap-2 px-4 py-2 ${
                              checked ? "bg-amber-50/60" : ""
                            }`}
                          >
                            <span className="w-5 shrink-0 text-right text-[11px] font-bold tabular-nums text-slate-400">
                              {i + 1}
                            </span>
                            <button
                              onClick={() => toggle(week.start, t.title, scope)}
                              aria-label="완료"
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded border text-[11px] font-bold transition ${
                                checked
                                  ? "border-amber-400 bg-amber-500 text-white"
                                  : "border-slate-300 bg-white text-transparent hover:border-amber-400"
                              }`}
                            >
                              ✓
                            </button>
                            <PriorityBadge p={t.priority} />
                            {t.level && (
                              <LevelBadge level={t.level} note={t.note} />
                            )}
                            <span
                              className={`min-w-0 flex-1 truncate text-sm ${
                                checked
                                  ? "text-slate-400 line-through"
                                  : "text-slate-800"
                              }`}
                              title={t.note}
                            >
                              {t.title}
                            </span>
                            {sub && (
                              <span
                                className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
                                title="교재 서브노트 원본 있음"
                              >
                                📖
                              </span>
                            )}
                            {/* 교재 서브노트만 있어도(topicId 없어도) 두음신공은 열린다 */}
                            {(t.topicId || sub) && (
                              <Link
                                href={`/mnemonic?topic=${encodeURIComponent(t.title)}${t.topicId ? `&topicId=${t.topicId}` : ""}`}
                                className="shrink-0 rounded-md bg-brand-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-brand-700"
                              >
                                🥷
                              </Link>
                            )}
                            <Link
                              href={`/explain?topic=${encodeURIComponent(t.title)}`}
                              className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                            >
                              💡
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                    </>
                  ) : (
                    <p
                      className={`px-4 py-3 text-sm ${
                        day.kind === "open"
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {day.kind === "review"
                        ? "🔁 "
                        : day.kind === "open"
                          ? "📥 "
                          : "🌙 "}
                      {/* 진도일(study)에는 note 가 없다 — 토픽이 비었을 때만 오는 자리라 안전하게 좁힌다. */}
                      {"note" in day ? day.note : null}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <p className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        새 주차는 <code className="rounded bg-white px-1">src/data/curriculum.ts</code> 의
        WEEKS 에 추가하면 이 화면과 홈의 &ldquo;오늘의 토픽&rdquo;에 바로 반영됩니다. 다음 주차
        토픽 목록을 주시면 넣어 드릴게요.
      </p>
    </div>
  );
}
