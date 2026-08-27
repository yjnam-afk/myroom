"use client";

import { useMemo, useState } from "react";
import topics from "@/data/topics.json";
import { SUBNOTES, subnoteByAlias } from "@/data/textbookSubnotes";

type T = { id: string; title: string; category: string; importance: string };

/** 검색 한 줄 — 서브노트(답안 템플릿)와 AI 토픽 목록을 합친 통합 후보 */
type Entry = {
  title: string;
  /** 배지: 서브노트면 "답안", 아니면 중요도 */
  badge: string;
  /** 오른쪽 보조 표기: 과목 또는 카테고리 */
  sub: string;
  /** 검색 대상 문자열(소문자): 제목 + 키워드 + 34자 정의 */
  hay: string;
  /** topics.json 항목이 있으면 연결(토픽 id → AI 설명 근거) */
  t?: T;
  isSubnote: boolean;
};

/**
 * 토픽/키워드 직접 입력 시, 비슷한 토픽을 드롭다운으로 노출해 빠르게 선택.
 * - 서브노트(답안 템플릿) 468종은 제목뿐 아니라 키워드·34자 정의로도 검색된다.
 *   예) "레인보우" → 해시 솔트와 키 스트레칭, "S-Box" → Shannon의 암호 설계 원칙
 * - onChange: 사용자가 직접 타이핑(데이터 연결 해제)
 * - onSelect: 제안을 선택(토픽 id까지 연결 → 교재 근거 사용)
 */
// 교재 과목 코드 → 도메인 이름 (자동완성 부제 표기용)
const COURSE_LABEL: Record<string, string> = {
  OS: "운영체제", CA: "컴퓨터구조", PM: "프로젝트관리", SE: "SW공학",
  AI: "인공지능", ST: "확률·통계", DS: "자료구조", AL: "알고리즘",
  NW: "네트워크", DB: "데이터베이스", MG: "경영전략", SC: "보안", DX: "디지털서비스",
};

export default function TopicAutocomplete({
  value,
  onChange,
  onSelect,
  onPickTitle,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (t: T) => void;
  /**
   * 제안을 고른 순간(교재 전용 토픽 포함) 한 번만 불린다.
   * onSelect 는 topics.json 에 연결된 토픽에만 오므로, 주소(?topic=) 갱신처럼
   * "무엇을 골랐든" 해야 하는 처리는 이걸 쓴다.
   */
  onPickTitle?: (title: string, t?: T) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const q = value.trim().toLowerCase();

  // 통합 검색 인덱스 — 서브노트 우선, topics.json은 서브노트에 없는 제목만 추가
  const entries = useMemo(() => {
    const byTitle = new Map<string, T>();
    for (const t of topics as T[]) byTitle.set(t.title, t);
    const list: Entry[] = [];
    const seen = new Set<string>();
    for (const s of SUBNOTES) {
      // 제목·정의·리드문·특징·키워드에 표 내용·비고까지 — 답안 어디에 나온 단어로든 찾을 수 있게
      const hay = [
        s.title,
        s.defShort,
        s.lead || "",
        ...(s.features || []),
        ...(s.keywords || []),
        ...(s.defPair || []).flatMap((p) => [p.name, p.def, ...(p.features || [])]),
        ...(s.notes || []),
        ...s.tables.flatMap((tb) => [tb.caption || "", ...tb.rows.flat()]),
      ]
        .join(" ")
        .toLowerCase();
      list.push({
        title: s.title,
        badge: "답안",
        sub: COURSE_LABEL[s.course] || s.course,
        hay,
        t: byTitle.get(s.title),
        isSubnote: true,
      });
      seen.add(s.title);
    }
    for (const t of topics as T[]) {
      // 제목이 완전히 같지 않아도 교재에 있는 토픽이면 제안하지 않는다
      // ("Singleton 패턴" ↔ "싱글턴 패턴 (Singleton pattern)").
      if (seen.has(t.title) || subnoteByAlias((t as { id?: string }).id, t.title))
        continue;
      list.push({
        title: t.title,
        badge: t.importance,
        sub: t.category,
        hay: t.title.toLowerCase(),
        t,
        isSubnote: false,
      });
    }
    return list;
  }, []);

  const matches = useMemo(() => {
    if (q.length < 1) return [] as Entry[];
    const arr = entries.filter((e) => e.hay.includes(q));
    // 제목 앞부분 일치 → 제목 포함 → 키워드·정의 매칭 순.
    // 같은 급이면 답안 템플릿(서브노트) 먼저, 짧은 제목 먼저.
    const rank = (e: Entry) => {
      const t = e.title.toLowerCase();
      if (t.startsWith(q)) return 0;
      if (t.includes(q)) return 1;
      return 2; // 키워드·정의로만 매칭
    };
    arr.sort((a, b) => {
      const r = rank(a) - rank(b);
      if (r) return r;
      const s = Number(b.isSubnote) - Number(a.isSubnote);
      if (s) return s;
      return a.title.length - b.title.length;
    });
    // 완전 일치(이미 선택된 토픽)면 굳이 목록을 안 띄운다
    if (arr.length === 1 && arr[0].title.toLowerCase() === q) return [];
    return arr.slice(0, 10);
  }, [q, entries]);

  function pick(e: Entry) {
    if (onPickTitle) onPickTitle(e.title, e.t);
    else if (e.t) onSelect(e.t);
    else onChange(e.title); // topics.json에 없는 서브노트 — 제목만으로 답안 템플릿이 뜬다
    setOpen(false);
  }

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (!open || matches.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => (a + 1) % matches.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => (a - 1 + matches.length) % matches.length);
          } else if (e.key === "Enter") {
            const m = matches[active];
            if (m) {
              e.preventDefault();
              pick(m);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          <li className="px-3 py-1.5 text-[10px] text-slate-400">
            ↑↓ 이동 · Enter 선택 · 제목뿐 아니라 키워드·정의로도 찾아요 (📝답안 = 답안지
            템플릿 보유)
          </li>
          {matches.map((m, idx) => (
            <li key={`${m.title}-${m.badge}`}>
              <button
                type="button"
                onMouseEnter={() => setActive(idx)}
                onMouseDown={(e) => {
                  // blur보다 먼저 실행되도록 mousedown + preventDefault
                  e.preventDefault();
                  pick(m);
                }}
                className={`flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm ${
                  idx === active ? "bg-brand-50" : "hover:bg-brand-50"
                }`}
              >
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    m.isSubnote
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-brand-700"
                  }`}
                >
                  {m.isSubnote ? "📝답안" : m.badge}
                </span>
                <span className="min-w-0 flex-1 truncate text-slate-800">{m.title}</span>
                <span className="shrink-0 text-[10px] text-slate-400">{m.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
