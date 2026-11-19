(function(){
const root=document.getElementById('showcase');if(!root)return;
const slug=new URLSearchParams(location.search).get('p')||'umc';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const R={
heading:b=>'<h2>'+esc(b.text)+'</h2>',
paragraph:b=>'<p>'+esc(b.text)+'</p>',
quote:b=>'<blockquote>'+esc(b.text)+'</blockquote>',
list:b=>'<ul>'+b.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul>',
steps:b=>'<ol class="sc-steps">'+b.items.map((i,n)=>'<li><b>'+String(n+1).padStart(2,'0')+'</b><div><strong>'+esc(i[0])+'</strong>'+(i[1]?'<span>'+esc(i[1])+'</span>':'')+'</div></li>').join('')+'</ol>',
stats:b=>'<div class="sc-stats">'+b.items.map(i=>'<div><em>'+esc(i[0])+'</em><span>'+esc(i[1])+'</span></div>').join('')+'</div>',
image:b=>'<figure>'+(b.src?'<img src="'+esc(b.src)+'" alt="'+esc(b.alt||'')+'" loading="lazy">':'<div class="sc-ph">'+esc(b.caption||'Hình minh hoạ')+'</div>')+(b.src&&b.caption?'<figcaption>'+esc(b.caption)+'</figcaption>':'')+'</figure>',
embed:b=>'<div class="sc-embed"><iframe src="'+esc(b.src)+'" loading="lazy" allowfullscreen></iframe></div>',
link:b=>'<p><a class="more" href="'+esc(b.href)+'">'+esc(b.text)+' →</a></p>'
};
fetch('data/showcase/'+encodeURIComponent(slug)+'.json').then(r=>{if(!r.ok)throw 0;return r.json()}).then(d=>{
if(d.status!=='published'){root.innerHTML='<section class="sc-hero"><h1>Chưa công bố</h1></section>';return}
document.title=d.title+' | Jade';
root.innerHTML='<section class="sc-hero">'+(d.logo?'<img class="sc-logo" src="'+esc(d.logo)+'" alt="'+esc(d.client||'')+'">':'')+'<label>'+esc(d.sector)+' · '+(d.kind==='personal'?'DỰ ÁN CÁ NHÂN':'DỰ ÁN')+'</label><h1>'+esc(d.title)+'</h1><p>'+esc(d.summary)+'</p>'
+'<dl><div><dt>Khách hàng</dt><dd>'+esc(d.client||'—')+'</dd></div><div><dt>Vai trò</dt><dd>'+esc(d.role)+'</dd></div><div><dt>Năm</dt><dd>'+esc(d.year)+'</dd></div></dl></section>'
+'<section class="sc-body">'+d.blocks.map(b=>(R[b.type]||(()=>''))(b)).join('')+'<p><a class="more" href="work.html">← Quay lại showcase</a></p></section>'}).catch(()=>{root.innerHTML='<section class="sc-hero"><h1>Không tìm thấy dự án</h1><p><a class="more" href="work.html">← Quay lại showcase</a></p></section>'});
})();
