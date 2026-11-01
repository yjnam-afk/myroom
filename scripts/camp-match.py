# import-kpc-camp.py 가 만든 camp-entries.jsonl 의 문항을 문제은행 합숙 문항(「합숙 2020.01 Day-1」)에 맞춘다.
#   사용: python3 scripts/camp-match.py <camp-entries.jsonl> <out.json>
#   KPC 「1xx회 대비」 합숙 → 문제은행 합숙 날짜. 회차가 제목에 없는 해설집(rd "x")은 문구가 가장 많이 맞는 합숙 날짜로 정한다.
#   맞으면 문제은행 문구를 쓴다(해설집 PDF 글자는 띄어쓰기가 빠져 있다 — 「PWA에대해설명하시오」).
import json, re, sys, difflib, collections, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CAMP = {"104": "2014.07", "105": "2015.01", "107": "2015.07", "108": "2016.01", "110": "2016.07", "111": "2017.01",
        "113": "2017.08", "114": "2018.01", "116": "2018.08", "117": "2019.01", "119": "2019.08", "120": "2020.01"}
Q = json.load(open(os.path.join(ROOT, "src/data/questions.json")))
bank = collections.defaultdict(list)  # (date, day) -> questions
for q in Q:
    m = re.match(r"합숙 (\d{4}\.\d{2}) Day-?(\d)", q.get("source", ""))
    if m: bank[(m.group(1), m.group(2))].append(q)

def norm(s):
    s = re.sub(r"[^0-9a-z가-힣]", "", (s or "").lower())
    return re.sub(r"(에)?(대(해|하여)|관(해|하여))?(다음(을|에)?(대해|대하여)?)?(설명|기술|논|서술)(하)?시오$", "", s)

def sim(a, b):
    x, y = norm(a), norm(b)
    if not x or not y: return 0.0
    if len(x) >= 4 and (x in y or y in x) and min(len(x), len(y)) / max(len(x), len(y)) >= 0.5: return 0.95
    return difflib.SequenceMatcher(None, x[:120], y[:120]).ratio()

E = [json.loads(l) for l in open(sys.argv[1])]
# 회차 없는 묶음은 날짜를 표결로
votes = collections.Counter()
for e in E:
    if e["rd"] != "x": continue
    for (d, day), qs in bank.items():
        if day == e["day"] and any(sim(e["q"], q["text"]) >= 0.8 for q in qs): votes[d] += 1
xdate = votes.most_common(1)[0][0] if votes else None
print("회차 없는 해설집 → 합숙", xdate, votes.most_common(3))

out, hit = [], 0
seen = set()
for e in E:
    key = (e["rd"], e["day"], e["per"], e["track"], e["no"])
    if key in seen: continue
    seen.add(key)
    date = CAMP.get(e["rd"]) or xdate
    cands = bank.get((date, e["day"]), [])
    best = max(((sim(e["q"], q["text"]), q) for q in cands), key=lambda t: t[0], default=(0, None))
    e["date"] = date
    if best[0] >= 0.6:
        e["question"] = best[1]["text"]; e["qid"] = best[1]["id"]; hit += 1
    else:
        e["question"] = e["q"]; e["qid"] = None
    out.append(e)
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
print(len(out), "문항 ·", hit, "문항이 문제은행 합숙 문항과 맞음")
