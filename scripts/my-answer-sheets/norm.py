"""펴 놓은 쪽(rc/)의 괘선 23줄을 찾아 줄 간격이 똑같아지게 세로로 다시 편다 → nm/"""
import cv2, numpy as np, sys, json, os, glob
from rect import *
from run_rect import FH
N=22; P=FH/N; K=10
def lines_band(g, x0, x1, W=22, lam=0.004):
    band=g[:, x0:x1]
    p=(band<205).mean(axis=1).astype(np.float32)
    p=np.convolve(p,np.ones(3)/3,mode='same')
    cand=[np.arange(int(MT+i*P)-W,int(MT+i*P)+W+1) for i in range(N+1)]
    score=[p[c].copy() for c in cand]
    back=[]
    for i in range(1,N+1):
        d=cand[i][:,None]-cand[i-1][None,:]-P
        tot=score[i-1][None,:]-lam*d*d
        j=tot.argmax(axis=1); back.append(j)
        score[i]=score[i]+tot[np.arange(len(j)),j]
    k=int(score[N].argmax()); ys=[0]*(N+1); st=[0]*(N+1)
    for i in range(N,-1,-1):
        ys[i]=int(cand[i][k]); st[i]=float(p[ys[i]])
        if i>0: k=int(back[i-1][k])
    return np.array(ys,np.float32), np.array(st,np.float32)
def detect(im, W=22, lam=0.004):
    g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
    xs=np.linspace(ML+110,ML+FW-12,K+1).astype(int)
    Y=[];S=[];C=[]
    for a,b in zip(xs[:-1],xs[1:]):
        y,s=lines_band(g,a,b,W,lam); Y.append(y); S.append(s); C.append((a+b)/2)
    Y=np.array(Y); S=np.array(S); C=np.array(C)      # K x 23
    # 줄마다 x 에 대한 2차식(약한 띠는 가중 낮게)으로 다듬는다
    F=np.zeros((N+1,3))
    for i in range(N+1):
        w=np.clip(S[:,i],0.02,None); y=Y[:,i]
        for _ in range(3):
            co=np.polyfit(C,y,2,w=w); r=np.abs(np.polyval(co,C)-y)
            w=np.where(r>4,w*0.2,w)
        F[i]=co
    return F, float(S.mean()), Y
def remap(im,F):
    H,W=im.shape[:2]
    xx=np.arange(W,dtype=np.float32)
    L=np.array([np.polyval(F[i],xx) for i in range(N+1)],dtype=np.float32)   # 23 x W
    my=np.zeros((H,W),np.float32)
    for yt in range(H):
        t=(yt-MT)/P
        if t<=0: my[yt]=L[0]+(yt-MT)
        elif t>=N: my[yt]=L[N]+(yt-MT-FH)
        else:
            i=int(t); f=t-i; my[yt]=L[i]*(1-f)+L[i+1]*f
    mx=np.tile(xx,(H,1))
    return cv2.remap(im,mx,my,cv2.INTER_LINEAR,borderValue=(255,255,255))
WIDE={'t3-4':50,'v0-3':45}
if __name__=='__main__':
    names=sys.argv[1:] or sorted(os.path.basename(f)[:-4] for f in glob.glob('rc/*.png'))
    rep={}
    for n in names:
        im=cv2.imread(f'rc/{n}.png'); F,st,Y=detect(im)
        if n in WIDE: F,st,Y=detect(im,WIDE[n],0.008)
        grid=MT+np.arange(N+1)*P
        mid=np.array([np.polyval(F[i],ML+FW/2) for i in range(N+1)])
        dev=float(np.abs(mid-grid).max())
        gaps=np.diff(mid)
        out=remap(im,F); cv2.imwrite(f'nm/{n}.png',out)
        F2,st2,_=detect(out); mid2=np.array([np.polyval(F2[i],ML+FW/2) for i in range(N+1)])
        res=float(np.abs(mid2-grid).max())
        rep[n]=dict(st=round(st,3),dev=round(dev,1),gmin=round(float(gaps.min()),1),gmax=round(float(gaps.max()),1),res=round(res,1))
        print(n,rep[n], '<<<' if (st<0.25 or gaps.min()<62 or gaps.max()>80 or res>3) else '')
    json.dump(rep,open('norm.json','w'))
