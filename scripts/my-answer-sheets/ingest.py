import pymupdf,glob,os,io,hashlib,sys,shutil,json
from PIL import Image,ImageDraw,ImageFont
UP='/root/.claude/uploads/91eba055-4832-57fd-a01e-05e73e86cdd5/'
font=ImageFont.truetype('/usr/share/fonts/truetype/fonts-japanese-gothic.ttf',22)
letter=sys.argv[1]; order=sys.argv[2:]
os.makedirs('src'+letter,exist_ok=True)
seen=json.load(open('md5.json')) if os.path.exists('md5.json') else {}
tiles=[]
for k,pre in enumerate(order):
    f=glob.glob(UP+pre+'*')[0]; shutil.copy(f,'src'+letter+'/')
    d=pymupdf.open(f)
    for i,p in enumerate(d):
        raw=d.extract_image(p.get_images(full=True)[0][0])['image']
        h=hashlib.md5(raw).hexdigest(); name=f'{letter}{k}-{i+1}'
        dup=seen.get(h)
        if dup and dup!=name: print(name,'DUP of',dup); continue
        seen[h]=name
        im=Image.open(io.BytesIO(raw)).convert('RGB'); im.save(f'pg/{name}.png')
        W=500; t=im.resize((W-6,int(im.height*(W-6)/im.width)))
        c=Image.new('RGB',(W,t.height+30),'white'); c.paste(t,(3,28)); dr=ImageDraw.Draw(c); dr.rectangle((0,0,W,26),fill=(0,60,160)); dr.text((5,1),f'{name} {os.path.basename(f)[9:]}',fill='white',font=font); tiles.append(c)
json.dump(seen,open('md5.json','w'))
for k in range(0,len(tiles),4):
    g=tiles[k:k+4]; sh=Image.new('RGB',(2000,max(t.height for t in g)),'white')
    for j,t in enumerate(g): sh.paste(t,(j*500,0))
    sh.save(f'ov{letter}-{k//4}.png'); print(f'ov{letter}-{k//4}.png',sh.size)
