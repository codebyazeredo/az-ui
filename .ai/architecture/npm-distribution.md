# Distribuição npm — AZ UI

Fonte: `specifications.md` §12 e §4.2–4.5. Status: **rascunho** — fechar na Fase 1.

## Layout atual de `dist/` (Fase 1)

```text
dist/
├── index.js  auto.js  <chunk>.js  index.d.ts  auto.d.ts  foundations/…d.ts   # auto.js: az-ui/auto
├── styles.css                    # tokens, temas, reset/base opt-in, fonte Inter, utilitários
└── fonts/
    ├── ibm-plex-sans.css  source-sans-3.css
    └── inter/  ibm-plex-sans/  source-sans-3/   # WOFF2 + licenças
```

`npm run build` = Vite (ESM) → `tsc` (declarações) → `scripts/build-css.mjs` (CSS e fontes). `npm test` valida também o `dist/` quando ele existe.

## Pacote

`az-ui`. Funciona com npm, pnpm, yarn e bun. Disponibilidade do nome no npm deve ser verificada antes da primeira publicação (Q-17). **Não publicar sem autorização explícita.**

## Imports públicos alvo

```ts
import "az-ui/styles.css";
import "az-ui/fonts/ibm-plex-sans.css";
import { AZUI, Button, Modal, DataTable } from "az-ui";
```

## `package.json`

Campos exigidos: `name`, `version`, `description`, `license`, `exports`, `main`, `module`, `types`, `files`, `sideEffects`.

- `sideEffects`: os arquivos CSS e `./dist/auto.js`; o resto do JS é livre de efeito colateral na importação (D-040).
- `files`: somente `dist/` e `fonts/` com licenças; nada de código de desenvolvimento.
- `exports` com condições `types`, `import` e, se necessário, `require` (Q-18).

## Build

Produz: ESM · CJS (se necessário) · declarações TypeScript · CSS distribuível · fontes · imports individuais.

## Fontes

Os caminhos `url()` do CSS devem resolver a partir do local publicado em `dist/` (Q-04). Teste obrigatório de import de CSS e fontes.

## Versionamento

Semantic Versioning. Mudanças registradas em `CHANGELOG.md`. Antes de `1.0.0`, mudanças quebrando API ainda exigem registro e nota de migração.
