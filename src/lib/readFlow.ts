/**
 * 지하철 「술술 읽기」 자료 — 과목 하나를 토픽 지도 차례(영역 → 분류 → 토픽 → 하위 토픽)로 이어 붙인다.
 *
 * 2026-11-15 "지하철 메뉴는 플래시 카드는 안되겠다. 그냥 술술 읽어서 계속 머리에 들어오도록 … 꼬리에 꼬리를 무는 토픽설명" —
 * 카드를 뒤집고 「외웠어요」를 누르던 화면을, 내려 읽기만 하면 되는 글로 바꿨다. 글은 지어내지 않는다:
 * 정의·특징·표는 교재 서브노트 그대로이고, 표는 「이름 — 설명」 줄로 풀어 쓴다.
 * 토픽을 잇는 「꼬리」는 토픽 지도의 관계(종류·구성·기법 …와 그 까닭)와, 같은 문항에 함께 나온 토픽이다.
 * 영역·분류 이름과 관계는 학습 길잡이라 교재 용어가 아니다(topicTree.ts 머리말).
 */
import "server-only";
import { SUBNOTES, subnoteByTitle, type SubnoteTable, type TextbookSubnote } from "@/data/textbookSubnotes";
import { TOPIC_TREE, type TreeItem, type TreeKid, type TopicRel } from "@/data/topicTree";
import { COURSE_TOPICS } from "@/data/curriculum";
import { subTopicsOf } from "@/data/subTopics";
import { twinOf } from "@/data/twinTopics";
import { handDiagramsFor } from "@/data/handDiagrams";
import { coTopics } from "@/lib/topicCo";
import { commuteHref, flowAnchor } from "@/lib/links";
import { subDefFor } from "@/lib/subCards";
import { topicWhy } from "@/data/topicWhy";
import { topicBasics, type TopicBasics } from "@/data/topicBasics";
import glossData from "@/data/gloss.json";

/** 간글 — 표(t, 표 순서대로)마다 「이 표가 말하는 것」 한 줄. 답안지 템플릿의 표 아래 간글과 같은 자료다 */
const GLOSS = glossData as Record<string, { d?: string; t: string[] }>;

/** 한 줄 = 이름 — 설명. 1열로 묶인 행은 이름 아래 항목(items)으로 내려 쓴다 */
export type FlowPara = {
  caption: string;
  lines: { head?: string; body: string; items?: string[] }[];
  /** 이 표가 말하는 것 한 줄(간글) — 항목을 읽기 전에 무엇을 보라는 표인지 알려 준다 */
  gloss?: string;
};
export type FlowTail = { title: string; why: string; href: string };
export type FlowBlock = {
  /** 쪽 안 닻(#) */
  id: string;
  title: string;
  area: string;
  group: string;
  /** 영역·분류가 바뀌는 첫 토픽인가 — 머리말을 그린다 */
  newArea: boolean;
  newGroup: boolean;
  /** 상위 토픽에서 이어진 까닭(하위 토픽일 때) */
  from?: { parent: string; rel: TopicRel; why: string };
  priority?: string;
  /** 왜 있는가 — 이것이 없을 때의 문제와 그래서 하는 일(topicWhy.ts, 학습 길잡이) */
  why?: string;
  /** 처음 보는 사람용 풀이 — 먼저 알아둘 말·어떻게 돌아가나·예(topicBasics.ts, 학습 길잡이) */
  basics?: TopicBasics;
  /** 교재 서브노트가 없으면(CONTENTS 에만 있는 토픽) 제목만 */
  def?: string;
  concepts: { name: string; def: string; features?: string[] }[];
  features: string[];
  /** 손글씨 개념도(정리 노트에서 잘라 둔 그림) */
  diagrams: string[];
  paras: FlowPara[];
  /** 이 토픽 안의 서브 토픽 — 기필반 카드에 같은 이름이 있으면 정의도 */
  subTopics: { name: string; def?: string }[];
  tails: FlowTail[];
};

const COURSE = new Map(SUBNOTES.map((s) => [s.title, s.course]));
/** 다른 토픽으로 건너가는 주소 — 같은 과목이면 쪽 안 닻 */
const flowHref = (title: string): string | undefined => {
  const c = COURSE.get(title);
  return c ? commuteHref(c, title) : undefined;
};

/** 이름 칸 — 칸 너비 때문에 접힌 이름을 한 줄로 */
const one = (c: string) => (c || "").replace(/\s*\n\s*/g, " ").trim();
/**
 * 설명 칸 — 줄은 대개 서로 다른 항목이라 쉼표로 잇는다(「PCB·스케줄링, 상태 전이 관리, 문맥교환」).
 * 앞줄이 조사·연결어미로 끝나면 한 문장이 접힌 것이라 띄어쓰기로 잇는다(「명령어 흐름만 / 존재하는 구조」).
 */
const CONT = /(?:[을를이가은는의에로와과만도고며서여및]|하는|되는|위한|통한|대한|으로|에서|하여|위해|따라|에게|부터|까지|보다|처럼|한|된|될|할|해)$/;
const say = (c: string) =>
  (c || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .reduce((acc, line) => (acc ? acc + (CONT.test(acc) ? " " : ", ") + line : line), "");
/** 맨 뒤 열이 설명 꼴인가 — [구분 | 항목 | 설명] 과 비교표를 가른다 */
const DESC = /설명|내용|특징|개요|역할|기능|의미|정의|개념|비고|방법|동작|원리|사례|예시|상세|활동|산출물|효과|목적/;

/** 교재 표 한 장을 「이름 — 설명」 줄로 푼다(글자는 교재 그대로, 칸 안 줄바꿈만 띄어쓰기로) */
function paraOf(t: SubnoteTable): FlowPara {
  const H = t.headers;
  const n = H.length;
  // 이름 칸(1열, [구분 | 항목 | 설명] 의 2열)은 한 줄로, 나머지는 설명 칸으로 읽는다
  const nameCols = n === 3 && DESC.test(H[2]) ? 2 : 1;
  const rows = t.rows.map((r) => r.map((c, i) => (i < nameCols ? one(c) : say(c))));
  const lines: FlowPara["lines"] = [];
  if (n <= 1) {
    lines.push({ body: rows.map((r) => r[0]).filter(Boolean).join(" · ") });
  } else if (n === 2) {
    for (const r of rows) if (r[0] || r[1]) lines.push({ head: r[0], body: r[1] });
  } else if (n === 3 && DESC.test(H[2])) {
    // 1열이 같은 행끼리 묶는다 — 「H/W 인터럽트: 기계 착오(정전 …) / 재시작(…)」
    const groups: { g: string; items: string[] }[] = [];
    const repeats = new Set(rows.map((r) => r[0])).size < rows.length;
    for (const r of rows) {
      if (!repeats) {
        lines.push({ head: [r[0], r[1]].filter(Boolean).join(" · "), body: r[2] });
        continue;
      }
      const last = groups[groups.length - 1];
      const item = r[2] ? `${r[1]}(${r[2]})` : r[1];
      if (last && last.g === r[0]) last.items.push(item);
      else groups.push({ g: r[0], items: [item] });
    }
    for (const g of groups) lines.push(g.items.length > 1 ? { head: g.g, body: "", items: g.items } : { head: g.g, body: g.items[0] });
  } else {
    // 비교표 — 「비교 항목 — A: … / B: …」
    for (const r of rows) {
      const body = r
        .slice(1)
        .map((c, i) => (c ? `${one(H[i + 1])}: ${c}` : ""))
        .filter(Boolean)
        .join(" / ");
      if (r[0] || body) lines.push({ head: r[0], body });
    }
  }
  return { caption: t.caption, lines: lines.filter((l) => l.body || l.head || l.items?.length) };
}

function conceptsOf(s: TextbookSubnote): FlowBlock["concepts"] {
  if (s.defPair?.length) return s.defPair.map((p) => ({ name: p.name, def: p.def, features: p.features }));
  if (s.subDefs?.length) return s.subDefs.map((p) => ({ name: p.name, def: p.def, features: p.features }));
  return [];
}

/** 과목 코드 → 읽을 차례대로 놓은 토픽 블록 */
export function readFlow(code: string): FlowBlock[] {
  const tree = TOPIC_TREE[code] ?? [];
  const pri = new Map((COURSE_TOPICS[code] ?? []).map((t) => [t.title, t.priority as string]));
  const out: FlowBlock[] = [];
  let lastArea = "", lastGroup = "";
  const inFlow = new Set<string>();

  const push = (title: string, area: string, group: string, from?: FlowBlock["from"]) => {
    const s = subnoteByTitle(title);
    const real = s?.title ?? title;
    inFlow.add(real);
    out.push({
      id: flowAnchor(real),
      title: real,
      area,
      group,
      newArea: area !== lastArea,
      newGroup: area !== lastArea || group !== lastGroup,
      from,
      priority: pri.get(title) ?? pri.get(real),
      why: topicWhy(real, s?.course ?? code),
      basics: topicBasics(real, s?.course ?? code),
      def: s?.definition,
      concepts: s ? conceptsOf(s) : [],
      features: s?.features ?? [],
      diagrams: handDiagramsFor(real),
      paras: s
        ? s.tables
            .map((t, i) => ({ ...paraOf(t), gloss: (GLOSS[`${s.title}@${s.course}`] ?? GLOSS[s.title])?.t[i] || undefined }))
            .filter((p) => p.lines.length)
        : [],
      subTopics: subTopicsOf(real).map((x) => ({ name: x.name, def: subDefFor(x.name) })),
      tails: [],
    });
    lastArea = area;
    lastGroup = group;
  };
  const walkKids = (parent: string, kids: TreeKid[], area: string, group: string) => {
    for (const k of kids) {
      push(k.t, area, group, { parent, rel: k.rel, why: k.why });
      if (k.kids?.length) walkKids(k.t, k.kids, area, group);
    }
  };
  for (const a of tree)
    for (const g of a.groups)
      for (const it of g.items as TreeItem[]) {
        if (typeof it === "string") push(it, a.name, g.name);
        else {
          push(it.t, a.name, g.name);
          walkKids(it.t, it.kids, a.name, g.name);
        }
      }

  // 꼬리 — 사실상 같은 토픽, 같은 문항에 함께 나온 토픽(이 과목에서 바로 다음에 읽을 토픽은 뺀다)
  out.forEach((b, i) => {
    const next = out[i + 1]?.title;
    const seen = new Set<string>([b.title, next ?? ""]);
    const tw = twinOf(b.title);
    if (tw) {
      const href = flowHref(tw.title);
      if (href) { b.tails.push({ title: tw.title, why: "사실상 같은 토픽", href }); seen.add(tw.title); }
    }
    for (const c of coTopics(b.title)) {
      if (b.tails.length >= 4) break;
      if (seen.has(c.title) || c.n < 2) continue;
      const href = flowHref(c.title);
      if (!href) continue;
      seen.add(c.title);
      b.tails.push({ title: c.title, why: `같은 문항에 ${c.n}번`, href });
    }
  });
  return out;
}
