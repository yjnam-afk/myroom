"""답안지 한 쪽에서 인쇄된 바깥 테두리를 찾아 반듯하게 편다."""
import cv2, numpy as np, sys, os, json
FW=1000            # 펴 놓은 테두리 너비
ML,MR,MT,MB=120,50,90,110   # 테두리 밖 여백(왼·오·위·아래)
def ink(img):
    g=img.max(axis=2).copy()     # 빨간 펜은 밝게
    b_,g_,r_=img[:,:,0].astype(int),img[:,:,1].astype(int),img[:,:,2].astype(int)
    g[(r_-np.minimum(b_,g_))>45]=255
    g=cv2.GaussianBlur(g,(5,5),0)
    return cv2.adaptiveThreshold(g,255,cv2.ADAPTIVE_THRESH_MEAN_C,cv2.THRESH_BINARY_INV,51,12)
def quad0(b):
    H,W=b.shape
    k=cv2.getStructuringElement(cv2.MORPH_RECT,(5,5))
    c=cv2.morphologyEx(b,cv2.MORPH_CLOSE,k)
    cs,_=cv2.findContours(c,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    best=None
    for ct in cs:
        x,y,w,h=cv2.boundingRect(ct)
        if w<0.55*W or h<0.45*H: continue
        a=cv2.contourArea(ct)
        if best is None or a>best[0]: best=(a,ct)
    if best is None: return None
    p=best[1].reshape(-1,2).astype(np.float32)
    s=p.sum(1); d=p[:,0]-p[:,1]
    return np.array([p[s.argmin()],p[d.argmax()],p[s.argmax()],p[d.argmin()]])  # tl,tr,br,bl
def refine(b,q,rng=28,outer=False):
    """네 변마다 수직 방향으로 테두리 선을 다시 찾아 직선을 맞춘다."""
    H,W=b.shape
    lines=[]
    for i in range(4):
        a=q[i]; c=q[(i+1)%4]
        v=c-a; L=np.linalg.norm(v); u=v/L; n=np.array([-u[1],u[0]])
        pts=[]
        for t in np.linspace(0.08,0.92,60):
            p=a+u*L*t
            best=None
            offs=range(-rng,rng+1)   # n 은 사각형 안쪽을 향한다 — 작은 값(바깥)부터 훑는다
            for off in offs:
                s=0
                for w in (-4,-2,0,2,4):
                    x,y=(p+n*off+u*w).round().astype(int)
                    if 0<=x<W and 0<=y<H: s+=b[y,x]>0
                if s>=4:
                    if outer: best=off; break
                    if best is None or abs(off)<abs(best): best=off
            if best is not None: pts.append(p+n*best)
        pts=np.array(pts)
        if len(pts)<12: lines.append((a,u)); continue
        for _ in range(3):
            vx,vy,x0,y0=cv2.fitLine(pts.astype(np.float32),cv2.DIST_HUBER,0,0.01,0.01).ravel()
            dv=np.array([vx,vy]); p0=np.array([x0,y0])
            r=np.abs((pts-p0)@np.array([-vy,vx]))
            keep=r<=max(2.5,np.percentile(r,80))
            if keep.sum()<10: break
            pts=pts[keep]
        lines.append((p0,dv))
    def isect(l1,l2):
        p,u=l1; q_,v=l2
        A=np.array([u,-v]).T
        t=np.linalg.solve(A,q_-p)
        return p+u*t[0]
    return np.array([isect(lines[3],lines[0]),isect(lines[0],lines[1]),isect(lines[1],lines[2]),isect(lines[2],lines[3])],dtype=np.float32)
def rectify(img,aspect):
    b=ink(img); q=quad0(b)
    if q is None: return None,None
    q=refine(b,q,45,True); q=refine(b,q,12)
    FH=int(round(FW*aspect))
    dst=np.array([[ML,MT],[ML+FW,MT],[ML+FW,MT+FH],[ML,MT+FH]],dtype=np.float32)
    M=cv2.getPerspectiveTransform(q,dst)
    out=cv2.warpPerspective(img,M,(ML+FW+MR,MT+FH+MB),flags=cv2.INTER_AREA if True else 0,borderValue=(255,255,255))
    return out,q
if __name__=='__main__':
    names=sys.argv[1:]
    asp=[]
    for n in names:
        img=cv2.imread(f'pg/{n}.png'); b=ink(img); q=quad0(b)
        if q is None: print(n,'NO FRAME'); continue
        q=refine(b,q)
        w=(np.linalg.norm(q[1]-q[0])+np.linalg.norm(q[2]-q[3]))/2; h=(np.linalg.norm(q[3]-q[0])+np.linalg.norm(q[2]-q[1]))/2
        asp.append(h/w); print(n,img.shape[:2],q.round().astype(int).tolist(),round(h/w,4))
    print('median aspect',np.median(asp))
