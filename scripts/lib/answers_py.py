"""파이썬 연결·검수 스크립트 공용 — 답안·문제은행 읽기, 문구 정규화, 글자 3-gram 후보 찾기, 고침(ops) 적용.

답안은 직접 쓰지 않는다. ops 를 만들어 `npx tsx scripts/answers.ts apply <ops.json>` 로 넣는다(검사를 거친다).
문구 정규화는 src/lib/questionText.ts 의 questionCore 와 같은 규칙이다(파이썬 판).
"""
import collections, difflib, glob, json, os, re, subprocess, tempfile

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")


def load_answers():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, "src/data/peerAnswers/[0-9]*.json"))):
        out += json.load(open(f))
    return out


def load_questions():
    return json.load(open(os.path.join(ROOT, "src/data/questions.json")))


TAIL = re.compile(r"(에)?(대(해|하여)|관(해|하여))?(다음(을|에)?(대해|대하여)?)?(설명|기술|논|서술|답)(하)?시오$")


def core(s):
    """questionText.questionCore 와 같은 알맹이 — 번호·기호·「…설명하시오」 꼬리 제거"""
    s = (s or "").lower()
    s = re.sub(r"^\s*\d+\s*[.)]\s*", "", s)
    s = re.sub(r"[^0-9a-z가-힣]", "", s)
    return TAIL.sub("", s)


def ratio(a, b, n=150):
    return difflib.SequenceMatcher(None, core(a)[:n], core(b)[:n]).ratio()


def numbers(t):
    """숫자·버전 낱말(머리 번호 제외) — ISO 21500 ≠ 15408, PaaS-TA 3.0 ≠ 5.0 를 가르는 데 쓴다"""
    return set(re.findall(r"\d+(?:\.\d+)?", re.sub(r"^\s*\d+\s*[.)]?\s", "", t or "")))


class Index:
    """문제은행 문구의 글자 3-gram 역색인 — 비슷한 문항 후보를 빨리 찾는다"""

    def __init__(self, questions, limit=500):
        self.qs = questions
        self.cores = [core(q["text"]) for q in questions]
        self.inv = collections.defaultdict(set)
        self.limit = limit
        for i, t in enumerate(self.cores):
            for k in range(len(t[:150]) - 2):
                self.inv[t[k:k + 3]].add(i)

    def candidates(self, text, top=10):
        x = core(text)
        sc = collections.Counter()
        for g in {x[k:k + 3] for k in range(len(x[:150]) - 2)}:
            s = self.inv.get(g)
            if s and len(s) < self.limit:
                for i in s:
                    sc[i] += 1
        return [(self.qs[i], difflib.SequenceMatcher(None, x[:150], self.cores[i][:150]).ratio()) for i, _ in sc.most_common(top)]


def apply_ops(ops, dry=False, label="ops"):
    """ops 를 answers.ts apply 로 넣는다. dry 면 파일만 남긴다."""
    path = os.path.join(tempfile.gettempdir(), f"{label}.json")
    json.dump(ops, open(path, "w"), ensure_ascii=False, indent=1)
    print(f"고침 {len(ops)}건 → {path}")
    if dry or not ops:
        return
    subprocess.run(["npx", "tsx", "scripts/answers.ts", "apply", path], cwd=ROOT, check=True)
