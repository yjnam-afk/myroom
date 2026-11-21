/**
 * 제공자별 호출 — Gemini · Anthropic · Groq · Cerebras · OpenRouter · Ollama.
 * 폴백 체인과 진단은 ai.ts 에 있다. 새 제공자를 더하면 여기에 함수를 넣고 PROVIDERS 에 이름을 건다.
 */
import { AIConfigError, MAX_TOKENS, fetchT, groqBudget, type GenOpts } from "@/lib/aiCore";

/** Gemini API 키 목록. 한도는 키(프로젝트)별로 따로라 여러 개면 그만큼 일일 한도가 늘어난다.
 *  GEMINI_API_KEYS(콤마 구분) + GEMINI_API_KEY / GEMINI_API_KEY_2 / _3 ... 모두 모은다. */
export function geminiKeys(): string[] {
  const raw: string[] = [];
  if (process.env.GEMINI_API_KEYS) raw.push(...process.env.GEMINI_API_KEYS.split(","));
  if (process.env.GEMINI_API_KEY) raw.push(...process.env.GEMINI_API_KEY.split(","));
  for (let i = 2; i <= 6; i++) {
    const k = process.env[`GEMINI_API_KEY_${i}`];
    if (k) raw.push(...k.split(","));
  }
  return Array.from(new Set(raw.map((s) => s.replace(/\s/g, "")).filter(Boolean)));
}

async function generateWithGemini({
  system,
  user,
  temperature = 0.4,
  model: modelOverride,
  maxTokens,
}: GenOpts): Promise<string> {
  const keys = geminiKeys();
  if (keys.length === 0) {
    throw new AIConfigError(
      "GEMINI_API_KEY 가 설정되지 않았습니다. .env.local 파일에 키를 추가하세요. (https://aistudio.google.com/apikey)",
    );
  }
  const max = maxTokens || MAX_TOKENS;
  const model = modelOverride || process.env.GEMINI_MODEL || "gemini-2.0-flash";

  // Gemma 계열 모델은 systemInstruction 필드를 지원하지 않으므로,
  // 시스템 프롬프트를 사용자 메시지 앞에 합쳐 전달한다.
  const isGemma = model.toLowerCase().includes("gemma");
  const body = JSON.stringify(
    isGemma
      ? {
          contents: [
            { role: "user", parts: [{ text: `${system}\n\n${user}` }] },
          ],
          generationConfig: { temperature, maxOutputTokens: max },
        }
      : {
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { temperature, maxOutputTokens: max },
        },
  );

  let lastErr = "";
  for (const apiKey of keys) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetchT(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text || "")
        .join("");
      if (!text) throw new Error("Gemini 응답이 비어 있습니다.");
      return text.trim();
    }
    const detail = await res.text();
    lastErr = `Gemini API 오류 (${res.status}): ${detail}`;
    // 429(한도 초과)·5xx만 다음 키로 재시도. 400/403 등은 키 바꿔도 동일 → 즉시 중단.
    if (res.status !== 429 && res.status < 500) break;
  }
  throw new Error(lastErr || "Gemini 호출 실패");
}

/**
 * Anthropic Claude. 무료는 아니지만 Haiku는 매우 저렴(이 앱 사용량이면 월 몇 백 원 수준)하고
 * 품질이 가장 좋다. 키만 있으면 AI_PROVIDERS="anthropic,groq" 로 최우선 사용.
 */
async function generateWithAnthropic({
  system,
  user,
  temperature = 0.4,
  model: modelOverride,
  maxTokens,
}: GenOpts): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AIConfigError(
      "ANTHROPIC_API_KEY 가 설정되지 않았습니다. https://console.anthropic.com/ 에서 키를 발급해 환경변수에 추가하세요.",
    );
  }
  const model = modelOverride || process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

  const res = await fetchT("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens || MAX_TOKENS,
      temperature,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Anthropic API 오류 (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text = Array.isArray(data?.content)
    ? data.content.map((b: { text?: string }) => b.text || "").join("")
    : "";
  if (!text) {
    throw new Error("Anthropic 응답이 비어 있습니다.");
  }
  return text.trim();
}

/** Groq API 키 목록. 한도는 키(계정)별로 따로라 여러 개면 그만큼 한도가 늘어난다.
 *  GROQ_API_KEYS(콤마 구분) + GROQ_API_KEY / GROQ_API_KEY_2 / _3 ... 모두 모은다. */
export function groqKeys(): string[] {
  const raw: string[] = [];
  // GROQ_API_KEYS, GROQ_API_KEY, GROQ_API_KEY_2.. 모두 콤마로 분리 허용
  // (기존 GROQ_API_KEY 변수에 콤마로 여러 개 넣어도 동작하도록)
  if (process.env.GROQ_API_KEYS) raw.push(...process.env.GROQ_API_KEYS.split(","));
  if (process.env.GROQ_API_KEY) raw.push(...process.env.GROQ_API_KEY.split(","));
  for (let i = 2; i <= 6; i++) {
    const k = process.env[`GROQ_API_KEY_${i}`];
    if (k) raw.push(...k.split(","));
  }
  // 각 키에서 공백·줄바꿈 완전 제거(붙여넣기 시 섞인 whitespace/return 문자 방지)
  return Array.from(
    new Set(raw.map((s) => s.replace(/\s/g, "")).filter(Boolean)),
  );
}

async function generateWithGroq({
  system,
  user,
  temperature = 0.4,
  model: modelOverride,
  maxTokens,
}: GenOpts): Promise<string> {
  const keys = groqKeys();
  if (keys.length === 0) {
    throw new AIConfigError(
      "GROQ_API_KEY 가 설정되지 않았습니다. .env.local 파일에 키를 추가하세요. (https://console.groq.com/keys)",
    );
  }
  const model = modelOverride || process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const body = JSON.stringify({
    model,
    temperature,
    max_tokens: maxTokens || groqBudget(model),
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  let lastErr = "";
  for (const apiKey of keys) {
    const res = await fetchT("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });
    if (res.ok) {
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error("Groq 응답이 비어 있습니다.");
      return text.trim();
    }
    const detail = await res.text();
    lastErr = `Groq API 오류 (${res.status}): ${detail}`;
    // 429(한도 초과)·5xx만 다음 키로 재시도. 400/413 등은 키 바꿔도 동일 → 즉시 중단.
    if (res.status !== 429 && res.status < 500) break;
  }
  throw new Error(lastErr || "Groq 호출 실패");
}

/** Cerebras 모델 후보. 무료/제한 계정은 70b 접근 권한이 없어 404가 날 수 있으므로
 *  큰 모델부터 시도하고, 접근 불가(404)면 널리 열려있는 작은 모델로 폴백한다. */
function cerebrasModels(): string[] {
  const primary = process.env.CEREBRAS_MODEL || "llama-3.3-70b";
  const fallbacks = (
    process.env.CEREBRAS_FALLBACK_MODELS || "llama3.1-8b,llama-3.3-70b"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set([primary, ...fallbacks]));
}

/** 발견해 검증된 Cerebras 모델을 프로세스 수명 동안 캐시(계정별 404 탐색 반복 방지). */
let cerebrasResolvedModel: string | null = null;

/** 접근 가능한 모델 목록에서 한국어 산문 품질·비추론 우선으로 하나 고른다. */
function pickCerebrasModel(live: string[]): string | undefined {
  const prefer = [/glm/i, /qwen/i, /llama/i, /gemma/i, /mistral/i];
  return (
    prefer.map((re) => live.find((m) => re.test(m))).find(Boolean) ||
    live.find((m) => !/gpt-oss|reason/i.test(m)) ||
    live[0]
  );
}

/** 이 Cerebras 키가 실제로 접근 가능한 모델 id 목록을 조회한다(계정마다 다름).
 *  404 폴백에도 실패할 때 "무엇을 쓸 수 있는지" 알아내는 최후 수단. */
export async function fetchCerebrasModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetchT("https://api.cerebras.ai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const ids = (data?.data || [])
      .map((m: { id?: string }) => m.id)
      .filter((s: unknown): s is string => typeof s === "string");
    return ids;
  } catch {
    return [];
  }
}

/**
 * Cerebras — 무료 등급 한도가 큼(일 100만 토큰급, 카드 불필요).
 * OpenAI 호환 API. https://cloud.cerebras.ai 에서 무료 키 발급.
 */
async function generateWithCerebras({
  system,
  user,
  temperature = 0.4,
  model: modelOverride,
  maxTokens,
}: GenOpts): Promise<string> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new AIConfigError(
      "CEREBRAS_API_KEY 가 설정되지 않았습니다. https://cloud.cerebras.ai 에서 무료 키를 발급해 환경변수에 추가하세요.",
    );
  }
  const call = async (model: string) => {
    const res = await fetchT("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens || MAX_TOKENS,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    return res;
  };

  const readText = async (res: Response) => {
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("Cerebras 응답이 비어 있습니다.");
    return text.trim();
  };

  // 모델 지정 시 그 모델만, 아니면 [이미 발견한 모델] + 후보들 순서대로.
  // 한 번 발견한 모델을 앞세워, 계정별 404 탐색을 반복하지 않는다.
  const models = modelOverride
    ? [modelOverride]
    : Array.from(
        new Set([
          ...(cerebrasResolvedModel ? [cerebrasResolvedModel] : []),
          ...cerebrasModels(),
        ]),
      );
  let lastErr = "";
  let had404 = false;
  for (const model of models) {
    const res = await call(model);
    if (res.ok) {
      if (!modelOverride) cerebrasResolvedModel = model; // 동작 확인된 모델 기억
      return readText(res);
    }
    const detail = await res.text();
    lastErr = `Cerebras API 오류 (${res.status}): ${detail}`;
    if (res.status === 404) had404 = true;
    // 404(모델 미접근)만 다음 모델로 폴백. 429/5xx 등은 모델 바꿔도 동일 → 중단.
    if (res.status !== 404) break;
  }
  // 후보가 전부 404(계정 미접근)면, 이 키가 실제 쓸 수 있는 모델을 조회해 한 번 더.
  if (had404 && !modelOverride) {
    const pick = pickCerebrasModel(await fetchCerebrasModels(apiKey));
    if (pick) {
      const res = await call(pick);
      if (res.ok) {
        cerebrasResolvedModel = pick; // 이후 호출부터는 바로 이 모델로.
        return readText(res);
      }
      lastErr = `Cerebras API 오류 (${res.status}, 자동선택 ${pick}): ${await res.text()}`;
    } else {
      lastErr += " | /v1/models 조회 결과 사용 가능한 모델 없음(키 권한 확인 필요)";
    }
  }
  throw new Error(lastErr || "Cerebras 호출 실패");
}

async function generateWithOpenRouter({
  system,
  user,
  temperature = 0.4,
  model: modelOverride,
  maxTokens,
}: GenOpts): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new AIConfigError(
      "OPENROUTER_API_KEY 가 설정되지 않았습니다. https://openrouter.ai/keys 에서 무료 키를 발급해 환경변수에 추가하세요.",
    );
  }
  // 기본값: 무료 Gemma. 다른 무료 모델은 https://openrouter.ai/models 에서 확인.
  const model =
    modelOverride || process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it:free";

  const res = await fetchT("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://github.com/yjnam-afk/study",
      "X-Title": "정보관리기술사 학습 앱",
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens || MAX_TOKENS,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OpenRouter API 오류 (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("OpenRouter 응답이 비어 있습니다.");
  }
  return text.trim();
}

/**
 * 로컬 Ollama(내 PC)에서 Gemma 등을 실행해 사용합니다. API 키가 필요 없습니다.
 * ※ 로컬에서 앱을 실행할 때만 동작합니다(공개 Vercel 주소에서는 내 PC에 접속 불가).
 */
async function generateWithOllama({
  system,
  user,
  temperature = 0.4,
  model: modelOverride,
}: GenOpts): Promise<string> {
  const base = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = modelOverride || process.env.OLLAMA_MODEL || "gemma3:4b";

  let res: Response;
  try {
    res = await fetchT(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
  } catch {
    throw new AIConfigError(
      `Ollama 서버(${base})에 연결할 수 없습니다. Ollama가 실행 중인지(앱 실행/'ollama serve'), 모델을 받았는지('ollama pull ${model}') 확인하세요.`,
    );
  }

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Ollama 오류 (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Ollama 응답이 비어 있습니다.");
  }
  return text.trim();
}

/** 제공자 이름 → 생성 함수 매핑. */
export const PROVIDERS: Record<string, (opts: GenOpts) => Promise<string>> = {
  anthropic: generateWithAnthropic,
  claude: generateWithAnthropic,
  gemini: generateWithGemini,
  groq: generateWithGroq,
  cerebras: generateWithCerebras,
  openrouter: generateWithOpenRouter,
  ollama: generateWithOllama,
};
