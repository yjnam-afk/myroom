/**
 * 서버 전용: 토픽의 저장된 실데이터(엑셀 서브노트)를 LLM 생성의 "정답 근거"로 만든다.
 * 큰 JSON을 import 하므로 API 라우트(서버)에서만 사용한다(클라이언트 번들 금지).
 */
import topics from "@/data/topics.json";
import topicDetails from "@/data/topicDetails.json";
import {
  subnoteByTopicId,
  subnoteByTitle,
  subnoteAsText,
} from "@/data/textbookSubnotes";
import { TOPIC_GUIDES } from "@/data/topicGuides";

type SubnoteSection = {
  label: string;
  mnemonic: string;
  keywords: string[];
};
type Detail = {
  detail?: string;
  defKeywords?: string[];
  featureKeywords?: string[];
  applicationKeywords?: string[];
  plusKeywords?: string[];
  /** 서브노트에 들어있는 원본 두음신공(있으면 LLM 생성보다 우선). */
  mnemonic?: string;
  /** 검증된 관계형 개념도(mermaid). 있으면 이 구조를 그대로 그리도록 지시. */
  conceptMap?: string;
  /** 교재 원본의 섹션별 두음(특징·기술요소·분류 등 각각 별도 두음). */
  sections?: SubnoteSection[];
  /** 타연관 토픽(쉼표/슬래시 구분 문자열). */
  related?: string;
  /** 교재 분류 경로(예: "보안 > 정책 > 데이터 3법"). */
  classification?: string;
  /** 교재 암기법 원문(여러 두음 줄 포함). 엑셀 '암기법' 컬럼 그대로. */
  memo?: string;
};
const DETAILS = topicDetails as Record<string, Detail>;

/** 제목으로 토픽 id를 찾는다(직접 타이핑해도 데이터 연결되도록). */
function findIdByTitle(title?: string): string | undefined {
  const t = (title || "").trim();
  if (!t) return undefined;
  return topics.find((x) => x.title === t)?.id;
}

/** 토픽의 저장된 실제 내용을 "원문 그대로" 근거 텍스트로 만든다. */
function groundingFrom(topicId?: string, topicTitle?: string): string {
  // 내 교재(심화반) 서브노트가 있으면 ★최우선★ 근거로 맨 앞에 붙인다.
  // topics.json 에 없는 교재 전용 토픽(MMU, CPU Ring Level 등)도 제목으로 붙는다.
  const book =
    (topicTitle ? subnoteByTitle(topicTitle) : undefined) ||
    subnoteByTopicId(topicId);
  const d = topicId ? DETAILS[topicId] : undefined;
  // 예전 토픽의 커널 학습카드 — 답안 한 줄·핵심 동작·핵심 용어를 근거로 추가
  const g = topicId ? TOPIC_GUIDES[topicId] : undefined;
  if (!d && !book && !g) return "";
  const parts: string[] = [];
  if (book) {
    parts.push(
      `★★★내 교재 서브노트 원본 — 아래 내용을 최우선 정답 근거로 삼고, 정의·키워드·표 항목을 그대로 사용하라(임의 변경·추가 금지)★★★\n${subnoteAsText(book)}\n`,
    );
  }
  if (g) {
    parts.push(
      [
        `커널 학습카드(검증된 정리 — 정의·설명·채점 근거로 그대로 활용):`,
        `정의(답안 한 줄): ${g.exam}`,
        g.mechanism ? `핵심 동작: ${g.mechanism}` : "",
        g.map?.length ? `핵심 용어: ${g.map.map((m) => m.real).join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
  if (!d) return parts.join("\n");
  if (d.detail) parts.push(d.detail.slice(0, 900));
  // 서론(정의)용과 본론(구성요소)용 키워드를 분리해 제시 → 서론·본론이 같아지지 않게
  const def = Array.from(new Set(d.defKeywords || []));
  const feat = Array.from(new Set(d.featureKeywords || []));
  const extra = Array.from(
    new Set([...(d.applicationKeywords || []), ...(d.plusKeywords || [])]),
  );
  if (def.length) parts.push(`정의(서론)용 키워드: ${def.join(", ")}`);
  if (feat.length)
    parts.push(`본론(구성요소·나열 항목)용 키워드: ${feat.join(", ")}`);
  if (extra.length) parts.push(`추가/활용 키워드: ${extra.join(", ")}`);
  const mnem = (d.mnemonic || "").trim();
  if (mnem) {
    parts.push(`서브노트 원본 두음신공(이것을 그대로 사용): ${mnem}`);
  }
  // 섹션별 두음(라벨·키워드 매핑까지) — 설명의 '시험 포인트'에 반드시 반영되도록 명시.
  if (Array.isArray(d.sections) && d.sections.length) {
    const lines = d.sections
      .filter((s) => s.mnemonic && s.keywords?.length)
      .map((s) => `- [${s.label}] ${s.mnemonic} = ${s.keywords.join("·")}`);
    if (lines.length)
      parts.push(
        `교재 두음신공(★설명·시험포인트에서 이 두음을 그대로 소개하라. 새 두음을 만들지 말 것★):\n${lines.join("\n")}`,
      );
  }
  // 두음이 없는 토픽의 대체 암기 장치(연상 문장). 억지 두음을 새로 만들지 않게 한다.
  const memo = (d.memo || "").trim();
  if (memo) {
    parts.push(
      `서브노트 연상 팁(두음이 없는 항목은 ★새 두음을 지어내지 말고★ 이 연상으로 소개하라): ${memo}`,
    );
  }
  const cmap = (d.conceptMap || "").trim();
  if (cmap) {
    parts.push(
      `검증된 개념도(★개념도는 아래 구조를 그대로 mermaid로 그려라★):\n${cmap}`,
    );
  }
  return parts.join("\n");
}

/** 토픽에 "검증된 개념도(conceptMap, mermaid)"가 있으면 반환. 설명 페이지가
 *  AI 생성이 아닌 이 데이터를 그대로 그려 항상 정확한 도식을 보여준다. */
export function conceptMapFor(topicId?: string): string {
  if (!topicId) return "";
  const d = DETAILS[topicId];
  return (d?.conceptMap || "").trim();
}

/** 사용자 붙여넣기 자료 + 토픽 실데이터를 합쳐 최종 근거를 만든다. */
export function buildGrounding(opts: {
  topicId?: string;
  topicTitle?: string;
  reference?: string;
}): string {
  const id = opts.topicId || findIdByTitle(opts.topicTitle);
  return [groundingFrom(id, opts.topicTitle), opts.reference]
    .filter((s) => s && s.trim())
    .join("\n\n");
}
