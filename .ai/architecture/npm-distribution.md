# Distribuição npm — AZ UI

Fonte: `specifications.md` §12 e §4.2–4.5. Status: **rascunho** — fechar na Fase 1.

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

- `sideEffects`: listar apenas os arquivos CSS; JS livre de efeito colateral na importação (Q-08).
- `files`: somente `dist/` e `fonts/` com licenças; nada de código de desenvolvimento.
- `exports` com condições `types`, `import` e, se necessário, `require` (Q-18).

## Build

Produz: ESM · CJS (se necessário) · declarações TypeScript · CSS distribuível · fontes · imports individuais.

## Fontes

Os caminhos `url()` do CSS devem resolver a partir do local publicado em `dist/` (Q-04). Teste obrigatório de import de CSS e fontes.

## Versionamento

Semantic Versioning. Mudanças registradas em `CHANGELOG.md`. Antes de `1.0.0`, mudanças quebrando API ainda exigem registro e nota de migração.
