window.DATA_READY = fetch('data/products.json',{cache:'no-store'}).then(r=>r.json()).then(d=>{
  const items=(d.items||[]).filter(p=>p && p.nom && metals(p).length>0);
  window.PRODUITS=items; return items;
}).catch(e=>{console.error('Chargement des bijoux impossible',e);window.PRODUITS=[];return [];});
