import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../config/site';

export async function GET(context: APIContext) {
  const artigos = (await getCollection('artigos', (a) => !a.data.rascunho))
    .sort((a, b) => b.data.publicadoEm.valueOf() - a.data.publicadoEm.valueOf());
  return rss({
    title: `Artigos — ${site.nome}`,
    description: 'Informação confiável sobre dor crônica, diagnóstico e tratamentos baseados em evidências.',
    site: context.site!,
    items: artigos.map((a) => ({
      title: a.data.titulo,
      description: a.data.descricao,
      pubDate: a.data.publicadoEm,
      link: `/artigos/${a.id}/`,
    })),
    customData: '<language>pt-br</language>',
  });
}
