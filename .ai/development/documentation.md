# Documentação — AZ UI

Ferramenta: **VitePress**, em `docs/`. Fonte: `specifications.md` §13.

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

Catálogo visual interativo dos componentes (Fase 6). Antes disso, `examples/` com páginas HTML simples por fase.

## Arquivos de contexto vs. documentação

`.ai/` orienta quem desenvolve a biblioteca (IA e pessoas). `docs/` orienta quem consome a biblioteca. Não duplicar conteúdo; apontar.
