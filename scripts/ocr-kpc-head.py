"""
KPC 모범답안 첫 쪽 머리(인쇄된 문제 줄)를 OCR 로 읽는다 — 제목이 실제 문제와 같은지 대조할 때 쓴다.

  apt-get install -y tesseract-ocr tesseract-ocr-kor
  python3 scripts/ocr-kpc-head.py <jobs.json> <out.json> [n]     jobs = [{"id": 답안 id, "src": 첫 쪽 이미지 경로}]

2026-11-15 "모범답안이 달라" — KPC 답안 제목이 가져올 때 비슷한 다른 회차 문항 문장으로 바뀌어 있었다(84회 「PCB와 TCB의 비교」가
「PCB 및 TCB가 스케줄링에 활용되는 방식」으로). 머리 줄을 읽어 자기 회차 문항과 맞춰 208편을 고쳤다. 글자가 깨지므로 읽은 글을 그대로
제목으로 쓰지 않고, 문제은행 문항과 맞추는 데만 쓴다. 옛 양식(37~39회 — 머리에 문제가 없다)은 읽을 것이 없다.
"""
import json, sys, subprocess, os, re, tempfile
from PIL import Image
import numpy as np
from concurrent.futures import ProcessPoolExecutor
ROOT='/home/user/myroom/public'
def head(src):
    try:
        p = '/home/user/myroom-answers/'+src[6:] if src.startswith('/ans2/') else ROOT+src
        im = Image.open(p).convert('L')
    except Exception as e:
        return None
    w,h = im.size
    a = np.asarray(im)
    dark = (a < 110).mean(axis=1)
    # 머리 아래 가로줄 — 위 4%~45% 사이에서 어두운 화소가 줄의 55% 넘는 첫 행
    rule = None
    for y in range(int(h*0.04), int(h*0.45)):
        if dark[y] > 0.55: rule = y; break
    if rule is None: rule = int(h*0.14)
    top = max(0, int(h*0.02))
    rule = min(rule, int(h*0.24))
    crop = im.crop((int(w*0.03), top, int(w*0.97), max(rule-2, top+20)))
    k = 1800 / crop.width
    crop = crop.resize((1800, max(20, int(crop.height*k))), Image.LANCZOS)
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as f: tmp=f.name
    crop.save(tmp)
    try:
        out = subprocess.run(['tesseract', tmp, '-', '-l', 'kor+eng', '--psm', '6'], capture_output=True, text=True, timeout=30, env={**os.environ, 'OMP_THREAD_LIMIT': '1'}).stdout
    except Exception as e:
        out = ''
    os.unlink(tmp)
    return out.strip()
def job(j):
    return j['id'], head(j['src'])
if __name__ == '__main__':
    jobs = json.load(open(sys.argv[1]))
    if len(sys.argv) > 3: jobs = jobs[:int(sys.argv[3])]
    res = {}
    with ProcessPoolExecutor(4) as ex:
        for i,(k,v) in enumerate(ex.map(job, jobs, chunksize=4)):
            res[k] = v
            if i % 100 == 99:
                json.dump(res, open(sys.argv[2],'w'), ensure_ascii=False, indent=0); print(i+1, flush=True)
    json.dump(res, open(sys.argv[2],'w'), ensure_ascii=False, indent=0)
    print(len(res))
