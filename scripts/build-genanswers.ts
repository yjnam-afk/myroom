/**
 * genAnswers.json 생성기 — 전 문항 클로드 모범답안 자동 생성. (npx tsx로 실행)
 *
 * 우선순위: 수작업 모범답안(modelAnswers.json) 있으면 건너뜀
 *  → 교재 서브노트 매칭 시 답안지 템플릿 형식으로 생성
 *  → 없으면 예전 토픽 자료(topics.json + topicDetails.json)로 생성.
 *
 * 강정배 작성론 적용:
 *  - 1교시: 정의 2줄(34자)+특징 → 개념도·구성요소(3단표) → 플러스 알파
 *  - 2·3·4교시 도입부 자동 판별(6타입 중 자동화 가능한 것만):
 *    ③ Why 관점  — 보안 도메인. 억지정의 금지, 위협 배경·필요성으로 서론
 *    ⑤ 병렬식    — 지문에 가./나./다. 다항 요구. 목차 = 지문 그대로
 *    ⑥ 발전단계  — 절차·단계·과정형 지문. 흐름(→)을 서론에 제시
 *    ① 상속·확장 — 그 외 기본. 정의 2줄+특징으로 시작
 *    (②정의+도식, ④로드맵은 도식이 필요해 자동 생성에서 제외)
 *  - 표는 3단표(구분/키워드/설명) 지향, 표 안 줄 구분은 '–'
 * 결과: { qid: { title, source, answer } } — 문제풀이 페이지에서 병합 표시.
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
function matchLongest(text: string, index: { b: string }[]): any {
  const t = text.toLowerCase().replace(/\s+/g, " ");
  let best: any;
  for (const x of index as any[]) {
    if (t.includes(x.b) && (!best || x.b.length > best.b.length)) best = x;
  }
  return best;
}

// ── 지문 분석 ────────────────────────────────────────────────────────────
const isP1 = (q: any) => q.period === "1교시";
/** 보안 도메인 여부 — 도입부 타입③ Why 관점(억지정의 금지) */
const isSecQ = (q: any, domain?: string) =>
  /보안/.test(domain || "") || /보안/.test(q.category || "");
/** 지문 속 가./나./다. 다항 요구 추출 — 도입부 타입⑤ 병렬식(목차 = 지문 그대로) */
function subItems(text: string): string[] {
  const out: string[] = [];
  const re = /(?:^|\n)\s*([가나다라마바])[.)]\s*([^\n]+)/g;
  let m;
  while ((m = re.exec(text))) out.push(m[2].trim().replace(/\s+/g, " "));
  return out.length >= 2 ? out : [];
}
/** 절차·단계·과정형 지문 — 도입부 타입⑥ 발전단계 */
const isSeqQ = (text: string) =>
  /절차|단계|과정|프로세스|수행 ?순서|발전|생명주기|라이프사이클/.test(text);

// ── 마크다운 빌더 ────────────────────────────────────────────────────────
const esc = (s: string) => String(s || "").replace(/\|/g, "／").replace(/\n/g, " ");
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
/** 표 안 항목 구분은 '/' 대신 '–' (작성론: 표는 점 대신 '–'로 줄 구분) */
const dashJoin = (s: string) =>
  String(s || "")
    .split(" / ")
    .map((x) => x.trim())
    .filter(Boolean)
    .join(" – ");

/**
 * 3단표(구분 2 : 키워드 2 : 설명 6) 적용.
 * 2열(항목/설명) 표는 설명의 첫 조각을 키워드 열로 승격해 3열로 만든다.
 * 3열 이상 표는 교재 원문 그대로(셀 정리만).
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
    lines.push(
      `| ${r.map((c: string, ci: number) => esc(cut(ci >= 1 ? dashJoin(c) : c, 140))).join(" | ")} |`,
    );
  }
  if (tb.rows.length > 10)
    lines.push(`| … 외 ${tb.rows.length - 10}행 |${tb.headers.map(() => " ").join("|")}|`);
  return lines.join("\n");
}

const GA = "가나다라마바사아".split("");

/** 절차형 표에서 흐름 한 줄(A → B → C) 뽑기 — 발전단계 서론용 */
function flowLine(tables: any[]): string {
  const seqTb = tables.find((tb: any) =>
    /절차|단계|프로세스|과정|흐름/.test(tb.caption || ""),
  );
  if (!seqTb) return "";
  const steps = seqTb.rows
    .map((r: string[]) =>
      String(r[0] || "")
        .replace(/^[①-⑳]\s*/, "")
        .replace(/^\d+[.)]\s*/, "")
        .split("/")[0]
        .trim(),
    )
    .filter(Boolean)
    .slice(0, 7);
  return steps.length >= 3 ? steps.join(" → ") : "";
}

/** 항목 텍스트 ↔ 표 겹침 점수 — 병렬식 본론에서 표를 지문 항목에 배정 */
function overlapScore(item: string, tb: any): number {
  const tokens = new Set(
    item
      .toLowerCase()
      .split(/[^a-z0-9가-힣]+/)
      .filter((t) => t.length >= 2),
  );
  const hay = `${tb.caption || ""} ${tb.headers.join(" ")}`.toLowerCase();
  let n = 0;
  for (const t of tokens) if (hay.includes(t)) n++;
  return n;
}

// ── 교재 서브노트 기반 생성 ──────────────────────────────────────────────
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
function defOneLiner(sn: any): string[] {
  if (sn.defPair?.length)
    return sn.defPair.map((p: any) => `- 정의(${p.name}): ${p.def}`);
  return sn.defShort ? [`- 정의: ${sn.defShort}`] : [];
}

function buildFromSubnote(q: any, sn: any): string {
  const bt = bareTitle(sn.title);
  const tables: any[] = sn.tables || [];
  const parts: string[] = [];
  parts.push(`문) ${q.text.trim()}`);
  parts.push("");
  parts.push("답)");
  parts.push("");

  if (isP1(q)) {
    // ── 1교시: 정의(2줄 34자+특징) → 개념도·구성요소 → 플러스 알파 ──
    parts.push(`## 1. ${sn.lead ? `${sn.lead}의 정의` : `${sn.title}의 정의`}`);
    parts.push(...introLines(sn));
    parts.push("");
    parts.push(`## 2. ${bt}의 개념도 및 구성요소`);
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
    parts.push("");
    parts.push("**(끝)**");
    return parts.join("\n");
  }

  // ── 2·3·4교시 ──
  const sec = isSecQ(q, sn.course === "SC" ? "보안" : "");
  const items = subItems(q.text);
  const seq = isSeqQ(q.text);
  let no = 1;

  // 서론(도입부) — ③보안 Why > ⑤병렬식 > ⑥발전단계 > ①상속·확장
  if (sec) {
    const modifier = (sn.lead || "").split(",")[0].trim();
    parts.push(`## ${no++}. 서론 — ${bt}의 필요성 (Why 관점)`);
    parts.push(
      `- (위협 배경) 사이버 공격의 지능화·상시화로 ${modifier ? `${modifier}인 ` : ""}${bt}의 중요성 증대`,
    );
    if (sn.features?.length)
      parts.push(`- (필요성) ${sn.features.join(", ")} 확보 관점의 대응 요구`);
  } else if (items.length) {
    parts.push(`## ${no++}. 서론 — 질문 요구사항 정리 (병렬식 도입)`);
    parts.push(`- 요구: ${items.map((it, i) => `${GA[i]}. ${cut(it, 40)}`).join(" / ")}`);
    parts.push(...defOneLiner(sn));
  } else if (seq) {
    parts.push(`## ${no++}. 서론 — ${bt}의 수행 흐름 (발전단계 도입)`);
    parts.push(...defOneLiner(sn));
    const fl = flowLine(tables);
    if (fl) parts.push(`- 흐름: ${fl}`);
  } else {
    parts.push(
      `## ${no++}. 서론 — ${sn.lead ? `${sn.lead}의 정의` : `${sn.title}의 정의`} (1교시 상속·확장)`,
    );
    parts.push(...introLines(sn));
  }
  parts.push("");

  // 본론 — 병렬식이면 목차 = 지문 그대로, 표를 항목별 배정. 아니면 본론1/본론2.
  if (items.length) {
    // 각 표를 겹침 점수가 가장 높은 항목에 배정(0점이면 순서대로 분배)
    const buckets: any[][] = items.map(() => []);
    tables.forEach((tb: any, ti: number) => {
      let bi = 0,
        bs = -1;
      items.forEach((it, i) => {
        const s = overlapScore(it, tb);
        if (s > bs) {
          bs = s;
          bi = i;
        }
      });
      if (bs <= 0) bi = Math.min(ti, items.length - 1);
      buckets[bi].push(tb);
    });
    items.forEach((it, i) => {
      parts.push(`## ${no++}. ${GA[i]}. ${it}`);
      if (i === 0 && sec) parts.push(...defOneLiner(sn));
      if (buckets[i].length) {
        buckets[i].forEach((tb: any) => {
          parts.push("");
          parts.push(`■ ${tb.caption || "관련 표"}`);
          parts.push(mdTable(tb));
        });
      } else {
        parts.push(`- 교재 키워드로 전개: ${(sn.keywords || []).slice(0, 6).join(" · ")}`);
      }
      parts.push("");
    });
  } else {
    const body1 = tables.slice(0, 1);
    const body2 = tables.slice(1);
    parts.push(
      `## ${no++}. 본론1 — ${bt}의 ${sec ? "정의 및 " : ""}개념도·구성요소`,
    );
    if (sec) parts.push(...defOneLiner(sn));
    parts.push("가. 개념도 — 교재 슬라이드의 개념도를 답안지 6줄 내 도식으로 옮겨 그린다");
    body1.forEach((tb: any, ti: number) => {
      parts.push("");
      parts.push(`${GA[ti + 1] || "•"}. ${tb.caption || "구성요소"}`);
      parts.push(mdTable(tb));
    });
    if (body2.length) {
      parts.push("");
      parts.push(`## ${no++}. 본론2 — 승부처 (물어본 것을 안 물어본 것보다 많게)`);
      body2.forEach((tb: any, ti: number) => {
        parts.push("");
        parts.push(`${GA[ti] || "•"}. ${tb.caption || "상세"}`);
        parts.push(mdTable(tb));
      });
    }
    parts.push("");
  }

  // 결론(+α)
  if (sn.notes?.length) {
    parts.push(`## ${no++}. 결론 — 차별화(+α)`);
    for (const n of sn.notes) parts.push(`- ${n}`);
    parts.push("");
  }
  parts.push("**(끝)**");
  return parts.join("\n");
}

// ── 예전 토픽 기반 생성 ──────────────────────────────────────────────────
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

/** 예전 토픽 sections → 3단표(구분/두음/핵심 키워드) */
function sectionsTable(sections: any[]): string {
  const lines = ["| 구분 | 두음 | 핵심 키워드 |", "|---|---|---|"];
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
  const bt = bareTitle(t.title);
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

  if (isP1(q)) {
    parts.push(`## 1. ${bt}의 정의`);
    if (def) parts.push(`- ${def}`);
    if (feat.length) parts.push(`- 특징) ${feat.slice(0, 4).join(", ")}`);
    if (sections.length) {
      parts.push("");
      parts.push(`## 2. ${bt}의 핵심 구성·키워드`);
      parts.push(sectionsTable(sections));
    }
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

  // 2·3·4교시 — 도입부 판별(③⑤⑥①), 본론 병렬식이면 목차 = 지문 그대로
  const sec = isSecQ(q, t.category);
  const items = subItems(q.text);
  const seq = isSeqQ(q.text);
  let no = 1;

  if (sec) {
    parts.push(`## ${no++}. 서론 — ${bt}의 필요성 (Why 관점)`);
    parts.push(`- (위협 배경) 사이버 공격의 지능화·상시화로 ${bt} 대응의 중요성 증대`);
    if (feat.length)
      parts.push(`- (필요성) ${feat.slice(0, 4).join(", ")} 확보 관점의 대응 요구`);
  } else if (items.length) {
    parts.push(`## ${no++}. 서론 — 질문 요구사항 정리 (병렬식 도입)`);
    parts.push(`- 요구: ${items.map((it, i) => `${GA[i]}. ${cut(it, 40)}`).join(" / ")}`);
    if (def) parts.push(`- 정의: ${def}`);
  } else if (seq) {
    parts.push(`## ${no++}. 서론 — ${bt}의 수행 흐름 (발전단계 도입)`);
    if (def) parts.push(`- 정의: ${def}`);
  } else {
    parts.push(`## ${no++}. 서론 — ${bt}의 정의 (1교시 상속·확장)`);
    if (def) parts.push(`- ${def}`);
    if (feat.length) parts.push(`- 특징) ${feat.slice(0, 4).join(", ")}`);
  }
  parts.push("");

  if (items.length) {
    // 병렬식 — 항목별 헤딩. 예전 토픽 자료는 항목-표 매핑이 어려워 키워드 근거를 배치.
    items.forEach((it, i) => {
      parts.push(`## ${no++}. ${GA[i]}. ${it}`);
      if (i === 0 && sec && def) parts.push(`- 정의: ${def}`);
      const s = sections[i];
      if (s)
        parts.push(
          `- ${s.label}${s.mnemonic ? ` [${s.mnemonic}]` : ""}: ${(s.keywords || [])
            .slice(0, 8)
            .join(" · ")}`,
        );
      parts.push("");
    });
    if (sections.length > items.length) {
      parts.push(`## ${no++}. 본론 보강 — 남은 핵심 구성`);
      parts.push(sectionsTable(sections.slice(items.length)));
      parts.push("");
    }
  } else {
    if (sections.length) {
      parts.push(`## ${no++}. 본론1 — ${bt}의 ${sec ? "정의 및 " : ""}핵심 구성`);
      if (sec && def) parts.push(`- 정의: ${def}`);
      parts.push(sectionsTable(sections.slice(0, 3)));
      if (sections.length > 3) {
        parts.push("");
        parts.push(`## ${no++}. 본론2 — 승부처 (물어본 것을 안 물어본 것보다 많게)`);
        parts.push(sectionsTable(sections.slice(3)));
      }
      parts.push("");
    } else if (sec && def) {
      parts.push(`## ${no++}. 본론1 — ${bt}의 정의`);
      parts.push(`- 정의: ${def}`);
      parts.push("");
    }
  }

  if (plus.length || d.memo) {
    parts.push(`## ${no++}. 결론 — 차별화(+α)`);
    if (plus.length) parts.push(`- ${plus.slice(0, 6).join(" · ")}`);
    if (d.memo) parts.push(`- ${cut(String(d.memo).trim(), 160)}`);
    parts.push("");
  }
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
  const sn = matchLongest(q.text, SN_INDEX);
  if (sn) {
    out[q.id] = {
      title: sn.sn.title,
      source: `교재 서브노트 — ${sn.sn.title}`,
      answer: buildFromSubnote(q, sn.sn),
    };
    bySn++;
    continue;
  }
  const tp = matchLongest(q.text, TP_INDEX);
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
