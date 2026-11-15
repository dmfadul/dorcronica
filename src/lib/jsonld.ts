import type { CollectionEntry } from 'astro:content';
import { site } from '../config/site';
import { nomeCompleto } from './format';

/** Dados estruturados (schema.org) — rich results e leitura por buscadores e IAs. */

export function physician(p: CollectionEntry<'profissionais'>, siteUrl: URL, fotoUrl?: string) {
  return {
    '@type': 'Physician',
    '@id': new URL(`/equipe/${p.id}/#medico`, siteUrl).href,
    name: nomeCompleto(p.data),
    url: new URL(`/equipe/${p.id}/`, siteUrl).href,
    image: fotoUrl,
    medicalSpecialty: ['Anesthesia', 'PainMedicine'],
    knowsAbout: p.data.especialidades,
    identifier: p.data.crm
      ? [
          { '@type': 'PropertyValue', propertyID: `CRM-${p.data.crm.uf}`, value: p.data.crm.numero },
          ...p.data.rqes.map((r) => ({ '@type': 'PropertyValue', propertyID: 'RQE', value: r })),
        ]
      : undefined,
    affiliation: p.data.vinculos.map((v) => ({ '@type': 'Organization', name: v.instituicao })),
    sameAs: p.data.doctoralia ? [p.data.doctoralia] : undefined,
    worksFor: { '@id': new URL('/#clinica', siteUrl).href },
  };
}

export function clinica(siteUrl: URL, unidades: CollectionEntry<'unidades'>[]) {
  const u = unidades.find((x) => x.data.principal) ?? unidades[0];
  return {
    '@type': 'MedicalClinic',
    '@id': new URL('/#clinica', siteUrl).href,
    name: `${site.nome} — ${site.servico}`,
    description: site.descricao,
    url: siteUrl.href,
    email: site.contato.email,
    telephone: site.contato.telefones.map((t) => `+${t.numero}`),
    medicalSpecialty: 'PainMedicine',
    areaServed: { '@type': 'City', name: site.cidade },
    ...(u && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: u.data.endereco?.logradouro,
        addressLocality: u.data.cidade,
        addressRegion: u.data.uf,
        addressCountry: 'BR',
      },
      geo: u.data.geo && { '@type': 'GeoCoordinates', latitude: u.data.geo.lat, longitude: u.data.geo.lng },
    }),
  };
}

export function breadcrumbs(itens: { nome: string; href: string }[], siteUrl: URL) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nome,
      item: new URL(it.href, siteUrl).href,
    })),
  };
}

export function faqPage(itens: { pergunta: string; resposta: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: itens.map((f) => ({
      '@type': 'Question',
      name: f.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: f.resposta },
    })),
  };
}

export function grafo(...nos: (object | undefined | false)[]) {
  return { '@context': 'https://schema.org', '@graph': nos.filter(Boolean) };
}
