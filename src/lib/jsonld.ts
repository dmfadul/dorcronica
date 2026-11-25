import type { CollectionEntry } from 'astro:content';
import { site } from '../config/site';
import { nomeCompleto, nomeRegistroCompleto, telefoneInternacional } from './format';

/** Dados estruturados (schema.org) — rich results e leitura por buscadores e IAs. */

export function physician(p: CollectionEntry<'profissionais'>, siteUrl: URL, fotoUrl?: string) {
  return {
    '@type': 'Physician',
    '@id': new URL(`/equipe/${p.id}/#medico`, siteUrl).href,
    name: nomeRegistroCompleto(p.data),
    alternateName: nomeCompleto(p.data),
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

/** MedicalClinic (subtipo de LocalBusiness) — nome, endereço, telefone e horário iguais ao Perfil da Empresa no Google. */
export function clinica(siteUrl: URL, unidades: CollectionEntry<'unidades'>[], rt?: CollectionEntry<'profissionais'>) {
  const u = unidades.find((x) => x.data.principal) ?? unidades[0];
  const e = u?.data.endereco;
  return {
    '@type': 'MedicalClinic',
    '@id': new URL('/#clinica', siteUrl).href,
    name: site.nome,
    description: site.descricao,
    url: siteUrl.href,
    email: site.contato.email,
    telephone: telefoneInternacional(site.contato.telefonePrincipal),
    medicalSpecialty: 'PainMedicine',
    areaServed: { '@type': 'City', name: site.cidade },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: site.horario.dias.map((d) => `https://schema.org/${d}`),
        opens: site.horario.abre,
        closes: site.horario.fecha,
      },
    ],
    ...(rt && {
      employee: {
        '@type': 'Physician',
        '@id': new URL(`/equipe/${rt.id}/#medico`, siteUrl).href,
        name: nomeRegistroCompleto(rt.data),
      },
    }),
    ...(u && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: e ? `${u.data.nome} – ${[e.logradouro, e.complemento, e.bairro].filter(Boolean).join(', ')}` : undefined,
        postalCode: e?.cep,
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
