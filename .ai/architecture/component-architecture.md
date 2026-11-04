# Arquitetura de componentes — AZ UI

Status: **rascunho** — fechar antes da Fase 2 e registrar em `development/decisions.md`.

## Tipos de componente

1. **Somente CSS** (Badge, Divider, Skeleton, Card...): classes `az-*`, sem JS.
2. **CSS + construtor declarativo** (campos de formulário): classes + função em `src/api`.
3. **CSS + comportamento** (Modal, Dropdown, Tabs...): classes + classe TS com ciclo de vida.

Quais componentes têm classe JS exportada (por exemplo, `Button`) está em aberto (Q-06).

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
