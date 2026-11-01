"""ITPE 해설집 PDF(기출문제 해설집·NS 주간 실전모의고사 해설집)를 문항별 webp + 답안 항목으로 (2026-11-01).

  python3 scripts/import-itpe-haesul.py --pdf 1교시.pdf --pdf 2교시.pdf … \\
      --img-dir public/answers/기출해설집/컴시응/132회 --img-prefix itpe132cs \\
      --id-prefix peer-itpecs132 --qid-prefix c132 \\
      --exam "제132회 컴퓨터시스템응용기술사 기출문제 해설집 (ITPE 기술사회{해설})" \\
      [--password ****] [--out entries.json]
  그다음  npx tsx scripts/answers.ts add entries.json <묶음.json>

- 교시는 PDF 제목/파일명의 「N교시」로, 문항 시작은 「도메인·난이도·출제배경」 머리가 있는 쪽으로 찾는다.
- 문항 번호는 시작 쪽 차례(1, 2, …). 맨 앞 문제지 쪽에서 「N. …」 문구를 읽어 같은 번호의 문제 문구로 쓴다.
- 문제은행에 `{qid-prefix}-{교시}{번호:02}` 가 있으면 questionIds 로 건다(문구가 크게 다르면 경고만).
- {해설} 자리에는 해설자(「, 해설 강남평일야간반 전일 기술사」)가 들어간다.
- 암호가 걸린 PDF 는 --password (드라이브 해설집 폴더의 암호.txt — 132회가 그랬다).
- topicTitles 는 비워 둔다 — 넣은 뒤 scripts/answers.ts 로 교재 서브노트 제목을 단다(titlesMatching 결과를 눈으로 훑고).
"""
import argparse, difflib, io, json, os, re, sys
import pymupdf as fitz
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.answers_py import ROOT, load_questions, core

ap = argparse.ArgumentParser()
ap.add_argument("--pdf", action="append", required=True)
ap.add_argument("--img-dir", required=True)
ap.add_argument("--img-prefix", required=True)
ap.add_argument("--id-prefix", required=True)
ap.add_argument("--qid-prefix", default="")
ap.add_argument("--exam", required=True)
ap.add_argument("--password", default="")
ap.add_argument("--out", default="/tmp/haesul-entries.json")
ap.add_argument("--width", type=int, default=1100)
ap.add_argument("--quality", type=int, default=70)
o = ap.parse_args()

QB = {q["id"]: q for q in load_questions()}
os.makedirs(os.path.join(ROOT, o.img_dir), exist_ok=True)
web = "/" + os.path.relpath(os.path.join(ROOT, o.img_dir), os.path.join(ROOT, "public")).replace(os.sep, "/")
entries = []
for path in o.pdf:
    d = fitz.open(path)
    if d.needs_pass and not d.authenticate(o.password):
        sys.exit(f"암호: {path}")
    per = re.search(r"(\d)\s*교시", os.path.basename(path)) or re.search(r"제\s*(\d)\s*교시", d[1].get_text())
    per = per.group(1)
    head = ""
    for i in range(1, min(4, d.page_count)):
        t = d[i].get_text()
        if "출제배경" in t:
            break
        head += t
    head = head[head.find("하시오"):] if "하시오" in head else head
    parts = re.split(r"\n\s*(\d{1,2})\s*\.\s", head)
    sheet = [re.sub(r"\s+", " ", re.sub(r"Copyright.*", " ", parts[k + 1])).strip() for k in range(1, len(parts) - 1, 2)]
    starts = []
    for i, p in enumerate(d):
        t = p.get_text()
        if "도메인" in t and "난이도" in t and re.search(r"출제\S*\s*배경", t):
            m = re.search(r"해설자\s*\n?\s*(.*?)\s*\(", t, re.S)
            starts.append((i, re.sub(r"\s+", " ", m.group(1)).strip() if m else ""))
    last = d.page_count - 1
    while last > 0 and ("대치점" in d[last].get_text() or len(d[last].get_text().strip()) < 30):
        last -= 1
    if sheet and len(sheet) != len(starts):
        print(f"⚠ {os.path.basename(path)}: 문제지 {len(sheet)}문항 / 해설 {len(starts)}문항 — 번호가 어긋날 수 있다")
    for n, (s, who) in enumerate(starts, 1):
        e = starts[n][0] - 1 if n < len(starts) else last
        pages = []
        for j, pg in enumerate(range(s, e + 1), 1):
            fn = f"{o.img_prefix}-{per}-{n:02d}-{j}.webp"
            z = o.width / d[pg].rect.width
            Image.open(io.BytesIO(d[pg].get_pixmap(matrix=fitz.Matrix(z, z)).tobytes("png"))).convert("RGB").save(
                os.path.join(ROOT, o.img_dir, fn), "WEBP", quality=o.quality)
            pages.append({"src": f"{web}/{fn}", "label": f"{j}쪽"})
        text = sheet[n - 1] if n <= len(sheet) else ""
        qid = f"{o.qid_prefix}-{per}{n:02d}" if o.qid_prefix else ""
        ent = {"id": f"{o.id_prefix}-{per}-{n:02d}", "period": f"{per}교시", "no": str(n), "question": text,
               "exam": o.exam.replace("{해설}", f", 해설 {who}" if who else ""), "topicTitles": [], "pages": pages}
        if qid in QB:
            ent["questionIds"] = [qid]
            if not text:
                ent["question"] = QB[qid]["text"]
            elif difflib.SequenceMatcher(None, core(text)[:80], core(QB[qid]["text"])[:80]).ratio() < 0.5:
                print(f"⚠ {qid} 문구가 다르다: 「{text[:30]}」 ↔ 「{QB[qid]['text'][:30]}」")
        entries.append(ent)
        print(ent["id"], len(pages), "쪽", (text or ent["question"])[:40])
json.dump(entries, open(o.out, "w"), ensure_ascii=False, indent=1)
print(len(entries), "편 →", o.out)
