"use client";

import type { ReactNode } from "react";
import AnswerPaper from "@/components/AnswerPaper";
import AnswerTable from "@/components/AnswerTable";
import { conclusionFor } from "@/data/answerConclusions";
import { conceptFor } from "@/data/conceptDiagrams";
import type { TextbookSubnote } from "@/data/textbookSubnotes";
import type { AskFreq } from "@/lib/askFreq";
import {
  cellLimits,
  conclusionOf,
  isReasonTable,
  pickConclusion,
  shape1,
  shape2,
  tableSubject,
} from "@/lib/answerGuide";

import { askHead, askHole, askQuestion, pairFromTitle, tableForAsk, type Tb } from "@/lib/askTemplate";
import { Closing, DefCell, DefTable, Features, Figure, GANADA, Gloss, Hole, NO, PairDefs, PairLines, TableBlock, concOf } from "@/components/answerTemplateParts";

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
  asks,
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
  /** 2교시형 뼈대 — 이 토픽 서술형 지문의 빈출 요구(askFreq) + 지문들 */
  asks?: AskFreq & { texts: string[] };
}) {
  const pairs = textbook.defPair?.length ? textbook.defPair : [];
  const pairNames = pairs.length ? pairs.map((p) => p.name.replace(/\s*\([^)]*\)/g, "").trim()) : pairFromTitle(textbook.title);
  const lead = textbook.lead || bare;
  const figs = [...diagrams, ...hand];
  // 다시 그린 개념도 — 두 개념 토픽은 [A, B]
  const specs = conceptFor(textbook.title);
  const gl = (i = 0) => specs[i]?.gloss ?? diagramGloss;
  const verify = (
    <p className="mt-1 text-[11.5px] leading-6 text-slate-500">
      검증 출처: {hasSlide ? "교재 슬라이드 + 서브노트" : "서브노트"} / 검증 강도: {hasSlide ? "강" : "중"}
    </p>
  );

  /* ─────────────── 1교시 (V37, 26~28줄) ─────────────── */
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
              <DefTable
                rows={[
                  ["정의", textbook.defShort || textbook.definition.replace(/\*\*/g, "")],
                  ["특징", <Features key="f" f={textbook.features} />],
                  // 하위 개념도 정의 + 특징 줄(2026-10-26 — "혼돈과 확산 각각 정의 특징도 적어줘")
                  ...(textbook.subDefs ?? []).map((sd): [string, ReactNode] => [
                    sd.name.replace(/\s*\([^)]*\)/g, ""),
                    <DefCell key={sd.name} def={sd.def} features={sd.features} />,
                  ]),
                ]}
              />
            </div>
            {body && !isReasonTable(body.caption) ? (
              <>
                <p className="font-bold">
                  2. {bare}의 {diagramLabel}와 {tableSubject(body.headers, body.caption)}
                </p>
                <div className="pl-4">
                  <p>가. {bare} {diagramLabel}</p>
                  <Figure srcs={figs} lines={3} alt={`${bare} ${diagramLabel}`} spec={specs[0]} />
                  <Gloss text={gl()} hint="그림 간글 — 핵심 차이·동작 한 줄, 40자 이내" />
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
            <p className="font-bold">1. {pairNames.join("와 ")}의 정의</p>
            <div className="pl-4">
              {/* 두 개념 — 개념마다 리드문·정의·특징(2026-10-29 사용자 요청으로 V37 「한 표·특징 행 생략」을 바꿈) */}
              <PairDefs pairs={pairs} names={pairNames} />
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
                          spec={specs.length >= 2 ? specs[i] : i === 0 ? specs[0] : undefined}
                        />
                        <Gloss text={specs.length >= 2 ? specs[i]?.gloss : i === 0 ? gl() : undefined} hint="그림 간글 — 40자 이내" />
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
              {pairs.length ? (
                <PairDefs pairs={pairs} names={pairNames} />
              ) : (
                <>
                  <p>가. {pairNames.join("·") || bare} 정의</p>
                  <DefTable rows={[["정의", textbook.defShort]]} />
                </>
              )}
              <p>
                {GANADA[pairs.length || 1]}. {pairNames.join("·") || bare} 개념도
              </p>
              <Figure srcs={figs} lines={2} alt={`${bare} 개념도`} spec={specs[0]} />
              <Gloss text={gl()} />
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
  // 빈출 뼈대 — Ⅱ = 빈출 1, Ⅲ 가·나 = 빈출 2·3, 다 = 지문 추가 요구. 서술형 기록이 없으면 교재 표 순서대로
  const top = asks?.top ?? [];
  const used = new Set<Tb>();
  const secs = top.map((it) => {
    const tb = tableForAsk(it, fullTables, used);
    if (tb) used.add(tb);
    return { it, head: askHead(it, bare), tb };
  });
  const qText = top.length ? askQuestion(asks?.texts ?? [], top) : undefined;
  const closeNo = s2.no === 3 ? 11 : s2.no === 1 ? 13 : 12;
  const base = pickConclusion({ title: textbook.title, bare, course, pairs: pairNames, bodyCaption: body?.caption });
  // 2교시 결론은 고정 어휘 4종(2교시 13.2) — 발전 방향·활용 방안·융합 방안·도입 제언
  const cd2 = conclusionFor(textbook.title);
  const c2 = concOf(cd2, closeNo === base.no ? base : conclusionOf(closeNo, { bare, pairs: pairNames, kind: s2.name }));

  return (
    <AnswerPaper target={[66, 77]} pageLines={22}>
      {top.length > 0 && (
        <div className="mb-1 rounded-md border border-emerald-200 bg-emerald-50/60 px-2 py-1 text-[11.5px] leading-5 text-emerald-900">
          <b>📊 2교시 빈출</b> — 이 토픽 서술형 {asks?.total}문항에서 자주 물은 것
          {secs.map((x, i) => (
            <span key={i} className="ml-1.5">
              {"①②③"[i]} {x.head} <b>{x.it.n}회</b>
            </span>
          ))}
          <span className="ml-1.5 text-emerald-700/70">→ Ⅱ·Ⅲ 소제목</span>
        </div>
      )}
      <p className="font-bold">
        문) {qText ? qText.slice(0, 220) + (qText.length > 220 ? "…" : "") : `${textbook.title}에 대하여 설명하시오.`}{" "}
        {!qText && <Hole>지문 1~2줄 요약 · 물어본 항목 나열</Hole>}
      </p>

      {/* Ⅰ. 서론 — 6타입 중 유형별(2교시 §10) */}
      {s2.no === 6 ? (
        <>
          <p className="mt-1 font-bold">Ⅰ. {bare}의 필요성·중요성</p>
          <div className="pl-4">
            <p>
              <Hole>필요성 그림 4~5줄 — 억지 정의 금지(서론 Type Ⅲ)</Hole>
            </p>
            {/* 두 개념 토픽은 합친 한 줄 대신 개념마다 정의(2026-10-29 — CWPP & CSPM "각각 정의도") */}
            {pairs.length ? (
              <>
                <Gloss hint="그림 간글 — 40자 이내" />
                <PairLines pairs={pairs} />
              </>
            ) : (
              <Gloss text={textbook.defShort} hint="그림 간글 — 정의는 간글 2줄 옵션" />
            )}
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
            {pairs.length ? (
              <PairLines pairs={pairs} />
            ) : (
              <p>정의: {textbook.defShort}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="mt-1 font-bold">Ⅰ. {lead}의 개념</p>
          <div className="pl-4">
            <p>가. {bare}의 정의</p>
            {pairs.length ? (
              <div className="pl-4">
                <PairLines pairs={pairs} />
              </div>
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

      {secs.length > 0 ? (
        <>
          {/* Ⅱ. 본론 1 — 빈출 1위 + 개념도 */}
          <p className="mt-7 font-bold">
            Ⅱ. {bare}의 {secs[0].head}
          </p>
          <div className="pl-4">
            <p>가. {bare} {diagramLabel}</p>
            <Figure srcs={figs} lines={6} alt={`${bare} ${diagramLabel}`} spec={specs[0]} />
            <Gloss text={gl()} />
            <p>나. {secs[0].head}</p>
            {secs[0].tb ? <TableBlock tb={secs[0].tb} /> : <p><Hole>{askHole(secs[0].it)}</Hole></p>}
          </div>

          {/* Ⅲ. 본론 2 — 승부처: 빈출 2·3위 + 이번 지문이 더 물은 것 */}
          <p className="mt-7 font-bold">
            Ⅲ. {bare}의 {secs.slice(1).map((x) => x.head).join("와 ") || "요구사항"}{" "}
            <Hole>승부처 — 물어본 지문 그대로</Hole>
          </p>
          <div className="pl-4">
            {secs.slice(1).map((x, i) => (
              <div key={x.head}>
                <p>
                  {NO[i]}. {x.head}
                </p>
                {x.tb ? <TableBlock tb={x.tb} /> : <p className="pl-4"><Hole>{askHole(x.it)}</Hole></p>}
              </div>
            ))}
            <p>
              {NO[secs.length - 1]}. <Hole>이번 지문이 더 물은 항목 — 3열 표 4행 + 간글</Hole>
            </p>
          </div>
        </>
      ) : (
        <>
      {/* Ⅱ. 본론 1 — 개념도 + 구성요소(구조형) */}
        {body && (
          <>
            <p className="mt-7 font-bold">
              Ⅱ. {bare}의 {diagramLabel}와 {tableSubject(body.headers, body.caption)}
            </p>
            <div className="pl-4">
              <p>가. {bare} {diagramLabel}</p>
              <Figure srcs={figs} lines={6} alt={`${bare} ${diagramLabel}`} spec={specs[0]} />
              <Gloss text={gl()} />
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
        </>
      )}

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
