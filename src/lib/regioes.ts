/**
 * Regiões do corpo usadas pelo mapa "Onde dói?", pelas condições e pela
 * ferramenta de preparo de consulta. Um vocabulário só para o site inteiro:
 * cada condição declara as regiões que costuma envolver e o mapa cruza isso.
 */
export const REGIOES = {
  cabeca: 'Cabeça',
  face: 'Face e mandíbula',
  cervical: 'Pescoço e nuca',
  ombro: 'Ombros',
  'costas-alta': 'Costas (parte alta)',
  torax: 'Tórax e costelas',
  'abdome-pelve': 'Abdome, pelve e região genital',
  lombar: 'Lombar',
  quadril: 'Quadril, glúteos e coxas',
  'braco-mao': 'Braços, punhos e mãos',
  joelho: 'Joelhos',
  'perna-pe': 'Pernas e pés',
  'corpo-todo': 'Em vários lugares / no corpo todo',
} as const;

export type Regiao = keyof typeof REGIOES;
export const REGIAO_IDS = Object.keys(REGIOES) as [Regiao, ...Regiao[]];

export const TIPOS_DE_DOR = {
  nociceptiva: {
    nome: 'Nociceptiva',
    curta: 'Vem de um tecido lesionado ou ameaçado — articulação, músculo, osso.',
  },
  neuropatica: {
    nome: 'Neuropática',
    curta: 'Vem de uma lesão ou doença do próprio nervo.',
  },
  nociplastica: {
    nome: 'Nociplástica',
    curta: 'Vem de uma alteração no processamento da dor pelo sistema nervoso.',
  },
  mista: {
    nome: 'Mista',
    curta: 'Combina mais de um mecanismo.',
  },
} as const;

export type TipoDeDor = keyof typeof TIPOS_DE_DOR;
export const TIPO_IDS = Object.keys(TIPOS_DE_DOR) as [TipoDeDor, ...TipoDeDor[]];
