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
        desc="여기는 이해 전용입니다 — 학습 카드(비유·실제 동작·실전 쓰임) + 교재 원본 + 슬라이드 + 내 도식. 암기는 🥷두음신공에서."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <TopicAutocomplete
          value={topic}
          onChange={(v) => setTopic(v)}
          onSelect={(t) => {
            setTopic(t.title);
            setRecCat(t.category);
          }}
          placeholder="토픽/키워드 입력 — 비슷한 토픽이 떠요"
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
              🥷 이 토픽 두음신공 학습 →
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

        {/* 교재 원본 서브노트 — AI 호출 없이 즉시 표시(무료 AI 한도와 무관) */}
        {textbook && (
          <section className="mb-6 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-2 bg-emerald-50 px-5 py-3">
              <h3 className="text-sm font-bold text-emerald-800">
                📖 교재 서브노트 원본 — {textbook.title}
              </h3>
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                심화반 {textbook.course}
              </span>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <div className="text-xs font-bold text-slate-500">■ 정의</div>
                {/* 답안 서론에 그대로 옮겨 적는 2줄(한 줄 17자 × 2줄) 압축본을 먼저 보여준다. */}
                {textbook.defShort && (
                  <p className="mt-1 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold leading-relaxed text-amber-900 ring-1 ring-amber-200">
                    ✍️ {textbook.defShort}
                    <span className="ml-1.5 align-middle text-[10px] font-medium text-amber-600">
                      {textbook.defShort.replace(/\s/g, "").length}자
                    </span>
                  </p>
                )}
                <p
                  className={
                    textbook.defShort
                      ? "mt-1.5 text-[12.5px] leading-relaxed text-slate-500"
                      : "mt-1 text-sm font-medium leading-relaxed text-slate-800"
                  }
                >
                  {textbook.definition}
                </p>
              </div>
              {textbook.keywords.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-500">■ 키워드</div>
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
              {textbook.tables.map((tb) => (
                <div key={tb.caption}>
                  <div className="text-xs font-bold text-slate-500">
                    ■ {tb.caption}
                  </div>
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
              {textbook.notes?.length ? (
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-bold text-slate-500">■ 비고</div>
                  <ul className="mt-1 space-y-1">
                    {textbook.notes.map((n, i) => (
                      <li key={i} className="text-xs leading-relaxed text-slate-600">
                        · {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <p className="border-t border-emerald-100 bg-emerald-50/50 px-5 py-2 text-[11px] text-emerald-700">
              내 교재 원본이라 AI 없이도 항상 열려요. 아래 &ldquo;설명 보기&rdquo;를 누르면 AI가 이
              내용을 근거로 더 풀어서 설명해 줍니다.
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
