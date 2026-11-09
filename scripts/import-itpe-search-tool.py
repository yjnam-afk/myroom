# ITPE 기술사회 「기출_모의_FR 문제검색 Tool」 엑셀(.xls)에서 문제은행에 없는 문항을 가져온다.
#   사용: python3 scripts/import-itpe-search-tool.py <xls> [--write]
#   --write 없이 돌리면 scratchpad 미리보기(JSON)만 만든다. 과목은 그다음 classify-new-questions.ts 로 교재 토픽 기준으로 다시 정하고 넣는다.
# 2026-11-01 "다 넣어" — 처음엔 공통·관리(정보관리)만 넣었다가 응용·조직·컴시응 트랙까지 모두 넣음.
#  - 같은 문장(공백·기호 무시)이 이미 있으면 건너뛴다. 엑셀에 문제 머리 없이 「가. 나.」만 있는 행도 원문대로 넣는다.
#  - 응용 계열(응용·컴시응·조직·조직응용·시스템응용)은 track "컴퓨터시스템응용".
#  - 파이널은 Day 안에서 번호가 다시 1부터 시작하면 다음 교시.
#  - 과목(category)은 글자 2-gram 이 가장 비슷한 기존 문항의 과목(유사도 0.3 미만이면 비움).
import json, math, os, re, sys, collections
import xlrd
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
label = __import__("round-label").label  # ITPE_2026.10 → ITPE 2026.10, 모의_2016.06 → KPC 70회 (2016.06)

XLS = next(a for a in sys.argv[1:] if not a.startswith("--"))
WRITE = "--write" in sys.argv
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
QP = os.path.join(ROOT, "src/data/questions.json")
PREVIEW = os.environ.get("PREVIEW", "/tmp/claude-0/-home-user/91eba055-4832-57fd-a01e-05e73e86cdd5/scratchpad/fr/preview.json")

Q = json.load(open(QP))
norm = lambda t: re.sub(r"[\s\W_]+", "", re.sub(r"^\s*\d+\s*[.)]\s*", "", str(t)).lower())
have = {norm(q["text"]) for q in Q}
ids = {q["id"] for q in Q}
APP = {"응용", "컴시응", "조직", "조직응용", "시스템응용", "응응"}

def rnd(v):
    s = str(v).strip()
    return s[:-2] if s.endswith(".0") else s

def clean(t):
    t = str(t).replace("\t", " ").strip()
    t = re.sub(r"^\s*\d+\s*\.\s*", "", t)
    t = re.sub(r"^\[(관리|조직|응용|컴시응|공통)\]\s*", "", t)
    return re.sub(r"[  ]+\n", "\n", t).strip()

def num(t):
    m = re.match(r"^\s*(\d+)\s*\.", str(t))
    return int(m.group(1)) if m else None

def period_of(v):
    m = re.match(r"(\d)", str(v))
    return f"{m.group(1)}교시" if m else None

# ── 과목 추정: 글자 2-gram TF-IDF 최근접 ──
def grams(t):
    t = re.sub(r"\s+", "", t.lower())[:300]
    return collections.Counter(t[i:i + 2] for i in range(len(t) - 1))
docs = [(grams(q["text"]), q["category"]) for q in Q if q.get("category")]
df = collections.Counter()
for g, _ in docs: df.update(g.keys())
N = len(docs)
idf = {k: math.log(N / (1 + v)) for k, v in df.items()}
def vec(g):
    v = {k: c * idf.get(k, math.log(N)) for k, c in g.items()}
    n = math.sqrt(sum(x * x for x in v.values())) or 1
    return {k: x / n for k, x in v.items()}
dv = [vec(g) for g, _ in docs]
inv = collections.defaultdict(list)
for i, v in enumerate(dv):
    for k, x in v.items(): inv[k].append((i, x))
def category(t):
    v = vec(grams(t)); sc = collections.Counter()
    for k, x in v.items():
        if idf.get(k, 0) < 1.0: continue
        for i, y in inv.get(k, ()): sc[i] += x * y
    if not sc: return ""
    i, s = sc.most_common(1)[0]
    return docs[i][1] if s >= 0.3 else ""

b = xlrd.open_workbook(XLS)
new, seen = [], set()
mnext = max(int(q["id"][1:]) for q in Q if re.match(r"m\d{5}$", q["id"]))
fnext = max(int(q["id"][1:]) for q in Q if re.match(r"f\d{5}$", q["id"]))

def add(rec, text):
    n = norm(text)
    if not n or n in have or n in seen: return False
    seen.add(n); rec["text"] = text; rec["category"] = category(text); new.append(rec); return True

# 모의고사
sh = b.sheet_by_name("모의고사")
for r in range(1, sh.nrows):
    rd, tr, ty, tx = (sh.cell_value(r, c) for c in range(4))
    rd = label(rnd(rd)); tr = str(tr).strip(); per = period_of(ty)
    if not per: continue
    rec = {"id": None, "period": per, "category": "", "kind": "모의고사", "round": rd, "source": f"{rd} {per}"}
    if tr in APP: rec["track"] = "컴퓨터시스템응용"
    if add(rec, clean(tx)):
        mnext += 1; rec["id"] = f"m{mnext:05d}"

# 파이널 — Day 안에서 번호가 되돌아가면 다음 교시
sh = b.sheet_by_name("파이널라운드")
state = {}
for r in range(1, sh.nrows):
    rd, tr, ty, tx = (sh.cell_value(r, c) for c in range(4))
    rd = label(rnd(rd)); tr = str(tr).strip(); ty = str(ty).strip()
    key = (rd, ty, "app" if tr in APP else "main")
    k = num(tx); p, last = state.get(key, (1, 0))
    if k is not None:
        if k <= last: p += 1
        last = k
    state[key] = (p, last)
    per = f"{p}교시" if k is not None else ("1교시" if len(clean(tx)) < 60 else "2교시")
    rec = {"id": None, "period": per, "category": "", "kind": "파이널", "round": rd, "source": f"{rd} {ty}"}
    if tr in APP: rec["track"] = "컴퓨터시스템응용"
    if add(rec, clean(tx)):
        fnext += 1; rec["id"] = f"f{fnext:05d}"

# 기출 — 응용 계열만(정보관리는 k 로 80~140회가 다 있다)
sh = b.sheet_by_name("기출")
for r in range(1, sh.nrows):
    rd, tr, ty, tx = (sh.cell_value(r, c) for c in range(4))
    tr = str(tr).strip()
    if tr not in APP: continue
    rd = rnd(rd).replace("회", ""); per = period_of(ty); k = num(tx)
    if not per: continue
    base = f"c{rd}-{per[0]}{k:02d}" if k else f"c{rd}-{per[0]}x{r}"
    # 같은 회·교시·번호가 이미 있으면(해설집에서 넣은 14개 회차) 같은 시험이다 — 표기만 다를 뿐이라 건너뛴다.
    # 다만 그 자리의 문장이 다르면(84회는 엑셀 번호가 전부 「1.」) 같은 교시의 빈 번호를 준다(2026-11-09)
    text0 = clean(tx)
    if base in ids:
        # 해설집으로 31문항이 다 들어온 회차는 번호가 같으면 같은 문항(표기 차이)이라 건너뛴다. 덜 들어온 회차(84회)만 빈 번호를 준다
        full = sum(1 for q in Q if q["id"].startswith(f"c{rd}-")) >= 31
        same = next((q for q in Q if q["id"] == base), None)
        if full or same is None or norm(same["text"]) == norm(text0) or norm(text0) in have: continue
        cid = next((f"c{rd}-{per[0]}{n:02d}" for n in range(1, 40) if f"c{rd}-{per[0]}{n:02d}" not in ids), None)
        if not cid: continue
    else:
        cid = base
    rec = {"id": cid, "period": per, "category": "", "source": f"{rd}회 {per}", "round": f"컴시응 {rd}회", "track": "컴퓨터시스템응용"}
    # 기출은 문장이 같아도 넣는다 — 정보관리와 같은 문장인 컴시응 문항(140회 7문항 등 90여 개)을 「같은 문장」 규칙이 버렸다(2026-11-09 "컴시응 기출문제 사이트에 안 올렸어?")
    # 번호가 없는 행(125회처럼 「x」 id)은 같은 회차에 같은 문장이 있으면 그 문항이다 — 그때만 문장으로 거른다
    text = clean(tx)
    if not norm(text): continue
    if k is None and norm(text) in have: continue
    rec["text"] = text; rec["category"] = category(text); new.append(rec); ids.add(cid)

c = collections.Counter((x.get("kind") or "기출", x.get("track", "")) for x in new)
print(len(new), dict(c))
print("과목 빈칸", sum(1 for x in new if not x["category"]), collections.Counter(x["category"] for x in new).most_common())
json.dump(new, open(PREVIEW, "w"), ensure_ascii=False, indent=1)
if WRITE:
    Q.extend(new)
    open(QP, "w").write(json.dumps(Q, ensure_ascii=False, indent=1))
    print("questions.json", len(Q))
