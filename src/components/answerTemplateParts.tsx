"use client";

/**
 * 토픽 답안지 템플릿의 조각 — 빈칸 안내·간글·그림·표·정의 칸·결론 단락.
 * AnswerTemplate.tsx(788줄)에서 떼어 냈다(2026-11-20). 틀(단락 차례)은 AnswerTemplate.tsx, 2교시 소제목 고르기는 lib/askTemplate.ts.
 */
import { useState, type ReactNode } from "react";
import AnswerTable from "@/components/AnswerTable";
import ConceptDiagram from "@/components/ConceptDiagram";
import ConclusionFigure from "@/components/ConclusionFigure";
import ConclusionGraph from "@/components/ConclusionGraph";
import ConclusionList from "@/components/ConclusionList";
import type { AnswerConclusion } from "@/data/answerConclusions";
import type { ConceptSpec } from "@/data/conceptDiagrams";
import { cellLimits, pickForm, type Conclusion, type ConclusionForm } from "@/lib/answerGuide";
import type { Tb } from "@/lib/askTemplate";

export const NO = ["가", "나", "다", "라", "마", "바"];

/** 빈칸 안내 — 템플릿이 지어 넣지 않는 자리 */
export function Hole({ children }: { children: ReactNode }) {
  return <span className="text-slate-400">({children})</span>;
}

/** 간글 1줄 — 공백 포함 40자 넘으면 표시(지침 4장 간글 길이 상한) */
export function Gloss({ text, hint = "간글 1줄 · 공백 포함 40자 이내" }: { text?: string; hint?: string }) {
  if (!text) return <p className="pl-1"><Hole>{hint}</Hole></p>;
  const n = text.length;
  return (
    <p className="pl-1">
      {text}
      {n > 40 && <span className="ml-1 text-[10px] text-rose-500">({n}자 — 40자 넘음)</span>}
    </p>
  );
}

/**
 * 개념도 — 1교시 3줄·2교시 5~6줄 크기(지침 2장·2교시 4-2).
 * 사양(conceptDiagrams)이 있으면 교재 그림을 보고 다시 그린 흑백 도식(ConceptDiagram)을 싣고,
 * 교재에서 잘라 낸 그림은 「교재 그림」 단추로 참고만 한다. 사양이 없으면 잘라 낸 그림(누르면 원본 크기).
 */
export function Figure({ srcs, lines, alt, spec }: { srcs: string[]; lines: number; alt: string; spec?: ConceptSpec }) {
  const [book, setBook] = useState(false);
  const imgs = (h: number) => (
    <div className="flex items-center justify-center gap-2" style={{ minHeight: h }}>
      {srcs.map((src) => (
        <a key={src} href={src} target="_blank" rel="noreferrer" title="원본 크기로 보기" className="min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="max-w-full rounded border border-slate-500 bg-white object-contain" style={{ maxHeight: h }} />
        </a>
      ))}
    </div>
  );
  if (spec)
    return (
      <div className="relative">
        <ConceptDiagram spec={spec} />
        {srcs.length > 0 && (
          <button
            type="button"
            onClick={() => setBook((v) => !v)}
            className="absolute -top-6 right-0 rounded border border-slate-300 bg-white px-1.5 text-[10.5px] leading-5 text-slate-500 hover:bg-slate-50"
            title="이 그림을 그릴 때 참고한 교재 그림"
          >
            {book ? "교재 그림 닫기" : "📖 교재 그림"}
          </button>
        )}
        {book && <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-1">{imgs(lines * 56)}</div>}
      </div>
    );
  if (!srcs.length) return <p className="pl-1"><Hole>교재 개념도를 {lines}줄 크기로 — 흑백 선·박스, 주제 박스만 강조, 그룹화 필수</Hole></p>;
  return imgs(lines * 28);
}

export function TableBlock({ tb, hint }: { tb: Tb; hint?: string }) {
  return (
    <>
      <AnswerTable headers={tb.headers} rows={tb.rows} limits={cellLimits(tb.headers)} />
      <Gloss text={tb.gloss} hint={hint} />
    </>
  );
}

/**
 * 1단락 정의·특징 2열 표(지침 V37) — 헤더 없이 왼쪽 「정의」「특징」(두 개념이면 개념 이름), 오른쪽 내용.
 * 3열 표·글자 수 규칙의 예외라 「- 」도 붙이지 않는다.
 */
export function DefTable({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <table className="my-0.5 w-full border-collapse text-[12.5px]">
      <tbody>
        {rows.map(([k, v], i) => (
          <tr key={i}>
            <td className="w-[16%] border border-slate-600 px-2 py-0 text-center align-middle font-semibold leading-[27px]">{k}</td>
            <td className="border border-slate-600 px-2 py-0 leading-[27px]">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Features({ f }: { f?: string[] }) {
  if (!f?.length) return <Hole>특징 3개 · 교재 원문 3~5자</Hole>;
  return <>{f.map((x, i) => `${i + 1}) ${x}`).join("  ")}</>;
}

/**
 * 하위·짝 개념 정의 칸 — 정의 줄 + 「특징) 1) 2) 3)」 줄.
 * 2026-10-29 "각자를 설명하라고. 특징까지 넣고"(CWPP & CSPM) — 두 개념 토픽도 개념마다 특징을 단다(지침 V37 의 「특징 행 없음」을 사용자 요청으로 바꿈).
 */
export function DefCell({ def, features }: { def: string; features?: string[] }) {
  return (
    <>
      {def}
      {features?.length ? (
        <>
          <br />
          특징) <Features f={features} />
        </>
      ) : null}
    </>
  );
}

export const GANADA = "가나다라마바사";

/**
 * 두 개념 정의 — 개념마다 리드문 소제목 「가. {lead}, {이름} 정의」 + 정의·특징 표.
 * 2026-10-29 "리드문도 분리해줄래?" — 토픽 리드문 하나(「클라우드 보안의 두 축」) 아래 두 개념을 한 표에 몰아 두었었다.
 */
export function PairDefs({ pairs, names, from = 0 }: { pairs: { name: string; def: string; lead?: string; features?: string[] }[]; names: string[]; from?: number }) {
  return (
    <>
      {pairs.map((p, i) => (
        <div key={p.name}>
          <p>
            {GANADA[from + i]}. {p.lead ? `${p.lead}, ` : ""}
            {names[i] ?? p.name} 정의
          </p>
          <DefTable
            rows={[
              ["정의", p.def],
              ["특징", <Features key="f" f={p.features} />],
            ]}
          />
        </div>
      ))}
    </>
  );
}

/** 2교시 서론의 개념별 정의·특징 줄 */
export function PairLines({ pairs }: { pairs: { name: string; def: string; features?: string[] }[] }) {
  return (
    <>
      {pairs.map((p) => (
        <div key={p.name}>
          <p>
            - {p.name.replace(/\s*\([^)]*\)/g, "")}: {p.def}
          </p>
          {p.features?.length ? (
            <p className="pl-4">
              특징) <Features f={p.features} />
            </p>
          ) : null}
        </div>
      ))}
    </>
  );
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
export function concOf(cd: AnswerConclusion | undefined, base: Conclusion): Conclusion {
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

export function Closing({ c, hint, title, data }: { c: Conclusion; hint?: string; title: string; data?: AnswerConclusion }) {
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
