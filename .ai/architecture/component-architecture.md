# Arquitetura de componentes — AZ UI

Status: **fechado para componentes somente CSS e campos de formulário** (D-034 a D-038). O contrato do tipo 3 foi fechado na Fase 3 (D-041, D-042).

## Tipos de componente

1. **Somente CSS** (Badge, Divider, Skeleton, Card...): classes `az-*`, sem JS.
2. **CSS + construtor declarativo** (campos de formulário): classes + função em `src/api`.
3. **CSS + comportamento** (Modal, Dropdown, Tabs...): classes + classe TS com ciclo de vida.

Somente o tipo 3 tem classe JS exportada (D-035). Button e demais componentes da Fase 2 são somente CSS.

Tipo 3 (Fase 3): `context-menu`, `command-menu`, `notification`, `modal`, `offcanvas`, `toast`, `dropdown`, `tooltip`, `popover`, `tabs`, `datepicker` (cada um com `<nome>.ts`, `<nome>.css` e `index.ts`) e `accordion` (somente CSS).

Fase 4 (dados): somente CSS — `progress`, `empty-state`, `stat`, `status-indicator`, `key-value`, `list-group`, `timeline`, `toolbar`, `search`, `filter`; CSS + comportamento — `table` (CSS da tabela, ordenação, seleção e ações por linha, mais a classe `DataTable`), `pagination` (`Pagination`) `field` (`Counter`) `select` (`Select`) e `file-upload` (`FileUpload`). Ver D-046 a D-050.

Implementados na Fase 2: `button`, `badge`, `alert`, `spinner`, `skeleton`, `divider`, `card`, `avatar` e os blocos de formulário `field`, `control` (input, textarea, select), `check` (checkbox, radio) e `switch`. Cada um tem `src/components/<nome>/<nome>.css`, importado em `src/styles/styles.css`; o teste `tests/components/components.test.ts` valida o import, o prefixo `az-` e a ausência de cores literais e `!important`.

## Estrutura proposta por componente

```text
src/components/<nome>/
├── <nome>.css
├── <nome>.ts          # somente tipo 3
├── <nome>.types.ts    # opções e variantes
└── index.ts
tests/components/<nome>/
docs/components/<nome>.md
```

## Contrato de ciclo de vida (tipo 3)

- `new Componente(alvo, opções?)` — aceita seletor ou `HTMLElement`.
- Instância única por elemento; segunda inicialização reutiliza ou rejeita, nunca duplica listeners.
- Métodos públicos nomeados por ação (`show`, `hide`, `toggle`, `destroy`).
- `destroy()` remove eventos, referências e atributos adicionados.
- Eventos emitidos como `CustomEvent` com prefixo `az:` (ex.: `az:modal:show`).
- Inicialização automática via `data-az-*`, opcional e em entrada separada (Q-08).

## Variantes e estados

Mesmo vocabulário em CSS, TS e docs: `primary | secondary | outline | ghost | danger`, tamanhos `sm | md | lg`. Estados padronizados conforme `design-system/components.md`.

## Regras

- Sem dependência entre componentes sem necessidade real.
- Sem estilo de um componente dentro do arquivo de outro.
- Acessibilidade e testes fazem parte da definição de pronto.
