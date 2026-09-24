function slugify(s){
  return (s||'').toString().normalize('NFD').replace(/[̀-ͯ]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
function pid(p){return p.id || slugify(p.nom)}
function metals(p){return ['blanc','rose','jaune'].filter(m=>p.img && p.img[m])}
function firstMetal(p){return metals(p)[0]}
function thumbOf(p,m){return (p.thumb && p.thumb[m]) || (p.img && p.img[m])}
