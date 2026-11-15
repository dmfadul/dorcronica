import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Lista no build o que ainda está pendente ou precisa de confirmação.
 * Com STRICT_CONTENT=1 (usar antes de publicar) o build falha se houver
 * pendência obrigatória — o site não vai ao ar sem os dados exigidos pelo CFM.
 */
const REGRAS = [
  { pasta: 'src/content/profissionais', test: (fm) => /^crm:\s*null/m.test(fm), msg: 'CRM não preenchido', obrigatorio: true },
  { pasta: 'src/content/profissionais', test: (fm) => /^rqes:\s*\[\]/m.test(fm), msg: 'sem RQE (o site não usará a palavra "especialista")', obrigatorio: false },
  { pasta: 'src/content/unidades', test: (fm) => /^endereco:\s*null/m.test(fm), msg: 'endereço não preenchido', obrigatorio: false },
  { pasta: 'src/content/condicoes', test: (fm) => !/^revisadoEm:/m.test(fm), msg: 'texto aguardando revisão médica (revisadoEm)', obrigatorio: false },
  { pasta: 'src/content/tratamentos', test: (fm) => !/^revisadoEm:/m.test(fm), msg: 'texto aguardando revisão médica (revisadoEm)', obrigatorio: false },
];

async function auditar(root) {
  const achados = [];
  for (const regra of REGRAS) {
    const dir = join(root, regra.pasta);
    for (const nome of await readdir(dir).catch(() => [])) {
      if (!nome.endsWith('.md')) continue;
      const texto = await readFile(join(dir, nome), 'utf8');
      const frontmatter = texto.split(/^---$/m)[1] ?? '';
      if (regra.test(frontmatter)) achados.push({ ...regra, arquivo: `${regra.pasta}/${nome}` });
    }
  }
  const site = await readFile(join(root, 'src/config/site.ts'), 'utf8');
  for (const m of site.matchAll(/^\s*(\w+):\s*PENDENTE/gm)) {
    achados.push({ arquivo: 'src/config/site.ts', msg: `"${m[1]}" pendente`, obrigatorio: false });
  }
  return achados;
}

export function contentAudit() {
  return {
    name: 'content-audit',
    hooks: {
      'astro:build:start': async ({ logger }) => {
        const achados = await auditar(process.cwd());
        if (!achados.length) return logger.info('Nenhuma pendência de conteúdo.');
        const revisao = achados.filter((a) => a.msg.startsWith('texto aguardando'));
        for (const a of achados.filter((a) => !revisao.includes(a))) {
          logger.warn(`${a.obrigatorio ? '[OBRIGATÓRIO] ' : ''}${a.arquivo}: ${a.msg}`);
        }
        if (revisao.length) logger.warn(`${revisao.length} textos de saúde aguardando revisão médica (campo revisadoEm).`);
        if (process.env.STRICT_CONTENT === '1' && achados.some((a) => a.obrigatorio)) {
          throw new Error('Pendências obrigatórias de conteúdo. Corrija antes de publicar.');
        }
      },
    },
  };
}
