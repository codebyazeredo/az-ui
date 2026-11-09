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
