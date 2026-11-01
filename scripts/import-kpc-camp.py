# KPC 합숙훈련 해설집(「KPC 1xx회 대비 합숙해설집_N일차_M교시.pdf」)을 문항별 webp 로 자른다.
#   사용: python3 scripts/import-kpc-camp.py <드라이브 다운로드 JSON 또는 PDF>...
#   결과: public/answers/KPC합숙해설집/{회}회/hs{회}-{일차}-{교시}[-트랙]-{번호}-{쪽}.webp
#         + scratchpad 의 camp-entries.jsonl 에 한 줄씩(문항·쪽·출제자). TS 로 옮기는 건 camp-to-ts.ts.
# 2026-11-01 "모범답안이 없는 토픽 혹은 기출문제 모범답안 찾아줘" — 드라이브 「합숙 해설」 폴더(104~120회 대비).
# 해설집 첫 쪽 머리: 「문제 / 도메인 / 출제배경(108회 대비는 「출제예상 배경」) / 키워드 / 목차예시 / 출제자 / 난이도」 — 「출제배경」이 있는 쪽이 문항 시작.
import base64, io, json, os, re, sys, unicodedata
import pymupdf as fitz
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.environ.get("CAMP_OUT", "/tmp/claude-0/-home-user/91eba055-4832-57fd-a01e-05e73e86cdd5/scratchpad/hs/camp-entries.jsonl")
TRACK = {"관리": "관리", "컴시응": "컴시응", "공통": "공통"}

def fix(t):
    # 드라이브 제목이 EUC-KR 를 latin-1 로 읽은 꼴(「ÇÕ¼÷ÇØ¼³Áý」)이거나 NFD(자모 분리)로 온다
    t = unicodedata.normalize("NFC", t)  # 「È」가 E + 결합 부호로 갈라져 오면 latin-1 로 못 돌린다
    try: t = t.encode("latin-1").decode("cp949")
    except Exception: pass
    return unicodedata.normalize("NFC", t)

def load(path):
    if path.endswith(".pdf"): return fix(os.path.basename(path)), open(path, "rb").read()
    d = json.load(open(path)); return fix(d["title"]), base64.b64decode(d["content"])

for path in sys.argv[1:]:
    title, data = load(path)
    m = re.search(r"(\d{3})회", title); rd = m.group(1) if m else "x"
    day = re.search(r"(\d)일차", title).group(1); per = re.search(r"(\d)교시", title).group(1)
    tr = next((v for k, v in TRACK.items() if k in title.split("교시")[-1]), "")
    doc = fitz.open(stream=data, filetype="pdf")
    if doc.needs_pass: print("암호", title); continue
    starts = []
    for i, p in enumerate(doc):
        t = p.get_text()
        if re.search(r"출제\S*\s*배경", t) and re.search(r"\n\s*문제\s*\n", t):  # 108회 대비는 「출제예상 배경」
            q = re.search(r"\n\s*문제\s*\n(.*?)\n\s*도메인", t, re.S)
            a = re.search(r"출제자\s*\n(.*?)(?:\(|\n)", t)
            starts.append((i, re.sub(r"\s+", " ", q.group(1)).strip() if q else "", a.group(1).strip() if a else ""))
    last = doc.page_count - 1
    while last > 0 and len(doc[last].get_text().strip()) < 30: last -= 1
    folder = f"public/answers/KPC합숙해설집/{rd}회"
    os.makedirs(os.path.join(ROOT, folder), exist_ok=True)
    tag = f"hs{rd}-{day}-{per}" + (f"-{ {'관리':'m','컴시응':'c','공통':'g'}[tr]}" if tr else "")
    with open(OUT, "a") as out:
        for n, (s, q, who) in enumerate(starts, 1):
            e = starts[n][0] - 1 if n < len(starts) else last
            pages = []
            for j, pg in enumerate(range(s, e + 1), 1):
                fn = f"{tag}-{n:02d}-{j}.webp"
                z = 1100 / doc[pg].rect.width
                im = Image.open(io.BytesIO(doc[pg].get_pixmap(matrix=fitz.Matrix(z, z)).tobytes("png"))).convert("RGB")
                im.save(os.path.join(ROOT, folder, fn), "WEBP", quality=60)
                pages.append(f"/answers/KPC합숙해설집/{rd}회/{fn}")
            out.write(json.dumps({"rd": rd, "day": day, "per": per, "track": tr, "no": n, "q": q, "who": who, "pages": pages, "file": title}, ensure_ascii=False) + "\n")
    print(title, "→", len(starts), "문항")
