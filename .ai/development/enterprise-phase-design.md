# Design — Fase Enterprise (proposta)

Status: **rascunho aguardando aprovação do mantenedor**. Nada deste documento foi implementado. Ao aprovar, a fase entra em `roadmap.md` entre a Fase 6 e a Fase 7.

## Intenção

Dar à AZ UI o conjunto mais completo possível de componentes prontos para sistemas corporativos (TMS, WMS, ERP, SCS e similares), de modo que o desenvolvedor monte telas sem escrever comportamento na mão.

## Objetivos

- Cobrir estrutura (collapse, tree, stepper, splitter), arrastar e soltar, seleção avançada, entrada de dados com máscaras e tabelas pesadas.
- Kanban para tarefas e andamento de equipe, **montado conforme a necessidade do cliente**.
- Seguir o padrão existente: classe `Component`, entrada `az-ui/auto`, API declarativa por atributos, tokens, temas claro e escuro, docs e exemplos.

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

## Lote 2 — design (proposta, aguardando aprovação)

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
