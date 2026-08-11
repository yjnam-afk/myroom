/**
 * 답안 본론용 개념도 — 답안지 6줄(≈5cm) 안에 옮겨 그릴 수 있게
 * 교재 개념도를 단순화한 SVG. public/diagram/<slug>.svg 로 저장한다.
 *
 * 키는 교재 서브노트 제목(textbookSubnotes 의 title)과 정확히 일치시킨다.
 * 중요도 '상' 토픽부터 순차 제작 중.
 */
const ANSWER_DIAGRAMS: Record<string, string> = {
  // ── 데이터베이스(DB) ──
  "트랜잭션": "/diagram/db-transaction.svg",
  "데이터베이스 모델링": "/diagram/db-modeling.svg",
  "데이터베이스 무결성": "/diagram/db-integrity.svg",
  "데이터베이스 정규화(Normalization)": "/diagram/db-normalization.svg",
  "데이터베이스 반정규화(De-Normalization)": "/diagram/db-denormalization.svg",
  "DB 회복기법": "/diagram/db-recovery.svg",
  "DB 동시성제어": "/diagram/db-concurrency.svg",
  "벡터 데이터베이스(Vector Database)": "/diagram/db-vector-db.svg",
  "데이터 품질인증 가이드라인 - DQ인증 (2025.02.26)": "/diagram/db-dq-cert.svg",
  "연관성 분석(association analysis) - 데이터마이닝": "/diagram/db-association.svg",
  // ── 경영전략(MG) ──
  "ITIL(IT Infrastructure Library) 4.0": "/diagram/mg-itil4.svg",
  "IT 거버넌스(IT-Governance)": "/diagram/mg-it-governance.svg",
  "환경분석": "/diagram/mg-env-analysis.svg",
  "ISP 및 ISMP 수립 공통가이드 9판(2025.05)": "/diagram/mg-isp-guide.svg",
  "정보시스템 하드웨어 규모산정 지침": "/diagram/mg-hw-sizing.svg",
  "IT 투자성과 평가": "/diagram/mg-it-invest.svg",
};

/** 서브노트 제목으로 답안 본론 개념도를 찾는다. */
export function diagramForTitle(title?: string): string | undefined {
  if (!title) return undefined;
  return ANSWER_DIAGRAMS[title];
}
