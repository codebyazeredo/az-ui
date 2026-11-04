# Sistema de temas — AZ UI

Fonte: `specifications.md` §9.

## Mecanismo

- CSS Custom Properties.
- Seleção por atributo: `<html data-az-theme="light">` ou `"dark"`.
- Temas iniciais: claro (padrão) e escuro.

## Regras

- O consumidor sobrescreve tokens sem editar arquivos internos.
- Componentes só leem tokens semânticos (`--az-color-surface`), nunca valores do tema.
- A biblioteca não força cor, tipografia ou estilo em elementos que não são dela.
- Sem seletores globais invasivos.
- Troca de tema não exige JavaScript (JS opcional apenas para persistir a escolha).

## Pendências

- Mapa completo de tokens do tema escuro com contraste verificado (Q-09).
- Comportamento sem atributo (`prefers-color-scheme` ou sempre claro) a decidir.
