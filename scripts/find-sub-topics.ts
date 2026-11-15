/**
 * 서브 토픽 후보 찾기(교재 쪽에서) — 교재 표의 이름 칸·키워드에 있는 이름마다, 그 이름을 주제로 물은 문항을 센다.
 *
 *   npx tsx scripts/find-sub-topics.ts [최소 문항 수=3] [out.json]
 *
 * find-hidden-topics.ts 는 「안 걸리는 문항 → 주제」 방향이고, 이건 「교재 이름 → 문항」 방향이다.
 * 상위 토픽에 걸린 문항 안에 숨은 것(「TCP 혼잡제어의 Slow Start」)도 잡힌다. 이미 토픽·서브 토픽으로 걸리는 이름은 뺀다.
 * 후보일 뿐이다 — 넓은 말은 눈으로 거르고, 넣은 뒤 check-sub-topics.ts 를 돌린다.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { SUBNOTES } from "@/data/textbookSubnotes";
import { SUB_TOPICS } from "@/data/subTopics";
import { titlesMatching } from "@/lib/examHistory";

type Q = { id: string; text: string };
const MIN = Number(process.argv[2] || 3);
const bank = JSON.parse(readFileSync("src/data/questions.json", "utf8")) as Q[];
const T = [...SUBNOTES.map((s) => s.title), ...SUB_TOPICS.map((s) => s.name)];
const sq = (s: string) => s.toLowerCase().replace(/[\s\-_·./,'’"“”()[\]:]/g, "");

const GENERIC = new Set(
  ("개념 정의 특징 구성 구성요소 구조 절차 방법 유형 종류 분류 장점 단점 장단점 목적 필요성 배경 원리 동작 기능 역할 효과 문제점 해결방안 대응방안 고려사항 활용 사례 적용 비교 차이점 설명 내용 항목 구분 기타 " +
    "기술 관리 보안 분석 설계 구현 테스트 운영 개발 계획 평가 검증 모델 데이터 시스템 서비스 네트워크 프로세스 프로젝트 소프트웨어 하드웨어 사용자 정보 표준 정책 전략 조직 인력 비용 일정 품질 위험 범위 자원 " +
    "성능 가용성 신뢰성 확장성 무결성 기밀성 안정성 효율성 유연성 호환성 이식성 상호운용성 인증 인가 암호화 접근제어 모니터링 자동화 가상화 최적화 표준화 시각화 통합 연계 수집 저장 처리 전송 입력 출력 " +
    "컴퓨팅 운영체제 알고리즘 아키텍처 인공지능 프레임워크 엔지니어링 거버넌스 머신러닝 데이터베이스 클라우드 프로토콜 스케줄링 메모리 인프라 플랫폼 인터페이스 인터넷 빅데이터 사물인터넷 컨테이너 파이프라인 " +
    "모델링 메커니즘 리스트 산출물 일관성 응답시간 활용분야 핵심기술 기술요소 혼잡제어 흐름제어 오류제어 트랜잭션 가상현실 생성형ai 멀티모달 테스트케이스 데이터분석 " +
    "data process system public private cloud tree layer framework software transaction thread container agile mapping key bit paging " +
    "ai it sw hw os db api cpu gpu ui ux id ip tcp udp http https iso iec ieee itu web app pc tv ml dl llm oss p1 p2 ac ev pv cv sv cd").split(" ").map(sq),
);

/** 문항이 주제로 삼은 이름들 */
function termsOf(text: string): Set<string> {
  const out = new Set<string>();
  const add = (x: string) => { const k = sq(x); if (k.length >= 2 && k.length <= 40) out.add(k); };
  for (const m of text.matchAll(/([가-힣A-Za-z0-9][가-힣A-Za-z0-9\- ]{0,24}?)\s*\(([A-Za-z][A-Za-z0-9 \-–,.&/'’]{1,60})\)/g)) {
    add(m[2]);
    for (const part of m[2].split(/,\s*/)) add(part);
    // 괄호 앞 한글 이름은 통째로만(끝 낱말만 떼면 「서버리스 컴퓨팅」이 「컴퓨팅」이 된다) — 앞에 붙은 수식어를 한 낱말씩 떼어 본다
    const ws = m[1].trim().split(/\s+/);
    for (let n = Math.min(3, ws.length); n >= 1; n--) if (ws.slice(-n).join("").length >= 4 || n === ws.length) add(ws.slice(-n).join(" "));
  }
  for (const m of text.matchAll(/[A-Za-z][A-Za-z0-9\-+.]*(?: [A-Za-z0-9][A-Za-z0-9\-+.]*){0,4}/g)) add(m[0].replace(/[.\-]+$/, ""));
  for (const line of text.split("\n")) {
    const t = line.replace(/\([^)]*\)/g, "").replace(/^[\s\d.\-)가-하]{0,4}[.)]\s*/, "").trim();
    const m = t.match(/^(.{2,26}?)(?:에 대하여|에 대해|에 관하여|에 관해|을 설명|를 설명|이란|란 무엇|의 개념|의 정의|의 종류|의 유형|의 특징|의 구성|의 원리|의 동작|의 절차|의 장단점|의 필요성|을 비교|를 비교| 개념| 비교|$)/);
    if (m) for (const part of m[1].split(/,|와 |과 | 및 |·|\//)) if (/[가-힣]/.test(part)) add(part.trim().replace(/^(?:운영체제|데이터베이스|네트워크|소프트웨어|인공지능)(?:에서|의)?\s+/, ""));
  }
  return out;
}
const qTerms = bank.map((q) => ({ q, terms: termsOf(q.text) }));
const byTerm = new Map<string, Q[]>();
for (const { q, terms } of qTerms) for (const k of terms) { let a = byTerm.get(k); if (!a) byTerm.set(k, (a = [])); a.push(q); }

/** 교재 이름 후보: 표의 1·2열(3열 이상일 때 2열도)과 키워드 */
type Cand = { label: string; keys: Set<string>; parents: Map<string, string> };
const cands = new Map<string, Cand>();
function addCand(raw: string, parent: string, where: string) {
  for (let item of raw.split(/\n|,\s+| \/ |·/)) {
    item = item.replace(/^[-–•\s①-⑳\d.)]+/, "").trim();
    if (item.length < 2 || item.length > 40) continue;
    const en = item.match(/\(([A-Za-z][^)]*)\)/)?.[1];
    const ko = item.replace(/\([^)]*\)/g, "").trim();
    const keys = [item, en, ko].filter((x): x is string => !!x).map(sq).filter((k) => k.length >= 2 && !GENERIC.has(k) && (/[a-z]/.test(k) ? k.length >= 2 : k.length >= 3));
    if (!keys.length) continue;
    const id = sq(ko || item);
    let c = cands.get(id);
    if (!c) cands.set(id, (c = { label: item, keys: new Set(), parents: new Map() }));
    for (const k of keys) c.keys.add(k);
    if (!c.parents.has(parent)) c.parents.set(parent, where);
  }
}
for (const s of SUBNOTES) {
  for (const kw of s.keywords || []) addCand(kw, s.title, "키워드");
  for (const t of s.tables || []) for (const row of t.rows) {
    addCand(row[0] || "", s.title, `표[${t.caption}] 1열`);
    if (row.length >= 3) addCand(row[1] || "", s.title, `표[${t.caption}] 2열`);
  }
}

const rows = [];
for (const c of cands.values()) {
  const qs = new Map<string, Q>();
  for (const k of c.keys) for (const q of byTerm.get(k) || []) qs.set(q.id, q);
  if (qs.size < MIN) continue;
  if (titlesMatching(`${c.label}에 대하여 설명하시오.`, T).length) continue; // 이미 토픽·서브 토픽으로 걸린다
  const list = [...qs.values()];
  const un = list.filter((q) => !titlesMatching(q.text, T).length).length;
  const past = list.filter((q) => /^[kc]\d/.test(q.id)).length, ns = list.filter((q) => q.id.startsWith("ns")).length;
  rows.push({ label: c.label, keys: [...c.keys], n: list.length, un, past, ns, parents: [...c.parents].slice(0, 3), sample: list.slice(0, 4).map((q) => `${q.id} ${q.text.split("\n")[0].slice(0, 70)}`) });
}
rows.sort((a, b) => b.past * 3 + b.ns * 2 + b.n - (a.past * 3 + a.ns * 2 + a.n));
if (process.argv[3]) writeFileSync(process.argv[3], JSON.stringify(rows, null, 1));
console.log(`교재 이름 ${cands.size} · 후보 ${rows.length}`);
for (const r of rows) console.log(`${String(r.n).padStart(3)} (안 걸림 ${String(r.un).padStart(2)}) 기출${String(r.past).padStart(2)} NS${String(r.ns).padStart(2)} | ${r.label} | ${r.parents.map(([p, w]) => `${p.slice(0, 24)} «${w.slice(0, 18)}»`).join(" / ")} | ${r.sample[0].slice(0, 60)}`);
