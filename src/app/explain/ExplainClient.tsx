"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudyCard from "@/components/StudyCard";
import PeerAnswers from "@/components/PeerAnswers";
import MyNotes from "@/components/MyNotes";
import { CellLines } from "@/components/TableCell";
import AnswerTable from "@/components/AnswerTable";
import AnswerTemplate from "@/components/AnswerTemplate";
import { askFreq, longFormTexts } from "@/lib/askFreq";
import TopicMapCard from "@/components/TopicMapCard";
import { ExamHistoryCard } from "@/components/ExamHistoryCard";
import Mermaid from "@/components/Mermaid";
import { PageHeader } from "@/components/ui";
import TopicAutocomplete from "@/components/TopicAutocomplete";
import { DOMAIN_LABEL } from "@/lib/domains";
import { loadExplainIndex } from "@/lib/explainIndexClient";
import type { BrowseGroup, BrowseItem, ExplainIndex, ExplainNav, ExplainTopicData } from "@/lib/explainData";
import ClearButton from "@/components/ClearButton";

/**
 * 토픽 설명 화면(클라이언트).
 *
 * 자료는 서버가 고른다 — page.tsx(서버 컴포넌트)가 ?topic= 을 읽어 그 토픽 몫만
 * props(data)로 넘긴다. 검색·목록 인덱스는 /api/explain-index 로 한 번 받는다.
 * 예전엔 이 파일이 교재·플래시카드·문제은행·학습카드 전부를 import 해 클라이언트
 * 번들이 압축 전 22 MB 였고, 폰에서는 스크립트가 죽어 빈 화면이 됐다.
 */

const IMP_ORDER: Record<string, number> = { 상: 0, 중: 1, 하: 2, 출제예상: 3 };

/**
 * 이전/다음 토픽 — 같은 과목 안에서 교재 순서대로 넘겨 본다.
 * 검색으로 하나 열고 나면 다음 토픽으로 가려고 목록을 다시 펼쳐야 했다. 위·아래 두 곳에 둔다.
 */
function TopicNav({
  nav,
  onGo,
  where,
}: {
  nav: ExplainNav;
  onGo: (title: string, opts?: { scrollTop?: boolean }) => void;
  where: "top" | "bottom";
}) {
  const go = (t: string) => onGo(t, { scrollTop: where === "bottom" });
  return (
    <nav
      aria-label="이전·다음 토픽"
      className={`flex items-stretch gap-2 ${where === "top" ? "mt-4" : "mt-2 mb-6"}`}
    >
      <button
        type="button"
        disabled={!nav.prev}
        onClick={() => nav.prev && go(nav.prev)}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm hover:border-brand-400 hover:bg-brand-50 disabled:cursor-default disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white"
      >
        <span className="shrink-0 text-slate-400">←</span>
        <span className="min-w-0">
          <span className="block text-[10px] font-bold text-slate-400">이전</span>
          <span className="block truncate font-medium text-slate-800">{nav.prev ?? "처음 토픽"}</span>
        </span>
      </button>
      <span className="hidden shrink-0 items-center px-1 text-[11px] tabular-nums text-slate-400 sm:flex">
        {nav.courseLabel} {nav.index}/{nav.total}
      </span>
      <button
        type="button"
        disabled={!nav.next}
        onClick={() => nav.next && go(nav.next)}
        className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-xl border border-brand-200 bg-brand-50/60 px-3 py-2 text-right text-sm hover:border-brand-400 hover:bg-brand-50 disabled:cursor-default disabled:opacity-40"
      >
        <span className="min-w-0">
          <span className="block text-[10px] font-bold text-brand-600">다음</span>
          <span className="block truncate font-semibold text-slate-900">{nav.next ?? "마지막 토픽"}</span>
        </span>
        <span className="shrink-0 text-brand-500">→</span>
      </button>
    </nav>
  );
}
/** 가나다… 소항목 번호 — 정의가 여럿이면 기법 수만큼 붙는다(블랙박스 9개 등) */
const HANGUL_NO = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타", "파", "하"];

const COURSE_LABEL = DOMAIN_LABEL;

const SRC_CHIP: Record<string, string> = {
  심화반: "bg-emerald-100 text-emerald-700",
  기필반: "bg-slate-100 text-slate-500",
  기출: "bg-amber-100 text-amber-700",
  서브: "bg-teal-100 text-teal-700",
};

/** 학습계획 줄과 같은 중요도 배지 — 상★★★ 중★★ 하★ */
const PRIORITY_STYLE: Record<string, { cls: string; star: string }> = {
  상: { cls: "bg-red-100 text-red-700 ring-red-200", star: "★★★" },
  중: { cls: "bg-blue-100 text-blue-700 ring-blue-200", star: "★★" },
  하: { cls: "bg-slate-100 text-slate-600 ring-slate-200", star: "★" },
  출제예상: { cls: "bg-brand-50 text-brand-700 ring-brand-200", star: "◎" },
};
function PriorityBadge({ p }: { p?: string }) {
  const st = (p && PRIORITY_STYLE[p]) || PRIORITY_STYLE.하;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold ring-1 ${st.cls}`}
      title={`중요도 ${p ?? "하"}`}
    >
      {p ?? "하"}
      <span className="text-[8px] leading-none">{st.star}</span>
    </span>
  );
}

/** 학습계획의 대비 강도 배지(암기·숙지·점검·참고) — plan 페이지와 같은 색. */
const LEVEL_STYLE: Record<string, string> = {
  암기: "border-rose-300 bg-rose-50 text-rose-700",
  숙지: "border-amber-300 bg-amber-50 text-amber-700",
  점검: "border-sky-300 bg-sky-50 text-sky-700",
  참고: "border-slate-200 bg-slate-50 text-slate-400",
};
const LEVEL_HINT: Record<string, string> = {
  암기: "통째로 외운다 — 정의·유형·조건까지 그대로",
  숙지: "개념과 구조를 이해해 둔다 — 설명할 수 있으면 된다",
  점검: "출제 공백이 길거나 기억이 흔들려 한 번 훑어야 한다",
  참고: "당분간 출제 가능성이 낮다 — 시간 남을 때",
};
function LevelBadge({ level, note }: { level?: string; note?: string }) {
  if (!level) return null;
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[10px] font-bold ${LEVEL_STYLE[level] || LEVEL_STYLE.참고}`}
      title={note || LEVEL_HINT[level] || level}
    >
      {level}
    </span>
  );
}

/**
 * 출제 이력 칩 — 학습계획의 📜기출·🛡️NS 칩과 같은 눈금이지만 정적이다.
 * 이 화면은 문제은행을 받지 않으므로(번들 22 MB 사고) 개수·최근만 서버가 세어 보낸다.
 * 자세한 문항 목록은 토픽을 열면 「출제 이력」 카드에 있다.
 */
function HistChips({ it }: { it: BrowseItem }) {
  const tone = (must: boolean, recent: number) =>
    must ? "bg-rose-100 text-rose-700" : recent > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500";
  const past = it.past ?? 0;
  const pr = it.pastRecent ?? 0;
  const ns = it.ns ?? 0;
  const nr = it.nsRecent ?? 0;
  return (
    <>
      {past > 0 && (
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${tone(pr >= 2 || past >= 3, pr)}`}
          title={`기술사 기출 ${past}회 · 최근 ${it.pastLast}회`}
        >
          📜기출 {past} · {it.pastLast}회
        </span>
      )}
      {ns > 0 && (
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${tone(nr >= 2 || ns >= 4, nr)}`}
          title={`NS 주간 모의고사 출제 ${ns}회 · 최근 ${it.nsLast}`}
        >
          🛡️NS {ns} · {it.nsLast ? `${it.nsLast.slice(2, 4)}.${it.nsLast.slice(5, 7)}` : ""}
        </span>
      )}
    </>
  );
}

/** 학습계획 줄 모양의 토픽 한 줄 — 번호·중요도·제목·📖·출제 이력. 누르면 그 토픽을 연다. */
/** 목록 번호 — 서브 토픽 줄(subOf)은 번호를 먹지 않는다(학습계획 번호와 맞게) */
function numbered(items: BrowseItem[]): [BrowseItem, number][] {
  let n = 0;
  return items.map((it) => [it, it.subOf ? 0 : ++n]);
}

/** 토픽 목록의 「📝 내가 정리한 토픽」 묶음 키 */
const MINE = "__mine";

/** 내가 정리한 토픽 표시(myNotes) — 토픽 목록·토픽 머리 */
function MineChip() {
  return (
    <span
      className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-300"
      title="내가 정리한 토픽 — 토픽 화면 답안지 템플릿 아래에 정리 노트가 붙어 있어요"
    >
      📝 정리
    </span>
  );
}

function TopicRow({
  it,
  no,
  group,
  onPick,
}: {
  it: BrowseItem;
  no: number;
  group?: string;
  onPick: (t: string) => void;
}) {
  return (
    <li>
      <button
        onClick={() => onPick(it.title)}
        className="flex w-full items-center gap-2 px-4 py-2 text-left transition hover:bg-brand-50/60"
      >
        <span className="w-6 shrink-0 text-right text-[11px] font-bold tabular-nums text-slate-400">
          {it.subOf ? "" : no}
        </span>
        {it.subOf ? (
          <span className="shrink-0 pl-3 text-[12px] text-teal-600" title={`${it.subOf} 교재 표 안의 서브 토픽`}>
            └ 🔎
          </span>
        ) : (
          <>
            <PriorityBadge p={it.imp} />
            <LevelBadge level={it.lv} />
          </>
        )}
        <span className={`min-w-0 flex-1 truncate text-sm ${it.subOf ? "text-teal-800" : "text-slate-800"}`}>
          {it.title}
          {group && <span className="ml-1.5 text-[10px] text-slate-400">{group}</span>}
        </span>
        {it.src === "심화반" ? (
          <span
            className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
            title="교재 서브노트 원본 있음"
          >
            📖
          </span>
        ) : (
          it.src && (
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${SRC_CHIP[it.src] || ""}`}>
              {it.src}
            </span>
          )
        )}
        <HistChips it={it} />
        {it.mine && <MineChip />}
        <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600">
          💡
        </span>
      </button>
    </li>
  );
}

function TopicBrowser({
  allGroups,
  onPick,
}: {
  allGroups: BrowseGroup[];
  onPick: (title: string) => void;
}) {
  // 기본은 아무 도메인도 안 펼친다 — 칩 한 줄만 보이는 상태가 시작점.
  const [sel, setSel] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  // 기본은 교재(심화반) 묶음만. 예전(기필반) 묶음은 토글로 편다.
  const [legacy, setLegacy] = useState(false);
  const groups = legacy ? allGroups : allGroups.filter((g) => g.badge === "심화반");

  const q = filter.trim().toLowerCase();
  // 걸러보기 입력 중에는 도메인 무관하게 맞는 토픽만 모아 한 판에 보여준다.
  const matched = q
    ? groups.flatMap((g) =>
        g.items
          .filter((it) => it.title.toLowerCase().includes(q))
          .map((it) => ({ ...it, group: g.label })),
      )
    : [];
  // 📝 내가 정리한 토픽 — 과목을 가로질러 한 판에 모은다
  const mineItems = groups.flatMap((g) => g.items.filter((it) => it.mine).map((it) => ({ ...it, group: g.label })));
  const selGroup = sel === MINE ? undefined : groups.find((g) => g.key === sel);

  const pick = (t: string) => {
    onPick(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3">
        <h3 className="text-sm font-bold text-slate-700">
          📂 도메인별 토픽 목록{" "}
          <span className="font-normal text-slate-400">
            ({groups.reduce((n, g) => n + g.items.filter((it) => !it.subOf).length, 0)}개)
          </span>
        </h3>
        <div className="relative">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="목록 안에서 걸러보기"
            className="w-44 rounded-lg border border-slate-300 px-3 py-1.5 pr-8 text-xs focus:border-brand-500 focus:outline-none"
          />
          <ClearButton value={filter} onClear={() => setFilter("")} className="right-1.5 top-1 h-5 w-5 text-[10px]" />
        </div>
      </div>

      {q ? (
        // 걸러보기 결과 — 도메인 구분 없이 한 판. 카드 안 스크롤 없이 전부 펼친다.
        <div className="p-4">
          {matched.length ? (
            <ol className="divide-y divide-slate-100">
              {matched.map((m, i) => (
                <TopicRow key={m.group + m.title} it={m} no={i + 1} group={m.group} onPick={pick} />
              ))}
            </ol>
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
            {groups.map((g) => {
              const active = sel === g.key;
              return (
                <button
                  key={g.key}
                  onClick={() => setSel(active ? null : g.key)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : g.badge === "심화반"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-500"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                  }`}
                >
                  {g.label}
                  <span
                    className={`font-normal ${active ? "text-brand-100" : "text-slate-400"}`}
                  >
                    {g.items.filter((it) => !it.subOf).length}
                  </span>
                </button>
              );
            })}
            {mineItems.length > 0 && (
              <button
                onClick={() => setSel(sel === MINE ? null : MINE)}
                title="내가 손으로 정리한 토픽만 모아 봅니다"
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  sel === MINE
                    ? "border-amber-600 bg-amber-500 text-white"
                    : "border-amber-300 bg-amber-50 text-amber-800 hover:border-amber-500"
                }`}
              >
                📝 내가 정리한 토픽
                <span className={`font-normal ${sel === MINE ? "text-amber-100" : "text-amber-500"}`}>{mineItems.length}</span>
              </button>
            )}
            {/* 기본은 교재 묶음만. 예전(기필반) 묶음은 회독 진도가 걸려 있어 토글 뒤에 둔다. */}
            <button
              onClick={() => { setLegacy(!legacy); setSel(null); }}
              title="심화반 교재에 없는 예전(기필반) 토픽 묶음까지 보여줍니다"
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                legacy
                  ? "border-slate-500 bg-slate-600 text-white"
                  : "border-dashed border-slate-300 bg-white text-slate-400 hover:border-slate-400"
              }`}
            >
              {legacy ? "예전 토픽 포함 중" : "+ 예전 토픽 포함"}
            </button>
          </div>

          {sel === MINE && (
            <div className="border-t border-amber-100">
              <ol className="divide-y divide-slate-100">
                {mineItems.map((it, i) => (
                  <TopicRow key={it.group + it.title} it={it} no={i + 1} group={it.group} onPick={pick} />
                ))}
              </ol>
            </div>
          )}
          {selGroup && (
            <div className="border-t border-slate-100">
              {/* 학습계획 줄과 같은 모양 — 계획 순서·번호·중요도·📖·📜 기출·🛡️ NS 이력.
                  카드 안에서 따로 스크롤하지 않는다 — 짧은 창에 목록이 갇혀 한 화면에
                  대여섯 줄만 보였다. 페이지가 길어지는 쪽이 낫다. */}
              <ol className="divide-y divide-slate-100">
                {numbered(selGroup.items).map(([it, no]) => (
                  <TopicRow key={it.title} it={it} no={no} onPick={pick} />
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function ExplainClient({ data }: { data: ExplainTopicData | null }) {
  // 지금 보여 주는 토픽 — 서버가 고른 자료의 제목. 입력창(topic)과는 별개다.
  const cur = data?.title ?? "";
  const [topic, setTopic] = useState(cur);
  // 답안지 템플릿 교시 — 1교시형(용어형 1.2~1.4쪽, 3단락) / 2교시형(서술형 3~3.5쪽, 4단락)
  const [period, setPeriod] = useState<1 | 2>(1);
  const [browseOpen, setBrowseOpen] = useState(!cur);
  const [idx, setIdx] = useState<ExplainIndex | null>(null);
  // 토픽 선택 드롭다운의 묶음 키 — 교재(심화반) 과목이 먼저, 예전(기필반) 묶음은 뒤.
  // 한때 topics.json 카테고리(기필반 목록)로 채워 심화반 교재 토픽이 안 나왔다.
  const [recGroup, setRecGroup] = useState(
    data?.textbook ? `course:${data.textbook.course}` : data?.category ? `cat:${data.category}` : "",
  );
  const [pending, startTransition] = useTransition();

  const textbook = data?.textbook;
  const extra = data?.extra;
  const legacy = data?.legacy;
  const intro = data?.intro;
  const gloss = data?.gloss;
  const topicId = data?.topicId;
  const hand = data?.hand ?? [];
  const handTables = data?.handTables ?? [];
  // 답안용 표·개념도(1교시 분량). 있으면 답안지는 이것으로, 교재 표 전체는 아래 접은 칸으로.
  const sheet = data?.sheet;
  // 2교시형 템플릿 뼈대 — 이 토픽 서술형(2~4교시) 지문이 자주 물은 것 위 3개
  const asks = useMemo(() => {
    if (!data) return undefined;
    const texts = longFormTexts({ hist: data.hist ?? [], past: data.past ?? [], mock: data.mock ?? [] });
    return { ...askFreq(texts, data.textbook?.title ?? cur), texts };
  }, [data, cur]);
  const ansTables = sheet?.tables?.length
    ? sheet.tables.map((t) => ({ ...t, nameCol: undefined }))
    : (textbook?.tables ?? []).map((t, i) => ({ ...t, gloss: gloss?.t?.[i] }));
  const ansDiagrams = extra?.images?.length ? extra.images : sheet?.diagram ?? [];
  // 2교시형은 교재 표 전체를 본론1·2에 싣는다(서술형 3~3.5쪽)
  const fullTables = (textbook?.tables ?? []).map((t, i) => ({ ...t, gloss: gloss?.t?.[i] }));

  // 답안지 2번 항목의 그림 이름 — 그림이 흐름·단계를 보여 주면 "절차"처럼 바꿔 쓴다.
  const diagramLabel = extra?.imagesLabel || "개념도";
  // 답안지 소제목에 쓰는 토픽 이름 — 괄호 속 원어는 떼고 쓴다(「FEC / BEC의 개념도」).
  const bareTitle = (textbook?.title || cur || "").replace(/\s*\([^)]*\)/g, "").trim();

  // 검색·목록 인덱스 — 화면이 뜬 뒤에 받는다(첫 화면 스크립트를 가볍게).
  useEffect(() => {
    let alive = true;
    loadExplainIndex()
      .then((v) => {
        if (alive) setIdx(v);
      })
      .catch(() => {
        /* 목록 없이도 ?topic= 으로 들어온 토픽은 보인다 */
      });
    return () => {
      alive = false;
    };
  }, []);

  // 링크·뒤로가기로 ?topic= 이 바뀌면 서버가 새 data 를 준다 — 입력창도 따라간다.
  useEffect(() => {
    setTopic(cur);
    if (cur) setBrowseOpen(false);
    if (data?.textbook) setRecGroup(`course:${data.textbook.course}`);
    else if (data?.category) setRecGroup(`cat:${data.category}`);
  }, [cur, data?.textbook, data?.category]);
  useEffect(() => {
    // 아무 토픽도 안 골랐으면 첫 과목(심화반 1주차 CA)부터. 없는 키면 첫 묶음으로.
    if (idx?.browseGroups.length && !idx.browseGroups.some((g) => g.key === recGroup))
      setRecGroup(idx.browseGroups[0].key);
  }, [idx, recGroup]);

  /**
   * 토픽을 확정했을 때 — 주소(?topic=)를 바꾸면 서버가 그 토픽 자료를 다시 준다.
   * 주소가 그대로면 새로고침·공유·뒤로가기가 엉뚱한 토픽을 가리킨다.
   */
  const router = useRouter();
  const goTopic = (title: string, opts?: { scrollTop?: boolean }) => {
    const t = title.trim();
    setTopic(t);
    setBrowseOpen(false);
    // 화면 아래쪽 '다음 토픽' 버튼으로 넘어갈 때는 새 토픽의 머리부터 보여 준다.
    if (t)
      startTransition(() =>
        router.push(`/explain?topic=${encodeURIComponent(t)}`, { scroll: !!opts?.scrollTop }),
      );
  };

  // 고른 묶음의 토픽 — 심화반 묶음은 학습계획 순서 그대로(목록·정리표와 같은 줄 순서).
  const recItems = idx?.browseGroups.find((g) => g.key === recGroup)?.items ?? [];

  return (
    <div>
      <PageHeader
        title="💡 토픽 설명"
        desc="교재 슬라이드 + 답안지 템플릿 + 용어 매핑·옆 토픽 + 남이 쓴 답안."
        up={[
          { href: "/plan", label: "🗓️ 학습 계획" },
          { href: "/map", label: "🗺️ 토픽 목록" },
          { href: "/sheet", label: "📋 토픽 정리표" },
        ]}
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
            value={recGroup}
            onChange={(e) => setRecGroup(e.target.value)}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
          >
            {(idx?.browseGroups ?? []).map((g) => (
              <option key={g.key} value={g.key}>
                {g.badge === "심화반" ? `${g.label} (${g.items.filter((it) => !it.subOf).length})` : `기필반 · ${g.label} (${g.items.length})`}
              </option>
            ))}
          </select>
          <select
            key={recGroup}
            defaultValue=""
            onChange={(e) => e.target.value && goTopic(e.target.value)}
            className="min-w-[12rem] rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
          >
            <option value="" disabled>
              토픽 선택… ({recItems.length}개)
            </option>
            {numbered(recItems).map(([it, no]) => (
              <option key={it.title} value={it.title}>
                {it.subOf ? `   └ 🔎 ${it.title}` : `${no}. [${it.imp ?? "-"}] ${it.title}`}
                {it.lv ? ` · ${it.lv}` : ""}
                {it.past ? ` · 기출${it.past}` : ""}
                {it.ns ? ` · NS${it.ns}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {pending && <span className="text-xs text-slate-400">불러오는 중…</span>}
          {textbook && (
            <Link
              href={`/sheet#${textbook.course}`}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              📋 {COURSE_LABEL[textbook.course] || textbook.course} 정리표 →
            </Link>
          )}
        </div>
      </div>

      {/* 지금 보는 토픽 — 검색창 글씨만으로는 무슨 토픽인지 안 보여서 크게 박는다 */}
      {cur && data && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
              {cur}
            </h2>
            {textbook ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                심화반 {COURSE_LABEL[textbook.course] || textbook.course}
              </span>
            ) : legacy ? (
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                {legacy.category}
              </span>
            ) : null}
          </div>
          {/* 학습계획 줄과 같은 표시 — 중요도(상·중·하)·대비 강도·📜 기출·🛡️ NS 모의고사.
              목록에서는 보이던 것이 토픽을 열면 사라져, 이게 상인지 하인지 몇 회 기출인지
              다시 목록으로 돌아가 확인해야 했다. */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <PriorityBadge p={data.plan?.priority ?? idx?.browseGroups.flatMap((g) => g.items).find((it) => it.title === cur)?.imp} />
            <LevelBadge level={data.plan?.level} note={data.plan?.note} />
            <HistChips it={{ title: cur, ...data.stat }} />
            {data.myNotes.length > 0 && <MineChip />}
            {data.stat.past === 0 && data.stat.ns === 0 && (
              <span className="text-[11px] text-slate-400">기출·NS 모의고사 출제 이력 없음</span>
            )}
            {data.plan?.note && (
              <span className="basis-full text-[11px] text-slate-500">💬 {data.plan.note}</span>
            )}
          </div>
        </div>
      )}

      {/* 이전·다음 토픽 — 같은 과목 안에서 교재 순서대로 */}
      {data?.nav && <TopicNav nav={data.nav} onGo={goTopic} where="top" />}

      {/* 도메인별 목록 — 아무것도 안 골랐으면 펼쳐서, 고른 뒤에는 접어서 보여준다. */}
      <div className="mt-6">
        {browseOpen ? (
          idx ? (
            <TopicBrowser allGroups={idx.browseGroups} onPick={goTopic} />
          ) : (
            <p className="mb-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-3 text-sm text-slate-400">
              📂 토픽 목록을 불러오는 중…
            </p>
          )
        ) : (
          <button
            onClick={() => setBrowseOpen(true)}
            className="mb-6 w-full rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-500 hover:border-brand-400 hover:text-brand-700"
          >
            📂 도메인별 토픽 목록에서 다른 토픽 찾기{idx ? ` (${idx.bookTotal}개)` : ""}
          </button>
        )}
      </div>

      <div className="mt-6">
        {/* 교재 슬라이드 원본 — 맨 위. 교재가 항상 먼저고, 아래 템플릿·카드는 그걸 답안으로 옮기는 순서다.
            도식을 다시 그리지 않고 교재 그림 그대로 보여준다. */}
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
              alt={`${cur} 교재 슬라이드`}
              className="w-full bg-white"
            />
            {/* 간글 — 이 슬라이드(개념도) 한 줄 부연 */}
            {gloss?.d && (
              <p className="border-t border-slate-100 px-4 py-2 text-[12.5px] leading-relaxed text-slate-500">
                – {gloss.d}
              </p>
            )}
          </section>
        )}

        {/* 교재 원본 서브노트 → 답안지 템플릿 — 시험지에 옮겨 적는 순서 그대로 보여준다.
            교재 원문(정의·키워드·표 원본)은 위 슬라이드 이미지에 있으므로 중복 표기하지 않는다. */}
        {textbook && (
          <section className="mb-6 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 bg-emerald-50 px-5 py-3">
              <h3 className="text-sm font-bold text-emerald-800">
                📝 답안지 템플릿 — {textbook.title}
              </h3>
              <div className="flex items-center gap-1.5">
                {([1, 2] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      period === p ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                    title={p === 1 ? "1교시 · 26줄 · 1. 정의 / 2. 개념도와 표 / 3. 결론 4박스" : "2교시 · 66~77줄 · Ⅰ 서론 / Ⅱ 본론1 / Ⅲ 본론2(승부처) / Ⅳ 결론"}
                  >
                    {p}교시형
                  </button>
                ))}
                <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  심화반 {COURSE_LABEL[textbook.course] || textbook.course}
                </span>
              </div>
            </div>

            {/* 답안지 — 답안 작성 지침(1교시 V30 26줄 · 2교시 4단락 66~77줄)대로(2026-10-11) */}
            <AnswerTemplate
              period={period}
              textbook={textbook}
              course={textbook.course}
              bare={bareTitle}
              ansTables={ansTables}
              fullTables={fullTables}
              diagrams={ansDiagrams}
              hand={hand}
              diagramGloss={gloss?.d}
              diagramLabel={diagramLabel}
              hasSlide={!!extra?.image}
              asks={asks}
            />

            {/* 손글씨 표 — 정리 노트에서 잘라 온 것. 교재 표를 시험지에 몇 칸으로 줄여 쓰는지 본다. */}
            {handTables.length > 0 && (
              <div className="mx-5 mb-3 space-y-2">
                <p className="text-[11px] font-semibold text-slate-500">✍️ 손글씨 정리 노트 — 표</p>
                {handTables.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt={`${cur} 손글씨 표`}
                    loading="lazy"
                    className="w-full rounded border border-amber-300 bg-white"
                  />
                ))}
              </div>
            )}

            {/* 답안용 표를 쓴 토픽 — 교재 표 전체는 접어 둔다(2교시 서술형·암기용) */}
            {period === 1 && !!sheet?.tables?.length && textbook.tables.length > 0 && (
              <details className="mx-5 mb-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                <summary className="cursor-pointer text-xs font-bold text-slate-600">
                  📚 교재 표 전체 보기 ({textbook.tables.length}개) — 2~4교시 서술형·암기용
                </summary>
                <div className="mt-2 space-y-3">
                  {textbook.tables.map((tb, i) => (
                    <div key={tb.caption}>
                      <p className="text-[12.5px] font-bold text-slate-700">
                        {HANGUL_NO[i] ?? "·"}. {tb.caption}
                      </p>
                      <AnswerTable headers={tb.headers} rows={tb.rows} dense />
                      {gloss?.t?.[i] && <p className="text-[12px] text-slate-500">- {gloss.t[i]}</p>}
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* 답안 밖 — 교재 메모. 시험지에 옮길 때 서론·결론에 한 줄 덧붙일 거리 */}
            {period === 1 && textbook.notes?.length ? (
              <div className="mx-5 mb-3 rounded-lg bg-amber-50/70 px-4 py-2.5">
                <p className="text-xs font-bold text-amber-800">✏️ 덧붙일 거리 (교재 메모)</p>
                <ul className="mt-1 space-y-0.5">
                  {textbook.notes.map((n, i) => (
                    <li key={i} className="text-[12.5px] leading-relaxed text-slate-700">
                      · {n}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* 슬라이드 이미지가 없는 토픽만 교재 원문 정의를 여기서 보여준다(유실 방지) */}
            {!extra?.image && (
              <div className="mx-5 mb-3 rounded-lg bg-slate-50 p-3">
                <div className="text-xs font-bold text-slate-500">■ 교재 원문 정의</div>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-700">{textbook.definition}</p>
              </div>
            )}

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

              {/* 1. 서론 — 교재와 같은 규격: 리드문의 정의 → 29~30자(공백 제외) 압축
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
                // 3단표가 없으면 커널 학습카드(핵심 동작·핵심 구성요소)로 본론을 채운다.
                // 키워드 칩만 있는 얇은 토픽도 카드 내용으로 보강해 2번이 비지 않게 한다.
                const useGuideBody =
                  !legacy.comp?.length && !!(g?.mechanism || g?.map?.length);
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

        {/* 내 정리 — 손으로 정리한 공책·내 답안지에서 이 토픽 문항을 잘라 붙인 것. 답안지 템플릿 바로 아래(2026-10-20 "내 정리를 답안지 템플릿 밑으로") */}
        <MyNotes key={cur} items={data?.myNotes ?? []} />

        {/* 학습 카드 — 용어 매핑·옆 토픽만. 줄글 설명·답안 한 줄은 뺐다. 교재 다음에 온다. */}
        {/* 교재 속 서브 토픽 화면 — 상위 토픽 표 안에만 있던 개념(subTopics). 교재 표 행을 그대로 보여 준다 */}
        {data?.sub && (
          <section className="mb-6 overflow-hidden rounded-2xl border-2 border-teal-200 bg-white shadow-sm">
            <div className="bg-teal-50 px-5 py-3">
              <p className="text-sm font-bold text-teal-900">
                🔎 교재 속 서브 토픽 — 상위 토픽{" "}
                <Link href={`/explain?topic=${encodeURIComponent(data.sub.parent)}`} className="underline decoration-dotted underline-offset-2">
                  {data.sub.parent}
                </Link>
              </p>
              <p className="mt-0.5 text-[11.5px] text-teal-800">
                교재엔 따로 쪽이 없고 아래 표 안에 들어 있어요. 다른 표기: {data.sub.aliases.join(" · ")}
              </p>
            </div>
            <div className="space-y-3 p-4">
              {data.sub.tables.map((tb, i) => (
                <div key={i}>
                  <p className="mb-1 text-[12px] font-semibold text-slate-600">
                    {tb.caption || "교재 표"} <span className="font-normal text-slate-400">— {tb.from}</span>
                  </p>
                  <AnswerTable headers={tb.headers} rows={tb.rows} />
                </div>
              ))}
              {!data.sub.tables.length && <p className="text-xs text-slate-400">교재 표에서 이 이름이 든 행을 못 찾았어요.</p>}
            </div>
          </section>
        )}

        {/* 이 토픽 안의 서브 토픽 — 표 속 개념 중 따로 자주 출제되는 것 */}
        {!!data?.subs?.length && (
          <section className="mb-6 rounded-2xl border border-teal-200 bg-teal-50/40 px-4 py-3">
            <p className="text-sm font-bold text-teal-900">🔎 이 토픽 안의 서브 토픽</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.subs.map((st) => (
                <Link
                  key={st.name}
                  href={`/explain?topic=${encodeURIComponent(st.name)}`}
                  className="rounded-full border border-dashed border-teal-400 bg-white px-2.5 py-1 text-[12.5px] text-teal-900 hover:bg-teal-50"
                >
                  {st.name}
                  <span className="ml-1 text-[10.5px] text-slate-400">
                    기출 {st.past} · NS {st.ns} · 모의 {st.mock}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <StudyCard extra={extra} />

        {/* 무엇과 짝인가 — 토픽 지도의 비교 세트·암기표를 이 자리로 끌어온다.
            시험은 개념 하나보다 나란히 놓고 묻는데, 그 짝을 보려면 지도로
            나갔다 와야 했다. */}
        {/* NS 주간 모의고사 출제 이력 — 언제, 몇 번, 어떤 문구로 나왔나.
            빈도·최근성이 높으면 붉게 띄운다(꼭 볼 것). */}
        {/* 모범답안 — 실제로 제출해 점수를 받은 시험지 스캔. 이 토픽에서 제일
            먼저 볼 자료다(배점 대비 점수와 빨간 첨삭이 곧 채점 기준). */}
        <PeerAnswers items={data?.peers ?? []} />

        {/* 사실상 같은 토픽 — 과목만 다르고 같은 답을 요구하는 짝(twinTopics)의 답안 */}
        {data?.twin && (
          <section className="mb-6 rounded-2xl border-2 border-sky-200 bg-sky-50/40 p-3">
            <p className="text-sm font-bold text-sky-900">
              🔗 사실상 같은 토픽 —{" "}
              <Link href={`/explain?topic=${encodeURIComponent(data.twin.title)}`} className="underline decoration-dotted underline-offset-2">
                {data.twin.title}
              </Link>
            </p>
            <p className="mt-0.5 text-[12px] leading-5 text-sky-800">{data.twin.note}</p>
            <p className="mt-0.5 text-[11px] text-sky-700/80">
              그 토픽 출제 📜 기출 {data.twin.past} · 🛡️ NS {data.twin.ns} · 🏁 모의 {data.twin.mock} · 답안 {data.twin.peers.length}편 — 아래에 같이 보여요
            </p>
            {data.twin.peers.length > 0 && (
              <div className="mt-2">
                <PeerAnswers items={data.twin.peers} collapsed />
              </div>
            )}
          </section>
        )}

        <ExamHistoryCard hist={data?.hist ?? []} past={data?.past ?? []} mock={data?.mock ?? []} />

        {/* 교재 밖 비교표 — 슬라이드에 없는 짝 비교. 교재 표와 섞이지 않게 따로 그린다. */}
        {(data?.extraCompares ?? []).map((c) => (
          <section key={c.title} className="mb-6 overflow-hidden rounded-2xl border-2 border-violet-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 bg-violet-50 px-5 py-3">
              <h3 className="text-sm font-bold text-violet-900">📊 {c.title} 비교</h3>
              <span className="rounded bg-violet-200 px-1.5 py-0.5 text-[10px] font-bold text-violet-800">교재 외</span>
            </div>
            <div className="overflow-x-auto px-5 py-3">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr>
                    {c.headers.map((h) => (
                      <th key={h} className="border border-slate-200 bg-slate-50 px-2 py-1.5 text-left font-semibold text-slate-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((cell, j) => (
                        <td key={j} className={`whitespace-pre border border-slate-200 px-2 py-1.5 align-top ${j === 0 ? "font-semibold text-slate-700" : "text-slate-800"}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {c.note && <p className="mt-2 text-xs text-slate-500">– {c.note}</p>}
            </div>
          </section>
        ))}

        <TopicMapCard title={cur} sets={data?.mapSets ?? []} tables={data?.mapTables ?? []} />

        {data?.nav && <TopicNav nav={data.nav} onGo={goTopic} where="bottom" />}

        {/* 어떤 자료도 못 찾은 경우 — AI를 부르지 않고 상황만 안내한다 */}
        {cur && !textbook && !legacy && !extra?.image && !data?.sub && (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            “{cur}” 자료가 아직 없어요. 위 검색창에서 비슷한 토픽을
            찾아보거나, 클로드에게 말해 주시면 교재가 없어도 직접 만들어 넣어요.
          </p>
        )}
      </div>
    </div>
  );
}
