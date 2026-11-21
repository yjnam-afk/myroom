/**
 * AI 제공자들이 함께 쓰는 바탕 — 호출 옵션, 설정 오류, 응답 토큰 상한, 타임아웃 fetch.
 * (ai.ts 812줄을 체인·진단(ai.ts) / 제공자별 호출(aiProviders.ts) / 바탕(aiCore.ts)으로 나눴다, 2026-11-20)
 */

export class AIConfigError extends Error {}

export type GenOpts = {
  system: string;
  user: string;
  temperature?: number;
  /** 폴백 체인에서 제공자별 모델을 덮어쓸 때 사용(예: groq의 보조 모델). */
  model?: string;
  /** 이 호출의 응답 토큰 상한(모델별 분당 한도 TPM에 맞춰 조정). */
  maxTokens?: number;
  /** 완성 검증. 통과 못 하면 "그 제공자 실패"로 보고 다음 제공자로 폴백한다.
   *  (약한 모델이 잘린 출력을 내며 체인을 가로채는 문제 방지) */
  valid?: (text: string) => boolean;
};

/**
 * 기본 응답 토큰 상한. Groq 무료 등급은 모델마다 분당 토큰(TPM)이 작아서
 * (요청 = 프롬프트 + max_tokens) 이 TPM을 넘으면 413이 난다. 그래서 모델별로
 * 안전 예산(groqBudget)을 따로 주고, 그 외에는 이 기본값을 쓴다.
 * 4096이면 일반적인 1·2교시 답안은 잘리지 않으면서 작은 모델 한도에도 들어간다.
 */
export const MAX_TOKENS = Number(process.env.AI_MAX_TOKENS) || 4096;

/** Groq 모델별 안전한 응답 토큰 예산.
 *  요청(=프롬프트+max_tokens)이 모델별 분당한도(TPM)를 넘으면 413이 나므로
 *  프롬프트 ~3.5k를 가정해 TPM 안에 들어가도록 보수적으로 잡는다. */
export function groqBudget(model: string): number {
  if (model.includes("llama-3.3-70b")) return 5000; // TPM 12000
  if (model.includes("kimi-k2")) return 3000; // TPM 8000
  if (model.includes("gpt-oss-120b")) return 3000; // TPM 8000
  if (model.includes("gpt-oss-20b")) return 3000; // TPM 8000
  if (model.includes("8b-instant")) return 2000; // TPM 6000
  return 3000;
}

/** 제공자별 fetch에 타임아웃을 건다. 무료 제공자가 응답을 오래 끌면(행) 그 한 번의
 *  호출이 함수 전체 시간예산(maxDuration 60s)을 먹어치워 504가 나므로, 개별 호출을
 *  일정 시간에 끊고 다음 제공자로 넘어가게 한다. */
const PROVIDER_TIMEOUT_MS = Number(process.env.AI_PROVIDER_TIMEOUT_MS) || 22000;
export async function fetchT(
  url: string,
  opts: RequestInit,
  ms = PROVIDER_TIMEOUT_MS,
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}
