(function(){
'use strict';
const siteUrl='https://jadeshare.space';
const view=document.getElementById('view');
const langOf=p=>/^\/vi(\/|$)/.test(p)?'vi':'en';
const baseOf=p=>p.replace(/^\/vi(?=\/|$)/,'')||'/';
const pre=l=>l==='vi'?'/vi':'';
const T={en:{client:'Client',role:'Role',year:'Year',project:'PROJECT',personal:'PERSONAL PROJECT',back:'← Back to work',related:'RELATED PROJECTS',hidden:'Not published',hiddenD:'This project is not published yet.',home:'Home',preview:'Preview only · your message was not sent.',
  field:'FIELD NOTE',by:'By Jade · Jade Share',toc:'TABLE OF CONTENTS',t1:'01 Start with the decision',t2:'02 Map the handoff',t3:'03 Scale the system',stand:'These notes are a framework for discussing product and AI delivery. They do not represent a claim about a single client outcome.',
  h1:'Start with the recurring decision',p1:'Look first at the repeated decision a team makes, the context it requires and the consequence of getting it wrong. This reveals the useful unit of work before a feature or tool enters the discussion.',h2:'Map the handoffs',p2:'Document where information changes hands, where it is lost and where someone must review it. Clear handoffs make a workflow easier to evaluate and improve.',q:'Useful systems are defined by the workflow around a decision, not only by the quality of a single response.',h3:'Scale the system, not the demo',p3:'Scaling changes ownership, data, training and exception handling. A sustainable plan keeps those conditions visible from the start.',backblog:'Back to Jade Share →',nfT:'Page not found (404) | Jade',nfD:'This page does not exist or has moved. Head back to the Jade Share home page or browse the selected work.'},
 vi:{client:'Khách hàng',role:'Vai trò',year:'Năm',project:'DỰ ÁN',personal:'DỰ ÁN CÁ NHÂN',back:'← Quay lại dự án',related:'DỰ ÁN LIÊN QUAN',hidden:'Chưa công bố',hiddenD:'Dự án này chưa được công bố.',home:'Trang chủ',preview:'Chỉ là bản xem thử · tin nhắn của bạn chưa được gửi.',
  field:'GHI CHÉP',by:'Bởi Jade · Jade Share',toc:'MỤC LỤC',t1:'01 Bắt đầu từ quyết định',t2:'02 Vẽ bản đồ bàn giao',t3:'03 Mở rộng hệ thống',stand:'Những ghi chép này là một khung để trao đổi về sản phẩm và triển khai AI. Chúng không nhằm khẳng định kết quả của một khách hàng cụ thể.',
  h1:'Bắt đầu từ quyết định lặp lại',p1:'Hãy nhìn trước hết vào quyết định mà một đội ngũ phải lặp lại, bối cảnh cần có và hậu quả khi quyết định sai. Điều này cho thấy đơn vị công việc hữu ích, trước khi một tính năng hay công cụ xuất hiện trong cuộc trao đổi.',h2:'Vẽ bản đồ các điểm bàn giao',p2:'Ghi lại nơi thông tin đổi tay, nơi nó thất lạc và nơi ai đó phải kiểm tra. Bàn giao rõ ràng giúp quy trình dễ đánh giá và cải thiện hơn.',q:'Hệ thống hữu ích được định nghĩa bằng quy trình xoay quanh một quyết định, không chỉ bằng chất lượng của một câu trả lời.',h3:'Mở rộng hệ thống, không phải bản demo',p3:'Mở rộng làm thay đổi quyền sở hữu, dữ liệu, đào tạo và cách xử lý ngoại lệ. Một kế hoạch bền vững giữ những điều kiện đó hiện rõ ngay từ đầu.',backblog:'Quay lại Jade Share →',nfT:'Không tìm thấy trang (404) | Jade',nfD:'Trang này không tồn tại hoặc đã được chuyển. Hãy quay lại trang chủ Jade Share hoặc xem các dự án tiêu biểu.'}};
const REL_VI={umc:'UMC: Nền tảng y tế số','money-forward':'Money Forward Vietnam: trải nghiệm số','jungle-boss':'Jungle Boss: trải nghiệm du lịch mạo hiểm','truong-son':'Trường Sơn: nền tảng đấu giá trực tuyến','viettel-store':'Viettel Store: trợ lý tư vấn bán hàng AI','rang-dong':'Rạng Đông: thương mại đại lý có AI hỗ trợ','media-mart':'MediaMart: AI bán hàng và chăm sóc khách hàng'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cache={};
const getJSON=u=>cache[u]||(cache[u]=fetch(u).then(r=>{if(!r.ok)throw new Error(u);return r.json()}));
const getText=u=>cache[u]||(cache[u]=fetch(u).then(r=>{if(!r.ok)throw new Error(u);return r.text()}));

/* ---------- SEO ---------- */
function meta(sel,attr,val){let e=document.querySelector(sel);if(!e){e=document.createElement('meta');const m=sel.match(/\[(name|property)="([^"]+)"\]/);if(m)e.setAttribute(m[1],m[2]);document.head.append(e)}e.setAttribute(attr,val)}
function canonical(url){let l=document.querySelector('link[rel="canonical"]');if(!l){l=document.createElement('link');l.rel='canonical';document.head.append(l)}l.href=url}
function ld(data){let s=document.querySelector('script[type="application/ld+json"]');if(!s){s=document.createElement('script');s.type='application/ld+json';document.head.append(s)}s.textContent=JSON.stringify(data)}
const person={'@type':'Person','@id':siteUrl+'/#jade',name:'Jade',url:siteUrl+'/',jobTitle:'AI Product Owner and AI Growth Advisor',sameAs:['https://www.linkedin.com/in/jadeshare/','https://www.facebook.com/jadeshare.space/']};
function seo(fullPath,r,R){
  if(!r)return;const L=langOf(fullPath),path=baseOf(fullPath),px=pre(L),url=siteUrl+(fullPath==='/vi'?'/vi/':fullPath),img=siteUrl+'/'+(r.image||'assets/og/default.png'),label=r.label||r.title,alt=label+' | Jade Share';
  document.title=r.title;meta('meta[name="description"]','content',r.description);
  meta('meta[name="robots"]','content',r.noindex?'noindex,follow':'index,follow,max-image-preview:large,max-snippet:-1');
  [['og:title',r.title],['og:description',r.description],['og:type',path.startsWith('/blog/')?'article':'website'],['og:url',url],['og:image',img],['og:image:alt',alt],['og:site_name','Jade Share'],['og:locale',L==='vi'?'vi_VN':'en_US']].forEach(([k,v])=>meta('meta[property="'+k+'"]','content',v));
  [['twitter:card','summary_large_image'],['twitter:title',r.title],['twitter:description',r.description],['twitter:image',img],['twitter:image:alt',alt]].forEach(([k,v])=>meta('meta[name="'+k+'"]','content',v));
  canonical(url);
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(x=>x.remove());
  if(!r.noindex){[['en',siteUrl+path],['vi',siteUrl+'/vi'+path],['x-default',siteUrl+path]].forEach(([h,u])=>{const l=document.createElement('link');l.rel='alternate';l.hreflang=h;l.href=u;document.head.append(l)})}
  const type=path==='/'?'WebPage':path==='/about'?'AboutPage':path==='/blog'?'Blog':path==='/contact'?'ContactPage':(path==='/work'||path==='/sitemap')?'CollectionPage':path.startsWith('/blog/')?'BlogPosting':'CreativeWork';
  const node={'@type':type,'@id':url+'#page',name:r.title,url,description:r.description,image:img,inLanguage:L,author:{'@id':person['@id']},isPartOf:{'@id':siteUrl+'/#website'}};
  if(type==='BlogPosting'){node.headline=label;node.mainEntityOfPage=url;node.publisher={'@type':'Organization',name:'Jade Share',url:siteUrl+'/'}}
  const g=[person,{'@type':'WebSite','@id':siteUrl+'/#website',name:'Jade Share',url:siteUrl+'/',publisher:{'@id':person['@id']}},node];
  if(path!=='/'&&!r.noindex){const parts=path.split('/').filter(Boolean),c=[[T[L].home,siteUrl+px+'/']];if(parts.length>1){const par='/'+parts[0];c.push([(R&&R[par]&&R[par].label)||parts[0],siteUrl+px+par])}c.push([label,url]);g.push({'@type':'BreadcrumbList',itemListElement:c.map((x,i)=>({'@type':'ListItem',position:i+1,name:x[0],item:x[1]}))})}
  if(r.noindex){document.querySelectorAll('link[rel="canonical"]').forEach(l=>l.remove());const s=document.querySelector('script[type="application/ld+json"]');if(s)s.remove()}else ld({'@context':'https://schema.org','@graph':g});
}

/* ---------- language, menu ---------- */
let lang=langOf(location.pathname);
const lb=document.querySelector('.lang'),nav=document.querySelector('header nav');
function setLang(){document.documentElement.lang=lang}
const menu=document.querySelector('.menu');if(menu&&nav)menu.onclick=()=>nav.classList.toggle('open');

/* ---------- renderers ---------- */
const BLOCKS={
heading:b=>'<h2>'+esc(b.text)+'</h2>',
paragraph:b=>'<p>'+esc(b.text)+'</p>',
quote:b=>'<blockquote>'+esc(b.text)+'</blockquote>',
list:b=>'<ul>'+b.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul>',
steps:b=>'<ol class="sc-steps">'+b.items.map((i,n)=>'<li><b>'+String(n+1).padStart(2,'0')+'</b><div><strong>'+esc(i[0])+'</strong>'+(i[1]?'<span>'+esc(i[1])+'</span>':'')+'</div></li>').join('')+'</ol>',
stats:b=>'<div class="sc-stats">'+b.items.map(i=>'<div><em>'+esc(i[0])+'</em><span>'+esc(i[1])+'</span></div>').join('')+'</div>',
image:b=>'<figure>'+(b.src?'<img src="'+esc(b.src)+'" alt="'+esc(b.alt||b.caption||'')+'" loading="lazy">':'<div class="sc-ph">'+esc(b.caption||'Hình minh hoạ')+'</div>')+(b.src&&b.caption?'<figcaption>'+esc(b.caption)+'</figcaption>':'')+'</figure>',
embed:b=>'<div class="sc-embed"><iframe src="'+esc(b.src)+'" loading="lazy" allowfullscreen></iframe></div>',
link:b=>'<p><a class="more" href="'+esc(b.href)+'">'+esc(b.text)+' →</a></p>'};
const REL={umc:['UMC Digital Health Platform','umc-web','health','web'],'money-forward':['Money Forward Vietnam Digital Experience','money-forward','tech','web'],'jungle-boss':['Jungle Boss Adventure Travel Experience','jungle-boss','travel','web'],'truong-son':['Trường Sơn Online Auction Platform','truong-son','auction','web'],'viettel-store':['Viettel Store AI Sales Advisor','viettel-store','viettel','ai'],'rang-dong':['Rạng Đông AI-Assisted Dealer Commerce','rang-dong','rangdong','ai'],'media-mart':['MediaMart AI Sales & Customer Service','media-mart','media','ai']};
function related(slug,L){
  const me=REL[slug];if(!me)return'';const keys=Object.keys(REL),same=keys.filter(k=>k!==slug&&REL[k][3]===me[3]);
  const i=keys.indexOf(slug),order=same.slice().sort((a,b)=>((keys.indexOf(a)-i+keys.length)%keys.length)-((keys.indexOf(b)-i+keys.length)%keys.length));
  const pick=order.slice(0,2);if(!pick.length)return'';
  return '<section class="sc-related"><label>'+T[L].related+'</label><div class="cards">'+pick.map(k=>{const r=REL[k],nm=L==='vi'?REL_VI[k]:r[0];return '<a class="card" href="/work/'+k+'"><div class="art '+r[2]+'"><img src="assets/'+r[1]+'.svg" alt="'+esc(nm)+'" loading="lazy"><i>↗</i></div><h2>'+esc(nm)+'</h2></a>'}).join('')+'</div></section>';
}
async function showcase(slug,L){
  const d=await getJSON('/data/showcase/'+(L==='en'?'en/':'')+encodeURIComponent(slug)+'.json');
  if(d.status!=='published')return{html:'<section class="sc-hero"><h1>'+T[L].hidden+'</h1></section>',seo:{title:T[L].hidden+' | Jade',description:T[L].hiddenD,noindex:true}};
  return{html:'<div id="showcase">'+(d.cover?'<div class="sc-cover"><img src="'+esc(d.cover)+'" alt="'+esc(d.title)+'"></div>':'')+'<section class="sc-hero">'+'<label>'+esc(d.sector)+' · '+(d.kind==='personal'?T[L].personal:T[L].project)+'</label><h1>'+esc(d.title)+'</h1><p>'+esc(d.summary)+'</p>'
  +'<dl><div><dt>'+T[L].client+'</dt><dd>'+esc(d.client||'—')+'</dd></div><div><dt>'+T[L].role+'</dt><dd>'+esc(d.role)+'</dd></div><div><dt>'+T[L].year+'</dt><dd>'+esc(d.year)+'</dd></div></dl></section>'
  +'<section class="sc-body">'+d.blocks.map(b=>(BLOCKS[b.type]||(()=>''))(b)).join('')+'<p><a class="more" href="/work">'+T[L].back+'</a></p></section>'+related(slug,L)+'</div>',
  seo:{title:d.seoTitle||(d.title+' | Jade'),description:d.seoDescription||d.summary,label:d.client||d.title,image:/\.(png|jpe?g|webp)$/i.test(d.cover||'')?d.cover.replace(/^\//,''):'assets/og/default.png',fallback:true}};
}
async function caseStudy(slug,L){
  const d=(await getJSON(L==='vi'?'/data/content.vi.json':'/data/content.json')).cases[slug];if(!d)throw 0;
  return{html:'<section class="casehero"><label>'+d[0]+'</label><h1>'+d[2]+'</h1><div><span>CASE STUDY</span><span>PUBLIC-READY SUMMARY</span></div></section><section class="casebody"><aside>IN THIS CASE<br>Context<br>Experience focus<br>Delivery lens</aside><article><p class="lead">'+d[4]+'</p><figure class="case-image"><img src="assets/'+d[1]+'" alt="'+esc(d[2])+'" loading="eager"><figcaption>Project visual used for portfolio context.</figcaption></figure><label>01 / CONTEXT</label><h2>A system is only useful when its next step is clear.</h2><p>This portfolio case presents the experience and delivery lens. Client-specific data, individual responsibilities and outcome metrics are only included when approved and supported by an original source.</p><label>02 / EXPERIENCE FOCUS</label><h2>Design for context, control and recovery.</h2><p>The interface should make key information easy to scan, enable a clear action and provide a visible path when a person needs to step in.</p><label>03 / DELIVERY LENS</label><h2>Move from a convincing moment to an operating workflow.</h2><p>In practice, that means designing the handoffs, information structure and review points alongside the interaction itself.</p><p><a class="more" href="/work">Back to selected work →</a></p></article></section>'};
}
async function article(slug,L){
  const d=(await getJSON(L==='vi'?'/data/content.vi.json':'/data/content.json')).articles[slug];if(!d)throw 0;const t=T[L];
  return{html:'<section class="article-hero"><div class="article-heading"><label>'+d[0]+' · '+t.field+'</label><h1>'+d[1]+'</h1><p>'+d[2]+'</p><div class="article-by">'+t.by+'</div></div></section><section class="article-body"><aside><b>'+t.toc+'</b><a href="#start">'+t.t1+'</a><a href="#handoff">'+t.t2+'</a><a href="#scale">'+t.t3+'</a></aside><article><p class="standfirst">'+t.stand+'</p><h2 id="start">'+t.h1+'</h2><p>'+t.p1+'</p><h2 id="handoff">'+t.h2+'</h2><p>'+t.p2+'</p><blockquote>'+t.q+'</blockquote><h2 id="scale">'+t.h3+'</h2><p>'+t.p3+'</p><p><a class="more" href="/blog">'+t.backblog+'</a></p></article></section>'};
}
const PAGES={'/':'home','/about':'about','/work':'work','/blog':'blog','/contact':'contact','/sitemap':'sitemap','/blog/operating-model':'operating-model'};
const notFoundSeo=L=>({title:T[L].nfT,description:T[L].nfD,label:'404',noindex:true});
async function resolve(path,L){
  const dir=L==='vi'?'/pages/vi/':'/pages/';
  if(PAGES[path])return{html:await getText(dir+PAGES[path]+'.html')};
  let m;
  if(m=path.match(/^\/work\/([\w-]+)$/)){
    try{return await showcase(m[1],L)}catch(e){}
    try{return await caseStudy(m[1],L)}catch(e){}
  }
  if(m=path.match(/^\/blog\/([\w-]+)$/)){try{return await article(m[1],L)}catch(e){}}
  return{html:await getText(dir+'404.html'),seo:notFoundSeo(L)};
}

/* ---------- per-view behaviour ---------- */
function bind(path){
  setLang();
  const L=lang,px=pre(L);
  const lg=document.querySelector('a.lang');if(lg){const alt=L==='en'?'/vi'+(path==='/'?'/':path):path;lg.setAttribute('href',alt);lg.hreflang=L==='en'?'vi':'en'}
  if(L==='vi')view.querySelectorAll('a[href^="/"]').forEach(a=>{const h=a.getAttribute('href');if(!/^\/(vi(\/|$)|\/|cms|tools|assets|data|pages)/.test(h)&&!/\.(png|jpe?g|webp|svg|pdf|xml|json|txt)$/i.test(h))a.setAttribute('href',h==='/'?'/vi/':'/vi'+h)});
  view.querySelectorAll('a[href^="http"]').forEach(a=>{if(new URL(a.href).origin!==location.origin){a.target='_blank';a.rel='noopener noreferrer'}});
  const fs=view.querySelectorAll('[data-filter]'),cs=view.querySelectorAll('[data-category]');
  fs.forEach(f=>f.onclick=()=>{fs.forEach(x=>x.classList.remove('active'));f.classList.add('active');cs.forEach(c=>c.hidden=f.dataset.filter!=='all'&&c.dataset.category!==f.dataset.filter)});
  const slugs={'UMC Digital Health Platform':'umc','Money Forward Vietnam Digital Experience':'money-forward','Jungle Boss Adventure Travel Experience':'jungle-boss','Trường Sơn Online Auction Platform':'truong-son','Viettel Store AI Sales Advisor':'viettel-store','UMC AI-Powered Health Knowledge System':'umc','Rạng Đông AI-Assisted Dealer Commerce':'rang-dong','MediaMart AI Sales & Customer Service':'media-mart'};
  if(L==='en')view.querySelectorAll('.card').forEach(c=>{const t=c.querySelector('h2')?.textContent.trim();if(slugs[t])c.setAttribute('href','/work/'+slugs[t])});
  const posts={'Designing the workflow before choosing the tool':'workflow','What makes an enterprise pilot worth scaling':'pilot','Lessons from shipping AI for real service teams':'service'};
  if(L==='en')view.querySelectorAll('.posts article').forEach(a=>{const k=posts[a.querySelector('h2')?.textContent.trim()];if(!k)return;let l=a.querySelector('a');if(!l){l=document.createElement('a');while(a.firstChild)l.append(a.firstChild);a.append(l)}l.setAttribute('href','/blog/'+k)});
  const form=view.querySelector('form');if(form)form.onsubmit=e=>{e.preventDefault();form.querySelector('.feedback').textContent='Preview only · your message was not sent.'};
  nav&&nav.querySelectorAll('a').forEach(a=>{const h=baseOf(a.getAttribute('href'));a.classList.toggle('current',h==='/'?path==='/':path===h||path.startsWith(h+'/'))});
}

/* ---------- router ---------- */
const legacy={'/index.html':'/','/work.html':'/work','/blog.html':'/blog','/contact.html':'/contact','/case-umc-ai.html':'/work/umc','/work/umc-ai':'/work/umc','/work/umc-web':'/work/umc','/blog-detail.html':'/blog/operating-model'};
function clean(p){p=legacy[p]||p;if(p.length>1)p=p.replace(/\/+$/,'');return p||'/'}
let token=0,current=null;
async function render(url,{push=false,scroll=true}={}){
  const u=new URL(url,location.origin),full=clean(u.pathname),L=langOf(full),path=clean(baseOf(full)),my=++token;lang=L;
  const res=await resolve(path,L);if(my!==token)return;
  const swap=()=>{
    view.innerHTML=res.html;
    getJSON(L==='vi'?'/data/routes.vi.json':'/data/routes.json').then(R=>seo(full,(res.seo&&!res.seo.fallback)?res.seo:(R[path]||res.seo),R),()=>{if(res.seo)seo(full,res.seo)});
    const shown=full==='/vi'?'/vi/':full;if(push)history.pushState({},'',shown+u.search+u.hash);else history.replaceState({},'',shown+u.search+u.hash);
    bind(path);current=full;nav&&nav.classList.remove('open');
    view.classList.remove('enter');void view.offsetWidth;view.classList.add('enter');
    if(u.hash&&document.querySelector(u.hash)){document.querySelector(u.hash).scrollIntoView()}else if(scroll)window.scrollTo(0,0);
  };
  if(current&&!matchMedia('(prefers-reduced-motion: reduce)').matches){view.classList.add('leave');await new Promise(r=>setTimeout(r,140));view.classList.remove('leave');if(my!==token)return}
  swap();
}
document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a');if(!a||a.target||a.hasAttribute('download')||a.classList.contains('lang'))return;
  const href=a.getAttribute('href');if(!href)return;
  const u=new URL(a.href,location.href);if(u.origin!==location.origin)return;
  if(/\.(png|jpe?g|webp|svg|pdf|xml|json|txt)$/i.test(u.pathname)||u.pathname.startsWith('/cms'))return;
  if(u.pathname===location.pathname&&u.hash){return}
  e.preventDefault();render(u.pathname+u.search+u.hash,{push:true});
});
addEventListener('popstate',()=>render(location.pathname+location.search+location.hash,{scroll:false}));
render(location.pathname+location.search+location.hash);
})();
