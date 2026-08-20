import type { EasyGuide } from "../subnoteExtras";

/** 예전 토픽 커널 학습카드 — 청크 01 (경영전략 상급) */
export const G: Record<string, EasyGuide> = {
  "gj-1": {
    hook: "IT를 '기술'이 아니라 '고객에게 제공하는 서비스'로 관리하는 체계입니다.",
    scene: "장애가 나면 그때그때 담당자 실력으로 때우는 IT 조직은 품질이 들쑥날쑥합니다. ITSM은 인시던트·변경·구성 관리를 표준 프로세스로 만들어, 합의한 서비스 수준(SLA)을 꾸준히 지키게 합니다.",
    why: "구성 4요소(인력·조직·기술·프로세스)와 ITIL·ISO 20000, SLA 지표가 출제 핵심입니다.",
    mechanism: "목적: 기술 중심→고객·서비스 중심 전환, SLA 수준 품질 유지. 구성: 인력(서비스 데스크·R&R), 조직(거버넌스·의사결정), 기술(ITSM 도구·모니터링·자동화), 프로세스(인시던트·문제·변경·구성 관리). 표준: ITIL 4(모범사례), ISO/IEC 20000(인증), eSCM(아웃소싱 능력). 지표: SLA·SLM, MTBF·MTTR·MTTF. 동향: AIOps·챗봇 자동화, SRE 결합.",
    map: [
      { as: "합의한 품질 약속", real: "SLA", note: "" },
      { as: "표준 업무 절차", real: "인시던트·변경·구성 관리", note: "" },
      { as: "모범사례 모음", real: "ITIL 4", note: "" },
      { as: "국제 인증", real: "ISO/IEC 20000", note: "" },
    ],
    usage: "IT 운영 관리입니다. 시험은 4요소, ITIL·ISO 20000, MTBF·MTTR입니다.",
    links: [
      { topic: "SLA (Service Level Agreement)", how: "ITSM이 지켜야 할 서비스 수준 계약입니다." },
      { topic: "SRE (Site Reliability Engineering)", how: "클라우드 시대의 운영 방식으로 결합됩니다." },
    ],
    exam: "ITSM은 SLA 수준의 서비스 품질 유지를 위해 인력·조직·기술·프로세스를 종합 관리하는 IT 서비스 관리 체계로, ITIL 4·ISO 20000 기반으로 운영된다.",
  },
};
