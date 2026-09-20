"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudyCard from "@/components/StudyCard";
import PeerAnswers from "@/components/PeerAnswers";
import { CellLines } from "@/components/TableCell";
import TopicMapCard from "@/components/TopicMapCard";
import { ExamHistoryCard } from "@/components/ExamHistoryCard";
import Mermaid from "@/components/Mermaid";
import { PageHeader } from "@/components/ui";
import TopicAutocomplete from "@/components/TopicAutocomplete";
import { DOMAIN_LABEL } from "@/lib/domains";
import { loadExplainIndex } from "@/lib/explainIndexClient";
import type { BrowseGroup, BrowseItem, ExplainIndex, ExplainNav, ExplainTopicData } from "@/lib/explainData";

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
 * 출제 이력 칩 — 학습계획의 📕·🛡️ 칩과 같은 눈금이지만 정적이다.
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
          📕{past} · {it.pastLast}회
        </span>
      )}
      {ns > 0 && (
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${tone(nr >= 2 || ns >= 4, nr)}`}
          title={`NS 주간 모의고사 출제 ${ns}회 · 최근 ${it.nsLast}`}
        >
          🛡️{ns} · {it.nsLast ? `${it.nsLast.slice(2, 4)}.${it.nsLast.slice(5, 7)}` : ""}
        </span>
      )}
    </>
  );
}

/** 학습계획 줄 모양의 토픽 한 줄 — 번호·중요도·제목·📖·출제 이력. 누르면 그 토픽을 연다. */
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
          {no}
        </span>
        <PriorityBadge p={it.imp} />
        <LevelBadge level={it.lv} />
        <span className="min-w-0 flex-1 truncate text-sm text-slate-800">
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
  const selGroup = groups.find((g) => g.key === sel);

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
            ({groups.reduce((n, g) => n + g.items.length, 0)}개)
          </span>
        </h3>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="목록 안에서 걸러보기"
          className="w-44 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-brand-500 focus:outline-none"
        />
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
                    {g.items.length}
                  </span>
                </button>
              );
            })}
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

          {selGroup && (
            <div className="border-t border-slate-100">
              {/* 학습계획 줄과 같은 모양 — 계획 순서·번호·중요도·📖·📕 기출·🛡️ NS 이력.
                  카드 안에서 따로 스크롤하지 않는다 — 짧은 창에 목록이 갇혀 한 화면에
                  대여섯 줄만 보였다. 페이지가 길어지는 쪽이 낫다. */}
              <ol className="divide-y divide-slate-100">
                {selGroup.items.map((it, i) => (
                  <TopicRow key={it.title} it={it} no={i + 1} onPick={pick} />
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

  // 답안지 2번 항목의 그림 이름 — 그림이 흐름·단계를 보여 주면 "절차"처럼 바꿔 쓴다.
  const diagramLabel = extra?.imagesLabel || "개념도";

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
                {g.badge === "심화반" ? `${g.label} (${g.items.length})` : `기필반 · ${g.label} (${g.items.length})`}
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
            {recItems.map((it, i) => (
              <option key={it.title} value={it.title}>
                {i + 1}. [{it.imp ?? "-"}] {it.title}
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
          {/* 학습계획 줄과 같은 표시 — 중요도(상·중·하)·대비 강도·📕 기출·🛡️ NS 모의고사.
              목록에서는 보이던 것이 토픽을 열면 사라져, 이게 상인지 하인지 몇 회 기출인지
              다시 목록으로 돌아가 확인해야 했다. */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <PriorityBadge p={data.plan?.priority ?? idx?.browseGroups.flatMap((g) => g.items).find((it) => it.title === cur)?.imp} />
            <LevelBadge level={data.plan?.level} note={data.plan?.note} />
            <HistChips it={{ title: cur, ...data.stat }} />
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
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                심화반 {COURSE_LABEL[textbook.course] || textbook.course}
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
                    // 비교 토픽 — 개념별 정의(각 29~30자)와 특징을 가/나로 나눠 적는다.
                    textbook.defPair.map((p, i) => (
                      <div key={p.name}>
                        {/* 개념별 리드문이 있으면 소제목을 "리드문, 이름의 정의"로 세우고 정의를 아래 줄에 쓴다 */}
                        {p.lead ? (
                          <>
                            <p className="text-[13px] font-bold leading-relaxed text-slate-700">
                              {HANGUL_NO[i] ?? "·"}. {p.lead}, {p.name}의 정의
                            </p>
                            <p className="pl-4 text-[13px] leading-relaxed text-slate-800">{p.def}</p>
                          </>
                        ) : (
                          <p className="text-[13px] leading-relaxed text-slate-800">
                            <span className="mr-1 font-bold text-slate-500">
                              {HANGUL_NO[i] ?? "·"}. {p.name}:
                            </span>
                            {p.def}
                          </p>
                        )}
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
                  {/* 정의 아래 하위 개념 정의 — 가./나. 로 덧붙인다(예: 단편화 → 내부·외부 단편화) */}
                  {!!textbook.subDefs?.length &&
                    textbook.subDefs.map((p, i) => (
                      <div key={p.name} className="pt-1">
                        <p className="text-[13px] font-bold leading-relaxed text-slate-700">
                          {HANGUL_NO[i] ?? "·"}. {p.lead ? `${p.lead}, ` : ""}
                          {p.name}의 정의
                        </p>
                        <p className="pl-4 text-[13px] leading-relaxed text-slate-800">{p.def}</p>
                      </div>
                    ))}
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
                  </p>
                )}
                {/* 간글 — 개념도 부연 한 줄 */}
                {gloss?.d && (
                  <p className="mt-1 pl-8 text-[12.5px] leading-relaxed text-slate-500">
                    – {gloss.d}
                  </p>
                )}
                {!!extra?.images?.length && (
                  <div className="mt-2 space-y-2 pl-4">
                    {extra.images.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt={`${cur} ${diagramLabel}`}
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
                          {tb.headers.map((h, hi) => (
                            <th
                              key={hi}
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
                                // 2열 이후는 한 줄 5~7칸. 줄은 번호 없이 그대로 쌓는다(TableCell).
                                className={`border border-slate-300 px-2 py-1.5 align-top leading-relaxed ${
                                  ci === 0
                                    ? "whitespace-nowrap font-semibold text-slate-800"
                                    : "text-slate-700"
                                }`}
                              >
                                {ci === 0 ? c : <CellLines text={c} />}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* 간글 — 표 부연 또는 다음 단락으로 잇는 한 줄 */}
                  {gloss?.t?.[ti] && (
                    <p className="mt-1 pl-4 text-[12.5px] leading-relaxed text-slate-500">
                      – {gloss.t[ti]}
                    </p>
                  )}
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

        {/* 학습 카드 — 용어 매핑·옆 토픽만. 줄글 설명·답안 한 줄은 뺐다. 교재 다음에 온다. */}
        <StudyCard extra={extra} />

        {/* 무엇과 짝인가 — 토픽 지도의 비교 세트·암기표를 이 자리로 끌어온다.
            시험은 개념 하나보다 나란히 놓고 묻는데, 그 짝을 보려면 지도로
            나갔다 와야 했다. */}
        {/* NS 주간 모의고사 출제 이력 — 언제, 몇 번, 어떤 문구로 나왔나.
            빈도·최근성이 높으면 붉게 띄운다(꼭 볼 것). */}
        {/* 모범답안 — 실제로 제출해 점수를 받은 시험지 스캔. 이 토픽에서 제일
            먼저 볼 자료다(배점 대비 점수와 빨간 첨삭이 곧 채점 기준). */}
        <PeerAnswers items={data?.peers ?? []} />

        <ExamHistoryCard hist={data?.hist ?? []} past={data?.past ?? []} />

        <TopicMapCard title={cur} sets={data?.mapSets ?? []} tables={data?.mapTables ?? []} />

        {data?.nav && <TopicNav nav={data.nav} onGo={goTopic} where="bottom" />}

        {/* 어떤 자료도 못 찾은 경우 — AI를 부르지 않고 상황만 안내한다 */}
        {cur && !textbook && !legacy && !extra?.image && (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            “{cur}” 자료가 아직 없어요. 위 검색창에서 비슷한 토픽을
            찾아보거나, 클로드에게 말해 주시면 교재가 없어도 직접 만들어 넣어요.
          </p>
        )}
      </div>
    </div>
  );
}
