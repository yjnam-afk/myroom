import Link from "next/link";
import { notFound } from "next/navigation";
import { DOMAINS } from "@/lib/domains";
import { readFlow, type FlowBlock } from "@/lib/readFlow";
import { explainHref } from "@/lib/links";
import PriorityBadge from "@/components/PriorityBadge";
import ReadTracker from "../ReadTracker";

/** 과목마다 한 쪽 — 빌드할 때 13쪽을 미리 만들어 둔다(지하철에서 통신이 약해도 바로 뜬다) */
export function generateStaticParams() {
  return DOMAINS.map((d) => ({ d: d.code }));
}
export const dynamicParams = false;

/** 교재 정의의 **강조** 표시를 굵게 */
function Bold({ text }: { text: string }) {
  const parts = text.split("**");
  return <>{parts.map((p, i) => (i % 2 ? <strong key={i} className="text-slate-900">{p}</strong> : <span key={i}>{p}</span>))}</>;
}

function Block({ b, next }: { b: FlowBlock; next?: FlowBlock }) {
  return (
    <section id={b.id} className="scroll-mt-16">
      {b.newArea && <h2 className="mb-1 mt-12 border-b-2 border-slate-900 pb-1 text-sm font-bold tracking-wide text-slate-900">{b.area}</h2>}
      {b.newGroup && <p className="mb-5 mt-3 text-xs font-semibold text-slate-400">— {b.group}</p>}
      {b.from && (
        <p className="mb-2 text-sm text-brand-700">
          ↳ <span className="font-semibold">{b.from.parent.replace(/\s*\(.*$/, "")}</span>의 {b.from.rel} — {b.from.why}
        </p>
      )}
      <h3 className="flex flex-wrap items-center gap-2 text-xl font-bold leading-snug text-slate-900">
        {b.title}
        <PriorityBadge p={b.priority} />
      </h3>
      {b.why && (
        <p className="mt-3 border-l-4 border-amber-300 pl-3 text-[16px] leading-8 text-slate-800">
          <span className="mr-1.5 text-xs font-bold text-amber-700">왜 있나</span>
          {b.why}
        </p>
      )}
      {b.def ? (
        <p className="mt-3 text-[17px] leading-8 text-slate-800">
          {b.why && <span className="mr-1.5 text-xs font-bold text-slate-400">정의</span>}
          <Bold text={b.def} />
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-400">교재 정리 전인 토픽입니다.</p>
      )}
      {b.features.length > 0 && b.concepts.length === 0 && (
        <p className="mt-1 text-[15px] leading-7 text-slate-600">
          <span className="font-semibold text-slate-500">특징</span> {b.features.join(" · ")}
        </p>
      )}
      {b.concepts.map((c) => (
        <p key={c.name} className="mt-2 text-[16px] leading-8 text-slate-800">
          <span className="font-bold text-slate-900">{c.name}</span> — {c.def}
          {c.features?.length ? <span className="text-[15px] text-slate-600"> ({c.features.join(" · ")})</span> : null}
        </p>
      ))}
      {b.diagrams.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {b.diagrams.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt={`${b.title} 손글씨 개념도`} loading="lazy" className="max-h-56 max-w-full rounded-xl border border-slate-200 bg-white object-contain" />
          ))}
        </div>
      )}
      {b.paras.map((p, i) => (
        <div key={i} className="mt-5">
          <p className="text-[15px] font-bold text-brand-800">{p.caption}</p>
          {p.gloss && <p className="mt-0.5 text-[15px] leading-7 text-slate-600">{p.gloss}</p>}
          <ul className="mt-1 space-y-1">
            {p.lines.map((l, k) => (
              <li key={k} className="text-[16px] leading-8 text-slate-800">
                {l.head ? <span className="font-semibold text-slate-900">{l.head}</span> : null}
                {l.head && l.body ? <span className="text-slate-400"> — </span> : null}
                {l.body}
                {l.items?.length ? (
                  <ul className="ml-3 border-l-2 border-slate-200 pl-3">
                    {l.items.map((it, m) => (
                      <li key={m}>{it}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="mt-5 space-y-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
        {b.subTopics.length > 0 && (
          <div>
            <p>🔎 이 안의 서브 토픽</p>
            <ul className="ml-1 mt-0.5 space-y-1 border-l-2 border-slate-200 pl-3">
              {b.subTopics.map((s) => (
                <li key={s.name} className="text-[15px] leading-7 text-slate-700">
                  <Link href={explainHref(s.name)} className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2">{s.name}</Link>
                  {s.def ? <> — {s.def}</> : null}
                </li>
              ))}
            </ul>
          </div>
        )}
        {b.tails.length > 0 && (
          <p>
            🔗 꼬리 —{" "}
            {b.tails.map((t, i) => (
              <span key={t.title}>
                {i > 0 && " · "}
                <Link href={t.href} className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-2">{t.title.replace(/\s*\(.*$/, "")}</Link>
                <span className="text-xs text-slate-400"> {t.why}</span>
              </span>
            ))}
          </p>
        )}
        <p>
          <Link href={explainHref(b.title)} className="text-brand-700 hover:underline">💡 토픽 설명·답안지 →</Link>
        </p>
      </div>
      {next && !next.from && !next.newGroup && (
        <p className="mb-2 mt-8 text-center text-xs text-slate-400">↓ 같은 분류 「{b.group}」 — 다음은 {next.title.replace(/\s*\(.*$/, "")}</p>
      )}
      {next && (next.from || next.newGroup) && <div className="mt-8" />}
    </section>
  );
}

export default function CommuteRead({ params }: { params: { d: string } }) {
  const dom = DOMAINS.find((x) => x.code === params.d);
  if (!dom) notFound();
  const flow = readFlow(dom.code);
  const i = DOMAINS.findIndex((x) => x.code === dom.code);
  const nextDom = DOMAINS[(i + 1) % DOMAINS.length];
  return (
    <article className="mx-auto max-w-2xl break-keep pb-24">
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Link href="/commute" className="text-brand-600 hover:underline">← 과목</Link>
        <h1 className="text-lg font-bold text-slate-900">🚇 {dom.label}</h1>
        <span className="text-xs text-slate-400">{flow.length}토픽 · 토픽 지도 차례</span>
        <Link href="/map" className="ml-auto text-xs text-slate-500 hover:underline">🗺️ 지도</Link>
      </div>
      <ReadTracker d={dom.code} name={dom.label} items={flow.map((b) => ({ id: b.id, title: b.title.replace(/\s*\(.*$/, "") }))} />
      {flow.map((b, k) => (
        <Block key={b.id} b={b} next={flow[k + 1]} />
      ))}
      <Link href={`/commute/${nextDom.code}`} className="mt-12 block rounded-2xl bg-slate-900 px-5 py-4 text-center text-base font-bold text-white">
        {dom.label} 끝 — 다음 과목 {nextDom.label} →
      </Link>
    </article>
  );
}
