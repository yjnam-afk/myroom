#!/usr/bin/env python3
"""
아티팩트 답안지(22줄 괘선 답안지 HTML) → src/data/customSheets.json

사용자가 다른 세션에서 만든 「○○ 답안지」 아티팩트(.page/.gut/.body/.ln/.tr/.c/.rcol 꼴)를
토픽 설명의 답안지 템플릿 자리에 그대로 붙인다(2026-11-11 "교착상태 답안지 템플릿 1교시를 이렇게 변경").

  python3 scripts/import-artifact-sheet.py <index.html> "<교재 토픽 제목>" <1|2> [아티팩트 주소]

- .sheets 안쪽 마크업만 옮긴다. 허용한 태그·속성만 남기고(script·on*·href·외부 주소 없음) 나머지는 버린다.
- 머리글(h1)·부제(p)·검증 줄(.verify)은 글자로 따로 저장한다.
- 이어 쓴 설명 칸은 첫 줄에만 「- 」를 남긴다(one_item) — 그 밖의 글자·그림은 그대로다.
- 화면은 src/components/CustomSheet.tsx + globals.css 의 .csheet 규칙이 그린다.
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "customSheets.json"

TAGS = {
    "div", "section", "span", "b", "br",
    "svg", "defs", "marker", "path", "rect", "ellipse", "circle", "line", "polygon", "polyline", "text", "tspan", "g",
}
VOID = {"br", "path", "rect", "ellipse", "circle", "line", "polygon", "polyline"}
ATTRS = {
    "class", "style", "viewbox", "width", "height", "preserveaspectratio", "font-family", "id", "refx", "refy",
    "markerwidth", "markerheight", "orient", "d", "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "rx", "ry", "r",
    "points", "font-size", "text-anchor", "dominant-baseline", "font-weight", "marker-end", "marker-start",
    "fill", "stroke", "stroke-width", "stroke-dasharray", "transform",
}
# SVG 는 속성 이름의 대소문자를 가린다 — 파서가 소문자로 바꾼 것을 되돌린다
CASE = {"viewbox": "viewBox", "preserveaspectratio": "preserveAspectRatio", "refx": "refX", "refy": "refY",
        "markerwidth": "markerWidth", "markerheight": "markerHeight"}
BAD = re.compile(r"url\s*\(\s*(?!#)|expression|javascript:|@import|behavior", re.I)


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


class Sheet(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.depth = 0          # .sheets 안쪽 깊이(0 = 밖)
        self.skip = 0           # 허용 안 한 태그 안쪽
        self.cap: str | None = None
        self.text = {"h1": "", "sub": "", "verify": ""}
        self.in_head = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class") or ""
        if self.depth == 0:
            if tag == "div" and "sheets" in cls.split():
                self.depth = 1
            elif tag == "div" and "head" in cls.split():
                self.in_head = True
            elif tag == "h1" and self.in_head:
                self.cap = "h1"
            elif tag == "p" and self.in_head:
                self.cap = "sub"
            elif tag == "p" and "verify" in cls.split():
                self.cap = "verify"
            return
        if self.skip or tag not in TAGS:
            if tag not in VOID:
                self.skip += 1
            return
        keep = []
        for k, v in attrs:
            if k not in ATTRS or v is None or BAD.search(v):
                continue
            keep.append(f'{CASE.get(k, k)}="{esc(v).replace(chr(34), "&quot;")}"')
        self.out.append(f"<{tag}{' ' if keep else ''}{' '.join(keep)}{'/' if tag in VOID else ''}>")
        if tag not in VOID:
            self.depth += 1

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if self.depth == 0:
            if tag in ("h1", "p"):
                self.cap = None
            if tag == "div":
                self.in_head = False
            return
        if tag in VOID:
            return
        if self.skip:
            self.skip -= 1
            return
        self.depth -= 1
        if self.depth >= 1:
            self.out.append(f"</{tag}>")

    def handle_data(self, data):
        if self.depth == 0:
            if self.cap:
                self.text[self.cap] += data
            return
        if not self.skip:
            self.out.append(esc(data).replace(" ", "&nbsp;"))


def one_item(html: str) -> tuple[str, int]:
    """
    이어 쓴 설명 칸은 첫 줄에만 「- 」를 둔다(2026-11-11 "중간에 하이픈 필요없지 않나?").
    아티팩트는 한 문장을 칸 너비에 맞춰 줄바꿈하면서 줄 중간에 「- 」를 또 붙인다
    (「- 할당 자원 / 사용 완료 후 / - 스스로 반환 / 전 회수 불가」) — 두 항목처럼 읽힌다.
    들여 쓴 이어지는 줄이 있는 칸은 한 문장이므로 둘째부터의 「- 」를 들여쓰기로 바꾼다.
    줄마다 「- 」로 시작하는 칸(이름 목록)은 그대로 둔다.
    """
    n = 0

    def fix(m: re.Match) -> str:
        nonlocal n
        lines = m.group(2).split("<br/>")
        hy = [i for i, l in enumerate(lines) if l.startswith("- ")]
        if len(hy) < 2 or not any(l.startswith("&nbsp;") for l in lines):
            return m.group(0)
        for i in hy[1:]:
            lines[i] = "&nbsp;&nbsp;" + lines[i][2:]
        n += 1
        return m.group(1) + "<br/>".join(lines) + "</div>"

    return re.sub(r'(<div class="c ">)((?:(?!<div|</div>).)*)</div>', fix, html, flags=re.S), n


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    src, title, period = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
    if period not in ("1", "2"):
        sys.exit("교시는 1 또는 2")
    p = Sheet()
    p.feed(src.read_text(encoding="utf-8"))
    html = "".join(p.out).strip()
    html, merged = one_item(html)
    pages = html.count('class="page"')
    if not pages:
        sys.exit("답안지 쪽(.page)을 찾지 못했다 — 아티팩트 꼴이 다른가?")
    data = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
    data.setdefault(title, {})[period] = {
        "title": p.text["h1"].strip(),
        "sub": p.text["sub"].strip(),
        "verify": re.sub(r"\s+", " ", p.text["verify"]).strip(),
        "pages": pages,
        "source": sys.argv[4] if len(sys.argv) > 4 else "",
        "html": html,
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{title} · {period}교시형 — {pages}쪽, {len(html):,}자 → {OUT.relative_to(ROOT)}")
    print("  머리:", p.text["h1"].strip(), "|", p.text["sub"].strip())
    print(f"  이어 쓴 설명 칸 {merged}개 — 줄 중간 하이픈을 뺐다")


if __name__ == "__main__":
    main()
