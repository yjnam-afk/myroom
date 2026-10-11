import { COURSE_TOPICS, type CurriculumTopic } from "@/data/curriculum";
import {
  SUBNOTES,
  subnoteByTitle,
  subnoteByTopicId,
  type TextbookSubnote,
} from "@/data/textbookSubnotes";

/**
 * 과목별 토픽 차례 — 교재 CONTENTS(커리큘럼) 가 기준이다.
 *
 * 2026-10-11 "교재 순서대로 토픽 정리 안 했네" — 정리표·토픽 설명 목록이 서브노트의 `course`
 * (옛 교재에서 옮길 때 붙인 과목)로 묶여, 새 CONTENTS 에서 다른 과목으로 옮겨 간 토픽이
 * 엉뚱한 과목 맨 뒤에 붙었다(Wait-Die와 Wound-Wait: 운영체제 → 데이터베이스 17쪽,
 * 데이터 상호운용성과 데이터 이동권: 디지털서비스 → 데이터베이스 64쪽).
 * 이제 과목 차례는 CONTENTS 순서 그대로, CONTENTS 어디에도 없는 서브노트만 원래 과목 맨 뒤에 둔다.
 */
export type CourseEntry = {
  /** 화면에 쓰는 제목 — 서브노트가 있으면 서브노트 제목 */
  title: string;
  /** 교재 서브노트 — 없으면 CONTENTS 에만 있고 아직 정리 전 */
  sub?: TextbookSubnote;
  /** CONTENTS 항목 — 없으면 CONTENTS 밖 서브노트 */
  plan?: CurriculumTopic;
};

const ORDER = new Map<string, CourseEntry[]>();
/** 서브노트 제목 → CONTENTS 기준 과목 */
const COURSE_OF = new Map<string, string>();

(() => {
  for (const [code, list] of Object.entries(COURSE_TOPICS)) {
    const out: CourseEntry[] = [];
    for (const t of list) {
      const sub = subnoteByTopicId(t.topicId) || subnoteByTitle(t.title);
      // 한 과목 안에서 같은 서브노트가 두 번 걸리면 한 번만. 두 과목 CONTENTS 에 다 실린 토픽
      // (튜링 테스트·ISO 29119-11: SW공학·인공지능)은 두 과목 모두에 둔다 — 소속 과목은 앞 과목.
      if (sub && out.some((e) => e.sub === sub)) continue;
      if (sub && !COURSE_OF.has(sub.title)) COURSE_OF.set(sub.title, code);
      out.push({ title: sub?.title ?? t.title, sub, plan: t });
    }
    ORDER.set(code, out);
  }
  for (const s of SUBNOTES) {
    if (COURSE_OF.has(s.title)) continue;
    COURSE_OF.set(s.title, s.course);
    if (!ORDER.has(s.course)) ORDER.set(s.course, []);
    ORDER.get(s.course)!.push({ title: s.title, sub: s });
  }
})();

/** 과목 차례 전체(CONTENTS 에만 있는 토픽 포함) */
export function courseEntries(code: string): CourseEntry[] {
  return ORDER.get(code) ?? [];
}

/** 과목 차례 중 교재 서브노트가 있는 것만 */
export function courseSubnotesInOrder(code: string): TextbookSubnote[] {
  return courseEntries(code).flatMap((e) => (e.sub ? [e.sub] : []));
}

/** 이 서브노트가 CONTENTS 기준으로 속한 과목 */
export function courseOf(s: TextbookSubnote): string {
  return COURSE_OF.get(s.title) ?? s.course;
}
