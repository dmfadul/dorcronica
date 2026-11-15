// Gera `prototipo-offline/`: cópia do site que abre com dois cliques no index.html,
// sem servidor nem Node. Converte caminhos absolutos (/x/) em relativos (../x/index.html).
// Uso: npm run offline   (roda depois do build)
import { cp, readdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { join, relative, dirname, posix, sep } from 'node:path';

const DIST = 'dist';
const OUT = 'prototipo-offline';

await rm(OUT, { recursive: true, force: true });
await cp(DIST, OUT, { recursive: true });

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function existe(p) {
  try { return await stat(p); } catch { return null; }
}

/** Converte "/a/b/" vista de `arquivo` em caminho relativo que funciona em file://. */
async function rel(alvo, arquivo) {
  const [semHash, hash = ''] = alvo.split('#');
  const [caminho, query = ''] = semHash.split('?');
  let destino = caminho;
  const fisico = join(OUT, ...caminho.split('/').filter(Boolean));
  const info = await existe(fisico);
  if (caminho.endsWith('/') || info?.isDirectory()) destino = posix.join(caminho, 'index.html');
  const deDir = dirname(relative(OUT, arquivo)).split(sep).join('/');
  let r = posix.relative('/' + (deDir === '.' ? '' : deDir), destino);
  if (!r) r = 'index.html';
  return r + (query && !destino.endsWith('.html') ? `?${query}` : '') + (hash ? `#${hash}` : '');
}

async function trocar(texto, arquivo, re) {
  const partes = [];
  let ultimo = 0;
  for (const m of texto.matchAll(re)) {
    partes.push(texto.slice(ultimo, m.index + m[1].length));
    partes.push(await rel(m[2], arquivo));
    ultimo = m.index + m[1].length + m[2].length;
  }
  partes.push(texto.slice(ultimo));
  return partes.join('');
}

let n = 0;
for await (const f of walk(OUT)) {
  if (f.endsWith('.html')) {
    let t = await readFile(f, 'utf8');
    // href="/..." src="/..." content="0;url=/..." (não mexe em //cdn nem em URLs absolutas)
    t = await trocar(t, f, /((?:href|src|action)=")(\/(?!\/)[^"]*)/g);
    t = await trocar(t, f, /(url=)(\/(?!\/)[^"]*)/g);
    // srcset: várias URLs separadas por vírgula
    const srcsets = [...t.matchAll(/srcset="([^"]*)"/g)];
    for (const m of srcsets) {
      const novo = [];
      for (const item of m[1].split(',')) {
        const [u, d] = item.trim().split(/\s+/);
        novo.push(`${u.startsWith('/') ? await rel(u, f) : u}${d ? ' ' + d : ''}`);
      }
      t = t.replace(m[0], `srcset="${novo.join(', ')}"`);
    }
    // módulos JS importados por caminho absoluto
    t = await trocar(t, f, /(import\s*["'])(\/_astro\/[^"']*)/g);
    // file:// bloqueia <script type="module" src>; os bundles não têm import/export, então rodam como script comum.
    t = t.replace(/<script type="module" src=/g, '<script defer src=');
    await writeFile(f, t);
    n++;
  } else if (f.endsWith('.css')) {
    let t = await readFile(f, 'utf8');
    t = await trocar(t, f, /(url\()(\/[^)]*)/g);
    await writeFile(f, t);
  } else if (f.endsWith('.js')) {
    let t = await readFile(f, 'utf8');
    t = t.replace(/(["'])\/_astro\//g, '$1./');
    await writeFile(f, t);
  }
}
console.log(`prototipo-offline/: ${n} páginas convertidas para abrir sem servidor.`);
