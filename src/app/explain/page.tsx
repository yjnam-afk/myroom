"use client";

import { readJsonSafe } from "@/lib/safeJson";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { subnoteByTitle, subnoteByTopicId } from "@/data/textbookSubnotes";
import MyDiagrams from "@/components/MyDiagrams";
import EasyCard from "@/components/EasyCard";
import { subnoteExtraFor } from "@/data/subnoteExtras";
import { PageHeader, Spinner, ErrorBox, Button } from "@/components/ui";
import Markdown from "@/components/Markdown";
import ConceptDiagram from "@/components/ConceptDiagram";
import ShareButton from "@/components/ShareButton";
import AudioLecture from "@/components/AudioLecture";
import TopicAutocomplete from "@/components/TopicAutocomplete";
import topics from "@/data/topics.json";

const CATS = Array.from(new Set(topics.map((t) => t.category)));
const IMP_ORDER: Record<string, number> = { 상: 0, 중: 1, 하: 2, 출제예상: 3 };

function ExplainInner() {
  const [topic, setTopic] = useState("");
  const [recCat, setRecCat] = useState(CATS[0]);
  const [result, setResult] = useState("");
  const [conceptTopicId, setConceptTopicId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoPending, setAutoPending] = useState(false);

  // 교재 슬라이드 원본 이미지 + 쉬운 설명 (AI 호출 없음)
  const extra = subnoteExtraFor(
    topics.find((x) => x.title === topic.trim())?.id,
    topic.trim(),
  );

  // 내 교재(심화반) 서브노트 원본 — 있으면 AI 없이 바로 보여준다.
  const textbook =
    subnoteByTitle(topic.trim()) ||
    subnoteByTopicId(topics.find((x) => x.title === topic.trim())?.id);

  // 학습 코치 등에서 ?topic=&auto= 으로 들어오면 미리 채우고 auto=1이면 즉시 생성.
  // SPA 이동으로 쿼리만 바뀌어도 반응하도록 searchParams 의존.
  const searchParams = useSearchParams();
  useEffect(() => {
    const title = searchParams.get("topic") || "";
    if (title) {
      setTopic(title);
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

      <div className="mt-6">
        {/* 쉽게 이해하기 — 비유 → 용어 매핑 → 연관 토픽 → 답안. AI 호출 없음. */}
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

              {/* 2. 본론 — 개념도와 구성요소. 개념도는 아래 교재 슬라이드를 6줄 도식으로 옮기고,
                  교재 표들은 가/나/다 소항목으로 이어 적는다. */}
              <div className="mt-4">
                <p className="text-[13px] font-bold leading-relaxed text-slate-800">
                  2. {textbook.title.replace(/\s*\([^)]*\)/g, "")}의 개념도 및 구성요소
                </p>
                {extra?.image && (
                  <p className="mt-1 pl-4 text-[13px] leading-relaxed text-slate-600">
                    <span className="mr-1 font-bold text-slate-500">가. 개념도</span>
                    아래 교재 슬라이드의 개념도를 답안지 6줄 내 도식으로 옮겨 그린다
                  </p>
                )}
              </div>
              {textbook.tables.map((tb, ti) => (
                <div key={tb.caption} className="mt-3 pl-4">
                  <p className="text-[13px] font-bold leading-relaxed text-slate-700">
                    {["가", "나", "다", "라", "마", "바", "사"][ti + (extra?.image ? 1 : 0)]}.{" "}
                    {tb.caption}
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
            {/* 오디오 강의·공유 — 두음신공 페이지와 동일하게 결과 상단(카드 밖) */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <AudioLecture
                topic={topic.trim()}
                topicId={topics.find((x) => x.title === topic.trim())?.id}
              />
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
