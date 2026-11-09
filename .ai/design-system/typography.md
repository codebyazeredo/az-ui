# Tipografia e fontes — AZ UI

Fonte: `specifications.md` §4.

## Famílias oficiais

| Fonte | Papel | Carregamento |
|---|---|---|
| Inter | Padrão | Com o CSS principal |
| IBM Plex Sans | Alternativa corporativa (sistemas densos) | Import próprio |
| Source Sans 3 | Alternativa administrativa | Import próprio |
| System UI | Sem download de fontes | Sem arquivos |

Nunca carregar todas as famílias automaticamente.

## Arquivos

- Formato WOFF2, pesos 400, 500, 600 e 700.
- Estrutura: `fonts/<familia>/<familia>-<peso>.woff2`.
- `font-family` interno com prefixo: `"AZ Inter"`, `"AZ IBM Plex Sans"`, `"AZ Source Sans 3"`.
- `font-display: swap`.
- **Verificar a licença de redistribuição** e incluir o arquivo de licença de cada família antes de adicionar os arquivos.
- O build deve preservar os caminhos para que os imports funcionem após publicação (Q-04).

## Tokens

`--az-font-family`; tamanhos `xs 0.75rem`, `sm 0.8125rem`, `md 0.875rem`, `base 0.9375rem`, `lg 1.125rem`, `xl 1.25rem`, `2xl 1.5rem`; pesos 400/500/600/700; line-heights `tight 1.25`, `normal 1.5`, `relaxed 1.65`.

Papel de cada tamanho (corpo, controles, tabelas, títulos): a definir (Q-11).

## Personalização

- Sobrescrever `--az-font-family` no projeto consumidor.
- Imports de alternativas: `@codebyazeredo/az-ui/fonts/ibm-plex-sans.css`, `@codebyazeredo/az-ui/fonts/source-sans-3.css`.
- Permitir fonte externa ou já instalada sem exigir os arquivos da AZ UI.

## Regras

- Sem títulos gigantes ou texto exageradamente destacado.
- Tamanho padrão confortável para tabelas e formulários extensos.
