# Roadmap e andamento — AZ UI

Fonte: `specifications.md` §15 (complementado com itens da §6 que estavam fora das fases, ver Q-14). **Este é o painel de controle do projeto**: marcar `[x]` ao concluir, na mesma tarefa.

Fase atual: **1 — Fundação** (Fase 0 concluída em 2026-11-04)

| Fase | Nome | Status |
|---|---|---|
| 0 | Pré-desenvolvimento | Concluída |
| 1 | Fundação | Implementada, aguardando validação |
| 2 | Componentes básicos | Não iniciada |
| 3 | Componentes interativos | Não iniciada |
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
- [x] Página de verificação visual `examples/foundations.html` (conferência visual pendente, ver abaixo).
- [ ] Habilitar "Private vulnerability reporting" no repositório do GitHub (exigido por `SECURITY.md` e `CODE_OF_CONDUCT.md`).
- [ ] Conferir `examples/foundations.html` no navegador (`npm run dev`) nos dois temas e nas três fontes.
- [ ] Validação da fundação pelo mantenedor.

## Fase 2 — Componentes básicos

- [ ] Button · Badge · Alert · Spinner · Skeleton · Divider · Card · Avatar.
- [ ] Formulários básicos (inputs, textarea, select, checkbox, radio, switch, estados, help/erro).
- [ ] API declarativa de formulários (`AZUI.Form.*`, `render()`, `group()`).

## Fase 3 — Componentes interativos

- [ ] Modal · Dropdown · Tooltip · Popover · Tabs · Toast · Accordion · Offcanvas.
- [ ] Datepicker.
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
