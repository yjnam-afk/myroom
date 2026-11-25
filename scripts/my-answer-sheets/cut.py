"""묶음별 자를 자리(쪽·줄)대로 nm/ 쪽을 잘라 한 답안 = 한 장으로 잇는다."""
import cv2, numpy as np, sys, json, os
from rect import *
from run_rect import FH
from bundles import B
N=22; P=FH/N
X0,X1=14,ML+FW+MR-10          # 왼쪽 여백(빨간 첨삭) 포함
# (id, 시작 쪽, 시작 줄)  — 줄은 점수가 윗줄에 있으면 그 줄
SPEC={
 'db2': [('a-00',1,0),('a-01',4,7),('a-02',7,7),('a-03',10,12)],
 'db1': [('b-01',1,0),('b-02',2,12),('b-03',4,0),('b-04',5,8),('b-05',6,18),('b-06',8,7),('b-07',9,20),('b-08',11,7),('b-09',12,19),('b-10',13,19)],
 'sw2': [('c-01',1,0),('c-02',4,5),('c-03',7,4),('c-04',10,4)],
 'nw1': [('d-01',1,0),('d-02',2,19),('d-03',4,7),('d-04',5,13),('d-05',7,0),('d-06',8,12),('d-07',10,0),('d-08',11,7),('d-09',12,11),('d-10',13,18)],
 'nw2': [('e-01',1,0),('e-02',4,8),('e-03',7,11),('e-04',10,13)],
 'sw1': [('f-01',2,0),('f-02',2,9),('f-03',3,13),('f-04',4,20),('f-05',6,6),('f-06',7,15),('f-07',9,4),('f-08',10,11),('f-09',11,19),('f-10',14,0)],
 'caos2':[('g-01',1,0),('g-02',4,0),('g-03',7,11),('g-04',10,11)],
 'ai2': [('h-01',1,0),('h-02',4,9),('h-03',8,0),('h-04',11,0)],
 'ai1': [('i-01',1,0),('i-02',2,7),('i-03',3,20),('i-04',5,9),('i-05',7,0),('i-06',8,13),('i-07',9,19),('i-08',11,9),('i-09',12,15),('i-10',13,20)],
 'caos1':[('j-01',1,0),('j-02',2,13),('j-03',4,13),('j-04',6,0),('j-05',7,6),('j-xx',8,21)],
}
YOVR={('b-09','end'):1468,('b-10','start'):1466,('b-07','end'):562,('b-08','start'):560,('h-03','start'):14,('h-04','start'):14,('j-02','end'):872,('j-03','start'):950,('j-05','end'):1562,('b-06','end'):1392,('b-07','start'):1388}
STOP={'sw1':{'f-09':(12,22)}}      # 이 쪽·줄에서 끝(13쪽이 없어 14쪽을 붙이지 않는다)
_cache={}
def flat(n):
    if n in _cache: return _cache[n]
    im=cv2.imread(f'nm/{n}.png').astype(np.float32)
    sm=cv2.resize(im,None,fx=0.25,fy=0.25,interpolation=cv2.INTER_AREA).astype(np.uint8)
    bg=cv2.medianBlur(sm,31); bg=cv2.GaussianBlur(bg,(0,0),6)
    bg=cv2.resize(bg,(im.shape[1],im.shape[0]),interpolation=cv2.INTER_LINEAR).astype(np.float32)
    out=im/np.maximum(bg,70)*248
    out=np.clip((out-40)*(255/(255-40)),0,255)        # 글씨를 조금 진하게
    out=out.astype(np.uint8); _cache[n]=out; return out
def row_ink(im,r):
    y0=int(MT+r*P+11); y1=int(MT+(r+1)*P-9)
    c=im[y0:y1, ML+112:ML+FW-10].astype(int)
    b,g,rr=c[:,:,0],c[:,:,1],c[:,:,2]
    red=((rr-np.minimum(b,g))>50).sum()
    dark=((c.max(axis=2)<135)).sum()
    return int(dark),int(red)
def seg(n,r0,r1,first,last,aid=None):
    im=flat(n)
    y0=int(MT+r0*P)-(8 if r0==0 else 4)
    y1=int(MT+r1*P)+(8 if r1>=N else 4)
    if first and (aid,'start') in YOVR: y0=YOVR[(aid,'start')]
    if last and (aid,'end') in YOVR: y1=YOVR[(aid,'end')]
    return im[y0:y1, X0:X1]
def build(key):
    pages=B[key]; spec=SPEC[key]; res=[]
    for k,(aid,p0,r0) in enumerate(spec):
        if aid.endswith('xx'): continue
        if key in STOP and aid in STOP[key]: p1,r1=STOP[key][aid]
        elif k+1<len(spec): p1,r1=spec[k+1][1],spec[k+1][2]
        else: p1,r1=len(pages),N
        if r1==0: p1-=1; r1=N
        # 뒤쪽 빈 줄 덜기
        while True:
            n=pages[p1-1]
            if n is None: p1-=1; r1=N; continue
            d,rd=row_ink(flat(n),r1-1)
            if d<160 and rd<70 and (p1,r1)>(p0,r0+1):
                r1-=1
                if r1==0: p1-=1; r1=N
                continue
            break
        parts=[]; missing=[]
        for p in range(p0,p1+1):
            n=pages[p-1]
            if n is None: missing.append(p); continue
            a=r0 if p==p0 else 0; b=r1 if p==p1 else N
            parts.append(seg(n,a,b,p==p0,p==p1,aid))
        W=parts[0].shape[1]
        img=np.vstack(parts)
        img=cv2.resize(img,(1000,int(round(img.shape[0]*1000/W))),interpolation=cv2.INTER_AREA)
        cv2.imwrite(f'out/ns19ans-{aid}.webp',img,[cv2.IMWRITE_WEBP_QUALITY,78])
        res.append(dict(id=aid,start=[p0,r0],end=[p1,r1],missing=missing,h=img.shape[0],kb=os.path.getsize(f'out/ns19ans-{aid}.webp')//1024))
        print(res[-1])
    return res
if __name__=='__main__':
    allr={}
    for key in (sys.argv[1:] or SPEC): allr[key]=build(key)
    old=json.load(open('cut.json')) if os.path.exists('cut.json') else {}
    old.update(allr); json.dump(old,open('cut.json','w'),ensure_ascii=False,indent=1)
