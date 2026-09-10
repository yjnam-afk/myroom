"use client";

import { useState } from "react";
import Link from "next/link";
import {
  examHistory,
  isRecent,
  pastExams,
  summarize,
  weekLabel,
  ym,
  type ExamAppearance,
  type PastAppearance,
} from "@/lib/examHistory";

/**
 * NS 주간 모의고사 출제 이력 배지.
 *
 * 빈도와 최근성을 한눈에: "🛡️ 3회 · 26.05". 최근 1년에 2번 이상이거나
 * 통산 4번 이상이면 붉게 칠해 "꼭 볼 것"으로 띄운다. 누르면 언제·몇 교시에
 * 어떤 문구로 나왔는지 펼친다.
 */
/**
 * 출제 문항 목록.
 * full: 토픽 설명 카드 — 문제 전문을 줄바꿈 그대로, 생략 없이 보여준다.
 *       (가./나./다. 소문항이 있는 2교시 문제는 줄이 잘리면 무엇을 묻는지 알 수 없다.)
 * 아니면(학습계획 칩의 팝업) 세 줄까지만 보이고, 누르면 펼쳐진다.
 */
function AppearanceList({ items, full = false }: { items: ExamAppearance[]; full?: boolean }) {
  const [opened, setOpened] = useState<Set<string>>(new Set());
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((h) => {
        const recent = isRecent(h.date);
        const open = full || opened.has(h.id);
        return (
          <li key={h.id} className={`px-3 py-2 ${full ? "px-5 py-3 text-[13px]" : "text-xs"}`}>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded px-1.5 py-0.5 font-bold ${
                  recent ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {h.cohort} {weekLabel(h.round)}
              </span>
              <span className="text-slate-500">{h.date}</span>
              <span className="text-slate-400">· {h.period}</span>
              {h.exam && <span className="text-amber-700">· {h.exam}</span>}
            </div>
            <p
              onClick={() => {
                if (full) return;
                setOpened((prev) => {
                  const n = new Set(prev);
                  if (n.has(h.id)) n.delete(h.id);
                  else n.add(h.id);
                  return n;
                });
              }}
              className={`mt-1 whitespace-pre-line break-words leading-relaxed text-slate-800 ${
                open ? "" : "line-clamp-3 cursor-pointer"
              }`}
              title={open ? undefined : "누르면 전문이 보입니다"}
            >
              {h.text}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/** 학습계획 줄에 붙는 작은 칩. 이력이 없으면 아무것도 그리지 않는다. */
export function ExamHistoryChip({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const hist = examHistory(title);
  if (hist.length === 0) return null;
  const s = summarize(hist);
  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        title={`NS 주간 모의고사 출제 ${s.count}회 · 최근 ${s.latest}`}
        className={`rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
          s.must
            ? "bg-rose-100 text-rose-700"
            : s.recent > 0
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-500"
        }`}
      >
        🛡️{s.count} · {ym(s.latest)}
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 z-30 mt-1 w-80 max-w-[85vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600">
            <span>
              🛡️ NS 모의고사 {s.count}회 출제
              {s.recent > 0 && <span className="ml-1 text-rose-600">· 최근 1년 {s.recent}회</span>}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            <AppearanceList items={hist} />
          </div>
        </div>
      )}
    </span>
  );
}

/**
 * 기술사 기출 목록 — "140회 1교시 6번" 꼴로 몇 회에 어떤 문제로 나왔는지.
 * NS 출제 이력 아래에 붙는다. 문제 전문을 줄바꿈 그대로 보여준다.
 */
function PastExamList({ items }: { items: PastAppearance[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((p) => (
        <li key={p.id} className="px-5 py-3 text-[13px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-indigo-100 px-1.5 py-0.5 font-bold text-indigo-700">
              {p.round}회
            </span>
            <span className="text-slate-500">
              {p.period} {p.no}번
            </span>
          </div>
          <p className="mt-1 whitespace-pre-line break-words leading-relaxed text-slate-800">
            {p.text}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** 토픽 설명 화면의 카드. NS 이력도 기출도 없으면 아무것도 그리지 않는다. */
export function ExamHistoryCard({ title }: { title: string }) {
  const [all, setAll] = useState(false);
  const [allPast, setAllPast] = useState(false);
  const hist = examHistory(title);
  const past = pastExams(title);
  if (hist.length === 0 && past.length === 0) return null;
  const s = summarize(hist);
  const shown = all ? hist : hist.slice(0, 5);
  const shownPast = allPast ? past : past.slice(0, 5);
  return (
    <section
      className={`mb-6 overflow-hidden rounded-2xl border-2 bg-white shadow-sm ${
        s.must ? "border-rose-300" : "border-slate-200"
      }`}
    >
      {hist.length > 0 && (
        <>
          <div className={`px-5 py-3 ${s.must ? "bg-rose-50" : "bg-slate-50"}`}>
            <h3 className="text-sm font-bold text-slate-800">
              🛡️ NS 주간 모의고사 출제 {s.count}회
              {s.recent > 0 && (
                <span className="ml-2 rounded bg-rose-600 px-1.5 py-0.5 text-[11px] text-white">
                  최근 1년 {s.recent}회
                </span>
              )}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {s.must
                ? "자주 나오거나 최근에 나온 토픽입니다. 이번 주에 꼭 한 번 더 보세요."
                : `마지막 출제 ${s.latest}. 어떤 문구로 나왔는지 확인해 두세요.`}
            </p>
          </div>
          <AppearanceList items={shown} full />
          {hist.length > 5 && (
            <div className="border-t border-slate-100 px-4 py-2 text-xs">
              <button
                type="button"
                onClick={() => setAll((v) => !v)}
                className="font-medium text-brand-700 hover:underline"
              >
                {all ? "접기" : `${hist.length - 5}건 더 보기`}
              </button>
            </div>
          )}
        </>
      )}

      {/* 기술사 기출 — 몇 회 몇 교시 몇 번으로 나왔나 */}
      {past.length > 0 && (
        <>
          <div className={`px-5 py-3 ${hist.length > 0 ? "border-t border-slate-100" : ""} bg-indigo-50/60`}>
            <h3 className="text-sm font-bold text-slate-800">📜 기술사 기출 {past.length}회</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {past[0].round}회가 가장 최근. 회차·교시·번호와 문제 문구입니다.
            </p>
          </div>
          <PastExamList items={shownPast} />
          {past.length > 5 && (
            <div className="border-t border-slate-100 px-4 py-2 text-xs">
              <button
                type="button"
                onClick={() => setAllPast((v) => !v)}
                className="font-medium text-brand-700 hover:underline"
              >
                {allPast ? "접기" : `${past.length - 5}건 더 보기`}
              </button>
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-end border-t border-slate-100 px-4 py-2 text-xs">
        <Link href="/exam" className="text-slate-400 hover:text-slate-600">
          📝 문제 풀이에서 보기 →
        </Link>
      </div>
    </section>
  );
}
