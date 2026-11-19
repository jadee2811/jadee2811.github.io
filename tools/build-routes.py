#!/usr/bin/env python3
"""Generate static entry points for every SPA route in two languages, plus sitemap.xml and robots.txt.

English lives at the root (/about), Vietnamese under /vi (/vi/about). Each page has its own URL,
its own title/description (data/routes.json, data/routes.vi.json), canonical and hreflang pairs.
GitHub Pages serves the files with 200, then spa.js takes over.

Run after editing data/routes*.json, data/showcase/**, pages/** or tools/shell.html:

    python3 tools/build-routes.py            # shells + SEO + sitemaps + language split of bilingual pages
    python3 tools/prerender.py               # (optional) bake each page body into its HTML for crawlers
"""
import json,os,re,html,datetime
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site='https://jadeshare.space'
shell=open(os.path.join(root,'tools','shell.html'),encoding='utf8').read()
R={'en':json.load(open(os.path.join(root,'data','routes.json'),encoding='utf8')),
   'vi':json.load(open(os.path.join(root,'data','routes.vi.json'),encoding='utf8'))}
routes=R['en']
today=datetime.date.today().isoformat()
DEFAULT_IMG='assets/og/default.png'
person={'@type':'Person','@id':site+'/#jade','name':'Jade','url':site+'/','jobTitle':'AI Product Owner and AI Growth Advisor','sameAs':['https://www.linkedin.com/in/jadeshare/','https://www.facebook.com/jadeshare.space/']}
LOC={'en':'en_US','vi':'vi_VN'}
def url_of(lang,p):
    if lang=='en':return site+p
    return site+'/vi'+('/' if p=='/' else p)
def path_of(lang,p):return url_of(lang,p)[len(site):] or '/'
def out_of(lang,p):
    base=os.path.join(root,'vi') if lang=='vi' else root
    return os.path.join(base,'index.html') if p=='/' else os.path.join(base,p.strip('/'),'index.html')

# ---------- split bilingual pages (data-en / data-vi) ----------
pat=re.compile(r'<(\w+)([^>]*?)\sdata-en="([^"]*)"\sdata-vi="([^"]*)"([^>]*)>(.*?)</\1>',re.S)
def split(src,lang):
    def rep(m):
        tag,a,en,vi,b,_=m.groups()
        return f'<{tag}{a}{b}>{html.unescape(en if lang=="en" else vi)}</{tag}>'
    return pat.sub(rep,src)
os.makedirs(os.path.join(root,'pages','vi'),exist_ok=True)
for name in ('about','404'):
    src=open(os.path.join(root,'pages','src',name+'.bi.html'),encoding='utf8').read()
    open(os.path.join(root,'pages',name+'.html'),'w',encoding='utf8').write(split(src,'en'))
    open(os.path.join(root,'pages','vi',name+'.html'),'w',encoding='utf8').write(split(src,'vi'))

# ---------- shell per language ----------
VI_TEXT=[('>About<','>Giới thiệu<'),('>Work<','>Dự án<'),('>Contact<','>Liên hệ<'),('>Sitemap<','>Sơ đồ trang<'),
 ('<b>EXPLORE</b>','<b>KHÁM PHÁ</b>'),('<b>CONNECT</b','<b>KẾT NỐI</b'),('<b>CONTACT</b','<b>LIÊN HỆ</b'),
 ('Jade Share, home','Jade Share, trang chủ'),
 ('AI Product Owner & AI Growth Advisor<br />Based in Vietnam · Working\n          across SEA','AI Product Owner & Cố vấn tăng trưởng AI<br />Sống tại Việt Nam · Làm việc khắp Đông Nam Á'),
 ('Built with curiosity, in Vietnam.','Làm bằng sự tò mò, tại Việt Nam.')]
def localize(lang,p):
    s=shell
    if lang=='vi':
        s=s.replace('<html lang="en">','<html lang="vi">')
        for a,b in VI_TEXT:
            assert a in s,a
            s=s.replace(a,b)
        s=re.sub(r'href="/(about|work|blog|contact|sitemap)"',r'href="/vi/\1"',s)
        s=s.replace('<a class="logo" href="/"','<a class="logo" href="/vi/"')
        s=s.replace('<a href="/sitemap.xml"','<a href="/sitemap.xml"')
    other='vi' if lang=='en' else 'en'
    cur_b,oth_b=('EN','VI') if lang=='en' else ('VI','EN')
    sw=(f'<a class="lang" href="{path_of(other,p)}" hreflang="{other}" lang="{other}" aria-label="{"Tiếng Việt" if other=="vi" else "English"}">'
        +('<b>EN</b><i>VI</i>' if lang=='en' else '<i>EN</i><b>VI</b>')+'</a>')
    s=re.sub(r'<button class="lang">.*?</button>',lambda m:sw,s,flags=re.S)
    return s

def jsonld(lang,path,r,url,img):
    ptype=page_type(path)
    node={'@type':ptype,'@id':url+'#page','name':r['title'],'url':url,'description':r['description'],'image':img,'inLanguage':lang,'author':{'@id':person['@id']},'isPartOf':{'@id':site+'/#website'}}
    if ptype=='BlogPosting':
        node['headline']=r['label'];node['mainEntityOfPage']=url;node['datePublished']='2026-11-01';node['dateModified']=today;node['publisher']={'@type':'Organization','name':'Jade Share','url':site+'/'}
    home='Home' if lang=='en' else 'Trang chủ'
    crumbs=[(home,url_of(lang,'/'))]
    if path!='/':
        parts=path.strip('/').split('/')
        if len(parts)>1:
            parent='/'+parts[0];crumbs.append((R[lang].get(parent,{}).get('label',parts[0].title()),url_of(lang,parent)))
        crumbs.append((r['label'],url))
    g=[person,{'@type':'WebSite','@id':site+'/#website','name':'Jade Share','url':site+'/','inLanguage':['en','vi'],'publisher':{'@id':person['@id']}},node]
    if len(crumbs)>1:g.append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':i+1,'name':n,'item':u} for i,(n,u) in enumerate(crumbs)]})
    return json.dumps({'@context':'https://schema.org','@graph':g},ensure_ascii=False,separators=(',',':'))
def page_type(p):
    if p=='/':return 'WebPage'
    if p=='/about':return 'AboutPage'
    if p=='/blog':return 'Blog'
    if p=='/contact':return 'ContactPage'
    if p in('/work','/sitemap'):return 'CollectionPage'
    if p.startswith('/blog/'):return 'BlogPosting'
    return 'CreativeWork'

def meta(lang,path,r,noindex=False,alts=True):
    url=url_of(lang,path)
    t=html.escape(r['title'],quote=True);d=html.escape(r['description'],quote=True)
    img=site+'/'+r.get('image',DEFAULT_IMG);alt=html.escape(r['label']+' | Jade Share',quote=True)
    rb='noindex,follow' if noindex else 'index,follow,max-image-preview:large,max-snippet:-1'
    og_type='article' if path.startswith('/blog/') else 'website'
    other='vi' if lang=='en' else 'en'
    lines=[f'<title>{t}</title>',f'<meta name="description" content="{d}" />',f'<meta name="robots" content="{rb}" />']
    if not noindex or alts:
        lines.append(f'<link rel="canonical" href="{url}" />')
    if alts and not noindex:
        lines+= [f'<link rel="alternate" hreflang="en" href="{url_of("en",path)}" />',f'<link rel="alternate" hreflang="vi" href="{url_of("vi",path)}" />',f'<link rel="alternate" hreflang="x-default" href="{url_of("en",path)}" />']
    lines+=['<meta name="author" content="Jade" />','<meta name="theme-color" content="#116b54" />',
      '<meta property="og:site_name" content="Jade Share" />',f'<meta property="og:locale" content="{LOC[lang]}" />']
    if alts and not noindex:lines.append(f'<meta property="og:locale:alternate" content="{LOC[other]}" />')
    lines+=[f'<meta property="og:title" content="{t}" />',f'<meta property="og:description" content="{d}" />',
      f'<meta property="og:type" content="{og_type}" />',f'<meta property="og:url" content="{url}" />',f'<meta property="og:image" content="{img}" />',
      '<meta property="og:image:width" content="1200" />','<meta property="og:image:height" content="630" />',f'<meta property="og:image:alt" content="{alt}" />',
      '<meta name="twitter:card" content="summary_large_image" />',f'<meta name="twitter:title" content="{t}" />',f'<meta name="twitter:description" content="{d}" />',f'<meta name="twitter:image" content="{img}" />',f'<meta name="twitter:image:alt" content="{alt}" />']
    if not noindex:lines.append('<script type="application/ld+json">'+jsonld(lang,path,r,url,img)+'</script>')
    return '\n    '.join(lines)
def render(lang,path,r,noindex=False,alts=True):
    s=localize(lang,path if path in routes else '/')
    return re.sub(r'<!--SEO-->.*?<!--/SEO-->',lambda m:'<!--SEO-->'+meta(lang,path,r,noindex,alts)+'<!--/SEO-->',s,flags=re.S)

# ---------- on-page sitemap ----------
def sitemap_page(lang):
    rt=R[lang];pre='' if lang=='en' else '/vi'
    def li(p):return f'<li><a href="{p}">{html.escape(rt[p]["label"])}</a><span>{html.escape(rt[p]["description"])}</span></li>'
    def group(h,keys):return f'<div><h2>{h}</h2><ul>'+''.join(li(k) for k in keys)+'</ul></div>'
    main=[k for k in ('/','/about','/work','/blog','/contact') if k in routes]
    works=[k for k in routes if k.startswith('/work/')];posts=[k for k in routes if k.startswith('/blog/')]
    if lang=='en':
        head='<section class="pagehero"><label>SITEMAP</label><h1>Every page, <em>in one place.</em></h1><p>All pages of jadeshare.space. Looking for something specific? Start here.</p></section>'
        g=(group('Main pages',main)+group('Selected work',works)+group('Field notes',posts)+'<div><h2>For search engines</h2><ul><li><a href="/sitemap.xml">sitemap.xml</a><span>XML sitemap for search engines</span></li><li><a href="/robots.txt">robots.txt</a><span>Crawler rules</span></li></ul></div>')
    else:
        head='<section class="pagehero"><label>SƠ ĐỒ TRANG</label><h1>Mọi trang, <em>trong một nơi.</em></h1><p>Tất cả trang của jadeshare.space. Đang tìm một mục cụ thể? Bắt đầu từ đây.</p></section>'
        g=(group('Trang chính',main)+group('Dự án tiêu biểu',works)+group('Ghi chép',posts)+'<div><h2>Dành cho công cụ tìm kiếm</h2><ul><li><a href="/sitemap.xml">sitemap.xml</a><span>Sơ đồ XML cho công cụ tìm kiếm</span></li><li><a href="/robots.txt">robots.txt</a><span>Quy tắc cho trình thu thập</span></li></ul></div>')
    page=head+'<section class="section sitemap">'+g+'</section>'
    f=os.path.join(root,'pages','sitemap.html') if lang=='en' else os.path.join(root,'pages','vi','sitemap.html')
    open(f,'w',encoding='utf8').write(page+'\n')
for l in ('en','vi'):sitemap_page(l)

for lang in ('en','vi'):
    for p,r in R[lang].items():
        out=out_of(lang,p)
        os.makedirs(os.path.dirname(out),exist_ok=True)
        open(out,'w',encoding='utf8').write(render(lang,p,r))
nf={'title':'Page not found (404) | Jade','description':'This page does not exist or has moved. Head back to the Jade Share home page or browse the selected work.','label':'404','image':DEFAULT_IMG}
open(os.path.join(root,'404.html'),'w',encoding='utf8').write(render('en','/404',nf,True,False))

# ---------- sitemap.xml with hreflang alternates ----------
def prio(p):return '1.0' if p=='/' else '0.8' if p in('/about','/work','/contact') else '0.6' if p!='/sitemap' else '0.3'
sm=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">']
for p,r in routes.items():
    img=site+'/'+r.get('image',DEFAULT_IMG)
    alts=''.join(f'<xhtml:link rel="alternate" hreflang="{l}" href="{url_of(l,p)}"/>' for l in ('en','vi'))+f'<xhtml:link rel="alternate" hreflang="x-default" href="{url_of("en",p)}"/>'
    for l in ('en','vi'):
        sm.append(f'  <url><loc>{url_of(l,p)}</loc><lastmod>{today}</lastmod><changefreq>monthly</changefreq><priority>{prio(p)}</priority>{alts}<image:image><image:loc>{img}</image:loc></image:image></url>')
sm.append('</urlset>')
open(os.path.join(root,'sitemap.xml'),'w').write('\n'.join(sm)+'\n')

open(os.path.join(root,'robots.txt'),'w').write(f'''User-agent: *
Allow: /
Disallow: /cms/
Disallow: /cms-app/
Disallow: /studio.html
Disallow: /tools/
Disallow: /pages/

Sitemap: {site}/sitemap.xml
''')
print(len(routes),'routes x 2 languages')

# ---------- redirect stubs for old URLs (GitHub Pages cannot send 301) ----------
legacy={'/work/umc-ai':'/work/umc','/work/umc-web':'/work/umc'}
for lang in ('en','vi'):
    for old,new in legacy.items():
        o=path_of(lang,old);n=path_of(lang,new)
        d=os.path.join(root,o.strip('/'));os.makedirs(d,exist_ok=True)
        open(os.path.join(d,'index.html'),'w',encoding='utf8').write(f'<!doctype html><html lang="{lang}"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><title>Redirecting…</title><link rel="canonical" href="{site}{n}"><meta http-equiv="refresh" content="0;url={n}"><script>location.replace("{n}"+location.hash)</script></head><body><a href="{n}">Continue</a></body></html>')
