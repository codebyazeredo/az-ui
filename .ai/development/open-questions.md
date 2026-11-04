# Questões abertas e inconsistências — AZ UI

Levantadas na leitura de `specifications.md`. Cada item tem **proposta padrão**: se o mantenedor não discordar, ela vira decisão em `decisions.md`. Fase = quando precisa estar resolvida.

**Resolvidas:** Q-01 → D-011 · Q-03 → D-015 · Q-04 → D-016 · Q-09 e Q-10 → D-017 · Q-11 → D-018 · Q-12 → D-012 · Q-16 → D-014 · Q-17 (licença do projeto) → D-013. Em Q-17 continuam pendentes a verificação das licenças das fontes e a do nome `az-ui` no npm.

Na Fase 1: Q-02 → D-022 · Q-18 parcialmente (ESM somente, CJS adiado) → D-025. Q-07 e Q-08 seguem para quando existir JavaScript de componentes.

Linhas abaixo resolvidas permanecem como histórico.

| ID | Fase | Bloqueia | Questão | Proposta padrão |
|---|---|---|---|---|
| Q-01 | 1 | Sim | **Contraste**: `--az-text-muted` `#8A96A5` (~3,0:1 sobre branco) e `--az-color-warning` `#B7791F` como texto (~3,6:1) ficam abaixo de 4,5:1 (valores aproximados, validar). | Escurecer `muted` para ≥4,5:1 e criar `--az-color-warning-text`; usar cores originais apenas em fundos/ícones. Script de verificação de contraste dos tokens. |
| Q-02 | 1 | Não | **Nome ambíguo**: `.az-text-primary` (utilitário) vs `--az-text-primary` (token de texto principal) vs `--az-color-primary` (marca). | `.az-text-primary` = texto principal; cor de marca como `.az-text-brand`. Utilitários de cor semântica: `success`, `warning`, `danger`, `info`. |
| Q-03 | 1 | Sim | **Breakpoints e sintaxe responsiva** (`az-md-d-flex`) sem valores nem lista de utilitários com variante. | `sm 640`, `md 768`, `lg 1024`, `xl 1280`; mobile-first; variantes só em display, flex, gap, text-align, margin/padding; gerado por script. |
| Q-04 | 1 | Sim | **Caminhos de fontes**: o exemplo usa `./fonts/inter/...` a partir do CSS, mas `fonts/` fica na raiz e `styles.css` em `src/styles/`. | Copiar fontes para `dist/fonts/` no build e gerar CSS com `url()` relativo ao arquivo publicado; teste de resolução. |
| Q-05 | 2 | Não | **`render()` sem DOM**: `HTMLElement` exige DOM; `render()` deve servir PHP/Blade/SSR. | Núcleo gera string escapada (sem DOM); funções de elemento fazem parse seguro dessa string via `template`. |
| Q-06 | 2 | Não | **Classes JS exportadas** (`Button`, `DataTable`): Button é só CSS. | Classe JS apenas onde há comportamento (Modal, Dropdown, Tabs, DataTable...). `Button` só se houver estado `loading` programático. |
| Q-07 | 1 | Não | **`AZUI` global** vs "sem variável global obrigatória". | `AZUI` como named export ESM; build IIFE opcional `az-ui/global` que define `window.AZUI`. |
| Q-08 | 1 | Não | **Auto-init vs `sideEffects`/tree-shaking.** | Auto-init em entrada separada `az-ui/auto`; entrada principal sem efeito colateral. |
| Q-09 | 1 | Sim | **Tema escuro** sem valores definidos. | Definir mapa semântico escuro na Fase 1 com contraste verificado; sem atributo = tema claro. |
| Q-10 | 1 | Sim | **Nomenclatura das escalas** (Primary…Gray) e relação com tokens semânticos. | `--az-primary-50…900`; tokens semânticos apontam para a escala (`--az-color-primary: var(--az-primary-700)`). |
| Q-11 | 1 | Sim | **Tamanho base**: `base 0.9375rem` vs `md 0.875rem`; qual é corpo, controle e tabela? | Corpo `base`; controles e tabelas `md`; legendas `sm`/`xs`. |
| Q-12 | 1 | Sim | **Navegadores suportados** (afeta `@layer`, nesting, `:has`, `color-mix`). | Últimas 2 versões de Chrome, Edge, Firefox, Safari; sem IE. Configurar `browserslist`. |
| Q-13 | 3 | Não | **Estratégia de ícones** (biblioteca vs SVG próprios). | SVG inline próprios mínimos para uso interno dos componentes; ícones do consumidor via slot. Reavaliar biblioteca leve com licença compatível. |
| Q-14 | 1 | Não | **Roadmap incompleto**: itens da §6 sem fase (Notification, Command Menu, Context Menu, Sortable Table, Search, Table Actions, Row Selection, Status Indicator, Key Value, List Group, Breadcrumb, Content Section, Split Layout, Row/Column/Flex, file/range/multi-select/input group). | Atribuições sugeridas já marcadas com `(Q-14)` no `roadmap.md`; confirmar. |
| Q-15 | 2 | Não | **Tipos de `value`**: `FormFieldOptions.value` não cobre multi-select (array) nem file. | Interfaces específicas por campo (`value: string[]` no multi-select; file sem `value`). |
| Q-16 | 1 | Sim | **Ferramentas não previstas**: ESLint, Prettier, Stylelint, versão do Node, indentação de TS/CSS (global do mantenedor diz 2 espaços JS/CSS). | Node LTS atual; ESLint + Prettier + Stylelint como devDependencies; 2 espaços. Instalação só com autorização. |
| Q-17 | 0 | Sim | **Licenças e nome**: `LICENSE` do projeto indefinida; licenças das fontes não verificadas; `az-ui` no npm não verificado. | MIT para o projeto; fontes (verificar OFL 1.1 de cada uma) com licença incluída; checar o nome antes da Fase 7 (idealmente já). |
| Q-18 | 1 | Não | **Granularidade de imports**: CSS por componente e saída CJS. | `styles.css` único + entradas por componente em JS; CSS por componente opcional na Fase 7; CJS apenas se houver necessidade comprovada. |

## Como usar

1. Responder no chat ou editar a coluna "Proposta padrão".
2. Registrar a resposta como decisão em `decisions.md`.
3. Remover a linha daqui (ou marcar `resolvida → D-0xx`).
