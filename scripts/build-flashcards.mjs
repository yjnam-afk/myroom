/**
 * flashcards.json 생성기 — 지하철 모드 카드 데이터.
 *
 * topics.json + topicDetails.json(원본)에서 매 빌드 시 새로 추출한다.
 * (과거처럼 수동 스냅샷을 커밋해두면 데이터 정비가 카드에 반영되지 않는
 * 사고가 나므로, package.json prebuild로 항상 자동 재생성한다.)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const topics = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/topics.json"), "utf8"),
);
const details = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/topicDetails.json"), "utf8"),
);

const firstCh = (s) => (s || "").trim().charAt(0);

// ── 교재 서브노트의 답안용 2줄 정의(defShort) 사전 ────────────────────────────
// textbookSubnotes.ts 는 TS라 이 스크립트(node .mjs)에서 import 할 수 없다.
// 항목 블록이 `title: "..."` ... `defShort: "..."` 로 일정하므로 원문에서 뽑아 쓴다.
const DEF_SHORT = (() => {
  const src = fs.readFileSync(
    path.join(root, "src/data/textbookSubnotes.ts"),
    "utf8",
  );
  const list = [];
  // 항목 경계: 들여쓰기 2칸 + `{` (파일 상단 타입 정의에는 title/defShort 쌍이 없다)
  for (const block of src.split(/\n {2}\{\n/)) {
    const title = block.match(/^\s*title: "((?:[^"\\]|\\.)*)"/m);
    const short = block.match(/^\s*defShort: "((?:[^"\\]|\\.)*)"/m);
    if (title && short)
      list.push({
        title: title[1],
        n: norm(title[1]),
        b: bare(title[1]),
        short: short[1].replace(/\\"/g, '"'),
      });
  }
  return list;
})();

/** 제목 비교용 정규화 — grounding/subnoteExtras/textbookSubnotes 와 동일 규칙. */
function norm(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[\s()·,\-_/]/g, "");
}
/** 괄호 안 영문 풀네임까지 지운 형태 — "I2C와 SPI" ↔ "I2C(Inter…)와 SPI(Serial…)" 매칭용 */
function bare(s) {
  return norm(String(s || "").replace(/[(（][^)）]*[)）]/g, ""));
}

/**
 * 제목으로 2줄 정의를 찾는다.
 * 정확 일치 → 괄호 안 영문 풀네임을 지운 일치, 두 단계만 쓴다.
 * (포함 매칭은 쓰지 않는다 — "EAMS" 가 "Beam Search"의 부분 문자열로 걸리는 식의
 *  오탐이 나오는데, 카드에 엉뚱한 정의가 박히는 편이 정의가 없는 것보다 나쁘다.)
 */
function defShortFor(title) {
  const t = norm(title);
  if (!t) return "";
  const tb = bare(title);
  const hit =
    DEF_SHORT.find((s) => s.n === t) ||
    (tb ? DEF_SHORT.find((s) => s.b === tb) : undefined);
  return hit ? hit.short : "";
}

// 교재 원문(detail)·요약(summary)에서 "정의다운 정의" 한 문장 추출.
// (grounding.ts의 cleanDefinition과 동일 규칙 — 지하철 모드/두음신공 정의 일치.)
function cleanOne(src) {
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
const looksIncomplete = (s) =>
  !s || s.length < 16 || /[을를이가은는와과의로도만]$/.test(s);
function cleanDefinition(detail, summary) {
  const fromDetail = cleanOne(detail);
  if (!looksIncomplete(fromDetail)) return fromDetail;
  const fromSummary = cleanOne(summary);
  if (!looksIncomplete(fromSummary)) return fromSummary;
  return fromDetail || fromSummary;
}

const cards = [];
for (const t of topics) {
  const d = details[t.id] || {};
  // 두음이 없는 섹션도 살린다. 억지 두음(첫 글자 기계 조합)보다 키워드 + 연상 문장이
  // 외우기 쉬워, 두음은 "자연스러울 때만" 붙이고 없으면 빈 문자열로 둔다.
  let sections = Array.isArray(d.sections)
    ? d.sections.filter((s) => s?.keywords?.length || s?.mnemonic)
    : [];
  // 섹션이 없어도 두음·키워드가 있으면 단일 섹션으로 구성(구버전 호환).
  if (!sections.length) {
    const kws = (d.featureKeywords || []).filter(Boolean);
    const stored = (d.mnemonic || "").replace(/\s/g, "");
    if (kws.length >= 2) {
      // 저장된 두음이 키워드 수와 맞을 때만 사용(맞지 않으면 두음 없이 키워드만).
      const mnem = stored && [...stored].length === kws.length ? stored : "";
      sections = [{ label: "핵심 키워드", mnemonic: mnem, keywords: kws }];
    } else if (stored) {
      sections = [{ label: "두음", mnemonic: stored, keywords: [] }];
    }
  }
  if (!sections.length) continue; // 외울 내용이 없는 토픽은 카드 제외

  cards.push({
    id: t.id,
    title: t.title,
    category: t.category,
    importance: t.importance,
    definition: cleanDefinition(d.detail, t.summary) || t.summary || "",
    // 답안 서론용 2줄(한 줄 17자 × 2줄) 압축 정의 — 교재 서브노트가 있는 토픽만.
    defShort: defShortFor(t.title),
    // 두음이 없는 토픽의 대체 암기 장치(연상 문장). 카드 하단에 노출한다.
    memo: (d.memo || "").trim(),
    sections,
    // 구버전 필드(다른 소비처 호환): 첫 섹션 기준.
    mnemonic: sections[0].mnemonic,
    keywords: sections[0].keywords,
  });
}

const out = path.join(root, "src/data/flashcards.json");
fs.writeFileSync(out, JSON.stringify(cards, null, 1), "utf8");

// 빌드 ID 고정: 한 번만 생성해 파일에 기록 → next.config가 클라이언트·서버 컴파일에서
// 동일 값을 읽는다(배포 감지 오탐/자동 새로고침 오작동 방지). Vercel은 커밋 SHA 우선.
const buildId = process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now());
fs.writeFileSync(path.join(root, ".build-id"), buildId, "utf8");
console.log(
  `flashcards.json: ${cards.length}장 (섹션 ${cards.reduce((n, c) => n + c.sections.length, 0)}개, ${(fs.statSync(out).size / 1024).toFixed(0)}KB)`,
);
