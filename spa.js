(function(){
'use strict';
const siteUrl='https://jadeshare.space';
const view=document.getElementById('view');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cache={};
const getJSON=u=>cache[u]||(cache[u]=fetch(u).then(r=>{if(!r.ok)throw new Error(u);return r.json()}));
const getText=u=>cache[u]||(cache[u]=fetch(u).then(r=>{if(!r.ok)throw new Error(u);return r.text()}));

/* ---------- SEO ---------- */
function meta(sel,attr,val){let e=document.querySelector(sel);if(!e){e=document.createElement('meta');const m=sel.match(/\[(name|property)="([^"]+)"\]/);if(m)e.setAttribute(m[1],m[2]);document.head.append(e)}e.setAttribute(attr,val)}
function canonical(url){let l=document.querySelector('link[rel="canonical"]');if(!l){l=document.createElement('link');l.rel='canonical';document.head.append(l)}l.href=url}
function ld(data){let s=document.querySelector('script[type="application/ld+json"]');if(!s){s=document.createElement('script');s.type='application/ld+json';document.head.append(s)}s.textContent=JSON.stringify(data)}
const person={'@type':'Person','@id':siteUrl+'/#jade',name:'Jade',url:siteUrl+'/',jobTitle:'AI Product Owner and AI Growth Advisor',sameAs:['https://www.linkedin.com/in/jadeshare/','https://www.facebook.com/jadeshare.space/']};
function seo(path,r){
  if(!r)return;const url=siteUrl+path,img=siteUrl+'/'+(r.image||'assets/umc-ai.svg');
  document.title=r.title;meta('meta[name="description"]','content',r.description);
  meta('meta[property="og:title"]','content',r.title);meta('meta[property="og:description"]','content',r.description);
  meta('meta[property="og:type"]','content','website');meta('meta[property="og:url"]','content',url);meta('meta[property="og:image"]','content',img);
  meta('meta[name="twitter:card"]','content','summary_large_image');canonical(url);
  const type=path==='/'?'WebPage':path==='/blog'?'Blog':path==='/contact'?'ContactPage':path==='/work'?'CollectionPage':path.startsWith('/blog/')?'BlogPosting':'CreativeWork';
  const node={'@type':type,name:r.title,url,description:r.description,author:person};
  if(type==='BlogPosting'){node.headline=r.title;node.publisher={'@type':'Organization',name:'Jade Share',url:siteUrl+'/'}}
  ld({'@context':'https://schema.org','@graph':[person,{'@type':'WebSite',name:'Jade Share',url:siteUrl+'/'},node]});
}

/* ---------- language, menu ---------- */
let lang=localStorage.getItem('jade-lang')||'en';
const lb=document.querySelector('.lang'),nav=document.querySelector('header nav');
function setLang(l){lang=l;document.documentElement.lang=l;document.querySelectorAll('[data-en]').forEach(x=>x.innerHTML=x.dataset[l]);if(lb){lb.querySelector('b').style.color=l==='en'?'#116b54':'#899891';lb.querySelector('i').style.color=l==='vi'?'#116b54':'#899891'}localStorage.setItem('jade-lang',l)}
if(lb)lb.onclick=()=>setLang(lang==='en'?'vi':'en');
const menu=document.querySelector('.menu');if(menu&&nav)menu.onclick=()=>nav.classList.toggle('open');

/* ---------- renderers ---------- */
const BLOCKS={
heading:b=>'<h2>'+esc(b.text)+'</h2>',
paragraph:b=>'<p>'+esc(b.text)+'</p>',
quote:b=>'<blockquote>'+esc(b.text)+'</blockquote>',
list:b=>'<ul>'+b.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul>',
steps:b=>'<ol class="sc-steps">'+b.items.map((i,n)=>'<li><b>'+String(n+1).padStart(2,'0')+'</b><div><strong>'+esc(i[0])+'</strong>'+(i[1]?'<span>'+esc(i[1])+'</span>':'')+'</div></li>').join('')+'</ol>',
stats:b=>'<div class="sc-stats">'+b.items.map(i=>'<div><em>'+esc(i[0])+'</em><span>'+esc(i[1])+'</span></div>').join('')+'</div>',
image:b=>'<figure>'+(b.src?'<img src="'+esc(b.src)+'" alt="'+esc(b.alt||'')+'" loading="lazy">':'<div class="sc-ph">'+esc(b.caption||'Hình minh hoạ')+'</div>')+(b.src&&b.caption?'<figcaption>'+esc(b.caption)+'</figcaption>':'')+'</figure>',
embed:b=>'<div class="sc-embed"><iframe src="'+esc(b.src)+'" loading="lazy" allowfullscreen></iframe></div>',
link:b=>'<p><a class="more" href="'+esc(b.href)+'">'+esc(b.text)+' →</a></p>'};
async function showcase(slug){
  const d=await getJSON('/data/showcase/'+encodeURIComponent(slug)+'.json');
  if(d.status!=='published')return{html:'<section class="sc-hero"><h1>Chưa công bố</h1></section>',seo:{title:'Chưa công bố | Jade',description:''}};
  return{html:'<div id="showcase">'+(d.cover?'<div class="sc-cover"><img src="'+esc(d.cover)+'" alt=""></div>':'')+'<section class="sc-hero">'+(d.logo?'<img class="sc-logo" src="'+esc(d.logo)+'" alt="'+esc(d.client||'')+'">':'')+'<label>'+esc(d.sector)+' · '+(d.kind==='personal'?'DỰ ÁN CÁ NHÂN':'DỰ ÁN')+'</label><h1>'+esc(d.title)+'</h1><p>'+esc(d.summary)+'</p>'
  +'<dl><div><dt>Khách hàng</dt><dd>'+esc(d.client||'—')+'</dd></div><div><dt>Vai trò</dt><dd>'+esc(d.role)+'</dd></div><div><dt>Năm</dt><dd>'+esc(d.year)+'</dd></div></dl></section>'
  +'<section class="sc-body">'+d.blocks.map(b=>(BLOCKS[b.type]||(()=>''))(b)).join('')+'<p><a class="more" href="/work">← Quay lại showcase</a></p></section></div>',
  seo:{title:d.title+' | Jade',description:d.summary,image:(d.cover||d.logo||'').replace(/^\//,'')||undefined}};
}
async function caseStudy(slug){
  const d=(await getJSON('/data/content.json')).cases[slug];if(!d)throw 0;
  return{html:'<section class="casehero"><label>'+d[0]+'</label><h1>'+d[2]+'</h1><div><span>CASE STUDY</span><span>PUBLIC-READY SUMMARY</span></div></section><section class="casebody"><aside>IN THIS CASE<br>Context<br>Experience focus<br>Delivery lens</aside><article><p class="lead">'+d[4]+'</p><figure class="case-image"><img src="assets/'+d[1]+'" alt="'+esc(d[2])+'" loading="eager"><figcaption>Project visual used for portfolio context.</figcaption></figure><label>01 / CONTEXT</label><h2>A system is only useful when its next step is clear.</h2><p>This portfolio case presents the experience and delivery lens. Client-specific data, individual responsibilities and outcome metrics are only included when approved and supported by an original source.</p><label>02 / EXPERIENCE FOCUS</label><h2>Design for context, control and recovery.</h2><p>The interface should make key information easy to scan, enable a clear action and provide a visible path when a person needs to step in.</p><label>03 / DELIVERY LENS</label><h2>Move from a convincing moment to an operating workflow.</h2><p>In practice, that means designing the handoffs, information structure and review points alongside the interaction itself.</p><p><a class="more" href="/work">Back to selected work →</a></p></article></section>'};
}
async function article(slug){
  const d=(await getJSON('/data/content.json')).articles[slug];if(!d)throw 0;
  return{html:'<section class="article-hero"><div class="article-heading"><label>'+d[0]+' · FIELD NOTE</label><h1>'+d[1]+'</h1><p>'+d[2]+'</p><div class="article-by">By Jade · Jade Share</div></div></section><section class="article-body"><aside><b>TABLE OF CONTENTS</b><a href="#start">01 Start with the decision</a><a href="#handoff">02 Map the handoff</a><a href="#scale">03 Scale the system</a></aside><article><p class="standfirst">These notes are a framework for discussing product and AI delivery. They do not represent a claim about a single client outcome.</p><h2 id="start">Start with the recurring decision</h2><p>Look first at the repeated decision a team makes, the context it requires and the consequence of getting it wrong. This reveals the useful unit of work before a feature or tool enters the discussion.</p><h2 id="handoff">Map the handoffs</h2><p>Document where information changes hands, where it is lost and where someone must review it. Clear handoffs make a workflow easier to evaluate and improve.</p><blockquote>Useful systems are defined by the workflow around a decision, not only by the quality of a single response.</blockquote><h2 id="scale">Scale the system, not the demo</h2><p>Scaling changes ownership, data, training and exception handling. A sustainable plan keeps those conditions visible from the start.</p><p><a class="more" href="/blog">Back to Jade Share →</a></p></article></section>'};
}
const PAGES={'/':'home','/about':'about','/work':'work','/blog':'blog','/contact':'contact','/blog/operating-model':'operating-model'};
const notFoundSeo={title:'Lost in the forest (404) | Jade',description:'This page does not exist or has moved.'};
async function resolve(path){
  if(PAGES[path])return{html:await getText('/pages/'+PAGES[path]+'.html')};
  let m;
  if(m=path.match(/^\/work\/([\w-]+)$/)){
    try{return await showcase(m[1])}catch(e){}
    try{return await caseStudy(m[1])}catch(e){}
  }
  if(m=path.match(/^\/blog\/([\w-]+)$/)){try{return await article(m[1])}catch(e){}}
  return{html:await getText('/pages/404.html'),seo:notFoundSeo};
}

/* ---------- per-view behaviour ---------- */
function bind(path){
  setLang(lang);
  view.querySelectorAll('a[href^="http"]').forEach(a=>{if(new URL(a.href).origin!==location.origin){a.target='_blank';a.rel='noopener noreferrer'}});
  const fs=view.querySelectorAll('[data-filter]'),cs=view.querySelectorAll('[data-category]');
  fs.forEach(f=>f.onclick=()=>{fs.forEach(x=>x.classList.remove('active'));f.classList.add('active');cs.forEach(c=>c.hidden=f.dataset.filter!=='all'&&c.dataset.category!==f.dataset.filter)});
  const slugs={'UMC Digital Health Platform':'umc','Money Forward Vietnam Digital Experience':'money-forward','Jungle Boss Adventure Travel Experience':'jungle-boss','Trường Sơn Online Auction Platform':'truong-son','Viettel Store AI Sales Advisor':'viettel-store','UMC AI-Powered Health Knowledge System':'umc','Rạng Đông AI-Assisted Dealer Commerce':'rang-dong','MediaMart AI Sales & Customer Service':'media-mart'};
  view.querySelectorAll('.card').forEach(c=>{const t=c.querySelector('h2')?.textContent.trim();if(slugs[t])c.setAttribute('href','/work/'+slugs[t])});
  const posts={'Designing the workflow before choosing the tool':'workflow','What makes an enterprise pilot worth scaling':'pilot','Lessons from shipping AI for real service teams':'service'};
  view.querySelectorAll('.posts article').forEach(a=>{const k=posts[a.querySelector('h2')?.textContent.trim()];if(!k)return;let l=a.querySelector('a');if(!l){l=document.createElement('a');while(a.firstChild)l.append(a.firstChild);a.append(l)}l.setAttribute('href','/blog/'+k)});
  const form=view.querySelector('form');if(form)form.onsubmit=e=>{e.preventDefault();form.querySelector('.feedback').textContent='Preview only · your message was not sent.'};
  nav&&nav.querySelectorAll('a').forEach(a=>{const h=a.getAttribute('href');a.classList.toggle('current',h==='/'?path==='/':path===h||path.startsWith(h+'/'))});
}

/* ---------- router ---------- */
const legacy={'/index.html':'/','/work.html':'/work','/blog.html':'/blog','/contact.html':'/contact','/case-umc-ai.html':'/work/umc','/work/umc-ai':'/work/umc','/work/umc-web':'/work/umc','/blog-detail.html':'/blog/operating-model'};
function clean(p){p=legacy[p]||p;if(p.length>1)p=p.replace(/\/+$/,'');return p||'/'}
let token=0,current=null;
async function render(url,{push=false,scroll=true}={}){
  const u=new URL(url,location.origin),path=clean(u.pathname),my=++token;
  const res=await resolve(path);if(my!==token)return;
  const swap=()=>{
    view.innerHTML=res.html;
    if(res.seo)seo(path,res.seo);else getJSON('/data/routes.json').then(R=>seo(path,R[path]),()=>{});
    if(push)history.pushState({},'',path+u.search+u.hash);else history.replaceState({},'',path+u.search+u.hash);
    bind(path);current=path;nav&&nav.classList.remove('open');
    view.classList.remove('enter');void view.offsetWidth;view.classList.add('enter');
    if(u.hash&&document.querySelector(u.hash)){document.querySelector(u.hash).scrollIntoView()}else if(scroll)window.scrollTo(0,0);
  };
  if(current&&!matchMedia('(prefers-reduced-motion: reduce)').matches){view.classList.add('leave');await new Promise(r=>setTimeout(r,140));view.classList.remove('leave');if(my!==token)return}
  swap();
}
document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a');if(!a||a.target||a.hasAttribute('download'))return;
  const href=a.getAttribute('href');if(!href)return;
  const u=new URL(a.href,location.href);if(u.origin!==location.origin)return;
  if(/\.(png|jpe?g|webp|svg|pdf|xml|json|txt)$/i.test(u.pathname)||u.pathname.startsWith('/cms'))return;
  if(u.pathname===location.pathname&&u.hash){return}
  e.preventDefault();render(u.pathname+u.search+u.hash,{push:true});
});
addEventListener('popstate',()=>render(location.pathname+location.search+location.hash,{scroll:false}));
render(location.pathname+location.search+location.hash);
})();
