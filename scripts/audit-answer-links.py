"""모범답안 ↔ 문제은행 문항 연결(questionIds) 검수 (2026-11-01).

  python3 scripts/audit-answer-links.py          # 의심 목록만
  python3 scripts/audit-answer-links.py --fix    # 의심 연결을 끊는다(answers.ts apply)

questionIds 는 「🎯 같은 문제」 표시의 근거라, 다른 문제에 걸리면 엉뚱한 문항에 같은 문제로 뜬다
(무선 핑거프린팅 → 3D 프린팅, 몬테카를로 → MCTS, CMMI v3.0 → 118회 CMMI 가 실제로 있었다).
의심 기준 — 답안 제목과 연결 문항 문구를 비교해:
  - 한쪽에만 문제를 바꾸는 한글 낱말(보안·완전·해결·유형·비교·대응 …)이 있다
  - 대문자 약어가 서로 다르다(둘 다 있을 때) — CPS ↔ EdgeCPS
  - 숫자·버전이 서로 다르다(둘 다 있을 때) — ISO 21500 ↔ 15408
  - 글자 비슷도 0.3 미만이고 겹치는 두 글자 묶음이 6개 미만
제목이 키워드뿐인 답안(「FDS」)은 짧아서 비슷도가 낮아도 걸려 있을 수 있다 — 목록을 보고 판단한다.
"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.answers_py import load_answers, load_questions, core, ratio, numbers, apply_ops

CHANGERS = ["보안", "완전", "해결", "유형", "종류", "절차", "비교", "동향", "활용", "사례", "구성", "변환", "장단점", "취약점", "대응", "평가", "설계"]
caps = lambda t: {w for w in re.findall(r"[A-Za-z0-9]+", t) if re.fullmatch(r"[A-Z][A-Z0-9]+", w)}
QB = {q["id"]: q for q in load_questions()}
bad = []
for a in load_answers():
    t = a["question"]
    for qid in a.get("questionIds") or []:
        q = QB.get(qid)
        if not q:
            continue
        b = q["text"]
        why = []
        ka, kb = re.sub(r"[^가-힣]", "", t.split("\n")[0]), re.sub(r"[^가-힣]", "", b.split("\n")[0])
        ch = [w for w in CHANGERS if (w in ka) != (w in kb)]
        if ch and ratio(t, b) < 0.9:
            why.append("낱말 " + "·".join(ch))
        if caps(t) and caps(b) and not (caps(t) <= caps(b) or caps(b) <= caps(t)):
            why.append("약어 다름")
        if numbers(t) and numbers(b) and not (numbers(t) & numbers(b)):
            why.append("숫자 다름")
        x, y = core(t), core(b)
        common = len({x[i:i + 2] for i in range(len(x) - 1)} & {y[i:i + 2] for i in range(len(y) - 1)})
        if ratio(t, b) < 0.3 and common < 6:
            why.append("문구 다름")
        if why:
            bad.append((a["id"], qid, ", ".join(why), t[:45].replace("\n", " "), b[:45].replace("\n", " ")))
for r in bad:
    print(*r, sep=" | ")
print(f"의심 연결 {len(bad)}건")
if "--fix" in sys.argv:
    apply_ops([{"op": "rm-qid", "id": i, "qid": q} for i, q, *_ in bad], False, "audit-answer-links")
