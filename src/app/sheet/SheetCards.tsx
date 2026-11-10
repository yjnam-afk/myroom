import Link from "next/link";
import type { SheetGroup, SheetRow, SheetCluster } from "@/lib/explainData";

/**
 * 정리표 암기 카드 보기 — 토픽 하나가 카드 한 장(2026-11-10 "ui가 맘에 안드네").
 * 그 전엔 11px 글씨 4칸 표에 색 배지가 여섯 가지, 묶음 머리가 표를 끊고 같은 문제가 묶음·토픽 줄에 두 번 나왔다.
 *   카드 왼쪽: 토픽 · 정의 · 특징 · 두음 · 개념도 자리(내 정리가 있으면 그림, 없으면 빈칸)
 *   카드 오른쪽: 자주 나오는 문제(실제 지문, 많이 나온 순 3개)
 *   🔗 함께 출제 묶음: 옅은 바탕 상자 하나에 엮이는 짝 · 엮여 나온 문제 · 멤버 카드를 담는다(묶음에 보인 문제는 멤버 카드에서 뺀다)
 * 색은 회색 + 파랑(brand)만 쓰고, 3회 이상 나온 횟수만 붉게 한다. 가로 스크롤은 만들지 않는다.
 */
const IMP_CHIP: Record<string, string> = {
  상: "bg-red-50 text-red-700",
  중: "bg-amber-50 text-amber-700",
  하: "bg-slate-100 text-slate-500",
  출제예상: "bg-brand-50 text-brand-700",
};

const topicHref = (t: string) => `/explain?topic=${encodeURIComponent(t)}`;
const bare = (t: string) => t.replace(/\s*[(（][^)）]*[)）]\s*$/, "");

type Qn = { text: string; n: number; where: string[]; topics?: string[] };

/** 문제 목록 — 횟수 · 지문 · 나온 곳 */
function QuestionList({ items }: { items: Qn[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((q, i) => (
        <li key={i} className="flex gap-3">
          <span className={`w-8 shrink-0 pt-px text-right text-[12.5px] font-bold tabular-nums ${q.n >= 3 ? "text-rose-600" : q.n === 2 ? "text-slate-700" : "text-slate-300"}`}>
            {q.n}회
          </span>
          <div className="min-w-0">
            <p className={`whitespace-pre-line text-[13px] leading-[1.6] ${q.n >= 2 ? "text-slate-900" : "text-slate-600"}`}>{q.text}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
              {q.topics && q.topics.length > 0 && <span className="mr-1.5 font-semibold text-brand-700">{q.topics.map(bare).join(" + ")}</span>}
              {q.where.slice(0, 3).join(" · ")}
              {q.where.length > 3 && ` 외 ${q.where.length - 3}`}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 text-[11px] font-semibold tracking-wide text-slate-400">{children}</p>
);

function TopicCard({ r, hide, skipCo }: { r: SheetRow; hide?: Set<string>; skipCo?: Set<string> }) {
  const qs = r.memo.questions.filter((q) => !hide?.has(q.text));
  const hidden = r.memo.questions.length - qs.length;
  const co = r.co.filter((c) => c.n >= 2 && !skipCo?.has(c.title)).slice(0, 4);
  return (
    <article className="grid gap-x-8 gap-y-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:p-5">
      {/* 왼쪽 — 토픽 · 정의 · 두음 · 개념도 */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <Link href={topicHref(r.title)} className="text-[15px] font-bold leading-snug text-slate-900 hover:text-brand-700 hover:underline">
            {r.title}
          </Link>
          <span className={`rounded px-1.5 py-px text-[10.5px] font-bold ${IMP_CHIP[r.imp] || "bg-slate-100 text-slate-500"}`}>{r.imp}</span>
          {r.ns + r.past > 0 && (
            <span className="text-[11px] text-slate-400">
              NS {r.ns}
              {r.past > 0 && ` · 기출 ${r.past}`}
            </span>
          )}
        </div>

        <div className="mt-2 text-[13.5px] leading-[1.65] text-slate-800">
          {r.lead && <p className="text-[12px] text-slate-400">{r.lead}</p>}
          {r.def && <p className="font-medium text-slate-900">{r.def}</p>}
          {r.pairs.map((p) => (
            <p key={p.name} className="mt-1">
              <span className="font-bold text-slate-700">{p.name}</span> — {p.def}
            </p>
          ))}
          {r.features.length > 0 && <p className="mt-1 text-[12.5px] text-slate-500">특징 · {r.features.join(" / ")}</p>}
        </div>

        {r.memo.mnemonic && (
          <p className="mt-2.5">
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[14px] font-extrabold tracking-wider text-brand-700">{r.memo.mnemonic}</span>
            <span className="ml-1.5 text-[11px] text-slate-400">교재 두음</span>
          </p>
        )}
        {r.memo.memo && <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">{r.memo.memo}</p>}

        {/* 개념도 — 내 정리(손글씨)가 있으면 그림, 없으면 빈칸으로 둔다 */}
        <div className="mt-3">
          {r.memo.hand.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {r.memo.hand.map((src) => (
                <a key={src} href={src} target="_blank" rel="noreferrer" title="내 개념도 — 새 탭에서 크게">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${r.title} 개념도`} className="max-h-36 rounded-lg border border-slate-200 bg-white object-contain" loading="lazy" />
                </a>
              ))}
            </div>
          ) : (
            <div className="flex h-14 items-center justify-center rounded-lg border border-dashed border-slate-200 text-[11px] text-slate-300">개념도</div>
          )}
        </div>

        {co.length > 0 && (
          <p className="mt-3 text-[11.5px] leading-relaxed text-slate-400">
            함께 나온 토픽{" "}
            {co.map((c, i) => (
              <span key={c.title}>
                {i > 0 && " · "}
                <Link href={topicHref(c.title)} className="text-slate-600 hover:text-brand-700 hover:underline">
                  {bare(c.title)}
                </Link>{" "}
                {c.n}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* 오른쪽 — 자주 나오는 문제 */}
      <div className="min-w-0 md:border-l md:border-slate-100 md:pl-8">
        <Label>
          자주 나오는 문제
          {r.memo.short + r.memo.long > 0 && (
            <span className="ml-2 font-normal">
              1교시 {r.memo.short} · 서술형 {r.memo.long}
            </span>
          )}
        </Label>
        {r.memo.questions.length === 0 ? (
          <p className="text-[12.5px] text-slate-300">출제 기록 없음</p>
        ) : qs.length === 0 ? (
          <p className="text-[12.5px] text-slate-400">위 묶음 문제에 모두 들어 있습니다.</p>
        ) : (
          <>
            <QuestionList items={qs.slice(0, 3)} />
            {(qs.length > 3 || hidden > 0) && (
              <Link href={topicHref(r.title)} className="mt-2.5 inline-block pl-11 text-[11.5px] text-brand-600 hover:underline">
                {qs.length > 3 ? `다른 문제 ${qs.length - 3}개 더 보기 →` : "토픽 설명에서 전체 보기 →"}
              </Link>
            )}
          </>
        )}
      </div>
    </article>
  );
}

function Bundle({ cl, rows }: { cl: SheetCluster; rows: SheetRow[] }) {
  const tied = cl.tied.slice(0, 3);
  const hide = new Set(tied.map((q) => q.text));
  const members = new Set(cl.members);
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 md:p-4">
      <div className="px-1 pb-3 md:px-2">
        <p className="text-[11px] font-semibold tracking-wide text-brand-700">🔗 함께 출제 · 같은 문항 {cl.shared}개</p>
        <h3 className="mt-1 text-[16px] font-bold leading-snug text-slate-900">{cl.members.map(bare).join(" · ")}</h3>
        {cl.pairs.length > 0 && (
          <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
            {cl.pairs.map((p, i) => (
              <span key={`${p.a}|${p.b}`}>
                {i > 0 && <span className="mx-1.5 text-slate-300">|</span>}
                {bare(p.a)} ↔ {bare(p.b)} <b className="text-slate-700">{p.n}</b>
              </span>
            ))}
          </p>
        )}
      </div>

      {tied.length > 0 && (
        <div className="mb-2 rounded-xl border border-brand-100 bg-white p-4 md:p-5">
          <Label>이렇게 엮여 나온다</Label>
          <QuestionList items={tied} />
          {cl.tied.length + cl.more > tied.length && (
            <p className="mt-2.5 pl-11 text-[11.5px] text-slate-400">엮여 나온 문제 {cl.tied.length + cl.more - tied.length}개 더</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {rows.map((r) => (
          <TopicCard key={r.title} r={r} hide={hide} skipCo={members} />
        ))}
      </div>
    </div>
  );
}

export default function SheetCards({ g }: { g: SheetGroup }) {
  // 묶음 멤버는 buildSheet 가 이미 붙여 두었다 — 이어지는 같은 묶음 줄을 한 덩어리로 모은다
  const blocks: { cl?: SheetCluster; rows: SheetRow[] }[] = [];
  for (const r of g.rows) {
    const cl = r.cluster !== undefined ? g.clusters[r.cluster] : undefined;
    const last = blocks[blocks.length - 1];
    if (cl && last?.cl === cl) last.rows.push(r);
    else blocks.push({ cl, rows: [r] });
  }
  return (
    <div className="space-y-3 [overflow-wrap:anywhere]">
      {blocks.map((b) => (b.cl ? <Bundle key={`c${b.cl.id}`} cl={b.cl} rows={b.rows} /> : <TopicCard key={b.rows[0].title} r={b.rows[0]} />))}
    </div>
  );
}
