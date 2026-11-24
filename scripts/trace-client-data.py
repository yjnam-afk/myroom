#!/usr/bin/env python3
"""클라이언트 화면이 큰 자료 파일을 끌어오는지 본다.

  python3 scripts/trace-client-data.py                      # "use client" 파일 전부
  python3 scripts/trace-client-data.py src/app/explain/ExplainClient.tsx

값 import(`import type` 은 뺀다)를 따라가 150KB 가 넘는 파일에 닿으면 그 경로를 찍는다.
2026-11-24 "토픽 설명 메뉴 누를 때 꽤 오래 걸려": `PeerAnswers`(클라이언트)가 `questionAnswers.ts` 에서 한 줄짜리
`periodGroup` 을 가져오느라 문제은행·모범답안 11묶음·교재 서브노트·예전 토픽 13MB 가 브라우저 묶음에 들어가 있었다.
클라이언트 파일에서 `lib/` 의 함수를 새로 가져올 때 돌려 본다.
"""
import re,os,sys
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src')
ROOT=os.path.normpath(ROOT)
def resolve(frm,spec):
    if spec.startswith('@/'): base=os.path.join(ROOT,spec[2:])
    elif spec.startswith('.'): base=os.path.normpath(os.path.join(os.path.dirname(frm),spec))
    else: return None
    for c in (base,base+'.ts',base+'.tsx',base+'/index.ts',base+'/index.tsx'):
        if os.path.isfile(c): return c
    return None
IMP=re.compile(r'^\s*(import|export)\s+(type\s+)?([^;]*?)\s+from\s+["\']([^"\']+)["\']',re.M|re.S)
SIDE=re.compile(r'^\s*import\s+["\']([^"\']+)["\']',re.M)
def deps(f):
    if not f.endswith(('.ts','.tsx')): return []
    s=open(f,encoding='utf8').read(); out=[]
    for m in IMP.finditer(s):
        if m.group(2): continue
        names=m.group(3)
        # import { type A, type B } only → skip
        inner=re.search(r'\{([^}]*)\}',names)
        if inner and not re.sub(r'\{[^}]*\}','',names).strip(' ,'):
            parts=[p.strip() for p in inner.group(1).split(',') if p.strip()]
            if parts and all(p.startswith('type ') for p in parts): continue
        r=resolve(f,m.group(4))
        if r: out.append(r)
    return out
def trace(start):
    seen={start:None}; q=[start]
    while q:
        f=q.pop(0)
        for d in deps(f):
            if d not in seen: seen[d]=f; q.append(d)
    out=[]
    for s,f in sorted(((os.path.getsize(f),f) for f in seen if os.path.getsize(f)>150000),reverse=True):
        path=[];x=f
        while x: path.append(os.path.relpath(x,ROOT)); x=seen[x]
        out.append(f'{s//1000:6d} kB  '+' <- '.join(path))
    return out
if len(sys.argv)>1: starts=[os.path.abspath(a) for a in sys.argv[1:]]
else:
    starts=[]
    for d,_,fs in os.walk(ROOT):
        for f in fs:
            if f.endswith('.tsx'):
                p=os.path.join(d,f)
                if open(p,encoding='utf8').read(200).lstrip().startswith(('"use client"',"'use client'")): starts.append(p)
n=0
for s in sorted(starts):
    o=trace(s)
    if o:
        n+=1; print('==',os.path.relpath(s,ROOT)); print('\n'.join(o))
print(f'큰 자료를 끌어오는 클라이언트 파일 {n}개 / 본 파일 {len(starts)}개')
