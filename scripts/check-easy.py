# "쉽게 이해하기" 쪽집게 규격 검사기 — hook·scene·map 품질 점검
# 사용: python3 scripts/check-easy.py g01 g02 …   |   python3 scripts/check-easy.py extras
import re, sys, os

ROOT = os.path.join(os.path.dirname(__file__), "..")
JARGON = re.compile(
    r"(동적으로|정적으로|기반으로|수행한다|제공한다|관리한다|최적화|아키텍처|프레임워크|"
    r"메커니즘|프로토콜|인터페이스|모듈|컴포넌트|알고리즘|파라미터|방법론|표준화|추상화)"
)
ANALOGY = re.compile(r"(처럼|같이|같은|마치|생각하면|치면| 셈|비유|~라고 보면|딱 이)")
strip_paren = lambda s: re.sub(r"[(（][^)）]*[)）]", "", s)
klen = lambda s: len(re.sub(r"\s", "", s))


def check_entry(key, hook, scene, as_list):
    errs = []
    if hook:
        if klen(hook) > 60:
            errs.append(f"hook {klen(hook)}자(60 초과)")
        if JARGON.search(strip_paren(hook)):
            errs.append("hook에 전문용어")
    if scene:
        bare = strip_paren(scene)
        if not ANALOGY.search(scene):
            errs.append("scene에 비유 연결어 없음")
        if JARGON.search(bare):
            errs.append(f"scene 전문용어: {JARGON.search(bare).group(1)}")
        n = klen(scene)
        if n < 60 or n > 220:
            errs.append(f"scene {n}자(80~200 권장, 60~220 허용)")
        if scene.count("다.") + scene.count("다 —") > 4:
            errs.append("scene 문장 과다(3문장 이내)")
    for a in as_list:
        bare = strip_paren(a)
        if re.search(r"[A-Za-z]{3,}", bare) or JARGON.search(bare):
            errs.append(f"map.as에 용어/영문: {a[:20]}")
            break
    return errs


def parse_ts_guides(txt):
    """청크 파일에서 (key, hook, scene, [as…]) 를 뽑는다."""
    out = []
    # 엔트리 경계: "key": { … } — hook 필드가 있는 블록만
    for m in re.finditer(r'"([^"]+)":\s*\{\s*\n\s*hook:', txt):
        key = m.group(1)
        start = m.start()
        # 다음 엔트리 시작 또는 파일 끝까지
        nxt = re.search(r'\n  "[^"]+":\s*\{\s*\n\s*hook:', txt[m.end():])
        end = m.end() + (nxt.start() if nxt else len(txt) - m.end())
        seg = txt[start:end]
        hook = (re.search(r'hook:\s*"([^"]*)"', seg) or [None, ""])[1]
        scene = (re.search(r'scene:\s*"([^"]*)"', seg) or [None, ""])[1]
        as_list = re.findall(r'\{\s*as:\s*"([^"]*)"', seg)
        out.append((key, hook, scene, as_list))
    return out


def parse_extras(txt):
    out = []
    for m in re.finditer(r'"([^"]+)":\s*\{\s*\n\s*guide:\s*\{', txt):
        key = m.group(1)
        nxt = re.search(r'\n  "[^"]+":\s*\{', txt[m.end():])
        end = m.end() + (nxt.start() if nxt else len(txt) - m.end())
        seg = txt[m.start():end]
        hook = (re.search(r'hook:\s*"([^"]*)"', seg) or [None, ""])[1]
        scene = (re.search(r'scene:\s*"([^"]*)"', seg) or [None, ""])[1]
        as_list = re.findall(r'\{\s*as:\s*"([^"]*)"', seg)
        out.append((key, hook, scene, as_list))
    return out


targets = sys.argv[1:] or ["g%02d" % i for i in range(1, 36)]
bad = tot = 0
for t in targets:
    if t == "extras":
        path = os.path.join(ROOT, "src/data/subnoteExtras.ts")
        entries = parse_extras(open(path, encoding="utf-8").read())
    else:
        path = os.path.join(ROOT, f"src/data/topicGuides/{t}.ts")
        entries = parse_ts_guides(open(path, encoding="utf-8").read())
    for key, hook, scene, as_list in entries:
        tot += 1
        errs = check_entry(key, hook, scene, as_list)
        if errs:
            bad += 1
            print(f"[{t}] {key}: " + " | ".join(errs))
print(f"\n{tot}건 중 위반 {bad}건")
print("PASS" if bad == 0 else "FAIL")
sys.exit(0 if bad == 0 else 1)
