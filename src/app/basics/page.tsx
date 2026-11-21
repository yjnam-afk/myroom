"use client";

import { useMemo, useState } from "react";
import { courseOf, courseSubnotesInOrder } from "@/lib/courseOrder";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { DOMAINS, DOMAIN_LABEL } from "@/lib/domains";
import { planInfo, LEVEL_STYLE, LEVEL_HINT } from "@/lib/studyPlan";
import ClearButton from "@/components/ClearButton";
import { explainHref } from "@/lib/links";
import { TERMS, CATS, FLOOR } from "@/data/basicsTerms";

/**
 * 용어 사전 — 두 켜로 구성한다.
 *
 * ① 교재 정의(기본): 교재 서브노트의 정의문 '원문 그대로'. 1교시 답안 서론에
 *    그대로 쓰는 그 문장이다. 검색 → 정의 확인 → 설명/두음신공으로 이동.
 * ② 왕초보 용어: 정의문에 나오는 전문용어를 비유로 풀어 주는 보조 사전.
 */

// 과목 이름은 lib/domains 한 곳에서만 정한다(여기서 SE 를 "SW공학"이라
// 따로 적어 다른 페이지와 이름이 갈렸던 적이 있다).
// 과목 칩 순서는 심화반 커리큘럼 진행 순서 — CA·OS 가 맨 앞이다.
const COURSE_KEYS: readonly string[] = [
  "전체",
  ...DOMAINS.map((d) => d.code),
];

const BOOK_ORDER = DOMAINS.flatMap((d) => courseSubnotesInOrder(d.code));

export default function BasicsPage() {
  const [tab, setTab] = useState<"book" | "easy">("book");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("전체");
  const [course, setCourse] = useState<(typeof COURSE_KEYS)[number]>("전체");

  // ① 교재 정의 — 서브노트 정의문 원문. 검색은 제목·정의·키워드 전부에 건다.
  const bookList = useMemo(() => {
    const needle = q.trim().toLowerCase();
    // 과목·차례는 교재 CONTENTS 기준(lib/courseOrder)
    return BOOK_ORDER.filter(
      (s) =>
        (course === "전체" || courseOf(s) === course) &&
        (!needle ||
          s.title.toLowerCase().includes(needle) ||
          s.definition.toLowerCase().includes(needle) ||
          s.keywords.some((k) => k.toLowerCase().includes(needle))),
    );
  }, [q, course]);

  // ② 왕초보 용어 — 손으로 쓴 보조 사전.
  const easyList = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return TERMS.filter(
      (t) =>
        (cat === "전체" || t.cat === cat) &&
        (!needle ||
          t.ko.toLowerCase().includes(needle) ||
          (t.en || "").toLowerCase().includes(needle) ||
          t.def.toLowerCase().includes(needle)),
    );
  }, [q, cat]);

  return (
    <div>
      <PageHeader
        title="🧱 용어 사전"
        desc="기본은 교재 정의문 그대로 — 답안 서론에 쓰는 그 문장입니다. 낱말이 어려우면 왕초보 탭에서 찾으세요."
      />

      <div className="sticky top-14 z-[5] -mx-1 mb-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
        {/* 탭 — 교재 정의가 기본 */}
        <div className="mb-2 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {(
            [
              ["book", "📒 교재 정의", SUBNOTES.length],
              ["easy", "🐣 왕초보 용어", TERMS.length],
            ] as const
          ).map(([k, t, n]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                tab === k ? "bg-white text-brand-700 shadow-sm" : "text-slate-500"
              }`}
            >
              {t} <span className="text-xs font-normal text-slate-400">{n}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              tab === "book"
                ? "🔍 토픽·정의·키워드 검색 — 예: RAG, 교착상태, 몬테카를로"
                : "🔍 모르는 낱말 검색 — 예: 오버헤드, 임베딩, p값"
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-[15px] outline-none focus:border-brand-400"
            autoFocus
          />
          <ClearButton value={q} onClear={() => setQ("")} className="top-2.5" />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tab === "book"
            ? COURSE_KEYS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCourse(c)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    course === c
                      ? "bg-brand-600 text-white"
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {c === "전체" ? "전체" : DOMAIN_LABEL[c]}
                </button>
              ))
            : CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    cat === c
                      ? "bg-brand-600 text-white"
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {c}
                </button>
              ))}
          <span className="ml-auto self-center text-xs text-slate-400">
            {tab === "book" ? bookList.length : easyList.length}개
          </span>
        </div>
      </div>

      {tab === "book" ? (
        bookList.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            &lsquo;{q}&rsquo; 에 해당하는 교재 토픽이 없어요. 왕초보 탭도 확인해 보세요.
          </p>
        ) : (
          <div className="space-y-2.5">
            {bookList.map((s) => (
              <div
                key={`${courseOf(s)}-${s.title}`}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600 ring-1 ring-brand-200">
                    {DOMAIN_LABEL[courseOf(s)]}
                  </span>
                  <b className="text-[15px] text-slate-900">{s.title}</b>
                  {/* 학습계획에 매긴 레벨 — 사전에서도 급한 용어가 눈에 띄게. */}
                  {(() => {
                    const lv = planInfo(s.title, s.topicId)?.level;
                    return lv ? (
                      <span
                        title={LEVEL_HINT[lv]}
                        className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${
                          LEVEL_STYLE[lv] || ""
                        }`}
                      >
                        {lv}
                      </span>
                    ) : null;
                  })()}
                  <span className="ml-auto flex gap-1.5">
                    <Link
                      href={explainHref(s.title)}
                      className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                    >
                      💡 설명
                    </Link>
                  </span>
                </div>
                {/* 답안 2줄 정의(17자×2=34자) — 시험지에 쓰는 그 문장 */}
                {s.defShort && (
                  <p className="mt-1.5 rounded-lg bg-brand-50/70 px-2.5 py-1.5 text-[14px] font-semibold leading-relaxed text-slate-900 ring-1 ring-brand-100">
                    ✍️ {s.defShort}
                    <span className="ml-1.5 text-[10px] font-normal text-slate-400">
                      {s.defShort.replace(/\s/g, "").length}자
                    </span>
                  </p>
                )}
                {/* 교재 정의문 원문 */}
                <p className={`mt-1.5 leading-relaxed ${s.defShort ? "text-[12.5px] text-slate-500" : "text-[13.5px] text-slate-800"}`}>
                  {s.definition}
                </p>
                {s.keywords.length > 0 && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    {s.keywords.join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      ) : easyList.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          &lsquo;{q}&rsquo; 는 아직 사전에 없어요. 어떤 문장에서 만났는지 알려주시면 추가합니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
          {easyList.map((t) => (
            <div
              key={t.ko}
              className="rounded-xl border border-slate-200 bg-white p-3.5"
            >
              <div className="flex flex-wrap items-baseline gap-x-2">
                <b className="text-[15px] text-slate-900">{t.ko}</b>
                {t.en && <span className="text-xs text-slate-400">{t.en}</span>}
                <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                  {t.cat}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-slate-700">
                {t.def}
              </p>
              {t.see && (
                <Link
                  href={explainHref(t.see)}
                  className="mt-1.5 inline-block text-xs font-medium text-brand-600 hover:underline"
                >
                  📖 관련 토픽: {t.see} →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 바닥판 10줄 — 에세이 대신 압축본 */}
      <details className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer text-sm font-bold text-slate-800">
          🧭 바닥판 10줄 — 전체 그림이 궁금할 때만 펼치세요
        </summary>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[14px] leading-relaxed text-slate-700">
          {FLOOR.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
