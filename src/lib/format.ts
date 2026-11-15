import type { CollectionEntry } from 'astro:content';

/** 5541995164766 -> (41) 99516-4766 */
export function formatarTelefone(numero: string): string {
  const local = numero.replace(/^55/, '');
  const ddd = local.slice(0, 2);
  const resto = local.slice(2);
  const corte = resto.length === 9 ? 5 : 4;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

export function linkWhatsapp(numero: string, texto?: string): string {
  const q = texto ? `?text=${encodeURIComponent(texto)}` : '';
  return `https://wa.me/${numero}${q}`;
}

const fmtData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const dataLonga = (d: Date) => fmtData.format(d);
export const dataIso = (d: Date) => d.toISOString().slice(0, 10);

type Prof = CollectionEntry<'profissionais'>['data'];

export function nomeCompleto(p: Prof): string {
  return [p.tratamento, p.nome].filter(Boolean).join(' ');
}

/** "19927" -> "19.927" */
const milhar = (n: string) => n.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * Identificação exigida pela Resolução CFM 2.336/2023 (art. 4º):
 * nome, CRM/UF e, se houver, especialidade + RQE. Sem RQE, nunca "especialista".
 */
export function credencial(p: Prof): string {
  const crm = p.crm ? `CRM-${p.crm.uf} ${milhar(p.crm.numero)}` : 'CRM em atualização';
  const partes = [p.profissao.toUpperCase(), crm];
  if (p.rqes.length) partes.push(`RQE ${p.rqes.map(milhar).join(' e ')}`);
  return partes.join(' · ');
}

export function especialidadeTexto(p: Prof): string {
  return p.especialidades.join(' · ');
}

export function ehEspecialista(p: Prof): boolean {
  return p.rqes.length > 0;
}

export function slugify(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
