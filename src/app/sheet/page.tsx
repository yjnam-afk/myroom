import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { buildSheet } from "@/lib/explainData";

/**
 * 도메인별 토픽 정리표 — 선생님이 엑셀로 하라던 정리를 앱 한 페이지에서 본다.
 * 다운로드 없이, 도메인마다 표 하나. 줄 순서는 교재 목차(SUBNOTES 등장 순서) 그대로.
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
        desc={`심화반 교재 토픽 ${total}개를 도메인별 한 표로 — 리드문·정의(29~30자)·특징·키워드·본론 표·출제 이력. 토픽 이름을 누르면 설명으로 갑니다.`}
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

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[1000px] border-collapse text-[12.5px] leading-relaxed">
                <thead className="bg-slate-50 text-left text-[11px] font-bold text-slate-500">
                  <tr>
                    <th className="w-9 border-b border-slate-200 px-2 py-2 text-right">#</th>
                    <th className="w-10 border-b border-slate-200 px-2 py-2">중요</th>
                    <th className="w-[11rem] border-b border-slate-200 px-2 py-2">토픽</th>
                    <th className="w-[7.5rem] border-b border-slate-200 px-2 py-2">리드문</th>
                    <th className="w-[13rem] border-b border-slate-200 px-2 py-2">정의(29~30자)</th>
                    <th className="w-[8rem] border-b border-slate-200 px-2 py-2">특징</th>
                    <th className="border-b border-slate-200 px-2 py-2">키워드</th>
                    <th className="w-[9rem] border-b border-slate-200 px-2 py-2">본론 표</th>
                    <th className="w-[6rem] border-b border-slate-200 px-2 py-2">출제</th>
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((r, i) => (
                    <tr
                      key={r.title}
                      className={`align-top ${i % 2 ? "bg-slate-50/50" : "bg-white"} hover:bg-brand-50/40`}
                    >
                      <td className="border-b border-slate-100 px-2 py-2 text-right tabular-nums text-slate-400">
                        {i + 1}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-2">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-bold ${
                            IMP_CHIP[r.imp] || "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {r.imp}
                        </span>
                      </td>
                      <td className="border-b border-slate-100 px-2 py-2 font-semibold text-slate-900">
                        <Link
                          href={`/explain?topic=${encodeURIComponent(r.title)}`}
                          className="hover:text-brand-700 hover:underline"
                        >
                          {r.title}
                        </Link>
                      </td>
                      <td className="border-b border-slate-100 px-2 py-2 text-slate-600">{r.lead}</td>
                      <td className="border-b border-slate-100 px-2 py-2 text-slate-800">
                        {r.def}
                        {r.pairs.map((p) => (
                          <div key={p.name} className="mt-1 first:mt-0">
                            <span className="font-semibold text-slate-700">{p.name}</span>
                            <span className="text-slate-400"> — </span>
                            {p.def}
                          </div>
                        ))}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-2 text-slate-600">
                        {r.features.join(", ")}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-2 text-slate-700">
                        {r.keywords.join(", ")}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-2 text-slate-500">
                        {r.tables.map((t, k) => (
                          <div key={k}>· {t}</div>
                        ))}
                      </td>
                      <td className="border-b border-slate-100 px-2 py-2 text-slate-600">
                        {r.ns + r.past > 0 ? (
                          <>
                            <span className={r.ns >= 2 ? "font-bold text-red-600" : ""}>
                              NS {r.ns}
                            </span>
                            {r.past > 0 && <span> · 기출 {r.past}</span>}
                            {r.last && (
                              <div className="text-[11px] text-slate-400">최근 {r.last}</div>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-300">–</span>
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
