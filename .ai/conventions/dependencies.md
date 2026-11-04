# Dependências — AZ UI

## Regra geral

O núcleo (`dependencies` do `package.json`) deve ter **zero dependências de runtime**. Ferramentas de build, teste e documentação ficam em `devDependencies`.

## Stack aprovada (dev)

TypeScript, Vite, PostCSS, Vitest, jsdom, VitePress.

Qualquer outra ferramenta (lint, formatação, biblioteca de ícones etc.) exige entrada em `development/decisions.md`.

## Antes de adicionar

1. Dá para fazer com APIs nativas?
2. Qual o tamanho e o impacto no pacote?
3. Manutenção ativa e licença compatível com redistribuição?
4. Será obrigatória ou opcional para o consumidor?
5. Justificativa técnica registrada em `development/decisions.md`.

## Proibidas no núcleo

Bootstrap, Tailwind, jQuery e qualquer framework de UI.

## Fontes e ativos

Fontes WOFF2 só entram com a licença de redistribuição verificada e o arquivo de licença no repositório.

## Gerenciamento

- Respeitar o gerenciador e o lock file adotados.
- Não atualizar versões como parte incidental de outra tarefa.
- Instalar dependências apenas com autorização do mantenedor.
