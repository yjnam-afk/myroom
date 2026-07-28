"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Profile,
  Dday,
  RoomState,
  loadProfile,
  saveProfile,
  loadDday,
  saveDday,
  ddayCount,
  loadRoom,
  saveRoom,
  loadTodos,
  loadDiary,
  loadLinks,
  LinkItem,
  uid,
  todayStr,
} from "@/lib/storage";

const MOODS = ["😊", "🔥", "😴", "🥲", "😤", "🤓", "🎉"];

const THEMES: Record<string, { label: string; wall: string; floor: string }> = {
  sky: {
    label: "☁️ 하늘",
    wall: "from-sky-100 via-blue-50 to-indigo-100",
    floor: "from-amber-100 to-orange-100",
  },
  night: {
    label: "🌙 밤",
    wall: "from-indigo-900 via-slate-900 to-violet-950",
    floor: "from-slate-700 to-slate-800",
  },
  forest: {
    label: "🌿 숲",
    wall: "from-emerald-100 via-green-50 to-teal-100",
    floor: "from-lime-100 to-emerald-200",
  },
  pink: {
    label: "🌸 벚꽃",
    wall: "from-pink-100 via-rose-50 to-fuchsia-100",
    floor: "from-rose-100 to-pink-200",
  },
};

// 방에 붙일 수 있는 스티커 팔레트
const PALETTE = [
  "🛏️", "🪴", "📚", "💻", "☕", "🧸", "🎧", "🖼️", "🕯️", "🐱",
  "🐶", "⭐", "🌙", "💡", "🎹", "🏆", "📷", "🍀", "❤️", "✏️",
];

export default function Home() {
  const [profile, setProfile] = useState<Profile>({ name: "", motto: "", mood: "" });
  const [dday, setDday] = useState<Dday>({ label: "", date: "" });
  const [room, setRoom] = useState<RoomState>({ theme: "sky", stickers: [] });
  const [selected, setSelected] = useState<string | null>(null);
  const [editName, setEditName] = useState(false);
  const [editDday, setEditDday] = useState(false);
  const [todoStat, setTodoStat] = useState({ done: 0, total: 0 });
  const [diaryToday, setDiaryToday] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setDday(loadDday());
    setRoom(loadRoom());
    const todos = loadTodos();
    setTodoStat({ done: todos.filter((t) => t.done).length, total: todos.length });
    setDiaryToday(loadDiary().some((e) => e.date === todayStr()));
    setLinks(loadLinks().slice(0, 4));
    setLoaded(true);
  }, []);

  function updateProfile(patch: Partial<Profile>) {
    const next = { ...profile, ...patch };
    setProfile(next);
    saveProfile(next);
  }

  function updateDday(patch: Partial<Dday>) {
    const next = { ...dday, ...patch };
    setDday(next);
    saveDday(next);
  }

  function updateRoom(next: RoomState) {
    setRoom(next);
    saveRoom(next);
  }

  // 팔레트에서 스티커를 고른 뒤 방을 클릭하면 그 자리에 붙는다
  function placeSticker(e: React.MouseEvent<HTMLDivElement>) {
    if (!selected) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    updateRoom({
      ...room,
      stickers: [
        ...room.stickers,
        { id: uid(), emoji: selected, x: Math.min(96, Math.max(4, x)), y: Math.min(94, Math.max(6, y)) },
      ],
    });
  }

  function removeSticker(id: string) {
    updateRoom({ ...room, stickers: room.stickers.filter((s) => s.id !== id) });
  }

  const d = ddayCount(dday);
  const theme = THEMES[room.theme] ?? THEMES.sky;

  return (
    <div>
      {/* 인사 배너 */}
      <section className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 p-7 text-white shadow-lg sm:p-9">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
          🏠 나만의 아지트
        </span>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
          {loaded && profile.name ? (
            <>
              어서 와요,{" "}
              <span className="underline decoration-amber-200 decoration-4 underline-offset-4">
                {profile.name}
              </span>{" "}
              님 {profile.mood || "👋"}
            </>
          ) : (
            <>나의 공간에 어서 와요 👋</>
          )}
        </h1>
        <p className="mt-2 text-sm text-blue-100 sm:text-base">
          방을 꾸미고, 하루를 기록하고, 할 일을 정리하는 나만의 자리예요.
        </p>

        {/* 이름 · 기분 */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {editName || (loaded && !profile.name) ? (
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setEditName(false);
              }}
            >
              <input
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="이름 또는 별명"
                className="rounded-lg border-0 bg-white/90 px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button className="rounded-lg bg-amber-400 px-3 py-1.5 text-sm font-bold text-slate-900 hover:bg-amber-300">
                저장
              </button>
            </form>
          ) : (
            <button
              onClick={() => setEditName(true)}
              className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium ring-1 ring-white/20 hover:bg-white/25"
            >
              ✏️ 이름 바꾸기
            </button>
          )}
          <div className="flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1 ring-1 ring-white/20">
            <span className="px-1 text-xs">오늘 기분</span>
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => updateProfile({ mood: profile.mood === m ? "" : m })}
                className={`rounded-md px-1 text-lg transition ${
                  profile.mood === m ? "bg-white/30 ring-1 ring-amber-200" : "hover:bg-white/20"
                }`}
                aria-label={`기분 ${m}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 오늘의 한 줄 */}
        <input
          value={profile.motto}
          onChange={(e) => updateProfile({ motto: e.target.value })}
          placeholder="오늘의 한 줄 — 다짐이나 기분을 적어 두세요 ✍️"
          className="mt-4 w-full max-w-xl rounded-xl border-0 bg-white/90 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      </section>

      {/* D-day */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">⏳ 디데이</h2>
            {d === null ? (
              <p className="mt-1 text-sm text-slate-500">
                목표 날짜를 정하면 남은 날을 세어 드려요.
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-600">
                <b className="text-slate-900">{dday.label || "목표"}</b>까지{" "}
                <b className={`text-2xl font-extrabold ${d <= 7 ? "text-red-600" : "text-brand-600"}`}>
                  {d > 0 ? `D-${d}` : d === 0 ? "D-DAY 🔥" : `D+${-d}`}
                </b>
              </p>
            )}
          </div>
          {editDday ? (
            <form
              className="flex flex-wrap items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setEditDday(false);
              }}
            >
              <input
                value={dday.label}
                onChange={(e) => updateDday({ label: e.target.value })}
                placeholder="목표 이름"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none"
              />
              <input
                type="date"
                value={dday.date}
                onChange={(e) => updateDday({ date: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none"
              />
              <button className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-brand-700">
                완료
              </button>
            </form>
          ) : (
            <button
              onClick={() => setEditDday(true)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {d === null ? "🎯 목표 정하기" : "✏️ 수정"}
            </button>
          )}
        </div>
      </section>

      {/* 마이룸 꾸미기 */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-800">🛋️ 마이룸 꾸미기</h2>
          <div className="flex gap-1.5">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => updateRoom({ ...room, theme: key })}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  room.theme === key
                    ? "bg-brand-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 방 — 벽 + 바닥. 스티커를 고르고 원하는 곳을 클릭 */}
        <div
          onClick={placeSticker}
          className={`relative h-72 w-full overflow-hidden rounded-xl border border-slate-200 shadow-inner sm:h-80 ${
            selected ? "cursor-crosshair" : ""
          }`}
        >
          <div className={`absolute inset-x-0 top-0 h-[72%] bg-gradient-to-br ${theme.wall}`} />
          <div className={`absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-b ${theme.floor}`} />
          {room.stickers.length === 0 && !selected && (
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-slate-500/80">
              아래에서 스티커를 고르고, 방 안 원하는 곳을 클릭해 붙여 보세요!
            </p>
          )}
          {room.stickers.map((s) => (
            <button
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                removeSticker(s.id);
              }}
              title="클릭하면 떼어져요"
              className="sticker absolute -translate-x-1/2 -translate-y-1/2 text-3xl transition sm:text-4xl"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              {s.emoji}
            </button>
          ))}
        </div>

        {/* 스티커 팔레트 */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {PALETTE.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelected(selected === emoji ? null : emoji)}
              className={`grid h-9 w-9 place-items-center rounded-lg text-xl transition ${
                selected === emoji
                  ? "bg-brand-100 ring-2 ring-brand-500"
                  : "border border-slate-200 bg-white hover:bg-slate-50"
              }`}
              aria-label={`스티커 ${emoji}`}
            >
              {emoji}
            </button>
          ))}
          {room.stickers.length > 0 && (
            <button
              onClick={() => updateRoom({ ...room, stickers: [] })}
              className="ml-auto rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
            >
              🧹 모두 치우기
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          붙인 스티커를 클릭하면 떼어져요 · 꾸민 방은 자동 저장돼요
        </p>
      </section>

      {/* 오늘 요약 + 바로가기 */}
      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-slate-800">📌 오늘 요약</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-slate-600">✅ 할 일</span>
              <Link href="/todo" className="font-semibold text-brand-600 hover:underline">
                {todoStat.total === 0
                  ? "아직 없음 — 추가하기 →"
                  : `${todoStat.done}/${todoStat.total} 완료 →`}
              </Link>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-slate-600">📔 오늘 일기</span>
              <Link href="/diary" className="font-semibold text-brand-600 hover:underline">
                {diaryToday ? "작성 완료 🌟" : "아직 안 씀 — 쓰러 가기 →"}
              </Link>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">🔖 바로가기</h2>
            <Link href="/links" className="text-xs font-medium text-brand-600 hover:underline">
              전체 관리 →
            </Link>
          </div>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 transition hover:border-brand-300 hover:bg-white"
                >
                  <span className="text-lg">{l.emoji}</span>
                  <span className="min-w-0 flex-1 truncate font-medium text-slate-700">
                    {l.title}
                  </span>
                  <span className="text-slate-400">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
