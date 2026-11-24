"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExplainClient from "./ExplainClient";
import type { ExplainTopicData } from "@/lib/explainData";

/**
 * 토픽 설명의 껍데기 — 주소의 ?topic= 을 읽어 그 토픽 자료를 /api/explain-topic 에서 받아 `ExplainClient` 에 넘긴다.
 *
 * 2026-11-24 "토픽 설명 메뉴 누를 때 꽤 오래 걸려": 쪽 전체가 서버 렌더라 메뉴를 누를 때마다 서버 함수를 기다렸다.
 * 쪽을 정적으로 두고 자료만 따로 받으면 메뉴·목록은 바로 뜨고, 토픽을 바꿀 때도 쪽을 다시 받지 않는다.
 * 본 토픽은 모듈에 담아 둬서 뒤로 가기·다시 열기는 기다리지 않는다.
 */
const seen = new Map<string, ExplainTopicData>();
const KEEP = 40;

async function fetchTopic(topic: string): Promise<ExplainTopicData> {
  const r = await fetch(`/api/explain-topic?topic=${encodeURIComponent(topic)}`);
  if (!r.ok) throw new Error(`explain-topic ${r.status}`);
  const d = (await r.json()) as ExplainTopicData;
  seen.set(topic, d);
  if (seen.size > KEEP) seen.delete(seen.keys().next().value as string);
  return d;
}

type Shown = { topic: string; data: ExplainTopicData | null };

export default function ExplainShell() {
  const topic = (useSearchParams().get("topic") || "").trim();
  // 지금 화면에 그려 둔 것 — 새 토픽을 받는 동안에는 앞 토픽을 그대로 둔다(빈 화면으로 깜빡이지 않게).
  const [shown, setShown] = useState<Shown | null>(() =>
    topic ? (seen.has(topic) ? { topic, data: seen.get(topic)! } : null) : { topic: "", data: null },
  );
  const [failed, setFailed] = useState("");
  const [tries, setTries] = useState(0);

  useEffect(() => {
    setFailed("");
    if (!topic) {
      setShown({ topic: "", data: null });
      return;
    }
    const hit = seen.get(topic);
    if (hit) {
      setShown({ topic, data: hit });
      return;
    }
    let alive = true;
    fetchTopic(topic)
      .then((data) => {
        if (alive) setShown({ topic, data });
      })
      .catch(() => {
        if (alive) setFailed(topic);
      });
    return () => {
      alive = false;
    };
  }, [topic, tries]);

  const isFailed = !!topic && failed === topic;
  const retry = isFailed && (
    <div className="mx-auto mb-3 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      「{topic}」 자료를 불러오지 못했어요.{" "}
      <button type="button" onClick={() => setTries((n) => n + 1)} className="font-semibold underline underline-offset-2">
        다시 시도
      </button>
    </div>
  );

  // 주소에 토픽이 있는데 아직 아무것도 못 받았다(첫 진입) — 목록을 폈다 접는 깜빡임 없이 기다린다.
  if (!shown)
    return (
      <div>
        {retry || <p className="px-5 py-10 text-center text-sm text-slate-400">「{topic}」 불러오는 중…</p>}
      </div>
    );

  return (
    <>
      {retry}
      <ExplainClient data={shown.data} loading={shown.topic !== topic && !isFailed} />
    </>
  );
}
