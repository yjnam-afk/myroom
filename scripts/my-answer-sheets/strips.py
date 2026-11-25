import cv2, numpy as np, sys
from rect import *
from run_rect import FH
from bundles import B
N=22; P=FH/N
def tile(n, pno, x0, x1, TW):
    im=cv2.imread(f'nm/{n}.png')
    for i in range(N):
        y=int(MT+i*P)
        cv2.line(im,(x0,y),(x0+26,y),(0,170,0),3)
        cv2.putText(im,str(i),(x0+2,y+int(P*0.7)),cv2.FONT_HERSHEY_SIMPLEX,1.25,(255,0,0),3)
    c=im[30:MT+FH+60, x0:x1]
    t=cv2.resize(c,(TW,int(c.shape[0]*TW/c.shape[1])),interpolation=cv2.INTER_AREA)
    cv2.rectangle(t,(TW-92,0),(TW,22),(160,60,0),-1); cv2.putText(t,f'p{pno} {n}',(TW-90,17),cv2.FONT_HERSHEY_SIMPLEX,0.5,(255,255,255),1)
    return t
def sheet(key, full, per):
    x0,x1=(ML-95,ML+FW+MR) if full else (ML-95,ML+470)
    TW=2000//per
    ts=[tile(n,i+1,x0,x1,TW) for i,n in enumerate(B[key]) if n]
    for k in range(0,len(ts),per):
        g=ts[k:k+per]; H=max(t.shape[0] for t in g); sh=np.full((H,TW*len(g),3),255,np.uint8)
        for j,t in enumerate(g): sh[:t.shape[0],j*TW:(j+1)*TW]=t
        cv2.imwrite(f'st-{key}-{k//per}.png',sh); print(f'st-{key}-{k//per}.png',sh.shape)
if __name__=='__main__':
    key=sys.argv[1]; sheet(key, sys.argv[2]=='full', int(sys.argv[3]))
