#!/usr/bin/env python3
"""Generate static entry points for every SPA route (GitHub Pages serves them with 200,
then spa.js takes over). Run after editing data/routes.json or shell.html:  python3 tools/build-routes.py"""
import json,os,re,html
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
shell=open(os.path.join(root,'tools','shell.html'),encoding='utf8').read()
routes=json.load(open(os.path.join(root,'data','routes.json'),encoding='utf8'))
site='https://jadeshare.space'
def meta(path,r):
    url=site+(path if path!='/' else '/')+('' if path=='/' else '')
    t=html.escape(r['title']);d=html.escape(r['description']);img=site+'/'+r.get('image','assets/umc-ai.png')
    return (f'<title>{t}</title>\n    <meta name="description" content="{d}" />\n    <link rel="canonical" href="{url}" />\n'
            f'    <meta property="og:title" content="{t}" />\n    <meta property="og:description" content="{d}" />\n    <meta property="og:type" content="website" />\n'
            f'    <meta property="og:url" content="{url}" />\n    <meta property="og:image" content="{img}" />\n    <meta name="twitter:card" content="summary_large_image" />')
def render(path,r):
    return re.sub(r'<!--SEO-->.*?<!--/SEO-->','<!--SEO-->'+meta(path,r)+'<!--/SEO-->',shell,flags=re.S)
for p,r in routes.items():
    out=os.path.join(root,'index.html') if p=='/' else os.path.join(root,p.strip('/'),'index.html')
    os.makedirs(os.path.dirname(out),exist_ok=True)
    open(out,'w',encoding='utf8').write(render(p,r))
open(os.path.join(root,'404.html'),'w',encoding='utf8').write(render('/',{'title':'Jade | AI Product Owner & Growth Advisor','description':routes['/']['description']}).replace('<meta name="twitter:card"','<meta name="robots" content="noindex" />\n    <meta name="twitter:card"'))
sm=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']+['  <url><loc>%s%s</loc></url>'%(site,p) for p in routes]+['</urlset>']
open(os.path.join(root,'sitemap.xml'),'w').write('\n'.join(sm)+'\n')
print(len(routes),'routes')
