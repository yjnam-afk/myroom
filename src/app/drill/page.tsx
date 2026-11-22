import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { DOMAINS } from "@/lib/domains";
import { drillCards } from "@/lib/drillCard";
import { Today } from "./DrillClient";

export const metadata = { title: "암기 연습 — 나의 공간" };

/**
 * 암기 연습 — 사용자의 「정보관리기술사 토픽 암기 공부법」 순서대로(2026-11-23 "사이트에 저 순서대로 공부할 수 있도록 자료를 만들어주거나 수집해줘").
 * 키워드 한 장 → 도식화 → 목차와 도식만 빠르게 쓰기. 자료는 교재 서브노트·개념도·실제 출제 지문에서 모은 것이다(lib/drillCard.ts).
 */
const STEPS: [string, string, string[]][] = [
  ["1", "토픽별 키워드 한 장", ["모든 토픽을 같은 틀로: 정의 · 구성요소 · 특징 · 장단점 · 적용 사례", "토픽당 핵심 키워드 5~7개만", "문장이 아니라 키워드 위주로"]],
  ["2", "도식화 연습", ["키워드를 보며 백지에 구조도나 표를 그려 보기", "그린 뒤 펼쳐서 교재 그림·개념도와 견주기"]],
  ["3", "목차와 도식만 빠르게 쓰기", ["답안 전체를 쓰려 하지 않기", "하루 3~4개 토픽, 목차와 도식만 5~10분", "익숙해지면 전체 답안으로 넓히기"]],
  ["4", "마음가짐", ["외우는 양은 줄이고 같은 틀을 반복", "틀이 손에 익으면 첫 줄이 막히지 않음"]],
];

export default function DrillPage() {
  const subjects = DOMAINS.map((d) => {
    const cards = drillCards(d.code).filter((c) => c.ready);
    return { code: d.code, label: d.label, topics: cards.map((c) => ({ id: c.id, title: c.title.replace(/\s*\(.*$/, ""), priority: c.priority })) };
  }).filter((s) => s.topics.length > 0);
  return (
    <div className="break-keep">
      <PageHeader title="✏️ 암기 연습" desc="키워드 한 장 → 도식화 → 목차와 도식만 빠르게 쓰기. 토픽마다 같은 틀로 반복합니다." />
      <Today subjects={subjects} />

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {STEPS.map(([n, t, lines]) => (
          <div key={n} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-sm font-bold text-slate-900">
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] text-white">{n}</span>
              {t}
            </p>
            <ul className="mt-1.5 space-y-0.5 text-[13px] leading-6 text-slate-600">
              {lines.map((l) => (
                <li key={l}>· {l}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-6 text-sm font-bold text-slate-800">과목별로 차례대로</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {subjects.map((s) => (
          <Link key={s.code} href={`/drill/${s.code}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:border-brand-400">
            <span className="font-bold text-slate-900">{s.label}</span>
            <span className="ml-1.5 text-xs text-slate-400">{s.topics.length}토픽</span>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        자료는 교재 서브노트(정의·특징·표·키워드), 손글씨·답안지 개념도와 교재 그림, 실제 출제 지문에서 모은 것입니다. 교재에 그 칸이 없는 토픽은 비워 두었습니다 — 장단점 표가 있는 토픽은 열에 하나꼴입니다.
      </p>
    </div>
  );
}
