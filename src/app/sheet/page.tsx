import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { buildSheet } from "@/lib/explainData";
import { CellLines } from "@/components/TableCell";

/**
 * 도메인별 토픽 정리표 — 손으로 쓰던 서브노트(엑셀식 정리)를 앱 한 페이지에 옮긴 것.
 *
 * 한 토픽이 한 줄이고, 그 줄 안에 정의·키워드·본론 3단표가 모두 들어간다.
 * 다운로드 없이 도메인마다 표 하나. 줄 순서는 교재 목차(SUBNOTES 등장 순서) 그대로.
 * 자료는 빌드 때 서브노트에서 뽑는다(AI 호출 없음, 정적 페이지).
 */
export const metadata = { title: "토픽 정리표 — 나의 공간" };

const IMP_CHIP: Record<string, string> = {
  상: "bg-red-100 text-red-700",
  중: "bg-amber-100 text-amber-700",
  하: "bg-slate-100 text-slate-500",
  출제예상: "bg-brand-100 text-brand-700",
};

export default function SheetPage() {
  const groups = buildSheet();
  const total = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <div>
      <PageHeader
        title="📋 토픽 정리표"
        desc={`심화반 교재 토픽 ${total}개 — 한 줄에 정의·키워드·본론 3단표를 모두 넣은 서브노트식 정리. 토픽 이름을 누르면 설명으로 갑니다.`}
      />

      {/* 도메인 바로가기 — 위에 붙어 다닌다 */}
      <nav
        aria-label="도메인 바로가기"
        className="sticky top-[57px] z-[5] -mx-4 mb-6 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur"
      >
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
                        <span
                          className={`mr-1 inline-block rounded px-1 py-[1px] text-[10px] font-bold ${
                            IMP_CHIP[r.imp] || "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {r.imp}
                        </span>
                        <Link
                          href={`/explain?topic=${encodeURIComponent(r.title)}`}
                          className="font-bold text-slate-900 hover:text-brand-700 hover:underline"
                        >
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

                      {/* 정의 · 특징 — 답안 서론에 그대로 옮겨 적는 부분 */}
                      <td className="border border-slate-300 px-2 py-1.5 text-slate-800">
                        {r.lead && <div className="text-[10.5px] text-slate-500">{r.lead}</div>}
                        {r.def && <div className="mt-0.5">{r.def}</div>}
                        {r.pairs.map((p) => (
                          <div key={p.name} className="mt-1">
                            <span className="font-bold text-slate-700">{p.name}</span>
                            <div>{p.def}</div>
                          </div>
                        ))}
                        {r.features.length > 0 && (
                          <div className="mt-1 text-slate-500">특징) {r.features.join(", ")}</div>
                        )}
                      </td>

                      {/* 본론 — 3단표를 캡션과 함께 그대로 */}
                      <td className="border border-slate-300 px-2 py-1.5">
                        {r.tables.map((tb, ti) => (
                          <div key={ti} className={ti ? "mt-2" : ""}>
                            <div className="font-bold text-slate-700">
                              {["가", "나", "다", "라", "마", "바", "사", "아"][ti] ?? "·"}. {tb.caption}
                            </div>
                            <table className="mt-0.5 w-full border-collapse text-[11px]">
                              <tbody>
                                {tb.rows.map((row, ri) => (
                                  <tr key={ri}>
                                    {row.map((c, ci) => (
                                      <td
                                        key={ci}
                                        className={`border border-slate-200 px-1.5 py-[3px] align-top ${
                                          ci === 0
                                            ? "w-[7.5rem] font-semibold text-slate-700"
                                            : ci === 1
                                              ? "w-[7rem] text-slate-700"
                                              : "text-slate-600"
                                        }`}
                                      >
                                        {ci === 0 ? c : <CellLines text={c} />}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
          </section>
        ))}
      </div>
    </div>
  );
}
