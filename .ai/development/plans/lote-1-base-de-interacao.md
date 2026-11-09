# Lote 1 — Base de interação: plano de implementação

> **Para quem executar:** usar `superpowers:subagent-driven-development` (recomendado) ou `superpowers:executing-plans`. Os passos usam caixas `- [ ]`.

**Objetivo:** entregar Collapse, Sortable, Kanban, Tree View, Stepper e Splitter como componentes da AZ UI.

**Arquitetura:** cada componente é uma subclasse de `Component` (`src/javascript/core/component.ts`), com CSS próprio importado em `src/styles/styles.css`, API declarativa por `data-az-component` em `src/auto.ts` e eventos `az:<nome>:<evento>` via `emit`. O Kanban é composto sobre o Sortable.

**Stack:** TypeScript, CSS puro, Vitest + jsdom. Sem dependências novas.

**Design:** `.ai/development/enterprise-phase-design.md` (D-057).

## Restrições globais

- Sem Bootstrap, Tailwind, jQuery ou biblioteca de drag and drop; usar a API nativa (`dragstart`/`dragover`/`drop`).
- Prefixo CSS `az-`; eventos `az:<componente>:<evento>`; erros com prefixo `AZUI:`.
- Código, testes, docs e exemplos em inglês; sem comentários no código salvo se indispensável.
- Todo arrastar tem alternativa por teclado e anúncio por região `aria-live`.
- Tamanhos `sm`/`lg` só se o componente tiver densidade (D-039). Temas claro e escuro via tokens existentes.
- Não instalar dependências, rodar testes/build/servidor nem usar git sem autorização do mantenedor. Por isso o plano não tem passos de commit; cada tarefa termina pedindo autorização para rodar `npm test`.
- Padrão de teste: `tests/components/<nome>/<nome>.test.ts`, no estilo de `tests/components/tabs/tabs.test.ts`.
- Cada componente: `src/components/<nome>/{<nome>.ts,<nome>.css,index.ts}`, export em `src/index.ts`, factory em `src/auto.ts` quando houver auto-init, doc em `docs/components/<nome>.md`.

## Foco da revisão

Entradas que o design implica e nenhum teste óbvio cobre; cada uma tem teste na tarefa dona:

1. Soltar item numa lista vazia (Sortable, Kanban).
2. `preventDefault` no evento de soltura devolve o item à origem (Sortable, Kanban com WIP).
3. `destroy()` durante um arraste não deixa listeners nem estado preso.
4. Setas esquerda/direita invertidas em `dir="rtl"` (Tree, Splitter).
5. Índice fora do intervalo em `Stepper.go` e `Sortable.move` não lança nem altera o DOM.

---

### Tarefa 1: Collapse

**Arquivos:** criar `src/components/collapse/{collapse.ts,collapse.css,index.ts}`, `tests/components/collapse/collapse.test.ts`, `docs/components/collapse.md`; alterar `src/styles/styles.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class Collapse extends Component<CollapseOptions>`; `interface CollapseOptions { open?: boolean }`; métodos `show(): void`, `hide(): void`, `toggle(): void`; getter `isOpen: boolean`.
- Eventos: `az:collapse:show` e `az:collapse:hide` (cancelável), depois `az:collapse:shown`/`hidden`.

- [ ] **Passo 1: testes** — `it("starts closed and hides content")`, `it("toggle sets hidden and aria-expanded on every trigger")`, `it("cancels hide when az:collapse:hide is prevented")`, `it("destroy removes listeners and state")`, `it("throws when initialized twice")`. Triggers são elementos com `data-az-toggle="collapse"` e `data-az-target="#id"`.
- [ ] **Passo 2:** implementar `Collapse` com a assinatura acima; o alvo usa `hidden`; `aria-expanded` e `aria-controls` ficam nos triggers. Animação de altura só em CSS (`grid-template-rows`), respeitando `prefers-reduced-motion`.
- [ ] **Passo 3:** em `src/auto.ts`, tratar cliques em `[data-az-toggle="collapse"]` criando/recuperando o `Collapse` do alvo (ramo próprio; `Collapse` não é `Overlay`).
- [ ] **Passo 4:** doc curta e export. Pedir autorização e rodar `npx vitest run tests/components/collapse`; esperado: todos passam.

### Tarefa 2: Sortable

**Arquivos:** criar `src/components/sortable/{sortable.ts,sortable.css,index.ts}`, `tests/components/sortable/sortable.test.ts`, `docs/components/sortable.md`; alterar `src/styles/styles.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class Sortable extends Component<SortableOptions>`.
- `interface SortableOptions { group?: string; handle?: string; items?: string; labels?: SortableLabels }` (`items` padrão `":scope > *"`; `labels` com textos de anúncio em inglês, substituíveis).
- `get items(): HTMLElement[]`; `move(item: HTMLElement, to: HTMLElement, index: number): boolean` (false se índice inválido ou evento cancelado).
- Listas com o mesmo `group` trocam itens; sem `group`, só reordenam internamente.
- Eventos: `az:sortable:start`, `az:sortable:drop` (cancelável), `az:sortable:cancel`. `detail`: `{ item, from, to, fromIndex, toIndex }`.
- Teclado: item focável (`tabindex`), `Space`/`Enter` pega e solta, `ArrowUp`/`ArrowDown` movem na lista, `ArrowLeft`/`ArrowRight` (invertidas em RTL) movem entre listas do grupo, `Esc` cancela. Anúncio em uma região `aria-live="polite"` única no documento.

- [ ] **Passo 1: testes** — `it("reorders within a list on drop")`, `it("moves between lists of the same group only")`, `it("drops into an empty list")`, `it("reverts when az:sortable:drop is prevented")`, `it("moves with the keyboard and announces the position")`, `it("cancels a keyboard move with Escape")`, `it("ignores drag starting outside the handle")`, `it("move returns false for an out-of-range index and leaves the DOM unchanged")`, `it("destroy during a drag removes listeners")`, `it("reverses horizontal arrows in rtl")`.
- [ ] **Passo 2:** implementar. Estado do arraste e registro de grupos em módulo privado; a posição de soltura vem de `event.clientY` (ou `clientX` em listas horizontais) comparado ao ponto médio dos itens. jsdom não calcula layout, então testar a lógica de posição por uma função pura exportada para teste (`insertionIndex(rects, point)`), sem testar geometria real.
- [ ] **Passo 3:** CSS de estado (`az-sortable-dragging`, `az-sortable-over`) usando tokens; sem animação exagerada.
- [ ] **Passo 4:** auto-init `data-az-component="sortable"` com `data-az-group` e `data-az-handle`; doc; export. Pedir autorização e rodar `npx vitest run tests/components/sortable`.

### Tarefa 3: Kanban

**Arquivos:** criar `src/components/kanban/{kanban.ts,kanban.css,index.ts}`, `tests/components/kanban/kanban.test.ts`, `docs/components/kanban.md`; alterar `src/styles/styles.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Consome: `Sortable` (Tarefa 2) e, para recolher colunas, `Collapse` (Tarefa 1).
- Produz: `class Kanban extends Component`; getter `columns: HTMLElement[]`.
- Markup composável: `.az-kanban` > (opcional `.az-kanban-lane`) > `.az-kanban-column` > `.az-kanban-header` (com `.az-kanban-count` opcional) + `.az-kanban-list` > `.az-kanban-card`. O conteúdo do cartão é livre.
- Limite opcional por coluna: `data-az-limit="N"`; coluna cheia ganha `az-kanban-column-full` e recusa soltura.
- Evento `az:kanban:move` (cancelável) com `{ card, fromColumn, toColumn, fromLane, toLane, index }`; raias são opcionais e o movimento entre raias é permitido (o sistema cancela se não quiser).

- [ ] **Passo 1: testes** — `it("makes every list sortable in one group")`, `it("works without lanes")`, `it("updates the count after a move")`, `it("blocks a drop that exceeds the column limit")`, `it("accepts a drop that reaches the limit exactly")`, `it("drops into an empty column")`, `it("reports lane and column in az:kanban:move")`, `it("reverts when az:kanban:move is prevented")`, `it("destroys its sortables")`.
- [ ] **Passo 2:** implementar escutando `az:sortable:drop` e reemitindo como `az:kanban:move`; a validação do limite cancela o evento do Sortable.
- [ ] **Passo 3:** CSS das colunas e raias (rolagem horizontal do quadro, colunas de largura fixa em tokens); cartão apenas contêiner com borda discreta.
- [ ] **Passo 4:** auto-init `data-az-component="kanban"`; doc com exemplo com e sem raias; export. Pedir autorização e rodar `npx vitest run tests/components/kanban`.

### Tarefa 4: Tree View

**Arquivos:** criar `src/components/tree/{tree.ts,tree.css,index.ts}`, `tests/components/tree/tree.test.ts`, `docs/components/tree.md`; alterar `src/styles/styles.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class Tree extends Component`; `expand(item: HTMLElement): void`, `collapse(item: HTMLElement): void`, `select(item: HTMLElement): void`; getter `selected: HTMLElement | null`.
- Markup: `ul.az-tree` > `li.az-tree-item` com `.az-tree-label` e `ul` aninhado opcional. O componente aplica `role="tree"/"group"/"treeitem"`, `aria-expanded` e `aria-selected`.
- Teclado (padrão ARIA tree, tabindex rotativo): `ArrowDown`/`ArrowUp`, `ArrowRight` (expande ou entra no primeiro filho), `ArrowLeft` (recolhe ou vai ao pai; invertidas em RTL), `Home`, `End`, `Enter` seleciona.
- Eventos: `az:tree:toggle` e `az:tree:select`, `detail: { item }`.
- Fora desta tarefa: carregamento sob demanda (pendência no design).

- [ ] **Passo 1: testes** — `it("applies tree roles and aria-expanded")`, `it("expands and collapses with arrows")`, `it("moves to parent with ArrowLeft on a collapsed item")`, `it("uses a roving tabindex")`, `it("Home and End jump to first and last visible item")`, `it("handles a tree with a single leaf")`, `it("swaps horizontal arrows in rtl")`, `it("destroy restores the markup")`.
- [ ] **Passo 2:** implementar; os itens visíveis são calculados a cada tecla (sem cache) para simplicidade.
- [ ] **Passo 3:** CSS com recuo por nível via `--az-tree-level`; doc; export. Pedir autorização e rodar `npx vitest run tests/components/tree`.

### Tarefa 5: Stepper

**Arquivos:** criar `src/components/stepper/{stepper.ts,stepper.css,index.ts}`, `tests/components/stepper/stepper.test.ts`, `docs/components/stepper.md`; alterar `src/styles/styles.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class Stepper extends Component`; `go(index: number): boolean`, `next(): boolean`, `previous(): boolean`, `setState(index: number, state: StepState): void`; `type StepState = "pending" | "complete" | "error"`; getter `current: number`.
- Markup: `.az-stepper` > `.az-stepper-step` (estado em `data-state`, passo atual com `aria-current="step"`) e, opcionalmente, `.az-stepper-panel` em igual número (o painel não atual fica `hidden`).
- Evento `az:stepper:change` (cancelável, disparado antes de trocar) com `{ from, to }`; o sistema valida a etapa e cancela para bloquear o avanço. O componente não valida campos.

- [ ] **Passo 1: testes** — `it("marks the first step as current")`, `it("go changes panels and aria-current")`, `it("blocks navigation when az:stepper:change is prevented")`, `it("go returns false for an out-of-range index")`, `it("next on the last step returns false")`, `it("setState updates data-state")`, `it("works without panels")`, `it("destroy restores the markup")`.
- [ ] **Passo 2:** implementar; sem validação interna.
- [ ] **Passo 3:** CSS horizontal e vertical (`az-stepper-vertical`); doc; export. Pedir autorização e rodar `npx vitest run tests/components/stepper`.

### Tarefa 6: Splitter

**Arquivos:** criar `src/components/splitter/{splitter.ts,splitter.css,index.ts}`, `tests/components/splitter/splitter.test.ts`, `docs/components/splitter.md`; alterar `src/styles/styles.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class Splitter extends Component`; `get size(): number` (percentual do primeiro painel); `resize(percent: number): void` (limitado pelos mínimos).
- Markup: `.az-splitter` (ou `.az-splitter-vertical`) > painel, `.az-splitter-handle`, painel. Mínimos em `data-az-min` (px) por painel.
- O handle recebe `role="separator"`, `tabindex="0"`, `aria-orientation`, `aria-valuenow/min/max` e `aria-controls`. Teclado: setas movem 10 px (`Shift` = 50 px), `Home`/`End` vão aos mínimos; setas horizontais invertidas em RTL.
- Evento `az:splitter:resize`, `detail: { size }`.

- [ ] **Passo 1: testes** — `it("sets separator semantics on the handle")`, `it("resize clamps to the minimum sizes")`, `it("keyboard arrows resize and update aria-valuenow")`, `it("Home and End go to the limits")`, `it("swaps arrows in rtl")`, `it("destroy removes listeners and inline sizes")`. Larguras vêm de `getBoundingClientRect` simulado no teste.
- [ ] **Passo 2:** implementar com eventos de ponteiro (padrão do `Modal` arrastável, D-056); o primeiro painel usa `flex-basis` em %.
- [ ] **Passo 3:** CSS do handle (área de toque ≥ 8 px visual, foco visível); doc; export. Pedir autorização e rodar `npx vitest run tests/components/splitter`.

### Tarefa 7: Fechamento do lote

**Arquivos:** criar `examples/` página do lote (seguir o padrão de `examples/interactive.html`); alterar `README.md` (lista de componentes), `CHANGELOG.md`, `.ai/development/roadmap.md` (marcar o lote 1), `.ai/development/decisions.md` se surgirem decisões novas.

- [ ] **Passo 1:** página de exemplo com kanban com e sem raias, tree, stepper, splitter, collapse e sortable, nos temas claro e escuro.
- [ ] **Passo 2:** atualizar README, CHANGELOG e roadmap.
- [ ] **Passo 3:** pedir autorização ao mantenedor e rodar `npm run typecheck`, `lint`, `format:check` e `npm test`; esperado: tudo passa. Conferir a página no navegador e a navegação por teclado; revisão com leitor de tela fica com o mantenedor.
- [ ] **Passo 4:** aguardar a validação do lote pelo mantenedor antes de iniciar o lote 2.

## Auto-revisão

- Cobertura do design: Collapse (T1), Sortable (T2), Kanban composável com raias opcionais e limite (T3), Tree (T4), Stepper (T5), Splitter (T6), teclado e leitor de tela em todos.
- Pendência explícita: carregamento sob demanda da Tree, mantida em aberto no design.
