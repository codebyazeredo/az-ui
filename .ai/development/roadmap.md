# Roadmap e andamento — AZ UI

Fonte: `specifications.md` §15 (complementado com itens da §6 que estavam fora das fases, ver Q-14). **Este é o painel de controle do projeto**: marcar `[x]` ao concluir, na mesma tarefa.

Fase atual: **0 — Pré-desenvolvimento**

| Fase | Nome | Status |
|---|---|---|
| 0 | Pré-desenvolvimento | Em andamento |
| 1 | Fundação | Não iniciada |
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
- [ ] Inicializar git (a cargo do mantenedor) e regras de branch.
- [ ] Validação do mantenedor para iniciar a Fase 1.

## Fase 1 — Fundação

Começar com análise breve da arquitetura, inconsistências e estrutura final (spec §18) e aguardar validação.

- [ ] Configuração do projeto (`package.json`, TypeScript, Vite, PostCSS, Vitest + jsdom).
- [ ] Estrutura de diretórios.
- [ ] Tokens: cores e escalas.
- [ ] Tokens: tipografia, espaçamento, bordas, sombras, breakpoints, motion, z-index, foco, altura de controles, opacidade.
- [ ] Gerenciamento de fontes (Inter padrão; alternativas com import próprio; licenças).
- [ ] Reset CSS.
- [ ] Temas claro e escuro.
- [ ] Utilitários CSS (incluindo variantes responsivas).
- [ ] Núcleo JS mínimo (ciclo de vida, DOM, eventos) — apenas se exigido pela fundação.
- [ ] Build inicial (ESM, tipos, CSS, fontes) e testes de exports/CSS/fontes.
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
