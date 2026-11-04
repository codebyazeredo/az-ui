# Catálogo de componentes — AZ UI

Fonte: `specifications.md` §6. O andamento por fase está em `development/roadmap.md`; este arquivo é o catálogo de escopo.

## Requisitos de todo componente

HTML semântico · estilização própria com tokens · variações · estados · responsividade · acessibilidade · documentação · exemplos · testes · API JavaScript quando necessário. Checklist em `development/component-checklist.md`.

## Básicos

Button (primary, secondary, outline, ghost, danger, loading) · Badge · Alert (success, warning, danger, info) · Spinner · Skeleton · Divider · Avatar · Card · Tooltip · Progress · Empty State · Breadcrumb.

## Formulários

Input (text, email, password, number, search, date, datetime-local, time, file) · Textarea · Select · Multi-select · Checkbox · Radio · Switch · Range · Input group · ícone, prefixo e sufixo · contador de caracteres · mensagens de ajuda, erro e validação.

Estados obrigatórios: default, hover, focus, disabled, readonly, invalid, valid, loading (quando aplicável).

Sem validação de negócio na biblioteca: apenas apresentação de erros e integração com a validação do consumidor.

## Interativos

Modal · Dropdown · Popover · Tabs · Accordion · Offcanvas · Toast · Notification · Datepicker · Command Menu · Context Menu. Exigem gestão correta de eventos, foco, teclado e ciclo de vida.

## Dados

Table · DataTable · Pagination · Sortable Table · Filter · Search · Table Actions · Row Selection · Empty State · Loading State · Status Indicator · Timeline · Stat · Key Value · List Group.

DataTable: ordenação, paginação, seleção, colunas configuráveis, loading, vazio, ações por linha, responsividade, integração com dados externos. Busca e paginação podem ser controladas pelo consumidor (servidor).

## Layout

Container · Grid · Row · Column · Stack · Flex · Page Header · Toolbar · Navbar · Sidebar · Navigation Menu · Breadcrumb · Content Section · Split Layout.

## Regras de uso

- Card só quando há separação lógica de conteúdo; evitar card dentro de card.
- Ícones apenas funcionais (estratégia em Q-13).
- Microinterações discretas; respeitar `prefers-reduced-motion`.
