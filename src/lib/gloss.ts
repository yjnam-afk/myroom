/**
 * 간글 — 개념도(d)·표(t, 표 순서대로)마다 한 줄. 토픽 설명(답안지 템플릿)과 지하철 읽기가 같이 쓴다.
 */
import glossData from "@/data/gloss.json";

export type Gloss = { d?: string; t: string[] };
const GLOSS = glossData as Record<string, Gloss>;

/** 같은 제목의 서브노트가 과목별로 둘일 때(DevSecOps) "제목@과목" 키를 먼저 본다 */
export function glossFor(sn: { title: string; course?: string } | undefined): Gloss | undefined {
  if (!sn) return undefined;
  return GLOSS[`${sn.title}@${sn.course ?? ""}`] ?? GLOSS[sn.title];
}
