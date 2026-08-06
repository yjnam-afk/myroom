import { subnoteByTitle } from "./src/data/textbookSubnotes";
import { subnoteExtraFor } from "./src/data/subnoteExtras";
import { findIdByTitle } from "./src/lib/grounding";
import * as fs from "fs";
const src = fs.readFileSync("src/app/basics/page.tsx", "utf8");
const sees = [...src.matchAll(/see: "((?:[^"\\]|\\.)+)"/g)].map((m) => m[1].replace(/\\"/g, '"'));
const cats = [...src.matchAll(/cat: "([^"]+)"/g)].map((m) => m[1]);
const terms = (src.match(/\{ ko: "/g) || []).length;
const dead: string[] = [];
for (const s of sees) {
  const ok = !!subnoteByTitle(s) || !!subnoteExtraFor(undefined, s) || !!findIdByTitle(s);
  if (!ok) dead.push(s);
}
const byCat: Record<string, number> = {};
for (const c of cats) byCat[c] = (byCat[c] || 0) + 1;
console.log("총 용어:", terms, "/ see 링크:", sees.length);
console.log("카테고리별:", JSON.stringify(byCat, null, 0));
console.log("깨진 see 링크:", dead.length ? dead.join(" | ") : "없음");
