"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui";
import PeerAnswers from "@/components/PeerAnswers";
import type { AnswerRow } from "@/lib/answerIndex";

const PERIODS = ["전체", "1교시", "2교시", "3교시", "4교시"];

/**
 * 모범답안 모아 보기 — 실제로 제출해 점수를 받은 답안지 스캔.
 *
 * 토픽 설명 안에서만 볼 수 있어서 "지금 어떤 답안지가 있나"를 훑을 자리가
 * 없었다. 검색은 문제 문구·시험·토픽·첨삭을 모두 훑는다. 카드는 토픽 설명과
 * 같은 것(PeerAnswers)을 그대로 쓴다 — 두 화면이 다르게 보이면 안 된다.
 */
export default function AnswersClient({ rows }: { rows: AnswerRow[] }) {
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState("전체");

  const hits = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter((r) => {
      if (period !== "전체" && r.period !== period) return false;
      return words.every((w) => r.hay.includes(w));
    });
  }, [rows, q, period]);

  const pages = hits.reduce((n, r) => n + r.pages.length, 0);

  return (
    <div>
      <PageHeader
        title="✍️ 모범답안"
        desc={`실제로 제출해 점수를 받은 답안지 ${rows.length}건 · 스캔 ${rows.reduce((n, r) => n + r.pages.length, 0)}장 — 배점 대비 점수와 빨간 첨삭이 곧 채점 기준입니다.`}
        up={[
          { href: "/plan", label: "🗓️ 학습 계획" },
          { href: "/explain", label: "💡 토픽 설명" },
          { href: "/exam", label: "📝 기출문제" },
        ]}
      />

      <div className="sticky top-[84px] z-[5] -mx-4 mb-5 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur xl:top-[57px]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색 — 토픽명·문제 문구·시험명 아무거나 (예: 테일러링, ATAM, 요구공학)"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
        />
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <div className="flex flex-wrap gap-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-2.5 py-1 font-medium ${
                  period === p ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <span className="text-slate-400">
            {hits.length}건 · {pages}장
          </span>
        </div>
      </div>

      {hits.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          찾는 답안지가 없어요. 검색어를 줄이거나 교시 필터를 푸세요.
        </p>
      ) : (
        /* 교시마다 큰 제목을 단다 — 1교시(10점)와 3·4교시(25점)는 쓰는 분량이
           아예 다르므로 어느 교시 답안을 보고 있는지가 먼저 보여야 한다. */
        PERIODS.slice(1).map((p) => {
          const group = hits.filter((r) => r.period === p);
          if (group.length === 0) return null;
          return (
            <section key={p} className="mb-8">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-3 border-b-2 border-slate-800 pb-1.5">
                <h2 className="text-2xl font-bold text-slate-900">{p}</h2>
                <span className="text-xs text-slate-500">
                  {group.length}건 · 스캔 {group.reduce((n, r) => n + r.pages.length, 0)}장
                  {p === "1교시" ? " · 10점 만점" : " · 25점 만점"}
                </span>
              </div>
              <PeerAnswers items={group} />
            </section>
          );
        })
      )}
    </div>
  );
}
