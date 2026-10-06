window.DATA_READY.then(function(P){
const q=new URLSearchParams(location.search);
let cat=q.get('cat')||'all', term='';
const CATS=['all','bagues','colliers','bracelets','boucles','piercings'];
const el=id=>document.getElementById(id);
const catName=c=>c==='all'?t('c.allj'):t('cat.'+c);
function draw(){
  const list=P.filter(p=>(cat==='all'||p.cat===cat)&&(!term||pname(p).toLowerCase().includes(term)||p.nom.toLowerCase().includes(term)));
  el('count').textContent=list.length+' '+(list.length>1?t('c.many'):t('c.one'));
  el('grid').innerHTML=list.length?list.map(cardHTML).join(''):'<div class="empty">'+t('c.empty')+'</div>';
  bindCards(el('grid'));
  el('fc').innerHTML=CATS.map(c=>`<li><button data-c="${c}" class="${c===cat?'on':''}">${catName(c)}</button></li>`).join('');
  el('ttl').textContent=cat==='all'?t('c.all'):t('cat.'+cat);
  document.title=el('ttl').textContent+' — '+t('brand');
}
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-c]');
  if(c){cat=c.dataset.c;const u=new URL(location.href);cat==='all'?u.searchParams.delete('cat'):u.searchParams.set('cat',cat);history.replaceState(null,'',u);draw()}
});
el('s').addEventListener('input',e=>{term=e.target.value.trim().toLowerCase();draw()});
draw();
});
