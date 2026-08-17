"use client";

import { readJsonSafe } from "@/lib/safeJson";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SUBNOTES, subnoteByTitle, subnoteByTopicId } from "@/data/textbookSubnotes";
import MyDiagrams from "@/components/MyDiagrams";
import EasyCard from "@/components/EasyCard";
import { subnoteExtraFor } from "@/data/subnoteExtras";
import { PageHeader, Spinner, ErrorBox, Button } from "@/components/ui";
import Markdown from "@/components/Markdown";
import ConceptDiagram from "@/components/ConceptDiagram";
import ShareButton from "@/components/ShareButton";
import TopicAutocomplete from "@/components/TopicAutocomplete";
import topics from "@/data/topics.json";
import flashcards from "@/data/flashcards.json";

const CATS = Array.from(new Set(topics.map((t) => t.category)));
const IMP_ORDER: Record<string, number> = { 상: 0, 중: 1, 하: 2, 출제예상: 3 };

// ── 예전 토픽 자료 폴백 — 서브노트가 없을 때 AI 없이 보여줄 지하철 카드 데이터 ──
type LegacyCard = {
  title: string;
  category: string;
  definition: string;
  memo?: string;
  sections: { label: string; mnemonic: string; keywords: string[] }[];
};
const normT = (s: string) =>
  s.trim().toLowerCase().replace(/[\s()·,\-_/]/g, "");
const bareT = (s: string) => normT(s.replace(/[(（][^)）]*[)）]/g, ""));
const CARD_BY_NORM = new Map<string, LegacyCard>();
const CARD_BY_BARE = new Map<string, LegacyCard>();
for (const c of flashcards as LegacyCard[]) {
  CARD_BY_NORM.set(normT(c.title), c);
  const b = bareT(c.title);
  if (!CARD_BY_BARE.has(b)) CARD_BY_BARE.set(b, c);
}
function legacyCardFor(title: string): LegacyCard | undefined {
  const t = title.trim();
  if (!t) return undefined;
  return CARD_BY_NORM.get(normT(t)) || CARD_BY_BARE.get(bareT(t));
}

// ── 도메인별 토픽 목록 — 검색어가 생각 안 날 때 눈으로 훑어 찾는 용도 ──
const COURSE_LABEL: Record<string, string> = {
  OS: "운영체제",
  CA: "컴퓨터구조",
  PM: "프로젝트관리",
  SE: "SW공학",
  AI: "인공지능",
  ST: "확률·통계",
  DS: "자료구조",
  AL: "알고리즘",
  NW: "네트워크",
  DB: "데이터베이스",
  MG: "경영전략",
  SC: "보안",
  DX: "디지털서비스",
};
const COURSE_ORDER = [
  "SC", "AI", "DX", "NW", "DB", "OS", "CA", "SE", "PM", "MG", "AL", "DS", "ST",
];

type BrowseGroup = { key: string; label: string; badge: string; titles: string[] };

/** 교재 서브노트를 과목별로, 교재에 없는 예전 토픽은 카테고리별로 묶는다. */
const BROWSE_GROUPS: BrowseGroup[] = (() => {
  const byCourse = new Map<string, string[]>();
  const covered = new Set<string>();
  for (const s of SUBNOTES) {
    if (!byCourse.has(s.course)) byCourse.set(s.course, []);
    byCourse.get(s.course)!.push(s.title);
    covered.add(bareT(s.title));
  }
  const groups: BrowseGroup[] = [];
  for (const c of COURSE_ORDER) {
    const list = byCourse.get(c);
    if (!list?.length) continue;
    groups.push({
      key: `course:${c}`,
      label: COURSE_LABEL[c] || c,
      badge: "교재",
      titles: list.slice().sort((a, b) => a.localeCompare(b, "ko")),
    });
  }
  // 교재에 아직 없는 예전 토픽 — 카드 자료로 볼 수 있으므로 같이 노출한다.
  const byCat = new Map<string, string[]>();
  for (const t of topics) {
    if (covered.has(bareT(t.title))) continue;
    if (!byCat.has(t.category)) byCat.set(t.category, []);
    byCat.get(t.category)!.push(t.title);
  }
  for (const [cat, list] of Array.from(byCat).sort(
    (a, b) => b[1].length - a[1].length,
  )) {
    groups.push({
      key: `cat:${cat}`,
      label: cat,
      badge: "예전",
      titles: list.slice().sort((a, b) => a.localeCompare(b, "ko")),
    });
  }
  return groups;
})();

const BROWSE_TOTAL = BROWSE_GROUPS.reduce((n, g) => n + g.titles.length, 0);

function TopicBrowser({ onPick }: { onPick: (title: string) => void }) {
  const [open, setOpen] = useState<string | null>(BROWSE_GROUPS[0]?.key ?? null);
  const [filter, setFilter] = useState("");

  const q = filter.trim().toLowerCase();
  const groups = q
    ? BROWSE_GROUPS.map((g) => ({
        ...g,
        titles: g.titles.filter((t) => t.toLowerCase().includes(q)),
      })).filter((g) => g.titles.length > 0)
    : BROWSE_GROUPS;

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3">
        <h3 className="text-sm font-bold text-slate-700">
          📂 도메인별 토픽 목록{" "}
          <span className="font-normal text-slate-400">({BROWSE_TOTAL}개)</span>
        </h3>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="목록 안에서 걸러보기"
          className="w-44 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
        />
      </div>
      <div className="divide-y divide-slate-100">
        {groups.map((g) => {
          const isOpen = q ? true : open === g.key;
          return (
            <div key={g.key}>
              <button
                onClick={() => setOpen(isOpen && !q ? null : g.key)}
                className="flex w-full items-center justify-between gap-2 px-5 py-3 text-left hover:bg-slate-50"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      g.badge === "교재"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-300 text-slate-700"
                    }`}
                  >
                    {g.badge}
                  </span>
                  {g.label}
                  <span className="font-normal text-slate-400">
                    {g.titles.length}
                  </span>
                </span>
                <span className="text-xs text-slate-400">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>
              {isOpen && (
                <div className="flex flex-wrap gap-1.5 px-5 pb-4">
                  {g.titles.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        onPick(t);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {groups.length === 0 && (
          <p className="px-5 py-6 text-center text-xs text-slate-400">
            “{filter}”와 맞는 토픽이 목록에 없어요.
          </p>
        )}
      </div>
    </section>
  );
}

function ExplainInner() {
  const [topic, setTopic] = useState("");
  const [recCat, setRecCat] = useState(CATS[0]);
  const [result, setResult] = useState("");
  const [conceptTopicId, setConceptTopicId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoPending, setAutoPending] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(true);

  // 교재 슬라이드 원본 이미지 + 쉬운 설명 (AI 호출 없음)
  const extra = subnoteExtraFor(
    topics.find((x) => x.title === topic.trim())?.id,
    topic.trim(),
  );

  // 내 교재(심화반) 서브노트 원본 — 있으면 AI 없이 바로 보여준다.
  const textbook =
    subnoteByTitle(topic.trim()) ||
    subnoteByTopicId(topics.find((x) => x.title === topic.trim())?.id);
  // 교재에 없는 예전 토픽 — 지하철 카드 자료를 AI 없이 폴백으로 보여준다.
  const legacy = !textbook ? legacyCardFor(topic.trim()) : undefined;

  // 학습 코치 등에서 ?topic=&auto= 으로 들어오면 미리 채우고 auto=1이면 즉시 생성.
  // SPA 이동으로 쿼리만 바뀌어도 반응하도록 searchParams 의존.
  const searchParams = useSearchParams();
  useEffect(() => {
    const title = searchParams.get("topic") || "";
    if (title) {
      setTopic(title);
      setBrowseOpen(false);
      const t = topics.find((x) => x.title === title);
      if (t) setRecCat(t.category);
      if (searchParams.get("auto") === "1") setAutoPending(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (autoPending && topic.trim() && !loading) {
      setAutoPending(false);
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPending, topic]);

  async function generate() {
    if (!topic.trim()) {
      setError("토픽을 입력하거나 추천 토픽을 선택하세요.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    setConceptTopicId(undefined);
    try {
      const matched = topics.find((x) => x.title === topic.trim());
      setConceptTopicId(matched?.id);
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, topicId: matched?.id }),
      });
      const { ok, data } = await readJsonSafe(res);
      if (!ok) throw new Error((data.error as string) || "생성 실패");
      setResult(data.explanation as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="💡 토픽 설명"
        desc="여기는 이해 전용입니다 — 학습 카드(비유·실제 동작·실전 쓰임) + 교재 원본 + 슬라이드 + 내 도식. 암기는 🥷암기 훈련장에서."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <TopicAutocomplete
          value={topic}
          onChange={(v) => setTopic(v)}
          onSelect={(t) => {
            setTopic(t.title);
            setRecCat(t.category);
            setBrowseOpen(false);
          }}
          placeholder="문제풀이 검색 — 토픽명·키워드·정의 아무거나 입력 (예: 레인보우, 솔트)"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">토픽 선택:</span>
          <select
            value={recCat}
            onChange={(e) => setRecCat(e.target.value)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
          >
            {CATS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            key={recCat}
            defaultValue=""
            onChange={(e) => e.target.value && setTopic(e.target.value)}
            className="min-w-[12rem] rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
          >
            <option value="" disabled>
              토픽 선택… ({topics.filter((t) => t.category === recCat).length}개)
            </option>
            {topics
              .filter((t) => t.category === recCat)
              .slice()
              .sort(
                (a, b) =>
                  (IMP_ORDER[a.importance] ?? 9) - (IMP_ORDER[b.importance] ?? 9),
              )
              .map((t) => (
                <option key={t.id} value={t.title}>
                  [{t.importance}] {t.title}
                </option>
              ))}
          </select>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={generate} disabled={loading}>
            {loading ? "설명 중…" : "설명 보기"}
          </Button>
          {topic.trim() && (
            <Link
              href={`/mnemonic?topic=${encodeURIComponent(topic.trim())}${
                topics.find((x) => x.title === topic.trim())
                  ? `&topicId=${topics.find((x) => x.title === topic.trim())!.id}`
                  : ""
              }&auto=1`}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-slate-100"
            >
              🥷 이 토픽 암기 훈련 →
            </Link>
          )}
        </div>
      </div>

      {/* 도메인별 목록 — 아무것도 안 골랐으면 펼쳐서, 고른 뒤에는 접어서 보여준다. */}
      <div className="mt-6">
        {browseOpen ? (
          <TopicBrowser
            onPick={(t) => {
              setTopic(t);
              const m = topics.find((x) => x.title === t);
              if (m) setRecCat(m.category);
              setResult("");
              setError("");
              setBrowseOpen(false);
            }}
          />
        ) : (
          <button
            onClick={() => setBrowseOpen(true)}
            className="mb-6 w-full rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-500 hover:border-brand-400 hover:text-brand-700"
          >
            📂 도메인별 토픽 목록에서 다른 토픽 찾기 ({BROWSE_TOTAL}개)
          </button>
        )}
      </div>

      <div className="mt-6">
        {/* 쉽게 이해하기— 비유 → 용어 매핑 → 연관 토픽 → 답안. AI 호출 없음. */}
        <EasyCard
          topicId={topics.find((x) => x.title === topic.trim())?.id}
          title={topic.trim()}
        />

        {/* 교재 원본 서브노트 → 답안지 템플릿 — 시험지에 옮겨 적는 순서 그대로 보여준다.
            교재 원문(정의·키워드·표 원본)은 바로 아래 슬라이드 이미지에 있으므로 중복 표기하지 않는다. */}
        {textbook && (
          <section className="mb-6 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 bg-emerald-50 px-5 py-3">
              <h3 className="text-sm font-bold text-emerald-800">
                📝 답안지 템플릿 — {textbook.title}
              </h3>
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                심화반 {textbook.course}
              </span>
            </div>

            {/* 답안지 종이 — 왼쪽 여백선이 있는 시험지 모양. 이 순서 그대로 옮겨 적는다. */}
            <div className="relative p-5 pl-10">
              <div
                className="pointer-events-none absolute inset-y-4 left-6 w-px bg-rose-200"
                aria-hidden
              />

              <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                문) {textbook.title}에 대하여 설명하시오.
              </p>
              <p className="mt-1 text-[13px] font-bold text-slate-400">답)</p>

              {/* 1. 서론 — 소제목은 "리드문의 정의", 바로 아래 34자 정의 → 특징) 3가지 */}
              <div className="mt-2">
                <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                  1. {textbook.lead ? `${textbook.lead}의 정의` : `${textbook.title}의 정의`}
                </p>
                <div className="mt-1 space-y-1.5 pl-4">
                  {textbook.defPair?.length ? (
                    // 비교 토픽 — 개념별 정의(각 34~35자)와 특징을 가/나로 나눠 적는다.
                    textbook.defPair.map((p, i) => (
                      <div key={p.name}>
                        <p className="text-[13px] leading-relaxed text-slate-800">
                          <span className="mr-1 font-bold text-slate-500">
                            {["가", "나", "다", "라"][i]}. {p.name}:
                          </span>
                          {p.def}
                        </p>
                        {!!p.features?.length && (
                          <p className="pl-4 text-[13px] leading-relaxed text-slate-700">
                            <span className="mr-1 font-bold text-slate-500">특징)</span>
                            {p.features.join(", ")}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <>
                      {textbook.defShort && (
                        <p className="text-[13px] leading-relaxed text-slate-800">
                          {textbook.defShort}
                        </p>
                      )}
                      {!!textbook.features?.length && (
                        <p className="text-[13px] leading-relaxed text-slate-800">
                          <span className="mr-1 font-bold text-slate-500">특징)</span>
                          {textbook.features.join(", ")}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* 슬라이드 이미지가 없는 토픽만 교재 원문 정의를 여기서 보여준다(유실 방지) */}
              {!extra?.image && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-bold text-slate-500">■ 교재 원문 정의</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
                    {textbook.definition}
                  </p>
                </div>
              )}

              {/* 2. 본론 — 개념도와 구성요소. 도식 캡처(images)가 있으면 개념도 자리에 바로 띄우고,
                  없으면 아래 교재 슬라이드를 참조하도록 안내. 교재 표들은 가/나/다 소항목. */}
              <div className="mt-4">
                <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                  2. {textbook.title.replace(/\s*\([^)]*\)/g, "")}의 개념도 및 구성요소
                </p>
                {(extra?.image || extra?.images?.length) && (
                  <p className="mt-1 pl-4 text-[13px] leading-relaxed text-slate-600">
                    <span className="mr-1 font-bold text-slate-500">가. 개념도</span>
                    {extra?.images?.length
                      ? "이 도식을 답안지 6줄 내로 옮겨 그린다"
                      : "아래 교재 슬라이드의 개념도를 답안지 6줄 내 도식으로 옮겨 그린다"}
                  </p>
                )}
                {!!extra?.images?.length && (
                  <div className="mt-2 space-y-2 pl-4">
                    {extra.images.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt={`${topic.trim()} 개념도`}
                        className="w-full max-w-xl rounded-lg border border-slate-200 bg-white"
                      />
                    ))}
                  </div>
                )}
              </div>
              {textbook.tables.map((tb, ti) => (
                <div key={tb.caption} className="mt-3 pl-4">
                  <p className="text-[13px] font-bold leading-relaxed text-slate-700">
                    {["가", "나", "다", "라", "마", "바", "사"][
                      ti + (extra?.image || extra?.images?.length ? 1 : 0)
                    ]}
                    . {tb.caption}
                  </p>
                  <div className="mt-1.5 overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr>
                          {tb.headers.map((h) => (
                            <th
                              key={h}
                              className="border border-slate-300 bg-slate-100 px-2 py-1.5 text-left font-bold text-slate-700"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tb.rows.map((r, ri) => (
                          <tr key={ri}>
                            {r.map((c, ci) => (
                              <td
                                key={ci}
                                className={`border border-slate-300 px-2 py-1.5 align-top leading-relaxed ${
                                  ci === 0
                                    ? "whitespace-nowrap font-semibold text-slate-800"
                                    : "text-slate-600"
                                }`}
                              >
                                {c}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* 3. 플러스 알파 — 비고·출제 이력·두음 등 추가 어필 거리 */}
              {textbook.notes?.length ? (
                <div className="mt-4">
                  <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                    3. 플러스 알파 — 추가 어필
                  </p>
                  <ul className="mt-1 space-y-1 pl-4">
                    {textbook.notes.map((n, i) => (
                      <li key={i} className="text-[13px] leading-relaxed text-slate-600">
                        · {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <p className="mt-5 text-right text-[13px] font-bold text-slate-400">
                ·································· &ldquo;끝&rdquo;
              </p>
            </div>

            {/* 채점 근거 — 답안에 키워드가 들어갔는지 마지막에 확인 */}
            {textbook.keywords.length > 0 && (
              <div className="border-t border-emerald-100 px-5 py-3">
                <div className="text-xs font-bold text-slate-500">
                  ✅ 키워드 체크 — 내 답안에 이 단어들이 들어갔는지 확인
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {textbook.keywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="border-t border-emerald-100 bg-emerald-50/50 px-5 py-2 text-[11px] text-emerald-700">
              교재 원문(정의·키워드·표)은 아래 슬라이드 원본에서 그대로 볼 수 있어요. 여기는 답안지에
              옮겨 적는 순서대로 재구성한 템플릿입니다.
            </p>
          </section>
        )}


        {/* 예전 토픽 자료 폴백 — 교재 서브노트가 없어도 AI 없이 정리 자료를 보여준다 */}
        {legacy && (
          <section className="mb-6 overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 bg-indigo-50 px-5 py-3">
              <h3 className="text-sm font-bold text-indigo-800">
                📗 토픽 자료 — {legacy.title}
              </h3>
              <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                {legacy.category}
              </span>
            </div>
            <div className="space-y-4 p-5">
              {legacy.definition && (
                <div>
                  <div className="text-xs font-bold text-slate-500">■ 정의</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-800">
                    {legacy.definition}
                  </p>
                </div>
              )}
              {legacy.sections.map((s) => (
                <div key={s.label}>
                  <div className="text-xs font-bold text-slate-500">
                    ■ {s.label}
                    {s.mnemonic && (
                      <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                        {s.mnemonic}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.keywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {legacy.memo && (
                <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                  💡 {legacy.memo}
                </p>
              )}
            </div>
            <p className="border-t border-indigo-100 bg-indigo-50/50 px-5 py-2 text-[11px] text-indigo-700">
              교재 서브노트가 아직 없는 토픽이라 예전 정리 자료를 보여드려요. AI 없이 항상
              열립니다.
            </p>
          </section>
        )}

        {/* 교재 슬라이드 원본 — 도식을 다시 그리지 않고 교재 그림 그대로 */}
        {extra?.image && (
          <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-2">
              <span className="text-xs font-bold text-slate-600">
                📊 교재 슬라이드 원본 (도식 포함)
              </span>
              <a
                href={extra.image}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-brand-600 hover:underline"
              >
                크게 보기 ↗
              </a>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={extra.image}
              alt={`${topic.trim()} 교재 슬라이드`}
              className="w-full bg-white"
            />
          </section>
        )}

        {/* 내 도식 — 교재 도식을 사진/캡처로 직접 넣어 둔다(AI가 그린 그림 대신 원본) */}
        {topic.trim() && (
          <MyDiagrams
            topicId={topics.find((x) => x.title === topic.trim())?.id}
            title={topic.trim()}
          />
        )}

        {loading && <Spinner label="이해하기 쉽게 정리하고 있습니다…" />}
        {error &&
          (textbook ? (
            // 교재 원본·쉬운 설명·슬라이드가 이미 위에 다 떠 있다.
            // AI는 "덤"이므로 실패를 오류처럼 보여주지 않는다.
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              AI 추가 해설은 지금 한도가 차서 못 만들었어요. 위 내용만으로 충분합니다.
            </p>
          ) : (
            <ErrorBox message={error} />
          ))}
        {result && (
          <>
            {/* 공유 — 두음신공 페이지와 동일하게 결과 상단(카드 밖) */}
            <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
              <ShareButton
                title={`[나의 공간] ${topic.trim()} 설명`}
                text={`💡 ${topic.trim()} — 이해하기 쉬운 설명`}
                url={`https://study-teal-eight.vercel.app/explain?topic=${encodeURIComponent(topic.trim())}&auto=1`}
              />
            </div>
            {/* 개념도 — 교재 슬라이드 원본이 있으면(위에 이미 떠 있음) 중복이므로 생략.
                교재 슬라이드가 없는 토픽만 기존 개념도 이미지를 쓴다. */}
            {!extra?.image && <ConceptDiagram topicId={conceptTopicId} />}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <Markdown>{result}</Markdown>
            </article>
          </>
        )}
      </div>
    </div>
  );
}

// useSearchParams는 Suspense 경계가 필요하다(Next App Router).
export default function ExplainPage() {
  return (
    <Suspense fallback={null}>
      <ExplainInner />
    </Suspense>
  );
}
