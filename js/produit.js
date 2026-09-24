window.DATA_READY.then(function(P){
const id=new URLSearchParams(location.search).get('id');
const p=P.find(x=>pid(x)===id), root=document.getElementById('root');
if(!p){root.innerHTML='<div class="txtpg" style="padding-top:80px;text-align:center"><p>'+t('p.nf')+'</p><a class="btn" href="catalogue.html">'+t('p.seec')+'</a></div>';return}
const ms=metals(p), nm=pname(p), pi=pid(p); let cur=firstMetal(p);
document.title=nm+' — '+t('brand');
function draw(){
  const ty=t('ty.'+p.cat), msg=t('p.msg',{n:nm,m:t('m.'+cur).toLowerCase(),r:pi});
  root.innerHTML=`<div class="wrap"><div class="crumb"><a href="index.html">${t('p.home')}</a> / <a href="catalogue.html?cat=${p.cat}">${t('cat.'+p.cat)}</a> / ${nm}</div>
  <div class="prod"><div class="gal"><div class="main"><img src="${p.img[cur]}" alt="${nm} — ${t('m.'+cur)}"></div>
  ${ms.length>1?`<div class="th">${ms.map(m=>`<button data-m="${m}" class="${m===cur?'on':''}" aria-label="${t('m.'+m)}"><img src="${thumbOf(p,m)}" alt="${t('m.'+m)}"></button>`).join('')}</div>`:''}</div>
  <div class="info"><h1>${nm}</h1><div class="tag">${ty} · ${t('p.diam')}</div>
  <p class="desc">${t('p.desc')}</p>
  ${ms.length>1?`<div class="sw"><h4>${t('p.color')}<span>${t('m.'+cur)}</span></h4><div class="row">${ms.map(m=>`<button class="dot ${m}${m===cur?' on':''}" data-m="${m}" title="${t('m.'+m)}" aria-label="${t('m.'+m)}"></button>`).join('')}</div></div>`:''}
  <dl><div><dt>${t('p.type')}</dt><dd>${ty}</dd></div><div><dt>${t('p.stone')}</dt><dd>${(function(){const v=t('st.'+p.pierre);return v==='st.'+p.pierre?p.pierre:v})()}</dd></div><div><dt>${t('p.gold')}</dt><dd>${ms.length>1?t('p.goldv'):t('p.goldd')}</dd></div><div><dt>${t('p.perso')}</dt><dd>${t('p.persov')}</dd></div></dl>
  <div class="btns"><a class="btn wa" target="_blank" rel="noopener" href="${waLink(msg)}">${WA_ICON} ${t('p.wa')}</a><a class="btn ghost" href="sur-mesure.html">${t('p.sur')}</a></div>
  <p class="note">${t('p.note')}</p></div></div></div>
  <section class="sec soft"><div class="wrap"><h2 class="tt">${t('p.sim')}</h2><div class="grid" id="sim"></div></div></section>`;
  root.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{cur=b.dataset.m;draw()});
  const sm=document.getElementById('sim'); sm.innerHTML=P.filter(x=>x.cat===p.cat&&pid(x)!==pi).slice(0,4).map(cardHTML).join(''); bindCards(sm);
}
draw();
});
