"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import type { AnswerRow } from "@/lib/answerIndex";

const PERIODS = ["전체", "1교시", "2교시", "3교시", "4교시"];
const KINDS = ["전체", "기출", "NS모의", "파이널", "모의고사", "예상", "셀테"];

const PERIOD_CHIP: Record<string, string> = {
  "1교시": "bg-emerald-100 text-emerald-700",
  "2교시": "bg-sky-100 text-sky-700",
  "3교시": "bg-violet-100 text-violet-700",
  "4교시": "bg-amber-100 text-amber-700",
};

/**
 * 모범답안만 모아 보는 화면.
 *
 * 답안은 문항에 매달려 있어서 기출·문제은행에서 문항을 찾아 들어가야만 볼 수
 * 있었다. "지금 쓸 만한 답안이 뭐가 있나"를 훑을 자리가 없었다는 뜻이다.
 * 검색은 제목·문제 전문·출처를 모두 훑고, 본문은 누를 때 /answer 에서 받는다.
 */
export default function AnswersClient({ rows }: { rows: AnswerRow[] }) {
  const [q, setQ] = useState("");
  const [period, setPeriod] = useState("전체");
  const [kind, setKind] = useState("전체");
  const [limit, setLimit] = useState(100);

  const hits = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter((r) => {
      if (period !== "전체" && r.period !== period) return false;
      if (kind !== "전체" && r.kind !== kind) return false;
      return words.every((w) => r.hay.includes(w));
    });
  }, [rows, q, period, kind]);

  return (
    <div>
      <PageHeader
        title="🧾 모범답안"
        desc={`클로드가 답안작성방법론대로 미리 써 둔 답안 ${rows.length.toLocaleString()}건 — AI 호출 없이 바로 열립니다.`}
        up={[
          { href: "/plan", label: "🗓️ 학습 계획" },
          { href: "/explain", label: "💡 토픽 설명" },
          { href: "/exam", label: "📝 기출문제" },
        ]}
      />

      <div className="sticky top-[84px] z-[5] -mx-4 mb-5 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur xl:top-[57px]">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(100);
          }}
          placeholder="검색 — 토픽명·문제 문구·회차 아무거나 (예: 테일러링, ATAM, 139회)"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
        />
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <div className="flex flex-wrap gap-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  setLimit(100);
                }}
                className={`rounded-full px-2.5 py-1 font-medium ${
                  period === p ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {KINDS.map((k) => (
              <button
                key={k}
                onClick={() => {
                  setKind(k);
                  setLimit(100);
                }}
                className={`rounded-full px-2.5 py-1 ${
                  kind === k ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <span className="text-slate-400">{hits.length.toLocaleString()}건</span>
        </div>
      </div>

      {hits.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          찾는 답안이 없어요. 검색어를 줄이거나 교시·출처 필터를 푸세요.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {hits.slice(0, limit).map((r) => (
            <li key={r.id}>
              <Link
                href={`/answer?id=${encodeURIComponent(r.id)}`}
                className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13.5px] hover:border-brand-400"
              >
                <span
                  className={`shrink-0 rounded px-1.5 py-[1px] text-[10.5px] font-bold ${
                    PERIOD_CHIP[r.period] || "bg-slate-100 text-slate-500"
                  }`}
                >
                  {r.period || "—"}
                </span>
                <span className="font-medium text-slate-800">{r.title}</span>
                <span className="ml-auto shrink-0 text-[11px] text-slate-400">
                  {[r.kind, r.exam].filter(Boolean).join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hits.length > limit && (
        <button
          onClick={() => setLimit((n) => n + 200)}
          className="mt-4 w-full rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          더 보기 ({(hits.length - limit).toLocaleString()}건 남음)
        </button>
      )}
    </div>
  );
}
