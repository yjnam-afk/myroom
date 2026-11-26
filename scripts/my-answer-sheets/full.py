"""원본 쪽을 여백 끝까지 넣어 다시 자른다(out2/) — 테두리 밖 위·아래·왼쪽·오른쪽에 적힌 첨삭이 잘리지 않게.

2026-11-27 "어디어디 짤렸나 알려줘": cut.py 는 테두리 밖을 왼쪽 106 · 오른쪽 118 · 위 8 · 아래 30px 만 남겼다.
원본 쪽의 여백은 그보다 넓고(왼 ~215 · 오 ~255 · 위 ~120 · 아래 ~150) 거기에 빨간 첨삭·점수가 적힌 쪽이 40쪽 남짓이었다.
여기서는 ① 가로는 모든 쪽 원본이 다 들어가는 고정 너비, ② 세로는 쪽마다 원본이 닿는 데까지, ③ 뒤쪽 빈 줄도 덜지 않는다.
그래서 답안지 쪽의 모든 화소가 어느 한 답안 그림에 들어간다(빠지는 것은 bundles.py 에 None 으로 적힌 「스캔에 없는 쪽」뿐).

  cd <작업 폴더(pg/ quads.json 이 있는 곳)> && python3 <이 파일> [묶음 …]
"""
import cv2, numpy as np, json, sys, os
from rect import ML, MT, FW
from run_rect import FH
import norm
from bundles import B
from cut import SPEC, STOP, YOVR
N = 22; P = FH / N
BL, BT, BR, BB = 220, 290, 260, 190          # 큰 판의 여백(테두리 밖) — 원본 여백의 최대보다 넓다
MRW, MBW = 130, 110                          # 줄 찾기는 wide.py 와 같은 판에서 한다(줄 맞춤이 그대로 유지된다)
SCALE = 1070 / (ML - 14 + FW + 118)          # 예전 그림과 같은 글씨 크기
GAPLESS = {'j-03': YOVR[('j-02', 'end')]}     # 앞 답안 끝과 사이에 빈 줄 하나가 떠 있던 자리 — 붙여서 빈틈을 없앤다
NOREMAP = ('t3-4', 'v0-3')                   # 크게 휜 사진 — 줄 맞춤 없이 픽셀로 자른다
Q = json.load(open('quads.json'))
_c = {}

def page(n):
    """(여백 끝까지 편 쪽, 원본이 닿는 위·아래 y)"""
    if n in _c: return _c[n]
    img = cv2.imread(f'pg/{n}.png'); q = np.array(Q[n], np.float32)
    std = np.array([[ML, MT], [ML + FW, MT], [ML + FW, MT + FH], [ML, MT + FH]], np.float32)
    big = np.array([[BL, BT], [BL + FW, BT], [BL + FW, BT + FH], [BL, BT + FH]], np.float32)
    size = (BL + FW + BR, BT + FH + BB)
    M = cv2.getPerspectiveTransform(q, big)
    out = cv2.warpPerspective(img, M, size, flags=cv2.INTER_AREA, borderValue=(255, 255, 255))
    mask = cv2.warpPerspective(np.full(img.shape[:2], 255, np.uint8), M, size, borderValue=0)
    if n not in NOREMAP:
        s = cv2.warpPerspective(img, cv2.getPerspectiveTransform(q, std), (ML + FW + MRW, MT + FH + MBW), flags=cv2.INTER_AREA, borderValue=(255, 255, 255))
        F, _, _ = norm.detect(s)
        H, W = out.shape[:2]
        xs = np.clip(np.arange(W, dtype=np.float32) - (BL - ML), ML - 120, ML + FW + 130)   # 테두리 밖은 가장자리 값으로
        L = np.array([np.polyval(F[i], xs) for i in range(N + 1)], np.float32) + (BT - MT)
        my = np.zeros((H, W), np.float32)
        for yt in range(H):
            t = (yt - BT) / P
            if t <= 0: my[yt] = L[0] + (yt - BT)
            elif t >= N: my[yt] = L[N] + (yt - BT - FH)
            else:
                i = int(t); f = t - i; my[yt] = L[i] * (1 - f) + L[i + 1] * f
        mx = np.tile(np.arange(W, dtype=np.float32), (H, 1))
        out = cv2.remap(out, mx, my, cv2.INTER_LINEAR, borderValue=(255, 255, 255))
        mask = cv2.remap(mask, mx, my, cv2.INTER_NEAREST, borderValue=0)
    rows = np.where((mask > 0).any(axis=1))[0]
    cols = np.where((mask > 0).any(axis=0))[0]
    # 배경 고르게(종이 그늘) — 인쇄 글자는 지우지 않는다(첨삭이 겹쳐 적혀 있다)
    im = out.astype(np.float32)
    sm = cv2.resize(im, None, fx=0.25, fy=0.25, interpolation=cv2.INTER_AREA).astype(np.uint8)
    bg = cv2.GaussianBlur(cv2.medianBlur(sm, 31), (0, 0), 6)
    bg = cv2.resize(bg, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_LINEAR).astype(np.float32)
    im = np.clip((im / np.maximum(bg, 70) * 248 - 40) * (255 / 215), 0, 255).astype(np.uint8)
    im[mask == 0] = 255
    _c[n] = (im, int(rows[0]), int(rows[-1]) + 1, int(cols[0]), int(cols[-1]) + 1)
    return _c[n]

def build(key, outdir='out2'):
    pages = B[key]; spec = [s for s in SPEC[key] if not s[0].endswith('xx')]; res = []
    for k, (aid, p0, r0) in enumerate(spec):
        if key in STOP and aid in STOP[key]: p1, r1 = STOP[key][aid]
        elif k + 1 < len(spec): p1, r1 = spec[k + 1][1], spec[k + 1][2]
        else: p1, r1 = len(pages), N
        if r1 == 0: p1 -= 1; r1 = N
        while pages[p1 - 1] is None: p1 -= 1; r1 = N
        parts = []; missing = []; used = []
        for p in range(p0, p1 + 1):
            n = pages[p - 1]
            if n is None: missing.append(p); continue
            im, top, bot, lft, rgt = page(n)
            a = r0 if p == p0 else 0; b = r1 if p == p1 else N
            y0 = top if a == 0 else int(BT + a * P) - 4
            y1 = bot if b >= N else int(BT + b * P) + 4
            if p == p0 and a > 0 and (aid, 'start') in YOVR: y0 = GAPLESS.get(aid, YOVR[(aid, 'start')]) + (BT - MT)
            if p == p1 and b < N and (aid, 'end') in YOVR: y1 = YOVR[(aid, 'end')] + (BT - MT)
            parts.append(im[y0:y1]); used.append((p, n, y0, y1, top, bot, lft, rgt))
        img = np.vstack(parts)
        img = cv2.resize(img, (int(round(img.shape[1] * SCALE)), int(round(img.shape[0] * SCALE))), interpolation=cv2.INTER_AREA)
        os.makedirs(outdir, exist_ok=True)
        cv2.imwrite(f'{outdir}/ns19ans-{aid}.webp', img, [cv2.IMWRITE_WEBP_QUALITY, 78])
        res.append(dict(id=aid, start=[p0, r0], end=[p1, r1], missing=missing, w=img.shape[1], h=img.shape[0], kb=os.path.getsize(f'{outdir}/ns19ans-{aid}.webp') // 1024, used=used))
        print(aid, [p0, r0], [p1, r1], missing, img.shape[1], img.shape[0], res[-1]['kb'], 'KB')
    return res

if __name__ == '__main__':
    allr = {}
    for key in (sys.argv[1:] or SPEC): allr[key] = build(key)
    old = json.load(open('cut2.json')) if os.path.exists('cut2.json') else {}
    old.update(allr); json.dump(old, open('cut2.json', 'w'), ensure_ascii=False, indent=1)
