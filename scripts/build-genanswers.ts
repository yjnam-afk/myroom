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

/**
 * 강정배 작성론의 3단표(구분 2 : 키워드 2 : 설명 6) 적용.
 * 교재 표가 2열(항목/설명)이면 설명의 첫 조각(' / ' 앞)을 키워드 열로 승격해 3열로 만든다.
 * 3열 이상 표는 이미 3단표 꼴이므로 그대로 둔다(교재 원문 유지).
 */
function to3Col(tb: any): { headers: string[]; rows: string[][] } {
  if (tb.headers.length !== 2) return tb;
  const headers = [tb.headers[0], "키워드", tb.headers[1]];
  const rows = tb.rows.map((r: string[]) => {
    const parts = String(r[1] || "").split(" / ");
    if (parts.length > 1 && parts[0].length <= 45) {
      return [r[0], parts[0], parts.slice(1).join(" / ")];
    }
    return [r[0], "–", r[1]];
  });
  return { headers, rows };
}

function mdTable(tbRaw: any): string {
  const tb = to3Col(tbRaw);
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
const isP1 = (q: any) => q.period === "1교시";

/** 서론(정의 2줄 34자 + 특징) — 1교시 서론이자 2교시 도입부 타입①(1교시 상속·확장)의 뼈대 */
function introLines(sn: any): string[] {
  const parts: string[] = [];
  if (sn.defPair?.length) {
    sn.defPair.forEach((p: any, i: number) => {
      parts.push(`${GA[i]}. ${p.name}: ${p.def}`);
      if (p.features?.length) parts.push(`- 특징) ${p.features.join(", ")}`);
    });
  } else {
    if (sn.defShort) parts.push(`- ${sn.defShort}`);
    if (sn.features?.length) parts.push(`- 특징) ${sn.features.join(", ")}`);
  }
  return parts;
}

function buildFromSubnote(q: any, sn: any): string {
  const parts: string[] = [];
  const defTitle = sn.lead ? `${sn.lead}의 정의` : `${sn.title}의 정의`;
  const tables: any[] = sn.tables || [];
  parts.push(`문) ${q.text.trim()}`);
  parts.push("");
  parts.push("답)");
  parts.push("");

  if (isP1(q)) {
    // ── 1교시: 정의(2줄 34자+특징) → 개념도·구성요소(일도일표) → 플러스 알파 ──
    parts.push(`## 1. ${defTitle}`);
    parts.push(...introLines(sn));
    parts.push("");
    parts.push(`## 2. ${bareTitle(sn.title)}의 개념도 및 구성요소`);
    parts.push("가. 개념도 — 교재 슬라이드의 개념도를 답안지 6줄 내 도식으로 옮겨 그린다");
    tables.forEach((tb: any, ti: number) => {
      parts.push("");
      parts.push(`${GA[ti + 1] || "•"}. ${tb.caption || "구성요소"}`);
      parts.push(mdTable(tb));
    });
    if (sn.notes?.length) {
      parts.push("");
      parts.push("## 3. 플러스 알파 — 추가 어필");
      for (const n of sn.notes) parts.push(`- ${n}`);
    }
  } else {
    // ── 2·3·4교시: 서론(도입부) → 본론1 → 본론2(승부처) → 결론(+α) ──
    // 도입부 타입① '1교시 상속·확장': 정의 2줄 + 특징으로 시작.
    parts.push(`## 1. 서론 — ${defTitle}`);
    parts.push(...introLines(sn));
    parts.push("");
    const body1 = tables.slice(0, 1);
    const body2 = tables.slice(1);
    parts.push(`## 2. 본론1 — ${bareTitle(sn.title)}의 개념도 및 구성요소`);
    parts.push("가. 개념도 — 교재 슬라이드의 개념도를 답안지 6줄 내 도식으로 옮겨 그린다");
    body1.forEach((tb: any, ti: number) => {
      parts.push("");
      parts.push(`${GA[ti + 1] || "•"}. ${tb.caption || "구성요소"}`);
      parts.push(mdTable(tb));
    });
    if (body2.length) {
      parts.push("");
      parts.push(
        "## 3. 본론2 — 승부처 (물어본 것을 안 물어본 것보다 많게)",
      );
      body2.forEach((tb: any, ti: number) => {
        parts.push("");
        parts.push(`${GA[ti] || "•"}. ${tb.caption || "상세"}`);
        parts.push(mdTable(tb));
      });
    }
    if (sn.notes?.length) {
      parts.push("");
      parts.push(`## ${body2.length ? 4 : 3}. 결론 — 차별화(+α)`);
      for (const n of sn.notes) parts.push(`- ${n}`);
    }
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

/** 예전 토픽 sections → 3단표(구분/두음·키워드/설명) 마크다운 */
function sectionsTable(sections: any[]): string {
  const lines = [
    "| 구분 | 두음 | 핵심 키워드 |",
    "|---|---|---|",
  ];
  for (const s of sections.slice(0, 6)) {
    lines.push(
      `| ${esc(cut(s.label || "-", 30))} | ${esc(s.mnemonic || "–")} | ${esc(
        cut((s.keywords || []).slice(0, 10).join(" · "), 160),
      )} |`,
    );
  }
  return lines.join("\n");
}

function buildFromTopic(q: any, t: any): string {
  const d = details[t.id] || {};
  const def = cleanOne(d.detail) || t.summary || "";
  const feat = (d.featureKeywords || []).filter(Boolean);
  const sections = (d.sections || []).filter(
    (s: any) => s?.keywords?.length || s?.mnemonic,
  );
  const plus = (d.plusKeywords || []).filter(Boolean);
  const parts: string[] = [];
  parts.push(`문) ${q.text.trim()}`);
  parts.push("");
  parts.push("답)");
  parts.push("");

  const defBlock = () => {
    if (def) parts.push(`- ${def}`);
    if (feat.length) parts.push(`- 특징) ${feat.slice(0, 4).join(", ")}`);
  };

  if (isP1(q)) {
    // ── 1교시: 정의+특징 → 핵심 구성(3단표) → 플러스 알파 ──
    parts.push(`## 1. ${bareTitle(t.title)}의 정의`);
    defBlock();
    if (sections.length) {
      parts.push("");
      parts.push(`## 2. ${bareTitle(t.title)}의 핵심 구성·키워드`);
      parts.push(sectionsTable(sections));
    }
    if (plus.length || d.memo) {
      parts.push("");
      parts.push("## 3. 플러스 알파 — 추가 어필");
      if (plus.length) parts.push(`- ${plus.slice(0, 6).join(" · ")}`);
      if (d.memo) parts.push(`- ${cut(String(d.memo).trim(), 160)}`);
    }
  } else {
    // ── 2·3·4교시: 서론(도입부) → 본론1(3단표) → 본론2(승부처) → 결론(+α) ──
    parts.push(`## 1. 서론 — ${bareTitle(t.title)}의 정의`);
    defBlock();
    if (sections.length) {
      parts.push("");
      parts.push(`## 2. 본론1 — ${bareTitle(t.title)}의 핵심 구성·키워드`);
      parts.push(sectionsTable(sections.slice(0, 3)));
      if (sections.length > 3) {
        parts.push("");
        parts.push("## 3. 본론2 — 승부처 (물어본 것을 안 물어본 것보다 많게)");
        parts.push(sectionsTable(sections.slice(3)));
      }
    }
    if (plus.length || d.memo) {
      parts.push("");
      parts.push(
        `## ${sections.length > 3 ? 4 : 3}. 결론 — 차별화(+α)`,
      );
      if (plus.length) parts.push(`- ${plus.slice(0, 6).join(" · ")}`);
      if (d.memo) parts.push(`- ${cut(String(d.memo).trim(), 160)}`);
    }
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
