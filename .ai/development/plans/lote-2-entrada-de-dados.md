# Lote 2 — Entrada de dados: plano de implementação

> **Para quem executar:** usar `superpowers:executing-plans` (execução nativa, como no lote 1) ou `superpowers:subagent-driven-development`. Os passos usam caixas `- [ ]`.

**Objetivo:** entregar Mask, Tag Input, Combobox, Dual Listbox, DateRange e BarcodeInput, mais a verificação do estilo de `<input type="time">`.

**Arquitetura:** cada componente é subclasse de `Component` (`src/javascript/core/component.ts`), mantém o valor em um campo nativo, emite `az:<nome>:<evento>` via `emit` e inicia por `data-az-component` em `src/auto.ts`. O Dual Listbox reaproveita o `Sortable` do lote 1; o DateRange reaproveita o `Datepicker`.

**Stack:** TypeScript, CSS puro, Vitest + jsdom. Sem dependências novas.

**Design:** `.ai/development/enterprise-phase-design.md`, seção "Lote 2".

## Restrições globais

- Sem Bootstrap, Tailwind, jQuery ou bibliotecas externas.
- Prefixo CSS `az-`; erros com prefixo `AZUI:`; código, testes, docs e exemplos em inglês; sem comentários salvo se indispensável.
- Convenção do projeto (aprendida no lote 1): **todo diretório em `src/components/` precisa de `<nome>/<nome>.css`, importado em `src/styles/styles.css`**, só com classes `az-` e tokens, sem cores fixas nem `!important`. Componentes só de comportamento ficam num diretório existente: Mask e BarcodeInput em `src/components/field/` (como o `Counter`), DateRange em `src/components/datepicker/`.
- Todo componente novo entra em `src/index.ts` (e na lista de `tests/package/exports.test.ts`), em `src/auto.ts` e tem `docs/components/<nome>.md`.
- Valor sempre num campo nativo (`<input>`/`<select>`) para o envio de formulário funcionar.
- Teclado completo e atributos ARIA; sentido das setas invertido em `dir="rtl"` quando horizontal.
- Antes de concluir cada tarefa e ao final: Prettier (`npx prettier --write` nos arquivos novos), pois `format:check` é verificado.
- Não rodar testes, build, servidor ou git sem autorização do mantenedor. O plano não tem passos de commit.
- Testes em `tests/components/<nome>/<nome>.test.ts`, no estilo dos do lote 1.

## Foco da revisão

Entradas que o design implica e os testes óbvios não cobrem; cada uma tem teste na tarefa dona:

1. Colar texto maior que o padrão da máscara, ou com caracteres inválidos (Mask).
2. Backspace sobre um literal da máscara não pode travar o cursor (Mask).
3. Resposta antiga da busca chegando depois de uma mais nova não pode sobrescrever a lista (Combobox).
4. Adicionar tag duplicada ou vazia (Tag Input).
5. Fim de intervalo anterior ao início ao editar o início (DateRange).

---

### Tarefa 1: Mask

**Arquivos:** criar `src/components/field/mask.ts`, `tests/components/field/mask.test.ts`, `docs/components/mask.md`; alterar `src/components/field/index.ts`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `applyMask(pattern: string, text: string): { value: string; raw: string; complete: boolean }`; `class Mask extends Component<MaskOptions>`; `interface MaskOptions { pattern?: string }`; getters `rawValue: string`, `isComplete: boolean`.
- Padrão: `9` dígito, `a` letra, `*` letra ou dígito; outro caractere é literal. Padrão em `options.pattern` ou `data-az-mask`; sem padrão ou fora de um `<input>` lança `AZUI:`.
- Evento `az:mask:complete` (uma vez, quando o padrão é preenchido).

- [ ] **Passo 1: testes de `applyMask`** — `"99/99/9999"` com `"25122026"` dá `"25/12/2026"`, `complete: true`, `raw: "25122026"`; com `"2512"` dá `"25/12"`; com `"ab12"` ignora as letras (`"12"`); texto maior que o padrão é cortado; `""` dá `""`; literais digitados pelo usuário não duplicam (`"25/12"` continua `"25/12"`); `"aa-99"` com `"x1"` ignora o dígito onde se espera letra.
- [ ] **Passo 2: testes de `Mask`** — formata ao digitar (`input` event); cola texto maior e formata cortando (Foco 1); Backspace logo após um literal remove o caractere anterior em vez de recolocar o literal (Foco 2, usar `inputType: "deleteContentBackward"`); mantém o cursor depois do caractere digitado no meio do texto; `rawValue` sem literais; `az:mask:complete` dispara uma vez; `destroy()` remove os listeners; inicializar duas vezes lança.
- [ ] **Passo 3: implementar** `applyMask` (função pura) e `Mask`, que escuta `input` e reaplica a máscara. Cursor: contar os caracteres de dado antes do cursor no texto digitado e reposicioná-lo depois do mesmo número de caracteres de dado no texto formatado.
- [ ] **Passo 4:** doc, exports, auto-init (`data-az-component="mask"`). Pedir autorização e rodar `npx vitest run tests/components/field`.

### Tarefa 2: Tag Input

**Arquivos:** criar `src/components/tag-input/{tag-input.ts,tag-input.css,index.ts}`, `tests/components/tag-input/tag-input.test.ts`, `docs/components/tag-input.md`; alterar `src/styles/styles.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `class TagInput extends Component`; `get tags(): string[]`; `add(tag: string): boolean` (false se vazio, duplicado ou cancelado); `remove(index: number): boolean`.
- Markup: `.az-tag-input` contendo `input.az-tag-input-field` (digitação) e, opcionalmente, `input[type="hidden"]` que recebe as tags separadas por vírgula. Os chips são gerados em `.az-tag-input-tag` com botão de remover (nome acessível "Remove {tag}").
- Teclas: `Enter` e `,` adicionam; `Backspace` com o campo vazio remove a última; colar texto separa por vírgula.
- Eventos: `az:taginput:add` (cancelável, `detail.tag`), `az:taginput:remove` (`detail.tag`), `az:taginput:change` (`detail.tags`).

- [ ] **Passo 1: testes** — Enter adiciona e limpa o campo; vírgula adiciona; vazio e só espaços são ignorados; duplicada retorna `false` e não cria chip (Foco 4); Backspace remove a última só com o campo vazio; colar `"a, b,c"` cria três; `az:taginput:add` cancelado impede o chip; o campo oculto mantém `"a,b"`; botão de remover tem nome acessível e funciona; `destroy()` limpa os chips.
- [ ] **Passo 2:** implementar, CSS (chips com tokens), doc, exports, auto-init. Pedir autorização e rodar `npx vitest run tests/components/tag-input`.

### Tarefa 3: Combobox

**Arquivos:** criar `src/components/combobox/{combobox.ts,combobox.css,index.ts}`, `tests/components/combobox/combobox.test.ts`, `docs/components/combobox.md`; alterar `src/styles/styles.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Consome: `positionFloating` e `onDismiss` (como o `Datepicker`), `ensureId`.
- Produz: `class Combobox extends Component<ComboboxOptions>`; `interface ComboboxOption { value: string; label: string }`; `interface ComboboxOptions { options?: ComboboxOption[]; source?: (query: string, signal: AbortSignal) => Promise<ComboboxOption[]>; minChars?: number; debounce?: number; labels?: Partial<ComboboxLabels> }` com `ComboboxLabels { loading: string; empty: string }` (inglês por padrão); `get value(): string | null`; `select(option: ComboboxOption): void`; `clear(): void`.
- Padrões: `minChars` 0 com opções locais e 1 com `source`; `debounce` 250 ms.
- Elemento: um `<input>`; o componente cria um `<input type="hidden">` irmão com o `name` do campo de texto (o campo visível perde o `name`) e guarda o valor escolhido nele.
- ARIA combobox: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, lista `role="listbox"` com `role="option"`. Teclas: `ArrowDown`/`ArrowUp` navegam, `Enter` escolhe, `Escape` fecha.
- Eventos: `az:combobox:search` (`detail.query`), `az:combobox:select` (`detail.option`).

- [ ] **Passo 1: testes** — filtra opções locais por texto; `ArrowDown` + `Enter` escolhe e grava `value` no campo oculto; `Escape` fecha; mostra "loading" e "empty"; com `source`, só chama após o `debounce` (timers falsos); **resposta antiga não sobrescreve a nova** (a primeira promessa resolve depois da segunda) e a busca anterior é abortada (Foco 3); limpar o texto limpa o valor; `aria-activedescendant` acompanha a opção ativa; `destroy()` remove a lista e restaura o `name`.
- [ ] **Passo 2:** implementar, CSS, doc, exports, auto-init (opções locais por `data-az-options` em JSON). Pedir autorização e rodar `npx vitest run tests/components/combobox`.

### Tarefa 4: Dual Listbox

**Arquivos:** criar `src/components/dual-listbox/{dual-listbox.ts,dual-listbox.css,index.ts}`, `tests/components/dual-listbox/dual-listbox.test.ts`, `docs/components/dual-listbox.md`; alterar `src/styles/styles.css`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Consome: `Sortable` (lote 1: `new Sortable(list, { group })`, evento `az:sortable:drop`).
- Produz: `class DualListbox extends Component<DualListboxOptions>`; `interface DualListboxOptions { labels?: Partial<DualListboxLabels> }` com `DualListboxLabels { available: string; selected: string; search: string; add: string; addAll: string; remove: string; removeAll: string }`; `get values(): string[]` (na ordem dos selecionados); `refresh(): void` (relê o `<select>`).
- Elemento: um `<select multiple>`; o componente o oculta e constrói duas listas (disponíveis e selecionados), cada uma com campo de busca, e quatro botões (mover marcados, mover todos, remover marcados, remover todos). Opções `disabled` aparecem desabilitadas e não se movem. Clique alterna a marcação do item; duplo clique move um.
- A lista de selecionados é reordenável por arraste e teclado (via Sortable) e as duas listas trocam itens por arraste.
- Mantém o `<select>` sincronizado (`option.selected` e a ordem dos `<option>` igual à dos selecionados).
- Evento `az:duallistbox:change` com `detail.values`.

- [ ] **Passo 1: testes** — separa opções pré-selecionadas e não selecionadas; botão "add" move os marcados e atualiza o `<select>`; "add all" ignora desabilitadas; "remove all" devolve tudo; duplo clique move um; busca esconde itens sem coincidência em cada lado; soltar um item arrastado de uma lista na outra move e sincroniza (disparar `az:sortable:drop`); reordenar selecionados reordena os `<option>`; `values` na ordem; evento `change`; `destroy()` mostra o `<select>` de novo e remove a UI.
- [ ] **Passo 2:** implementar, CSS, doc, exports, auto-init. Pedir autorização e rodar `npx vitest run tests/components/dual-listbox`.

### Tarefa 5: DateRange

**Arquivos:** criar `src/components/datepicker/date-range.ts`, `tests/components/datepicker/date-range.test.ts`, `docs/components/date-range.md`; alterar `src/components/datepicker/datepicker.ts`, `src/components/datepicker/index.ts`, `src/index.ts`, `src/auto.ts`, `tests/components/datepicker/datepicker.test.ts` (novo teste de `setLimits`).

**Interfaces:**
- Altera `Datepicker`: `minDate` e `maxDate` deixam de ser `readonly`; novo `setLimits(limits: { min?: string; max?: string }): void` (string vazia remove o limite; atualiza `minDate`/`maxDate` e vale na próxima abertura).
- Produz: `class DateRange extends Component<DatepickerConfig>`; `constructor(start: string | HTMLElement, end: string | HTMLElement, config?: DatepickerConfig)`; getters `start: string`, `end: string` (ISO ou vazio).
- Cria um `Datepicker` em cada campo. Ao escolher o início: `end.setLimits({ min: início })` e, se o fim atual for anterior, limpa o fim. Ao escolher o fim: `start.setLimits({ max: fim })`. Lê os valores iniciais dos campos.
- Auto-init: `data-az-component="daterange"` no campo de início com `data-az-end="#id-do-fim"`; esses campos não devem ter `data-az-component="datepicker"`.
- Evento `az:daterange:change` com `detail.start` e `detail.end`.

- [ ] **Passo 1: testes** — `setLimits` no Datepicker desabilita dias fora do intervalo na próxima abertura; escolher início restringe o fim; **editar o início para depois do fim limpa o fim** (Foco 5); escolher fim restringe o início; valores iniciais valem como limites; evento `change`; `destroy()` destrói os dois datepickers.
- [ ] **Passo 2:** implementar, doc, exports, auto-init. Pedir autorização e rodar `npx vitest run tests/components/datepicker`.

### Tarefa 6: BarcodeInput

**Arquivos:** criar `src/components/field/barcode.ts`, `tests/components/field/barcode.test.ts`, `docs/components/barcode-input.md`; alterar `src/components/field/index.ts`, `src/index.ts`, `src/auto.ts`.

**Interfaces:**
- Produz: `isScan(intervals: number[], maxInterval: number): boolean` (verdadeiro se há ao menos uma tecla e todos os intervalos são ≤ `maxInterval`); `class BarcodeInput extends Component<BarcodeOptions>`; `interface BarcodeOptions { minLength?: number; maxInterval?: number }` (padrões 4 e 50 ms).
- Em um `<input>`: registra o instante de cada tecla imprimível; no `Enter`, se o texto tem ao menos `minLength` caracteres e `isScan` é verdadeiro, impede o `Enter`, emite `az:barcode:scan` (`detail.code`) e limpa o campo. Caso contrário, nada muda (digitação humana e `Enter` normal seguem).

- [ ] **Passo 1: testes** — `isScan` com intervalos rápidos e com um intervalo lento; leitura rápida terminada em Enter emite `scan` com o código e limpa o campo; digitação lenta não emite e não impede o Enter; código menor que `minLength` não emite; `destroy()` remove os listeners.
- [ ] **Passo 2:** doc, exports, auto-init (`data-az-component="barcode"`). Pedir autorização e rodar `npx vitest run tests/components/field`.

### Tarefa 7: Hora e fechamento do lote

**Arquivos:** criar `examples/entry.html` (padrão de `examples/interaction.html`); alterar `src/components/control/control.css` (só se `input[type="time"].az-control` ficar fora do padrão visual), `docs/components/form-fields.md`, `examples/index.html`, `README.md`, `CHANGELOG.md`, `.ai/development/roadmap.md`, `.ai/development/decisions.md`.

- [ ] **Passo 1:** conferir no navegador o `<input type="time" class="az-control">` nos temas claro e escuro; corrigir o CSS só se destoar; registrar em `form-fields.md` que a hora usa o campo nativo.
- [ ] **Passo 2:** página `examples/entry.html` com todos os componentes do lote (máscara de data, Tag Input, Combobox local e remoto simulado, Dual Listbox, DateRange, campo de código de barras com log, `time`) e link no índice.
- [ ] **Passo 3:** README (linha "Entrada de dados"), CHANGELOG, roadmap (marcar o lote 2) e decisão em `decisions.md` para escolhas novas.
- [ ] **Passo 4:** `npx prettier --write` nos arquivos novos; pedir autorização e rodar `npm run typecheck`, `lint`, `format:check` e `npm test`; esperado: tudo passa. Conferir a página no navegador e a navegação por teclado.
- [ ] **Passo 5:** aguardar a validação do lote pelo mantenedor antes do lote 3.

## Auto-revisão

- Cobertura do design: Mask (T1), Tag Input (T2), Combobox com busca remota (T3), Dual Listbox sobre `<select multiple>` e Sortable (T4), DateRange (T5), código de barras (T6), hora nativa (T7).
- Fora do escopo, como no design: moeda e número formatados, atalhos de máscara nomeados, paginação de opções.
