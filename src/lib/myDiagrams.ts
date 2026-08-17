/**
 * 내 도식 보관함 — 교재의 도식을 사진/캡처로 직접 넣어 토픽에 붙인다.
 *
 * AI가 그린 도식은 교재와 다르므로, 교재 원본 이미지를 그대로 쓰는 게 정답이다.
 * 로그인 상태면 서버(계정별 Redis)에 저장해 어느 기기에서든 보이고,
 * 비로그인(개인 모드)에서는 예전처럼 이 브라우저의 IndexedDB에만 저장한다.
 * 브라우저에 남아 있던 예전 도식은 서버 모드 첫 조회 때 자동으로 올려보낸다(1회 마이그레이션).
 */
import { loadSession, isLocalSession } from "@/lib/auth";

const DB_NAME = "myroom-diagrams";
const STORE = "images";
const DB_VER = 1;

export type MyDiagram = {
  /** 자동 생성 id */
  id: string;
  /** 토픽 키 — topicId 가 있으면 topicId, 없으면 토픽 제목 */
  topicKey: string;
  blob: Blob;
  /** 사용자가 붙인 설명(선택) */
  caption: string;
  createdAt: number;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: "id" });
        os.createIndex("topicKey", "topicKey", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** topicId 우선, 없으면 제목으로 토픽을 식별한다. */
export function diagramKey(topicId?: string, title?: string): string {
  return (topicId || title || "").trim();
}

export async function listDiagrams(topicKey: string): Promise<MyDiagram[]> {
  if (typeof indexedDB === "undefined" || !topicKey) return [];
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).index("topicKey").getAll(topicKey);
    req.onsuccess = () =>
      resolve(
        (req.result as MyDiagram[]).sort((a, b) => a.createdAt - b.createdAt),
      );
    req.onerror = () => reject(req.error);
  });
}

export async function addDiagram(
  topicKey: string,
  blob: Blob,
  caption = "",
): Promise<MyDiagram> {
  const db = await openDB();
  const item: MyDiagram = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    topicKey,
    blob,
    caption,
    createdAt: Date.now(),
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(item);
    tx.oncomplete = () => resolve(item);
    tx.onerror = () => reject(tx.error);
  });
}

export async function removeDiagram(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** 저장된 도식이 있는 토픽 키 전체(보관함 화면용). */
export async function allDiagrams(): Promise<MyDiagram[]> {
  if (typeof indexedDB === "undefined") return [];
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () =>
      resolve((req.result as MyDiagram[]).sort((a, b) => b.createdAt - a.createdAt));
    req.onerror = () => reject(req.error);
  });
}

/**
 * 사진을 그대로 넣으면 수 MB라 저장·표시가 느리다.
 * 가로/세로 최대 1600px 로 줄이고 JPEG(품질 0.85)로 다시 인코딩한다.
 * 도식은 글자가 있으므로 과하게 줄이지 않는다.
 */
// ── 서버 동기화 계층 ─────────────────────────────────────────────────────
/** 화면 표시용 항목 — 로컬(objectURL)이든 서버(dataUrl)든 src 하나로 통일 */
export type DiagramView = {
  id: string;
  topicKey: string;
  caption: string;
  createdAt: number;
  src: string;
};

/** 로그인(서버 계정) 상태에서만 서버 저장을 쓴다. 개인 모드는 로컬 유지. */
export function diagramServerEnabled(): boolean {
  const s = loadSession();
  return !!s && !isLocalSession(s);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(blob);
  });
}

async function api<T = { ok?: boolean; items?: unknown[] }>(body: object): Promise<T> {
  const res = await fetch("/api/diagrams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((j as { error?: string }).error || "도식 동기화 실패");
  return j as T;
}

/** 목록 — 서버 모드면 서버에서, 그 전에 브라우저에 남은 예전 도식을 올려보낸다. */
export async function listDiagramsView(topicKey: string): Promise<DiagramView[]> {
  if (!topicKey) return [];
  if (!diagramServerEnabled()) {
    const local = await listDiagrams(topicKey);
    return local.map((it) => ({
      id: it.id,
      topicKey: it.topicKey,
      caption: it.caption,
      createdAt: it.createdAt,
      src: URL.createObjectURL(it.blob),
    }));
  }
  const s = loadSession()!;
  // 1회 마이그레이션 — 실패해도 목록 조회는 계속한다.
  try {
    const local = await listDiagrams(topicKey);
    for (const it of local) {
      const dataUrl = await blobToDataUrl(it.blob);
      if (dataUrl.length > 950_000) continue; // 상한 초과분은 로컬에 남겨둔다
      await api({
        name: s.name,
        token: s.token,
        action: "add",
        item: { id: it.id, topicKey, caption: it.caption, createdAt: it.createdAt, dataUrl },
      });
      await removeDiagram(it.id);
    }
  } catch {
    /* 마이그레이션 실패 무시 */
  }
  const { items } = await api<{ items: (Omit<DiagramView, "src"> & { dataUrl: string })[] }>({
    name: s.name,
    token: s.token,
    action: "list",
    topicKey,
  });
  return (items || []).map((it) => ({
    id: it.id,
    topicKey: it.topicKey,
    caption: it.caption,
    createdAt: it.createdAt,
    src: it.dataUrl,
  }));
}

/** 추가 — 서버 모드면 업로드(용량 초과 시 한 번 더 줄여서 재시도). */
export async function addDiagramView(topicKey: string, file: File): Promise<void> {
  let blob = await shrinkImage(file);
  if (!diagramServerEnabled()) {
    await addDiagram(topicKey, blob);
    return;
  }
  let dataUrl = await blobToDataUrl(blob);
  if (dataUrl.length > 950_000) {
    blob = await shrinkImage(file, 1100);
    dataUrl = await blobToDataUrl(blob);
  }
  if (dataUrl.length > 950_000) throw new Error("이미지가 너무 큽니다. 더 작게 잘라 주세요.");
  const s = loadSession()!;
  await api({
    name: s.name,
    token: s.token,
    action: "add",
    item: {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      topicKey,
      caption: "",
      createdAt: Date.now(),
      dataUrl,
    },
  });
}

/** 삭제 — 서버 모드면 서버에서, 아니면 IndexedDB에서. */
export async function removeDiagramView(id: string, topicKey: string): Promise<void> {
  if (!diagramServerEnabled()) return removeDiagram(id);
  const s = loadSession()!;
  await api({ name: s.name, token: s.token, action: "remove", id, topicKey });
}

export async function shrinkImage(file: File, maxSide = 1600): Promise<Blob> {
  // SVG 는 벡터라 그대로 저장(리사이즈하면 오히려 깨진다).
  if (file.type === "image/svg+xml") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  // 사진 배경이 투명일 수 있으므로 흰 바탕을 깔고 그린다(JPEG 는 투명 미지원).
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const out = await new Promise<Blob | null>((r) =>
    canvas.toBlob(r, "image/jpeg", 0.85),
  );
  return out ?? file;
}
