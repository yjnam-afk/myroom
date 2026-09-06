"use client";

import { useEffect, useState } from "react";
import { PageHeader, ErrorBox, Button } from "@/components/ui";
import {
  login,
  register,
  loadSession,
  clearSession,
  updateProfile,
  isLocalSession,
  Session,
} from "@/lib/auth";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [next, setNext] = useState("/");

  // 회원정보 수정
  const [editOpen, setEditOpen] = useState(false);
  const [curPw, setCurPw] = useState("");
  const [newName, setNewName] = useState("");
  const [newPw, setNewPw] = useState("");
  const [editMsg, setEditMsg] = useState("");
  const [editErr, setEditErr] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  async function saveProfile() {
    if (!session) return;
    // 개인 모드는 서버 계정이 없어 이름만 로컬에서 바꾸므로 비밀번호 확인이 필요 없다.
    const local = isLocalSession(session);
    if (!local && !curPw) {
      setEditErr("현재 비밀번호를 입력하세요.");
      return;
    }
    if (local && !newName.trim()) {
      setEditErr("바꿀 이름을 입력하세요.");
      return;
    }
    if (!newName.trim() && !newPw) {
      setEditErr("바꿀 이름 또는 새 비밀번호를 입력하세요.");
      return;
    }
    setEditLoading(true);
    setEditErr("");
    setEditMsg("");
    try {
      const s = await updateProfile(session, {
        currentPassword: curPw,
        newName: newName.trim() || undefined,
        newPassword: newPw || undefined,
      });
      setSession(s);
      setCurPw("");
      setNewName("");
      setNewPw("");
      setEditMsg("저장되었습니다.");
    } catch (e) {
      setEditErr(e instanceof Error ? e.message : "수정에 실패했습니다.");
    } finally {
      setEditLoading(false);
    }
  }

  useEffect(() => {
    setSession(loadSession());
    // 로그인 후 돌아갈 경로(?next=). 외부 URL 차단(상대 경로만 허용).
    const raw = new URLSearchParams(window.location.search).get("next") || "/";
    setNext(raw.startsWith("/") && !raw.startsWith("//") ? raw : "/");
  }, []);

  async function submit() {
    if (!name.trim() || !password) {
      setError("이름과 비밀번호를 입력하세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const s = mode === "login" ? await login(name, password) : await register(name, password);
      setSession(s);
      // 서버 DB 미설정 폴백 — 조용히 개인 모드로 들어가면 "로그인했는데 왜 로컬이냐"는
      // 혼란이 생기므로, 명시적으로 알리고 넘어간다.
      if (s.token === "local-only") {
        alert(
          "서버 DB(Upstash Redis)가 설정되지 않아 개인 모드로 입장합니다.\n" +
            "기록·도식이 이 브라우저에만 저장되고 기기 간 동기화는 꺼져 있어요.\n" +
            "Vercel 프로젝트에 Upstash Redis를 연결하면 서버 저장이 켜집니다.",
        );
      }
      // 세션이 모든 화면(헤더·게이트)에 확실히 반영되도록 전체 새로고침으로 이동
      // replace 로 이동해야 로그인 화면이 히스토리에 남지 않는다.
      // href 대입은 push 라서, 들어가자마자 뒤로 누르면 다시 로그인 화면이 뜬다.
      window.location.replace(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (session) {
    return (
      <div>
        <PageHeader title="🔐 로그인" desc="이미 로그인되어 있습니다." />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm shadow-sm">
          <p className="text-slate-700">
            <span className="font-semibold text-brand-600">{session.name}</span>{" "}
            님으로 로그인 중입니다.
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => window.location.replace(next)}>
              {next === "/" ? "학습 시작" : "이어서 하기"}
            </Button>
            <button
              onClick={() => {
                clearSession();
                setSession(null);
              }}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              로그아웃
            </button>
            <button
              onClick={() => {
                setEditOpen((v) => !v);
                setEditErr("");
                setEditMsg("");
              }}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              {editOpen ? "닫기" : "회원정보 수정"}
            </button>
          </div>

          {editOpen && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <h3 className="mb-3 text-sm font-bold text-slate-800">
                회원정보 수정
              </h3>
              {!isLocalSession(session) && (
                <>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    현재 비밀번호 (확인용, 필수)
                  </label>
                  <input
                    type="password"
                    value={curPw}
                    onChange={(e) => setCurPw(e.target.value)}
                    placeholder="현재 비밀번호"
                    className="mb-3 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </>
              )}
              <label className="mb-1 block text-xs font-medium text-slate-500">
                새 이름 (안 바꾸면 비워두기)
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={20}
                placeholder={session.name}
                className="mb-3 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {!isLocalSession(session) && (
                <>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    새 비밀번호 (안 바꾸면 비워두기, 4자 이상)
                  </label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="새 비밀번호"
                    className="mb-4 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </>
              )}
              {editErr && (
                <div className="mb-3">
                  <ErrorBox message={editErr} />
                </div>
              )}
              {editMsg && (
                <p className="mb-3 text-sm font-medium text-amber-600">
                  ✓ {editMsg}
                </p>
              )}
              <Button
                onClick={saveProfile}
                disabled={editLoading}
                className="w-full"
              >
                {editLoading ? "저장 중…" : "변경 저장"}
              </Button>
              <p className="mt-2 text-xs text-slate-400">
                이름을 바꿔도 학습 기록·랭킹은 그대로 따라옵니다.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="🔐 로그인 / 회원가입"
        desc="이름과 비밀번호로 입장하세요. (서버 DB가 없는 배포에서는 자동으로 개인 모드로 입장돼요)"
      />

      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 inline-flex w-full rounded-lg border border-slate-200 p-1">
          {(
            [
              ["login", "로그인"],
              ["register", "회원가입"],
            ] as [Mode, string][]
          ).map(([m, label]) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`flex-1 rounded-md px-4 py-1.5 text-sm font-medium transition ${
                mode === m
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="mb-1 block text-xs font-medium text-slate-500">
          이름 (닉네임)
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          placeholder="랭킹에 표시될 이름"
          className="mb-3 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />

        <label className="mb-1 block text-xs font-medium text-slate-500">
          비밀번호 (4자 이상)
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="비밀번호"
          className="mb-4 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />

        {error && (
          <div className="mb-4">
            <ErrorBox message={error} />
          </div>
        )}

        <Button onClick={submit} disabled={loading} className="w-full">
          {loading ? "처리 중…" : mode === "login" ? "로그인" : "회원가입하고 시작"}
        </Button>

        <p className="mt-3 text-center text-xs text-slate-400">
          간단 로그인입니다. 중요한 비밀번호는 사용하지 마세요.
        </p>
      </div>
    </div>
  );
}
