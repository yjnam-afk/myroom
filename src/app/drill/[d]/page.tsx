import Link from "next/link";
import { notFound } from "next/navigation";
import { DOMAINS } from "@/lib/domains";
import { drillCards, type DrillCard, type DrillSlot } from "@/lib/drillCard";
import { explainHref, commuteHref } from "@/lib/links";
import PriorityBadge from "@/components/PriorityBadge";
import ConceptDiagram from "@/components/ConceptDiagram";
import { Timer, Done } from "../DrillClient";

/** 과목마다 한 쪽 — 빌드할 때 13쪽을 미리 만든다 */
export function generateStaticParams() {
  return DOMAINS.map((d) => ({ d: d.code }));
}
export const dynamicParams = false;

const NONE = <span className="text-slate-400">교재에 없음</span>;

function Slots({ slots }: { slots: DrillSlot[] }) {
  if (!slots.length) return NONE;
  return (
    <div className="space-y-1">
      {slots.map((s, i) => (
        <p key={i}>
          {s.label && <span className="mr-1.5 text-[12px] font-semibold text-slate-500">{s.label}</span>}
          {s.items.join(" · ")}
        </p>
      ))}
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-t border-slate-100 py-2 first:border-0">
      <span className="w-16 shrink-0 pt-0.5 text-[12px] font-bold text-slate-500">{k}</span>
      <div className="min-w-0 flex-1 text-[15px] leading-7 text-slate-800">{children}</div>
    </div>
  );
}

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-bold text-slate-900">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] text-white">{n}</span>
        {title}
        {hint && <span className="text-[12px] font-normal text-slate-400">{hint}</span>}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Card({ c, code }: { c: DrillCard; code: string }) {
  return (
    <section id={c.id} className="scroll-mt-16">
      {c.newArea && <h2 className="mb-3 mt-12 border-b-2 border-slate-900 pb-1 text-sm font-bold tracking-wide text-slate-900">{c.area}</h2>}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold leading-snug text-slate-900">{c.title}</h3>
          <PriorityBadge p={c.priority} />
          <span className="text-[11px] text-slate-400">{c.group}</span>
        </div>
        {!c.ready ? (
          <p className="mt-2 text-sm text-slate-400">교재 정리 전인 토픽입니다.</p>
        ) : (
          <>
            {/* 1. 키워드 한 장 — 정의 · 구성요소 · 특징 · 장단점 · 적용 사례 */}
            <Step n={1} title="키워드 한 장" hint="같은 틀로 — 정의 · 구성요소 · 특징 · 장단점 · 적용 사례">
              {c.keywords.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {c.keywords.map((k) => (
                    <span key={k} className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[13px] font-semibold text-rose-800">
                      {k}
                    </span>
                  ))}
                  {c.mnemonic && <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[13px] font-bold text-white">두음 {c.mnemonic}</span>}
                </div>
              )}
              <div className="rounded-xl bg-slate-50 px-3">
                <Row k="정의">
                  {c.concepts.length > 0 ? (
                    <div className="space-y-1">
                      {c.concepts.map((x) => (
                        <p key={x.name}>
                          <span className="font-semibold text-slate-900">{x.name}</span> — {x.def}
                        </p>
                      ))}
                    </div>
                  ) : (
                    c.def || NONE
                  )}
                </Row>
                <Row k="구성요소">
                  <Slots slots={c.parts} />
                  {c.partsFrom && c.parts.length > 0 && <p className="text-[11px] text-slate-400">교재 표 「{c.partsFrom}」</p>}
                </Row>
                <Row k="특징">{c.features.length ? c.features.join(" · ") : NONE}</Row>
                <Row k="장단점">
                  <Slots slots={c.pros} />
                </Row>
                <Row k="적용 사례">
                  <Slots slots={c.uses} />
                </Row>
              </div>
            </Step>

            {/* 2. 도식화 — 백지에 먼저 그리고 펼쳐서 견준다 */}
            <Step n={2} title="도식화 연습" hint="키워드를 보며 백지에 먼저 그려 보기">
              {c.frame && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-[14px] leading-6 text-amber-950">
                  <span className="mr-1.5 rounded-full border border-amber-300 bg-white px-1.5 py-0.5 text-[11px] font-bold">
                    {c.frame.code} {c.frame.name}
                  </span>
                  {c.frame.fixed}
                  {c.frame.slot && <span className="mt-1 block text-[13px] text-amber-900">들어갈 것 — {c.frame.slot}</span>}
                </p>
              )}
              {c.hand.length + c.specs.length + c.book.length > 0 ? (
                <details className="mt-2 rounded-xl border border-slate-200 px-3 py-2">
                  <summary className="cursor-pointer text-[13px] font-semibold text-brand-700">그린 뒤 펼쳐서 견주기</summary>
                  <div className="mt-2 space-y-3">
                    {c.hand.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt={`${c.title} 손글씨 개념도`} loading="lazy" className="max-h-72 max-w-full rounded-xl border border-slate-200 bg-white object-contain" />
                    ))}
                    {c.specs.map((s, i) => (
                      <div key={i} className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2">
                        <ConceptDiagram spec={s} />
                      </div>
                    ))}
                    {c.book.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt={`${c.title} 교재 그림`} loading="lazy" className="max-w-full rounded-xl border border-slate-200 bg-white" />
                    ))}
                  </div>
                </details>
              ) : (
                <p className="mt-2 text-[13px] text-slate-400">견줄 그림이 아직 없습니다.</p>
              )}
            </Step>

            {/* 3. 목차와 도식만 빠르게 */}
            <Step n={3} title="목차와 도식만 빠르게 쓰기" hint="답안 전체가 아니라 목차 + 그림 하나, 5~10분">
              {c.questions.length > 0 ? (
                <ul className="space-y-1.5">
                  {c.questions.map((q, i) => (
                    <li key={i} className="rounded-xl border border-slate-200 px-3 py-2 text-[15px] leading-7 text-slate-800">
                      <span className="mr-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-600">{q.long ? "서술형" : "1교시형"}</span>
                      <span className="whitespace-pre-line">{q.text}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        {q.where}
                        {q.n > 1 ? ` 외 ${q.n - 1}번` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-xl border border-slate-200 px-3 py-2 text-[15px] text-slate-800">문) {c.title.replace(/\s*\(.*$/, "")}에 대하여 설명하시오.</p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <Timer />
                <Done code={code} id={c.id} />
              </div>
              {c.outline.length > 0 && (
                <details className="mt-2 rounded-xl border border-slate-200 px-3 py-2">
                  <summary className="cursor-pointer text-[13px] font-semibold text-brand-700">쓴 뒤 펼쳐서 목차 견주기</summary>
                  <ol className="mt-2 space-y-1.5">
                    {c.outline.map((o, i) => (
                      <li key={i} className="text-[14px] leading-6 text-slate-800">
                        <span className="font-semibold text-slate-900">
                          {i + 1}. {o.caption}
                        </span>
                        <span className="block pl-4 text-slate-600">{o.items.join(" / ")}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </Step>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <Link href={explainHref(c.title)} className="text-brand-700 hover:underline">
                💡 토픽 설명·답안지 템플릿 →
              </Link>
              <Link href={commuteHref(code, c.title)} className="text-slate-500 hover:underline">
                🚇 풀어 쓴 설명 읽기 →
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export default function DrillSubject({ params }: { params: { d: string } }) {
  const dom = DOMAINS.find((x) => x.code === params.d);
  if (!dom) notFound();
  const cards = drillCards(dom.code);
  const i = DOMAINS.findIndex((x) => x.code === dom.code);
  const nextDom = DOMAINS[(i + 1) % DOMAINS.length];
  return (
    <article className="mx-auto max-w-2xl break-keep pb-16">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Link href="/drill" className="text-brand-600 hover:underline">
          ← 암기 연습
        </Link>
        <h1 className="text-lg font-bold text-slate-900">✏️ {dom.label}</h1>
        <span className="text-xs text-slate-400">{cards.length}토픽 · 토픽 지도 차례</span>
      </div>
      <p className="mb-2 text-xs leading-relaxed text-slate-500">토픽마다 ① 키워드 한 장을 읽고 ② 그림을 백지에 그린 뒤 펼쳐 견주고 ③ 문제 하나에 목차와 도식만 5~10분 안에 씁니다.</p>
      {cards.map((c) => (
        <Card key={c.id} c={c} code={dom.code} />
      ))}
      <Link href={`/drill/${nextDom.code}`} className="mt-8 block rounded-2xl bg-slate-900 px-5 py-4 text-center text-base font-bold text-white">
        {dom.label} 끝 — 다음 과목 {nextDom.label} →
      </Link>
    </article>
  );
}
