/**
 * flashcards.json 생성기 — 지하철 모드 카드 데이터. (npx tsx로 실행)
 *
 * 교재 서브노트(468+)를 1순위 카드로 삼고, 서브노트에 없는 예전 토픽은
 * topics.json + topicDetails.json 기반 카드로 뒤에 붙인다(삭제하지 않음).
 * 매 빌드 시 새로 생성 — 수동 스냅샷 금지(prebuild에서 자동 실행).
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { SUBNOTES } from "../src/data/textbookSubnotes";
import { WEEKS } from "../src/data/curriculum";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const topics = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/topics.json"), "utf8"),
);
const details = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/topicDetails.json"), "utf8"),
);

// ── 공통 정규화 ──────────────────────────────────────────────────────────
function norm(s: string) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[\s()·,\-_/]/g, "");
}
function bare(s: string) {
  return norm(String(s || "").replace(/[(（][^)）]*[)）]/g, ""));
}

// ── 예전 토픽 정의 클린업(기존 로직 유지) ────────────────────────────────
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
  s = s.replace(/\s*\((?:cf|참고)[^)]*\)?\s*$/i, "").trim();
  s = s.replace(/\s*\([^)]*$/, "").trim();
  s = s.replace(/[\s\-–;,·]+$/, "").trim();
  if (s.length > 150) {
    const cut = s.slice(0, 150);
    const dot = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("다. "));
    s = (dot > 60 ? cut.slice(0, dot + 1) : cut).replace(/[\s\-–;,·]+$/, "").trim();
  }
  return s;
}
const looksIncomplete = (s: string) =>
  !s || s.length < 16 || /[을를이가은는와과의로도만]$/.test(s);
function cleanDefinition(detail: string, summary: string) {
  const fromDetail = cleanOne(detail);
  if (!looksIncomplete(fromDetail)) return fromDetail;
  const fromSummary = cleanOne(summary);
  if (!looksIncomplete(fromSummary)) return fromSummary;
  return fromDetail || fromSummary;
}

// ── 교재 서브노트 카드 ───────────────────────────────────────────────────
const COURSE_CAT: Record<string, string> = {
  CA: "컴퓨터구조",
  OS: "운영체제",
  PM: "프로젝트관리",
  SE: "소프트웨어공학",
  AI: "인공지능",
  ST: "확률·통계",
  DS: "자료구조",
  AL: "알고리즘",
  NW: "네트워크",
  DB: "데이터베이스",
  MG: "경영전략",
  SC: "보안",
};
const PRIORITY = (() => {
  const m = new Map<string, string>();
  for (const w of WEEKS as any[])
    for (const d of w.days)
      if (d.kind === "study") for (const t of d.topics) m.set(t.title, t.priority);
  return m;
})();

/** 키워드·캡션 속 [두음] 추출 — "[대전압불확] 대치" → "대전압불확" */
const mnemOf = (texts: string[]): string => {
  for (const t of texts) {
    const m = String(t || "").match(/\[([가-힣A-Za-z0-9·\s]{2,12})\]/);
    if (m) return m[1].replace(/\s/g, "");
  }
  return "";
};
/** 표 첫 열 값 정리 — "① 사용자 Data 입력" → "사용자 Data 입력" */
const cellHead = (s: string) =>
  String(s || "")
    .replace(/^[①-⑳]\s*/, "")
    .replace(/^\d+[.)]\s*/, "")
    .split("/")[0]
    .trim()
    .slice(0, 40);

type Section = { label: string; mnemonic: string; keywords: string[] };
const cards: any[] = [];

for (let i = 0; i < SUBNOTES.length; i++) {
  const s: any = SUBNOTES[i];
  const sections: Section[] = [];
  if (s.features?.length)
    sections.push({ label: "특징", mnemonic: "", keywords: s.features });
  if (s.keywords?.length)
    sections.push({
      label: "교재 키워드",
      mnemonic: mnemOf(s.keywords),
      keywords: s.keywords.map((k: string) => k.replace(/\[[^\]]*\]\s*/g, "").trim()).filter(Boolean),
    });
  for (const tb of (s.tables || []).slice(0, 4)) {
    const kws = tb.rows.map((r: string[]) => cellHead(r[0])).filter(Boolean);
    if (kws.length >= 2)
      sections.push({
        label: (tb.caption || "표").replace(/\[[^\]]*\]\s*/g, "").trim().slice(0, 40),
        mnemonic: mnemOf([tb.caption || ""]),
        keywords: kws.slice(0, 10),
      });
  }
  if (!sections.length) continue;
  cards.push({
    id: `sn-${i}`,
    title: s.title,
    category: COURSE_CAT[s.course] || s.course,
    importance: PRIORITY.get(s.title) || "중",
    definition: s.definition || "",
    defShort: s.defShort || "",
    memo: (s.notes || [])[0] || "",
    sections,
    mnemonic: sections[0].mnemonic,
    keywords: sections[0].keywords,
  });
}
const subnoteCount = cards.length;

// ── 예전 토픽 카드(교재에 없는 것만 — 삭제하지 않고 뒤에 유지) ─────────────
const snBare = new Set((SUBNOTES as any[]).map((s) => bare(s.title)));
for (const t of topics) {
  if (snBare.has(bare(t.title))) continue; // 교재 카드가 이미 있음
  const d = details[t.id] || {};
  let sections: Section[] = Array.isArray(d.sections)
    ? d.sections.filter((s: any) => s?.keywords?.length || s?.mnemonic)
    : [];
  if (!sections.length) {
    const kws = (d.featureKeywords || []).filter(Boolean);
    const stored = (d.mnemonic || "").replace(/\s/g, "");
    if (kws.length >= 2) {
      const mnem = stored && [...stored].length === kws.length ? stored : "";
      sections = [{ label: "핵심 키워드", mnemonic: mnem, keywords: kws }];
    } else if (stored) {
      sections = [{ label: "두음", mnemonic: stored, keywords: [] }];
    }
  }
  if (!sections.length) continue;
  cards.push({
    id: t.id,
    title: t.title,
    category: t.category,
    importance: t.importance,
    definition: cleanDefinition(d.detail, t.summary) || t.summary || "",
    defShort: "",
    memo: (d.memo || "").trim(),
    sections,
    mnemonic: sections[0].mnemonic,
    keywords: sections[0].keywords,
  });
}

const out = path.join(root, "src/data/flashcards.json");
fs.writeFileSync(out, JSON.stringify(cards, null, 1), "utf8");

// 빌드 ID 고정(기존 로직 유지)
const buildId = process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now());
fs.writeFileSync(path.join(root, ".build-id"), buildId, "utf8");
console.log(
  `flashcards.json: ${cards.length}장 (교재 ${subnoteCount} + 예전 ${cards.length - subnoteCount}, 섹션 ${cards.reduce((n, c) => n + c.sections.length, 0)}개, ${(fs.statSync(out).size / 1024).toFixed(0)}KB)`,
);
