import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "나의 공간",
  description:
    "나만의 방을 꾸미고, 일기·할 일·즐겨찾기를 담는 개인 홈 — 모든 기록은 내 브라우저에만 저장돼요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-2 whitespace-nowrap font-bold text-slate-900"
            >
              <span className="grid h-8 w-8 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-500 text-base shadow-sm">
                🏠
              </span>
              나의 공간
            </Link>
            <nav className="flex gap-3 text-sm font-medium text-slate-600 sm:gap-4">
              <Link href="/" className="hover:text-brand-600">
                🛋️ 마이룸
              </Link>
              <Link href="/diary" className="hover:text-brand-600">
                📔 다이어리
              </Link>
              <Link href="/todo" className="hover:text-brand-600">
                ✅ 할 일
              </Link>
              <Link href="/links" className="hover:text-brand-600">
                🔖 즐겨찾기
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-4xl px-4 pb-8 text-center text-xs text-slate-400">
          모든 기록은 이 브라우저에만 저장돼요 · 나의 공간
        </footer>
      </body>
    </html>
  );
}
