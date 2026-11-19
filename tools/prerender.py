#!/usr/bin/env python3
"""Bake each page body into its static HTML so crawlers (and no-JS readers) see real content.
Run after tools/build-routes.py. Needs google-chrome. spa.js still takes over in the browser."""
import json,os,re,subprocess,threading,http.server,functools,socketserver
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
routes=json.load(open(os.path.join(root,'data','routes.json'),encoding='utf8'))
H=functools.partial(http.server.SimpleHTTPRequestHandler,directory=root)
H.log_message=lambda *a,**k:None
class S(socketserver.TCPServer):allow_reuse_address=True
srv=S(('127.0.0.1',0),H);port=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
ok=0
for p in routes:
    out=os.path.join(root,'index.html') if p=='/' else os.path.join(root,p.strip('/'),'index.html')
    dom=subprocess.run(['google-chrome','--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=6000','--dump-dom',f'http://127.0.0.1:{port}{p}'],capture_output=True,text=True).stdout
    m=re.search(r'<main id="view"[^>]*>(.*?)</main>',dom,re.S)
    if not m or len(m.group(1))<200:print('FAILED',p);continue
    body=m.group(1)
    f=open(out,encoding='utf8').read()
    f=re.sub(r'<!--PRERENDER-->.*?<!--/PRERENDER-->',lambda _:'<!--PRERENDER-->'+body+'<!--/PRERENDER-->',f,flags=re.S)
    open(out,'w',encoding='utf8').write(f);ok+=1
srv.shutdown()
print('prerendered',ok,'of',len(routes))
