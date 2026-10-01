"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui";
import PeerAnswers from "@/components/PeerAnswers";
import type { AnswerRow, ModelRow } from "@/lib/answerIndex";
import ModelAnswerList from "@/components/ModelAnswerList";
import { DOMAINS } from "@/lib/domains";

const PERIODS = ["전체", "1교시", "2교시", "3교시", "4교시"];
const UNSORTED = "미분류";

/**
 * 모범답안 모아 보기 — 실제로 제출해 점수를 받은 답안지 스캔.
 *
 * 토픽 설명 안에서만 볼 수 있어서 "지금 어떤 답안지가 있나"를 훑을 자리가
 * 없었다. 검색은 문제 문구·시험·토픽·첨삭을 모두 훑는다. 카드는 토픽 설명과
 * 같은 것(PeerAnswers)을 그대로 쓴다 — 두 화면이 다르게 보이면 안 된다.
 */
export default function AnswersClient({ rows, models }: { rows: AnswerRow[]; models: ModelRow[] }) {
  const [q, setQ] = useState("");
  // 시험지 스캔 / 클로드 모범답안 — 스캔이 없는 토픽(프롬프트 인젝션 …)은 클로드 쪽에만 있다.
  const [tab, setTab] = useState<"scan" | "claude">("scan");
  const [limit, setLimit] = useState(60);
  const [period, setPeriod] = useState("전체");
  // 주 필터는 과목(도메인)이다 — 교시로 걸러서는 "DB 답안만 보자"가 안 됐다.
  const [domain, setDomain] = useState("전체");

  // 과목 칩 — 커리큘럼 순서, 답안이 있는 과목만. 못 잡은 답안은 '미분류' 칩으로.
  const domainChips = useMemo(() => {
    const count = new Map<string, number>();
    for (const r of rows) count.set(r.domain, (count.get(r.domain) ?? 0) + 1);
    const ordered = [...DOMAINS.map((d) => d.label), UNSORTED].filter((d) => count.has(d));
    return [{ label: "전체", n: rows.length }, ...ordered.map((d) => ({ label: d, n: count.get(d) ?? 0 }))];
  }, [rows]);

  const hits = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter((r) => {
      if (domain !== "전체" && r.domain !== domain) return false;
      if (period !== "전체" && r.period !== period) return false;
      return words.every((w) => r.hay.includes(w));
    });
  }, [rows, q, period, domain]);

  const pages = hits.reduce((n, r) => n + r.pages.length, 0);

  // 검색 문자열은 화면에서 한 번 만든다 — 4,700행에 실어 보내면 페이지가 수 MB 늘어난다.
  const modelHay = useMemo(
    () => models.map((r) => [r.question, r.title, r.source, r.topic].join(" ").toLowerCase()),
    [models],
  );
  const modelHits = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return models.filter((r, i) => {
      if (domain !== "전체" && r.domain !== domain) return false;
      if (period !== "전체" && r.period !== period) return false;
      return words.every((w) => modelHay[i].includes(w));
    });
  }, [models, modelHay, q, period, domain]);

  // 고른 탭에 결과가 없고 다른 탭에 있으면 그쪽을 보여 준다 — 「없다」로 끝나지 않게.
  const view: "scan" | "claude" =
    tab === "scan" && hits.length === 0 && modelHits.length > 0
      ? "claude"
      : tab === "claude" && modelHits.length === 0 && hits.length > 0
        ? "scan"
        : tab;

  const modelGroups = useMemo(() => {
    const by = new Map<string, ModelRow[]>();
    for (const r of modelHits) (by.get(r.topic) ?? by.set(r.topic, []).get(r.topic)!).push(r);
    return Array.from(by, ([topic, items]) => ({ topic, items })).sort(
      (a, b) => b.items.length - a.items.length || a.topic.localeCompare(b.topic, "ko"),
    );
  }, [modelHits]);

  /**
   * 토픽으로 묶는다 — 답안지는 토픽 하나에 여러 건이 쌓인다(테일러링 5건,
   * ATAM 5건). 흩어 놓으면 같은 문제 답안을 비교할 수가 없다.
   * 묶음 기준은 첫 번째 토픽 제목이고, 건수가 많은 토픽부터 올린다.
   */
  const groups = useMemo(() => {
    const by = new Map<string, AnswerRow[]>();
    for (const r of hits) {
      const k = r.topicTitles[0] ?? r.question;
      (by.get(k) ?? by.set(k, []).get(k)!).push(r);
    }
    return Array.from(by, ([topic, items]) => ({
      topic,
      items: items.slice().sort((a, b) => a.period.localeCompare(b.period) || (b.score ?? 0) - (a.score ?? 0)),
      scores: items
        .filter((i) => i.score != null)
        .map((i) => `${i.score}${i.maxScore ? `/${i.maxScore}` : ""}`),
    })).sort((a, b) => b.items.length - a.items.length || a.topic.localeCompare(b.topic, "ko"));
  }, [hits]);

  return (
    <div>
      <PageHeader
        title="✍️ 모범답안"
        desc={`실제로 제출해 점수를 받은 답안지 ${rows.length}건 · 스캔 ${rows.reduce((n, r) => n + r.pages.length, 0)}장, 그리고 문제별로 써 둔 클로드 모범답안 ${models.length}편.`}
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
            {domainChips.map((d) => (
              <button
                key={d.label}
                onClick={() => setDomain(d.label)}
                className={`rounded-full px-2.5 py-1 font-medium ${
                  domain === d.label ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {d.label} <span className="opacity-70">{d.n}</span>
              </button>
            ))}
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
            title="교시로도 좁힐 수 있습니다"
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p === "전체" ? "교시 전체" : p}
              </option>
            ))}
          </select>
          <span className="text-slate-400">
            {hits.length}건 · {pages}장
          </span>
        </div>
        <div className="mt-2 flex gap-1 text-xs">
          {([
            ["scan", `✍️ 시험지 스캔 ${hits.length}`],
            ["claude", `📘 클로드 모범답안 ${modelHits.length}`],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => {
                setTab(k);
                setLimit(60);
              }}
              className={`rounded-lg px-3 py-1.5 font-semibold ${
                view === k ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === "claude" ? (
        modelHits.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            찾는 모범답안이 없어요. 검색어를 줄이거나 과목·교시 필터를 푸세요.
          </p>
        ) : (
          <>
            {tab !== view && (
              <p className="mb-3 text-xs text-slate-500">시험지 스캔에는 없어서 클로드 모범답안을 보여 줍니다.</p>
            )}
            {modelGroups.slice(0, limit).map((g) => (
              <section key={g.topic} className="mb-6">
                <div className="mb-2 flex flex-wrap items-baseline gap-x-3 border-b-2 border-amber-400 pb-1">
                  <h2 className="text-xl font-bold text-slate-900">{g.topic}</h2>
                  <span className="text-xs text-slate-500">{g.items.length}편</span>
                </div>
                <ModelAnswerList items={g.items} />
              </section>
            ))}
            {modelGroups.length > limit && (
              <button
                onClick={() => setLimit((n) => n + 60)}
                className="w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-200"
              >
                토픽 더 보기 ({modelGroups.length - limit}개 남음)
              </button>
            )}
          </>
        )
      ) : (
      <>
      {tab !== view && (
        <p className="mb-3 text-xs text-slate-500">클로드 모범답안에는 없어서 시험지 스캔을 보여 줍니다.</p>
      )}

      {hits.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          찾는 답안지가 없어요. 검색어를 줄이거나 과목·교시 필터를 푸세요.
        </p>
      ) : (
        /* 토픽마다 큰 제목을 단다. 같은 토픽 답안이 여러 건이면 나란히 놓고
           비교하는 게 이 자료의 쓸모다 — 6점짜리와 6.5점짜리가 뭐가 다른지. */
        groups.map((g) => (
          <section key={g.topic} className="mb-8">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 border-b-2 border-slate-800 pb-1.5">
              <h2 className="text-2xl font-bold text-slate-900">{g.topic}</h2>
              <span className="text-xs text-slate-500">
                {g.items.length}건 · 스캔 {g.items.reduce((n, r) => n + r.pages.length, 0)}장
              </span>
              {g.scores.length > 0 && (
                <span className="text-xs font-medium text-slate-700">
                  받은 점수 {g.scores.join(" · ")}
                </span>
              )}
            </div>
            <PeerAnswers items={g.items} />
          </section>
        ))
      )}
      </>
      )}
    </div>
  );
}
