/**
 * 내 도식 보관함 — 교재의 도식을 사진/캡처로 직접 넣어 토픽에 붙인다.
 *
 * AI가 그린 도식은 교재와 다르므로, 교재 원본 이미지를 그대로 쓰는 게 정답이다.
 * 사진은 용량이 커서 localStorage(약 5MB)로는 금방 터지므로 IndexedDB에 Blob으로 저장한다.
 * 저장은 이 브라우저 안에서만 이뤄지고 서버로 올라가지 않는다.
 */

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
