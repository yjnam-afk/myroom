"""모범답안 ↔ 모의고사·파이널·셀테 문항을 문구 비슷도로 잇는다 (2026-11-01).

  python3 scripts/link-similar.py [--dry] [--min 0.85]

「ACID 와 BASE 를 비교」 ↔ 「ACID/BASE를 비교」처럼 같은 문제인데 표기만 달라 「🎯 같은 문제」로 안 잡히던 것.
  - 비슷도(알맹이 글자열) --min 이상, 숫자·버전 낱말이 같을 때만(PaaS-TA 3.0 ≠ 5.0).
  - 1교시(단답) ↔ 2~4교시(논술)는 잇지 않는다.
  - 이미 화면에서 같은 문제로 잡히는 것(알맹이 같음·85% 포함)은 건너뛴다.
기출(k·c)에는 쓰지 않는다 — 「역강화학습↔강화학습」「802.11ax↔ac」 오탐이 많았다.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.answers_py import load_answers, load_questions, core, numbers, Index, apply_ops

import re
DRY = "--dry" in sys.argv
CHANGERS = ["보안", "완전", "해결", "유형", "종류", "절차", "비교", "동향", "활용", "사례", "구성", "변환", "장단점", "장점", "단점", "취약점", "대응", "평가", "설계"]
MIN = float(sys.argv[sys.argv.index("--min") + 1]) if "--min" in sys.argv else 0.85
A = load_answers()
T = [q for q in load_questions() if q.get("kind") in ("모의고사", "파이널", "셀테")]
idx = Index(T, limit=400)
ops = []
for a in A:
    x = core(a["question"])
    if len(x) < 6:
        continue
    have = set(a.get("questionIds") or [])
    for q, r in idx.candidates(a["question"], top=8):
        if q["id"] in have or r < MIN:
            continue
        if a.get("period") in ("1교시", "2교시", "3교시", "4교시") and (a["period"] == "1교시") != (q["period"] == "1교시"):
            continue
        y = core(q["text"])
        sh, lo = sorted([x, y], key=len)
        if x == y or (len(sh) >= 4 and len(sh) / len(lo) >= 0.85 and sh in lo):
            continue
        if numbers(a["question"]) != numbers(q["text"]) and (numbers(a["question"]) or numbers(q["text"])):
            continue
        # 한쪽에만 있는 한글 낱말이 문제를 바꾸면(멀티클라우드 ↔ 멀티클라우드 보안, 동형암호 ↔ 완전동형암호, 현상 ↔ 해결방법) 잇지 않는다
        ka, kb = re.sub(r"[^가-힣]", "", a["question"]), re.sub(r"[^가-힣]", "", q["text"])
        if any((w in ka) != (w in kb) for w in CHANGERS):
            continue
        # 대문자 약어가 다르면 다른 문제다 — CPS ↔ EdgeCPS, OPE ↔ OPES
        caps = lambda t: {w for w in re.findall(r"[A-Za-z0-9]+", t) if re.fullmatch(r"[A-Z][A-Z0-9]+", w)}
        if caps(a["question"]) and caps(q["text"]) and caps(a["question"]) != caps(q["text"]):
            continue
        ops.append({"op": "add-qid", "id": a["id"], "qid": q["id"]})
        have.add(q["id"])
apply_ops(ops, DRY, "link-similar")
