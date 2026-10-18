/**
 * 토픽 사이 종속 관계 — 토픽 지도가 상위 토픽 아래로 하위 토픽을 묶어 그린다.
 *
 * 2026-10-11 "토픽들 중에서도 종속관계가 있을 텐데 그것까지" 로 손으로 적은 212개 목록이었는데,
 * 2026-10-17 지도를 영역 → 분류 → 토픽 계층(topicTree)으로 다시 짜면서 관계도 그 계층 안에 함께 적는다.
 * 여기는 계층에서 뽑아 쓰는 창구다 — 관계를 고치려면 topicTree.ts 를 고친다.
 * rel: 종류(하위 유형) · 구성·기법(안에 쓰이는 요소·기법) · 문제·해결(생기는 문제나 그 해법) · 확장·발전
 */
import { TREE_LINKS, type TopicRel, type TreeLink } from "./topicTree";

export type { TopicRel };
export type TopicLink = TreeLink;
export const TOPIC_PARENTS: TopicLink[] = TREE_LINKS;

const BY_CHILD = new Map<string, TopicLink>();
for (const l of TOPIC_PARENTS) if (!BY_CHILD.has(l.child)) BY_CHILD.set(l.child, l);
const BY_PARENT = new Map<string, TopicLink[]>();
for (const l of TOPIC_PARENTS) {
  if (!BY_PARENT.has(l.parent)) BY_PARENT.set(l.parent, []);
  if (!BY_PARENT.get(l.parent)!.some((x) => x.child === l.child)) BY_PARENT.get(l.parent)!.push(l);
}

export const parentLink = (title: string): TopicLink | undefined => BY_CHILD.get(title);
export const childLinks = (title: string): TopicLink[] => BY_PARENT.get(title) ?? [];
