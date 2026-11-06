# Estrutura do projeto — AZ UI

Fonte: `specifications.md` §2. Pode ser ajustada na implementação desde que as responsabilidades permaneçam separadas; ajustes entram em `development/decisions.md`.

```text
az-ui/
├── AGENTS.md  CLAUDE.md  README.md  CHANGELOG.md  LICENSE
├── .ai/                     # matriz de contexto para IA (este diretório)
├── src/
│   ├── foundations/         # tokens: colors, typography, spacing, borders, shadows, breakpoints, motion, z-index
│   ├── styles/              # reset, utilities, layout, themes, styles.css
│   ├── components/          # um diretório por componente (button, badge, alert, form, ...)
│   ├── javascript/          # core, dom, events, index.ts
│   ├── api/                 # form, components, index.ts (API declarativa)
│   └── index.ts
├── fonts/                   # inter/, ibm-plex-sans/, source-sans-3/ (+ licenças)
├── docs/                    # VitePress
├── examples/
├── tests/                   # espelha src/
├── scripts/
├── package.json  tsconfig.json  vite.config.ts  postcss.config.js
```

## Responsabilidades

| Diretório | Responsabilidade | Não deve conter |
|---|---|---|
| `foundations` | Tokens do Design System | Estilos de componente |
| `styles` | Reset, utilitários, layout, temas | Lógica de componente |
| `components` | Markup/CSS/TS de cada componente | Valores de design literais |
| `javascript` | Núcleo de ciclo de vida, DOM e eventos | Conhecimento de componentes específicos |
| `api` | Construção declarativa de elementos | Estilos |
| `docs` / `examples` | Consumo da biblioteca como usuário externo | Código da biblioteca |

## Estrutura de um componente

Ver `component-architecture.md`. Componentes somente CSS têm apenas `src/components/<nome>/<nome>.css`; a documentação fica em `docs/components/<nome>.md`.
