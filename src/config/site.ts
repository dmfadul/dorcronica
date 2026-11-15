/**
 * Fonte única de verdade para dados institucionais.
 * Telefones, e-mail e canais aparecem em vários lugares (cabeçalho, rodapé,
 * contato, JSON-LD, WhatsApp). Aqui eles existem uma vez só.
 * Campos com PENDENTE são listados no build (integrations/content-audit.mjs).
 */

export const PENDENTE = null;

export type Telefone = {
  numero: string; // somente dígitos com DDI+DDD: 5541995164766
  rotulo: string;
  whatsapp: boolean;
};

export const site = {
  nome: 'Dr. Alberto Fadul',
  servico: 'Medicina da Dor',
  descricao:
    'Dr. Alberto Fadul, anestesiologista com área de atuação em Dor, em Curitiba. Diagnóstico e tratamento da dor crônica: lombalgia, dor neuropática, cefaleias, fibromialgia, herpes-zóster e mais.',
  idioma: 'pt-BR',
  cidade: 'Curitiba',
  uf: 'PR',

  /** Responsável técnico — Resolução CFM 2.336/2023, art. 4º e 5º. */
  responsavelTecnico: 'alberto-fadul',

  contato: {
    email: 'adfadul@gmail.com.br',
    /** O primeiro com whatsapp: true é o canal principal de agendamento. */
    telefones: [
      { numero: '5541995164766', rotulo: 'WhatsApp do consultório', whatsapp: true },
      { numero: '554131236550', rotulo: 'Central do Eco Medical Center (ligação e WhatsApp)', whatsapp: true },
      { numero: '5541991812004', rotulo: 'Celular', whatsapp: false },
      { numero: '5541991771979', rotulo: 'Celular', whatsapp: false },
    ] satisfies Telefone[],
    mensagemWhatsapp: 'Olá! Gostaria de agendar uma consulta com o Dr. Alberto Fadul.',
  },

  redes: {
    instagramServico: 'https://www.instagram.com/eco.medicinadador/',
    doctoralia: 'https://www.doctoralia.com.br/alberto-fadul/especialista-em-dor/curitiba',
  },

  recursos: {
    depoimentos: true,
    artigosNaHome: 3,
    artigosPorPagina: 12,
  },

  navegacao: [
    { href: '/condicoes/', rotulo: 'O que tratamos' },
    { href: '/tratamentos/', rotulo: 'Tratamentos' },
    { href: '/onde-doi/', rotulo: 'Onde dói?' },
    { href: '/equipe/alberto-fadul/', rotulo: 'O médico' },
    { href: '/artigos/', rotulo: 'Artigos' },
  ],
  navegacaoExtra: [
    { href: '/primeira-consulta/', rotulo: 'Primeira consulta' },
    { href: '/preparar-consulta/', rotulo: 'Preparar minha consulta' },
    { href: '/diario-da-dor/', rotulo: 'Diário da dor' },
    { href: '/perguntas-frequentes/', rotulo: 'Perguntas frequentes' },
    { href: '/na-midia/', rotulo: 'Podcast e mídia' },
    { href: '/onde-atendemos/', rotulo: 'Onde atendemos' },
    { href: '/contato/', rotulo: 'Contato' },
  ],
} as const;

export const whatsappPrincipal = site.contato.telefones.find((t) => t.whatsapp)!;
