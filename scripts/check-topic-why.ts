/**
 * 「왜 있나」(src/data/topicWhy/{과목}.json)와 처음 보는 사람용 풀이(src/data/topicBasics/{과목}.json) 검사 —
 * 빠진 토픽·없는 제목·길이·금지어(비유·시험 요령).
 *
 *   npx tsx scripts/check-topic-why.ts            # 전체 검사
 *   npx tsx scripts/check-topic-why.ts SE         # 한 과목만
 *   npx tsx scripts/check-topic-why.ts --dump SE  # 그 과목 토픽마다 쓸 때 볼 자료(정의·특징·표 머리·키워드·등장배경)
 */
import fs from "fs";
import path from "path";
import { SUBNOTES } from "../src/data/textbookSubnotes";
import { subnoteExtraFor } from "../src/data/subnoteExtras";
import details from "../src/data/topicDetails.json";

const DIR = path.join(__dirname, "../src/data/topicWhy");
const args = process.argv.slice(2);
const dump = args[0] === "--dump";
const only = dump ? args[1] : args[0];
const COURSES = [...new Set(SUBNOTES.map((s) => s.course))].filter((c) => !only || c === only);

/** 비유·장면·시험 요령 — 쓰지 않기로 한 말 */
const BAN = /마치 |비유|빗대|~?라고 생각하면|같다고 보면|식당|요리사|주방|택배|우체국|도서관 사서|교통경찰|신호등|사장님|비서|이삿짐|출제|시험에|답안|채점|암기|외우|두음/;

if (dump) {
  const D = details as Record<string, { detail?: string }>;
  for (const c of COURSES)
    for (const s of SUBNOTES.filter((x) => x.course === c)) {
      const out: string[] = [`### ${s.title}`, `정의: ${s.definition.replace(/\*\*/g, "")}`];
      if (s.features?.length) out.push(`특징: ${s.features.join(" / ")}`);
      for (const p of s.defPair ?? s.subDefs ?? []) out.push(`개념 ${p.name}: ${p.def}`);
      for (const t of s.tables) out.push(`표 「${t.caption}」 [${t.headers.join(" | ")}] — ${[...new Set(t.rows.map((r) => (r[0] || "").replace(/\n/g, " ")))].slice(0, 10).join(", ")}`);
      if (s.keywords?.length) out.push(`키워드: ${s.keywords.join(", ")}`);
      const bg = /\[등장배경[^\]]*\]\n([\s\S]*?)(?=\n\[|$)/.exec((s.topicId && D[s.topicId]?.detail) || "");
      if (bg) out.push(`등장배경(기필반): ${bg[1].replace(/\n/g, " ").slice(0, 300)}`);
      const g = subnoteExtraFor(s.topicId, s.title)?.guide;
      if (g?.mechanism) out.push(`참고(예전 학습 카드 — 사실 확인용, 문장을 옮기지 말 것): ${g.mechanism.slice(0, 260)}`);
      console.log(out.join("\n") + "\n");
    }
  process.exit(0);
}

let bad = 0;
for (const c of COURSES) {
  const f = path.join(DIR, `${c}.json`);
  const titles = SUBNOTES.filter((s) => s.course === c).map((s) => s.title);
  if (!fs.existsSync(f)) { console.log(`${c}: 파일 없음 (${titles.length}개)`); continue; }
  const o = JSON.parse(fs.readFileSync(f, "utf8")) as Record<string, string>;
  const T = new Set(titles);
  const miss = titles.filter((t) => !o[t]);
  const unknown = Object.keys(o).filter((k) => !T.has(k));
  const issues: string[] = [];
  for (const [k, v] of Object.entries(o)) {
    const n = v.length;
    const sent = v.split(/(?<=[다)]\.)\s+/).filter(Boolean).length;
    if (n < 70 || n > 280) issues.push(`  길이 ${n}: ${k}`);
    if (sent < 2 || sent > 3) issues.push(`  문장 ${sent}개: ${k}`);
    if (!/[다)]\.$/.test(v)) issues.push(`  끝맺음: ${k}`);
    const m = BAN.exec(v);
    if (m) issues.push(`  금지어 「${m[0]}」: ${k}`);
    if (/[—–→]/.test(v)) issues.push(`  기호(— →): ${k}`);
  }
  console.log(`${c}: ${Object.keys(o).length}/${titles.length}` + (miss.length ? ` · 빠짐 ${miss.length}` : "") + (unknown.length ? ` · 없는 제목 ${unknown.length}` : "") + (issues.length ? ` · 지적 ${issues.length}` : ""));
  miss.slice(0, 200).forEach((t) => console.log(`  빠짐: ${t}`));
  unknown.forEach((t) => console.log(`  없는 제목: ${t}`));
  issues.forEach((x) => console.log(x));
  bad += miss.length + unknown.length + issues.length;
}
// ── 처음 보는 사람용 풀이(topicBasics) — terms 0~5 · how 3~7문장 · ex 선택
const BDIR = path.join(__dirname, "../src/data/topicBasics");
for (const c of COURSES) {
  const f = path.join(BDIR, `${c}.json`);
  const titles = SUBNOTES.filter((s) => s.course === c).map((s) => s.title);
  if (!fs.existsSync(f)) { console.log(`풀이 ${c}: 파일 없음 (${titles.length}개)`); continue; }
  const o = JSON.parse(fs.readFileSync(f, "utf8")) as Record<string, { terms: string[][]; how: string[]; ex?: string }>;
  const T = new Set(titles);
  const miss = titles.filter((t) => !o[t]);
  const unknown = Object.keys(o).filter((k) => !T.has(k));
  const issues: string[] = [];
  for (const [k, v] of Object.entries(o)) {
    if (!Array.isArray(v.terms) || v.terms.length > 5 || v.terms.some((t) => !Array.isArray(t) || t.length !== 2 || !t[0] || !t[1])) issues.push(`  terms 꼴: ${k}`);
    if (!Array.isArray(v.how) || v.how.length < 3 || v.how.length > 7) issues.push(`  how ${v.how?.length}문장: ${k}`);
    const all = [...(v.terms ?? []).map((t) => t.join(" ")), ...(v.how ?? []), v.ex ?? ""];
    for (const x of v.how ?? []) {
      if (x.length < 12 || x.length > 190) issues.push(`  how 길이 ${x.length}: ${k}`);
      if (!/[다)]\.$/.test(x)) issues.push(`  how 끝맺음: ${k} — ${x.slice(-12)}`);
    }
    if (v.ex !== undefined && (v.ex.length < 30 || v.ex.length > 260)) issues.push(`  ex 길이 ${v.ex.length}: ${k}`);
    for (const x of all) {
      const m = BAN.exec(x);
      if (m) issues.push(`  금지어 「${m[0]}」: ${k}`);
      if (/[—–→]/.test(x)) issues.push(`  기호(— →): ${k}`);
    }
  }
  console.log(`풀이 ${c}: ${Object.keys(o).length}/${titles.length}` + (miss.length ? ` · 빠짐 ${miss.length}` : "") + (unknown.length ? ` · 없는 제목 ${unknown.length}` : "") + (issues.length ? ` · 지적 ${issues.length}` : ""));
  miss.slice(0, 200).forEach((t) => console.log(`  빠짐: ${t}`));
  unknown.forEach((t) => console.log(`  없는 제목: ${t}`));
  issues.forEach((x) => console.log(x));
  bad += miss.length + unknown.length + issues.length;
}
console.log(bad ? `\n고칠 것 ${bad}건` : "\n모두 통과");
