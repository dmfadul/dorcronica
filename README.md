# dorcronica.org — v2 (protótipo local)

Site do **Dr. Alberto Fadul** — anestesiologista com área de atuação em Dor (CRM-PR 26.704 · RQE 668), Curitiba.
Reconstruído do zero sobre um modelo de conteúdo que escala: de um médico para uma clínica com equipe,
várias unidades e centenas de páginas, **sem reescrever templates**.

> Protótipo local. Nada foi publicado. Não há deploy configurado.

## Como abrir

- **Só ver, sem instalar nada:** abra `prototipo-offline/index.html` (dois cliques). Funciona direto do disco, inclusive as ferramentas.
- **Com edição:** dois cliques em **`Abrir prototipo.cmd`** (instala na 1ª vez, gera o site e abre `http://localhost:4321`; deixe a janela preta aberta).
- Manual: `npm install` → `npm run dev` (edição ao vivo) ou `npm run build && npm run preview`.
- `npm run build` gera `dist/` (versão para servidor) e `prototipo-offline/` (versão para abrir do disco).

## O que tem (38 páginas)

| Área | Páginas |
|---|---|
| Início | hero, atuação acadêmica, **mapa "Onde dói?"**, os 3 tipos de dor, 13 condições, jornada de cuidado, falas do médico + podcast, ferramentas, FAQ, depoimento, artigos, contato |
| Condições (13) | lombalgia e ciática, dor cervical, cefaleias e enxaqueca, dor facial/trigêmeo, dor neuropática, herpes-zóster, fibromialgia, dor miofascial, artrose, SDCR, dor oncológica, dor pélvica/genital, dor pós-operatória |
| Tratamentos (8) | consulta, medicação, bloqueios, infiltrações guiadas, radiofrequência, toxina botulínica, neuromodulação, programa multidisciplinar — procedimentos com **ficha prática** (anestesia, guia, duração, alta) |
| Ferramentas | **Onde dói?** (mapa do corpo, frente e costas) · **Preparar minha consulta** (questionário → resumo de 1 página para imprimir/PDF) · **Diário da dor** (registro diário, gráfico de 30 dias, CSV, impressão) |
| Institucional | o médico (trajetória, vínculos, falas com fonte), primeira consulta, perguntas frequentes, podcast e mídia, onde atendemos, contato, privacidade |

As três ferramentas guardam dados **só no navegador** (localStorage). Nada sai do aparelho — escolha deliberada:
dado de saúde é dado sensível pela LGPD, e o site não precisa de servidor nem de banco.

As ferramentas conversam entre si: o que o paciente marca no mapa vira o ponto de partida do "Preparar minha consulta".

## Pesquisa usada (fontes públicas)

| Dado | Fonte |
|---|---|
| CRM-PR 26.704 · RQE 668 | descrição do podcast "E agora, Doutor?" #24 (YouTube, Eco Medical Center) e Doctoralia |
| Anestesiologista com atuação em Dor; responsável pelo Serviço de Dor do HC-UFPR; supervisor da residência em Anestesiologia do HUE Mackenzie | dralbertofadul.com.br e Doctoralia |
| Supervisiona a residência em Dor do HC-UFPR; coordena a Eco Medicina da Dor; serviço criado com anestesiologia, clínica médica, neurologia, neurocirurgia e radiologia | falas do próprio médico no podcast #24 |
| Eco Medical Center – Rua Goiás, 70, Água Verde, Curitiba – PR, 80620-060; WhatsApp (41) 99181-2004; central do Eco (41) 3123-6550 (ligação); seg.–sáb. 9h–18h | Perfil da Empresa no Google (fonte de verdade) |
| Condições tratadas, teleconsulta | Doctoralia |
| As três citações do médico | transcrição do podcast #24 (com link para a fonte) |

## Como o conteúdo escala

Tudo que muda é arquivo em `src/content/`. Criar arquivo = criar página, com tudo ligado automaticamente.

| Quero... | Faço... | Acontece sozinho |
|---|---|---|
| Nova condição | `condicoes/nome.md` com `regioes` e `tipo` | página, item na home e no rodapé, entra no **mapa do corpo**, no acordeão dos tipos de dor, no formulário e nos "relacionados" |
| Novo tratamento | `tratamentos/nome.md` | página, etapa na jornada, link nas condições que o citam |
| Artigo | `artigos/nome.md` com `condicoes: [...]` | página, listagem paginada, RSS, sitemap, aparece na página das condições |
| Pergunta frequente | uma entrada em `faq.yaml` | página de FAQ + dados estruturados FAQPage; `destaque: true` leva para a home |
| Podcast/entrevista | uma entrada em `midia.yaml` | página de mídia, perfil do médico, home |
| Novo profissional | `profissionais/nome.md` + foto | perfil, autoria, dados estruturados Physician |
| Nova unidade | `unidades/nome.md` | contato, rodapé, "onde atendemos", JSON-LD |
| Telefone/e-mail | `src/config/site.ts` (**um lugar só**) | site inteiro |

O schema (`src/content.config.ts`) valida tudo: região do corpo inexistente, tipo de dor errado,
referência a tratamento que não existe ou resumo longo demais **quebram o build** com mensagem clara.

## Decisões

**Arquitetura** — Astro 7, saída 100% estática; conteúdo em Markdown/YAML versionado; fonte única de verdade para dados institucionais; imagens otimizadas no build (foto de 1,8 MB → WebP de 10–70 KB); fontes auto-hospedadas (sem Google Fonts); vídeo do YouTube só carrega quando o visitante clica (sem cookies antes disso); URLs antigas (`/about/`, `/posts/...`) redirecionam.

**Conformidade** — Resolução CFM 2.336/2023: nome, CRM e RQE na faixa logo abaixo do hero, no perfil, nas condições e no rodapé; responsável técnico identificado; "especialista" só aparece porque há RQE. Depoimentos só com `autorizado: true`; avaliações remetem ao Doctoralia em vez de serem reproduzidas. Nenhuma promessa de resultado. Sinais de alerta (pronto atendimento/192) nas condições, nas ferramentas e no rodapé. Toda página de saúde tem campo de revisão médica, e o build conta quantas ainda faltam revisar.

**SEO** — página por condição e por tratamento; JSON-LD `MedicalClinic`, `Physician` (com CRM/RQE e vínculos), `MedicalWebPage` + `MedicalCondition` (sintomas, tratamentos), `TherapeuticProcedure`, `FAQPage`, `BlogPosting`, `BreadcrumbList`, `ProfilePage`; sitemap, RSS, canonical, Open Graph.

**Design** — paleta tirada do retrato (azul-marinho, dourado, papel quente); serifada editorial (Newsreader) + sans precisa (Public Sans); composição editorial (índices numerados, faixas, acordeões nativos) em vez de grade de cards; mapa do corpo como peça central. Acessibilidade: contraste AA, foco visível, alvos ≥ 44 px, controles acessíveis no mapa (botões com `aria-pressed`), menu mobile sem JS (Popover API), `prefers-reduced-motion`, impressão dedicada para as ferramentas.

## Pendências e pontos a confirmar

O build lista os avisos. `STRICT_CONTENT=1 npm run build` falha se houver pendência obrigatória.

- [ ] **Revisão médica** dos 21 textos de condições e tratamentos (preencher `revisadoEm` / `revisadoPor`) — escritos a partir de fontes públicas e da fala do médico, mas precisam do aval dele
- [ ] Confirmar se os vínculos (HC-UFPR, HUE Mackenzie, Eco) estão atuais
- [ ] Autorização do médico para as citações do podcast e do Eco para o uso da miniatura do episódio
- [ ] Autorização escrita do depoimento de P.M.
- [ ] Revisão jurídica da página de privacidade

## Estrutura

```
src/
  config/site.ts            dados institucionais e navegação
  content.config.ts         schemas das coleções (validação)
  content/                  CONTEÚDO — condições, tratamentos, artigos, profissionais, unidades, faq.yaml, midia.yaml, depoimentos.yaml
  lib/regioes.ts            vocabulário de regiões do corpo e tipos de dor (usado por mapa, condições e ferramentas)
  lib/                      formatação (telefone, CRM/RQE, datas) e dados estruturados
  components/               BodyMap, PainTypes, FaqList, LiteYouTube, Alerta, Header, Footer...
  pages/                    rotas (geradas a partir das coleções)
  styles/global.css         design tokens
integrations/content-audit.mjs   auditor de pendências no build
scripts/make-offline.mjs         gera a versão que abre direto do disco
public/                     favicon, redirects 301, headers de segurança
```
