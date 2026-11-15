"use client";

import Mermaid from "@/components/Mermaid";
import type { ExplainTopicData } from "@/lib/explainData";

/** 예전 토픽 답안지 템플릿 — 교재 서브노트가 없어도 같은 시험지 형식으로 보여준다.
 * 정의는 커널 카드의 답안 한 줄(guide.exam)을 최우선, 개념도는 검증된 conceptMap 렌더. */
export function LegacyTemplate({
  legacy,
  intro,
  extra,
}: {
  legacy: NonNullable<ExplainTopicData["legacy"]>;
  intro: ExplainTopicData["intro"] | undefined;
  extra: ExplainTopicData["extra"] | undefined;
}) {
  return (
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
          {intro?.pairs?.length ? (
            // 두 개념 토픽 — 개념마다 정의·특징을 따로(2026-11-15 "상호배제, 뮤텍스 정의를 각각 써야지")
            <div className="mt-1 space-y-2 pl-4">
              {intro.pairs.map((p, pi) => (
                <div key={p.name} className="space-y-1">
                  <p className="text-[13px] font-semibold leading-relaxed text-slate-800">
                    {["가", "나", "다", "라"][pi] ?? "·"}. {p.lead ? `${p.lead}, ` : ""}
                    {p.name} 정의
                  </p>
                  <p className="pl-4 text-[13px] leading-relaxed text-slate-800">{p.def}</p>
                  {!!p.features?.length && (
                    <p className="pl-4 text-[13px] leading-relaxed text-slate-800">
                      <span className="mr-1 font-bold text-slate-500">특징)</span>
                      {p.features.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
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
          )}
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
  );
}
