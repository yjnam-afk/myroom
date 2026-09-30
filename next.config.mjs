import fs from "node:fs";

/** @type {import('next').NextConfig} */
// 배포(빌드)마다 고유한 빌드 ID. Vercel 커밋 SHA가 있으면 그것을 쓰고,
// 없으면 prebuild가 써둔 .build-id(단일 값)를 읽는다. 이렇게 해야 클라이언트·서버
// 컴파일이 같은 값을 갖는다(각 컴파일마다 Date.now()가 달라져 오탐하던 문제 방지).
let BUILD_ID = process.env.VERCEL_GIT_COMMIT_SHA || "";
if (!BUILD_ID) {
  try {
    BUILD_ID = fs.readFileSync(new URL("./.build-id", import.meta.url), "utf8").trim();
  } catch {
    /* prebuild 전(로컬 dev 등) */
  }
}
if (!BUILD_ID) BUILD_ID = String(Date.now());

// 답안 스캔 이미지(public/answers)는 .vercelignore 로 배포에서 뺀다 — Vercel 배포 결과물은
// 파일 16,000개가 한도인데 이미지만 1만 5천 장이다. 배포본에는 파일이 없으니 fallback
// rewrite 가 GitHub 원본(공개 저장소)으로 넘긴다. 로컬(dev·build)에는 파일이 있어 그대로 나간다.
// 커밋 SHA 로 고정해 그 배포와 같은 시점의 이미지를 받는다.
const ANSWER_REF = process.env.VERCEL_GIT_COMMIT_SHA || "refs/heads/claude/create-my-space-bmiocc";

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BUILD_ID: BUILD_ID,
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/answers/:path*",
          destination: `https://raw.githubusercontent.com/yjnam-afk/myroom/${ANSWER_REF}/public/answers/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
