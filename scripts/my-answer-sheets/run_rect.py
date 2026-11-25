import cv2, numpy as np, sys, json, os, glob
from rect import *
ASPECT=1.557
FH=int(round(FW*ASPECT))
def pages():
    return sorted(os.path.basename(f)[:-4] for f in glob.glob('pg/*.png') if not os.path.basename(f).startswith('t1-') and os.path.basename(f)!='s3-2.png')
def warp(img,q):
    dst=np.array([[ML,MT],[ML+FW,MT],[ML+FW,MT+FH],[ML,MT+FH]],dtype=np.float32)
    return cv2.warpPerspective(img,cv2.getPerspectiveTransform(q.astype(np.float32),dst),(ML+FW+MR,MT+FH+MB),flags=cv2.INTER_AREA,borderValue=(255,255,255))
def edge_score(out):
    b=ink(out); sc=[]
    segs=[((ML,MT),(ML+FW,MT)),((ML+FW,MT),(ML+FW,MT+FH)),((ML+FW,MT+FH),(ML,MT+FH)),((ML,MT+FH),(ML,MT))]
    for (x0,y0),(x1,y1) in segs:
        hit=0; n=0
        for t in np.linspace(0.03,0.97,120):
            x=int(x0+(x1-x0)*t); y=int(y0+(y1-y0)*t); n+=1
            if b[max(0,y-5):y+6,max(0,x-5):x+6].any(): hit+=1
        sc.append(round(hit/n,2))
    return sc
if __name__=='__main__':
    ov=json.load(open('quad_override.json')) if os.path.exists('quad_override.json') else {}
    only=sys.argv[1:] or pages()
    Q=json.load(open('quads.json')) if os.path.exists('quads.json') else {}
    for n in only:
        img=cv2.imread(f'pg/{n}.png'); b=ink(img)
        if n in ov: q=np.array(ov[n],dtype=np.float32); q=refine(b,q,14)
        else:
            q=quad0(b); q=refine(b,q,45,True); q=refine(b,q,12)
        out=warp(img,q); cv2.imwrite(f'rc/{n}.png',out)
        sc=edge_score(out); Q[n]=q.tolist()
        print(n,sc,'<<<' if min(sc)<0.85 else '')
    json.dump(Q,open('quads.json','w'))
