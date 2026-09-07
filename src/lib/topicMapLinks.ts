/**
 * 이 토픽이 토픽 지도의 어느 비교 세트·암기표에 등장하는지 찾는다.
 *
 * 토픽 설명은 한 토픽을 깊게 파고, 토픽 지도는 여러 토픽을 나란히 놓는다.
 * 그런데 시험은 대개 "나란히"로 나온다 — 페이징과 세그멘테이션을 비교하라,
 * 뮤텍스와 세마포어의 차이를 쓰라. 그래서 토픽 하나를 다 읽은 자리에서
 * "이건 무엇과 짝인가"로 바로 넘어갈 수 있어야 한다.
 *
 * 매칭은 두 갈래다.
 *  ① 비교 세트의 항목 이름이 이 토픽인 경우 — 짝을 이루는 개념들이 나온다.
 *  ② 비교 세트 제목이 이 토픽인 경우 — 그 토픽을 쪼갠 표가 나온다.
 * 둘 다 괄호 병기·공백 차이를 무시하고 느슨하게 본다.
 */
import { compareSets, type CompareSet } from "@/data/compareSets";
import { memoryTables } from "@/data/memoryTables";

function norm(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[(（][^)）]*[)）]/g, "")
    .replace(/[\s()·,\-_/'’]/g, "");
}

export type MapLink = {
  set: CompareSet;
  /** 이 토픽이 세트의 항목으로 들어 있나(=짝 비교), 아니면 세트 제목인가(=쪼갠 표) */
  kind: "item" | "title";
};

const BY_KEY = new Map<string, MapLink[]>();
function push(key: string, link: MapLink) {
  const k = norm(key);
  if (!k) return;
  if (!BY_KEY.has(k)) BY_KEY.set(k, []);
  const list = BY_KEY.get(k)!;
  // 같은 세트가 제목·항목 양쪽으로 걸리면 한 번만.
  if (!list.some((x) => x.set === link.set)) list.push(link);
}
for (const set of compareSets) {
  push(set.title, { set, kind: "title" });
  for (const it of set.items) push(it.name, { set, kind: "item" });
}

/** 최대 몇 개까지 붙일지 — 토픽 설명이 비교 세트로 뒤덮이면 안 된다. */
const MAX_SETS = 5;

/**
 * 이 토픽이 등장하는 비교 세트들. 짝 비교(item)를 먼저 준다.
 *
 * 이름이 정확히 같은 것만 찾으면 대부분 놓친다 — 토픽은 "커널(Kernel)"인데
 * 세트 제목은 "커널의 종류", 토픽은 "단편화"인데 세트는 "내부 단편화 vs 외부
 * 단편화"다. 그래서 정확히 같은 것을 먼저 잡고, 없으면 포함까지 본다.
 * 다만 두 글자짜리 토픽이 아무 데나 걸리지 않도록 포함 매칭은 제목에만 쓴다.
 */
export function compareSetsFor(title?: string): MapLink[] {
  if (!title) return [];
  const k = norm(title);
  if (!k) return [];

  const out: MapLink[] = [...(BY_KEY.get(k) ?? [])];
  const has = (s: CompareSet) => out.some((x) => x.set === s);

  if (k.length >= 2) {
    for (const set of compareSets) {
      if (has(set)) continue;
      // 세트 제목이 이 토픽을 품고 있으면 그 토픽을 쪼갠 표다.
      if (norm(set.title).includes(k)) out.push({ set, kind: "title" });
    }
    for (const set of compareSets) {
      if (has(set)) continue;
      // 항목 이름이 이 토픽을 품고 있으면 짝 비교다.
      if (set.items.some((it) => norm(it.name).includes(k)))
        out.push({ set, kind: "item" });
    }
  }

  // 교재에서 옮긴 세트가 먼저, 그 안에서 짝 비교(item)가 먼저.
  const src = (x: MapLink) => (x.set.source === "교재" ? 0 : 1);
  return out
    .sort(
      (a, b) =>
        src(a) - src(b) ||
        (a.kind === "item" ? 0 : 1) - (b.kind === "item" ? 0 : 1),
    )
    .slice(0, MAX_SETS);
}

export type MemoryTableHit = (typeof memoryTables)[number];

/**
 * 이 토픽을 다루는 암기표.
 * 표 내용 전체를 훑으면 흔한 낱말("관리")에 아무 표나 걸리므로, 제목과
 * 도입문만 본다. 표 안까지 뒤지는 건 지도의 검색이 할 일이다.
 */
export function memoryTablesFor(title?: string): MemoryTableHit[] {
  if (!title) return [];
  const k = norm(title);
  if (k.length < 2) return [];
  return memoryTables.filter(
    (t) => norm(t.title).includes(k) || norm(t.intro).includes(k),
  );
}
