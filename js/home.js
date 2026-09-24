window.DATA_READY.then(function(P){
const g=id=>P.find(p=>pid(p)===id);
const cols=[['bagues','bague-poire-halo'],['colliers','collier-solitaire-poire'],['bracelets','bracelet-tennis'],['boucles','creoles-diamants']];
document.getElementById('cols').innerHTML=cols.map(c=>{const p=g(c[1])||P.find(x=>x.cat===c[0]);if(!p)return'';return `<a class="col" href="catalogue.html?cat=${c[0]}"><div class="ph"><img src="${thumbOf(p,firstMetal(p))}" alt="${t('cat.'+c[0])}"></div><h3>${t('cat.'+c[0])}</h3><span>${t('h.see')} ${t('arrow')}</span></a>`}).join('');
let feat=['bague-poire-halo','bracelet-tennis','collier-solitaire-poire','alliance-eternite','solitaire-ovale','bague-emeraude-double-halo','creoles-diamants','bracelet-cordon-solitaire'].map(g).filter(Boolean);
if(feat.length<8)feat=P.slice(0,8);
const el=document.getElementById('feat'); el.innerHTML=feat.map(cardHTML).join(''); bindCards(el);
});
