const repo = 'jadee2811/jadee2811.github.io';
const origin = 'https://jadeshare.space';

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const cleanHtml = value => String(value || '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
const slugFor = value => {
  const slug = String(value || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 80);
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null;
};
const documentFor = (type, content, seo) => {
  const blog = type === 'blog';
  const title = escapeHtml(seo.title || content.Title);
  const description = escapeHtml(seo.description || content.Excerpt);
  const url = `${origin}/${type}/${content.Slug}.html`;
  const schema = JSON.stringify({'@context':'https://schema.org','@type':blog ? 'BlogPosting' : 'CreativeWork',headline:seo.title || content.Title,description:seo.description || content.Excerpt,url,author:{'@type':'Person',name:'Jade'}});
  const tags = String(content.Tags || '').split(',').map(tag => tag.trim()).filter(Boolean);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Jade Share</title><meta name="description" content="${description}"><link rel="canonical" href="${url}"><meta property="og:title" content="${title} | Jade Share"><meta property="og:description" content="${description}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><script type="application/ld+json">${schema}</script><link rel="stylesheet" href="/style.css"><style>main{max-width:1100px;margin:auto;padding:56px 24px 100px}.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:.76rem}.grid{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:54px}.prose{font-size:1.08rem;line-height:1.8}.prose h2{margin-top:2em}.rail{height:max-content;position:sticky;top:24px;border-left:1px solid #d7ddd7;padding-left:22px}.tags span{display:inline-block;margin:0 8px 8px 0;padding:5px 10px;border:1px solid #d7ddd7;border-radius:20px;font-size:.85rem}@media(max-width:780px){.grid{grid-template-columns:1fr}.rail{position:static;border-left:0;border-top:1px solid #d7ddd7;padding:20px 0}}</style></head><body><main><p class="eyebrow">${escapeHtml(content.Category || type)}</p><h1>${title}</h1><p>${description}</p><p class="tags">${tags.map(tag => `<span>#${escapeHtml(tag)}</span>`).join('')}</p><div class="grid"><article class="prose">${cleanHtml(content.Body)}</article><aside class="rail"><h2>Start a conversation</h2><p>Exploring a complex product, AI or growth problem?</p><p><a href="/contact.html">Contact Jade →</a></p></aside></div><p><a href="/${blog ? 'blog.html' : 'work.html'}">← Back to ${blog ? 'Blog' : 'Work'}</a></p></main></body></html>`;
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
  const existing = await gh(path);
  let sha;
  if (existing.ok) sha = (await existing.json()).sha;
  else if (existing.status !== 404) return res.status(502).json({error:'Could not check existing page'});
  const write = await gh(path,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({message:`CMS: publish ${type} ${slug}`,content:Buffer.from(documentFor(type,content,seo),'utf8').toString('base64'),...(sha ? {sha} : {})})});
  if (!write.ok) return res.status(502).json({error:'GitHub rejected publish request'});
  return res.status(200).json({ok:true,path:`${origin}/${path}`});
}