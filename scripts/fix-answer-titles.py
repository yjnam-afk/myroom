"""모범답안 제목 바로잡기 (2026-11-01 — "니가 모범답안 제목을 잘못 올린 경우가 상당히 많다").

  python3 scripts/fix-answer-titles.py [--dry]

두 가지를 고친다. 고친 목록은 apply 전에 화면에 찍힌다 — 훑어보고 이상하면 --dry 로 돌려 ops 파일을 손본다.
 1) OCR 로 깨진 제목(「7} SH! 2] S(Chameleon) 바이러스」): 문제은행 낱말 사전에 없는 영문 낱말이 둘 이상이거나 깨진 기호가 있으면 깨진 것으로 본다.
    비슷한 문제은행 문항(비슷도 0.45 이상, 1교시↔논술 구분, 숫자 같음)이 있으면 그 원문으로 바꾸고 questionIds 를 단다.
    0.45 미만은 「확인 필요」로만 찍는다(사람이 그림을 보고 정한다).
 2) 키워드만 적힌 제목(「동적SQL 개념, 장단점」): questionIds 가 한 문항(같은 문구)만 가리키고, 제목 글자가 그 문항 머리의 60% 이상이면 원문으로.
"""
import collections, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib.answers_py import load_answers, load_questions, core, numbers, Index, apply_ops

DRY = "--dry" in sys.argv
A = load_answers()
Q = load_questions()
QB = {q["id"]: q for q in Q}
vocab = collections.Counter(w.lower() for q in Q for w in re.findall(r"[A-Za-z]{2,}", q["text"]))


def garbled(t):
    s = t[:200]
    unk = [w for w in re.findall(r"[A-Za-z]{2,}", s) if vocab[w.lower()] == 0]
    sym = len(re.findall(r"[|£°¢{}§¶«»¬]|\d\}|\d\||(?<=[가-힣])\d{3,}(?=[가-힣])", s))
    return len(unk) >= 2 or sym >= 1 or (len(unk) >= 1 and re.search(r"[가-힣][A-Z]{2,}[가-힣]", s))


idx = Index(Q)
ops, review = [], []
for a in A:
    if not garbled(a["question"]):
        continue
    best = (0, None)
    for q, r in idx.candidates(a["question"]):
        if a.get("period") in ("1교시", "2교시", "3교시", "4교시") and (a["period"] == "1교시") != (q["period"] == "1교시"):
            continue
        if r > best[0]:
            best = (r, q)
    r, q = best
    if not q:
        continue
    na, nb = numbers(a["question"]), numbers(q["text"])
    if r < 0.45 or (na and nb and not na & nb):
        review.append((round(r, 2), a["id"], a["question"][:50], q["text"][:50]))
        continue
    if not q["text"].lstrip().startswith("가.") and a["question"] != q["text"].strip():
        ops.append({"op": "set", "id": a["id"], "field": "question", "value": q["text"].strip()})
    if q["id"] not in (a.get("questionIds") or []):
        ops.append({"op": "add-qid", "id": a["id"], "qid": q["id"]})


def head_core(t):
    return re.sub(r"(에)?(대(해|하여)|관(해|하여))?(다음(을|에)?(대해|대하여)?)?(설명|기술|논|서술)(하)?시오$", "", re.sub(r"[^0-9a-z가-힣]", "", t.split("\n")[0].lower()))


for a in A:
    t = a["question"]
    ids = a.get("questionIds") or []
    if "시오" in t or "?" in t or len(t) >= 40 or "\n" in t or not ids:
        continue
    texts = {core(QB[i]["text"]) for i in ids if i in QB}
    if len(texts) != 1:
        continue
    b = QB[ids[0]]["text"]
    if b.lstrip().startswith("가."):
        continue
    junk = re.search(r"기술사\s*$|\[시|\(\d\)\s*$", t)  # OCR 꼬리(「…정보관리기술사」「[시」)·「(1)」 같은 판 번호
    x, y = head_core(re.sub(r"(정보관리|컴퓨터시스템응용|정보처리)기술사\s*$", "", t)), head_core(b)
    lat_t = {w.lower() for w in re.findall(r"[A-Za-z]{2,}", t)}
    lat_b = {w.lower() for w in re.findall(r"[A-Za-z]{2,}", b)}
    # 원문이 제목보다 짧거나(「빅데이터 분석 플랫폼이 추구하는 …」 → 「데이터 통합 아키텍처」), 제목의 영문·숫자를 잃으면(DID, Hilbert, 4가지) 바꾸지 않는다
    if not junk and (len(y) < len(x) or not lat_t <= lat_b or not numbers(t) <= numbers(b)):
        continue
    # 제목의 한글 낱말이 원문에 거의 다 있어야 한다 — 「트랜잭션 개념, ACID, 고립성레벨」 ≠ 「… ACID 특성, 직렬성」
    kt, kb = re.sub(r"[^가-힣]", "", x), re.sub(r"[^가-힣]", "", y)
    bg = {kt[i:i + 2] for i in range(len(kt) - 1)}
    if bg and len(bg & {kb[i:i + 2] for i in range(len(kb) - 1)}) / len(bg) < 0.75:
        continue
    if x and x != y and len(x) / max(1, len(y)) >= 0.6:
        ops.append({"op": "set", "id": a["id"], "field": "question", "value": b.strip()})

for o in ops:
    if o["op"] == "set":
        print("제목 |", next(a["question"] for a in A if a["id"] == o["id"])[:40].replace("\n", " "), "→", o["value"][:50].replace("\n", " "))
print(f"\n확인 필요(비슷한 문항이 없거나 숫자가 다름) {len(review)}건")
for r in review:
    print(" ", *r)
apply_ops(ops, DRY, "fix-answer-titles")
