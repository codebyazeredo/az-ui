# Arquitetura de CSS — AZ UI

Status: **rascunho** — fechar na Fase 1.

## Camadas (ordem de carregamento)

1. Tokens (`foundations`) — Custom Properties em `:root`.
2. Temas — sobrescrevem tokens em `[data-az-theme="dark"]`.
3. Reset — escopo mínimo e documentado, sem estilizar elementos de forma invasiva.
4. Layout.
5. Componentes.
6. Utilitários — por último, para vencer componentes sem `!important`.

Avaliar `@layer` para garantir essa ordem (depende do baseline de navegadores, Q-12).

## Entradas públicas

| Import | Conteúdo |
|---|---|
| `az-ui/styles.css` | Tokens, tema, reset, layout, componentes, utilitários, fonte padrão (Inter) |
| `az-ui/fonts/<familia>.css` | `@font-face` da alternativa |
| CSS por componente | Em avaliação (Q-18) |

## Utilitários

Prefixo `az-`, apenas os que trazem produtividade real (lista em `specifications.md` §7). Variantes responsivas com sintaxe única documentada (ex.: `az-md-d-flex`; breakpoints em Q-03). Conflito de nome `az-text-primary` em Q-02.

## Processamento

PostCSS (a definir plugins mínimos). Sem pré-processador adicional sem decisão registrada.
