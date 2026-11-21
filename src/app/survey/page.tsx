import Link from "next/link";
import survey from "@/data/topicSurvey.json";
import { explainHref } from "@/lib/links";

export const metadata = { title: "토픽 조사 — 나의 공간" };

/**
 * 토픽 조사 — 문제은행 전체(기출·NS·모의·파이널·셀테·합숙)의 문항이 어느 토픽에 정리돼 있는지.
 *
 * 2026-11-22 "기존 기출문제에 나오는 토픽 하나하나가 다 정리되어야 하는거야 — 기출, 모의고사 등등등 다 포함해서 토픽 조사".
 * 자료는 `npx tsx scripts/survey-topics.ts src/data/topicSurvey.json` 이 만든다(빌드 때 돌리지 않는다 — 문항·토픽을 더하면 다시 돌린다).
 * 화면은 거르기를 주소(?k=…&cat=…&com=1)로만 한다 — 목록이 커서 브라우저로 자료를 보내지 않는다.
 */
type Item = { name: string; n: number; past: number; ns: number; cat: string; legacy: string; com: number; ans: number; qs: { id: string; src: string; text: string }[] };
type Kind = "none" | "legacy" | "noname";

const KINDS: { k: Kind; label: string; hint: string }[] = [
  { k: "none", label: "화면 없음", hint: "교재 토픽·서브 토픽·예전 토픽 어디에도 없는 주제" },
  { k: "legacy", label: "예전 토픽만", hint: "기필반 토픽 화면은 있지만 교재 정리(정의·표·답안지 템플릿)는 없는 주제" },
  { k: "noname", label: "주제 이름 없음", hint: "첫 줄에서 주제 이름을 못 뽑은 기출 문항(상황형·두 개념 비교)" },
];

export default function SurveyPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const kind: Kind = searchParams.k === "legacy" || searchParams.k === "noname" ? searchParams.k : "none";
  const cat = searchParams.cat ?? "";
  const onlyCom = searchParams.com === "1";
  const onlyPast = searchParams.past === "1";
  const all = (kind === "legacy" ? survey.legacy : survey.none) as Item[];
  const cats = Array.from(new Set(all.map((x) => x.cat).filter(Boolean)));
  cats.sort((a, b) => all.filter((x) => x.cat === b).length - all.filter((x) => x.cat === a).length);
  const list = all.filter((x) => (!cat || x.cat === cat) && (!onlyCom || x.com > 0) && (!onlyPast || x.past > 0));
  const href = (p: Record<string, string | undefined>) => {
    const q = { k: kind, cat, com: onlyCom ? "1" : "", past: onlyPast ? "1" : "", ...p };
    const s = Object.entries(q)
      .filter(([k, v]) => v && !(k === "k" && v === "none"))
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join("&");
    return s ? `/survey?${s}` : "/survey";
  };
  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-medium ${on ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"}`;
  const tot = survey.bySrc[survey.bySrc.length - 1];
  const pct = (n: number, d: number) => `${Math.round((n / d) * 100)}%`;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">📋 토픽 조사</h1>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          문제은행 {survey.total.toLocaleString()}문항(기출·NS·모의·파이널·셀테·합숙)이 어느 토픽에 정리돼 있는지 센 것입니다. 조사일 {survey.date}.{" "}
          <Link href="/map" className="text-brand-600 underline underline-offset-2">
            토픽 지도 →
          </Link>
        </p>
      </div>

      {/* 출처별 문항 수 */}
      <div className="mb-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {["출처", "문항", "교재 토픽", "서브 토픽", "예전 토픽만", "화면 없음", "주제 이름 없음"].map((h) => (
                <th key={h} className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {survey.bySrc.map((r) => (
              <tr key={r.src} className={`border-t border-slate-100 ${r.src === "전체" ? "bg-slate-50 font-bold text-slate-900" : "text-slate-700"}`}>
                <td className="px-3 py-1.5">{r.src}</td>
                <td className="px-3 py-1.5">{r.n.toLocaleString()}</td>
                <td className="px-3 py-1.5">
                  {r.book.toLocaleString()} <span className="font-normal text-slate-400">{pct(r.book, r.n)}</span>
                </td>
                <td className="px-3 py-1.5">{r.sub.toLocaleString()}</td>
                <td className="px-3 py-1.5">{r.legacy.toLocaleString()}</td>
                <td className="px-3 py-1.5 text-rose-700">
                  {r.none.toLocaleString()} <span className="font-normal text-rose-300">{pct(r.none, r.n)}</span>
                </td>
                <td className="px-3 py-1.5">{r.noName.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4 grid gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="font-semibold text-slate-500">교재 토픽</p>
          <p className="mt-1 text-slate-800">
            <b className="text-base">{survey.book.all}</b>개 · 문항이 걸린 것 {survey.book.used} · 한 번도 안 나온 것 {survey.book.unused.length}
          </p>
          <p className="mt-1 text-slate-500">문항 {pct(tot.book + tot.sub, tot.n)}가 교재 토픽·서브 토픽에 걸립니다.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="font-semibold text-slate-500">교재 밖 주제 — 예전 토픽 화면만</p>
          <p className="mt-1 text-slate-800">
            <b className="text-base">{survey.counts.legacy}</b>개 · 아래 목록 {survey.legacy.length} · 한 번만 나온 것 {survey.counts.legacyOnce}
          </p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
          <p className="font-semibold text-rose-700">교재 밖 주제 — 화면 없음</p>
          <p className="mt-1 text-slate-800">
            <b className="text-base">{survey.counts.none.toLocaleString()}</b>개 · 아래 목록 {survey.none.length} · 한 번만 나온 모의 주제 {survey.counts.noneOnce.toLocaleString()}
          </p>
          <p className="mt-1 text-slate-500">목록은 두 번 이상 나왔거나 기출에 나온 주제만 싣습니다.</p>
        </div>
      </div>

      {/* 거르기 */}
      <div className="mb-2 flex flex-wrap gap-1.5">
        {KINDS.map((x) => (
          <Link key={x.k} href={href({ k: x.k, cat: "" })} title={x.hint} className={chip(kind === x.k)}>
            {x.label} {x.k === "none" ? survey.none.length : x.k === "legacy" ? survey.legacy.length : survey.noName.length}
          </Link>
        ))}
      </div>
      {kind !== "noname" && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Link href={href({ cat: "" })} className={chip(!cat)}>
            전체 과목
          </Link>
          {cats.map((c) => (
            <Link key={c} href={href({ cat: c })} className={chip(cat === c)}>
              {c} <span className="opacity-60">{all.filter((x) => x.cat === c).length}</span>
            </Link>
          ))}
          <Link href={href({ com: onlyCom ? "" : "1" })} className={chip(onlyCom)} title="문항에 해설집이 직접 걸려 있어 그 해설에서 정리를 옮길 수 있는 주제">
            📘 해설집 있는 것만
          </Link>
          <Link href={href({ past: onlyPast ? "" : "1" })} className={chip(onlyPast)}>
            📜 기출에 나온 것만
          </Link>
        </div>
      )}
      <p className="mb-2 text-[11px] leading-relaxed text-slate-500">
        {KINDS.find((x) => x.k === kind)!.hint}. 주제 이름은 문항 첫 줄에서 기계로 뽑은 것이라 앞에 군말이 붙거나(「최근 SoC」) 같은 주제가 둘로 갈린 것이 섞여 있습니다. 차례는 기출 ×3 + NS ×2 + 전체 문항 수.
      </p>

      {kind === "noname" ? (
        <ul className="space-y-1 rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          {survey.noName.map((q) => (
            <li key={q.id}>
              <span className="mr-1.5 text-slate-400">{q.src}</span>
              {q.text}
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-700">주제 {list.length}개</p>
          {list.map((x, i) => (
            <details key={`${x.name}-${i}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <summary className="flex cursor-pointer flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="font-semibold text-slate-900">{x.name}</span>
                <span className="text-[11px] text-slate-400">{x.cat}</span>
                <span className="ml-auto flex flex-wrap items-center gap-1 text-[11px]">
                  {x.past > 0 && <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-rose-700">기출 {x.past}</span>}
                  {x.ns > 0 && <span className="rounded-full bg-sky-50 px-1.5 py-0.5 text-sky-700">NS {x.ns}</span>}
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-slate-600">전체 {x.n}</span>
                  {x.com > 0 && <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-indigo-700">📘 해설 {x.com}</span>}
                  {x.ans > 0 && <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-emerald-700">✍️ 답안 {x.ans}</span>}
                </span>
              </summary>
              {x.legacy && (
                <p className="mt-2 text-xs">
                  <Link href={explainHref(x.legacy)} className="text-brand-600 underline underline-offset-2">
                    예전 토픽 화면: {x.legacy} →
                  </Link>
                </p>
              )}
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-slate-700">
                {x.qs.map((q) => (
                  <li key={q.id}>
                    <span className="mr-1.5 text-slate-400">{q.src}</span>
                    {q.text}
                  </li>
                ))}
                {x.n > x.qs.length && <li className="text-slate-400">… 외 {x.n - x.qs.length}문항</li>}
              </ul>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
