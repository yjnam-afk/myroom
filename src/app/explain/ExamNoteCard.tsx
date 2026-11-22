import type { ExamNote } from "@/data/examNotes";

/**
 * 교재 밖 토픽의 「해설집에서 옮긴 정리」 — 정의·키워드·표를 해설에 적힌 대로 보인다(data/examNotes).
 * 스캔을 읽어 옮긴 것이라 아래 해설집 원본이 기준이다.
 */
export function ExamNoteCard({ title, note }: { title: string; note: ExamNote }) {
  const pros = Object.entries(note.pros ?? {}).filter(([, v]) => v?.length);
  return (
    <section className="mb-6 rounded-2xl border-2 border-indigo-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 rounded-t-2xl bg-indigo-50 px-5 py-3">
        <h2 className="text-sm font-bold text-indigo-900">📘 해설집에서 옮긴 정리 — {title.replace(/\s*\(.*$/, "")}</h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-indigo-700">교재 밖 토픽</span>
      </div>
      <div className="space-y-4 break-keep px-5 py-4">
        {(note.definition || note.lead) && (
          <div>
            {note.lead && <p className="text-[13px] font-semibold text-slate-500">{note.lead}</p>}
            {note.definition && <p className="text-[15px] leading-7 text-slate-900">{note.definition}</p>}
          </div>
        )}
        {!!note.features?.length && (
          <p className="text-[14px] leading-6 text-slate-700">
            <span className="mr-1.5 text-[12px] font-bold text-slate-500">특징</span>
            {note.features.join(" · ")}
          </p>
        )}
        {!!note.keywords?.length && (
          <div className="flex flex-wrap gap-1.5">
            {note.keywords.map((k) => (
              <span key={k} className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[13px] font-semibold text-rose-800">
                {k}
              </span>
            ))}
          </div>
        )}
        {(note.tables ?? []).map((t, i) => (
          <div key={i}>
            <p className="mb-1 text-[14px] font-bold text-slate-900">{t.caption}</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full border-collapse text-left text-[13.5px] leading-6 sm:min-w-[420px]">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    {t.headers.map((h, k) => (
                      <th key={k} className="border-b border-slate-200 px-2.5 py-1.5 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, k) => (
                    <tr key={k} className="border-t border-slate-100 align-top">
                      {r.map((c, m) => (
                        <td key={m} className={`whitespace-pre-line break-words px-2 py-1.5 sm:px-2.5 ${m === 0 ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {pros.map(([k, v]) => (
          <p key={k} className="text-[14px] leading-6 text-slate-700">
            <span className="mr-1.5 text-[12px] font-bold text-slate-500">{k}</span>
            {v.join(" · ")}
          </p>
        ))}
        {!!note.uses?.length && (
          <p className="text-[14px] leading-6 text-slate-700">
            <span className="mr-1.5 text-[12px] font-bold text-slate-500">적용·활용</span>
            {note.uses.join(" · ")}
          </p>
        )}
        {!!note.figures?.length && (
          <p className="text-[13px] leading-6 text-slate-500">
            <span className="mr-1.5 font-bold">해설 그림</span>
            {note.figures.join(" / ")} — 그림은 아래 해설집에서 봅니다.
          </p>
        )}
        <p className="border-t border-slate-100 pt-2 text-[12px] leading-5 text-slate-400">
          출처 — {note.source.exam}
          <br />
          해설 문제: {note.source.question}
          <br />
          스캔을 읽어 옮긴 것이라 오탈자가 있을 수 있습니다. 아래 「📘 해설집」 원본이 기준입니다.
        </p>
      </div>
    </section>
  );
}
