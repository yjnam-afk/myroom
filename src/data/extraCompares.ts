/**
 * 교재 밖 비교표 — 교재 슬라이드에는 없지만 시험에 짝으로 묻는 두 토픽을 나란히 놓은 표.
 *
 * 교재 서브노트(textbookSubnotes)는 슬라이드 그대로만 둔다. 2026-10-05 에 CSMA/CA 서브노트에
 * 슬라이드에 없는 CD/CA 비교표가 섞여 있어 걷어냈는데, 비교 자체는 필요하다고 해서 여기로 옮겼다.
 * 화면에는 「교재 외」 표시를 달고 refs 에 적은 토픽 화면 모두에 뜬다(키 = 교재 서브노트 제목).
 */
export type ExtraCompare = {
  title: string;
  refs: string[];
  headers: string[];
  rows: string[][];
  note?: string;
};

export const EXTRA_COMPARES: ExtraCompare[] = [
  {
    title: "CSMA/CD vs CSMA/CA",
    refs: ["CSMA/CD", "CSMA/CA"],
    headers: ["구분", "CSMA/CD", "CSMA/CA"],
    rows: [
      ["적용 환경", "유선 LAN(이더넷)", "무선랜(Wi-Fi)"],
      ["핵심 개념", "충돌 감지(Detection)\n충돌 후 재전송", "충돌 회피(Avoidance)\n충돌 미리 예측"],
      ["충돌 확인", "전송 중 채널 감시\n충돌 감지 가능", "충돌 감지 어려움\nACK 로 전달 확인"],
      ["주요 기법", "Jamming Signal\nBack-off", "IFS(DIFS·SIFS)\nRTS/CTS·NAV"],
      ["전송 방식", "1-/Non-/P-Persistent", "Back off time 대기\n경쟁 윈도우"],
    ],
    note: "유선은 부딪히면 알아채고 다시 보내고(CD), 무선은 부딪혔는지 알 수 없어 미리 예약하고 ACK 로 확인한다(CA).",
  },
];

export const extraComparesFor = (title?: string): ExtraCompare[] =>
  title ? EXTRA_COMPARES.filter((c) => c.refs.includes(title)) : [];
