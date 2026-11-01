"""KPC IMPACT 모의고사 모범답안 ↔ 문제은행 KPC 모의고사 문항 연결 (2026-11-01).

  python3 scripts/link-kpc-mock.py [--dry] [--rounds]

KPC 답안(exam 「제70회 KPC 기술사 IMPACT 실전모의고사」)은 문제 문구가 OCR 로 깨진 것이 많아 「같은 문제」로 안 잡혔다.
  1) --rounds: 답안 문구가 0.8 이상 맞는 문제은행 회차를 표결해 KPC 회차 ↔ 날짜(scripts/kpc-rounds.json)를 다시 만든다.
  2) 회차 날짜가 정해진 답안마다 같은 날짜·교시(·트랙) 문항 중 가장 비슷한 것에 questionIds 를 단다.
     비슷도 0.75 이상, 또는 0.5 이상 + (같은 번호 또는 2등과 0.2 이상 차), 또는 0.35 이상 + 같은 번호 + 0.25 차.
     숫자가 다르면(ISO 21500 ≠ 15408) 걸지 않는다.
  3) 같은 번호로 걸렸고 비슷도 0.9 미만이면(깨진 문구) 문제 문구를 문제은행 원문으로 바꾼다(원문이 「가.」로 시작하면 그대로 둔다).
"""
import collections, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.answers_py import ROOT, load_answers, load_questions, ratio, numbers, apply_ops

DRY = "--dry" in sys.argv
A = [a for a in load_answers() if "KPC" in (a.get("exam") or "") and "합숙" not in a.get("exam", "")]
Q = load_questions()
KPC_FILE = os.path.join(ROOT, "scripts/kpc-rounds.json")


def date_of(q):
    m = re.match(r"KPC (?:\d+회 )?\(?(\d{4}\.\d{2})\)?", q.get("round") or "")
    return m.group(1) if m else None


mock = [q for q in Q if date_of(q)]
by_date = collections.defaultdict(list)
for q in mock:
    by_date[date_of(q)].append(q)


def kround(a):
    m = re.search(r"제\s*(\d+)\s*회", a.get("exam", ""))
    return int(m.group(1)) if m else None


def ktrack(a):
    s = a["id"] + a.get("exam", "")
    if re.search(r"컴시응|시스템응용", s):
        return "컴퓨터시스템응용"
    return "" if "정보관리" in s else None


if "--rounds" in sys.argv:
    votes = collections.defaultdict(collections.Counter)
    for a in A:
        n = kround(a)
        if not n:
            continue
        best = max(((ratio(a["question"], q["text"]), q) for q in mock if q["period"] == a["period"]), key=lambda t: t[0], default=(0, None))
        if best[0] >= 0.8:
            votes[n][date_of(best[1])] += 1
    inv = collections.defaultdict(list)
    for n, c in votes.items():
        d, k = c.most_common(1)[0]
        if k >= 2:
            inv[d].append(n)
    table = {d: ns[0] for d, ns in sorted(inv.items()) if len(ns) == 1}  # 두 회차가 한 달로 갈리면 회차를 안 붙인다
    json.dump(table, open(KPC_FILE, "w"), ensure_ascii=False, indent=1)
    print("kpc-rounds.json", len(table), "개월")

table = json.load(open(KPC_FILE))
date = {n: d for d, n in table.items()}
pos = {}
for d, qs in by_date.items():
    cnt = collections.Counter()
    for q in qs:
        k = (q["period"], q.get("track", ""))
        cnt[k] += 1
        pos[q["id"]] = cnt[k]

ops = []
for a in A:
    n = kround(a)
    if n not in date:
        continue
    tr = ktrack(a)
    cands = [q for q in by_date[date[n]] if q["period"] == a["period"] and (tr is None or q.get("track", "") == tr)]
    if not cands:
        continue
    sc = sorted(((ratio(a["question"], q["text"]), q) for q in cands), key=lambda t: -t[0])
    s, q = sc[0]
    posok = bool(a.get("no")) and str(pos[q["id"]]) == str(a["no"]).strip()
    margin = s - (sc[1][0] if len(sc) > 1 else 0)
    ok = s >= 0.75 or (s >= 0.5 and (posok or margin > 0.2)) or (s >= 0.35 and posok and margin >= 0.25)
    na, nb = numbers(a["question"]), numbers(q["text"])
    if not ok or (na and nb and not na & nb):
        continue
    if q["id"] not in (a.get("questionIds") or []):
        ops.append({"op": "add-qid", "id": a["id"], "qid": q["id"]})
    if posok and s < 0.9 and not q["text"].lstrip().startswith("가.") and len(q["text"]) >= 0.8 * len(a["question"]) and a["question"] != q["text"].strip():
        ops.append({"op": "set", "id": a["id"], "field": "question", "value": q["text"].strip()})
apply_ops(ops, DRY, "link-kpc-mock")
