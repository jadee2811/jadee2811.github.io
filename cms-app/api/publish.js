import { read } from './catalog.js';
const repo = 'jadee2811/jadee2811.github.io';
const origin = 'https://jadeshare.space';

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cleanHtml = value => String(value || '').replace(/<(script|style|iframe|object|svg|math)[\s\S]*?<\/\1\s*>/gi,'').replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,(tag,name)=>{name=name.toLowerCase();if(!['p','h2','h3','strong','b','em','i','ul','ol','li','blockquote','br','a','code','pre'].includes(name))return '';if(tag.startsWith('</'))return '</'+name+'>';if(name==='a'){const m=tag.match(/href\s*=\s*["']([^"']*)["']/i);return m&&/^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(m[1])?'<a href="'+escapeHtml(m[1])+'">':'<a>'}return '<'+name+'>'});
const slugFor = value => {
  const slug = String(value || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 80);
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null;
};
const documentFor = (type, content, seo, items=[]) => {
  let toc=[]; const body=cleanHtml(content.Body).replace(/<h2>([\s\S]*?)<\/h2>/g,(_,text)=>{const id='section-'+(toc.length+1);toc.push('<a href="#'+id+'">'+text+'</a>');return '<h2 id="'+id+'">'+text+'</h2>'});
  const related=items.filter(x=>(content.Related||[]).includes(x.id)&&x.id!==content.id);
  const blog = type === 'blog';
  const title = escapeHtml(seo.title || content.Title);
  const description = escapeHtml(seo.description || content.Excerpt);
  const url = `${origin}/${type}/${content.Slug}.html`;
  const schema = JSON.stringify({'@context':'https://schema.org','@type':blog ? 'BlogPosting' : 'CreativeWork',headline:seo.title || content.Title,description:seo.description || content.Excerpt,url,author:{'@type':'Person',name:'Jade'}});
  const tags = String(content.Tags || '').split(',').map(tag => tag.trim()).filter(Boolean);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Jade Share</title><meta name="description" content="${description}"><link rel="canonical" href="${url}"><meta property="og:title" content="${title} | Jade Share"><meta property="og:description" content="${description}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><script type="application/ld+json">${schema.replace(/</g,'\\u003c')}</script><link rel="stylesheet" href="/style.css"><style>main{max-width:1100px;margin:auto;padding:56px 24px 100px}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:.76rem}.grid{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:54px}.prose{font-size:1.08rem;line-height:1.8}.prose h2{margin-top:2em}.rail{height:max-content;position:sticky;top:24px;border-left:1px solid #d7ddd7;padding-left:22px}.tags span{display:inline-block;margin:0 8px 8px 0;padding:5px 10px;border:1px solid #d7ddd7;border-radius:20px;font-size:.85rem}@media(max-width:780px){.grid{grid-template-columns:1fr}.rail{position:static;border-left:0;border-top:1px solid #d7ddd7;padding:20px 0}}</style></head><body><main><p class="eyebrow">${escapeHtml(content.Category || type)}</p><h1>${title}</h1><p>${description}</p><p class="tags">${tags.map(tag => `<span>#${escapeHtml(tag)}</span>`).join('')}</p><div class="grid"><article class="prose">${body}</article><aside class="rail"><h2>Contents</h2>${toc.join("<br>")}<h2>Start a conversation</h2><p>Exploring a complex product, AI or growth problem?</p><p><a href="/contact.html">Contact Jade →</a></p></aside></div><section><h2>Related ${blog ? "articles" : "work"}</h2>${related.map(x=>`<p><a href="/${x.type}/${escapeHtml(x.Slug)}.html">${escapeHtml(x.Title)}</a></p>`).join("")}</section><p><a href="/${blog ? 'blog.html' : 'work.html'}">← Back to ${blog ? 'Blog' : 'Work'}</a></p></main></body></html>`;
};
const gh = (path, init = {}) => fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {...init,headers:{accept:'application/vnd.github+json',authorization:`Bearer ${process.env.GITHUB_TOKEN}`,'x-github-api-version':'2022-11-28',...(init.headers || {})}});
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  if (!process.env.GITHUB_TOKEN || !process.env.CMS_ACCESS_KEY) return res.status(503).json({error:'Publisher is not configured'});
  if (req.headers.authorization !== `Bearer ${process.env.CMS_ACCESS_KEY}`) return res.status(401).json({error:'Unauthorized'});
  const {content, seo = {}} = req.body || {};
  const type = content?.type === 'work' ? 'work' : content?.type === 'blog' ? 'blog' : null;
  const slug = slugFor(content?.Slug);
  if (!type || !slug || !String(content?.Title || '').trim() || !String(content?.Excerpt || '').trim() || !String(content?.Body || '').trim()) return res.status(400).json({error:'Title, slug, excerpt and rich-text body are required.'});
  content.Slug = slug;
  const path = `${type}/${slug}.html`;
  try {
  const api=async(p,init={})=>{const r=await fetch('https://api.github.com/repos/'+repo+'/'+p,{...init,headers:{authorization:'Bearer '+process.env.GITHUB_TOKEN,accept:'application/vnd.github+json','content-type':'application/json'}});if(!r.ok)throw Error('GitHub '+r.status);return r.json()};
  const head=await api('git/ref/heads/main');
  const catalog = await read(head.object.sha);
  const old = catalog.items.find(x=>x.id===content.id);
  if(old && (old.Slug!==slug || old.type!==type)) return res.status(400).json({error:'Không đổi slug của bài đã đăng.'});
  if(catalog.items.some(x=>x.id!==content.id && x.type===type && x.Slug===slug)) return res.status(409).json({error:'Slug đã tồn tại.'});
  if(old && old.version!==content.version) return res.status(409).json({error:'Bài đã thay đổi. Tải lại trước khi sửa.'});
  const now=new Date().toISOString();
  const item={...content,Body:cleanHtml(content.Body),id:content.id||crypto.randomUUID(),seo,Status:'Published',version:now,updatedAt:now};
  const items=catalog.items.filter(x=>x.id!==item.id).concat(item);
  const commit=await api('git/commits/'+head.object.sha);
  const changes=[{path,content:documentFor(type,item,seo,items)},{path:'content/published.json',content:JSON.stringify(items,null,2)}];
  const readText=async p=>{const f=await api('contents/'+p+'?ref='+head.object.sha);return Buffer.from(f.content,'base64').toString('utf8')};
  for(const kind of ['blog','work']){
    let html=await readText(kind+'.html');
    const section='<section id="cms-published"><h2>Latest '+(kind==='blog'?'articles':'work')+'</h2>'+items.filter(x=>x.type===kind).map(x=>'<article><p>'+escapeHtml(x.Category)+'</p><h2><a href="/'+kind+'/'+escapeHtml(x.Slug)+'.html">'+escapeHtml(x.Title)+'</a></h2><p>'+escapeHtml(x.Excerpt)+'</p></article>').join('')+'</section>';
    html=html.replace(/<section id="cms-published">[\s\S]*?<\/section>/,'');
    html=html.replace('</main>',section+'</main>');
    changes.push({path:kind+'.html',content:html});
  }
  let sitemap=await readText('sitemap.xml');
  if(!sitemap.includes('<loc>'+origin+'/'+path+'</loc>'))sitemap=sitemap.replace('</urlset>','<url><loc>'+origin+'/'+path+'</loc></url></urlset>');
  changes.push({path:'sitemap.xml',content:sitemap});
  const tree=await api('git/trees',{method:'POST',body:JSON.stringify({base_tree:commit.tree.sha,tree:changes.map(x=>({...x,type:'blob',mode:'100644'}))})});
  const next=await api('git/commits',{method:'POST',body:JSON.stringify({message:'CMS: publish '+slug,tree:tree.sha,parents:[head.object.sha]})});
  await api('git/refs/heads/main',{method:'PATCH',body:JSON.stringify({sha:next.sha,force:false})});
  return res.status(200).json({ok:true,path:origin+'/'+path});
  }catch(e){return res.status(502).json({error:e.message})}
}
