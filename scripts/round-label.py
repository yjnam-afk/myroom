# 엑셀(문제검색 Tool) 회차 이름 → 화면 이름. import-itpe-search-tool.py 가 쓰고, 한 번 돌려 기존 문항도 바꿨다(2026-11-01).
#   ITPE_2026.10 → ITPE 모의고사 2026.10 / ITPE FR_2026.08 → ITPE 파이널 2026.08 / ITPE합숙_2020.06 → ITPE 합숙 2020.06
#   (2026-11-01 "itpe fr은 파이널이야, itpe는 모의고사야" — 이름만 보고 구분되게. 「ITPE 2026.10」「ITPE FR 2026.08」로 넣었던 것도 바꾼다)
#   합숙_2015.01 → 합숙 2015.01 / 모의_2016.06 → KPC 70회 (2016.06) — 엑셀 「모의」는 KPC IMPACT 실전모의고사다.
#   KPC 회차는 scripts/kpc-rounds.json (모범답안 문구로 맞춘 날짜 ↔ 회차; 68·69회처럼 갈리는 달은 회차 없이 「KPC 2016.05」).
import json, os, re, sys
KPC = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "kpc-rounds.json")))

def label(rd: str) -> str:
    m = re.match(r"^(ITPE\s*FR|ITPE\s*합숙|ITPE|합숙|모의)[_ ](\d{4}\.\d{2}(?:-\d)?)$", rd)
    if not m: return rd
    p, d = m.group(1).replace(" ", ""), m.group(2)
    if p == "모의":
        n = KPC.get(d[:7]) if "-" not in d else None
        return f"KPC {n}회 ({d})" if n else f"KPC {d}"
    return {"ITPEFR": "ITPE 파이널", "ITPE합숙": "ITPE 합숙", "ITPE": "ITPE 모의고사", "합숙": "합숙"}[p] + " " + d

if __name__ == "__main__":
    QP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../src/data/questions.json")
    Q = json.load(open(QP)); n = 0
    for q in Q:
        r = q.get("round")
        if not r: continue
        new = label(r)
        if new != r:
            q["round"] = new
            if q.get("source", "").startswith(r): q["source"] = new + q["source"][len(r):]
            n += 1
    if "--write" in sys.argv: json.dump(Q, open(QP, "w"), ensure_ascii=False, indent=1)
    print("바꿈", n)
