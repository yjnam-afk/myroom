/**
 * 답안지 개념도 사양 — 토픽 답안지 템플릿 「2. ○○의 개념도와 …」 가. 자리에 SVG 로 그린다(ConceptDiagram).
 *
 * 2026-10-11 "교재를 참고로 개념도 그려 줬는데 너는 못 해 주냐" — 교재 슬라이드 그림(public/concept/book·answer)
 * 을 보고 손글씨 답안처럼 다시 그린 것이다. 패턴·규칙은 1교시 지침 4장:
 *  - 패턴 1개: 계층(tree)·중심-위성(hub)·그룹(group)·순환(cycle)·레이어드(layer)·흐름+분기(flow)·시퀀스(sequence)·그래프(graph).
 *    교재에 개념도가 있으면 그 형태를 우선한다.
 *  - 매칭: 1열이 그룹(구분·분류)인 표면 그룹 이름 = 표 1열, 박스 = 표 2열(순서·개수·글자 같게).
 *    1열이 단계·항목인 표면 박스 = 표 1열.
 *  - hi = 강조할 박스 하나(주제 박스). 그룹(점선)은 필수.
 * 키 = 서브노트 제목. 두 개념 토픽(2항목형)은 배열로 A·B 각각. gloss = 그림 간글(40자 이내).
 */
import type { AnswerConclusion } from "./answerConclusions";

export type ConceptSpec = { hi?: string; gloss?: string; note?: string } & (
  | {
      pattern: "group";
      groups: { name: string; items: string[] }[];
      /** [from 그룹, to 그룹, 라벨] */
      arrows?: [number, number, string?][];
      both?: boolean;
      /** 그룹 안 최대 행 수(기본 3) */
      rows?: number;
    }
  | {
      pattern: "flow";
      steps: string[];
      labels?: string[];
      branch?: { from: number; steps: string[]; label?: string; parallel?: boolean; dashed?: boolean };
      loop?: boolean;
      loopLabel?: string;
    }
  | { pattern: "cycle"; steps: string[]; center?: string }
  | { pattern: "layer"; layers: { name: string; items: string[] }[] }
  | { pattern: "sequence"; actors: string[]; msgs: { from: number; to: number; label: string; dashed?: boolean }[] }
  | { pattern: "hub"; center: string; items: string[] }
  | { pattern: "tree"; root: string; children: { label: string; children?: string[] }[] }
  | { pattern: "graph"; graph: NonNullable<AnswerConclusion["graph"]> }
);

export const CONCEPT_DIAGRAMS: Record<string, ConceptSpec | ConceptSpec[]> = {};

export const conceptFor = (title?: string | null): ConceptSpec[] => {
  const v = title ? CONCEPT_DIAGRAMS[title] : undefined;
  return !v ? [] : Array.isArray(v) ? v : [v];
};
