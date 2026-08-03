"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import {
  WEEKS,
  Priority,
  CurriculumDay,
  planForToday,
  loadDone,
  saveDone,
} from "@/data/curriculum";
import { subnoteByTopicId, subnoteByTitle } from "@/data/textbookSubnotes";

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

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

/** YYYY-MM-DD + n일 → "M/D" */
function dateLabel(start: string, offset: number): string {
  const [y, m, d] = start.split("-").map(Number);
  const dt = new Date(y, m - 1, d + offset);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

export default function PlanPage() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [todayKey, setTodayKey] = useState<string | null>(null);

  useEffect(() => {
    setDone(loadDone());
    const t = planForToday();
    if (t) setTodayKey(`${t.week.start}#${t.dayIndex}`);
  }, []);

  function toggle(title: string) {
    const next = new Set(done);
    next.has(title) ? next.delete(title) : next.add(title);
    setDone(next);
    saveDone(next);
  }

  function toggleDay(day: CurriculumDay, allDone: boolean) {
    if (day.kind !== "study") return;
    const next = new Set(done);
    for (const t of day.topics) allDone ? next.delete(t.title) : next.add(t.title);
    setDone(next);
    saveDone(next);
  }

  // 전체 진행률
  const allTopics = WEEKS.flatMap((w) =>
    w.days.flatMap((d) => (d.kind === "study" ? d.topics : [])),
  );
  const doneN = allTopics.filter((t) => done.has(t.title)).length;
  const pct = allTopics.length
    ? Math.round((doneN / allTopics.length) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title="🗓️ 학습 계획"
        desc="심화반 커리큘럼 — 내가 정한 주차별 토픽. 중요도는 교재 Priority(상★★★·중★★·하★) 그대로입니다."
      />

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
            const d = list.filter((t) => done.has(t.title)).length;
            return (
              <span key={p} className="inline-flex items-center gap-1.5">
                <PriorityBadge p={p} />
                {d}/{list.length}
              </span>
            );
          })}
        </div>
      </div>

      {WEEKS.map((week) => (
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
              const topics = day.kind === "study" ? day.topics : [];
              const dDone = topics.filter((t) => done.has(t.title)).length;
              const allDone = topics.length > 0 && dDone === topics.length;
              return (
                <div
                  key={di}
                  className={`overflow-hidden rounded-2xl border-2 bg-white shadow-sm ${
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
                      {isToday && (
                        <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          오늘
                        </span>
                      )}
                    </div>
                    {day.kind === "study" && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                          {dDone}/{topics.length}
                        </span>
                        <button
                          onClick={() => toggleDay(day, allDone)}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                        >
                          {allDone ? "전체 해제" : "전체 완료"}
                        </button>
                      </div>
                    )}
                  </div>

                  {day.kind === "study" ? (
                    <ol className="divide-y divide-slate-100">
                      {topics.map((t, i) => {
                        const checked = done.has(t.title);
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
                              onClick={() => toggle(t.title)}
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
                            <span
                              className={`min-w-0 flex-1 truncate text-sm ${
                                checked
                                  ? "text-slate-400 line-through"
                                  : "text-slate-800"
                              }`}
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
                            {t.topicId && (
                              <Link
                                href={`/mnemonic?topic=${encodeURIComponent(t.title)}&topicId=${t.topicId}`}
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
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">
                      {day.kind === "review" ? "🔁 " : "🌙 "}
                      {day.note}
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
