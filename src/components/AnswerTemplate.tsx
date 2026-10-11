"use client";

import { useState, type ReactNode } from "react";
import AnswerPaper from "@/components/AnswerPaper";
import AnswerTable from "@/components/AnswerTable";
import ConclusionFigure from "@/components/ConclusionFigure";
import ConclusionGraph from "@/components/ConclusionGraph";
import ConclusionList from "@/components/ConclusionList";
import { conclusionFor, type AnswerConclusion } from "@/data/answerConclusions";
import type { TextbookSubnote, SubnoteTable } from "@/data/textbookSubnotes";
import {
  cellLimits,
  conclusionOf,
  isReasonTable,
  pickConclusion,
  pickForm,
  shape1,
  shape2,
  tableSubject,
  type Conclusion,
  type ConclusionForm,
} from "@/lib/answerGuide";

type Tb = SubnoteTable & { gloss?: string };
const NO = ["가", "나", "다", "라", "마", "바"];

/** 빈칸 안내 — 템플릿이 지어 넣지 않는 자리 */
function Hole({ children }: { children: ReactNode }) {
  return <span className="text-slate-400">({children})</span>;
}

/** 간글 1줄 — 공백 포함 40자 넘으면 표시(지침 4장 간글 길이 상한) */
function Gloss({ text, hint = "간글 1줄 · 공백 포함 40자 이내" }: { text?: string; hint?: string }) {
  if (!text) return <p className="pl-1"><Hole>{hint}</Hole></p>;
  const n = text.length;
  return (
    <p className="pl-1">
      {text}
      {n > 40 && <span className="ml-1 text-[10px] text-rose-500">({n}자 — 40자 넘음)</span>}
    </p>
  );
}

/** 개념도 — 1교시 3줄·2교시 5~6줄 크기(지침 2장·2교시 4-2). 누르면 원본 크기 */
function Figure({ srcs, lines, alt }: { srcs: string[]; lines: number; alt: string }) {
  if (!srcs.length) return <p className="pl-1"><Hole>교재 개념도를 {lines}줄 크기로 — 흑백 선·박스, 주제 박스만 강조, 그룹화 필수</Hole></p>;
  return (
    <div className="flex items-center justify-center gap-2" style={{ minHeight: lines * 28 }}>
      {srcs.map((src) => (
        <a key={src} href={src} target="_blank" rel="noreferrer" title="원본 크기로 보기" className="min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="max-w-full rounded border border-slate-500 bg-white object-contain" style={{ maxHeight: lines * 28 }} />
        </a>
      ))}
    </div>
  );
}

function TableBlock({ tb, hint }: { tb: Tb; hint?: string }) {
  return (
    <>
      <AnswerTable headers={tb.headers} rows={tb.rows} limits={cellLimits(tb.headers)} />
      <Gloss text={tb.gloss} hint={hint} />
    </>
  );
}

function Features({ f }: { f?: string[] }) {
  if (!f?.length) return <Hole>특징 3개 · 교재 원문 3~5자</Hole>;
  return <>{f.map((x, i) => `${i + 1}) ${x}`).join("  ")}</>;
}

/** 그래프형 결론 자리 — 축 이름·주제 곡선(강조)·값 라벨은 직접 채운다(지침 V34: 수치는 출처 확인된 것만) */
function GraphHole() {
  return (
    <svg viewBox="0 0 600 110" className="my-1 w-full max-w-[600px]" role="img" aria-label="결론 그래프 자리">
      <line x1="60" y1="90" x2="560" y2="90" stroke="#111" strokeWidth="1.3" />
      <line x1="60" y1="90" x2="60" y2="10" stroke="#111" strokeWidth="1.3" />
      <text x="560" y="105" fontSize="10" textAnchor="end" fill="#94a3b8" fontStyle="italic">〈가로축 — 시간·세대·부하〉</text>
      <text x="64" y="12" fontSize="10" fill="#94a3b8" fontStyle="italic">〈세로축 — 지연·처리량·규모〉</text>
      <path d="M70,80 L170,62 L270,70 L370,55 L470,63 L550,50" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M70,82 C200,70 300,40 550,22" fill="none" stroke="#d97706" strokeWidth="2.5" />
      <text x="470" y="62" fontSize="10" fill="#94a3b8" fontStyle="italic">〈기존〉</text>
      <text x="470" y="26" fontSize="10" fill="#b45309" fontWeight="700">〈주제★〉</text>
      <text x="300" y="44" fontSize="9.5" fill="#cbd5e1">값 라벨 2~3개</text>
    </svg>
  );
}

/** 토픽별 결론 내용이 있으면 도형 박스·제목을 그것으로 바꾼다 */
function concOf(cd: AnswerConclusion | undefined, base: Conclusion): Conclusion {
  if (!cd) return base;
  return {
    ...base,
    title: cd.concTitle,
    kind: cd.kind,
    ...(cd.form === "도형" && cd.boxes?.length
      ? {
          pattern: cd.pattern ?? base.pattern,
          boxes: cd.boxes.map((b) => ({ text: b.label, fill: true, role: b.role })),
          hi: cd.hi ?? 0,
          arrows: cd.arrows,
          group: cd.group,
        }
      : {}),
  };
}

function Closing({ c, hint, title, data }: { c: Conclusion; hint?: string; title: string; data?: AnswerConclusion }) {
  const [form, setForm] = useState<ConclusionForm>(() => pickForm(c, title));
  if (data) {
    // 결론 도식 — 개념도의 축약판(V36): 도형·그래프·리스트 중 토픽에 맞게 고른 것
    return (
      <>
        {data.form === "그래프" && data.graph ? (
          <ConclusionGraph g={data.graph} />
        ) : data.form === "리스트" && data.items?.length ? (
          <ConclusionList items={data.items} />
        ) : (
          <ConclusionFigure c={c} />
        )}
        <p className="flex justify-between pl-1">
          <span>
            {data.gloss}
            {data.gloss.length > 40 && <span className="ml-1 text-[10px] text-rose-500">({data.gloss.length}자 — 40자 넘음)</span>}
          </span>
          <b>끝</b>
        </p>
      </>
    );
  }
  return (
    <>
      {/* 결론 표현 — 도형·그래프·리스트 택1(V34). 표는 금지 */}
      <div className="flex flex-wrap items-center gap-1 text-[11px]">
        <span className="text-slate-400">표현:</span>
        {(["도형", "그래프", "리스트"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setForm(f)}
            className={`rounded-full px-2 py-0 leading-5 ${form === f ? "bg-slate-700 text-white" : "border border-slate-300 text-slate-500"}`}
          >
            {f}
          </button>
        ))}
      </div>
      {form === "도형" && <ConclusionFigure c={c} />}
      {form === "그래프" && <GraphHole />}
      {form === "리스트" && (
        <div className="pl-1">
          <p>
            1) <Hole>키워드 4~5자</Hole>: <Hole>근거 6~10자 · 차별화 요소 1</Hole>{"  "}2) <Hole>키워드</Hole>:{" "}
            <Hole>근거 · 차별화 요소 1</Hole>
          </p>
          <p>
            3) <Hole>키워드</Hole>: <Hole>근거 · 차별화 요소 1 (2~3항목, 2줄)</Hole>
          </p>
        </div>
      )}
      <p className="pl-1 text-[11.5px] leading-6">
        <Hole>
          차별화 단락 — 차별화 요소(최신 기술·표준 / 정량 수치 / 적용 사례 / 견해) 2개 이상, 2단락 재진술·「고려사항」 금지
        </Hole>
      </p>
      <p className="flex justify-between pl-1">
        <Hole>{hint ?? "결론 간글 — 한계 → 해법 → 효과 권장, 정량 수치·견해 1개 이상, 40자 이내"}</Hole>
        <b>끝</b>
      </p>
    </>
  );
}

/** 토픽 제목에서 두 개념 이름 — 「A와 B 비교」「A vs B」 */
function pairFromTitle(title: string): string[] {
  const t = title.replace(/\s*(의\s*)?비교.*$/, "").replace(/\s*\([^)]*\)/g, "");
  const m = t.split(/\s*(?:vs\.?|VS|와|과|\/|&|,)\s*/).filter(Boolean);
  return m.length >= 2 ? m.slice(0, 2) : [];
}

export default function AnswerTemplate({
  period,
  textbook,
  course,
  bare,
  ansTables,
  fullTables,
  diagrams,
  hand,
  diagramGloss,
  diagramLabel,
  hasSlide,
}: {
  period: 1 | 2;
  textbook: TextbookSubnote;
  /** CONTENTS 기준 과목 코드 */
  course: string;
  bare: string;
  ansTables: Tb[];
  fullTables: Tb[];
  diagrams: string[];
  hand: string[];
  diagramGloss?: string;
  diagramLabel: string;
  hasSlide: boolean;
}) {
  const pairs = textbook.defPair?.length ? textbook.defPair : [];
  const pairNames = pairs.length ? pairs.map((p) => p.name.replace(/\s*\([^)]*\)/g, "").trim()) : pairFromTitle(textbook.title);
  const lead = textbook.lead || bare;
  const figs = [...diagrams, ...hand];
  const verify = (
    <p className="mt-1 text-[11.5px] leading-6 text-slate-500">
      검증 출처: {hasSlide ? "교재 슬라이드 + 서브노트" : "서브노트"} / 검증 강도: {hasSlide ? "강" : "중"}
    </p>
  );

  /* ─────────────── 1교시 (V34, 26줄) ─────────────── */
  if (period === 1) {
    const shape = shape1(textbook.title, pairs.length);
    // 2단락 표 — 구조형(구성·동작·기법…) 먼저. 근거형은 개념도 없이 표만(지침 2장)
    const struct = ansTables.filter((t) => !isReasonTable(t.caption));
    const body = struct[0] ?? ansTables[0];
    const cd = conclusionFor(textbook.title);
    const c = concOf(cd, pickConclusion({ title: textbook.title, bare, course, pairs: pairNames, bodyCaption: body?.caption }));

    return (
      <AnswerPaper target={[26, 26]}>
        <p className="font-bold">답. {textbook.title}</p>

        {shape === "기본형" && (
          <>
            <p className="font-bold">1. {lead} 정의</p>
            <div className="pl-4">
              <p>가. 정의: {textbook.defShort || textbook.definition.replace(/\*\*/g, "")}</p>
              <p>
                나. 특징: <Features f={textbook.features} />
              </p>
              {textbook.subDefs?.map((s, i) => (
                <p key={s.name}>
                  {NO[i + 2]}. {s.name}: {s.def}
                </p>
              ))}
            </div>
            {body && !isReasonTable(body.caption) ? (
              <>
                <p className="font-bold">
                  2. {bare}의 {diagramLabel}와 {tableSubject(body.headers, body.caption)}
                </p>
                <div className="pl-4">
                  <p>가. {bare} {diagramLabel}</p>
                  <Figure srcs={figs} lines={3} alt={`${bare} ${diagramLabel}`} />
                  <Gloss text={diagramGloss} hint="그림 간글 — 핵심 차이·동작 한 줄, 40자 이내" />
                  <p>
                    나. {bare} {tableSubject(body.headers, body.caption)}
                  </p>
                  <TableBlock tb={body} hint={`표 간글 — 다음 단락(${c.title}) 관점 예고, 40자 이내`} />
                </div>
              </>
            ) : body ? (
              <>
                {/* 근거형 — 개념도·소제목 없이 표 + 간글 */}
                <p className="font-bold">2. {bare}의 {body.caption.split(" — ")[0]}</p>
                <div className="pl-4">
                  <TableBlock tb={body} />
                </div>
              </>
            ) : null}
            <p className="font-bold">
              3. {bare}의 {c.title}
            </p>
            <div className="pl-4">
              <Closing c={c} title={textbook.title} data={cd} />
            </div>
          </>
        )}

        {shape === "2항목형" && (
          <>
            <p className="font-bold">1. {lead} 정의</p>
            <div className="pl-4">
              {pairs.map((p, i) => (
                <div key={p.name}>
                  <p>
                    {NO[i]}. {p.name} 정의: {p.def}
                  </p>
                  <p className="pl-4">
                    특징: <Features f={p.features} />
                  </p>
                </div>
              ))}
            </div>
            {pairs.slice(0, 2).map((p, i) => {
              const tb = ansTables.length >= 2 ? ansTables[i] : i === 0 ? ansTables[0] : undefined;
              const name = pairNames[i];
              const last = i === 1 || ansTables.length < 2;
              if (!tb && i === 1) return null;
              const reason = tb && isReasonTable(tb.caption);
              return (
                <div key={p.name}>
                  <p className="font-bold">
                    {i + 2}. {ansTables.length >= 2 ? name : pairNames.join("와 ")}의{" "}
                    {reason ? tb!.caption.split(" — ")[0] : `${diagramLabel}와 ${tb ? tableSubject(tb.headers, tb.caption) : "구성요소"}`}
                  </p>
                  <div className="pl-4">
                    {!reason && (
                      <>
                        <p>가. {ansTables.length >= 2 ? name : bare} {diagramLabel}</p>
                        <Figure
                          srcs={figs.length >= 2 ? [figs[Math.min(i, figs.length - 1)]] : i === 0 ? figs : []}
                          lines={3}
                          alt={`${name} ${diagramLabel}`}
                        />
                        <Gloss text={i === 0 ? diagramGloss : undefined} hint="그림 간글 — 40자 이내" />
                        <p>나. {ansTables.length >= 2 ? name : bare} {tb ? tableSubject(tb.headers, tb.caption) : "구성요소"}</p>
                      </>
                    )}
                    {tb ? (
                      <AnswerTable headers={tb.headers} rows={tb.rows} limits={cellLimits(tb.headers)} />
                    ) : (
                      <p>
                        <Hole>3열 표 — 교재 표 헤더·분류·순서 그대로</Hole>
                      </p>
                    )}
                    {last ? (
                      // 2항목형 — 결론 그림 없이 마지막 간글이 결론 간글을 겸한다(지침 2장 2항목형 공통)
                      <p className="flex justify-between pl-1">
                        <span>
                          {tb?.gloss ?? ""}
                          {cd ? (
                            <span className="block">{cd.gloss}</span>
                          ) : (
                            <Hole>
                              마지막 간글 = 결론 간글 — 한계 → 해법 → 효과, 차별화 요소 2개 이상({c.title} 관점), 40자 이내
                            </Hole>
                          )}
                        </span>
                        <b>끝</b>
                      </p>
                    ) : (
                      <Gloss text={tb?.gloss} />
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {shape === "비교형" && (
          <>
            <p className="font-bold">1. {lead}, 개념 비교</p>
            <div className="pl-4">
              <p>가. {pairNames.join("·") || bare} 정의</p>
              {pairs.length ? (
                pairs.map((p) => (
                  <p key={p.name} className="pl-4">
                    - {p.name}: {p.def}
                  </p>
                ))
              ) : (
                <p className="pl-4">{textbook.defShort}</p>
              )}
              <p>나. {pairNames.join("·") || bare} 개념도</p>
              <Figure srcs={figs} lines={2} alt={`${bare} 개념도`} />
              <Gloss text={diagramGloss} />
            </div>
            <p className="font-bold">2. {pairNames.join("와 ") || bare} 상세 비교</p>
            <div className="pl-4">
              {(() => {
                const cmp =
                  ansTables.find((t) => /비교/.test(t.caption)) ??
                  fullTables.find((t) => /비교/.test(t.caption)) ??
                  ansTables[0];
                return cmp ? (
                  <TableBlock tb={cmp} hint={`표 간글 — ${c.title} 관점 예고, 40자 이내`} />
                ) : (
                  <p>
                    <Hole>비교표 「항목 | A | B」 14줄 + 간글</Hole>
                  </p>
                );
              })()}
            </div>
            <p className="font-bold">
              3. {pairNames.join("·") || bare} {c.title}
            </p>
            <div className="pl-4">
              <Closing c={c} title={textbook.title} data={cd} />
            </div>
          </>
        )}

        {verify}
        <p className="text-[11.5px] leading-6 text-slate-500">
          결론 선택: {shape === "2항목형" ? `2항목형 마지막 간글 (${c.kind} → ${c.title} 관점)` : `${c.kind} → ${c.title}`} / 차별화:{" "}
          {cd ? (
            // 결론 선택 줄은 차별화 요소 이름만(「표준·사례」) — 자세한 내용은 마우스를 올려 본다
            <span title={cd.diff.join("\n")}>{Array.from(new Set(cd.diff.map((d) => d.split(/[:：(—]/)[0].trim()))).join("·")}</span>
          ) : (
            <Hole>최신 기술·표준 / 정량 수치 / 적용 사례 / 견해 중 2개</Hole>
          )}
        </p>
        {cd && (
          <p className="text-[11px] leading-6 text-slate-400">결론 근거: {cd.sources.join(" · ")}</p>
        )}
      </AnswerPaper>
    );
  }

  /* ─────────────── 2교시 (4단락, 66~77줄) ─────────────── */
  const s2 = shape2(textbook.title, course, fullTables.map((t) => t.caption));
  const body = fullTables.find((t) => !isReasonTable(t.caption)) ?? fullTables[0];
  const rest = fullTables.filter((t) => t !== body);
  const closeNo = s2.no === 3 ? 11 : s2.no === 1 ? 13 : 12;
  const base = pickConclusion({ title: textbook.title, bare, course, pairs: pairNames, bodyCaption: body?.caption });
  // 2교시 결론은 고정 어휘 4종(2교시 13.2) — 발전 방향·활용 방안·융합 방안·도입 제언
  const cd2 = conclusionFor(textbook.title);
  const c2 = concOf(cd2, closeNo === base.no ? base : conclusionOf(closeNo, { bare, pairs: pairNames, kind: s2.name }));

  return (
    <AnswerPaper target={[66, 77]} pageLines={22}>
      <p className="font-bold">
        문) {textbook.title}에 대하여 설명하시오. <Hole>지문 1~2줄 요약 · 물어본 항목 나열</Hole>
      </p>

      {/* Ⅰ. 서론 — 6타입 중 유형별(2교시 §10) */}
      {s2.no === 6 ? (
        <>
          <p className="mt-1 font-bold">Ⅰ. {bare}의 필요성·중요성</p>
          <div className="pl-4">
            <p>
              <Hole>필요성 그림 4~5줄 — 억지 정의 금지(서론 Type Ⅲ)</Hole>
            </p>
            <Gloss text={textbook.defShort} hint="그림 간글 — 정의는 간글 2줄 옵션" />
          </div>
        </>
      ) : s2.no === 4 ? (
        <>
          <p className="mt-1 font-bold">Ⅰ. {bare}의 발전단계</p>
          <div className="pl-4">
            <p>
              <Hole>발전 흐름 그림 4~5줄 — 그룹화 + 방향성(서론 Type Ⅵ)</Hole>
            </p>
            <Gloss />
            <p>정의: {textbook.defShort}</p>
          </div>
        </>
      ) : (
        <>
          <p className="mt-1 font-bold">Ⅰ. {lead}의 개념</p>
          <div className="pl-4">
            <p>가. {bare}의 정의</p>
            {pairs.length ? (
              pairs.map((p) => (
                <p key={p.name} className="pl-4">
                  - {p.name}: {p.def}
                </p>
              ))
            ) : (
              <p className="pl-4">{textbook.defShort}</p>
            )}
            <p>나. {bare}의 특징</p>
            <AnswerTable
              headers={["구분", "특징", "설명"]}
              rows={(textbook.features?.length ? textbook.features : ["", "", "", ""]).slice(0, 4).map((f) => ["○○ 측면", f, ""])}
            />
            <Gloss hint="표 간글 — 40자 이내 (1열 「○○ 측면」·3열 설명은 직접 채운다)" />
          </div>
        </>
      )}

      {/* Ⅱ. 본론 1 — 개념도 + 구성요소(구조형) */}
      {body && (
        <>
          <p className="mt-7 font-bold">
            Ⅱ. {bare}의 {diagramLabel}와 {tableSubject(body.headers, body.caption)}
          </p>
          <div className="pl-4">
            <p>가. {bare} {diagramLabel}</p>
            <Figure srcs={figs} lines={6} alt={`${bare} ${diagramLabel}`} />
            <Gloss text={diagramGloss} />
            <p>
              나. {bare} {tableSubject(body.headers, body.caption)}
            </p>
            <TableBlock tb={body} />
          </div>
        </>
      )}

      {/* Ⅲ. 본론 2 — 승부처: 물어본 것 100%, 표 2~3개 */}
      <p className="mt-7 font-bold">
        Ⅲ. {bare}의 {rest[0] ? rest[0].caption.split(" — ")[0] : "요구사항"}
        {rest.length > 1 ? " 등" : ""} <Hole>승부처 — 물어본 지문 그대로</Hole>
      </p>
      <div className="pl-4">
        {rest.slice(0, 4).map((tb, i) => (
          <div key={tb.caption}>
            <p>
              {NO[i]}. {tb.caption}
            </p>
            <TableBlock tb={tb} />
          </div>
        ))}
        {Array.from({ length: Math.max(0, 3 - rest.length) }, (_, i) => (
          <p key={i}>
            {NO[rest.length + i]}. <Hole>요구 항목 — 3열 표 4행 + 간글(근거형은 「구분 | 묻는 말 | 설명」)</Hole>
          </p>
        ))}
      </div>

      {/* Ⅳ. 결론 — 콘텐츠 카드 표 + 결론 4박스 그림 + 결론 간글 */}
      <p className="mt-7 font-bold">
        Ⅳ. {bare}의 {c2.title}
      </p>
      <div className="pl-4">
        <p className="text-[12px] text-slate-500">콘텐츠 카드 — {s2.card.name}</p>
        <AnswerTable headers={s2.card.headers} rows={[0, 1, 2, 3].map(() => ["", "", ""])} />
        <Gloss />
        {!!textbook.notes?.length && (
          <div className="text-[12px] leading-6 text-slate-500">
            <span className="font-semibold">교재 메모(카드·결론 재료)</span>
            {textbook.notes.map((n, i) => (
              <p key={i}>· {n}</p>
            ))}
          </div>
        )}
        <Closing c={c2} title={textbook.title} data={cd2} />
      </div>
      {verify}
      <p className="text-[11.5px] leading-6 text-slate-500">
        문제 유형: {s2.name}(서론 Type {s2.intro}) · 결론: {c2.title}
      </p>
    </AnswerPaper>
  );
}
