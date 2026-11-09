# Roadmap e andamento — AZ UI

Fonte: `specifications.md` §15 (complementado com itens da §6 que estavam fora das fases, ver Q-14). **Este é o painel de controle do projeto**: marcar `[x]` ao concluir, na mesma tarefa.

Fase atual: **6 — Documentação**, implementada e aguardando validação (Fase 5 validada em 2026-11-06). Pendente da Fase 3: revisão com leitor de tela e validação de Notification, Command Menu e Context Menu (Q-14).

| Fase | Nome | Status |
|---|---|---|
| 0 | Pré-desenvolvimento | Concluída |
| 1 | Fundação | Concluída (validada); restam configurações do GitHub |
| 2 | Componentes básicos | Concluída |
| 3 | Componentes interativos | Concluída, exceto validação dos itens Q-14 |
| 4 | Dados e avançados | Concluída |
| 5 | Layouts | Concluída |
| 6 | Documentação | Implementada, aguardando validação |
| Enterprise | Componentes para sistemas corporativos (D-057) | Concluída (lotes 1 a 4 validados pelo mantenedor em 2026-11-09) |
| 7 | Distribuição | Não iniciada |

## Fase 0 — Pré-desenvolvimento

- [x] Especificação (`specifications.md`).
- [x] Matriz de contexto `.ai/` e arquivos da raiz.
- [x] Responder questões bloqueantes da Fase 1 (D-011 a D-018).
- [x] Licenças das fontes pré-verificadas (OFL 1.1, D-020). Confirmar o `LICENSE.txt` oficial de cada repositório no momento de baixar os arquivos (Fase 1).
- [x] Fontes em `fonts/`: Inter 4.1 e Source Sans 3 (4 pesos WOFF2 + licença). Subset latino ainda não aplicado (~110 KB por arquivo).
- [x] IBM Plex Sans em `fonts/ibm-plex-sans/` (Fontsource, subset latino, ~23 KB por peso). Inter e Source Sans 3 ainda são completas (~110 KB); avaliar subset latino na Fase 1.
- [x] Nome `az-ui` livre no npm em 2026-11-04 (D-019), mas recusado na publicação (similar a `azui`); o pacote será `@codebyazeredo/az-ui` (D-065).
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
- [x] Núcleo JS (`Component`, `Overlay`, utilitários de DOM) e entrada `@codebyazeredo/az-ui/auto`.
- [x] typecheck, lint, format:check, build e 250 testes passando; `examples/interactive.html` conferida no navegador (2026-11-06).
- [x] Revisão manual com leitor de tela feita pelo mantenedor (2026-11-06).
- [x] Validação da fase pelo mantenedor (2026-11-06).
- [x] (Q-14) Notification · Command Menu · Context Menu (D-044, D-045); 288 testes passando, ainda sem revisão com leitor de tela e sem validação do mantenedor.

## Fase 4 — Dados e avançados

- [x] Table · DataTable · Pagination · Filter · Timeline · Progress · Empty State · Stat · Toolbar (D-046, D-047).
- [x] (Q-14) Sortable Table, Search, Table Actions, Row Selection, Status Indicator, Key Value, List Group (D-046).
- [x] (Q-14) Formulários avançados: file, range, multi-select, input group, contador (D-048).
- [x] Select e multi-select próprios (`Select`, D-049) e `FileUpload` (D-050); 376 testes passando; `examples/data.html` conferida no navegador.
- [x] typecheck, lint, format:check e 342 testes passando em 2026-11-06. Build rodado pelo mantenedor; `examples/data.html` conferida no navegador nos temas claro e escuro, sem erros no console.
- [x] Validação da fase pelo mantenedor (2026-11-06).

## Fase 5 — Layouts

- [x] Container · Grid · Stack · Sidebar · Navbar · Page Header · Navigation Menu (somente CSS, D-052, D-053).
- [x] (Q-14) Breadcrumb · Content Section · Split Layout · Row/Column/Flex (D-051); Flex coberto pelos utilitários existentes.
- [x] `examples/layouts.html` e `docs/components/layouts.md`.
- [x] typecheck, lint, format:check e 399 testes passando em 2026-11-06 (build não executado).
- [x] `examples/layouts.html` conferida no navegador nos temas claro e escuro e em largura mobile (menu em Offcanvas), sem erros no console.
- [x] Validação da fase pelo mantenedor (2026-11-06).

## Fase 6 — Documentação

- [x] Documentação em Markdown (`docs/`): instalação, primeiros passos, fundamentos, componentes, API, personalização, acessibilidade, PHP, frameworks e versionamento (D-055).
- [x] `README.md` profissional com capturas de tela.
- [x] `examples/` refeita: componentes, formulários, dados, overlays e modais, ícones e quatro telas completas.
- [x] `typecheck`, `lint` e `format:check` passando; exemplos conferidos no navegador (2026-11-06).
- [ ] Site público: projeto separado, fora deste repositório.
- [ ] Validação da fase pelo mantenedor.

## Fase Enterprise

Design em `enterprise-phase-design.md` (D-057). Um lote por vez, com validação do mantenedor antes do próximo.

- [x] Lote 1 — Base de interação: Collapse · Sortable · Kanban · Tree View · Stepper · Splitter. Implementado (`examples/interaction.html` conferida no navegador); testes unitários passando; validado pelo mantenedor (2026-11-09). e sem revisão com leitor de tela.
- [x] Lote 2 (D-059) — Entrada de dados: Combobox · Dual Listbox · Tag Input · máscaras · intervalo de datas · hora (campo nativo) · código de barras. Implementado (`examples/entry.html` conferida no navegador); typecheck, lint, format:check e 601 testes passando em 2026-11-09; validado pelo mantenedor (2026-11-09).
- [x] Lote 3 (D-061) — Tabelas pesadas: exportação CSV · reordenar linhas · RowExpand · TableEdit · TableColumns · ColumnReorder · TreeGrid · VirtualTable. Implementado (`examples/tables.html` conferida no navegador); typecheck, lint, format:check e 698 testes passando em 2026-11-09; validado pelo mantenedor (2026-11-09).
- [x] Lote 4 (D-063) — Operação: WidgetGrid · Calendar · Scheduler · Gantt. Implementado (`examples/operations.html` conferida no navegador); typecheck, lint (ESLint e stylelint), format:check e 824 testes passando em 2026-11-09; validado pelo mantenedor (2026-11-09).

## Fase 7 — Distribuição

- [ ] Build de produção · testes finais · versionamento semântico · preparação do pacote.
- [ ] Publicação npm **somente com autorização explícita**.

## Futuro (fora do escopo atual)

- Adaptador PHP (`AZForm`) como pacote separado.

## Suporte para uso

- Todos os frameworks frontend e com as linguagens mais populares, Exemplo: React, Next.js, Vue.js, Angular, Svelte, Astro, SvelteKit, Nuxt, Preact, SolidJS, além de outros fortemente usados na indústria.

## Para ver após a conclusão da Fase 6 (antes da distribuição)

O mercado corporativo ("enterprise") tem demandas muito específicas que a maioria dos frameworks genéricos não atende de fábrica.
Para que o seu framework se destaque e realmente resolva as dores de grandes empresas, foque em cinco pilares fundamentais:

1. Acessibilidade (A11y) Rigorosa

Empresas sofrem processos pesados e multas se seus sistemas não forem acessíveis.
• Foco total em WCAG 2.1/2.2: Garanta conformidade com os níveis AA ou AAA de fábrica.
• Navegação por teclado: Todos os componentes complexos (como modais, abas e menus suspensos) devem ser 100% operáveis via teclado.
• Atributos ARIA: Deixe os papéis (roles) e estados ARIA configurados dinamicamente.

2. Alta Densidade de Dados

Diferente de sites de marketing ou redes sociais, sistemas corporativos precisam exibir o máximo de informação útil com o mínimo de rolagem.
• Componentes compactos: Crie variantes "dense" ou "compact" para tabelas (data tables), formulários e botões.
• Grades complexas: O sistema de grid e os layouts de página precisam suportar dashboards cheios de gráficos e painéis colapsáveis.

3. Foco em Formulários e Validações Complexas

O dia a dia do desenvolvimento enterprise é criar telas com dezenas de campos de entrada de dados.
• Estados de formulário: Componentes nativos para estados de erro, aviso (warning), sucesso, carregamento (loading) e desabilitado.
• Componentes corporativos padrão: Inclua nativamente seletores de data/hora complexos (com intervalos), campos de busca com autocompletar e seletores de arquivos por arrastar e soltar.

4. Internacionalização (i18n) e Temas (White-label)

Grandes empresas operam globalmente e costumam criar múltiplos produtos internos com marcas diferentes.
• Suporte a RTL (Right-to-Left): Código preparado para idiomas como árabe e hebraico.
• Design Tokens fortes: Use variáveis CSS (CSS Variables) robustas para que a empresa possa mudar todas as cores, fontes e arredondamentos (border-radius) para bater com a identidade visual dela em minutos.

5. Estabilidade e Ciclo de Vida Longo (LTS)

Empresas odeiam atualizar um framework e descobrir que metade das telas quebrou (breaking changes).
• Versionamento Semântico (SemVer): Seja extremamente rígido com atualizações.
• Garantia de Retrocompatibilidade: Ofereça suporte de longo prazo (LTS) para versões antigas.
