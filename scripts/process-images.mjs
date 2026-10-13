// Traite automatiquement les photos ajoutées via l'espace d'administration (Decap CMS).
//
// Problème résolu : quand quelqu'un ajoute une photo via /admin, Decap CMS dépose le
// fichier brut tel quel dans img/uploads/ et met à jour data/products.json pour y
// pointer. Ce script, lancé automatiquement par Netlify à chaque publication, détecte
// ces photos "brutes" et les transforme dans le même format que toutes les autres
// photos du catalogue : recadrage sur fond blanc 825x1100 + vignette 420x560,
// rangées dans img/produits/<id>/<couleur>.jpg.
//
// Important : ce script ne modifie QUE la version publiée du site (ce que Netlify
// met en ligne). Il ne renvoie rien vers GitHub — le dépôt garde la photo brute
// d'origine, et ce script la re-détecte et la retraite à chaque nouvelle publication
// tant qu'elle n'a pas été remplacée. C'est voulu : ça évite un deuxième
// déploiement (donc un deuxième coût en crédits Netlify) à chaque ajout de photo.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PRODUCTS_PATH = path.join(ROOT, 'data', 'products.json');
const COLORS = ['blanc', 'jaune', 'rose'];
const MAIN_W = 825, MAIN_H = 1100;
const THUMB_W = 420, THUMB_H = 560;

function slugify(str) {
  return (str || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // enlève les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function canonicalPath(id, color, ext = 'jpg') {
  return `img/produits/${id}/${color}.${ext}`;
}
function canonicalThumbPath(id, color, ext = 'jpg') {
  return `img/produits/${id}/${color}-t.${ext}`;
}

function isAlreadyProcessed(p, id, color) {
  if (!p) return false;
  return p === canonicalPath(id, color) || p === canonicalPath(id, color, 'jpeg') || p === canonicalPath(id, color, 'png');
}

async function fileExists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function processOne(srcRelPath, id, color) {
  const srcAbs = path.join(ROOT, srcRelPath);
  if (!(await fileExists(srcAbs))) {
    console.warn(`  ! Fichier introuvable, ignoré : ${srcRelPath}`);
    return null;
  }
  const outDir = path.join(ROOT, 'img', 'produits', id);
  await fs.mkdir(outDir, { recursive: true });

  const mainOut = path.join(outDir, `${color}.jpg`);
  const thumbOut = path.join(outDir, `${color}-t.jpg`);

  const mainBuffer = await sharp(srcAbs)
    .resize(MAIN_W, MAIN_H, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .jpeg({ quality: 92 })
    .toBuffer();
  await fs.writeFile(mainOut, mainBuffer);

  await sharp(mainBuffer)
    .resize(THUMB_W, THUMB_H)
    .jpeg({ quality: 90 })
    .toFile(thumbOut);

  if (srcAbs.includes(`${path.sep}img${path.sep}uploads${path.sep}`)) {
    try { await fs.unlink(srcAbs); } catch { /* tant pis, pas bloquant */ }
  }

  return {
    img: canonicalPath(id, color),
    thumb: canonicalThumbPath(id, color),
  };
}

async function main() {
  const raw = await fs.readFile(PRODUCTS_PATH, 'utf8');
  const data = JSON.parse(raw);
  const usedIds = new Set(data.items.map((it) => it.id).filter(Boolean));

  let changed = 0;
  let errors = 0;

  for (const item of data.items) {
    if (!item.id) {
      let base = slugify(item.nom) || 'bijou';
      let candidate = base;
      let n = 2;
      while (usedIds.has(candidate)) {
        candidate = `${base}-${n}`;
        n++;
      }
      item.id = candidate;
      usedIds.add(candidate);
      console.log(`+ Nouvel identifiant généré pour "${item.nom}" : ${item.id}`);
    }

    if (!item.img || typeof item.img !== 'object') continue;
    if (!item.thumb || typeof item.thumb !== 'object') item.thumb = {};

    for (const color of COLORS) {
      const p = item.img[color];
      if (!p) continue;
      if (isAlreadyProcessed(p, item.id, color)) continue;

      console.log(`→ Traitement : ${item.nom} (${item.id}) / ${color} depuis ${p}`);
      try {
        const result = await processOne(p, item.id, color);
        if (result) {
          item.img[color] = result.img;
          item.thumb[color] = result.thumb;
          changed++;
        } else {
          errors++;
        }
      } catch (e) {
        console.error(`  ! Erreur de traitement pour ${p} :`, e.message);
        errors++;
      }
    }
  }

  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');

  console.log(`\nTerminé : ${changed} photo(s) traitée(s), ${errors} erreur(s).`);
  if (errors > 0) {
    console.warn('Certaines photos n\'ont pas pu être traitées, voir les messages ci-dessus.');
  }
}

main().catch((e) => {
  console.error('Erreur fatale dans process-images.mjs :', e);
  process.exit(1);
});
