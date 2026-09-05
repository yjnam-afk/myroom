# 모범답안 형식 검사 — 1교시(서두 규격) + 2~4교시(ITPE 4단락) 통합.
#   사용: python3 scripts/check-answer-format.py <round>  [answers.json 경로]
#   예:   python3 scripts/check-answer-format.py 136 src/data/modelAnswers.k136.part.json
# 규칙 출처: src/lib/prompts.ts (COMMON_RULES + 교시별 구조), docs/ANSWER_SPEC.md
import json, re, sys

rnd = sys.argv[1]
path = sys.argv[2] if len(sys.argv) > 2 else "src/data/modelAnswers.json"
m = json.load(open(path))

def plain(s):
    return re.sub(r"\*\*(.+?)\*\*", r"\1", s).replace(" ", "")

# 표 3열의 상한은 표 종류에 따라 다르다. 나열표('설명')는 짧은 명사구로 족하지만,
# 판정·대응표는 수치·표준명 같은 기준값이 들어가야 답안 가치가 생긴다.
LIST_MAX = 12   # | 구분 | 키워드 | 설명 |
JUDGE_MAX = 20  # | 구분 | 점검 항목 | 판정·조치 | 등

def check_tables(a):
    """표 규격은 교시 공통이다 — 3단표 3열 길이, 표 아래 간글 1줄."""
    errs = []
    tables = re.findall(r"(\|[^\n]*\|\n\|[-\s|:]+\|\n(?:\|[^\n]*\|\n?)+)", a)
    long_cells = 0
    for t in tables:
        rows = [r for r in t.strip().split("\n") if r.startswith("|")]
        header = [c.strip() for c in rows[0].strip("|").split("|")]
        if len(header) != 3:
            continue
        # 2열이 '키워드'가 아니면 비교표이므로 길이 제한 대상이 아니다.
        if header[1] == "키워드":
            cap = LIST_MAX
        elif header[1] in ("점검 항목", "점검항목", "문제점", "위험", "이슈"):
            cap = JUDGE_MAX
        else:
            continue
        for r in rows[2:]:
            cells = [c.strip() for c in r.strip("|").split("|")]
            if len(cells) == 3 and len(plain(cells[2])) > cap:
                long_cells += 1
    if long_cells:
        errs.append(f"3단표 3열 길이 초과 {long_cells}칸(나열표 {LIST_MAX}자·판정표 {JUDGE_MAX}자)")
    for t in tables:
        idx = a.find(t) + len(t)
        after = [l for l in a[idx:].split("\n")[:3] if l.strip()]
        if not after or not after[0].strip().startswith(("-", "·")):
            errs.append("표 아래 간글 1줄 없음"); break
    return errs

def check_p1(k, a):
    lines = [l.rstrip() for l in a.split("\n")]
    errs = check_tables(a)
    try:
        i = next(i for i, l in enumerate(lines) if l.startswith("## 1."))
    except StopIteration:
        return ['"## 1." 절 없음']
    try:
        j = next(x for x in range(i + 1, len(lines)) if lines[x].startswith("## "))
    except StopIteration:
        j = len(lines)
    sec = [l for l in lines[i + 1 : j] if l.strip()]
    qline = next((l for l in lines if l.startswith("문)")), "")
    if "비교" in qline:
        subs = [x for x, l in enumerate(sec) if re.match(r"^[가나]\.", l.strip())]
        if len(subs) != 2:
            errs.append(f"비교형인데 가./나. 두 절이 아님({len(subs)}개)")
        for x in subs:
            blk = [l.strip() for l in sec[x + 1 : x + 4] if l.strip()]
            d = blk[0][2:].strip() if blk and blk[0].startswith("- ") else None
            if d is None:
                errs.append(f"{sec[x].strip()[:12]} 정의 줄 없음"); continue
            n = len(plain(d))
            if n < 34 or n > 35:
                errs.append(f"{sec[x].strip()[:6]} 정의 {n}자(34~35 필요)")
            if not any("특징)" in l for l in blk):
                errs.append(f"{sec[x].strip()[:6]} 특징) 줄 없음")
        return errs
    d = next((l.strip()[2:].strip() for l in sec if l.strip().startswith("- ") and "특징" not in l), None)
    if d is None:
        errs.append("정의 줄 없음")
    else:
        n = len(plain(d))
        if n < 34 or n > 35:
            errs.append(f"정의 {n}자(34~35 필요) → {d[:30]}")
    feat = next((l for l in sec if "특징)" in l), None)
    if feat is None:
        errs.append("특징) 3개 줄 없음")
    else:
        items = [x for x in re.split(r"[,·]", feat.split("특징)")[-1]) if x.strip()]
        if len(items) != 3:
            errs.append(f"특징 {len(items)}개(3개 필요)")
    return errs

def check_p24(k, a):
    lines = a.split("\n")
    errs = []
    if not lines[0].startswith("문)"):
        errs.append('첫 줄 리드문("문) …") 없음')
    heads = [l for l in lines if l.startswith("## ")]
    for w in ["## I.", "## II.", "## III.", "## IV."]:
        if not any(h.startswith(w) for h in heads):
            errs.append(f"{w} 절 없음")
    if len(heads) > 5:
        errs.append(f"절이 {len(heads)}개(4단락 초과)")
    if "```" in a:
        errs.append("코드블록/mermaid 사용(규칙 6-1 위반)")
    if not re.findall(r"(\|[^\n]*\|\n\|[-\s|:]+\|\n(?:\|[^\n]*\|\n?)+)", a):
        errs.append("3단표 없음")
    errs += check_tables(a)
    try:
        i = next(x for x, l in enumerate(lines) if l.startswith("## I."))
        seg = [l.strip() for l in lines[i + 1 : i + 8] if l.strip()]
        d = next((l[2:].strip() for l in seg if l.startswith("- ") and "특징" not in l), None)
        if d is None:
            errs.append("서론 정의 줄 없음")
        else:
            n = len(plain(d))
            if n < 34 or n > 35:
                errs.append(f"서론 정의 {n}자(34~35 필요)")
        if not any("특징)" in l for l in seg):
            errs.append("서론 특징 3개 줄 없음")
    except StopIteration:
        pass
    return errs

# 기출은 id 규칙(k<회차>-1xx = 1교시)으로 교시를 판별하지만,
# 모의고사·예상문제(yc·m·f·s…)는 id에 교시가 없어 questions.json의 period를 쓴다.
numeric = rnd.isdigit()
prefix = f"k{rnd}-" if numeric else rnd
period_of = {}
if not numeric:
    period_of = {q["id"]: q.get("period", "") for q in json.load(open("src/data/questions.json"))}

def is_p1(k):
    if numeric:
        return k.startswith(f"k{rnd}-1")
    return period_of.get(k, "").startswith("1")

bad = tot = 0
for k in sorted(m):
    if not k.startswith(prefix):
        continue
    tot += 1
    a = m[k]["answer"]
    e = check_p1(k, a) if is_p1(k) else check_p24(k, a)
    if e:
        bad += 1
        print(f"{k}: " + " | ".join(e))
print(f"\n{tot}건 중 위반 {bad}건")
print("PASS" if bad == 0 else "FAIL")
sys.exit(0 if bad == 0 else 1)
