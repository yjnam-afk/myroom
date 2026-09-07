import { NextRequest, NextResponse } from "next/server";
import { generateJSON, AIConfigError } from "@/lib/ai";
import { flashcardPrompt, TUTOR_SYSTEM } from "@/lib/prompts";
import { cached } from "@/lib/cache";
import { buildGrounding } from "@/lib/grounding";

export const runtime = "nodejs";
export const maxDuration = 60;

type Flashcard = { front: string; back: string };

export async function POST(req: NextRequest) {
  try {
    const { topic, count } = (await req.json()) as {
      topic: string;
      count?: number;
    };

    if (!topic?.trim()) {
      return NextResponse.json({ error: "토픽을 입력하세요." }, { status: 400 });
    }
    const n = Math.min(Math.max(count || 6, 1), 20);

    // 교재 서브노트 발췌를 최우선 근거로 넘긴다 — 없이 만들면 모델 지식으로 지어낸다.
    // 캐시 키에 v2 를 붙여 교재 없이 만들어 둔 옛 결과를 다시 쓰지 않는다.
    const reference = buildGrounding({ topicTitle: topic });
    const cards = await cached(`flashcards:v2:${topic}:${n}`, 14 * 86400, () =>
      generateJSON<Flashcard[]>({
        system: TUTOR_SYSTEM,
        user: flashcardPrompt(topic, n, reference),
        temperature: 0.6,
      }),
    );
    return NextResponse.json({ cards });
  } catch (err) {
    const status = err instanceof AIConfigError ? 503 : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "카드 생성에 실패했습니다." },
      { status },
    );
  }
}
