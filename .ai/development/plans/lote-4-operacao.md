# Lote 4 — Operação: plano de implementação

> **Para quem executar:** usar `superpowers:executing-plans` (execução nativa, como nos lotes anteriores) ou `superpowers:subagent-driven-development`. Os passos usam caixas `- [ ]`.

**Objetivo:** entregar `WidgetGrid`, `Calendar` (mensal), `Scheduler` (agenda por recurso) e `Gantt`.

**Arquitetura:** componentes orientados a dados (subclasses de `Component`, `src/javascript/core/component.ts`): o consumidor informa os dados, o componente desenha, trata a interação e emite eventos `az:<nome>:<evento>` (os de mudança são canceláveis); nada é gravado. Reaproveitam o `Sortable`, os utilitários de data de `src/components/datepicker/calendar.ts` e um novo utilitário de arraste por ponteiro.

**Stack:** TypeScript, CSS puro, Vitest + jsdom. Sem dependências novas.

**Design:** `.ai/development/enterprise-phase-design.md`, seção "Lote 4" (com o ajuste registrado em D-063).

## Restrições globais

- Sem bibliotecas externas; prefixo CSS `az-`; erros `AZUI:`; código, testes, docs e exemplos em inglês; sem comentários salvo se indispensável.
- Um `.css` por diretório de componente (`src/components/<nome>/<nome>.css`), importado em `src/styles/styles.css`, só com classes `az-`, tokens, sem cores fixas e sem `!important`. Cuidado com a ordem de especificidade (o stylelint `no-descending-specificity` roda no `npm run lint`).
- Todo componente novo: export (e tipos) em `src/index.ts`, nome na lista de `tests/package/exports.test.ts` (ordenada), factory em `src/auto.ts` só se for declarativo (os deste lote são JS-only, sem auto-init), doc em `docs/components/`.
- Teclado completo e ARIA; setas horizontais invertidas em `dir="rtl"`.
- Dados nunca viram HTML sem escape: usar `textContent`/`setAttribute`, nunca `innerHTML` com texto do consumidor.
- Codificação: ao editar arquivos com Python, abrir e gravar com `encoding="utf-8"`.
- Rodar o Prettier nos arquivos novos e o `npm run lint` completo (ESLint e stylelint) antes de concluir.
- Não rodar testes, build, servidor ou git sem autorização do mantenedor. Sem passos de commit.
- Testes em `tests/components/<nome>/<nome>.test.ts`, no estilo dos lotes anteriores (jsdom não calcula layout: simular `getBoundingClientRect` e tamanhos com `Object.defineProperty`).

## Foco da revisão

Entradas que os testes óbvios não cobrem; cada uma tem teste na tarefa dona:

1. Scheduler: mover para uma posição que sobrepõe outro evento é recusado, mas eventos que apenas se encostam (fim = início) são permitidos.
2. Scheduler e Gantt: movimento ou redimensionamento cancelado devolve a posição original; a duração nunca fica menor que 1 slot (Scheduler) ou 1 dia (Gantt).
3. WidgetGrid: `setLayout(layout)` com o `layout` atual não muda nada; ids desconhecidos são ignorados, widgets ausentes vão para o fim e a largura é limitada a 1..colunas.
4. Calendar: virada de ano (dezembro para janeiro) e fevereiro de ano bissexto; dia com mais eventos que o limite mostra "+N more".
5. Gantt: dependência para uma tarefa que não existe é ignorada sem erro; tarefa de um só dia tem largura de um dia; dados com fim antes do início lançam `AZUI:`.

---

### Tarefa 1: WidgetGrid (e `Sortable` em grade)

**Arquivos:** criar `src/components/widget-grid/{widget-grid.ts,widget-grid.css,index.ts}`, `tests/components/widget-grid/widget-grid.test.ts`, `docs/components/widget-grid.md`; alterar `src/components/sortable/insertion-index.ts`, `src/components/sortable/sortable.ts` (só o tipo), `tests/components/sortable/sortable.test.ts`, `docs/components/sortable.md`, `src/styles/styles.css`, `src/index.ts`.

**Interfaces:**
- Altera: `SortableDirection` ganha `"grid"`. `insertionIndex(boxes, point, "grid")` considera uma caixa "antes" do ponteiro quando está inteira acima dele (`top + height < point.y`) ou na mesma linha (`top <= point.y <= top + height`) com o ponto médio horizontal à esquerda do ponteiro. As setas de teclado do `Sortable` em `"grid"` seguem as horizontais (já é o comportamento de `direction !== "vertical"`).
- Produz: `class WidgetGrid extends Component<WidgetGridOptions>`; `interface WidgetGridOptions { columns?: number; labels?: Partial<WidgetGridLabels> }` (`columns` padrão 4, também em `data-az-columns`; `WidgetGridLabels { resize: string }` padrão `"Resize {widget}"`); `interface WidgetLayoutItem { id: string; span: number }`; getter `layout: WidgetLayoutItem[]`; `setLayout(layout: WidgetLayoutItem[]): void`; `resize(id: string, span: number): void`.
- Marcação: `.az-widget-grid` com filhos `.az-widget[data-az-widget="id"]` (`data-az-span` inicial, padrão 1; `data-az-title` ou o `id` serve de nome acessível). O componente define a variável `--az-widget-columns` na grade e `--az-widget-span` em cada widget, cria `new Sortable(grade, { items: ".az-widget", direction: "grid" })` e adiciona em cada widget uma alça `span.az-widget-resize` (`role="separator"`, `tabindex="0"`, `aria-orientation="vertical"`, `aria-valuemin="1"`, `aria-valuemax=columns`, `aria-valuenow=span`, nome `labels.resize`). Alça por ponteiro (largura da coluna = largura da grade ÷ colunas; span = arredondado, limitado a 1..colunas) e por teclado (`ArrowLeft`/`ArrowRight` ±1, `Home` 1, `End` colunas; invertidas em RTL).
- Evento `az:widgetgrid:change` (`detail: { layout }`) depois de uma reordenação (via `az:sortable:drop` não cancelado) e de cada mudança de largura. `setLayout`: reordena os widgets conforme a lista, aplica as larguras, ignora ids desconhecidos, mantém no fim (na ordem atual) os widgets que não estão na lista, e não emite o evento.
- CSS: grade com `grid-template-columns: repeat(var(--az-widget-columns), minmax(0, 1fr))`, `gap`, widget com `grid-column: span var(--az-widget-span)`, alça na borda inline-end visível ao passar o mouse e ao focar.

- [ ] **Passo 1: testes de `insertionIndex` e do `Sortable`** — `"grid"`: caixa em linha acima conta como antes; mesma linha usa o ponto médio horizontal; linha abaixo conta como depois; lista vazia dá 0. Um `Sortable` com `direction: "grid"` reordena por `dragover` em 2D.
- [ ] **Passo 2: testes do `WidgetGrid`** — define as variáveis CSS e as alças com semântica de separator; `layout` na ordem do DOM; `setLayout(layout)` com o layout atual não muda nada (Foco 3); ids desconhecidos ignorados e ausentes ao fim (Foco 3); largura limitada a 1..colunas (Foco 3); setas, `Home`, `End` e RTL na alça; `resize` atualiza `aria-valuenow` e a variável; reordenar (disparar `az:sortable:drop`) emite `change` com o layout novo; `setLayout` não emite; `destroy()` remove alças e variáveis e destrói o `Sortable`; lança sem `.az-widget`.
- [ ] **Passo 3:** implementar, CSS, doc, exports. Pedir autorização e rodar `npx vitest run tests/components/widget-grid tests/components/sortable`.

### Tarefa 2: Calendar (visão mensal)

**Arquivos:** criar `src/components/calendar/{calendar.ts,calendar.css,index.ts}`, `tests/components/calendar/calendar.test.ts`, `docs/components/calendar.md`; alterar `src/styles/styles.css`, `src/index.ts`.

**Interfaces:**
- Consome: `parseIsoDate`, `formatIsoDate`, `addDays`, `addMonths`, `isSameDay`, `buildMonthGrid(year, month, firstDayOfWeek)` de `src/components/datepicker/calendar.ts`; `Icon.create` para as setas (como o `Datepicker`).
- Produz: `class Calendar extends Component<CalendarOptions>`; `interface CalendarEvent { id: string; date: string; title: string; variant?: "default" | "success" | "warning" | "danger" | "info" }` (`date` em `YYYY-MM-DD`); `interface CalendarOptions { locale?: string; firstDayOfWeek?: number; maxEventsPerDay?: number; labels?: Partial<CalendarLabels> }` com `CalendarLabels { previousMonth: string; nextMonth: string; today: string; more: string }` (`more` padrão `"+{count} more"`); padrões `locale` do `<html lang>` ou `"en"`, `firstDayOfWeek` 0, `maxEventsPerDay` 3 (também `data-az-locale`, `data-az-first-day`, `data-az-max-events`); `setEvents(events: CalendarEvent[]): void`; `setMonth(date: string): void` (qualquer data do mês); `previous(): void`, `next(): void`, `today(): void`; getter `month: { year: number; month: number }` (`month` de 0 a 11).
- Desenho: cabeçalho com título do mês (`Intl`) e botões anterior, hoje e próximo; grade `role="grid"` com cabeçalho dos dias da semana e 6 semanas; cada dia é uma célula com um botão com o número (nome acessível com a data completa) e a lista de eventos como botões `.az-calendar-event` (classe de variante); acima de `maxEventsPerDay` mostra um botão `.az-calendar-more` com o texto de `labels.more`. Dias de outros meses aparecem atenuados e também mostram eventos; o dia de hoje é marcado.
- Teclado nos números dos dias (tab stop único): setas movem por dia e semana, `PageUp`/`PageDown` por mês, `Home`/`End` início e fim da semana, `Enter`/`Space` selecionam. Textos de eventos sempre por `textContent`.
- Eventos: `az:calendar:select` (`detail: { date }`, clique ou `Enter` no dia ou no "+N more"), `az:calendar:eventclick` (`detail: { event }`), `az:calendar:navigate` (`detail: { year, month }`).

- [ ] **Passo 1: testes** — desenha 42 dias e o título; semana começando em `firstDayOfWeek`; eventos aparecem no dia certo, inclusive em dias de outros meses; mais que `maxEventsPerDay` mostra "+N more" com a contagem certa e o clique emite `select` do dia (Foco 4); navegar de dezembro para janeiro muda o ano e emite `navigate` (Foco 4); fevereiro de ano bissexto tem o dia 29 (Foco 4); `today()` volta ao mês atual (data do sistema simulada); teclado nos dias (setas, PageUp/PageDown, Home/End, Enter); `eventclick` com o evento; título de evento com `<b>` aparece como texto; `setEvents` substitui os eventos; `destroy()` limpa a interface; lança fora de um elemento válido ou duas vezes.
- [ ] **Passo 2:** implementar, CSS, doc, exports. Pedir autorização e rodar `npx vitest run tests/components/calendar`.

### Tarefa 3: Utilitário de arraste por ponteiro e Scheduler

**Arquivos:** criar `src/javascript/dom/pointer-drag.ts`, `tests/javascript/dom/pointer-drag.test.ts`, `src/components/scheduler/{scheduler.ts,time.ts,scheduler.css,index.ts}`, `tests/components/scheduler/{scheduler.test.ts,time.test.ts}`, `docs/components/scheduler.md`; alterar `src/styles/styles.css`, `src/index.ts`.

**Interfaces:**
- Produz (utilitário): `startPointerDrag(handle: HTMLElement, event: PointerEvent, callbacks: { move: (dx: number, dy: number, event: PointerEvent) => void; end: (dx: number, dy: number, event: PointerEvent) => void; cancel: () => void }): () => void` — captura o ponteiro (`setPointerCapture`), chama `move` com o deslocamento desde o início, `end` no `pointerup`, `cancel` no `pointercancel` ou quando o `Escape` é pressionado; remove os listeners ao terminar; devolve uma função que interrompe o arraste (sem chamar callbacks).
- Produz (`time.ts`): `parseDateTime(text: string): Date | null` (formato `YYYY-MM-DDTHH:mm`, valida data real e hora 0-23/minuto 0-59); `formatDateTime(date: Date): string`; `addMinutes(date: Date, minutes: number): Date`; `minutesBetween(from: Date, to: Date): number`.
- Produz (componente): `class Scheduler extends Component<SchedulerOptions>`; `interface SchedulerResource { id: string; label: string }`; `interface SchedulerEvent { id: string; resource: string; start: string; end: string; title: string; variant?: "default" | "success" | "warning" | "danger" | "info" }`; `interface SchedulerOptions { resources: SchedulerResource[]; events?: SchedulerEvent[]; date: string; startHour?: number; endHour?: number; slotMinutes?: number; slotWidth?: number; allowOverlap?: boolean; labels?: Partial<SchedulerLabels> }` (padrões: `startHour` 6, `endHour` 20, `slotMinutes` 30, `slotWidth` 48 px, `allowOverlap` false; `date` em `YYYY-MM-DD`; `SchedulerLabels { moved: string; resized: string }` com `"{title} moved to {resource}, {start} to {end}"` e `"{title} now ends at {end}"`); `setEvents(events)`, `setResources(resources)`, `setDate(date)`; getter `events: SchedulerEvent[]` (cópia).
- Desenho: cabeçalho com os horários (a cada slot ou a cada hora); uma linha por recurso com o rótulo à esquerda (fixo) e a pista (`div.az-scheduler-lane`) de largura `slots × slotWidth`; cada evento do dia é um `button.az-scheduler-event` posicionado (`left`, `width` em px a partir do horário, recortado à janela `startHour`-`endHour`; eventos fora da janela ou de outro dia não aparecem) com o título (`textContent`), uma alça `span.az-scheduler-resize` na borda final e nome acessível "título, recurso, início a fim". Papéis: raiz `role="grid"`, linha `role="row"`, rótulo `role="rowheader"`, pista `role="gridcell"`. Uma região `aria-live="polite"` anuncia movimentos.
- Interação: mover por arraste (deslocamento em slots arredondado, recurso pela pista sob o ponteiro), redimensionar pela alça (mínimo 1 slot), clicar num espaço vazio da pista emite `az:scheduler:create`. Teclado no evento: `ArrowLeft`/`ArrowRight` movem 1 slot, `ArrowUp`/`ArrowDown` mudam de recurso, `Shift`+`ArrowLeft`/`ArrowRight` encurtam ou alongam 1 slot, `Enter` seleciona; setas horizontais invertidas em RTL; depois de cada mudança o foco continua no evento.
- Regras: o novo horário é limitado à janela do dia; sem `allowOverlap`, uma mudança que sobreponha outro evento do mesmo recurso é recusada (encostar, fim = início, é permitido); antes de aplicar emite `az:scheduler:move` ou `az:scheduler:resize` (canceláveis, `detail: { event, resource, start, end }` com o estado proposto); se não cancelado, atualiza o evento interno e redesenha. Dados inválidos (datas ilegíveis, fim antes ou igual ao início, recurso inexistente, `endHour <= startHour`, `slotMinutes` que não divide 60) lançam `AZUI:` com mensagem própria.
- Eventos: `az:scheduler:select` (`detail: { event }`), `az:scheduler:create` (`detail: { resource, start, end }`, end = start + 1 slot), `az:scheduler:move`, `az:scheduler:resize`.

- [ ] **Passo 1: testes de `pointer-drag` e de `time`** — `move`/`end` recebem os deslocamentos; `cancel` no `pointercancel` e no `Escape`; os listeners são removidos ao terminar e pela função devolvida; `parseDateTime` aceita `2026-11-10T08:30` e recusa `2026-02-30T08:00`, `2026-11-10T25:00` e texto livre; `formatDateTime` faz o caminho inverso; `addMinutes` atravessa a meia-noite; `minutesBetween`.
- [ ] **Passo 2: testes do Scheduler** — desenha uma linha por recurso e a largura da pista; posiciona e dimensiona o evento a partir do horário (`left`, `width`); recorta à janela e ignora eventos de outro dia; mover por teclado muda o horário, emite `az:scheduler:move` com o estado proposto e redesenha com o foco no evento; mover para outro recurso (`ArrowDown`); `Shift`+setas mudam a duração e nunca abaixo de 1 slot (Foco 2); mudança que sobrepõe outro evento é recusada e não emite `move` (Foco 1); eventos que só se encostam são aceitos (Foco 1); `allowOverlap: true` permite; evento cancelado devolve a posição original (Foco 2); limite da janela do dia; setas invertidas em RTL; clique em espaço vazio emite `create` com recurso e horário do slot; `Enter` emite `select`; título com HTML aparece como texto; `setEvents`, `setResources` e `setDate` redesenham; mensagem do `aria-live` depois de mover; dados inválidos lançam `AZUI:`; `destroy()` limpa a interface.
- [ ] **Passo 3:** implementar o utilitário, `time.ts` e o Scheduler (o arraste por ponteiro usa `startPointerDrag`; no teste, simular só o caminho de teclado e as funções puras de conversão de posição para horário), CSS (pista com divisões por slot via variável `--az-scheduler-slot-width`, evento posicionado, estados de foco e de arraste), doc, exports. Pedir autorização e rodar `npx vitest run tests/javascript/dom/pointer-drag tests/components/scheduler`.

### Tarefa 4: Gantt

**Arquivos:** criar `src/components/gantt/{gantt.ts,gantt.css,index.ts}`, `tests/components/gantt/gantt.test.ts`, `docs/components/gantt.md`; alterar `src/components/datepicker/calendar.ts` (nova `diffInDays`), `tests/components/datepicker/calendar.test.ts`, `src/styles/styles.css`, `src/index.ts`.

**Interfaces:**
- Consome: `startPointerDrag` (Tarefa 3); `parseIsoDate`, `formatIsoDate`, `addDays` de `calendar.ts`.
- Altera: `diffInDays(from: Date, to: Date): number` em `calendar.ts` (dias inteiros de calendário, imune a horário de verão).
- Produz: `class Gantt extends Component<GanttOptions>`; `interface GanttTask { id: string; name: string; start: string; end: string; progress?: number; dependsOn?: string[]; variant?: "default" | "success" | "warning" | "danger" | "info" }` (`start` e `end` em `YYYY-MM-DD`, `end` inclusivo; `progress` 0 a 100); `interface GanttOptions { tasks: GanttTask[]; zoom?: "day" | "week"; dayWidth?: number; rowHeight?: number; labels?: Partial<GanttLabels> }` (padrões: `zoom` `"day"`, `dayWidth` 32 px no zoom de dias e 12 px no de semanas, `rowHeight` 40 px; `GanttLabels { task: string; start: string; end: string; moved: string }`); `setTasks(tasks)`, `setZoom(zoom)`, `scrollToToday()`; getter `tasks: GanttTask[]` (cópia).
- Desenho: um contêiner com rolagem; linha de cabeçalho fixa no topo (meses e dias, ou semanas pelo início da semana) e, em cada linha, a coluna do nome (fixa à esquerda, com início e fim em texto) e a pista com a barra `button.az-gantt-bar` (`left` = dias desde o início do intervalo × `dayWidth`; `width` = duração em dias × `dayWidth`, no mínimo 1 dia) com a faixa de progresso `.az-gantt-progress` (largura em %), alças `span.az-gantt-handle` nas duas bordas e nome acessível "nome, início a fim, progresso %"; o intervalo vai de 2 dias antes da primeira tarefa a 2 dias depois da última; linha vertical de "hoje" quando está no intervalo; um `<svg>` por cima desenha as dependências fim-início (caminho em cotovelo da ponta final da origem ao início do destino, com ponta de seta). Dependência para tarefa inexistente é ignorada sem erro. Textos sempre por `textContent`.
- Interação: arrastar a barra move a tarefa (deslocamento em dias arredondado), arrastar a alça final ou inicial muda o fim ou o início (duração mínima 1 dia); teclado na barra: `ArrowLeft`/`ArrowRight` movem 1 dia, `Shift`+setas alteram o fim em 1 dia (mínimo 1 dia), invertidas em RTL; `Enter` seleciona. Antes de aplicar, emite `az:gantt:move` ou `az:gantt:resize` (canceláveis, `detail: { task, start, end }` com o estado proposto); se não cancelado, atualiza a tarefa e redesenha (barras, dependências e intervalo), mantendo o foco. Mover uma tarefa não altera as dependentes.
- Validação: ids duplicados, datas ilegíveis, fim antes do início ou `progress` fora de 0-100 lançam `AZUI:` com mensagem própria.
- Eventos: `az:gantt:select` (`detail: { task }`), `az:gantt:move`, `az:gantt:resize`.

- [ ] **Passo 1: teste de `diffInDays`** — dentro do mês, entre meses, entre anos, ano bissexto e através de uma mudança de horário de verão.
- [ ] **Passo 2: testes do Gantt** — uma linha por tarefa, com nome, início e fim; `left` e `width` das barras a partir das datas e do `dayWidth`; tarefa de um só dia tem largura de um dia (Foco 5); faixa de progresso proporcional; zoom de semanas muda a largura do dia e o cabeçalho; linha de hoje (data do sistema simulada); dependências desenham caminhos entre as barras certas e dependência inexistente é ignorada (Foco 5); mover por teclado muda as datas, emite `az:gantt:move` com o estado proposto e redesenha com o foco na barra; `Shift`+setas mudam o fim e nunca abaixo de 1 dia (Foco 2); evento cancelado devolve as datas (Foco 2); mover não altera as tarefas dependentes; RTL; dados inválidos lançam `AZUI:` (Foco 5); nome de tarefa com HTML aparece como texto; `setTasks` e `setZoom` redesenham; `destroy()` limpa a interface.
- [ ] **Passo 3:** implementar, CSS (barras, progresso, alças, linha de hoje, SVG das dependências com `currentColor`), doc, exports. Pedir autorização e rodar `npx vitest run tests/components/gantt tests/components/datepicker`.

### Tarefa 5: Fechamento do lote e da fase

**Arquivos:** criar `examples/operations.html` (padrão de `examples/tables.html`); alterar `examples/index.html`, `README.md`, `CHANGELOG.md`, `.ai/development/roadmap.md`, `.ai/development/decisions.md`, `tests/package/exports.test.ts` (se faltar algum nome).

- [ ] **Passo 1:** página `examples/operations.html` com um painel de widgets (cartões de indicadores arrastáveis e redimensionáveis), o calendário de entregas, a agenda de docas e um Gantt de projeto, com dados de exemplo (logística) e um registro dos eventos emitidos; link no índice.
- [ ] **Passo 2:** README (linha "Operations"), CHANGELOG, roadmap (marcar o lote 4 e a fase Enterprise como implementada, aguardando validação) e decisão em `decisions.md` para escolhas novas.
- [ ] **Passo 3:** `npx prettier --write` nos arquivos novos; pedir autorização e rodar `npm run typecheck`, `npm run lint` (ESLint e stylelint), `format:check` e `npm test`; esperado: tudo passa. Conferir a página no navegador com teclado.
- [ ] **Passo 4:** aguardar a validação do lote pelo mantenedor; depois, a fase Enterprise está concluída e o próximo passo do roadmap é a Fase 7 (Distribuição), que depende de autorização explícita.

## Auto-revisão

- Cobertura do design: WidgetGrid com `layout`/`setLayout` e redimensionamento (T1), Calendar mensal (T2), Scheduler por recurso com conflitos (T3), Gantt com dependências (T4). O ajuste de módulos (sem `src/javascript/time/`, com `pointer-drag.ts`) está em D-063.
- Fora do escopo, como no design: eventos recorrentes, fusos horários, visões de semana e de vários dias no Scheduler, caminho crítico, nivelamento de recursos, edição de progresso, posicionamento livre de widgets e desfazer/refazer.
