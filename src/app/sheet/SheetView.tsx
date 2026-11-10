import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { buildSheet } from "@/lib/explainData";
import AnswerTable from "@/components/AnswerTable";
import SheetCards from "./SheetCards";

/**
 * 도메인별 토픽 정리표 — 손으로 쓰던 서브노트(엑셀식 정리)를 앱 한 페이지에 옮긴 것.
 *
 * 기본 보기는 「암기 카드」(SheetCards — 2026-11-09 "답안지를 암기할만한 모든 수단을 다 활용해야 한다"):
 *   정의(+교재 두음) · 개념도 — 손글씨가 있으면 붙이고 없으면 빈칸(2026-11-10 "개념도 어차피 못 그릴 거 같으니 내가 그때그때 추가할게. 빈칸으로")
 *   자주 나오는 문제 — 실제 출제 지문을 같은 문제끼리 묶어 많이 나온 순(2026-11-10 "목차는 저게 뭐야. 자주 나오는 문제 유형을 차라리 보여줘라" → "문제 자체를 말한건데")
 *   🔗 함께 출제 묶음 — 같은 문항에 2번 이상 같이 나온 토픽끼리 한 상자에 두고, 엮이는 짝과 실제로 엮여 나온 문제를 보인다
 *      (2026-11-10 "자주 엮어서 나오는 애들끼리 그루핑" → "어떻게 묶어야 하는지도 제대로 보여줄 수 있나"). 가로 스크롤은 만들지 않는다("스크롤은 하지 말고").
 *   돌려막기 칸은 뺐다("도움도 안 되네") — 토픽 설명의 FrameCard 에서 본다.
 * 「펼친 표」(/sheet/full)는 예전처럼 본론 3단표 전체를 표로 보여 준다.
 * 자료는 빌드 때 서브노트에서 뽑는다(AI 호출 없음, 정적 페이지). 두 보기는 각각 정적 경로다 —
 * 2026-11-10 "정리표 메뉴 안눌려": ?full=1 쿼리 때문에 동적 페이지가 되어 요청마다 710토픽 출제 기록을 다시 세느라(약 18초)
 * Vercel 함수 제한에 걸렸다. 쿼리 대신 경로로 나눠 빌드 때 미리 만든다.
 */
const IMP_CHIP: Record<string, string> = {
  상: "bg-red-100 text-red-700",
  중: "bg-amber-100 text-amber-700",
  하: "bg-slate-100 text-slate-500",
  출제예상: "bg-brand-100 text-brand-700",
};

const topicHref = (t: string) => `/explain?topic=${encodeURIComponent(t)}`;

export default function SheetView({ full }: { full: boolean }) {
  const groups = buildSheet();
  const total = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div>
      <PageHeader
        title="📋 토픽 정리표"
        desc={
          full
            ? `심화반 교재 토픽 ${total}개 — 한 줄에 정의·키워드·본론 3단표를 모두 넣은 서브노트식 정리.`
            : `심화반 교재 토픽 ${total}개 — 정의·두음·개념도 자리와 자주 나오는 문제. 함께 출제되는 토픽은 한 상자에 묶었습니다.`
        }
      />

      {/* 도메인 바로가기 + 보기 전환 — 위에 붙어 다닌다(줄바꿈, 가로 스크롤 없음) */}
      <nav
        aria-label="도메인 바로가기"
        className="sticky top-[84px] z-[5] -mx-4 mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur max-sm:static xl:top-[57px]"
      >
        <Link
          href={full ? "/sheet" : "/sheet/full"}
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

      <div className={full ? "space-y-10" : "space-y-14"}>
        {groups.map((g) => (
          <section key={g.code} id={g.code} className="scroll-mt-36">
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-xl font-bold text-slate-900">{g.label}</h2>
              <span className="text-xs text-slate-400">
                {g.rows.length}개 · 심화반 {g.week}주차
                {!full && g.clusters.length > 0 && ` · 함께 출제 묶음 ${g.clusters.length}`}
              </span>
            </div>

            {!full ? (
              <SheetCards g={g} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white">
                <table className="w-full min-w-[1100px] border-collapse text-[11.5px] leading-[1.45]">
                  <thead className="bg-slate-100 text-left text-[10.5px] font-bold text-slate-600">
                    <tr>
                      <th className="w-[10rem] border border-slate-300 px-2 py-1.5">토픽</th>
                      <th className="w-[11rem] border border-slate-300 px-2 py-1.5">키워드</th>
                      <th className="w-[15rem] border border-slate-300 px-2 py-1.5">정의 · 특징</th>
                      <th className="border border-slate-300 px-2 py-1.5">본론 3단표</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((r, i) => (
                      <tr key={r.title} className={`align-top ${i % 2 ? "bg-slate-50/40" : "bg-white"}`}>
                        {/* 토픽 — 중요도·출제 이력까지 한 칸에 */}
                        <td className="border border-slate-300 px-2 py-1.5">
                          <span className={`mr-1 inline-block rounded px-1 py-[1px] text-[10px] font-bold ${IMP_CHIP[r.imp] || "bg-slate-100 text-slate-500"}`}>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
