# Espaçamento, bordas, sombras e demais tokens — AZ UI

Fonte: `specifications.md` §3.3.

## Valores iniciais

| Grupo | Tokens |
|---|---|
| Raio | `--az-radius-none 0`, `sm 4px`, `md 6px`, `lg 8px` |
| Espaçamento | `--az-spacing-1 4px`, `2 8px`, `3 12px`, `4 16px`, `5 20px`, `6 24px`, `8 32px`, `10 40px` |
| Sombra | `--az-shadow-sm 0 1px 2px rgba(15,23,42,.05)`, `--az-shadow-md 0 4px 12px rgba(15,23,42,.08)` |

## Tokens a criar na Fase 1

- Altura de controles (sm/md/lg; variantes compacta e confortável).
- Larguras máximas.
- Camadas de sobreposição (z-index).
- Breakpoints (valores em Q-03).
- Transições e durações (motion).
- Anel de foco.
- Opacidade.

## Regras

- Sem valores aleatórios repetidos nos componentes.
- Densidade: oferecer tamanhos compactos e confortáveis para tabelas, formulários, listagens, menus e barras de ferramentas.
- Não desperdiçar espaço vertical.
- Cantos discretos; raio máximo `lg`.
