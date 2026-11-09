# Lote 3 — Tabelas pesadas: plano de implementação

> **Para quem executar:** usar `superpowers:executing-plans` (execução nativa, como nos lotes 1 e 2) ou `superpowers:subagent-driven-development`. Os passos usam caixas `- [ ]`.

**Objetivo:** entregar exportação CSV, reordenação de linhas, `RowExpand`, `TableEdit`, `TableColumns`, `ColumnReorder`, `TreeGrid` e `VirtualTable`.

**Arquitetura:** cada recurso é um componente pequeno (subclasse de `Component`, `src/javascript/core/component.ts`) que se compõe com a marcação de tabela existente, sem alterar o `DataTable`. Todos ficam em `src/components/table/`, e o CSS novo entra em `src/components/table/table.css`.

**Stack:** TypeScript, CSS puro, Vitest + jsdom. Sem dependências novas.

**Design:** `.ai/development/enterprise-phase-design.md`, seção "Lote 3".

## Restrições globais

- Sem bibliotecas externas; prefixo CSS `az-`; erros `AZUI:`; código, testes, docs e exemplos em inglês; sem comentários salvo se indispensável.
- Convenção do projeto: um `.css` por diretório de componente. Como tudo fica em `src/components/table/`, o CSS vai em `table.css` (já importado), só com classes `az-`, tokens, sem cores fixas e sem `!important`.
- Todo componente novo: export em `src/index.ts` e em `tests/package/exports.test.ts` (lista ordenada), factory em `src/auto.ts` quando for declarativo, doc em `docs/components/`.
- Teclado completo e ARIA; setas horizontais invertidas em `dir="rtl"`.
- Codificação: ao editar arquivos com Python, abrir e gravar sempre com `encoding="utf-8"` (no Windows o padrão corrompe acentos).
- Antes de concluir: `npx prettier --write` nos arquivos novos.
- Não rodar testes, build, servidor ou git sem autorização do mantenedor. Sem passos de commit.
- Limitação documentada (D-061): `RowExpand`, `TreeGrid` e `ColumnReorder` não se combinam com ordenação, paginação e ocultação de colunas do `DataTable`.
- Testes em `tests/components/table/<nome>.test.ts`, no estilo dos lotes anteriores.

## Foco da revisão

Entradas que os testes óbvios não cobrem; cada uma tem teste na tarefa dona:

1. CSV: células com aspas, delimitador e quebra de linha; texto que começa com `=`, `+`, `-` ou `@` não pode virar fórmula no Excel, mas números negativos continuam números.
2. Edição inline: `az:tableedit:commit` cancelado devolve o valor antigo; começar a editar outra célula confirma a atual; `Escape` não dispara commit.
3. `VirtualTable`: rolar até o fim renderiza as últimas linhas sem buraco; `setRowCount` menor que a posição atual ajusta a rolagem; `rowCount` 0.
4. `TreeGrid`: recolher um pai esconde todos os descendentes; expandir um pai não revela netos de um filho recolhido.
5. `ColumnReorder`: mover a primeira coluna para o fim atualiza o cabeçalho e todas as linhas; `TableColumns`: os deslocamentos das colunas fixas são recalculados depois de redimensionar.

---

### Tarefa 1: Exportação CSV

**Arquivos:** criar `src/components/table/csv.ts`, `tests/components/table/csv.test.ts`, `docs/components/csv-export.md`; alterar `src/components/table/index.ts`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `interface CsvOptions { delimiter?: string; rows?: "all" | "visible" | "selected"; header?: boolean; sanitize?: boolean; bom?: boolean }` (padrões: `","`, `"all"`, `true`, `true`, `true`); `tableToCsv(table: HTMLTableElement, options?: CsvOptions): string` (sem BOM); `downloadCsv(table: HTMLTableElement, filename: string, options?: CsvOptions): void` (usa `Blob` com BOM quando `bom`, âncora temporária e `URL.revokeObjectURL`).
- Colunas: ignora colunas cujo cabeçalho tem `hidden` e as com classe `az-table-select` ou `az-table-actions`; `data-az-export` na célula substitui o texto. Texto = `textContent` com espaços colapsados e aparado.
- Linhas: `"all"` todas as do `tbody`, `"visible"` as sem `hidden`, `"selected"` as com `aria-selected="true"`. `header` inclui a linha do `thead`.
- Citação: entre aspas se tiver o delimitador, aspas ou quebra de linha; aspas internas duplicadas. `sanitize` prefixa `'` ao texto que começa com `=`, `+`, `-`, `@`, tabulação ou retorno, exceto quando o texto inteiro é um número.
- Auto: clique em `[data-az-export-csv="#id-da-tabela"]` baixa o CSV (`data-az-filename`, padrão `table.csv`; `data-az-rows`).

- [ ] **Passo 1: testes** — cabeçalho e linhas simples; aspas, vírgula e quebra de linha entre aspas (Foco 1); `"=SUM(A1)"` vira `'=SUM(A1)`, `-5` e `-5.5` ficam intactos (Foco 1); `sanitize: false` não altera; coluna oculta e colunas `az-table-select`/`az-table-actions` fora; `data-az-export` vence o texto; `rows: "selected"` e `"visible"`; `header: false`; delimitador `;`; `downloadCsv` cria um `Blob` que começa com o BOM (espiar `URL.createObjectURL`).
- [ ] **Passo 2:** implementar, doc, exports, auto-init. Pedir autorização e rodar `npx vitest run tests/components/table/csv`.

### Tarefa 2: Reordenar linhas (Sortable em `<tbody>`)

**Arquivos:** criar `tests/components/table/row-reorder.test.ts`; alterar `src/auto.ts`, `src/components/table/table.css`, `docs/components/table.md`, `docs/components/sortable.md`.

**Interfaces:**
- Consome: `Sortable` (lote 1) com `items: "tr"`.
- Auto: a factory `sortable` passa também `items: element.dataset.azItems`, ou seja `data-az-component="sortable" data-az-items="tr"` em um `<tbody>`.
- CSS: `.az-table-handle` (coluna estreita com `cursor: grab` e cor atenuada).

- [ ] **Passo 1: testes** — um `Sortable` com `items: "tr"` num `<tbody>` reordena as linhas ao soltar e ignora linhas de outra marcação; teclado (Espaço, seta para baixo, Enter) move a linha; o evento `az:sortable:drop` traz o índice novo.
- [ ] **Passo 2:** auto-init, CSS, seção "Reordering rows" em `table.md` e nota em `sortable.md`. Pedir autorização e rodar `npx vitest run tests/components/table/row-reorder`.

### Tarefa 3: RowExpand

**Arquivos:** criar `src/components/table/row-expand.ts`, `tests/components/table/row-expand.test.ts`, `docs/components/row-expand.md`; alterar `src/components/table/index.ts`, `table.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class RowExpand extends Component`; `expand(row: HTMLTableRowElement): void`, `collapse(row): void`, `toggle(row): void`, `expandAll(): void`, `collapseAll(): void`, `isExpanded(row): boolean`.
- Marcação: linha com `button[data-az-expand]` e, logo depois, `tr.az-table-detail`. O componente (no elemento `<table>` ou wrapper) define `aria-expanded` e `aria-controls` no botão, esconde as linhas de detalhe (`hidden`) e abre as que têm `aria-expanded="true"` no botão.
- Evento `az:rowexpand:toggle` (`detail: { row, detail, expanded }`).
- CSS: seta do botão girando conforme `aria-expanded`; `.az-table-detail td` com fundo atenuado.

- [ ] **Passo 1: testes** — começa recolhido; botão alterna `hidden` da linha de detalhe e `aria-expanded`; `aria-controls` aponta para o id do detalhe; respeita `aria-expanded="true"` inicial; `expandAll`/`collapseAll`; evento com `expanded`; clique em botão de outra linha não afeta a primeira; linha sem detalhe seguinte é ignorada; `destroy()` mostra os detalhes de novo e remove atributos.
- [ ] **Passo 2:** implementar, CSS, doc (com a limitação), exports, auto-init (`data-az-component="rowexpand"`). Pedir autorização e rodar `npx vitest run tests/components/table/row-expand`.

### Tarefa 4: TableEdit

**Arquivos:** criar `src/components/table/table-edit.ts`, `tests/components/table/table-edit.test.ts`, `docs/components/table-edit.md`; alterar `src/components/table/index.ts`, `table.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class TableEdit extends Component`; `edit(cell: HTMLTableCellElement): void`, `cancel(): void`, getter `isEditing: boolean`.
- Células editáveis: `td[data-az-edit="text"|"number"]`; o componente dá `tabindex="0"` a elas. Duplo clique ou `Enter` na célula focada abre um `<input class="az-control az-control-sm">` (`type="number"` para `number`, com `step="any"`) com o valor atual (`data-az-value` ou texto). `Enter` confirma, `Escape` cancela, perder o foco confirma.
- Evento cancelável `az:tableedit:commit` (`detail: { cell, row, column, oldValue, newValue }`), só se o valor mudou. Se não cancelado, a célula recebe `newValue` como texto e `data-az-value`; se cancelado, mostra o valor antigo.
- Só uma célula edita por vez; `edit()` em outra célula confirma a atual antes.

- [ ] **Passo 1: testes** — duplo clique abre o campo com o valor; `Enter` confirma e atualiza o texto; sem mudança não emite `commit`; `Escape` cancela sem `commit` (Foco 2); `commit` cancelado restaura o valor antigo (Foco 2); sair do campo confirma; editar outra célula confirma a primeira (Foco 2); `type="number"` no campo numérico; foco volta para a célula depois de confirmar ou cancelar; célula sem `data-az-edit` é ignorada; `destroy()` cancela a edição e remove `tabindex`.
- [ ] **Passo 2:** implementar, CSS (célula em edição sem padding extra), doc, exports, auto-init (`data-az-component="tableedit"`). Pedir autorização e rodar `npx vitest run tests/components/table/table-edit`.

### Tarefa 5: TableColumns (redimensionar e fixar)

**Arquivos:** criar `src/components/table/table-columns.ts`, `tests/components/table/table-columns.test.ts`, `docs/components/table-columns.md`; alterar `src/components/table/index.ts`, `table.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class TableColumns extends Component`; `resize(column: number, width: number): void` (respeita a largura mínima); `refreshSticky(): void`.
- Redimensionar: `th[data-az-resizable]` recebe uma alça `span.az-table-resize` (`role="separator"`, `aria-orientation="vertical"`, `tabindex="0"`, `aria-label` "Resize column {texto do cabeçalho}"). Arraste por ponteiro e teclado (`ArrowLeft`/`ArrowRight` ±10 px, `Shift` ±50 px, invertido em RTL). Largura mínima `data-az-min-width` (padrão 48). A tabela precisa de `az-table-fixed` (`table-layout: fixed`), que o componente adiciona.
- Fixar: `th[data-az-sticky]` marca a coluna; o componente dá `az-table-sticky` às células da coluna e define `inset-inline-start` em px, somando a largura das colunas fixas anteriores. Recalcula depois de cada `resize` e em `refreshSticky()`.
- Evento `az:tablecolumns:resize` (`detail: { column, width }`).

- [ ] **Passo 1: testes** — alça com semântica de separator e nome acessível; `resize` aplica a largura em px no `th`; clamp na largura mínima; setas e `Shift` mudam a largura; setas invertidas em RTL; evento; colunas fixas recebem `az-table-sticky` e deslocamento acumulado (largura simulada com `getBoundingClientRect`) e o deslocamento é recalculado depois de `resize` (Foco 5); coluna sem `data-az-resizable` não ganha alça; `destroy()` remove alças, classes e estilos.
- [ ] **Passo 2:** implementar, CSS (`.az-table-fixed`, `.az-table-resize` na borda do cabeçalho, `.az-table-sticky` com fundo e z-index), doc, exports, auto-init (`data-az-component="tablecolumns"`). Pedir autorização e rodar `npx vitest run tests/components/table/table-columns`.

### Tarefa 6: ColumnReorder

**Arquivos:** criar `src/components/table/column-reorder.ts`, `tests/components/table/column-reorder.test.ts`, `docs/components/column-reorder.md`; alterar `src/components/table/index.ts`, `table.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class ColumnReorder extends Component`; `move(from: number, to: number): boolean` (índices de coluna; `false` se inválidos ou cancelado).
- Cabeçalhos `th[data-az-reorderable]` ficam `draggable` e focáveis. Arrastar um sobre outro e soltar move a coluna; no teclado, `Alt`+`ArrowLeft`/`ArrowRight` move a coluna focada (invertido em RTL). `move` reposiciona a célula em cada linha da tabela (cabeçalho e corpo), mantendo o foco no cabeçalho.
- Evento cancelável `az:columnreorder:reorder` (`detail: { from, to }`); cancelar impede o movimento.

- [ ] **Passo 1: testes** — `move(0, 2)` reordena o cabeçalho e todas as linhas (Foco 5); mover a primeira coluna para o fim e a última para o início; índice inválido ou igual retorna `false` sem mexer; evento cancelável impede; `Alt`+setas movem e mantêm o foco; setas invertidas em RTL; arrastar e soltar pelo cabeçalho; só `th[data-az-reorderable]` é arrastável; `destroy()` remove `draggable` e `tabindex`.
- [ ] **Passo 2:** implementar, CSS (estado de arraste), doc (com a limitação), exports, auto-init (`data-az-component="columnreorder"`). Pedir autorização e rodar `npx vitest run tests/components/table/column-reorder`.

### Tarefa 7: TreeGrid

**Arquivos:** criar `src/components/table/tree-grid.ts`, `tests/components/table/tree-grid.test.ts`, `docs/components/tree-grid.md`; alterar `src/components/table/index.ts`, `table.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class TreeGrid extends Component`; `expand(row: HTMLTableRowElement): void`, `collapse(row): void`, `expandAll(): void`, `collapseAll(): void`, `isExpanded(row): boolean`.
- Marcação: `tr[data-az-level="1".."n"]` no `tbody`. Uma linha tem filhos quando a próxima tem nível maior. O componente define `role="treegrid"` na tabela, `aria-level` e, nas linhas com filhos, `aria-expanded` (inicial `aria-expanded="true"` ou recolhida); esconde (`hidden`) as linhas cujo ancestral está recolhido; adiciona `span.az-treegrid-toggle` na primeira célula das linhas com filhos e define `--az-treegrid-level` nela para o recuo.
- Teclado (padrão treegrid, tabindex rotativo nas linhas): `ArrowDown`/`ArrowUp` linhas visíveis, `ArrowRight` expande ou entra no primeiro filho, `ArrowLeft` recolhe ou vai ao pai (invertidas em RTL), `Home`/`End`. Clique no toggle alterna.
- Evento `az:treegrid:toggle` (`detail: { row, expanded }`).

- [ ] **Passo 1: testes** — níveis e `aria-level`; linhas com filhos recebem `aria-expanded` e toggle; recolhido por padrão e `aria-expanded="true"` inicial; recolher um pai esconde todos os descendentes (Foco 4); expandir um pai não revela netos de um filho recolhido (Foco 4); `expandAll`/`collapseAll`; teclas (expandir, entrar, recolher, ir ao pai, Home/End); tabindex rotativo; RTL; evento; linha folha ignora `ArrowRight`; `destroy()` restaura.
- [ ] **Passo 2:** implementar, CSS (recuo por nível e seta como no `Tree`), doc (com a limitação), exports, auto-init (`data-az-component="treegrid"`). Pedir autorização e rodar `npx vitest run tests/components/table/tree-grid`.

### Tarefa 8: VirtualTable

**Arquivos:** criar `src/components/table/virtual-table.ts`, `tests/components/table/virtual-table.test.ts`, `docs/components/virtual-table.md`; alterar `src/components/table/index.ts`, `table.css`, `src/index.ts`.

**Interfaces:**
- Produz: `class VirtualTable extends Component<VirtualTableOptions>`; `interface VirtualTableOptions { rowCount: number; rowHeight: number; renderRow: (index: number) => HTMLTableRowElement; overscan?: number }` (`overscan` padrão 5); `setRowCount(count: number): void`; `refresh(): void` (renderiza de novo a janela atual, para quando os dados mudarem); `scrollToRow(index: number): void`; getter `range: { start: number; end: number }` (`end` exclusivo).
- Elemento: contêiner com rolagem (`.az-table-wrap`, altura definida pelo consumidor) com `<table>` e `<tbody>` vazio. O `tbody` recebe: linha espaçadora de cima (`tr.az-table-spacer` com altura `start * rowHeight`), as linhas de `renderRow(index)` para `start..end` e a de baixo (`(rowCount - end) * rowHeight`); o `colspan` dos espaçadores é o número de colunas do `thead`. `start = max(0, floor(scrollTop / rowHeight) - overscan)` e `end = min(rowCount, ceil((scrollTop + clientHeight) / rowHeight) + overscan)`; só renderiza de novo quando a janela muda (escuta `scroll`).
- ARIA: `aria-rowcount` na tabela (`rowCount` mais linhas de cabeçalho) e `aria-rowindex` em cada linha (`index + 1 + linhas de cabeçalho`).
- Altura de linha fixa; o consumidor garante que `renderRow` produza linhas com essa altura. Sem auto-init (`renderRow` é uma função).
- CSS: cabeçalho fixo no topo (`.az-table-virtual thead th { position: sticky; top: 0 }`).

- [ ] **Passo 1: testes** (simular `clientHeight` e `scrollTop` com `Object.defineProperty`) — janela inicial com overscan; rolar renderiza outras linhas e atualiza os espaçadores; só renderiza de novo quando a janela muda (contar chamadas de `renderRow`); rolar até o fim mostra as últimas linhas sem buraco (Foco 3); `setRowCount` menor ajusta a janela e a rolagem (Foco 3); `rowCount` 0 não lança e mostra só espaçadores vazios (Foco 3); `scrollToRow` ajusta `scrollTop`; `refresh` chama `renderRow` de novo; `aria-rowcount` e `aria-rowindex`; `destroy()` limpa o `tbody` e remove os listeners; lança `AZUI:` sem `<tbody>` ou com `rowHeight` ≤ 0.
- [ ] **Passo 2:** implementar, CSS, doc (altura fixa, ordenação e filtro do lado do consumidor), exports. Pedir autorização e rodar `npx vitest run tests/components/table/virtual-table`.

### Tarefa 9: Fechamento do lote

**Arquivos:** criar `examples/tables.html` (padrão de `examples/entry.html`); alterar `examples/index.html`, `README.md`, `CHANGELOG.md`, `.ai/development/roadmap.md`, `.ai/development/decisions.md`, `tests/package/exports.test.ts` (se ainda faltar algum nome).

- [ ] **Passo 1:** página `examples/tables.html` com: tabela com exportar CSV, linhas reordenáveis, linhas expansíveis, edição inline, colunas redimensionáveis, fixas e reordenáveis, tree grid e tabela virtual com 10 000 linhas geradas no cliente; link no índice.
- [ ] **Passo 2:** README (linha "Tables"), CHANGELOG, roadmap (marcar o lote 3) e decisão em `decisions.md` para escolhas novas.
- [ ] **Passo 3:** `npx prettier --write` nos arquivos novos; pedir autorização e rodar `npm run typecheck`, `lint`, `format:check` e `npm test`; esperado: tudo passa. Conferir a página no navegador, com teclado, e o tempo de rolagem da tabela virtual.
- [ ] **Passo 4:** aguardar a validação do lote pelo mantenedor antes do lote 4.

## Auto-revisão

- Cobertura do design: CSV (T1), reordenar linhas (T2), linhas expansíveis (T3), edição inline (T4), redimensionar e fixar colunas (T5), reordenar colunas (T6), Tree Grid (T7), rolagem virtual (T8).
- Fora do escopo, como no design: agrupamento de linhas, totais calculados, edição em lote, células mescladas, cabeçalho fixo com várias linhas.
