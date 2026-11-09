# Design — Fase Enterprise (proposta)

Status: **rascunho aguardando aprovação do mantenedor**. Nada deste documento foi implementado. Ao aprovar, a fase entra em `roadmap.md` entre a Fase 6 e a Fase 7.

## Intenção

Dar à AZ UI o conjunto mais completo possível de componentes prontos para sistemas corporativos (TMS, WMS, ERP, SCS e similares), de modo que o desenvolvedor monte telas sem escrever comportamento na mão.

## Objetivos

- Cobrir estrutura (collapse, tree, stepper, splitter), arrastar e soltar, seleção avançada, entrada de dados com máscaras e tabelas pesadas.
- Kanban para tarefas e andamento de equipe, **montado conforme a necessidade do cliente**.
- Seguir o padrão existente: classe `Component`, entrada `@codebyazeredo/az-ui/auto`, API declarativa por atributos, tokens, temas claro e escuro, docs e exemplos.

## Fora do escopo

- Gráficos (decisão do mantenedor).
- Mapas: sem componente; no máximo um ponto de integração documentado (decisão do assistente, reversível).
- Persistência e chamadas de API: a AZ UI desenha, move e emite eventos; o sistema que a usa salva.
- Dependências externas de drag and drop (usar a API nativa do navegador).

## Anti-objetivos

- Componentes fechados e rígidos que obriguem a estrutura de um único cliente.
- Funcionar só com mouse: todo arrastar precisa de alternativa por teclado e anúncio para leitor de tela.

## Ordem dos lotes

Cada lote tem seu próprio design detalhado e validação antes do próximo.

1. **Base de interação**: Collapse, Sortable (núcleo de drag and drop), Kanban, Tree View, Stepper, Splitter.
2. **Entrada de dados**: Combobox/Autocomplete (busca remota), Dual Listbox, Tag Input, máscaras (CPF, CNPJ, CEP, telefone, moeda, número), intervalo de datas, hora, leitura de código de barras.
3. **Tabelas pesadas**: edição inline, colunas fixas e redimensionáveis, reordenação de colunas e linhas, linhas expansíveis, rolagem virtual, exportação CSV, Tree Grid.
4. **Operação**: Calendar/Scheduler, Gantt, painel de widgets arrastáveis.

## Lote 4 — design (aprovado, D-063)

Contexto: os quatro componentes são orientados a dados (o consumidor informa recursos, eventos, tarefas ou widgets e o componente desenha e emite eventos); nenhum grava nada. Reaproveitam o que já existe: calendário do `Datepicker` (`buildMonthGrid`), arraste por ponteiro (padrão do `Splitter`) e o `Sortable`. Cada um em `src/components/<nome>/` com `<nome>.css`. Horários são strings locais `YYYY-MM-DDTHH:mm` (decisão do assistente: sem fuso horário), com um módulo pequeno compartilhado em `src/javascript/time/`.

### WidgetGrid (painel de widgets)

- Grade em que cada widget ocupa 1 a N colunas. Reordena por arraste e teclado (via `Sortable`) e redimensiona a largura por uma alça (ponteiro e setas). Posicionamento por fluxo, sem coordenadas livres (decisão do assistente: cobre painéis de gestão sem a complexidade de um GridStack).
- `layout` (lista de `{ id, span }` na ordem atual) e `setLayout(layout)` para o sistema salvar e restaurar o painel de cada usuário. Evento `az:widgetgrid:change`.

### Calendar (visão mensal)

- Mês com eventos como etiquetas por dia (agenda de entregas): navegação por mês e hoje, clique no dia (`az:calendar:select`) e no evento (`az:calendar:eventclick`), "+N mais" quando o dia tem muitos eventos. Teclado como no calendário do `Datepicker`.
- `setEvents(events)`, `setMonth(date)`. Semana começa em `firstDayOfWeek` e `locale` via `Intl`, como o `Datepicker`.

### Scheduler (agenda por recurso)

- Linha do tempo de um dia com recursos nas linhas (docas, veículos, equipes) e horas nas colunas (`startHour`, `endHour`, `slotMinutes`). Eventos são blocos posicionados pelo horário.
- Arrastar um bloco o move entre recursos e horários (com encaixe no `slotMinutes`); arrastar a borda direita muda a duração; clicar num espaço vazio emite `az:scheduler:create`. Teclado: o bloco é focável, setas movem por slot e `Shift`+setas mudam a duração; `Enter` abre (`az:scheduler:select`).
- Conflitos: por padrão dois eventos do mesmo recurso não se sobrepõem (`allowOverlap: false`); o movimento que causaria sobreposição é recusado. Eventos cancelávei: `az:scheduler:move`, `az:scheduler:resize`.
- Só visão de um dia (`setDate`); sem eventos recorrentes (decisão do assistente).

### Gantt

- Tabela de tarefas à esquerda (nome, início, fim) e barras na linha do tempo à direita, com escala em dias ou semanas (`zoom`), linha de "hoje", barra de progresso e dependências fim-início desenhadas em SVG.
- Arrastar a barra move a tarefa; arrastar as bordas muda início ou fim; teclado como no Scheduler (setas movem por dia, `Shift`+setas mudam a duração). Eventos cancelávei `az:gantt:move` e `az:gantt:resize`.
- Mover uma tarefa **não** reagenda as dependentes automaticamente: o sistema decide pelo evento (decisão do assistente). Progresso é só de leitura nesta versão.

### Fora do escopo do lote

Eventos recorrentes, fusos horários, visões de semana e de vários dias no Scheduler, caminho crítico e nivelamento de recursos, edição de progresso no Gantt, posicionamento livre de widgets e desfazer/refazer.

## Lote 3 — design (aprovado, D-061)

Contexto: `DataTable` trabalha sobre o DOM (as linhas são escritas pelo consumidor e a ordenação move `<tr>`). O lote 3 não infla o `DataTable`: cada recurso é um componente pequeno que se compõe com a mesma marcação. Todos ficam em `src/components/table/` (que já tem `table.css`), eventos `az:<nome>:<evento>`, teclado e ARIA completos.

### Exportação CSV

- Função `tableToCsv(table, options)` que devolve o texto e `downloadCsv(table, filename, options)` que baixa o arquivo.
- Respeita colunas ocultas (`setColumnVisible`), pode limitar às linhas selecionadas, escapa aspas, vírgulas e quebras de linha. Delimitador padrão `,` e opção de BOM UTF-8 para o Excel abrir acentos corretamente (decisão do assistente).

### Reordenar linhas

- Sem componente novo: o `Sortable` do lote 1 já reordena `<tr>` num `<tbody>` (`items: "tr"`). O lote só acrescenta `data-az-items` ao auto-init do `Sortable` e a classe `az-table-handle` para a coluna da alça.

### Linhas expansíveis (`RowExpand`)

- Botão de expandir na linha; a linha de detalhe (`tr.az-table-detail`) logo abaixo aparece e some, com `aria-expanded` e `aria-controls`. Evento `az:rowexpand:toggle`.
- Limitação (decisão do assistente): não se combina com a ordenação e a paginação do `DataTable` nesta versão, que tratariam a linha de detalhe como linha comum.

### Edição inline (`TableEdit`)

- Duplo clique ou `Enter` numa célula editável (`data-az-edit="text|number"`) troca o conteúdo por um campo; `Enter` confirma, `Escape` cancela, sair do campo confirma.
- Evento cancelável `az:tableedit:commit` com célula, linha, coluna, valor antigo e novo: o sistema valida e salva; cancelar devolve o valor antigo. O componente não grava dados.

### Colunas (`TableColumns`)

- Redimensionar por arraste e teclado (alça no cabeçalho, `role="separator"`), com largura mínima.
- Colunas fixas (sticky) no início, com o deslocamento calculado pelas larguras das colunas fixas anteriores.
- Reordenar colunas arrastando o cabeçalho e por teclado, movendo as células de todas as linhas.
- Eventos `az:tablecolumns:resize` e `az:tablecolumns:reorder`.

### Tree Grid (`TreeGrid`)

- Tabela hierárquica (padrão ARIA `treegrid`): linhas com `data-az-level`, setas expandem e recolhem os filhos, `aria-expanded`, `aria-level`. Mesma limitação do `RowExpand` quanto ao `DataTable`.

### Rolagem virtual (`VirtualTable`)

- Para milhares de linhas: modelo orientado a dados, diferente do `DataTable`. O consumidor informa `rowCount`, `rowHeight` e `renderRow(index)`; só as linhas visíveis (mais uma margem) existem no DOM, com linhas espaçadoras acima e abaixo, `aria-rowcount` e `aria-rowindex`.
- Métodos `setRowCount`, `refresh` e `scrollToRow`. Ordenação e filtro ficam com o consumidor (dados em memória ou servidor).

### Fora do escopo do lote

Agrupamento de linhas, totais/rodapé calculados, edição em lote, células mescladas e cabeçalho fixo com várias linhas.

## Lote 2 — design (aprovado, D-059)

Princípio: todo componente mantém o valor num campo nativo (`<input>` ou `<select>`), para o envio de formulário e o `AZUI.Form` continuarem funcionando. Teclado completo, `az-` no CSS, eventos `az:<nome>:<evento>`.

### Máscara

- Padrão informado pelo desenvolvedor no atributo `data-az-mask`, por exemplo `data-az-mask="99/99/9999"` (decisão do mantenedor: padrão genérico, sem formatos fixos; o nome `data-az-mask` em vez de `mask` é decisão do assistente, por seguir o padrão `data-az-*`).
- Símbolos: `9` dígito, `a` letra, `*` letra ou dígito; qualquer outro caractere é literal.
- Formata ao digitar e ao colar, apaga literais com Backspace sem travar e mantém o cursor na posição certa.
- `rawValue` devolve só os caracteres digitados, sem os literais; evento `az:mask:complete` quando o padrão é preenchido.
- Fora desta versão (decisão do assistente): moeda e número com separadores (precisam de regra própria, não de padrão fixo) e atalhos nomeados como `cpf`; o desenvolvedor usa o padrão (`999.999.999-99`).

### Combobox

- Campo de texto com lista filtrável (padrão ARIA combobox). Opções locais ou uma função assíncrona de busca, com debounce, estado de carregando e de sem resultados (decisão do assistente).
- O valor escolhido fica em um campo nativo; eventos `az:combobox:search` e `az:combobox:select`.

### Dual Listbox

- Duas listas (disponíveis e selecionados) com busca em cada lado, mover um ou todos e reordenar os selecionados. Reaproveita o `Sortable`, então também se arrasta entre as listas.
- Mantém um `<select multiple>` sincronizado; evento `az:duallistbox:change` com os valores.

### Tag Input

- Digitar e pressionar Enter ou vírgula cria o chip; Backspace remove o último. Evento `az:taginput:add` cancelável para validar.

### Intervalo de datas

- Componente `DateRange` sobre dois campos (início e fim), reaproveitando o calendário do `Datepicker`; valores ISO, como no Datepicker; fim nunca antes do início.

### Hora

- Sem componente novo: o `<input type="time">` nativo cobre; o lote só garante o estilo consistente (decisão do assistente).

### Código de barras

- Campo que distingue leitor (teclas muito rápidas terminadas em Enter) de digitação humana e emite `az:barcode:scan` com o código; digitação lenta segue normal.

### Fora do escopo do lote

Moeda e número formatados; atalhos de máscara nomeados; carregamento de opções paginado no Combobox.

## Lote 1 — design

### Sortable (núcleo)

- Reordena itens dentro de uma lista e move entre listas do mesmo grupo.
- API nativa de drag and drop; sem dependências.
- Teclado (decisão do assistente): selecionar o item, setas para mover, Enter para soltar, Esc para cancelar; posição anunciada via região `aria-live`.
- Eventos: início, movimentação, soltura e cancelamento, com origem, destino e posição. O evento de soltura é cancelável para o sistema recusar a movimentação (ex.: regra de fluxo de status).
- Não guarda dados; quem salva a nova ordem é o sistema.

### Kanban (sobre o Sortable)

- Composição, não estrutura fixa: o cliente define colunas, cartões e, opcionalmente, raias (por pessoa, equipe ou qualquer critério) pelo markup.
- Opcionais por coluna: contador, limite de itens (WIP) e recolhimento (Collapse).
- Cartão livre: o cliente compõe com Avatar, Badge, prazo etc.; a AZ UI fornece apenas o contêiner arrastável.
- Raias são opcionais; sem elas, o quadro é só de colunas.

### Collapse

- Recolher e expandir um bloco avulso, com `aria-expanded`/`aria-controls`.
- Reaproveita a lógica do Accordion quando possível, sem duplicar.

### Tree View

- Hierarquia expansível com navegação por teclado (padrão ARIA `tree`).
- Dados via markup aninhado; carregamento sob demanda dos filhos é decisão a detalhar no design do lote.

### Stepper / Wizard

- Etapas sequenciais com estado (pendente, atual, concluída, erro) e navegação.
- Validação por etapa fica a cargo do sistema; o componente emite eventos e aceita bloquear o avanço.

### Splitter

- Painéis redimensionáveis por arraste e por teclado, com tamanhos mínimos.

## Decisões do assistente (reversíveis)

- Nome da fase e posição no roadmap.
- Eventos canceláveis em vez de callbacks de validação.
- Teclado e leitor de tela como requisito de aceite de todo componente.

## Em aberto

- Agenda/Gantt: mantidos no lote 4; confirmar quando chegar a hora.
- Carregamento sob demanda na Tree View.
- Registrar as decisões aprovadas em `decisions.md` e as dúvidas em `open-questions.md`.
