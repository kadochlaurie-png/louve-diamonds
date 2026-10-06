(function(){
const L=window.LOUVE;
const WA='<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>';
window.waLink=function(msg){return 'https://wa.me/'+L.whatsapp+'?text='+encodeURIComponent(msg)};
window.WA_ICON=WA;
const nav=[["index.html","nav.home"],["catalogue.html?cat=bagues","nav.bagues","bagues"],["catalogue.html?cat=colliers","nav.colliers","colliers"],["catalogue.html?cat=bracelets","nav.bracelets","bracelets"],["catalogue.html?cat=boucles","nav.boucles","boucles"],["catalogue.html?cat=piercings","nav.piercings","piercings"],["sur-mesure.html","nav.sur"],["a-propos.html","nav.apropos"],["contact.html","nav.contact"]];
const page=location.pathname.split('/').pop()||'index.html';
const cat=new URLSearchParams(location.search).get('cat');
const on=n=>{const f=n[0].split('?')[0];if(n[2])return page==='catalogue.html'&&cat===n[2];return f===page&&page!=='catalogue.html'};
const logo='<a class="logo" href="index.html"><b>LOUVE</b><small>DIAMONDS</small></a>';
const langs=[['fr','FR'],['en','EN'],['he','עב']];
document.body.insertAdjacentHTML('afterbegin',
`<header class="hdr"><div class="wrap">${logo}<nav class="nav" id="nav">${nav.map(n=>`<a href="${n[0]}" class="${on(n)?'on':''}">${t(n[1])}</a>`).join('')}</nav><div class="lang" role="group" aria-label="Langue / Language / שפה">${langs.map(l=>`<button data-l="${l[0]}" class="${l[0]===LANG?'on':''}" lang="${l[0]}">${l[1]}</button>`).join('')}</div><button class="burger" id="bg" aria-label="Menu"><span></span><span></span></button></div></header>`);
const gm=t('msg.gen');
document.body.insertAdjacentHTML('beforeend',
`<footer class="ftr"><div class="wrap"><div class="g">
<div>${logo}<p style="margin-top:18px;color:#6b6b6b;max-width:260px">${t('f.tag')}</p></div>
<div><h5>${t('f.coll')}</h5><ul><li><a href="catalogue.html?cat=bagues">${t('nav.bagues')}</a></li><li><a href="catalogue.html?cat=colliers">${t('nav.colliers')}</a></li><li><a href="catalogue.html?cat=bracelets">${t('nav.bracelets')}</a></li><li><a href="catalogue.html?cat=boucles">${t('nav.boucles')}</a></li><li><a href="catalogue.html?cat=piercings">${t('nav.piercings')}</a></li></ul></div>
<div><h5>${t('f.maison')}</h5><ul><li><a href="sur-mesure.html">${t('f.sur')}</a></li><li><a href="a-propos.html">${t('nav.apropos')}</a></li><li><a href="contact.html">${t('nav.contact')}</a></li></ul></div>
<div><h5>${t('f.contact')}</h5><ul><li><a href="${waLink(gm)}" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="https://instagram.com/${L.instagram}" target="_blank" rel="noopener">Instagram</a></li><li><a href="mailto:${L.email}" dir="ltr">${L.email}</a></li><li>${t('ct.adv')}</li></ul></div>
</div><div class="copy">© ${new Date().getFullYear()} ${t('brand')} — ${t('f.copy')}</div></div></footer>
<a class="wafloat" href="${waLink(gm)}" target="_blank" rel="noopener" aria-label="WhatsApp">${WA}</a>`);
document.getElementById('bg').onclick=()=>document.getElementById('nav').classList.toggle('open');
document.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.l));
document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
document.querySelectorAll('[data-i18n-ph]').forEach(e=>e.placeholder=t(e.dataset.i18nPh));
document.querySelectorAll('a[data-wa]').forEach(a=>{a.href=waLink(t(a.dataset.wa));a.target='_blank';a.rel='noopener';a.innerHTML=WA+' '+t(a.dataset.btn)});
const tk=document.documentElement.dataset.title; if(tk)document.title=t(tk);
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]'); if(!a||LANG==='fr')return;
  const h=a.getAttribute('href'); if(/^(https?:|mailto:|tel:|#)/.test(h))return;
  const u=new URL(h,location.href); u.searchParams.set('lang',LANG); a.href=u.toString();
},true);
window.cardHTML=function(p){
  const ms=metals(p), f=firstMetal(p), nm=pname(p), id=pid(p);
  const dots=ms.length>1?`<div class="dots">${ms.map(m=>`<button class="dot ${m}${m===f?' on':''}" data-m="${m}" title="${t('m.'+m)}" aria-label="${t('m.'+m)}"></button>`).join('')}</div>`:'';
  return `<div class="card" data-id="${id}"><a href="produit.html?id=${id}" class="ph"><img loading="lazy" src="${thumbOf(p,f)}" alt="${nm}"></a><a href="produit.html?id=${id}"><h3>${nm}</h3></a><div class="sub">${ms.length>1?t('m.all'):t('m.coll')}</div>${dots}</div>`;
};
window.bindCards=function(root){
  root.querySelectorAll('.card').forEach(c=>{
    const p=(window.PRODUITS||[]).find(x=>pid(x)===c.dataset.id);
    if(!p)return;
    c.querySelectorAll('.dot').forEach(d=>d.addEventListener('click',e=>{
      e.preventDefault();c.querySelector('.ph img').src=thumbOf(p,d.dataset.m);
      c.querySelectorAll('.dot').forEach(x=>x.classList.toggle('on',x===d));
    }));
  });
};
})();
