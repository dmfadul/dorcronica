import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { REGIAO_IDS, TIPO_IDS } from './lib/regioes';

/**
 * Modelo de conteúdo. Cada coleção é uma pasta (ou arquivo YAML) em src/content/.
 * Adicionar uma condição, tratamento, artigo, profissional, unidade, pergunta
 * frequente ou aparição na mídia = criar/editar um arquivo. Nenhum template muda.
 * O schema valida tudo no build: campo errado quebra o build com mensagem clara.
 */

const seo = {
  seoTitulo: z.string().max(70).optional(),
  seoDescricao: z.string().max(170).optional(),
};

/** Revisão médica visível (E-E-A-T / conteúdo de saúde). */
const revisao = {
  revisadoPor: reference('profissionais').optional(),
  revisadoEm: z.coerce.date().optional(),
};

const pergunta = z.object({ p: z.string(), r: z.string() });

const condicoes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/condicoes' }),
  schema: z.object({
    titulo: z.string(),
    /** Nome curto para listas e mapa. */
    curto: z.string().optional(),
    resumo: z.string().max(220),
    ordem: z.number().default(100),
    destaque: z.boolean().default(false),
    tipo: z.enum(TIPO_IDS),
    regioes: z.array(z.enum(REGIAO_IDS)).min(1),
    sinonimos: z.array(z.string()).default([]),
    /** Como a dor costuma ser descrita pelo paciente. */
    sintomas: z.array(z.string()).default([]),
    abordagens: z.array(z.string()).min(1),
    tratamentos: z.array(reference('tratamentos')).default([]),
    /** Sinais que pedem pronto atendimento, não consulta eletiva. */
    alerta: z.array(z.string()).default([]),
    perguntas: z.array(pergunta).default([]),
    ...seo,
    ...revisao,
  }),
});

const tratamentos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tratamentos' }),
  schema: z.object({
    titulo: z.string(),
    resumo: z.string().max(220),
    etapa: z.enum(['Avaliação', 'Tratamento clínico', 'Procedimento', 'Acompanhamento']),
    ordem: z.number().default(100),
    itens: z.array(z.string()).default([]),
    /** Ficha prática do procedimento (aparece como tabela na página). */
    ficha: z
      .object({
        anestesia: z.string().optional(),
        guia: z.string().optional(),
        duracao: z.string().optional(),
        alta: z.string().optional(),
        retorno: z.string().optional(),
      })
      .optional(),
    perguntas: z.array(pergunta).default([]),
    ...seo,
    ...revisao,
  }),
});

const profissionais = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/profissionais' }),
  schema: ({ image }) =>
    z.object({
      nome: z.string(),
      /** Nome civil completo, como no CRM e no Perfil da Empresa no Google. */
      nomeRegistro: z.string().optional(),
      tratamento: z.enum(['Dr.', 'Dra.', '']).default(''),
      profissao: z.string().default('Médico'),
      /** Obrigatório (CFM 2.336/2023, art. 4º). null = pendente e o build avisa. */
      crm: z.object({ numero: z.string(), uf: z.string().length(2) }).nullable(),
      /** Especialidade e área de atuação registradas no CRM. */
      especialidades: z.array(z.string()).max(3).default([]),
      /** Números de RQE. Sem RQE o site nunca usa a palavra "especialista". */
      rqes: z.array(z.string()).default([]),
      vinculos: z.array(z.object({ cargo: z.string(), instituicao: z.string() })).default([]),
      chamada: z.string(),
      foto: image(),
      fotoAlt: z.string(),
      /** Falas públicas do profissional, sempre com fonte. */
      citacoes: z.array(z.object({ texto: z.string(), fonte: z.string(), url: z.url().optional() })).default([]),
      doctoralia: z.url().optional(),
      ordem: z.number().default(100),
      ...seo,
    }),
});

const unidades = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/unidades' }),
  schema: z.object({
    nome: z.string(),
    servico: z.string().optional(),
    cidade: z.string(),
    uf: z.string().length(2),
    endereco: z
      .object({
        logradouro: z.string(),
        complemento: z.string().optional(),
        bairro: z.string(),
        cep: z.string().optional(),
      })
      .nullable(),
    geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
    telefone: z.string().optional(),
    horarios: z.array(z.object({ dias: z.string(), horas: z.string() })).default([]),
    comodidades: z.array(z.string()).default([]),
    site: z.url().optional(),
    responsavelTecnico: reference('profissionais'),
    principal: z.boolean().default(false),
  }),
});

const artigos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artigos' }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string().max(200),
    publicadoEm: z.coerce.date(),
    atualizadoEm: z.coerce.date().optional(),
    autor: reference('profissionais'),
    condicoes: z.array(reference('condicoes')).default([]),
    rascunho: z.boolean().default(false),
    ...seo,
    ...revisao,
  }),
});

const depoimentos = defineCollection({
  loader: file('./src/content/depoimentos.yaml'),
  schema: z.object({
    texto: z.string().max(280),
    autor: z.string(),
    cidade: z.string().optional(),
    /** Só depoimentos com autorização escrita arquivada são publicados. */
    autorizado: z.boolean(),
  }),
});

const faq = defineCollection({
  loader: file('./src/content/faq.yaml'),
  schema: z.object({
    pergunta: z.string(),
    resposta: z.string(),
    tema: z.enum(['Dor crônica', 'Consulta', 'Procedimentos', 'Tratamento']),
    ordem: z.number().default(100),
    destaque: z.boolean().default(false),
  }),
});

const midia = defineCollection({
  loader: file('./src/content/midia.yaml'),
  schema: z.object({
    titulo: z.string(),
    formato: z.enum(['Podcast', 'Vídeo', 'Entrevista', 'Artigo']),
    veiculo: z.string(),
    data: z.coerce.date(),
    url: z.url(),
    youtubeId: z.string().optional(),
    duracao: z.string().optional(),
    resumo: z.string(),
    topicos: z.array(z.string()).default([]),
    participantes: z.array(reference('profissionais')).default([]),
  }),
});

export const collections = { condicoes, tratamentos, profissionais, unidades, artigos, depoimentos, faq, midia };
