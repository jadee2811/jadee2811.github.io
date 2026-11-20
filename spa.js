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
let lb=document.querySelector('.lang'),nav=document.querySelector('header nav');
function setLang(){document.documentElement.lang=lang}
let menu=document.querySelector('.menu');if(menu&&nav)menu.onclick=()=>nav.classList.toggle('open');
async function shellFor(L){
  if(document.documentElement.lang===L)return;
  try{const h=await (await fetch(L==='vi'?'/vi/':'/',{cache:'no-cache'})).text(),d=new DOMParser().parseFromString(h,'text/html');
    ['header','footer'].forEach(t=>{const a=document.querySelector(t),b=d.querySelector(t);if(a&&b)a.replaceWith(b)});
    document.documentElement.lang=L;lb=document.querySelector('.lang');nav=document.querySelector('header nav');menu=document.querySelector('.menu');if(menu&&nav)menu.onclick=()=>nav.classList.toggle('open')}catch(e){}
}

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
  return '<section class="sc-related"><label>'+T[L].related+'</label><div class="cards">'+pick.map(k=>{const r=REL[k],nm=L==='vi'?REL_VI[k]:r[0];return '<a class="card" href="/work/'+k+'"><div class="art '+r[2]+'"><img src="assets/'+r[1]+'.svg" alt="'+esc(nm)+'" loading="lazy"><i>↗︎</i></div><h2>'+esc(nm)+'</h2></a>'}).join('')+'</div></section>';
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
  return{html:'<section class="article-hero"><div class="article-heading"><label>'+d[0]+' · '+t.field+'</label><h1>'+d[1]+'</h1><p>'+d[2]+'</p><div class="article-by">'+t.by+'</div></div><img src="/assets/blog/'+slug+'.svg" alt="'+esc(d[1])+'" loading="eager"></section><section class="article-body"><aside><b>'+t.toc+'</b><a href="#start">'+t.t1+'</a><a href="#handoff">'+t.t2+'</a><a href="#scale">'+t.t3+'</a></aside><article><p class="standfirst">'+t.stand+'</p><h2 id="start">'+t.h1+'</h2><p>'+t.p1+'</p><h2 id="handoff">'+t.h2+'</h2><p>'+t.p2+'</p><blockquote>'+t.q+'</blockquote><figure class="article-image"><img src="/assets/blog/'+slug+'-2.svg" alt="" loading="lazy"></figure><h2 id="scale">'+t.h3+'</h2><p>'+t.p3+'</p><p><a class="more" href="/blog">'+t.backblog+'</a></p></article></section>'};
}
const PAGES={'/':'home','/about':'about','/work':'work','/blog':'blog','/contact':'contact','/sitemap':'sitemap','/blog/operating-model':'operating-model','/blog/ai-veterinary-clinics':'ai-veterinary-clinics','/blog/sme-ai-implementation-challenges':'sme-ai-implementation-challenges','/blog/sme-affordable-ai-chatbots':'sme-affordable-ai-chatbots','/blog/sme-ai-perception-gap':'sme-ai-perception-gap','/blog/ai-manufacturing-vietnam-sea':'ai-manufacturing-vietnam-sea','/blog/revenue-ai-os':'revenue-ai-os','/blog/retail-sales-vs-profit':'retail-sales-vs-profit','/blog/revenue-vs-profit-growth':'revenue-vs-profit-growth','/blog/ai-access-to-capability':'ai-access-to-capability','/blog/sea-retail-growth-scale':'sea-retail-growth-scale','/blog/ai-consumer-electronics':'ai-consumer-electronics','/blog/ai-beauty-retail':'ai-beauty-retail','/blog/ai-automotive-retail':'ai-automotive-retail','/blog/ai-travel-hospitality':'ai-travel-hospitality'};
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
  if(!current)await shellFor(L);
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

/* ---------- scroll to top ---------- */
(()=>{const b=document.createElement('button');b.className='to-top';b.type='button';b.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
const lab=()=>{const t=document.documentElement.lang==='vi'?'Lên đầu trang':'Back to top';b.setAttribute('aria-label',t);b.title=t};lab();
b.onclick=()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
const on=()=>{b.classList.toggle('show',scrollY>500);lab()};addEventListener('scroll',on,{passive:true});on();document.body.append(b)})();

/* chat widget: same 6px corners as the site's buttons */
(()=>{let n=0;const t=setInterval(()=>{const w=document.querySelector('jason-widget');if(w){w.style.setProperty('--button-radius','6px');w.style.setProperty('--icon-button-radius','6px');const r=w.shadowRoot;if(r&&!r.querySelector('#jade-corners')){const s=document.createElement('style');s.id='jade-corners';s.textContent='.tag,.suggestions>button{border-radius:6px!important}@media(max-width:760px){.ui-launcher-note .suggestions{display:none!important}}';r.append(s)}if(r&&r.querySelector('#jade-corners')){clearInterval(t)}}else if(++n>80)clearInterval(t)},250)})();

/* ---------- intro: night sky, falling star, star-shaped zoom into the home page ---------- */
(()=>{
  const p=location.pathname.replace(/\/+$/,'');
  if(p!==''&&p!=='/vi')return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647,R=(a,b)=>a+rnd()*(b-a);
  const S4=(r)=>`M0-${r}L${r*.26}-${r*.26}L${r} 0L${r*.26} ${r*.26}L0 ${r}L-${r*.26} ${r*.26}L-${r} 0L-${r*.26}-${r*.26}Z`;
  let st='';
  for(let i=0;i<230;i++){const x=R(0,1440),y=R(0,560)*R(.55,1),r=R(.5,2);st+=`<circle class="i-st" style="animation-delay:${R(0,3).toFixed(2)}s;animation-duration:${R(1.6,3.4).toFixed(1)}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="#fff"/>`}
  for(let i=0;i<16;i++){const x=R(30,1410),y=R(20,430),r=R(5,10);st+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><path class="i-tw4" style="animation-delay:${R(0,3).toFixed(2)}s" d="${S4(r)}" fill="#fff6d8"/></g>`}
  const conifer=(x,y,s,c1,c2)=>`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})"><rect x="-4" y="-6" width="8" height="26" fill="#1a1410"/><path d="M0-120L34-50H14L44 0H-44L-14-50H-34Z" fill="${c1}"/></g>`;
  const round=(x,y,s,c)=>`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})"><path d="M-7 0L-5-60H5L7 0Z" fill="#1a1410"/><circle cx="0" cy="-95" r="55" fill="${c}"/><circle cx="-38" cy="-70" r="38" fill="${c}"/><circle cx="38" cy="-70" r="38" fill="${c}"/><circle cx="-14" cy="-120" r="30" fill="#ffffff10"/></g>`;
  const tall=(x,y,s,c1,c2)=>`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})"><rect x="-8" y="-30" width="16" height="70" fill="#1a1410"/><path d="M0-230L70-110H-70Z" fill="${c2}"/><path d="M0-170L90-30H-90Z" fill="${c1}"/></g>`;
  let back='',mid='',front='',flowers='';
  for(let x=-10;x<1460;x+=R(34,60))back+=conifer(x,R(612,640),R(.55,.9),'#0f3a31');
  [[110,.85],[300,1.2],[520,.8],[740,1.05],[930,.8],[1130,1.25],[1330,.9]].forEach(([x,s],k)=>mid+=k%3==1?tall(x,690,s,'#0a2c24','#0e3830'):conifer(x,700,s*2,k%2?'#0c3128':'#0a2a22'));
  [[60,1.5],[210,1.0],[420,1.3],[640,1.0],[860,1.45],[1060,1.0],[1250,1.5],[1400,1.1]].forEach(([x,s],k)=>front+=k%2?round(x,745+R(0,20),s,'#072a22'):conifer(x,760+R(0,15),s*1.5,'#061f1a'));
  for(let i=0;i<46;i++){const x=R(0,1440),y=R(735,795),c=['#d9a77a','#e8d9b4','#c98a7a','#cfd8d0'][i%4];flowers+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${R(2,3.6).toFixed(1)}" fill="${c}" opacity=".8"/>`}
  const d=document.createElement('div');d.id='intro';d.setAttribute('aria-hidden','true');
  d.innerHTML=`<svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="i-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050f1c"/><stop offset=".6" stop-color="#0b2a2a"/><stop offset="1" stop-color="#14473c"/></linearGradient>
    <linearGradient id="i-dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3d6"/><stop offset="1" stop-color="#f6f4ed"/></linearGradient>
    <radialGradient id="i-moon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
    <mask id="i-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="800"><rect width="1440" height="800" fill="#fff"/><g transform="translate(720 400)"><path class="i-hole" d="${S4(1)}" fill="#000"/></g></mask>
  </defs>
  <g mask="url(#i-mask)">
    <rect width="1440" height="800" fill="url(#i-night)"/>
    <rect class="i-dawn" width="1440" height="800" fill="url(#i-dawn)"/>
    <g class="i-sky">${st}</g>
    <circle cx="1130" cy="150" r="150" fill="url(#i-moon)" class="i-glow"/>
    <circle cx="1130" cy="150" r="46" fill="#fff3cf"/>
    <g class="i-forest">
      <path d="M0 600 Q300 560 620 610 T1440 585 V800H0Z" fill="#0c3a30"/>
      <g>${back}</g>
      <path d="M0 665 Q380 625 760 675 T1440 655 V800H0Z" fill="#0a2e26"/>
      <g>${mid}</g>
      <path d="M0 725 Q380 695 760 735 T1440 715 V800H0Z" fill="#061c17"/>
      <path d="M560 800C610 770 650 760 630 730" stroke="#24463a" stroke-width="16" fill="none" stroke-linecap="round" opacity=".7"/>
      <g>${front}</g>
      <g>${flowers}</g>
    </g>
    <g class="i-shoot"><g class="i-blink"><path d="${S4(15)}" fill="#f2c46d"/></g></g>
  </g>
  <g transform="translate(720 400)"><g class="i-corewrap"><path class="i-core" d="${S4(1)}" fill="#f2c46d"/></g></g>
  </svg>`;
  const css=document.createElement('style');css.textContent=`
#intro{position:fixed;inset:0;z-index:2147483600;background:transparent;cursor:pointer;animation:i-out .5s ease 5.2s forwards}
#intro svg{position:absolute;inset:0;width:100%;height:100%}
#intro .i-st{animation:i-tw 2.4s ease-in-out infinite}
#intro .i-tw4,#intro .i-blink,#intro .i-corewrap{transform-box:fill-box;transform-origin:center}
#intro .i-tw4{animation:i-blink 2.6s ease-in-out infinite}
#intro .i-blink{animation:i-blink 1.1s ease-in-out infinite;filter:drop-shadow(0 0 6px #f2c46d)}
#intro .i-corewrap{animation:i-blink 1.3s ease-in-out infinite}
#intro .i-glow{animation:i-gl 3s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
#intro .i-dawn{opacity:0;animation:i-dawn 1.6s ease-in 3.5s forwards}
#intro .i-sky,#intro .i-forest{animation:i-fade 1.4s ease-in 3.8s forwards}
#intro .i-shoot{animation:i-shoot 2.4s cubic-bezier(.35,0,.55,1) .4s both;transform:translate(1010px,-40px)}
#intro .i-hole{transform-box:fill-box;transform-origin:center;transform:scale(0);animation:i-zoom 1.7s cubic-bezier(.65,0,.35,1) 3.4s forwards}
#intro .i-core{transform-box:fill-box;transform-origin:center;transform:scale(0);filter:drop-shadow(0 0 12px #f2c46d);animation:i-core 1.6s ease-out 2.6s forwards}
body.intro-lock{overflow:hidden}
@keyframes i-tw{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes i-blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
@keyframes i-gl{from{transform:scale(.94)}to{transform:scale(1.06)}}
@keyframes i-shoot{0%{transform:translate(1010px,-40px);opacity:0}12%{opacity:1}100%{transform:translate(720px,400px);opacity:1}}
@keyframes i-core{0%{transform:scale(0);opacity:0}100%{transform:scale(30);opacity:1}}
@keyframes i-zoom{0%{transform:scale(0)}100%{transform:scale(3000)}}
@keyframes i-dawn{to{opacity:1}}
@keyframes i-fade{to{opacity:0}}
@keyframes i-out{to{opacity:0;visibility:hidden}}
`;
  document.head.append(css);document.body.append(d);document.body.classList.add('intro-lock');
  const end=()=>{d.remove();css.remove();document.body.classList.remove('intro-lock')};
  d.addEventListener('click',end);setTimeout(end,6000);
})();

/* mobile: language switch lives inside the hamburger menu */
(()=>{const mq=matchMedia('(max-width:760px)');const place=()=>{const h=document.querySelector('header'),n=h&&h.querySelector('nav'),l=document.querySelector('.lang');if(!h||!n||!l)return;if(mq.matches){if(l.parentNode!==n)n.append(l)}else if(l.parentNode!==h)h.append(l)};place();mq.addEventListener('change',place);addEventListener('load',place);document.addEventListener('click',()=>setTimeout(place,50))})();
