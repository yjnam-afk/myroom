"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import Markdown from "@/components/Markdown";
import CopyButton from "@/components/CopyButton";
import questions from "@/data/questions.json";
import { relatedTopics } from "@/lib/relatedTopics";
import { canonicalAnswerId, getModelAnswer } from "@/lib/modelAnswers";
import { matchSubnoteTitle } from "@/lib/matchSubnote";
import genAnswers from "@/data/genAnswers.json";

type Q = {
  id: string;
  period: string;
  category: string;
  text: string;
  source?: string;
  /** 구분 — 없으면 실제 기출. */
  kind?: "기출" | "셀테" | "모의고사" | "NS모의" | "예상";
  /** 회차/주차 라벨(명시적). 없으면 source 앞토큰. */
  round?: string;
  /** 기수(NS 주간 모의고사처럼 기수별로 문제가 갈리는 경우). */
  cohort?: string;
  image?: string;
  imageLabel?: string;
};

// source(회차) 또는 kind가 있는 문제(기출·셀테·모의고사·예상)를 모은다.
const EXAMS = (questions as Q[]).filter((q) => q.source || q.kind);
// 검색은 라벨 없는 연습문제까지 포함해 questions.json 전체에서 한다.
const ALL = questions as Q[];

function kindOf(q: Q): "기출" | "셀테" | "모의고사" | "NS모의" | "예상" {
  return q.kind || "기출";
}
// "139회 1교시" → 회차 "139회". round가 있으면 그대로.
function roundOf(q: Q): string {
  const r = q.round || (q.source || "").split(" ")[0] || "기타";
  // 기수가 다르면 같은 "1주차"라도 다른 시험이므로 라벨을 분리한다.
  return q.cohort ? `${q.cohort} ${r}` : r;
}

// 데이터에 실제 존재하는 구분만 탭으로. 기출 → 셀테 → 모의고사 → 예상 순.
const KIND_ORDER: Record<string, number> = {
  기출: 0,
  셀테: 1,
  모의고사: 2,
  NS모의: 3,
  예상: 4,
};
const KINDS = Array.from(new Set(EXAMS.map(kindOf))).sort(
  (a, b) => (KIND_ORDER[a] ?? 9) - (KIND_ORDER[b] ?? 9),
);
const KIND_DESC: Record<string, string> = {
  기출: "실제 정보관리기술사 기출문제입니다. 문제를 골라 바로 답안 '소설'을 연습해 보세요.",
  셀테: "주차별 실전 셀프테스트(셀테)입니다. 시험처럼 골라 답안을 연습해 보세요.",
  모의고사: "실전 명품 모의고사입니다. 교시별로 실제 시험처럼 풀어 보세요.",
  예상: "출제 흐름(AI·클라우드·보안·데이터)을 반영해 만든 예상문제입니다. 참고용으로 연습하세요.",
  NS모의: "ITPE NS·단합반 19기 주간 실전모의고사입니다. 주차별 실제 출제 문항과 해설집 기준 답안입니다.",
};

// 회차 정렬: 숫자(회/주차) 큰 순.
function roundNum(r: string): number {
  // "19기 1주차"는 기수가 아니라 주차로 정렬해야 하므로 주차·회 숫자를 먼저 본다.
  const w = r.match(/(\d+)\s*(?:주차|회)/);
  if (w) return parseInt(w[1]);
  const m = r.match(/\d+/);
  return m ? parseInt(m[0]) : 0;
}
const PERIODS = ["전체", "1교시", "2교시", "3교시", "4교시"] as const;


const KIND_LABEL: Record<string, string> = {
  기출: "📜 기출",
  셀테: "📝 셀테",
  모의고사: "🏆 모의고사",
  NS모의: "🛡️ NS 주간 모의고사",
  예상: "🔮 예상",
};

// 구분의 가장 최신(숫자 큰) 회차/주차. 기본으로 이것만 렌더 → '전체'로 수백 문제를
// 한 번에 그려 느려지던 문제 해소(원하면 회차에서 '전체' 선택 가능).
function newestRound(k: string): string {
  const rs = Array.from(
    new Set(EXAMS.filter((q) => kindOf(q) === k).map(roundOf)),
  ).sort((a, b) => roundNum(b) - roundNum(a));
  return rs[0] || "전체";
}

export default function ExamPage() {
  const [kind, setKind] = useState<string>(KINDS[0] || "기출");
  const [round, setRound] = useState<string>(() => newestRound(KINDS[0] || "기출"));
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("전체");
  // 검색어 — 입력하면 구분·회차·교시 필터를 무시하고 전체 문제에서 찾는다.
  const [query, setQuery] = useState("");
  const nq = query.trim().toLowerCase();

  // 선택 구분에 존재하는 회차/주차만.
  const rounds = useMemo(
    () =>
      Array.from(
        new Set(EXAMS.filter((q) => kindOf(q) === kind).map(roundOf)),
      ).sort((a, b) => roundNum(b) - roundNum(a)),
    [kind],
  );

  // 선택 구분에 실제 존재하는 교시만 노출(셀테는 3·4교시가 없음).
  const periods = useMemo(() => {
    const have = new Set(
      EXAMS.filter((q) => kindOf(q) === kind).map((q) => q.period),
    );
    return [
      "전체",
      ...(["1교시", "2교시", "3교시", "4교시"] as const).filter((p) =>
        have.has(p),
      ),
    ] as (typeof PERIODS)[number][];
  }, [kind]);

  const list = useMemo(() => {
    if (nq) {
      // 검색 모드 — 연습문제 포함 전체에서 지문·과목·출처로 찾는다. 최신 회차 먼저.
      return ALL.filter(
        (q) =>
          q.text.toLowerCase().includes(nq) ||
          q.category.toLowerCase().includes(nq) ||
          (q.source || "").toLowerCase().includes(nq) ||
          roundOf(q).toLowerCase().includes(nq),
      ).sort((a, b) => roundNum(roundOf(b)) - roundNum(roundOf(a)));
    }
    return EXAMS.filter(
      (q) =>
        kindOf(q) === kind &&
        (round === "전체" || roundOf(q) === round) &&
        (period === "전체" || q.period === period),
    );
  }, [kind, round, period, nq]);

  // 페이지네이션 — 처음엔 일부만 렌더(수백 문제를 한 번에 그리지 않게). 필터가 바뀌면 리셋.
  const PAGE = 20;
  const [visible, setVisible] = useState(PAGE);
  useEffect(() => setVisible(PAGE), [kind, round, period, nq]);
  const capped = useMemo(() => list.slice(0, visible), [list, visible]);

  // 교시별 그룹(현재 렌더 대상 capped 기준) — 검색 모드에선 구분 라벨까지 붙인다.
  const groups = useMemo(() => {
    const map = new Map<string, Q[]>();
    for (const q of capped) {
      // 검색 모드 라벨 — source/kind 없는 문제는 '연습'으로 표기(기출로 오인 방지)
      const kindLabel =
        q.source || q.kind ? KIND_LABEL[kindOf(q)] || kindOf(q) : "✏️ 연습";
      const key = `${nq ? `${kindLabel} ` : ""}${roundOf(q)} · ${q.period}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(q);
    }
    return Array.from(map.entries()).sort((a, b) => {
      const [ra, pa] = a[0].split(" · ");
      const [rb, pb] = b[0].split(" · ");
      return roundNum(rb) - roundNum(ra) || pa.localeCompare(pb);
    });
  }, [capped, nq]);

  return (
    <div>
      <PageHeader title="📜 문제 풀이" desc={KIND_DESC[kind]} />

      {/* 기출문제 검색 — 지문·과목·회차 어디로든. 입력 중엔 아래 필터를 무시하고 전체에서 찾는다. */}
      <div className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 기출문제 검색 — 지문·과목·회차 (예: 암호화, 데이터베이스, 139회)"
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        {nq && (
          <p className="mt-1.5 text-[11px] text-slate-400">
            기출·셀테·모의고사·예상·연습 전체({ALL.length}문제)에서 검색 중 — 아래 구분·회차·교시
            필터는 잠시 무시됩니다. 지우면 원래 목록으로 돌아가요.
          </p>
        )}
      </div>

      {KINDS.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setKind(k);
                setRound(newestRound(k));
                setPeriod("전체");
              }}
              className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:flex-none sm:px-5 ${
                kind === k
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
              }`}
            >
              {KIND_LABEL[k] || k}
            </button>
          ))}
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {kind === "셀테" || kind === "NS모의" ? "주차" : "회차"}
          </span>
          <select
            value={round}
            onChange={(e) => setRound(e.target.value)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
          >
            <option value="전체">전체</option>
            {rounds.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                period === p
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-slate-400">
          {nq ? "🔍 검색결과 " : ""}
          {Math.min(visible, list.length)}/{list.length}문제
        </span>
      </div>

      {groups.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          해당 조건의 문제가 없습니다.
        </p>
      )}

      <div className="space-y-6">
        {groups.map(([key, qs]) => (
          <section key={key}>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                {key}
              </span>
              <span className="text-xs font-normal text-slate-400">
                {qs.length}문제
              </span>
            </h3>
            <div className="space-y-2">
              {qs.map((q, i) => {
                // 수작업 모범답안 우선, 없으면 교재/토픽 자료 기반 자동 생성본.
                // 수작업 모범답안과 자동 조립본은 라벨을 구분해 보여준다.
                const hand = getModelAnswer(q.id);
                const gen = hand
                  ? undefined
                  : (genAnswers as Record<string, { source: string; answer: string }>)[
                      q.id
                    ];
                const ma = hand || gen;
                const tpl = matchSubnoteTitle(q.text);
                // 같은 문제가 기출·모의고사에 중복 출제되면 답안 페이지를 공유한다.
                const sharedFrom = canonicalAnswerId(q.id);
                const sharedLabel = sharedFrom
                  ? ALL.find((x) => x.id === sharedFrom)?.source
                  : undefined;
                return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">
                        {q.text}
                      </p>
                      <span className="mt-1 inline-block rounded bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">
                        {q.category}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 pl-9">
                    {hand && (
                      <span className="self-center rounded-md bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                        📘 모범답안 제공
                      </span>
                    )}
                    {sharedLabel && (
                      <span className="self-center rounded-md bg-sky-100 px-2 py-1 text-[10px] font-bold text-sky-700">
                        🔁 {sharedLabel}와 동일 — 답안 공유
                      </span>
                    )}
                    {gen && (
                      <span className="self-center rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                        🧩 조립 답안(자동)
                      </span>
                    )}
                    {tpl && (
                      <Link
                        href={`/explain?topic=${encodeURIComponent(tpl)}`}
                        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                      >
                        📝 답안지 템플릿 →
                      </Link>
                    )}
                    <CopyButton
                      text={q.text}
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    />
                  </div>

                  {/* 해설집 원본 개념도 — 답안지에 6줄 내로 옮겨 그린다 */}
                  {q.image && (
                    <details className="mt-2 pl-9">
                      <summary className="cursor-pointer text-xs font-semibold text-emerald-700 hover:underline">
                        📐 {q.imageLabel || "해설집 개념도"} 보기
                      </summary>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={q.image}
                        alt={`${q.text.slice(0, 20)} 개념도`}
                        className="mt-2 w-full max-w-2xl rounded-lg border border-slate-200 bg-white"
                      />
                    </details>
                  )}

                  {/* 관련 토픽 — 이 문제로 뭘 공부해야 하는지 바로 연결 */}
                  {(() => {
                    const rel = relatedTopics(q.text);
                    if (!rel.length) return null;
                    return (
                      <div className="mt-2 flex flex-wrap items-center gap-1 pl-9">
                        <span className="text-[10px] font-bold text-slate-400">
                          관련 토픽
                        </span>
                        {rel.map((t) => (
                          <Link
                            key={t}
                            href={`/explain?topic=${encodeURIComponent(t)}`}
                            className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
                          >
                            {t}
                          </Link>
                        ))}
                      </div>
                    );
                  })()}

                  {ma && (
                    <details className="mt-3 pl-9">
                      <summary
                        className={`cursor-pointer text-xs font-semibold hover:underline ${
                          hand ? "text-amber-700" : "text-slate-500"
                        }`}
                      >
                        {hand
                          ? "📘 클로드 모범답안 보기"
                          : "🧩 교재 조립 답안 보기 (자동 생성 · 참고용)"}
                      </summary>
                      <div
                        className={`mt-2 rounded-xl border p-4 ${
                          hand
                            ? "border-amber-200 bg-amber-50/40"
                            : "border-slate-200 bg-slate-50/60"
                        }`}
                      >
                        <div
                          className={`mb-2 rounded-md bg-white px-2.5 py-1 text-[10px] ring-1 ${
                            hand
                              ? "text-amber-700 ring-amber-200"
                              : "text-slate-500 ring-slate-200"
                          }`}
                        >
                          🧾 근거: {ma.source}
                        </div>
                        <article className="rounded-lg bg-white p-4">
                          <Markdown>{ma.answer}</Markdown>
                        </article>
                      </div>
                    </details>
                  )}
                </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {list.length > visible && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setVisible((v) => v + PAGE)}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            더 보기 (+{Math.min(PAGE, list.length - visible)}) · 남은 {list.length - visible}문제
          </button>
        </div>
      )}

      <p className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-400">
        기출문제는 계속 추가됩니다. 답안 작성 시 토픽을 연결하면 서브노트 내용을
        근거로 더 정확한 답안이 생성됩니다.
      </p>
    </div>
  );
}
