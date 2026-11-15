/**
 * 서버 전용 인증 유틸 (비밀번호 해시 + 세션 토큰).
 * Node.js 런타임의 crypto 를 사용하므로 API 라우트에서만 import 하세요.
 */
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";

/** 이름 기반 세션 토큰(HMAC) 발급 */
function makeToken(name: string): string {
  return crypto.createHmac("sha256", SECRET).update(name).digest("hex");
}

export function verifyToken(name: string, token: string): boolean {
  const expected = makeToken(name);
  const a = Buffer.from(expected);
  const b = Buffer.from(token || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** 이름 유효성 검사 및 정규화 */
export function normalizeName(raw: string): string {
  return (raw || "").trim();
}
