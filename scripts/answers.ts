/**
 * 답안 데이터(src/data/peerAnswers/*.json)를 고치는 유일한 창구. 고친 뒤 검사를 통과해야 저장된다.
 *
 *   npx tsx scripts/answers.ts check [--no-files]        검사만 (prebuild 에서 돈다 — 오류면 빌드가 멈춘다)
 *   npx tsx scripts/answers.ts show <id>
 *   npx tsx scripts/answers.ts set <id> <칸> <값>         값이 [ 나 { 로 시작하면 JSON 으로 읽는다
 *   npx tsx scripts/answers.ts add-qid <id> <qid>...  /  rm-qid <id> <qid>...
 *   npx tsx scripts/answers.ts add <entries.json> [묶음파일, 기본 맨 끝]
 *   npx tsx scripts/answers.ts rm <id>
 *   npx tsx scripts/answers.ts apply <ops.json>          여러 고침을 한 번에(파이썬 연결 스크립트가 쓴다)
 *     ops: [{op:"set",id,field,value} | {op:"add-qid",id,qid} | {op:"rm-qid",id,qid} | {op:"add",entry,file?} | {op:"rm",id}]
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadGroups, saveGroups, validate, findAnswer, ROOT, type Group } from "./lib/answers-store";
import type { PeerAnswer } from "../src/data/peerAnswers";

type Op =
  | { op: "set"; id: string; field: string; value: unknown }
  | { op: "add-qid" | "rm-qid"; id: string; qid: string }
  | { op: "add"; entry: PeerAnswer; file?: string }
  | { op: "rm"; id: string };

function applyOps(groups: Group[], ops: Op[]) {
  for (const o of ops) {
    if (o.op === "add") {
      const g = o.file ? groups.find((x) => x.file === o.file) : groups[groups.length - 1];
      if (!g) throw new Error(`없는 묶음 ${o.file}`);
      g.items.push(o.entry);
      continue;
    }
    if (o.op === "rm") {
      for (const g of groups) g.items = g.items.filter((a) => a.id !== o.id);
      continue;
    }
    const a = findAnswer(groups, o.id) as unknown as Record<string, unknown>;
    if (o.op === "set") {
      if (o.value === null || o.value === undefined) delete a[o.field];
      else a[o.field] = o.value;
    } else {
      const ids = new Set((a.questionIds as string[] | undefined) ?? []);
      if (o.op === "add-qid") ids.add(o.qid);
      else ids.delete(o.qid);
      if (ids.size) a.questionIds = [...ids];
      else delete a.questionIds;
    }
  }
}

const [cmd, ...args] = process.argv.slice(2);
const groups = loadGroups();
switch (cmd) {
  case "check": {
    // Vercel 빌드에는 public/answers 가 없다(.vercelignore) — 거기서 이미지 파일을 찾으면 전부 「이미지 없음」이라 빌드가 멈춘다.
    // 2026-11-01 이것 때문에 배포가 4번 연달아 실패했다. 이미지 검사는 이미지가 있는 로컬에서만 한다.
    const files = !args.includes("--no-files") && !process.env.VERCEL && existsSync(join(ROOT, "public/answers"));
    const ps = validate(groups, { files });
    const errs = ps.filter((p) => p.level === "error");
    const warns = ps.filter((p) => p.level === "warn");
    for (const e of errs.slice(0, 50)) console.error("✗", e.id, e.msg);
    const n = groups.reduce((s, g) => s + g.items.length, 0);
    console.log(`answers: ${n}편 · 오류 ${errs.length} · 경고 ${warns.length}(모르는 토픽 제목)${files ? "" : " · 이미지 파일 검사 생략"}`);
    if (args.includes("-v")) for (const w of warns) console.log("·", w.id, w.msg);
    if (errs.length) process.exit(1);
    break;
  }
  case "show":
    console.log(JSON.stringify(findAnswer(groups, args[0]), null, 1));
    break;
  case "set": {
    const [id, field, raw] = args;
    const value = /^[[{]/.test(raw) ? JSON.parse(raw) : field === "score" || field === "maxScore" ? Number(raw) : raw;
    applyOps(groups, [{ op: "set", id, field, value }]);
    saveGroups(groups);
    break;
  }
  case "add-qid":
  case "rm-qid":
    applyOps(groups, args.slice(1).map((qid) => ({ op: cmd, id: args[0], qid })));
    saveGroups(groups);
    break;
  case "add": {
    const entries: PeerAnswer[] = JSON.parse(readFileSync(args[0], "utf8"));
    applyOps(groups, entries.map((entry) => ({ op: "add", entry, file: args[1] })));
    saveGroups(groups);
    console.log(`${entries.length}편 추가`);
    break;
  }
  case "rm":
    applyOps(groups, [{ op: "rm", id: args[0] }]);
    saveGroups(groups);
    break;
  case "apply": {
    const ops: Op[] = JSON.parse(readFileSync(args[0], "utf8"));
    applyOps(groups, ops);
    saveGroups(groups);
    console.log(`${ops.length}건 고침`);
    break;
  }
  default:
    console.log(readFileSync(__filename, "utf8").split("*/")[0]);
    process.exit(cmd ? 1 : 0);
}
