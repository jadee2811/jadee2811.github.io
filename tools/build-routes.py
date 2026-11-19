#!/usr/bin/env python3
"""Generate static entry points for every SPA route (GitHub Pages serves them with 200,
then spa.js takes over), plus sitemap.xml, the on-page sitemap and robots.txt.

Run after editing data/routes.json, data/showcase/*.json or tools/shell.html:

    python3 tools/build-routes.py            # shells + SEO + sitemaps
    python3 tools/prerender.py               # (optional) bake each page body into its HTML for crawlers
"""
import json,os,re,html,datetime
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site='https://jadeshare.space'
shell=open(os.path.join(root,'tools','shell.html'),encoding='utf8').read()
routes=json.load(open(os.path.join(root,'data','routes.json'),encoding='utf8'))
today=datetime.date.today().isoformat()
DEFAULT_IMG='assets/og/default.png'
person={'@type':'Person','@id':site+'/#jade','name':'Jade','url':site+'/','jobTitle':'AI Product Owner and AI Growth Advisor','sameAs':['https://www.linkedin.com/in/jadeeasyai/','https://www.facebook.com/jadeshare.space/']}

def page_type(p):
    if p=='/':return 'WebPage'
    if p=='/about':return 'AboutPage'
    if p=='/blog':return 'Blog'
    if p=='/contact':return 'ContactPage'
    if p in('/work','/sitemap'):return 'CollectionPage'
    if p.startswith('/blog/'):return 'BlogPosting'
    return 'CreativeWork'

def jsonld(path,r,url,img):
    node={'@type':page_type(path),'@id':url+'#page','name':r['title'],'url':url,'description':r['description'],'image':img,'inLanguage':'vi' if path.startswith('/work/') and path!='/work' else 'en','author':{'@id':person['@id']},'isPartOf':{'@id':site+'/#website'}}
    if node['@type']=='BlogPosting':
        node['headline']=r['label'];node['mainEntityOfPage']=url;node['datePublished']='2026-11-01';node['dateModified']=today;node['publisher']={'@type':'Organization','name':'Jade Share','url':site+'/'}
    crumbs=[('Home',site+'/')]
    if path!='/':
        parts=path.strip('/').split('/')
        if len(parts)>1:
            parent='/'+parts[0];crumbs.append((routes.get(parent,{}).get('label',parts[0].title()),site+parent))
        crumbs.append((r['label'],url))
    g=[person,{'@type':'WebSite','@id':site+'/#website','name':'Jade Share','url':site+'/','publisher':{'@id':person['@id']}},node]
    if len(crumbs)>1:g.append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':i+1,'name':n,'item':u} for i,(n,u) in enumerate(crumbs)]})
    return json.dumps({'@context':'https://schema.org','@graph':g},ensure_ascii=False,separators=(',',':'))

def meta(path,r,noindex=False):
    url=site+(path if path!='/' else '/')
    t=html.escape(r['title'],quote=True);d=html.escape(r['description'],quote=True)
    img=site+'/'+r.get('image',DEFAULT_IMG);alt=html.escape(r['label']+' | Jade Share',quote=True)
    rb='noindex,follow' if noindex else 'index,follow,max-image-preview:large,max-snippet:-1'
    og_type='article' if path.startswith('/blog/') else 'website'
    lines=[f'<title>{t}</title>',f'<meta name="description" content="{d}" />',f'<meta name="robots" content="{rb}" />',f'<link rel="canonical" href="{url}" />',
      '<meta name="author" content="Jade" />','<meta name="theme-color" content="#116b54" />',
      f'<meta property="og:site_name" content="Jade Share" />',f'<meta property="og:locale" content="en_US" />',f'<meta property="og:title" content="{t}" />',f'<meta property="og:description" content="{d}" />',
      f'<meta property="og:type" content="{og_type}" />',f'<meta property="og:url" content="{url}" />',f'<meta property="og:image" content="{img}" />',
      '<meta property="og:image:width" content="1200" />','<meta property="og:image:height" content="630" />',f'<meta property="og:image:alt" content="{alt}" />',
      '<meta name="twitter:card" content="summary_large_image" />',f'<meta name="twitter:title" content="{t}" />',f'<meta name="twitter:description" content="{d}" />',f'<meta name="twitter:image" content="{img}" />',f'<meta name="twitter:image:alt" content="{alt}" />']
    if not noindex:lines.append('<script type="application/ld+json">'+jsonld(path,r,url,img)+'</script>')
    return '\n    '.join(lines)
def render(path,r,noindex=False):
    return re.sub(r'<!--SEO-->.*?<!--/SEO-->',lambda m:'<!--SEO-->'+meta(path,r,noindex)+'<!--/SEO-->',shell,flags=re.S)

# ---- on-page sitemap (pages/sitemap.html) ----
def li(p):return f'<li><a href="{p}">{html.escape(routes[p]["label"])}</a><span>{html.escape(routes[p]["description"])}</span></li>'
def group(h,keys):return f'<div><h2>{h}</h2><ul>'+''.join(li(k) for k in keys)+'</ul></div>'
main=[k for k in ('/','/about','/work','/blog','/contact') if k in routes]
works=[k for k in routes if k.startswith('/work/')];posts=[k for k in routes if k.startswith('/blog/')]
page=('<section class="pagehero"><label>SITEMAP</label><h1>Every page, <em>in one place.</em></h1><p>All pages of jadeshare.space. Looking for something specific? Start here.</p></section>'
 '<section class="section sitemap">'+group('Main pages',main)+group('Selected work',works)+group('Field notes',posts)+
 '<div><h2>For search engines</h2><ul><li><a href="/sitemap.xml">sitemap.xml</a><span>XML sitemap for search engines</span></li><li><a href="/robots.txt">robots.txt</a><span>Crawler rules</span></li></ul></div></section>')
open(os.path.join(root,'pages','sitemap.html'),'w',encoding='utf8').write(page+'\n')

for p,r in routes.items():
    out=os.path.join(root,'index.html') if p=='/' else os.path.join(root,p.strip('/'),'index.html')
    os.makedirs(os.path.dirname(out),exist_ok=True)
    open(out,'w',encoding='utf8').write(render(p,r))
nf={'title':'Page not found (404) | Jade','description':'This page does not exist or has moved. Head back to the Jade Share home page or browse the selected work.','label':'404','image':DEFAULT_IMG}
open(os.path.join(root,'404.html'),'w',encoding='utf8').write(render('/404',nf,True).replace('<link rel="canonical" href="'+site+'/404" />\n    ','').replace('<meta property="og:url" content="'+site+'/404" />\n    ',''))

# ---- sitemap.xml ----
def prio(p):return '1.0' if p=='/' else '0.8' if p in('/about','/work','/contact') else '0.6' if p!='/sitemap' else '0.3'
def freq(p):return 'monthly'
sm=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
for p,r in routes.items():
    img=site+'/'+r.get('image',DEFAULT_IMG)
    sm.append(f'  <url><loc>{site}{p}</loc><lastmod>{today}</lastmod><changefreq>{freq(p)}</changefreq><priority>{prio(p)}</priority><image:image><image:loc>{img}</image:loc></image:image></url>')
sm.append('</urlset>')
open(os.path.join(root,'sitemap.xml'),'w').write('\n'.join(sm)+'\n')

# ---- robots.txt ----
open(os.path.join(root,'robots.txt'),'w').write(f'''User-agent: *
Allow: /
Disallow: /cms/
Disallow: /cms-app/
Disallow: /studio.html
Disallow: /tools/
Disallow: /pages/

Sitemap: {site}/sitemap.xml
''')
print(len(routes),'routes')
