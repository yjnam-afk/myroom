"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import cards from "@/data/flashcards.json";
import SourceBadge from "@/components/SourceBadge";
import { loadReview, saveReview, markReviewed, getItem } from "@/lib/storage";
import { domainLabel, domainOrder } from "@/lib/domains";
import { planInfo, LEVEL_STYLE, LEVEL_HINT, levelOrder } from "@/lib/studyPlan";

type Card = {
  id: string;
  title: string;
  category: string;
  importance: string;
  definition: string;
  /** 답안 서론용 2줄(한 줄 17자 × 2줄) 압축 정의. */
  defShort?: string;
  /** 두음이 없는 토픽의 연상 문장(암기 팁). */
  memo?: string;
  /** 교재 구획별 두음(빌드 시 topicDetails에서 자동 추출). */
  sections: { label: string; mnemonic: string; keywords: string[] }[];
  mnemonic: string;
  keywords: string[];
  /** 학습계획에 매긴 레벨(암기·숙지·점검·참고) — 아래에서 붙인다. */
  level?: string;
  /** 왜 그 레벨인지 한 줄 메모 */
  levelNote?: string;
};

// 과목 이름을 정식 이름으로 맞추고, 학습계획의 레벨·코멘트를 실어 준다.
// 지하철에서 "오늘 급한 것만" 돌릴 수 있어야 하기 때문이다.
const ALL: Card[] = (cards as Card[]).map((c) => {
  const p = planInfo(c.title, c.id);
  return {
    ...c,
    category: domainLabel(c.category),
    level: p?.level,
    levelNote: p?.note,
  };
});
// 과목 순서는 심화반 커리큘럼 진행 순서 — 개수 순이 아니다.
const CATS = [
  "전체",
  ...Array.from(new Set(ALL.map((c) => c.category))).sort(
    (a, b) => domainOrder(a) - domainOrder(b) || a.localeCompare(b, "ko"),
  ),
];
const IMP: Record<string, number> = { 상: 0, 중: 1, 출제예상: 2, 하: 3 };
/** 레벨 필터 — "전체"는 레벨 무관, 나머지는 그 레벨만. */
const LEVELS = ["전체", "암기", "숙지", "점검", "참고"];

export default function CommutePage() {
  const [cat, setCat] = useState("전체");
  const [sangOnly, setSangOnly] = useState(false);
  const [lvl, setLvl] = useState("전체");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);

  const queue = useMemo(() => {
    const list = ALL.filter(
      (c) =>
        (cat === "전체" || c.category === cat) &&
        (!sangOnly || c.importance === "상") &&
        (lvl === "전체" || c.level === lvl),
    )
      .slice()
      // 레벨이 급한 카드부터 나온다(암기 → 숙지 → 점검 → 참고 → 레벨 없음).
      .sort(
        (a, b) =>
          levelOrder(a.level as never) - levelOrder(b.level as never) ||
          (IMP[a.importance] ?? 9) - (IMP[b.importance] ?? 9),
      );
    return list;
    // cat/sangOnly/lvl 바뀌면 새 큐
  }, [cat, sangOnly, lvl]);

  const card = queue[idx];

  function next(memorized: boolean) {
    if (card && memorized) {
      // 외웠으면 회독 +1 (랭킹·진도 반영)
      const state = loadReview();
      saveReview(markReviewed(state, card.id));
      setDone((d) => d + 1);
    }
    setFlipped(false);
    setIdx((i) => (i + 1) % Math.max(1, queue.length));
  }

  function reset(newCat: string, newSang: boolean, newLvl = lvl) {
    setCat(newCat);
    setSangOnly(newSang);
    setLvl(newLvl);
    setIdx(0);
    setFlipped(false);
  }

  const rounds = card ? getItem(loadReview(), card.id).rounds : 0;

  return (
    <div>
      <PageHeader
        title="🚇 지하철 모드 — 틈새 두음"
        desc="한 손으로 넘기는 두음 암기. AI 없이 즉시 동작하니 통신이 약해도 OK."
      />

      {/* 필터 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={cat}
          onChange={(e) => reset(e.target.value, sangOnly)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {CATS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {/* 학습 레벨 — 학습계획에 매겨 둔 "지금 얼마나 급한가". */}
        <select
          value={lvl}
          onChange={(e) => reset(cat, sangOnly, e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l === "전체" ? "학습 레벨 전체" : l}
            </option>
          ))}
        </select>
        <button
          onClick={() => reset(cat, !sangOnly)}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
            sangOnly
              ? "border-brand-500 bg-brand-50 text-brand-700"
              : "border-slate-300 bg-white text-slate-600"
          }`}
        >
          ⭐ 중요도 상만
        </button>
        <span className="ml-auto text-xs text-slate-400">
          {queue.length}장 · 외운 {done}장
        </span>
      </div>

      {!card ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          해당 조건의 카드가 없습니다.
        </p>
      ) : (
        <>
          {/* 카드 (탭하면 뒤집기 · 텍스트 드래그 선택 가능) */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              // 텍스트를 드래그 선택 중이면 뒤집지 않는다(복사 가능하게).
              if ((window.getSelection()?.toString() || "").trim().length > 0)
                return;
              setFlipped((f) => !f);
            }}
            className="block w-full cursor-pointer select-text rounded-3xl border border-slate-200 bg-white p-8 text-left shadow-sm transition active:scale-[0.99] min-h-[19rem]"
          >
            <div className="flex items-center gap-2">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                {card.importance}
              </span>
              {card.level && (
                <span
                  title={LEVEL_HINT[card.level]}
                  className={`rounded border px-1.5 py-0.5 text-[11px] font-bold ${
                    LEVEL_STYLE[card.level] || ""
                  }`}
                >
                  {card.level}
                </span>
              )}
              <span className="text-xs text-slate-400">{card.category}</span>
              <SourceBadge source={(card as { source?: string }).source} />
              {rounds > 0 && (
                <span className="text-xs text-amber-600">· {rounds}회독</span>
              )}
            </div>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-slate-900">
              {card.title}
            </h2>
            {/* 토픽 설명으로 — 카드를 넘기다 "이게 뭐였지" 싶을 때 바로 간다.
                카드 전체가 뒤집기 버튼이라 링크는 클릭 전파를 막는다. */}
            <Link
              href={`/explain?topic=${encodeURIComponent(card.title)}`}
              onClick={(e) => e.stopPropagation()}
              className="mt-1.5 inline-block rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
            >
              💡 토픽 설명 보기 →
            </Link>
            {card.levelNote ? (
              <p className="mt-1 text-sm font-medium text-brand-700">
                {card.levelNote}
              </p>
            ) : null}

            {!flipped ? (
              <p className="mt-8 text-center text-sm text-slate-400">
                👆 탭해서 정의·두음·키워드 확인
              </p>
            ) : (
              <div className="mt-5">
                {card.definition && (
                  <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                    <div className="text-xs font-semibold text-amber-700">
                      📖 정의
                    </div>
                    {/* 답안에 그대로 옮겨 적는 2줄 압축본을 먼저 — 원문은 아래 작게. */}
                    {card.defShort && (
                      <p className="mt-1 text-sm font-bold leading-relaxed text-amber-900">
                        ✍️ {card.defShort}
                        <span className="ml-1.5 align-middle text-[10px] font-medium text-amber-600">
                          {card.defShort.replace(/\s/g, "").length}자
                        </span>
                      </p>
                    )}
                    <p
                      className={
                        card.defShort
                          ? "mt-1.5 text-[12px] leading-relaxed text-slate-500"
                          : "mt-1 text-sm leading-relaxed text-slate-800"
                      }
                    >
                      {card.definition}
                    </p>
                  </div>
                )}
                {/* 교재 구획별 두음 — 두음신공 카드와 동일한 데이터 */}
                {(card.sections || []).map((s, si) => {
                  const letters = [...(s.mnemonic || "").replace(/\s/g, "")];
                  const aligned = letters.length === s.keywords.length;
                  return (
                    <div key={si} className={si > 0 ? "mt-4" : ""}>
                      <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-slate-50 p-4 text-center">
                        <div className="text-xs font-medium text-brand-500">
                          {s.label || (s.mnemonic ? "두음" : "핵심 키워드")}
                        </div>
                        {s.mnemonic ? (
                          <div className="mt-1 text-3xl font-extrabold tracking-wide text-brand-700">
                            {s.mnemonic}
                          </div>
                        ) : (
                          <div className="mt-1 text-sm font-semibold text-slate-500">
                            {s.keywords.length}개 키워드 — 순서대로 떠올리기
                          </div>
                        )}
                      </div>
                      {s.keywords.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {s.keywords.map((k, i) => (
                            <li key={i} className="flex items-center gap-3">
                              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-100 text-base font-extrabold text-brand-700">
                                {aligned ? letters[i] : i + 1}
                              </span>
                              <span className="text-sm text-slate-800">{k}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
                {card.memo && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-semibold text-slate-500">
                      💡 연상 팁
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      {card.memo}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 하단 큰 버튼 (한 손 조작) */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => next(false)}
              className="rounded-2xl border border-slate-300 bg-white py-4 text-base font-bold text-slate-600 active:bg-slate-50"
            >
              ↻ 다시
            </button>
            <button
              onClick={() => next(true)}
              className="rounded-2xl bg-amber-600 py-4 text-base font-bold text-white active:bg-amber-700"
            >
              ✓ 외웠어요
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">
            {idx + 1} / {queue.length} · &ldquo;외웠어요&rdquo;는 회독 +1로
            기록돼 랭킹에 반영돼요.
          </p>
        </>
      )}
    </div>
  );
}
