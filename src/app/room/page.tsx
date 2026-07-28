"use client";

import { useEffect, useState } from "react";

// 마이룸 꾸미기 — 공부 쉬는 시간의 아지트. 모든 데이터는 이 브라우저(localStorage)에만 저장된다.

type Sticker = {
  id: string;
  emoji: string;
  x: number; // 방 안 좌표(%)
  y: number;
};

type RoomState = {
  theme: string;
  stickers: Sticker[];
};

const ROOM_KEY = "myroom:room";

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

function loadRoom(): RoomState {
  if (typeof window === "undefined") return { theme: "sky", stickers: [] };
  try {
    const raw = window.localStorage.getItem(ROOM_KEY);
    return raw ? (JSON.parse(raw) as RoomState) : { theme: "sky", stickers: [] };
  } catch {
    return { theme: "sky", stickers: [] };
  }
}

function saveRoom(r: RoomState) {
  try {
    window.localStorage.setItem(ROOM_KEY, JSON.stringify(r));
  } catch {
    /* 저장 실패는 조용히 무시 */
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default function RoomPage() {
  const [room, setRoom] = useState<RoomState>({ theme: "sky", stickers: [] });
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setRoom(loadRoom());
  }, []);

  function update(next: RoomState) {
    setRoom(next);
    saveRoom(next);
  }

  // 팔레트에서 스티커를 고른 뒤 방을 클릭하면 그 자리에 붙는다
  function placeSticker(e: React.MouseEvent<HTMLDivElement>) {
    if (!selected) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    update({
      ...room,
      stickers: [
        ...room.stickers,
        {
          id: uid(),
          emoji: selected,
          x: Math.min(96, Math.max(4, x)),
          y: Math.min(94, Math.max(6, y)),
        },
      ],
    });
  }

  function removeSticker(id: string) {
    update({ ...room, stickers: room.stickers.filter((s) => s.id !== id) });
  }

  const theme = THEMES[room.theme] ?? THEMES.sky;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">🛋️ 마이룸</h1>
      <p className="mb-6 text-sm text-slate-500">
        공부하다 지치면 잠깐 쉬어 가는 나만의 방이에요. 스티커로 마음껏 꾸며 보세요.
      </p>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-800">벽지 테마</h2>
          <div className="flex gap-1.5">
            {Object.entries(THEMES).map(([key, t]) => (
              <button
                key={key}
                onClick={() => update({ ...room, theme: key })}
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
          className={`relative h-72 w-full overflow-hidden rounded-xl border border-slate-200 shadow-inner sm:h-96 ${
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
              onClick={() => update({ ...room, stickers: [] })}
              className="ml-auto rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
            >
              🧹 모두 치우기
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          붙인 스티커를 클릭하면 떼어져요 · 꾸민 방은 이 브라우저에 자동 저장돼요
        </p>
      </section>
    </div>
  );
}
