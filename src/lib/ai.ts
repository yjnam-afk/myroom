/**
 * AI 제공자 추상화 레이어.
 *
 * 기본 제공자는 Google Gemini(무료 등급)이며, 환경변수 AI_PROVIDER=groq 로
 * 설정하면 Groq(무료 등급)로 교체할 수 있습니다. 두 제공자 모두 무료로
 * 사용할 수 있어 학습용 앱에 적합합니다.
 *
 * 이 파일은 폴백 체인·진단·JSON 응답만 맡는다. 제공자별 호출은 aiProviders.ts, 함께 쓰는 바탕은 aiCore.ts.
 * 새 제공자를 더하려면 aiProviders.ts 에 함수를 넣고 PROVIDERS 에 이름을 건다.
 */

import { AIConfigError, groqBudget, type GenOpts } from "@/lib/aiCore";
import { PROVIDERS, geminiKeys, groqKeys, fetchCerebrasModels } from "@/lib/aiProviders";

export { AIConfigError };

/**
 * AI 출력에 가끔 섞이는 일본어 가나·한자(중국어)·깨진 문자를 제거해 한글 답안만 남깁니다.
 */
function sanitizeOutput(text: string): string {
  return text
    .replace(/[぀-ヿｦ-ﾟ]/g, "") // 히라가나·가타카나·반각 가타카나
    .replace(/[一-鿿㐀-䶿]/g, "") // CJK 한자
    .replace(/�/g, "") // 대체 문자(�)
    .replace(/[ \t]{2,}/g, " ");
}

type ChainEntry = { name: string; model?: string; maxTokens?: number };

/** Groq 무료 등급은 토큰 한도(TPD)가 "모델별"로 따로 적용되므로,
 *  같은 API 키로 여러 모델을 폴백시키면 하나가 막혀도 다음 모델로 계속 동작한다.
 *  앞쪽이 최고사양(품질), 뒤쪽은 비상용(작지만 한도 여유) — 앱이 완전히 멈추지 않도록. */
function groqModels(): string[] {
  const primary = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const fallbacks = (
    process.env.GROQ_FALLBACK_MODELS ||
    "openai/gpt-oss-120b,moonshotai/kimi-k2-instruct,openai/gpt-oss-20b,llama-3.1-8b-instant"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set([primary, ...fallbacks]));
}

/**
 * 사용할 제공자 순서(폴백 체인).
 *  - AI_PROVIDERS="groq,openrouter,gemini" 처럼 콤마로 나열(앞의 것이 막히면 다음으로).
 *  - "groq:llama-3.1-8b-instant" 처럼 제공자:모델 로 모델까지 지정 가능.
 *  - groq를 모델 지정 없이 넣으면 여러 Groq 모델로 자동 확장(같은 키, 모델별 한도 분리).
 *  - 없으면 기존 AI_PROVIDER(단일, 기본 gemini) 사용.
 */
function providerChain(): ChainEntry[] {
  const entries: ChainEntry[] = [];
  const seen = new Set<string>();
  const add = (name: string, model?: string, maxTokens?: number) => {
    const key = `${name}:${model || ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ name, model, maxTokens });
  };
  // 제공자 1개 추가(groq는 모델 미지정 시 여러 모델로 자동 확장).
  const addProvider = (name: string, model?: string) => {
    if (name === "groq" && !model) {
      for (const m of groqModels()) add("groq", m, groqBudget(m));
    } else {
      add(name, model, name === "groq" && model ? groqBudget(model) : undefined);
    }
  };

  // 1) 명시적으로 설정한 순서를 최우선으로 사용.
  const multi = process.env.AI_PROVIDERS;
  const explicit = multi?.trim()
    ? multi.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
    : process.env.AI_PROVIDER
      ? [process.env.AI_PROVIDER.toLowerCase()]
      : [];
  for (const token of explicit) {
    const idx = token.indexOf(":");
    const name = idx === -1 ? token : token.slice(0, idx);
    const model = idx === -1 ? undefined : token.slice(idx + 1).trim();
    addProvider(name, model);
  }

  // 2) (자동 폴백) 키가 설정된 모든 무료 제공자를 체인 뒤에 자동으로 덧붙인다.
  //    → AI_PROVIDERS를 일일이 맞추지 않아도, 키만 있으면 한도 소진 시 다음 제공자로 넘어간다.
  if (groqKeys().length) {
    const models = groqModels();
    add("groq", models[0], groqBudget(models[0])); // 주력(70b) 먼저
    // Cerebras(70b·일 100만 토큰급)를 Groq 꼬마 모델들보다 먼저 —
    // 꼬마 모델이 잘린 출력으로 체인을 가로채는 것 방지.
    if (process.env.CEREBRAS_API_KEY) addProvider("cerebras");
    for (const m of models.slice(1)) add("groq", m, groqBudget(m));
  } else if (process.env.CEREBRAS_API_KEY) {
    addProvider("cerebras");
  }
  if (geminiKeys().length) {
    // Gemini 무료 등급은 일일 한도가 Groq보다 훨씬 커서 강력한 폴백.
    addProvider("gemini");
    addProvider("gemini", "gemini-2.0-flash-lite");
  }
  if (process.env.OPENROUTER_API_KEY) {
    addProvider("openrouter");
    addProvider("openrouter", "meta-llama/llama-3.3-70b-instruct:free");
  }
  if (process.env.ANTHROPIC_API_KEY) addProvider("anthropic"); // 최후 보루(저렴·고품질)
  if (process.env.OLLAMA_BASE_URL) addProvider("ollama");

  // 3) 아무것도 없으면 기존 기본값(gemini).
  if (!entries.length) addProvider("gemini");
  return entries;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


/** 전체 시간 예산(마감). maxDuration(60s)보다 여유를 둬, 이 시각을 넘기면 더 시도하지
 *  않고 깔끔한 안내(503)로 끝낸다 → Vercel 강제 종료(504·비JSON)로 화면이 깨지는 것 방지. */
const OVERALL_DEADLINE_MS = Number(process.env.AI_DEADLINE_MS) || 50000;

/** 제공자별 일시적(순간적) 실패 신호 — 같은 키로 곧바로 재시도하면 풀리는 경우가 많다.
 *  무료 등급의 분당 한도(TPM)·동시요청 제한·5xx 는 잠깐 기다리면 회복된다. */
function isTransient(detail: string): boolean {
  return /rate.?limit|too large|tokens per|\bTP[M]\b|\b429\b|\b5\d\d\b|timeout|fetch failed|ECONN|empty|비어/i.test(
    detail,
  );
}

/** 폴백 체인을 한 번 끝까지 시도한다(각 제공자/모델 순서대로). deadline을 넘기면 중단. */
async function runChainOnce(
  opts: GenOpts,
  deadline: number,
): Promise<
  | { ok: true; text: string }
  | { ok: false; detail: string; allConfigError: boolean; transient: boolean }
> {
  const chain = providerChain();
  const errors: string[] = [];
  let allConfigError = true;

  for (const { name, model, maxTokens } of chain) {
    // 시간 예산을 넘겼으면 더 시도하지 않고 종료(504 방지).
    if (Date.now() > deadline) {
      allConfigError = false;
      errors.push("시간 예산 초과 — 더 이상 제공자를 시도하지 않음");
      break;
    }
    const fn = PROVIDERS[name];
    const label = model ? `${name}(${model})` : name;
    if (!fn) {
      allConfigError = false;
      errors.push(`${label}: 알 수 없는 제공자`);
      continue;
    }
    try {
      const text = sanitizeOutput(await fn({ ...opts, model, maxTokens }));
      if (opts.valid && !opts.valid(text)) {
        allConfigError = false;
        errors.push(`${label}: 불완전 출력(잘림) → 다음 제공자로`);
        continue;
      }
      return { ok: true, text };
    } catch (err) {
      if (!(err instanceof AIConfigError)) allConfigError = false;
      errors.push(`${label}: ${err instanceof Error ? err.message : String(err)}`);
      // 다음 제공자(또는 다음 모델)로 폴백
    }
  }
  const detail = errors.join(" | ");
  return { ok: false, detail, allConfigError, transient: isTransient(detail) };
}

/**
 * 시스템/사용자 프롬프트로 텍스트를 생성합니다.
 * 여러 제공자를 설정하면, 하나가 실패(429 토큰 초과·오류 등)할 때 다음 제공자로 자동 폴백합니다.
 * 무료 등급의 429/5xx 는 "순간적"인 경우가 많아(사용자가 새로고침 2~3번 하면 풀리는 현상),
 * 체인 전체가 일시적 사유로 실패하면 짧은 백오프 후 서버가 알아서 몇 번 더 재시도합니다.
 */
export async function generateText(opts: GenOpts): Promise<string> {
  // 체인 전체 재시도 횟수(maxDuration 60s 안에 들어오도록 보수적으로). 0,0.8s,2s,3.5s 백오프.
  const backoffs = [0, 800, 2000, 3500];
  const deadline = Date.now() + OVERALL_DEADLINE_MS;
  let last:
    | { ok: false; detail: string; allConfigError: boolean; transient: boolean }
    | undefined;

  for (let attempt = 0; attempt < backoffs.length; attempt++) {
    // 시간 예산을 넘겼으면(다음 시도가 마감을 넘길 게 뻔하면) 중단 → 깔끔한 안내로.
    if (Date.now() > deadline) break;
    if (backoffs[attempt]) {
      // 살짝의 지터로 같은 분당창에서 동시에 몰리지 않게.
      await sleep(backoffs[attempt] + Math.floor(Math.random() * 250));
    }
    const r = await runChainOnce(opts, deadline);
    if (r.ok) return r.text;
    last = r;
    // 키 자체가 없으면(설정 문제) 재시도해도 의미 없음 → 즉시 중단.
    if (r.allConfigError) break;
    // 일시적 사유가 아니면(예: 잘못된 요청) 더 시도해도 동일 → 중단.
    if (!r.transient) break;
  }

  const detail = last?.detail || "";
  if (last?.allConfigError) {
    throw new AIConfigError(
      `사용 가능한 AI 제공자가 없습니다. 환경변수를 확인하세요. (${detail})`,
    );
  }
  // 사용량 한도(429/413/TPD/TPM) 신호가 있으면 깔끔한 안내 메시지로 바꿔준다.
  const rateLimited =
    /rate.?limit|too large|tokens per|\bTP[DM]\b|quota|\b429\b|\b413\b/i.test(
      detail,
    );
  const authIssue = /unauthorized|\b401\b|invalid.?api.?key/i.test(detail);
  if (rateLimited && !authIssue) {
    throw new Error(
      "지금 무료 AI 사용량이 가득 찼어요(하루·분당 한도). 몇 분 뒤 다시 시도하거나, 기출 메뉴의 '클로드 모범답안'을 이용해 주세요.",
    );
  }
  throw new Error("AI 생성에 실패했어요. 잠시 후 다시 시도해 주세요.");
}


/**
 * AI 제공자 자가진단. 키 값은 절대 노출하지 않고, 설정 여부·개수·폴백 체인만 보고한다.
 * ping=true 면 각 제공자에 초경량 요청을 보내 실제 살아있는지(한도 소진 여부) 확인한다.
 */
export async function aiDiagnostics(ping = false): Promise<{
  configured: Record<string, number | boolean | string>;
  chain: string[];
  live?: { provider: string; ok: boolean; detail: string }[];
}> {
  const configured: Record<string, number | boolean | string> = {
    groqKeys: groqKeys().length,
    geminiKeys: geminiKeys().length,
    cerebras: !!process.env.CEREBRAS_API_KEY,
    openrouter: !!process.env.OPENROUTER_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    ollama: !!process.env.OLLAMA_BASE_URL,
  };
  const chain = providerChain().map((e) => (e.model ? `${e.name}(${e.model})` : e.name));
  // Cerebras 키가 실제 접근 가능한 모델 목록을 조회해 진단에 포함(모델 미접근 404 원인 파악용).
  if (process.env.CEREBRAS_API_KEY) {
    const live = await fetchCerebrasModels(process.env.CEREBRAS_API_KEY);
    configured.cerebrasModels = live.length ? live.join(", ") : "(조회 실패/없음)";
  }
  if (!ping) return { configured, chain };

  // 제공자별 대표 1개만 초경량 핑(중복 모델은 생략).
  const seen = new Set<string>();
  const targets = providerChain().filter((e) => {
    if (seen.has(e.name)) return false;
    seen.add(e.name);
    return true;
  });
  const live = await Promise.all(
    targets.map(async ({ name, model }) => {
      const fn = PROVIDERS[name];
      try {
        await fn({
          system: "You are a test.",
          user: "Reply with the single word: OK",
          temperature: 0,
          model,
          // 추론(reasoning) 모델은 토큰이 적으면 본문이 비어 실패로 오판되므로 넉넉히.
          maxTokens: 64,
        });
        return { provider: model ? `${name}(${model})` : name, ok: true, detail: "OK" };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { provider: model ? `${name}(${model})` : name, ok: false, detail: msg.slice(0, 200) };
      }
    }),
  );
  return { configured, chain, live };
}


/**
 * 모델이 JSON 코드블록(```json ... ```)으로 감싸 응답하는 경우가 많아,
 * 순수 JSON 문자열만 추출해 파싱합니다.
 */
function parseJsonFromModel<T>(raw: string): T {
  let text = raw.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    text = fenced[1].trim();
  }
  // 코드블록이 없으면 첫 { 또는 [ 부터 마지막 } 또는 ] 까지 추출
  if (!fenced) {
    const start = text.search(/[[{]/);
    const end = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
    if (start !== -1 && end !== -1) {
      text = text.slice(start, end + 1);
    }
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    // 약한 모델이 흔히 내는 깨짐을 보정해 한 번 더 시도한다.
    const repaired = text
      .replace(/[“”]/g, '"') // 스마트 큰따옴표 → "
      .replace(/[‘’]/g, "'") // 스마트 작은따옴표 → '
      .replace(/,(\s*[}\]])/g, "$1"); // 후행 콤마 제거
    return JSON.parse(repaired) as T;
  }
}

/**
 * 텍스트를 생성하고 JSON으로 파싱한다. 무료 모델이 깨진 JSON을 내면
 * "유효한 JSON만" 다시 요청해 자동 재시도한다(기본 1회).
 */
export async function generateJSON<T>(
  opts: GenOpts,
  retries = 1,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const o: GenOpts =
      attempt === 0
        ? opts
        : {
            ...opts,
            temperature: 0,
            user:
              opts.user +
              "\n\n★중요: 직전 출력이 '유효한 JSON'이 아니었습니다. 설명·코드블록 없이 유효한 JSON 객체만 출력하세요. 문자열 값 안에서는 큰따옴표(\")를 쓰지 말고(필요하면 작은따옴표 '로), 줄바꿈 대신 공백을 쓰세요.★",
          };
    try {
      const raw = await generateText(o);
      return parseJsonFromModel<T>(raw);
    } catch (e) {
      lastErr = e;
      // AIConfigError(키 없음)는 재시도 무의미 → 즉시 전파
      if (e instanceof AIConfigError) throw e;
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("JSON 생성에 실패했습니다.");
}
