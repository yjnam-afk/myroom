"use client";

import Link from "next/link";
import { compareSetsFor, memoryTablesFor } from "@/lib/topicMapLinks";

/**
 * 토픽 설명 안에 토픽 지도를 끌어온다.
 *
 * 시험은 개념 하나를 묻기보다 "나란히"로 묻는다 — 페이징과 세그멘테이션을
 * 비교하라, 뮤텍스와 세마포어의 차이를 쓰라. 그런데 토픽 설명은 한 토픽만
 * 깊게 파고 끝나서, 짝을 보려면 지도로 나갔다 와야 했다.
 *
 * 그래서 이 토픽이 등장하는 비교 세트를 여기서 바로 펼친다. 지금 보는 토픽은
 * 굵게 칠해 어디에 서 있는지 보이게 하고, 나머지 항목은 그 토픽 설명으로
 * 바로 넘어가게 링크를 건다.
 */
export default function TopicMapCard({ title }: { title?: string }) {
  const t = (title || "").trim();
  const sets = compareSetsFor(t);
  const tables = memoryTablesFor(t);
  if (sets.length === 0 && tables.length === 0) return null;

  const key = norm(t);

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border-2 border-sky-200 bg-white shadow-sm">
      <div className="bg-sky-50 px-5 py-3">
        <h3 className="text-sm font-bold text-sky-900">
          🧭 무엇과 짝인가 — 토픽 지도에서
        </h3>
        <p className="mt-0.5 text-xs text-sky-700/80">
          시험은 개념 하나보다 <b>나란히 놓고</b> 묻습니다. 이 토픽이 들어가는
          비교 묶음입니다.
        </p>
      </div>

      <div className="space-y-4 p-5">
        {sets.map(({ set, kind }) => (
          <div key={`${set.category}::${set.title}`}>
            <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
              <b className="text-[15px] text-slate-900">{set.title}</b>
              {set.source === "교재" && (
                <span
                  title={set.ref ? `교재 서브노트 「${set.ref}」의 표` : "교재 표"}
                  className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
                >
                  교재
                </span>
              )}
              {kind === "title" && (
                <span className="rounded border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">
                  이 토픽을 쪼갠 표
                </span>
              )}
            </div>
            <p className="mb-2 text-xs text-slate-500">기준 — {set.axis}</p>
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
              {set.items.map((it) => {
                const here = norm(it.name) === key;
                return (
                  <li
                    key={it.name}
                    className={`px-3 py-2 ${here ? "bg-brand-50" : "bg-white"}`}
                  >
                    {here ? (
                      // 지금 보고 있는 토픽 — 링크를 걸지 않는다(제자리 이동은 혼란).
                      <b className="text-sm text-brand-700">{it.name}</b>
                    ) : (
                      <Link
                        href={`/explain?topic=${encodeURIComponent(it.name)}`}
                        className="text-sm font-medium text-slate-800 hover:text-brand-600 hover:underline"
                      >
                        {it.name}
                      </Link>
                    )}
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-slate-500">
                      {it.hint}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {tables.map((tb) => (
          <details
            key={tb.title}
            className="rounded-xl border border-slate-200 bg-slate-50/60 p-3"
          >
            <summary className="cursor-pointer text-sm font-bold text-slate-800">
              📋 암기표 — {tb.title}
            </summary>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
              {tb.intro}
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="bg-slate-100">
                    {tb.columns.map((c) => (
                      <th
                        key={c}
                        className="border border-slate-200 px-2 py-1 text-left font-bold text-slate-700"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tb.rows.map((r, i) => (
                    <tr key={i} className={i % 2 ? "bg-white" : "bg-slate-50/60"}>
                      {r.map((c, j) => (
                        <td
                          key={j}
                          className="border border-slate-200 px-2 py-1 align-top text-slate-700"
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tb.examTip && (
              <p className="mt-2 rounded-lg bg-white px-2.5 py-1.5 text-[13px] font-medium text-brand-700">
                ✍️ {tb.examTip}
              </p>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}

/** topicMapLinks 와 같은 규칙 — 괄호 병기·공백·기호를 털어낸다. */
function norm(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/'’]/g, "");
}
