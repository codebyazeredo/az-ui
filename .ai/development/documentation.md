# Documentação — AZ UI

Ferramenta: site estático próprio em `site/` (Vite multipágina, feito com a própria AZ UI), alimentado pelos arquivos Markdown de `docs/` (D-055). Fonte: `specifications.md` §13.

Comandos: `npm run docs:dev` (servidor local), `npm run docs:build` (site em `dist-site/`), `npm run docs:generate` (Markdown para páginas em `site/docs/`, gerado e ignorado pelo git).

Os blocos ```` ```html ```` dos Markdown são renderizados ao vivo com o código logo abaixo; `html source` mostra só o código e `html preview` só o resultado. Telas de exemplo completas ficam em `site/examples/`, a landing em `site/index.html` e o catálogo de ícones em `site/icons.html`. A navegação fica em `site/assets/nav.ts`: toda página nova entra ali.

## Regras

- Toda API pública tem documentação; alteração de API atualiza a documentação na mesma tarefa.
- Nunca documentar como existente algo que não foi implementado.
- A documentação também é referência de identidade visual.

## Cada componente documenta

1. Descrição.
2. Exemplo visual.
3. Código HTML.
4. Código TypeScript (quando aplicável).
5. Propriedades.
6. Variações.
7. Estados.
8. Acessibilidade.
9. Observações de uso.

## Formato de apresentação (estilo Bootstrap)

A documentação mostra a usabilidade de cada componente com exemplos práticos:

- Cada exemplo é **renderizado ao vivo** (usando a própria AZ UI) e vem acompanhado do **código-fonte** logo abaixo, com botão de copiar.
- Um exemplo por variação, tamanho e estado (default, hover/focus quando demonstrável, disabled, invalid, loading...).
- Exemplos mínimos e copiáveis: o trecho mostrado funciona sozinho em uma página que importe `az-ui/styles.css`.
- Abas ou blocos para as formas de uso: HTML, TypeScript/API programática e atributos `data-az-*`.
- Tabelas de propriedades/opções, eventos e métodos por componente.
- Exemplos de composição em cenários reais (listagem com filtros, formulário extenso, tela de detalhe).
- O código exibido deve ser o mesmo que gera o exemplo renderizado, para nunca divergir.

## Seções do site

Introdução · Instalação · Primeiros passos · Design System · Cores · Tipografia · Fontes · Espaçamentos · Temas · Componentes · Formulários · API JavaScript · Classes utilitárias · Layouts · Acessibilidade · Personalização · Integração com PHP · Integração com frameworks · Migração e versionamento.

## Catálogo

O catálogo é o próprio site (Fase 6). As páginas `examples/` por fase foram substituídas por ele.

## Arquivos de contexto vs. documentação

`.ai/` orienta quem desenvolve a biblioteca (IA e pessoas). `docs/` orienta quem consome a biblioteca. Não duplicar conteúdo; apontar.
