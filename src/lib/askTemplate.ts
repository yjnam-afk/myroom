/**
 * 2교시형 답안지 템플릿의 소제목 고르기 — 빈출 요구(askFreq)마다 머리글·교재 표·빈칸 안내를 정한다.
 * AnswerTemplate.tsx 에서 떼어 냈다(2026-11-20). 화면 조각이 아니라 순수 함수다.
 */
import type { SubnoteTable } from "@/data/textbookSubnotes";
import type { AskItem } from "@/lib/askFreq";

/** 답안지 템플릿의 표 — 교재 표 + 표 아래 간글 */
export type Tb = SubnoteTable & { gloss?: string };

/** 토픽 제목에서 두 개념 이름 — 「A와 B 비교」「A vs B」 */
export function pairFromTitle(title: string): string[] {
  const t = title.replace(/\s*(의\s*)?비교.*$/, "").replace(/\s*\([^)]*\)/g, "");
  const m = t.split(/\s*(?:vs\.?|VS|와|과|\/|&|,)\s*/).filter(Boolean);
  return m.length >= 2 ? m.slice(0, 2) : [];
}


/* ── 2교시 빈출 뼈대(2026-10-18) — askFreq 위 3개를 본론 소제목으로 ── */
const ESC = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** 빈출 항목 → 답안 소제목. 괄호 병기·앞머리 토픽 이름·끝 조사를 덜어 낸다 */
export function askHead(it: AskItem, bare: string): string {
  let h = it.label.replace(/\s*[(（][^)）]*[)）]/g, "").replace(/\s+/g, " ").trim();
  const b = bare.replace(/\s*[(（][^)）]*[)）]/g, "").trim();
  if (b) h = h.replace(new RegExp(`^${ESC(b)}\\s*(?:의|에서|에)?\\s*`), "");
  return h.replace(/(?:을|를|의|에|와|과)$/, "").trim() || it.label;
}
/**
 * 빈출 항목과 맞는 교재 표.
 * ① 캡션·머리글에 항목 낱말이 나오는 표(아직 안 쓴 것)를 통째로, ② 없으면 1열(또는 행 전체)에
 * 항목 낱말이 나오는 행만 골라 쓴다 — 교재가 한 표에 기법 여럿을 실은 경우(회복기법 표의
 * 즉시·지연 갱신·체크포인트·그림자 페이지)에 소제목마다 자기 행만 보이게.
 */
export function tableForAsk(it: AskItem, tables: Tb[], used: Set<Tb>): Tb | undefined {
  const words = askHead(it, "")
    .split(/[\s,·/]+|(?:와|과|및|의|을|를|에서|에)(?=\s|$)/)
    .map((w) => w.replace(/(?:을|를|의|와|과|에|은|는|기법|방법|방식)$/, ""))
    .filter((w) => w.length >= 2 && !/^(?:설명|방법|이용한|이용|대한|주요|다음|관련|경우|위한|통한|기법|방식)$/.test(w));
  if (!words.length) return undefined;
  let best: Tb | undefined;
  let bestScore = 0;
  for (const tb of tables) {
    if (used.has(tb)) continue;
    const hay = [tb.caption, ...tb.headers].join(" ");
    let sc = words.filter((w) => hay.includes(w)).length * 2;
    if (sc && it.kinds.some((k) => k.table.test(tb.caption) || tb.headers.some((h) => k.table.test(h)))) sc += 1;
    if (sc > bestScore) {
      best = tb;
      bestScore = sc;
    }
  }
  if (best && bestScore >= 2) return best;
  // 행 고르기 — 1열에 낱말이 있는 행 먼저, 없으면 행 어디든
  for (const pass of [0, 1]) {
    for (const tb of tables) {
      const rows = tb.rows.filter((r) => words.some((w) => (pass === 0 ? r[0] ?? "" : r.join(" ")).includes(w)));
      if (rows.length && rows.length < tb.rows.length && rows.length <= 5)
        return { ...tb, rows, gloss: undefined, caption: `${tb.caption} (해당 행)` };
    }
  }
  return undefined;
}
/** 표가 없을 때 안내 — 요구 유형에 맞는 표 틀 */
export function askHole(it: AskItem): string {
  const k = it.kinds[0]?.key;
  const frame =
    k === "process" ? "단계 | 활동 | 산출물"
    : k === "compare" ? "비교 항목 | A | B"
    : k === "struct" ? "구분 | 구성요소 | 설명"
    : k === "type" ? "유형 | 특징 | 설명"
    : k === "issue" || k === "solve" ? "구분 | 문제(위협) | 대응 방안"
    : k === "metric" ? "지표 | 정의 | 기준"
    : k === "tech" ? "구분 | 기술요소 | 설명"
    : k === "adopt" ? "구분 | 고려사항 | 설명"
    : k === "calc" ? "풀이 과정 — 단계별로 적고 결과 표"
    : "구분 | 항목 | 설명";
  return `교재에 맞는 표 없음 — 「${frame}」 3열 표 4행 + 간글`;
}
/** 문) 줄 — 빈출 3개를 가장 많이 담은 실제 지문 */
export function askQuestion(texts: string[], top: AskItem[]): string | undefined {
  let best: string | undefined;
  let bestN = 0;
  for (const t of texts) {
    const n = top.filter((it) => it.variants.some((v) => t.includes(v))).length;
    if (n > bestN) {
      best = t;
      bestN = n;
    }
  }
  return best;
}
