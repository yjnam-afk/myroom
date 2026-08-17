import { NextRequest, NextResponse } from "next/server";
import { redis, DBConfigError } from "@/lib/db";
import { verifyToken, normalizeName } from "@/lib/serverAuth";

export const runtime = "nodejs";

/**
 * 내 도식 서버 보관함 — 교재 도식 캡처를 계정별로 저장해 기기 간 공유.
 *  키 구조:
 *   - diagram:<name>:<id>        이미지 1장(JSON: id, topicKey, caption, createdAt, dataUrl)
 *   - diagset:<name>:<topicKey>  해당 토픽의 이미지 id 집합
 *  요청: POST { name, token, action: "list"|"add"|"remove", ... }
 */

type Item = {
  id: string;
  topicKey: string;
  caption: string;
  createdAt: number;
  dataUrl: string;
};

// 업로드 1장 상한 — Upstash REST 요청 한도(약 1MB)를 넘지 않게 여유를 둔다.
const MAX_DATAURL = 950_000;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name: string;
      token: string;
      action: "list" | "add" | "remove";
      topicKey?: string;
      item?: Item;
      id?: string;
    };
    const name = normalizeName(body.name);
    if (!name || !verifyToken(name, body.token)) {
      return NextResponse.json(
        { error: "로그인이 필요합니다. 다시 로그인하세요." },
        { status: 401 },
      );
    }

    if (body.action === "list") {
      const topicKey = (body.topicKey || "").trim();
      if (!topicKey) return NextResponse.json({ items: [] });
      const ids = await redis<string[]>("SMEMBERS", `diagset:${name}:${topicKey}`);
      if (!ids?.length) return NextResponse.json({ items: [] });
      const raws = await redis<(string | null)[]>(
        "MGET",
        ...ids.map((id) => `diagram:${name}:${id}`),
      );
      const items = (raws || [])
        .filter((r): r is string => !!r)
        .map((r) => JSON.parse(r) as Item)
        .sort((a, b) => a.createdAt - b.createdAt);
      return NextResponse.json({ items });
    }

    if (body.action === "add") {
      const it = body.item;
      if (!it?.id || !it.topicKey || !it.dataUrl) {
        return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
      }
      if (!/^data:image\//.test(it.dataUrl)) {
        return NextResponse.json({ error: "이미지 파일만 저장할 수 있습니다." }, { status: 400 });
      }
      if (it.dataUrl.length > MAX_DATAURL) {
        return NextResponse.json(
          { error: "이미지가 너무 큽니다. 더 작게 캡처해 주세요." },
          { status: 413 },
        );
      }
      const clean: Item = {
        id: String(it.id).slice(0, 64),
        topicKey: String(it.topicKey).trim().slice(0, 200),
        caption: String(it.caption || "").slice(0, 300),
        createdAt: Number(it.createdAt) || Date.now(),
        dataUrl: it.dataUrl,
      };
      await redis("SET", `diagram:${name}:${clean.id}`, JSON.stringify(clean));
      await redis("SADD", `diagset:${name}:${clean.topicKey}`, clean.id);
      return NextResponse.json({ ok: true });
    }

    if (body.action === "remove") {
      const id = String(body.id || "").slice(0, 64);
      const topicKey = String(body.topicKey || "").trim();
      if (!id) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
      await redis("DEL", `diagram:${name}:${id}`);
      if (topicKey) await redis("SREM", `diagset:${name}:${topicKey}`, id);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "알 수 없는 동작입니다." }, { status: 400 });
  } catch (err) {
    const status = err instanceof DBConfigError ? 503 : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "도식 동기화에 실패했습니다." },
      { status },
    );
  }
}
