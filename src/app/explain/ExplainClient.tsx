"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudyCard from "@/components/StudyCard";
import PeerAnswers from "@/components/PeerAnswers";
import MyNotes from "@/components/MyNotes";
import AnswerTable from "@/components/AnswerTable";
import AnswerTemplate from "@/components/AnswerTemplate";
import CustomSheet from "@/components/CustomSheet";
import FrameCard from "@/components/FrameCard";
import { askFreq, longFormTexts } from "@/lib/askFreq";
import TopicMapCard from "@/components/TopicMapCard";
import { ExamHistoryCard } from "@/components/ExamHistoryCard";
import { PageHeader } from "@/components/ui";
import TopicAutocomplete from "@/components/TopicAutocomplete";
import { loadExplainIndex } from "@/lib/explainIndexClient";
import type { ExplainTopicData } from "@/lib/explainData";
import type { ExplainIndex } from "@/lib/explainIndex";
import { explainHref } from "@/lib/links";
import { DOMAIN_LABEL } from "@/lib/domains";
import PriorityBadge from "@/components/PriorityBadge";
import { TopicNav } from "./TopicNav";
import { HANGUL_NO, LevelBadge } from "./explainBits";
import { HistChips, MineChip, TopicBrowser, numbered } from "./TopicBrowser";
import { LegacyTemplate } from "./LegacyTemplate";
import { ExamNoteCard } from "./ExamNoteCard";

/**
 * 토픽 설명 화면(클라이언트).
 *
 * 자료는 서버가 고른다 — page.tsx(서버 컴포넌트)가 ?topic= 을 읽어 그 토픽 몫만
 * props(data)로 넘긴다(`ExplainShell` 이 /api/explain-topic 에서 받아 준다). 목록 인덱스는 /api/explain-index 로 한 번 받는다.
 * 예전엔 이 파일이 교재·플래시카드·문제은행·학습카드 전부를 import 해 클라이언트
 * 번들이 압축 전 22 MB 였고, 폰에서는 스크립트가 죽어 빈 화면이 됐다.
 */

export default function ExplainClient({ data, loading }: { data: ExplainTopicData | null; loading?: boolean }) {
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
  const hand = data?.hand ?? [];
  const handTables = data?.handTables ?? [];
  // 답안용 표·개념도(1교시 분량). 있으면 답안지는 이것으로, 교재 표 전체는 아래 접은 칸으로.
  const sheet = data?.sheet;
  // 내 답안지(아티팩트에서 가져온 것) — 이 교시에 있으면 자동 템플릿 대신 보인다
  const custom = data?.custom?.[String(period) as "1" | "2"];
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

  // 링크·뒤로가기로 ?topic= 이 바뀌면 껍데기(ExplainShell)가 새 data 를 준다 — 입력창도 따라간다.
  useEffect(() => {
    setTopic(cur);
    // 토픽 없는 주소(뒤로 가기로 목차에 돌아온 경우 포함)면 목록을 편다.
    // 같은 화면이 다시 그려질 뿐이라 처음 값(!cur)만으로는 접힌 채 남았다.
    setBrowseOpen(!cur);
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
        router.push(explainHref(t), { scroll: !!opts?.scrollTop }),
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
          {(pending || loading) && <span className="text-xs text-slate-400">불러오는 중…</span>}
          {textbook && (
            <Link
              href={`/sheet#${textbook.course}`}
              prefetch={false}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              📋 {DOMAIN_LABEL[textbook.course] || textbook.course} 정리표 →
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
                심화반 {DOMAIN_LABEL[textbook.course] || textbook.course}
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
                    {p}교시형{data?.custom?.[String(p) as "1" | "2"] ? " ✍️" : ""}
                  </button>
                ))}
                <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  심화반 {DOMAIN_LABEL[textbook.course] || textbook.course}
                </span>
              </div>
            </div>

            {/* 답안지 — 답안 작성 지침(1교시 V30 26줄 · 2교시 4단락 66~77줄)대로(2026-10-11) */}
            {custom ? (
              <CustomSheet sheet={custom} />
            ) : (
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
            )}

            {/* 🧩 답안 틀 — 개념도 그룹·3단락 유형·돌려막기 묶음(2026-11-09) */}
            <FrameCard title={textbook.title} />

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
        {legacy && <LegacyTemplate legacy={legacy} intro={intro} extra={extra} />}
        {data?.examNote && <ExamNoteCard title={cur} note={data.examNote} />}

        {/* 내 정리 — 손으로 정리한 공책·내 답안지에서 이 토픽 문항을 잘라 붙인 것. 답안지 템플릿 바로 아래(2026-10-20 "내 정리를 답안지 템플릿 밑으로") */}
        <MyNotes key={cur} items={data?.myNotes ?? []} />

        {/* 학습 카드 — 용어 매핑·옆 토픽만. 줄글 설명·답안 한 줄은 뺐다. 교재 다음에 온다. */}
        {/* 교재 속 서브 토픽 화면 — 상위 토픽 표 안에만 있던 개념(subTopics). 교재 표 행을 그대로 보여 준다 */}
        {data?.sub && (
          <section className="mb-6 overflow-hidden rounded-2xl border-2 border-teal-200 bg-white shadow-sm">
            <div className="bg-teal-50 px-5 py-3">
              <p className="text-sm font-bold text-teal-900">
                🔎 교재 속 서브 토픽 — 상위 토픽{" "}
                <Link href={explainHref(data.sub.parent)} className="underline decoration-dotted underline-offset-2">
                  {data.sub.parent}
                </Link>
              </p>
              <p className="mt-0.5 text-[11.5px] text-teal-800">
                교재엔 따로 쪽이 없고 아래 표 안에 들어 있어요. 다른 표기: {data.sub.aliases.join(" · ")}
              </p>
            </div>
            <div className="space-y-3 p-4">
              {/* 설명 — 이름·별칭이 맞는 기필반 카드의 정의. 위 답안지 템플릿으로 그린 카드 말고 더 있는 것(두 개념 서브 토픽) */}
              {data.sub.cards.map((c) => (
                <div key={c.title} className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2">
                  <p className="text-[12px] font-bold text-indigo-900">
                    📖 {c.title} <span className="font-normal text-indigo-400">— 기필반 자료</span>
                  </p>
                  <p className="mt-0.5 text-[13.5px] leading-relaxed text-slate-800">{c.definition}</p>
                  <Link href={explainHref(c.title)} className="text-[11.5px] text-indigo-700 hover:underline">
                    이 토픽 답안지 템플릿 →
                  </Link>
                </div>
              ))}
              {!legacy && !data.sub.cards.length && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">
                  이 서브 토픽은 교재에 쪽이 없고 기필반 자료에도 같은 이름의 토픽이 없어, 정의를 따로 적어 두지 않았어요(지어 넣지 않습니다).
                  아래 교재 표 행과 해설집·모범답안을 보세요.
                </p>
              )}
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
                  href={explainHref(st.name)}
                  className="rounded-full border border-dashed border-teal-400 bg-white px-2.5 py-1 text-[12.5px] text-teal-900 hover:bg-teal-50"
                >
                  {st.name}
                  <span className="ml-1 text-[10.5px] text-slate-400">
                    기출 {st.past} · NS {st.ns} · 모의 {st.mock}
                    {st.peers.length > 0 && ` · 답안 ${st.peers.length}`}
                  </span>
                </Link>
              ))}
            </div>
            {/* 서브 토픽 한 줄 설명 — 기필반 카드 정의가 있는 것만 */}
            {data.subs.some((st) => st.def) && (
              <ul className="mt-2 space-y-1">
                {data.subs.filter((st) => st.def).map((st) => (
                  <li key={st.name} className="text-[12.5px] leading-relaxed text-slate-700">
                    <span className="font-semibold text-teal-900">{st.name}</span> — {st.def}
                  </li>
                ))}
              </ul>
            )}
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

        {/* 서브 토픽 답안 — 상위 토픽 답안에 없는 것만(다형성 ← 오버라이딩·오버로딩 답안) */}
        {(data?.subs ?? []).some((st) => st.peers.length > 0) && (
          <section className="mb-6 rounded-2xl border-2 border-teal-200 bg-teal-50/40 p-3">
            <p className="text-sm font-bold text-teal-900">🔎 서브 토픽 답안</p>
            <p className="mt-0.5 text-[11px] text-teal-800/80">이 토픽 안의 개념만 따로 물은 답안 — 문제 문구에 서브 토픽 이름이 든 것</p>
            {data!.subs!.filter((st) => st.peers.length > 0).map((st) => (
              <div key={st.name} className="mt-2">
                <Link
                  href={explainHref(st.name)}
                  className="text-[12.5px] font-semibold text-teal-900 underline decoration-dotted underline-offset-2"
                >
                  {st.name}
                </Link>
                <span className="ml-1 text-[11px] text-slate-400">{st.peers.length}편</span>
                <div className="mt-1">
                  <PeerAnswers items={st.peers} collapsed />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 사실상 같은 토픽 — 과목만 다르고 같은 답을 요구하는 짝(twinTopics)의 답안 */}
        {data?.twin && (
          <section className="mb-6 rounded-2xl border-2 border-sky-200 bg-sky-50/40 p-3">
            <p className="text-sm font-bold text-sky-900">
              🔗 사실상 같은 토픽 —{" "}
              <Link href={explainHref(data.twin.title)} className="underline decoration-dotted underline-offset-2">
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
        {cur && !textbook && !legacy && !extra?.image && !data?.sub && !data?.examNote && (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            “{cur}” 은 교재에 쪽이 없는 토픽이라 정리한 내용(정의·표·답안지 템플릿)이 아직 없어요. 이 화면에는 이 이름으로 걸리는 출제
            문항과 모범답안·해설집만 모입니다.
          </p>
        )}
      </div>
    </div>
  );
}
