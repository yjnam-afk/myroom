"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SUBNOTES,
  subnoteByTitle,
  subnoteByTopicId,
  subnoteByAlias,
} from "@/data/textbookSubnotes";
import MyDiagrams from "@/components/MyDiagrams";
import EasyCard from "@/components/EasyCard";
import Mermaid from "@/components/Mermaid";
import { subnoteExtraFor } from "@/data/subnoteExtras";
import { PageHeader } from "@/components/ui";
import TopicAutocomplete from "@/components/TopicAutocomplete";
import topics from "@/data/topics.json";
import flashcards from "@/data/flashcards.json";
import answerExtras from "@/data/answerExtras.json";
import { TOPIC_INTROS } from "@/data/topicIntros";

const CATS = Array.from(new Set(topics.map((t) => t.category)));
const IMP_ORDER: Record<string, number> = { 상: 0, 중: 1, 하: 2, 출제예상: 3 };

// ── 예전 토픽 자료 폴백 — 서브노트가 없을 때 AI 없이 보여줄 지하철 카드 데이터 ──
type LegacyCard = {
  id: string;
  title: string;
  category: string;
  definition: string;
  memo?: string;
  sections: { label: string; mnemonic: string; keywords: string[] }[];
  /** 답안지 템플릿용(예전 토픽) — 특징 3개·검증된 개념도·활용/플러스 키워드 */
  features?: string[];
  conceptMap?: string;
  /** 답안지 본론 3단표 — 구분·키워드·설명 */
  comp?: {
    group: string;
    mnemonic: string;
    rows: string[][];
    notes: string[];
  }[];
  /** 도식 이름 — 클래스다이어그램·절차 등. 없으면 "개념도" */
  conceptMapLabel?: string;
  defKeywords?: string[];
  apply?: string[];
  plus?: string[];
};

/** 받침 유무로 을/를 고르기 — "개념도를", "클래스다이어그램을" */
function objJosa(word: string): string {
  const ch = (word || "").trim().slice(-1);
  const code = ch.charCodeAt(0);
  if (Number.isNaN(code) || code < 0xac00 || code > 0xd7a3) return "를";
  return (code - 0xac00) % 28 === 0 ? "를" : "을";
}

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
const EXTRA_BY_ID = answerExtras as unknown as Record<string, Partial<LegacyCard>>;
function legacyCardFor(title: string): LegacyCard | undefined {
  const t = title.trim();
  if (!t) return undefined;
  const card = CARD_BY_NORM.get(normT(t)) || CARD_BY_BARE.get(bareT(t));
  if (!card) return undefined;
  // 답안지 템플릿 자료는 별도 파일(answerExtras)에 있다 — 여기서 합쳐 넘긴다.
  const extra = EXTRA_BY_ID[card.id];
  return extra ? { ...card, ...extra } : card;
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

type BrowseItem = { title: string; imp?: string };
type BrowseGroup = { key: string; label: string; badge: string; items: BrowseItem[] };

/** 교재 서브노트를 과목별로, 교재에 없는 예전 토픽은 카테고리별로 묶는다. */
const BROWSE_GROUPS: BrowseGroup[] = (() => {
  // 교재 토픽 중요도 — 예전 토픽(topics.json)과 매칭되면 그 상·중·하를 쓰고,
  // 심화반 교재에만 있는 토픽은 회독 관리와 같은 기준으로 '상'을 기본값으로 둔다.
  const impById = new Map<string, string>();
  const impByBare = new Map<string, string>();
  for (const t of topics) {
    impById.set(t.id, t.importance);
    const b = bareT(t.title);
    if (!impByBare.has(b)) impByBare.set(b, t.importance);
  }
  const byCourse = new Map<string, BrowseItem[]>();
  const covered = new Set<string>();
  for (const s of SUBNOTES) {
    if (!byCourse.has(s.course)) byCourse.set(s.course, []);
    const imp =
      (s.topicId && impById.get(s.topicId)) ||
      impByBare.get(bareT(s.title)) ||
      "상";
    byCourse.get(s.course)!.push({ title: s.title, imp });
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
      items: list
        .slice()
        .sort(
          (a, b) =>
            (IMP_ORDER[a.imp || ""] ?? 9) - (IMP_ORDER[b.imp || ""] ?? 9) ||
            a.title.localeCompare(b.title, "ko"),
        ),
    });
  }
  // 교재에 아직 없는 예전 토픽 — 카드 자료로 볼 수 있으므로 같이 노출한다.
  // 원래 붙어 있던 중요도(상·중·하·출제예상)를 유지하고 상부터 정렬한다.
  const byCat = new Map<string, BrowseItem[]>();
  for (const t of topics) {
    // 교재에 같은 토픽이 있으면(제목 표기가 달라도) 예전 항목은 감춘다.
    if (covered.has(bareT(t.title)) || subnoteByAlias(t.id, t.title)) continue;
    if (!byCat.has(t.category)) byCat.set(t.category, []);
    byCat.get(t.category)!.push({ title: t.title, imp: t.importance });
  }
  for (const [cat, list] of Array.from(byCat).sort(
    (a, b) => b[1].length - a[1].length,
  )) {
    groups.push({
      key: `cat:${cat}`,
      label: cat,
      badge: "예전",
      items: list
        .slice()
        .sort(
          (a, b) =>
            (IMP_ORDER[a.imp || ""] ?? 9) - (IMP_ORDER[b.imp || ""] ?? 9) ||
            a.title.localeCompare(b.title, "ko"),
        ),
    });
  }
  return groups;
})();

const BROWSE_TOTAL = BROWSE_GROUPS.reduce((n, g) => n + g.items.length, 0);

const IMP_CHIP: Record<string, string> = {
  상: "text-red-600",
  중: "text-amber-600",
  하: "text-slate-400",
  출제예상: "text-brand-600",
};

function TopicBrowser({ onPick }: { onPick: (title: string) => void }) {
  // 기본은 아무 도메인도 안 펼친다 — 칩 한 줄만 보이는 상태가 시작점.
  const [sel, setSel] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const q = filter.trim().toLowerCase();
  // 걸러보기 입력 중에는 도메인 무관하게 맞는 토픽만 모아 한 판에 보여준다.
  const matched = q
    ? BROWSE_GROUPS.flatMap((g) =>
        g.items
          .filter((it) => it.title.toLowerCase().includes(q))
          .map((it) => ({ ...it, group: g.label })),
      )
    : [];
  const selGroup = BROWSE_GROUPS.find((g) => g.key === sel);

  const pick = (t: string) => {
    onPick(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {q ? (
        // 걸러보기 결과 — 도메인 구분 없이 한 판, 최대 높이 안에서 스크롤.
        <div className="max-h-72 overflow-y-auto p-4">
          {matched.length ? (
            <div className="flex flex-wrap gap-1.5">
              {matched.map((m) => (
                <button
                  key={m.group + m.title}
                  onClick={() => pick(m.title)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
                  title={m.group}
                >
                  {m.imp && (
                    <span className={`mr-1 text-[10px] font-bold ${IMP_CHIP[m.imp] || "text-slate-400"}`}>
                      {m.imp}
                    </span>
                  )}
                  {m.title}
                  <span className="ml-1 text-[10px] text-slate-400">
                    {m.group}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="py-2 text-center text-xs text-slate-400">
              “{filter}”와 맞는 토픽이 목록에 없어요.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* 도메인 칩 — 여기서 하나를 고르면 그 도메인만 아래에 펼쳐진다. */}
          <div className="flex flex-wrap gap-1.5 p-4">
            {BROWSE_GROUPS.map((g) => {
              const active = sel === g.key;
              return (
                <button
                  key={g.key}
                  onClick={() => setSel(active ? null : g.key)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : g.badge === "교재"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-500"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                  }`}
                >
                  {g.label}
                  <span
                    className={`font-normal ${active ? "text-brand-100" : "text-slate-400"}`}
                  >
                    {g.items.length}
                  </span>
                </button>
              );
            })}
          </div>

          {selGroup && (
            <div className="border-t border-slate-100">
              <div className="max-h-72 overflow-y-auto p-4">
                <div className="flex flex-wrap gap-1.5">
                  {selGroup.items.map((it) => (
                    <button
                      key={it.title}
                      onClick={() => pick(it.title)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
                    >
                      {it.imp && (
                        <span className={`mr-1 text-[10px] font-bold ${IMP_CHIP[it.imp] || "text-slate-400"}`}>
                          {it.imp}
                        </span>
                      )}
                      {it.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ExplainInner() {
  const [topic, setTopic] = useState("");
  const [recCat, setRecCat] = useState(CATS[0]);
  const [browseOpen, setBrowseOpen] = useState(true);

  // 교재 슬라이드 원본 이미지 + 쉬운 설명 (AI 호출 없음)
  const extra = subnoteExtraFor(
    topics.find((x) => x.title === topic.trim())?.id,
    topic.trim(),
  );

  // 답안지 2번 항목의 그림 이름 — 그림이 흐름·단계를 보여 주면 "절차"처럼 바꿔 쓴다.
  const diagramLabel = extra?.imagesLabel || "개념도";

  // 내 교재(심화반) 서브노트 원본 — 있으면 AI 없이 바로 보여준다.
  const textbook =
    subnoteByTitle(topic.trim()) ||
    subnoteByTopicId(topics.find((x) => x.title === topic.trim())?.id) ||
    // 제목 표기만 다른 같은 토픽("Singleton 패턴" ↔ "싱글턴 패턴 (Singleton pattern)")
    subnoteByAlias(topics.find((x) => x.title === topic.trim())?.id, topic.trim());
  // 교재에 없는 예전 토픽 — 지하철 카드 자료를 AI 없이 폴백으로 보여준다.
  const legacy = !textbook ? legacyCardFor(topic.trim()) : undefined;
  // 예전 토픽의 답안 서론 세트 — 교재와 같은 규격(리드문·34~35자 정의·특징 3개)
  const intro = legacy
    ? TOPIC_INTROS[topics.find((x) => x.title === topic.trim())?.id || ""]
    : undefined;

  // 학습 코치 등에서 ?topic= 으로 들어오면 미리 채운다(예전 auto=1은 무시 —
  // 이 페이지는 AI를 부르지 않고 교재·정리 자료만 즉시 보여준다).
  // SPA 이동으로 쿼리만 바뀌어도 반응하도록 searchParams 의존.
  const router = useRouter();
  const searchParams = useSearchParams();
  /**
   * 토픽을 확정했을 때 — 화면과 주소(?topic=)를 함께 바꾼다.
   * 주소가 그대로면 새로고침·공유·뒤로가기가 엉뚱한 토픽을 가리킨다.
   */
  const goTopic = (title: string) => {
    const t = title.trim();
    setTopic(t);
    const m = topics.find((x) => x.title === t);
    if (m) setRecCat(m.category);
    setBrowseOpen(false);
    if (t) router.push(`/explain?topic=${encodeURIComponent(t)}`, { scroll: false });
  };
  useEffect(() => {
    const title = searchParams.get("topic") || "";
    if (title) {
      setTopic(title);
      setBrowseOpen(false);
      const t = topics.find((x) => x.title === title);
      if (t) setRecCat(t.category);
    }
  }, [searchParams]);

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
          onSelect={(t) => goTopic(t.title)}
          // 교재 전용 토픽(topics.json 에 없음)도 주소가 따라오게 한다
          onPickTitle={(title) => goTopic(title)}
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
            onChange={(e) => e.target.value && goTopic(e.target.value)}
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
            onPick={goTopic}
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
                  2. {textbook.title.replace(/\s*\([^)]*\)/g, "")}의 {diagramLabel} 및
                  구성요소
                </p>
                {(extra?.image || extra?.images?.length) && (
                  <p className="mt-1 pl-4 text-[13px] leading-relaxed text-slate-600">
                    <span className="mr-1 font-bold text-slate-500">
                      가. {extra?.images?.length ? diagramLabel : "개념도"}
                    </span>
                    {extra?.images?.length
                      ? `이 ${diagramLabel}${objJosa(diagramLabel)} 답안지 6줄 내로 옮겨 그린다`
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
                        alt={`${topic.trim()} ${diagramLabel}`}
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


        {/* 예전 토픽 답안지 템플릿 — 교재 서브노트가 없어도 같은 시험지 형식으로 보여준다.
            정의는 커널 카드의 답안 한 줄(guide.exam)을 최우선, 개념도는 검증된 conceptMap 렌더. */}
        {legacy && (
          <section className="mb-6 overflow-hidden rounded-2xl border-2 border-indigo-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 bg-indigo-50 px-5 py-3">
              <h3 className="text-sm font-bold text-indigo-800">
                📝 답안지 템플릿 — {legacy.title}
              </h3>
              <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                {legacy.category}
              </span>
            </div>

            {/* 답안지 종이 — 교재 템플릿과 같은 시험지 모양. 이 순서 그대로 옮겨 적는다. */}
            <div className="relative p-5 pl-10">
              <div
                className="pointer-events-none absolute inset-y-4 left-6 w-px bg-rose-200"
                aria-hidden
              />

              <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                문) {legacy.title}에 대하여 설명하시오.
              </p>
              <p className="mt-1 text-[13px] font-bold text-slate-400">답)</p>

              {/* 1. 서론 — 교재와 같은 규격: 리드문의 정의 → 34~35자(공백 제외) 압축
                  정의 → 특징) 3가지. 서론 세트가 없는 토픽만 커널 카드 한 줄로 폴백. */}
              <div className="mt-2">
                <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                  1. {intro?.lead ? `${intro.lead}의 정의` : `${legacy.title}의 정의`}
                </p>
                <div className="mt-1 space-y-1.5 pl-4">
                  <p className="text-[13px] leading-relaxed text-slate-800">
                    {intro?.defShort || extra?.guide?.exam || legacy.definition}
                  </p>
                  {!!(intro?.features?.length || legacy.features?.length) && (
                    <p className="text-[13px] leading-relaxed text-slate-800">
                      <span className="mr-1 font-bold text-slate-500">특징)</span>
                      {(intro?.features?.length
                        ? intro.features
                        : legacy.features || []
                      ).join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* 2. 본론 — 검증된 개념도(conceptMap) + 구획별 키워드를 가/나/다로.
                  구획·개념도가 없는 얇은 토픽은 커널 카드(guide)의 핵심 동작·용어 매핑으로
                  채우고, 그마저 없으면 2번 자체를 건너뛰어 빈 소제목을 만들지 않는다. */}
              {(() => {
                const g = extra?.guide;
                const hasList = !!legacy.comp?.length || legacy.sections.length > 0;
                const useGuideBody = !hasList && !!(g?.mechanism || g?.map?.length);
                const hasBody = !!legacy.conceptMap || hasList || useGuideBody;
                if (!hasBody) return null;
                let li = 0;
                const letter = () => ["가", "나", "다", "라", "마", "바", "사"][li++];
                return (
                  <div className="mt-4">
                    <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                      2. {legacy.title.replace(/\s*\([^)]*\)/g, "")}의{" "}
                      {legacy.conceptMapLabel || "개념도"} 및 구성요소
                    </p>
                    {legacy.conceptMap && (
                      <div className="mt-1 pl-4">
                        <p className="text-[13px] leading-relaxed text-slate-600">
                          <span className="mr-1 font-bold text-slate-500">
                            {letter()}. {legacy.conceptMapLabel || "개념도"}
                          </span>
                          이 {legacy.conceptMapLabel || "개념도"}
                          {objJosa(legacy.conceptMapLabel || "개념도")} 답안지 6줄 내로
                          옮겨 그린다
                        </p>
                        <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2">
                          <Mermaid chart={legacy.conceptMap} />
                        </div>
                      </div>
                    )}
                    {/* 구성요소·유형·절차… — 블록마다 별도 소항목(가/나/다)에 각자 3단표.
                        구분 열은 두음 글자가 항목 수와 맞으면 그 글자, 아니면 번호를 쓴다. */}
                    {legacy.comp?.map((c) => {
                      const mnem = (c.mnemonic || "").replace(/\s/g, "");
                      const letters = [...mnem];
                      const aligned = letters.length === c.rows.length;
                      const hasDesc = c.rows.some((r) => r[1]);
                      return (
                        <div key={c.group} className="mt-3 pl-4">
                          <p className="text-[13px] font-bold leading-relaxed text-slate-700">
                            {letter()}. {c.group}
                            {mnem && (
                              <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                                두음 {mnem}
                              </span>
                            )}
                          </p>
                          {/* 설명이 있는 블록만 표로 — 나열뿐인 블록은 표에 빈 칸이 생기므로 한 줄로 */}
                          {hasDesc ? (
                            <div className="mt-1.5 overflow-x-auto">
                              <table className="w-full border-collapse text-xs">
                                <thead>
                                  <tr>
                                    {["구분", "키워드", "설명"].map((h) => (
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
                                  {c.rows.map((r, ri) => (
                                    <tr key={ri}>
                                      <td className="w-10 whitespace-nowrap border border-slate-300 bg-slate-50 px-2 py-1.5 text-center align-top font-bold text-slate-600">
                                        {aligned ? letters[ri] : ri + 1}
                                      </td>
                                      <td className="whitespace-nowrap border border-slate-300 px-2 py-1.5 align-top font-semibold text-slate-800">
                                        {r[0]}
                                      </td>
                                      <td className="border border-slate-300 px-2 py-1.5 align-top leading-relaxed text-slate-600">
                                        {r[1]}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            !!c.rows.length && (
                              <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
                                {c.rows.map((r) => r[0]).join(", ")}
                              </p>
                            )
                          )}
                          {c.notes?.map((n, ni) => (
                            <p
                              key={ni}
                              className="mt-1 text-[13px] leading-relaxed text-slate-600"
                            >
                              {n}
                            </p>
                          ))}
                        </div>
                      );
                    })}
                    {/* 3단표가 없는 토픽만 예전 키워드 칩으로 대체 */}
                    {!legacy.comp?.length &&
                      legacy.sections.map((s) => (
                        <div key={s.label} className="mt-3 pl-4">
                          <p className="text-[13px] font-bold leading-relaxed text-slate-700">
                            {letter()}. {s.label}
                            {s.mnemonic && (
                              <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                                두음 {s.mnemonic}
                              </span>
                            )}
                          </p>
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
                    {useGuideBody && g?.mechanism && (
                      <div className="mt-3 pl-4">
                        <p className="text-[13px] font-bold leading-relaxed text-slate-700">
                          {letter()}. 핵심 동작·내용
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
                          {g.mechanism}
                        </p>
                      </div>
                    )}
                    {useGuideBody && !!g?.map?.length && (
                      <div className="mt-3 pl-4">
                        <p className="text-[13px] font-bold leading-relaxed text-slate-700">
                          {letter()}. 핵심 구성요소
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {g.map.map((m) => (
                            <span
                              key={m.real + m.as}
                              className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100"
                              title={m.as}
                            >
                              {m.real}
                              {m.note ? ` (${m.note})` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 플러스 알파 — 활용·플러스 키워드와 메모로 추가 어필(앞 항목 유무에 따라 번호 조정) */}
              {(legacy.apply?.length || legacy.plus?.length || legacy.memo) ? (
                <div className="mt-4">
                  <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                    {!!legacy.conceptMap ||
                    !!legacy.comp?.length ||
                    legacy.sections.length > 0 ||
                    !!(extra?.guide?.mechanism || extra?.guide?.map?.length)
                      ? "3"
                      : "2"}
                    . 플러스 알파 — 추가 어필
                  </p>
                  <ul className="mt-1 space-y-1 pl-4">
                    {!!legacy.apply?.length && (
                      <li className="text-[13px] leading-relaxed text-slate-600">
                        · 활용: {legacy.apply.join(", ")}
                      </li>
                    )}
                    {!!legacy.plus?.length && (
                      <li className="text-[13px] leading-relaxed text-slate-600">
                        · 플러스: {legacy.plus.join(", ")}
                      </li>
                    )}
                    {legacy.memo && (
                      <li className="text-[13px] leading-relaxed text-slate-600">
                        · {legacy.memo}
                      </li>
                    )}
                  </ul>
                </div>
              ) : null}

              <p className="mt-5 text-right text-[13px] font-bold text-slate-400">
                ·································· &ldquo;끝&rdquo;
              </p>
            </div>

            {/* 채점 근거 — 답안에 키워드가 들어갔는지 마지막에 확인 */}
            {(() => {
              const check = Array.from(
                new Set([
                  ...(legacy.defKeywords || []),
                  ...(legacy.features || []),
                  ...legacy.sections.flatMap((s) => s.keywords),
                  // 구획이 없는 얇은 토픽 — 커널 카드의 핵심 용어로 채점 근거를 보강
                  ...(legacy.sections.length
                    ? []
                    : (extra?.guide?.map || []).map((m) => m.real)),
                ]),
              ).filter(Boolean);
              return check.length ? (
                <div className="border-t border-indigo-100 px-5 py-3">
                  <div className="text-xs font-bold text-slate-500">
                    ✅ 키워드 체크 — 내 답안에 이 단어들이 들어갔는지 확인
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {check.map((k) => (
                      <span
                        key={k}
                        className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
            <p className="border-t border-indigo-100 bg-indigo-50/50 px-5 py-2 text-[11px] text-indigo-700">
              교재 서브노트가 아직 없는 예전 토픽이에요. 같은 답안지 순서(정의→특징→개념도→
              구성요소→플러스 알파)로 재구성했고, AI 없이 항상 열립니다.
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

        {/* 어떤 자료도 못 찾은 경우 — AI를 부르지 않고 상황만 안내한다 */}
        {topic.trim() && !textbook && !legacy && !extra?.image && (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            “{topic.trim()}” 자료가 아직 없어요. 위 검색창에서 비슷한 토픽을
            찾아보거나, 클로드에게 말해 주시면 교재가 없어도 직접 만들어 넣어요.
          </p>
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
