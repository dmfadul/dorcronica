// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { contentAudit } from './integrations/content-audit.mjs';

// URL canônica de produção. Trocar aqui (e só aqui) se o domínio mudar.
const SITE_URL = 'https://dorcronica.org';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },

  // URLs do site antigo -> novas. Mantém links externos e o ranqueamento.
  // Em hospedagem com suporte (Cloudflare/Netlify) os 301 reais estão em public/_redirects;
  // estes geram páginas de fallback para qualquer outro host estático.
  redirects: {
    '/about': '/equipe/alberto-fadul/',
    '/posts': '/artigos/',
    '/posts/cefaleia-enxaqueca-dor-facial-cervical': '/artigos/cefaleia-enxaqueca-dor-facial-cervical/',
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
    contentAudit(),
  ],

  image: {
    // Fotos enviadas pelo cliente costumam vir em PNG de vários MB; o pipeline gera AVIF/WebP.
    responsiveStyles: true,
  },
});
