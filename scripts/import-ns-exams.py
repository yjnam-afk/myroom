# NS 주간 실전모의고사 문제 가져오기 — 문제지·해설집 PDF 에서 "문제와 출제일"만 뽑는다.
#   사용: python3 scripts/import-ns-exams.py <업로드 폴더> [--write]
#   --write 없이 돌리면 scratchpad 미리보기(JSON)만 만들고 questions.json 은 건드리지 않는다.
#
# 해설집의 모범답안(해설 본문)은 가져오지 않는다 — 문제·도메인·키워드 메타만.
# 기수는 날짜로 정한다(사용자 확인):
#   2022-09~2023-01 11기 · 2023-03~08 12기 · 2023-09~2024-01 13기 · 2024-02~07 14기 · 2024-08~2025-01 15기 · 2025-02~06 16기
#   2025-09~12 17기 · 2026-03~07 18기 · 2026-08~ 19기(현재)
# 실전 Simulation(133·135·136·139회…)은 그 기수에서 직전 NS 주차 + 1 주차로 넣는다.
import glob, json, os, re, sys
import pymupdf

SRC = next((a for a in sys.argv[1:] if not a.startswith("--")), "/root/.claude/uploads/91eba055-4832-57fd-a01e-05e73e86cdd5/")
WRITE = "--write" in sys.argv
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
PREVIEW = os.environ.get("NS_PREVIEW", "/tmp/claude-0/-home-user/91eba055-4832-57fd-a01e-05e73e86cdd5/scratchpad/ns_preview.json")

DOMAIN_ALIAS = {
    "SW공학": "소프트웨어공학", "소프트웨어 공학": "소프트웨어공학", "확률통계": "확률·통계",
    "확률/통계": "확률·통계", "통계": "확률·통계", "컴퓨터 구조": "컴퓨터구조", "운영 체제": "운영체제",
    "프로젝트 관리": "프로젝트관리", "데이터 베이스": "데이터베이스", "디지털 서비스": "디지털서비스",
    "정보보안": "보안", "네트워크/보안": "네트워크", "인공 지능": "인공지능", "AI": "인공지능",
    "IT경영": "경영전략", "IT 경영": "경영전략", "경영": "경영전략", "IT경영전략": "경영전략", "IT 경영전략": "경영전략",
    "디지털": "디지털서비스", "신기술": "디지털서비스", "디지털 네트워크": "네트워크", "Network": "네트워크",
    "CA": "컴퓨터구조", "OS": "운영체제", "NW": "네트워크", "PM": "프로젝트관리", "SE": "소프트웨어공학",
    "DB": "데이터베이스", "AI": "인공지능", "SC": "보안", "DS": "자료구조", "AL": "알고리즘", "DX": "디지털서비스",
    "컴퓨터 아키텍처": "컴퓨터구조", "컴퓨터아키텍처": "컴퓨터구조", "운영제체": "운영체제", "빅데이터": "데이터베이스",
    "성능테스트": "소프트웨어공학", "도메인명": "", "수치": "", "서비스": "",
}
KNOWN = {"컴퓨터구조","운영체제","소프트웨어공학","프로젝트관리","인공지능","확률·통계","네트워크","알고리즘","자료구조","데이터베이스","경영전략","보안","디지털서비스"}
def norm_domain(s):
    s = re.sub(r"\s*\(.*?\)", "", s or "").strip()
    s = re.split(r"[/,·ㆍ]", s)[0].strip()
    if re.match(r"^(확률|획률|통계)", s): return "확률·통계"
    s = DOMAIN_ALIAS.get(s, s)
    return s if s in KNOWN else ""

def cohort_of(date):  # YYYYMMDD
    y, m = int(date[:4]), int(date[4:6])
    if y == 2022 or (y == 2023 and m <= 1): return "11기"
    if y == 2023 and m <= 8: return "12기"
    if y == 2023 or (y == 2024 and m == 1): return "13기"
    if y == 2024 and m <= 7: return "14기"
    if y == 2024 or (y == 2025 and m <= 1): return "15기"
    if y == 2025 and m <= 6: return "16기"
    if y == 2025: return "17기"
    if y == 2026 and m <= 7: return "18기"
    if y == 2026: return "19기"
    return "?"

def parse_name(b):
    """(week|None, period, date, sim회차|None)"""
    m = re.search(r"NS_+(\d\d)_+(\d)_+(?:\d{3}_+)?(\d{8})", b)
    if m: return m.group(1), m.group(2), m.group(3), None
    m = re.search(r"NS_+(\d\d)_+(\d)_*\.pdf$", b)  # 파일명에 날짜가 없으면 본문에서 찾는다
    if m: return m.group(1), m.group(2), None, None
    s = re.search(r"(\d{3})_+ITPE_+Simulation_+(\d)_+(\d{8})", b)
    if s: return None, s.group(2), s.group(3), s.group(1)
    s = re.search(r"Simulation_+(\d)_+(\d)_+(\d{8})", b)  # 13기: 회차 없이 'Simulation_1'
    if s: return None, s.group(2), s.group(3), "실전" + s.group(1)
    return None

JUNK = re.compile(r"Copyright|Simulation Test|해설집|^\d+\s*-\s*\d+$|^\d{1,3}$|All rights reserved|^ITPE ")

def clean_lines(doc, pages=None):
    n = doc.page_count if pages is None else min(doc.page_count, pages)
    out = []
    for i in range(n):
        out.extend(l.rstrip() for l in doc[i].get_text().split("\n"))
    return out

def is_solution_head(lines, j):
    """'01' / 제목 / '문제' 꼴의 해설 블록 머리인가."""
    if not re.fullmatch(r"\d\d", lines[j].strip()): return False
    if j + 2 >= len(lines): return False
    title = lines[j + 1].strip()
    if not title or re.fullmatch(r"[\d\s-]+", title): return False  # 쪽번호가 앞에 붙은 경우
    for k in range(j + 2, min(j + 4, len(lines))):
        if lines[k].strip() == "문제": return True
    return False

def question_sheet_lines(lines):
    """'※ 다음 …' 부터 해설(첫 'NN\\n제목\\n문제') 직전까지의 줄."""
    out = []
    started = False
    for j, ln in enumerate(lines):
        t = ln.strip()
        if not started:
            if t.startswith("※ 다음") or t.startswith("※다음"):
                started = True
            continue
        if is_solution_head(lines, j):
            return out
        if t.startswith("※ 다음") or t.startswith("※다음"):
            # 같은 시트에 배점이 다른 문제군이 이어지는 경우(12기 3교시: 10점 7문항 + 25점 3문항)
            out.append("※배점" + t)
            continue
        out.append(t)
    return out

SUB = re.compile(r"^([가-하]\.|\(\d\)|\d\)|예시|단,|※|[-–•·])")

def split_questions(lines):
    qs = []
    cur = None
    def push(no, text):
        nonlocal cur
        if cur: qs.append(cur)
        cur = {"no": no, "text": text.strip()}
    points = None
    for t in lines:
        if not t or JUNK.search(t):
            continue
        if t.startswith("※배점"):
            pm = re.search(r"각\s*(\d+)\s*점", t)
            points = int(pm.group(1)) if pm else None
            continue
        m = re.match(r"^(\d{1,2})\.\s*(.*)$", t)
        if m and (cur is None or int(m.group(1)) == cur["no"] + 1):
            push(int(m.group(1)), m.group(2))
            if points: cur["points"] = points
            continue
        if cur is None:
            continue
        # "…사례10." / "…설명하시오. 10. 다음…" 처럼 다음 번호가 같은 줄에 붙은 경우
        hit = None
        for mm in re.finditer(r"(?<![\d.])(\d{1,2})\.(?!\d)", t):
            if int(mm.group(1)) == cur["no"] + 1: hit = mm; break
        if hit and hit.start() > 0:
            cur["text"] += " " + t[:hit.start()].strip()
            push(int(hit.group(1)), t[hit.end():])
            continue
        if SUB.match(t):
            cur["text"] += "\n" + t
        else:
            cur["text"] += ("" if cur["text"].endswith(("(", "/")) else " ") + t
    if cur: qs.append(cur)
    # 문항 첫 줄 끝에 다음 번호가 붙은 경우("…사례10." / "…설명하시오. 10. 다음")
    fixed = []
    for q in qs:
        m = re.search(r"\s*(?<![\d.])(\d{1,2})\.(?!\d)(.*)$", q["text"])
        nxt = {x["no"] for x in qs}
        if m and int(m.group(1)) == q["no"] + 1 and q["no"] + 1 not in nxt:
            q["text"] = q["text"][:m.start()]
            fixed.append(q)
            fixed.append({"no": q["no"] + 1, "text": m.group(2).strip()})
        else:
            fixed.append(q)
    qs = [q for q in fixed if q["text"].strip()]  # 번호만 있고 문구가 없는 오타("사례10.")는 버린다
    for q in qs:
        q["text"] = re.sub(r"[ \t]+", " ", q["text"]).replace(" ,", ",").replace(" )", ")").strip()
        q["text"] = re.sub(r"^[.\s]+", "", q["text"])
    return qs

def solution_meta(lines):
    """해설 블록 머리(NN / 제목 / 문제 / … / 도메인 / X / … / 키워드 / …)에서 문제문·도메인·키워드."""
    meta = {}
    heads = [j for j in range(len(lines)) if is_solution_head(lines, j)]
    for idx, j in enumerate(heads):
        end = heads[idx + 1] if idx + 1 < len(heads) else len(lines)
        block = [l.strip() for l in lines[j:end]]
        no = int(block[0])
        if no in meta: continue
        def field(name, stops):
            try: s = block.index(name)
            except ValueError: return None
            vals = []
            for l in block[s + 1:]:
                if l in stops or l.startswith(tuple(stops)): break
                if l and not JUNK.search(l): vals.append(l)
            return vals
        q = field("문제", ["도메인", "난이도", "키워드", "출제배경"])
        dom = field("도메인", ["난이도", "키워드", "출제배경"])
        kw = field("키워드", ["출제배경", "참고문헌", "출제자", "출처", "해설", "답안"])
        entry = {}
        if q: entry["text"] = split_questions(["1. " + q[0]] + q[1:])[0]["text"] if q else ""
        if dom: entry["domain"] = norm_domain(dom[0])
        if kw:
            ks = [k.strip() for k in re.split(r"[,\n]", "\n".join(kw[:4])) if k.strip()]
            entry["keywords"] = ks[:12]
        meta[no] = entry
    return meta

files = {}  # (cohort, week|sim, period) -> list of docs
skipped = []
for f in sorted(glob.glob(os.path.join(SRC, "*.pdf"))):
    b = os.path.basename(f)
    pn = parse_name(b)
    if not pn: continue
    week, period, date, sim = pn
    if not date:
        head = "".join(pymupdf.open(f)[i].get_text() for i in range(min(2, pymupdf.open(f).page_count)))
        dm = re.search(r"(20\d\d)\s*[.년]\s*(\d{1,2})\s*[.월]\s*(\d{1,2})", head)
        if not dm:
            skipped.append((b, "날짜 없음")); continue
        date = f"{dm.group(1)}{int(dm.group(2)):02d}{int(dm.group(3)):02d}"
    files.setdefault((cohort_of(date), week or f"S{sim}", period), []).append((date, f, b))

# Simulation 주차 = 그 기수에서 직전 NS 주차 + 1
def sim_week(cohort, date):
    prev = [int(w) for (c, w, p), v in files.items() if c == cohort and not w.startswith("S") and v[0][0] < date]
    return f"{(max(prev) if prev else 8) + 1:02d}"

exams = {}  # (cohort, week, period) -> {...}
for (cohort, week, period), lst in files.items():
    date = lst[0][0]
    sim = week[1:] if week.startswith("S") else None
    if sim: week = sim_week(cohort, date)
    e = exams.setdefault((cohort, week, period), {"date": date, "sim": sim, "questions": [], "meta": {}, "files": []})
    seen_len = set()
    for date, f, b in lst:
        doc = pymupdf.open(f)
        lines = clean_lines(doc)
        L = sum(len(l) for l in lines)
        if L < 200:
            skipped.append((b, "스캔(텍스트 없음)")); continue
        if L in seen_len: continue  # 같은 파일 재업로드
        seen_len.add(L)
        e["files"].append(b[:8])
        qs = split_questions(question_sheet_lines(lines))
        meta = solution_meta(lines) if doc.page_count > 4 else {}
        score = lambda m: sum(1 for v in m.values() if v.get("domain")) * 100 + len(m)
        if len(qs) > len(e["questions"]): e["questions"] = qs
        if score(meta) > score(e["meta"]): e["meta"] = meta
    # 문제지에서 못 뽑은 문항은 해설 머리의 '문제' 문구로 보충
    have = {q["no"] for q in e["questions"]}
    limit = 13 if period == "1" else 6
    if have: limit = min(limit, max(have) + 1)
    for no, m in sorted(e["meta"].items()):
        if no not in have and m.get("text") and no <= limit:
            e["questions"].append({"no": no, "text": m["text"], "from_meta": True})
    e["questions"].sort(key=lambda q: q["no"])

PERIOD = {"1": "1교시", "2": "2교시", "3": "3교시", "4": "4교시"}
out = []
for (cohort, week, period), e in sorted(exams.items()):
    d = e["date"]; iso = f"{d[:4]}-{d[4:6]}-{d[6:]}"
    for q in e["questions"]:
        m = e["meta"].get(q["no"], {})
        item = {
            "id": f"ns{cohort[:-1]}w{week}-{period}{q['no']:02d}",
            "period": PERIOD[period],
            "category": m.get("domain", ""),
            "kind": "NS모의",
            "round": f"{week}주차",
            "cohort": cohort,
            "date": iso,
            "text": q["text"],
        }
        if q.get("points"): item["points"] = q["points"]
        if e["sim"]: item["exam"] = f"실전 Simulation {e['sim'][2:]}" if e["sim"].startswith("실전") else f"{e['sim']}회 실전 Simulation"
        if m.get("keywords"): item["keywords"] = m["keywords"]
        out.append(item)

# 도메인이 비어 있는 문항은 다른 기수에 같은 문구로 나온 문항의 도메인을 빌린다.
by_text = {}
for q in out:
    if q["category"]: by_text.setdefault(re.sub(r"\s+", "", q["text"]), q["category"])
for q in out:
    if not q["category"]:
        q["category"] = by_text.get(re.sub(r"\s+", "", q["text"]), "")

print(f"시험 {len(exams)}개(기수·주차·교시) · 문항 {len(out)}개 · 도메인 없음 {sum(1 for q in out if not q['category'])}")
for (cohort, week, period), e in sorted(exams.items()):
    n = len(e["questions"]); md = len(e["meta"]); dm = sum(1 for m in e["meta"].values() if m.get("domain"))
    fm = sum(1 for q in e["questions"] if q.get("from_meta"))
    exp = 10 if period == "1" else 4
    flag = "  ⚠ 문항 적음" if n < exp else ""
    if dm < n: flag += f"  ⚠ 도메인 {dm}/{n}"
    sim = f" [{e['sim']}회]" if e["sim"] else ""
    print(f"  {cohort} {week}주차{sim} {PERIOD[period]} {e['date']}  문항 {n:2}(보충 {fm}) · 메타 {md:2}  파일 {','.join(e['files'])}{flag}")
for b, why in skipped: print("  건너뜀:", b[:50], why)

json.dump(out, open(PREVIEW, "w", encoding="utf8"), ensure_ascii=False, indent=1)
print("미리보기:", PREVIEW)

if WRITE:
    qp = os.path.join(ROOT, "src/data/questions.json")
    data = json.load(open(qp, encoding="utf8"))
    # 19기 1주차는 이미 ns1-1NN 으로 들어가 있다(모범답안 포함) — 날짜만 붙이고 새로 넣지 않는다.
    for q in data:
        if q.get("kind") == "NS모의" and q.get("cohort") == "19기" and q.get("round") == "1주차" and not q.get("date"):
            q["date"] = "2026-09-06"
    out2 = [q for q in out if not (q["cohort"] == "19기" and q["round"] == "01주차")]
    ids = {q["id"] for q in data}
    added = [q for q in out2 if q["id"] not in ids]
    by = {q["id"]: q for q in out2}
    for q in data:
        if q["id"] in by: q.update(by[q["id"]])
    data.extend(added)
    json.dump(data, open(qp, "w", encoding="utf8"), ensure_ascii=False, indent=1)
    print(f"questions.json 에 {len(added)}개 추가, {len(out2) - len(added)}개 갱신")
