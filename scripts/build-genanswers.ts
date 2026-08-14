/**
 * genAnswers.json 생성기 — 전 문항 클로드 모범답안 자동 생성. (npx tsx로 실행)
 *
 * 우선순위: 수작업 모범답안(modelAnswers.json) 있으면 건너뜀
 *  → 교재 서브노트 매칭 시 답안지 템플릿 형식으로 생성
 *  → 없으면 예전 토픽 자료(topics.json + topicDetails.json)로 생성.
 * 결과는 { qid: { title, source, answer } } — 문제풀이 페이지에서 병합 표시.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { SUBNOTES } from "../src/data/textbookSubnotes";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const questions = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/questions.json"), "utf8"),
);
const modelAnswers = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/modelAnswers.json"), "utf8"),
);
const topics = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/topics.json"), "utf8"),
);
const details = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/topicDetails.json"), "utf8"),
);

// ── 매칭(문제 지문 ⊃ 제목) — matchSubnote.ts와 동일 규칙 ─────────────────
const bareTitle = (s: string) =>
  String(s || "")
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
const low = (s: string) => bareTitle(s).toLowerCase();

const SN_INDEX: { sn: any; b: string }[] = [];
for (const s of SUBNOTES as any[]) {
  const b = low(s.title);
  if (b.length >= 3) SN_INDEX.push({ sn: s, b });
  for (const p of s.defPair || []) {
    const pb = low(p.name);
    if (pb.length >= 3) SN_INDEX.push({ sn: s, b: pb });
  }
}
const TP_INDEX: { t: any; b: string }[] = [];
for (const t of topics) {
  const b = low(t.title);
  if (b.length >= 4) TP_INDEX.push({ t, b }); // 예전 토픽은 4자 이상만(오탐 억제)
}
function matchLongest<T>(text: string, index: { b: string }[] & T[]): any {
  const t = text.toLowerCase().replace(/\s+/g, " ");
  let best: any;
  for (const x of index as any[]) {
    if (t.includes(x.b) && (!best || x.b.length > best.b.length)) best = x;
  }
  return best;
}

// ── 마크다운 빌더 ────────────────────────────────────────────────────────
const esc = (s: string) => String(s || "").replace(/\|/g, "／").replace(/\n/g, " ");
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

function mdTable(tb: any): string {
  const headers = tb.headers.map((h: string) => esc(cut(h, 40)));
  const lines = [
    `| ${headers.join(" | ")} |`,
    `|${headers.map(() => "---").join("|")}|`,
  ];
  for (const r of tb.rows.slice(0, 10)) {
    lines.push(`| ${r.map((c: string) => esc(cut(c, 90))).join(" | ")} |`);
  }
  if (tb.rows.length > 10) lines.push(`| … 외 ${tb.rows.length - 10}행 | | |`);
  return lines.join("\n");
}

const GA = "가나다라마바사아".split("");

function buildFromSubnote(q: any, sn: any): string {
  const parts: string[] = [];
  parts.push(`문) ${q.text.trim()}`);
  parts.push("");
  parts.push("답)");
  parts.push("");
  parts.push(`## 1. ${sn.lead ? `${sn.lead}의 정의` : `${sn.title}의 정의`}`);
  if (sn.defPair?.length) {
    sn.defPair.forEach((p: any, i: number) => {
      parts.push(`${GA[i]}. ${p.name}: ${p.def}`);
      if (p.features?.length) parts.push(`- 특징) ${p.features.join(", ")}`);
    });
  } else {
    if (sn.defShort) parts.push(`- ${sn.defShort}`);
    if (sn.features?.length) parts.push(`- 특징) ${sn.features.join(", ")}`);
  }
  parts.push("");
  parts.push(`## 2. ${bareTitle(sn.title)}의 개념도 및 구성요소`);
  parts.push("가. 개념도 — 교재 슬라이드의 개념도를 답안지 6줄 내 도식으로 옮겨 그린다");
  (sn.tables || []).forEach((tb: any, ti: number) => {
    parts.push("");
    parts.push(`${GA[ti + 1] || "•"}. ${tb.caption || "구성요소"}`);
    parts.push(mdTable(tb));
  });
  if (sn.notes?.length) {
    parts.push("");
    parts.push("## 3. 플러스 알파 — 추가 어필");
    for (const n of sn.notes) parts.push(`- ${n}`);
  }
  parts.push("");
  parts.push("**(끝)**");
  return parts.join("\n");
}

function cleanOne(src: string) {
  let s = String(src || "").replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return "";
  const marker = s.match(/\[[^\]]*정의\s*\]\s*(.+)/);
  if (marker) s = marker[1].trim();
  s = s
    .split(
      /\s*(?:\[[^\]]{1,24}\]|\(목적\)|\(특징\)|-{3,}|▶|- ?유형|- ?종류|- ?구성|·\s?유형)/,
    )[0]
    .trim();
  s = s.replace(/^[^:：]{1,45}[:：]\s+/, "").trim();
  s = s.replace(/\s*\([^)]*$/, "").trim();
  s = s.replace(/[\s\-–;,·]+$/, "").trim();
  return cut(s, 160);
}

function buildFromTopic(q: any, t: any): string {
  const d = details[t.id] || {};
  const def = cleanOne(d.detail) || t.summary || "";
  const parts: string[] = [];
  parts.push(`문) ${q.text.trim()}`);
  parts.push("");
  parts.push("답)");
  parts.push("");
  parts.push(`## 1. ${bareTitle(t.title)}의 정의`);
  if (def) parts.push(`- ${def}`);
  const feat = (d.featureKeywords || []).filter(Boolean);
  if (feat.length) parts.push(`- 특징) ${feat.slice(0, 4).join(", ")}`);
  const sections = (d.sections || []).filter(
    (s: any) => s?.keywords?.length || s?.mnemonic,
  );
  if (sections.length) {
    parts.push("");
    parts.push(`## 2. ${bareTitle(t.title)}의 핵심 구성·키워드`);
    sections.slice(0, 5).forEach((s: any, i: number) => {
      const mn = s.mnemonic ? ` [${s.mnemonic}]` : "";
      parts.push(
        `${GA[i] || "•"}. ${s.label}${mn}: ${(s.keywords || []).slice(0, 10).join(" · ")}`,
      );
    });
  }
  const plus = (d.plusKeywords || []).filter(Boolean);
  if (plus.length || d.memo) {
    parts.push("");
    parts.push("## 3. 플러스 알파 — 추가 어필");
    if (plus.length) parts.push(`- ${plus.slice(0, 6).join(" · ")}`);
    if (d.memo) parts.push(`- ${cut(String(d.memo).trim(), 160)}`);
  }
  parts.push("");
  parts.push("**(끝)**");
  return parts.join("\n");
}

// ── 생성 ─────────────────────────────────────────────────────────────────
const out: Record<string, { title: string; source: string; answer: string }> = {};
let bySn = 0,
  byTp = 0,
  skip = 0;
for (const q of questions) {
  if (modelAnswers[q.id]) continue; // 수작업 모범답안 우선
  const sn = matchLongest(q.text, SN_INDEX as any);
  if (sn) {
    out[q.id] = {
      title: sn.sn.title,
      source: `교재 서브노트 — ${sn.sn.title}`,
      answer: buildFromSubnote(q, sn.sn),
    };
    bySn++;
    continue;
  }
  const tp = matchLongest(q.text, TP_INDEX as any);
  if (tp) {
    out[q.id] = {
      title: tp.t.title,
      source: `토픽 자료 — ${tp.t.title}`,
      answer: buildFromTopic(q, tp.t),
    };
    byTp++;
    continue;
  }
  skip++;
}

const outPath = path.join(root, "src/data/genAnswers.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 1), "utf8");
console.log(
  `genAnswers.json: ${Object.keys(out).length}건 (교재 ${bySn} + 토픽 ${byTp}, 미매칭 ${skip}, ${(fs.statSync(outPath).size / 1024).toFixed(0)}KB)`,
);
