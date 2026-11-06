# Roadmap e andamento — AZ UI

Fonte: `specifications.md` §15 (complementado com itens da §6 que estavam fora das fases, ver Q-14). **Este é o painel de controle do projeto**: marcar `[x]` ao concluir, na mesma tarefa.

Fase atual: **4 — Dados e avançados**, ainda não iniciada (Fase 3 concluída e validada em 2026-11-06) (Fases 0 e 1 concluídas em 2026-11-04)

| Fase | Nome | Status |
|---|---|---|
| 0 | Pré-desenvolvimento | Concluída |
| 1 | Fundação | Concluída (validada); restam configurações do GitHub |
| 2 | Componentes básicos | Concluída |
| 3 | Componentes interativos | Concluída |
| 4 | Dados e avançados | Não iniciada |
| 5 | Layouts | Não iniciada |
| 6 | Documentação | Não iniciada |
| 7 | Distribuição | Não iniciada |

## Fase 0 — Pré-desenvolvimento

- [x] Especificação (`specifications.md`).
- [x] Matriz de contexto `.ai/` e arquivos da raiz.
- [x] Responder questões bloqueantes da Fase 1 (D-011 a D-018).
- [x] Licenças das fontes pré-verificadas (OFL 1.1, D-020). Confirmar o `LICENSE.txt` oficial de cada repositório no momento de baixar os arquivos (Fase 1).
- [x] Fontes em `fonts/`: Inter 4.1 e Source Sans 3 (4 pesos WOFF2 + licença). Subset latino ainda não aplicado (~110 KB por arquivo).
- [x] IBM Plex Sans em `fonts/ibm-plex-sans/` (Fontsource, subset latino, ~23 KB por peso). Inter e Source Sans 3 ainda são completas (~110 KB); avaliar subset latino na Fase 1.
- [x] Nome `az-ui` livre no npm em 2026-11-04 (D-019); reconferir antes de publicar.
- [x] Arquivo `LICENSE` (MIT, D-013) criado na raiz.
- [x] Git inicializado pelo mantenedor.
- [x] Validação do mantenedor para iniciar a Fase 1 (2026-11-04).

## Fase 1 — Fundação

Começar com análise breve da arquitetura, inconsistências e estrutura final (spec §18) e aguardar validação.

- [x] Configuração do projeto (`package.json`, TypeScript, Vite, PostCSS, Vitest + jsdom, ESLint, Prettier, Stylelint).
- [x] Estrutura de diretórios.
- [x] Tokens: cores e escalas.
- [x] Tokens: tipografia, espaçamento, bordas, sombras, breakpoints, motion, z-index, foco, altura de controles, opacidade.
- [x] Gerenciamento de fontes (Inter padrão; alternativas com import próprio; licenças).
- [x] Reset CSS (opt-in via `.az-body`, D-021).
- [x] Temas claro e escuro.
- [x] Utilitários CSS (incluindo variantes responsivas).
- [x] Núcleo JS mínimo: não necessário na fundação; adiado para a Fase 2/3 (`src/javascript/` ainda não criado).
- [x] Build inicial (ESM, tipos, CSS, fontes) e testes de exports/CSS/fontes.
- [x] Página de verificação visual `examples/foundations.html`.
- [x] Workflow `.github/workflows/pull-request.yml` que valida as seções obrigatórias do PR.
- [x] `examples/foundations.html` conferida no navegador: temas claro e escuro, três fontes e utilitário responsivo (2026-11-04).
- [x] Validação da fundação pelo mantenedor (2026-11-04).

Pendências que dependem da criação do repositório no GitHub (não bloqueiam a Fase 2):

- [x] Criar o repositório e o remoto (`origin`) e enviar o histórico (2026-11-05).
- [ ] Habilitar "Private vulnerability reporting" (exigido por `SECURITY.md` e `CODE_OF_CONDUCT.md`). Indisponível enquanto o repositório for privado; habilitar ao torná-lo público.
- [x] Proteção de `master` exigindo o check "Validate description" (D-031/D-033), sem bloquear administradores (2026-11-05). Confirmar o comportamento no primeiro PR.

## Fase 2 — Componentes básicos

- [x] Button · Badge · Alert · Spinner · Skeleton · Divider · Card · Avatar (CSS, docs em `docs/components/`).
- [x] Formulários básicos (inputs, textarea, select, checkbox, radio, switch, estados, help/erro).
- [x] API declarativa de formulários (`AZUI.Form.*`, `render()`, `group()`), D-034 a D-037.
- [x] Exemplo `examples/components.html`.
- [x] `npm run typecheck`, `lint`, `format:check` e `npm test` (136 testes) passando em 2026-11-06.
- [x] `examples/components.html` conferida no navegador nos temas claro e escuro, sem erros no console (2026-11-06).
- [x] Tamanhos `sm`/`lg` padronizados em todos os componentes com densidade (D-039).
- [x] Validação da fase pelo mantenedor (2026-11-06).

## Fase 3 — Componentes interativos

- [x] Modal · Dropdown · Tooltip · Popover · Tabs · Toast · Accordion · Offcanvas (D-040 a D-043).
- [x] Datepicker.
- [x] Núcleo JS (`Component`, `Overlay`, utilitários de DOM) e entrada `az-ui/auto`.
- [x] typecheck, lint, format:check, build e 250 testes passando; `examples/interactive.html` conferida no navegador (2026-11-06).
- [x] Revisão manual com leitor de tela feita pelo mantenedor (2026-11-06).
- [x] Validação da fase pelo mantenedor (2026-11-06).
- [ ] (Q-14) Notification · Command Menu · Context Menu — fase a definir.

## Fase 4 — Dados e avançados

- [ ] Table · DataTable · Pagination · Filter · Timeline · Progress · Empty State · Stat · Toolbar.
- [ ] (Q-14) Sortable Table, Search, Table Actions, Row Selection, Status Indicator, Key Value, List Group — confirmar fase.
- [ ] (Q-14) Formulários avançados: file, range, multi-select, input group, contador.

## Fase 5 — Layouts

- [ ] Container · Grid · Stack · Sidebar · Navbar · Page Header · Navigation Menu.
- [ ] (Q-14) Breadcrumb · Content Section · Split Layout · Row/Column/Flex.

## Fase 6 — Documentação

- [ ] VitePress · catálogo de componentes · exemplos · instalação · API · personalização.
- [ ] Seções de integração (PHP, frameworks) e acessibilidade.

## Fase 7 — Distribuição

- [ ] Build de produção · testes finais · versionamento semântico · preparação do pacote.
- [ ] Publicação npm **somente com autorização explícita**.

## Futuro (fora do escopo atual)

- Adaptador PHP (`AZForm`) como pacote separado.

## Suporte para uso

- Todos os frameworks frontend e com as linguagens mais populares, Exemplo: React, Next.js, Vue.js, Angular, Svelte, Astro, SvelteKit, Nuxt, Preact, SolidJS, além de outros fortemente usados na indústria.
