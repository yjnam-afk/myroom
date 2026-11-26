"""오른쪽·아래 여백을 넓게 잡아 다시 편 쪽(nmw/) — 테두리 밖에 적힌 「끝」·첨삭이 잘리는 답안용."""
import cv2, numpy as np, json, sys, os
import rect
from rect import ML, MT, FW, ink
from run_rect import FH
import norm
MRW, MBW = 130, 110
def make(n):
    Q=json.load(open('quads.json')); q=np.array(Q[n],np.float32)
    img=cv2.imread(f'pg/{n}.png')
    dst=np.array([[ML,MT],[ML+FW,MT],[ML+FW,MT+FH],[ML,MT+FH]],np.float32)
    out=cv2.warpPerspective(img,cv2.getPerspectiveTransform(q,dst),(ML+FW+MRW,MT+FH+MBW),flags=cv2.INTER_AREA,borderValue=(255,255,255))
    if n not in ('t3-4','v0-3'):
        F,st,Y=norm.detect(out); out=norm.remap(out,F)
    cv2.imwrite(f'nmw/{n}.png',out); return out
if __name__=='__main__':
    from bundles import B
    names=[n for v in B.values() for n in v if n]
    cut=json.load(open('cut.json')); N=22; P=FH/N
    for n in names:
        if not os.path.exists(f'nmw/{n}.png'): make(n)
    rep=[]
    for key,arr in cut.items():
        for a in arr:
            (p0,r0),(p1,r1)=a['start'],a['end']; right=0; bottom=0
            for p in range(p0,p1+1):
                n=B[key][p-1]
                if not n: continue
                im=cv2.imread(f'nmw/{n}.png'); b=ink(im)>0
                ra=r0 if p==p0 else 0; rb=r1 if p==p1 else N
                y0=int(MT+ra*P); y1=int(MT+rb*P)+(MBW-70 if rb>=N else 0)
                right+=int(b[y0:y1, ML+FW+42:ML+FW+MRW-4].sum())
                if rb>=N:
                    z=b[MT+FH+10:MT+FH+62].copy(); z[:, ML+300:ML+700]=False
                    bottom+=int(z[:, ML:ML+FW+MRW-4].sum())
            rep.append((a['id'],right,bottom))
    for r in rep:
        if r[1]>250 or r[2]>250: print(r)
