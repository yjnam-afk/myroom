import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { DOMAINS } from "@/lib/domains";
import { readFlow } from "@/lib/readFlow";
import { ResumeLink } from "./ReadTracker";

/**
 * 지하철 — 술술 읽기. 과목을 고르면 그 과목 토픽이 토픽 지도 차례로 한 쪽에 이어진다.
 * 2026-11-15 "플래시 카드는 안되겠다. 그냥 술술 읽어서 계속 머리에 들어오도록" — 카드 뒤집기·「외웠어요」를 없앴다.
 */
export default function CommutePage() {
  const subjects = DOMAINS.map((d) => {
    const flow = readFlow(d.code);
    return { ...d, n: flow.length, first: flow.slice(0, 3).map((b) => b.title.replace(/\s*\(.*$/, "")) };
  }).filter((s) => s.n > 0);
  return (
    <div>
      <PageHeader title="🚇 지하철 — 술술 읽기" desc="누를 것 없이 내려 읽기만 하면 됩니다. 토픽은 지도 차례대로, 꼬리에 꼬리를 물고 이어집니다." />
      <ResumeLink />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {subjects.map((s) => (
          <Link key={s.code} href={`/commute/${s.code}`} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-400">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold text-slate-900">{s.label}</span>
              <span className="text-xs text-slate-400">{s.n}토픽</span>
            </div>
            <p className="mt-1 truncate text-sm text-slate-500">{s.first.join(" → ")} → …</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
