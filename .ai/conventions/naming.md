# Nomenclatura — AZ UI

| Elemento | Convenção | Exemplo |
|---|---|---|
| Classes CSS | kebab-case com prefixo `az-` | `az-btn`, `az-btn-primary` |
| Variáveis CSS | `--az-` + kebab-case | `--az-color-primary` |
| Atributos HTML | `data-az-*` | `data-az-toggle="modal"` |
| Interfaces / Types / Classes TS | PascalCase | `FormFieldOptions`, `Modal` |
| Métodos e variáveis | camelCase | `show()`, `fieldOptions` |
| Constantes | UPPER_SNAKE_CASE, apenas constantes globais apropriadas | `DEFAULT_THEME` |
| Arquivos | kebab-case | `data-table.ts` |
| Diretórios | kebab-case | `ibm-plex-sans/` |
| Namespace JavaScript | `AZUI` | `AZUI.Form.text()` |
| Pacote npm | `az-ui` | `import "@codebyazeredo/az-ui/styles.css"` |
| Família tipográfica (CSS) | `AZ ` + nome | `"AZ Inter"` |

## Regras

- Nomes descritivos; evitar `data`, `item`, `temp`, `value` quando houver nome mais preciso.
- Evitar abreviações obscuras.
- Variantes e estados de componentes usam o mesmo vocabulário em CSS, TS e documentação (`primary`, `danger`, `sm`, `md`, `lg`).
- Os termos oficiais estão em `glossary/`. Não usar sinônimos proibidos (ver `glossary/glossary.md`).
