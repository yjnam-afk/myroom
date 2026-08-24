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
import { SUBNOTES, subnoteByAlias } from "../src/data/textbookSubnotes";
import { WEEKS } from "../src/data/curriculum";
import { TOPIC_GUIDES } from "../src/data/topicGuides";
import { TOPIC_INTROS } from "../src/data/topicIntros";

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

/**
 * 예전 토픽 detail → 답안지 3단표(구분·키워드·설명).
 *
 * detail 은 "[구성요소] 두음: 생정전동 / - 생성자 은닉: private 선언…" 형태라
 * 블록명을 구분, "- 키워드: 설명" 을 행으로 바꾸면 그대로 3단표가 된다.
 * 서론(정의)·플러스 알파에서 이미 쓰는 블록은 제외한다.
 */
const SKIP_BLOCK = /^(정의|등장배경|목적|시사점|최신동향|비교|참고)/;
type CompGroup = {
  group: string;
  mnemonic: string;
  rows: [string, string][];
  /** 표로 못 만드는 산문 줄(원리 설명 등) — 표 대신 문장으로 보여준다 */
  notes: string[];
};
function compTableOf(detail: string): CompGroup[] {
  const groups: CompGroup[] = [];
  let cur: CompGroup | null = null;
  for (const raw of String(detail || "").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const h = line.match(/^\[([^\]]+)\]\s*(.*)$/);
    if (h) {
      const name = h[1].trim();
      if (SKIP_BLOCK.test(name)) {
        cur = null;
        continue;
      }
      const mm = (h[2] || "").match(/두음\s*[:：]\s*([가-힣A-Za-z0-9]{2,12})/);
      cur = { group: name, mnemonic: mm ? mm[1] : "", rows: [], notes: [] };
      groups.push(cur);
      continue;
    }
    if (!cur) continue;
    const m = line.match(/^[-·•*]\s*(.+)$/);
    if (!m) continue;
    const body = m[1].trim();
    const colon = body.search(/[:：]\s/);
    if (colon > 0 && colon <= 40) {
      cur.rows.push([body.slice(0, colon).trim(), body.slice(colon + 1).trim().slice(0, 80)]);
      continue;
    }
    // 콜론이 없는 줄 — 짧은 항목의 쉼표 나열이면 키워드 행으로 펴고,
    // 그렇지 않으면(설명 문장이면) 표를 깨뜨리지 않도록 산문으로 남긴다.
    const parts = body.split(/\s*,\s*/).map((x) => x.trim()).filter(Boolean);
    const isList =
      parts.length >= 3 && parts.every((x) => x.length <= 25 && !/[.。]$|다$|음$/.test(x));
    if (isList) for (const p of parts.slice(0, 8)) cur.rows.push([p.slice(0, 40), ""]);
    else cur.notes.push(body.slice(0, 160));
  }
  return groups
    .filter((g) => g.rows.length || g.notes.length)
    .slice(0, 4)
    .map((g) => ({ ...g, rows: g.rows.slice(0, 8), notes: g.notes.slice(0, 2) }));
}

const cards: any[] = [];
/** 답안지 템플릿 전용 자료(예전 토픽) — id → 템플릿 필드 */
const answerExtras: Record<string, any> = {};

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
  // 교재에 같은 토픽이 있으면(제목 표기가 달라도) 예전 카드를 만들지 않는다.
  if (snBare.has(bare(t.title)) || subnoteByAlias(t.id, t.title)) continue;
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
  // 구획이 전혀 없으면 정의 키워드로 대신 채운다 — 그래도 없으면 빈 구획으로 두되
  // 카드는 만들어서 답안지 템플릿(정의·특징·플러스 알파)이 항상 뜨게 한다.
  if (!sections.length) {
    const dk = (d.defKeywords || []).filter(Boolean);
    if (dk.length >= 2) sections = [{ label: "정의 키워드", mnemonic: "", keywords: dk }];
  }
  // 기필반 자료처럼 detail 만 있는 토픽 — 본문에서 구획을 뽑아 카드로 만든다.
  if (!sections.length) {
    for (const g of compTableOf(d.detail || "")) {
      const kws = g.rows.map((r) => r[0]).filter(Boolean);
      if (kws.length >= 2)
        sections.push({ label: g.group, mnemonic: g.mnemonic, keywords: kws.slice(0, 10) });
      if (sections.length >= 3) break;
    }
  }
  // 그래도 없으면 암기법(두음)만으로라도 카드를 만들어 빈 토픽을 없앤다.
  if (!sections.length && (d.mnemonic || "").trim()) {
    sections = [{ label: "암기법", mnemonic: String(d.mnemonic).trim(), keywords: [] }];
  }
  cards.push({
    id: t.id,
    title: t.title,
    category: t.category,
    importance: t.importance,
    definition: cleanDefinition(d.detail, t.summary) || t.summary || "",
    // 예전 토픽의 ✍️ 답안 한 줄 — 교재 규격 34~35자 정의(서론 세트) 우선,
    // 없으면 커널 학습카드의 exam(답안에 그대로 쓸 한 줄)
    defShort: TOPIC_INTROS[t.id]?.defShort || TOPIC_GUIDES[t.id]?.exam || "",
    memo: (d.memo || "").trim(),
    sections,
    mnemonic: sections[0]?.mnemonic || "",
    keywords: sections[0]?.keywords || [],
  });
  // 답안지 템플릿 전용 자료는 별도 파일로 분리한다 — 지하철(통근) 모드가 쓰는
  // flashcards.json 을 가볍게 유지해 모바일 로딩을 지키기 위해서다.
  answerExtras[t.id] = {
    // 특징 3개·검증된 개념도·본론 3단표·정의/활용/플러스 키워드
    features: (d.featureKeywords || []).filter(Boolean).slice(0, 3),
    conceptMap: (d.conceptMap || "").trim(),
    comp: compTableOf(d.detail || ""),
    // 도식 이름 — 그림이 클래스다이어그램·절차 등일 때 "개념도" 대신 실제 이름
    conceptMapLabel: (d.conceptMapLabel || "").trim(),
    defKeywords: (d.defKeywords || []).filter(Boolean),
    apply: (d.applicationKeywords || []).filter(Boolean),
    plus: (d.plusKeywords || []).filter(Boolean),
  };
}

const out = path.join(root, "src/data/flashcards.json");
fs.writeFileSync(out, JSON.stringify(cards, null, 1), "utf8");
const outExtra = path.join(root, "src/data/answerExtras.json");
fs.writeFileSync(outExtra, JSON.stringify(answerExtras, null, 1), "utf8");

// 빌드 ID 고정(기존 로직 유지)
const buildId = process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now());
fs.writeFileSync(path.join(root, ".build-id"), buildId, "utf8");
console.log(
  `answerExtras.json: ${(fs.statSync(outExtra).size / 1024).toFixed(0)}KB`,
);
console.log(
  `flashcards.json: ${cards.length}장 (교재 ${subnoteCount} + 예전 ${cards.length - subnoteCount}, 섹션 ${cards.reduce((n, c) => n + c.sections.length, 0)}개, ${(fs.statSync(out).size / 1024).toFixed(0)}KB)`,
);
