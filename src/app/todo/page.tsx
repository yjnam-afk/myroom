"use client";

import { useEffect, useState } from "react";
import { Todo, loadTodos, saveTodos, uid } from "@/lib/storage";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTodos(loadTodos());
    setLoaded(true);
  }, []);

  function update(next: Todo[]) {
    setTodos(next);
    saveTodos(next);
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    update([...todos, { id: uid(), text: trimmed, done: false, createdAt: Date.now() }]);
    setText("");
  }

  function toggle(id: string) {
    update(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: string) {
    update(todos.filter((t) => t.id !== id));
  }

  function clearDone() {
    update(todos.filter((t) => !t.done));
  }

  const doneCount = todos.filter((t) => t.done).length;
  const pct = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">✅ 할 일</h1>
      <p className="mb-6 text-sm text-slate-500">
        해야 할 일을 적고 하나씩 지워 나가요.
      </p>

      <form
        onSubmit={add}
        className="mb-4 flex gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일을 입력하고 Enter"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          disabled={!text.trim()}
          className="shrink-0 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-40"
        >
          추가
        </button>
      </form>

      {todos.length > 0 && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-1 flex justify-between text-xs">
            <span className="font-medium text-slate-600">
              {doneCount}/{todos.length} 완료
            </span>
            <span className="text-slate-400">{pct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {todos.length > 0 && doneCount === todos.length && (
            <p className="mt-2 text-xs font-bold text-amber-600">
              🎉 오늘 할 일을 모두 끝냈어요!
            </p>
          )}
        </div>
      )}

      {loaded && todos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          아직 할 일이 없어요. 가볍게 하나 적어 볼까요?
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {todos.map((t) => (
              <li
                key={t.id}
                className={`group flex items-center gap-3 rounded-xl border p-3 transition ${
                  t.done
                    ? "border-amber-200 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-brand-300"
                }`}
              >
                <button
                  onClick={() => toggle(t.id)}
                  aria-label="완료"
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs font-bold transition ${
                    t.done
                      ? "border-amber-400 bg-amber-500 text-white"
                      : "border-slate-300 bg-white text-transparent hover:border-amber-400"
                  }`}
                >
                  ✓
                </button>
                <span
                  className={`min-w-0 flex-1 text-sm ${
                    t.done ? "text-slate-400 line-through" : "text-slate-800"
                  }`}
                >
                  {t.text}
                </span>
                <button
                  onClick={() => remove(t.id)}
                  className="text-xs text-slate-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
          {doneCount > 0 && (
            <div className="mt-4 text-right">
              <button
                onClick={clearDone}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
              >
                🧹 완료한 일 비우기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
