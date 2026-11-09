import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { buildSheet } from "@/lib/explainData";
import AnswerTable from "@/components/AnswerTable";
import { FRAME_BY_CODE } from "@/data/answerFrames";

/**
 * 도메인별 토픽 정리표 — 손으로 쓰던 서브노트(엑셀식 정리)를 앱 한 페이지에 옮긴 것.
 *
 * 기본 보기는 「암기 카드」(2026-11-09 "답안지를 암기할만한 모든 수단을 다 활용해야 한다"):
 *   1. 정의(+교재 두음)  2. 개념도(손글씨가 있으면, 없으면 개념도 틀)  2'. 목차 — 답안지에서 가장 잘 쓰이는 차례
 *   (교재 표 캡션 → 1열 항목, 서술형 지문이 자주 요구한 차례가 먼저)  3. 돌려막기 — 3단락 유형·대상·짝·같은 틀 묶음
 *   예) 교착상태: 정의 → 발생 조건(상호배제·점유 대기·비선점·환형 대기) → 해결 방안(예방·회피·발견·회복)
 * 「펼친 표」(?full=1)는 예전처럼 본론 3단표 전체를 보여 준다.
 * 자료는 빌드 때 서브노트에서 뽑는다(AI 호출 없음, 정적 페이지).
 */
export const metadata = { title: "토픽 정리표 — 나의 공간" };

const IMP_CHIP: Record<string, string> = {
  상: "bg-red-100 text-red-700",
  중: "bg-amber-100 text-amber-700",
  하: "bg-slate-100 text-slate-500",
  출제예상: "bg-brand-100 text-brand-700",
};

const topicHref = (t: string) => `/explain?topic=${encodeURIComponent(t)}`;
const bare = (t: string) => t.replace(/\s*[(（][^)）]*[)）]\s*$/, "");

export default function SheetPage({ searchParams }: { searchParams?: { full?: string } }) {
  const full = searchParams?.full === "1";
  const groups = buildSheet();
  const total = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div>
      <PageHeader
        title="📋 토픽 정리표"
        desc={
          full
            ? `심화반 교재 토픽 ${total}개 — 한 줄에 정의·키워드·본론 3단표를 모두 넣은 서브노트식 정리.`
            : `심화반 교재 토픽 ${total}개 — 암기 카드: 1 정의(두음) · 2 개념도 · 2' 목차(답안지에서 가장 잘 쓰이는 차례) · 3 돌려막기(같은 틀로 3단락까지 같이 쓰는 토픽). 토픽 이름을 누르면 설명으로 갑니다.`
        }
      />

      {/* 도메인 바로가기 + 보기 전환 — 위에 붙어 다닌다 */}
      <nav
        aria-label="도메인 바로가기"
        className="sticky top-[84px] z-[5] xl:top-[57px] -mx-4 mb-6 flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur"
      >
        <Link
          href={full ? "/sheet" : "/sheet?full=1"}
          className="shrink-0 rounded-full border border-brand-300 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
        >
          {full ? "🧠 암기 카드 보기" : "📑 펼친 표 보기"}
        </Link>
        <span className="h-4 w-px shrink-0 bg-slate-200" />
        {groups.map((g) => (
          <a
            key={g.code}
            href={`#${g.code}`}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700"
          >
            {g.label} <span className="text-slate-400">{g.rows.length}</span>
          </a>
        ))}
      </nav>

      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g.code} id={g.code} className="scroll-mt-28">
            <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-xl font-bold text-slate-900">{g.label}</h2>
              <span className="text-xs text-slate-400">
                {g.rows.length}개 · 심화반 {g.week}주차
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
              <table className="w-full min-w-[1100px] border-collapse text-[11.5px] leading-[1.45]">
                <thead className="bg-slate-100 text-left text-[10.5px] font-bold text-slate-600">
                  {full ? (
                    <tr>
                      <th className="w-[10rem] border border-slate-300 px-2 py-1.5">토픽</th>
                      <th className="w-[11rem] border border-slate-300 px-2 py-1.5">키워드</th>
                      <th className="w-[15rem] border border-slate-300 px-2 py-1.5">정의 · 특징</th>
                      <th className="border border-slate-300 px-2 py-1.5">본론 3단표</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="w-[9.5rem] border border-slate-300 px-2 py-1.5">토픽</th>
                      <th className="w-[15rem] border border-slate-300 px-2 py-1.5">1. 정의 · 두음</th>
                      <th className="w-[9rem] border border-slate-300 px-2 py-1.5">2. 개념도</th>
                      <th className="border border-slate-300 px-2 py-1.5">2&apos;. 목차 — 답안지에서 잘 쓰이는 차례</th>
                      <th className="w-[15rem] border border-slate-300 px-2 py-1.5">3. 돌려막기 · 3단락</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {g.rows.map((r, i) => (
                    <tr key={r.title} className={`align-top ${i % 2 ? "bg-slate-50/40" : "bg-white"}`}>
                      {/* 토픽 — 중요도·출제 이력까지 한 칸에 */}
                      <td className="border border-slate-300 px-2 py-1.5">
                        <span
                          className={`mr-1 inline-block rounded px-1 py-[1px] text-[10px] font-bold ${
                            IMP_CHIP[r.imp] || "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {r.imp}
                        </span>
                        <Link href={topicHref(r.title)} className="font-bold text-slate-900 hover:text-brand-700 hover:underline">
                          {r.title}
                        </Link>
                        {r.ns + r.past > 0 && (
                          <div className="mt-1 text-[10px] text-slate-500">
                            <span className={r.ns >= 2 ? "font-bold text-red-600" : ""}>NS {r.ns}</span>
                            {r.past > 0 && <span> · 기출 {r.past}</span>}
                            {r.last && <div className="text-slate-400">최근 {r.last}</div>}
                          </div>
                        )}
                      </td>

                      {full ? (
                        <>
                          {/* 키워드 — 교재 '■ 키워드' 그대로, 채점 근거 */}
                          <td className="border border-slate-300 px-2 py-1.5 text-slate-700">
                            {r.keywords.map((k, ki) => (
                              <div key={ki}>· {k}</div>
                            ))}
                          </td>
                          <td className="border border-slate-300 px-2 py-1.5 text-slate-800">
                            {r.lead && <div className="text-[10.5px] text-slate-500">{r.lead}</div>}
                            {r.def && <div className="mt-0.5">{r.def}</div>}
                            {r.pairs.map((p) => (
                              <div key={p.name} className="mt-1">
                                <span className="font-bold text-slate-700">{p.name}</span>
                                <div>{p.def}</div>
                              </div>
                            ))}
                            {r.features.length > 0 && <div className="mt-1 text-slate-500">특징) {r.features.join(", ")}</div>}
                          </td>
                          <td className="border border-slate-300 px-2 py-1.5">
                            {r.tables.map((tb, ti) => (
                              <div key={ti} className={ti ? "mt-2" : ""}>
                                <div className="font-bold text-slate-700">
                                  {["가", "나", "다", "라", "마", "바", "사", "아"][ti] ?? "·"}. {tb.caption}
                                </div>
                                <div className="mt-0.5">
                                  <AnswerTable headers={tb.headers} rows={tb.rows} dense />
                                </div>
                              </div>
                            ))}
                            {r.notes.length > 0 && (
                              <div className="mt-1.5 text-[10.5px] text-slate-500">
                                {r.notes.map((n, ni) => (
                                  <div key={ni}>+ {n}</div>
                                ))}
                              </div>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          {/* 1. 정의 · 두음 — 답안 서론에 그대로 옮겨 적는 부분 + 교재 두음 */}
                          <td className="border border-slate-300 px-2 py-1.5 text-slate-800">
                            {r.lead && <div className="text-[10.5px] text-slate-500">{r.lead}</div>}
                            {r.def && <div className="mt-0.5 font-medium">{r.def}</div>}
                            {r.pairs.map((p) => (
                              <div key={p.name} className="mt-1">
                                <span className="font-bold text-slate-700">{p.name}</span>
                                <div>{p.def}</div>
                              </div>
                            ))}
                            {r.features.length > 0 && <div className="mt-1 text-slate-500">특징) {r.features.join(", ")}</div>}
                            {r.memo.mnemonic && (
                              <div className="mt-1.5">
                                <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[12px] font-extrabold tracking-wide text-brand-700">
                                  {r.memo.mnemonic}
                                </span>
                                <span className="ml-1 text-[10px] text-slate-400">교재 두음</span>
                              </div>
                            )}
                            {r.memo.memo && <div className="mt-1 text-[10.5px] text-slate-500">💡 {r.memo.memo}</div>}
                          </td>

                          {/* 2. 개념도 — 손글씨 개념도, 없으면 개념도 틀(그룹·슬롯) */}
                          <td className="border border-slate-300 px-2 py-1.5">
                            {r.memo.hand.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {r.memo.hand.map((src) => (
                                  <a key={src} href={src} target="_blank" rel="noreferrer" title="손글씨 개념도 — 새 탭에서 크게">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} alt={`${r.title} 손글씨 개념도`} className="h-20 rounded border border-slate-200 bg-white object-contain" loading="lazy" />
                                  </a>
                                ))}
                              </div>
                            ) : r.memo.frame ? (
                              <div className="text-[10.5px] text-slate-600">
                                <span className={`rounded-full border px-1.5 py-0.5 font-semibold ${FRAME_BY_CODE[r.memo.frame.group].cls}`}>
                                  {r.memo.frame.group} {r.memo.frame.groupName}
                                </span>
                                <div className="mt-1 text-slate-500">{r.memo.frame.slot}</div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-300">—</span>
                            )}
                          </td>

                          {/* 2'. 목차 — 교재 표 캡션 → 1열 항목. 서술형 지문이 자주 요구한 차례가 먼저(빈출 n) */}
                          <td className="border border-slate-300 px-2 py-1.5 text-slate-800">
                            {r.memo.toc.length === 0 && <span className="text-[10px] text-slate-300">표 없음</span>}
                            {r.memo.toc.map((t, ti) => (
                              <div key={ti} className={ti ? "mt-1" : ""}>
                                <span className={`font-bold ${t.asked > 0 ? "text-slate-900" : "text-slate-600"}`}>{t.label}</span>
                                {t.asked > 0 && <span className="ml-1 rounded bg-rose-50 px-1 text-[9.5px] font-bold text-rose-600">빈출 {t.asked}</span>}
                                {t.mnemonic && <span className="ml-1 rounded bg-brand-50 px-1 text-[10px] font-bold text-brand-700">{t.mnemonic}</span>}
                                <span className="text-slate-400">: </span>
                                <span>{t.items.join(" · ")}</span>
                              </div>
                            ))}
                          </td>

                          {/* 3. 돌려막기 — 3단락 유형·대상·짝, 같은 틀 묶음 */}
                          <td className="border border-slate-300 px-2 py-1.5 text-slate-700">
                            {r.memo.frame ? (
                              <>
                                <div>
                                  <span className="font-bold text-slate-800">3단락 · {r.memo.frame.type}</span>
                                  {r.memo.frame.target && <div className="text-slate-600">→ {r.memo.frame.target}</div>}
                                </div>
                                {r.memo.frame.pair && (
                                  <div className="mt-1 text-[10.5px]">
                                    짝{" "}
                                    <Link href={topicHref(r.memo.frame.pair)} className="rounded-full border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-indigo-700 hover:bg-indigo-100">
                                      {bare(r.memo.frame.pair)}
                                    </Link>
                                  </div>
                                )}
                                {r.memo.frame.members.length > 0 && (
                                  <div className="mt-1 text-[10.5px]">
                                    <span className="text-slate-400">🔁 {r.memo.frame.family} </span>
                                    <span className="inline-flex flex-wrap gap-1 align-middle">
                                      {r.memo.frame.members.map((m) => (
                                        <Link key={m} href={topicHref(m)} className={`rounded-full border px-1.5 py-0.5 hover:underline ${FRAME_BY_CODE[r.memo.frame!.group].cls}`}>
                                          {bare(m)}
                                        </Link>
                                      ))}
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-300">틀 미정</span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
