# API JavaScript — AZ UI

Fonte: `specifications.md` §8. Status: **implementado na Fase 3** (D-040 a D-043); a documentação pública está em `docs/javascript/overview.md`.

## Requisitos

Inicialização manual · inicialização automática opcional · event delegation quando apropriado · prevenção de inicialização duplicada · destruição de instâncias · suporte a conteúdo dinâmico · estado interno quando necessário · APIs públicas previsíveis.

## Uso programático

```ts
import { Modal } from "az-ui";

const modal = new Modal("#modal");
modal.show();
modal.hide();
modal.destroy();
```

## Uso via HTML

```html
<button class="az-btn az-btn-primary" data-az-toggle="modal" data-az-target="#modal">Abrir modal</button>
```

A documentação deve explicar quando usar atributos HTML e quando usar a API programática.

## Globais

- Sem variável global obrigatória.
- `AZUI` como named export ESM; versão global (`window.AZUI`) é entrada separada e opcional (Q-07).
- Inicialização automática em entrada separada para preservar tree-shaking (Q-08).

## Módulos internos (`src/javascript`)

| Módulo | Responsabilidade |
|---|---|
| `core` | Ciclo de vida, registro de instâncias, prevenção de duplicidade |
| `dom` | Utilitários de DOM seguros (criar elementos, resolver alvo) |
| `events` | Delegação e remoção de eventos |

Cada componente interativo usa o `core`; nenhum reimplementa o ciclo de vida.

Implementação: `core/component.ts` (classe base) e `core/overlay.ts` (base de Modal e Offcanvas); `dom/` tem `resolve-element`, `unique-id`, `focus`, `scroll-lock`, `dismiss`, `position` e `markup-to-element`. A inicialização automática está em `src/auto.ts` (fora de `javascript/` porque conhece os componentes).
