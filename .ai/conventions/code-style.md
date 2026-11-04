# Estilo de código — AZ UI

## Organização

- Um componente por diretório, com responsabilidade bem definida.
- Não concentrar vários componentes em um único arquivo.
- Separar estrutura (markup), comportamento (JS/TS) e apresentação (CSS).
- Evitar arquivos grandes; dividir por responsabilidade real, não por etapa trivial.
- Não criar diretórios sem necessidade.
- Dependências explícitas; sem dependências circulares.

## Formatação

- TypeScript, JavaScript, CSS, JSON e Markdown: 2 espaços (ver Q-16 em `development/open-questions.md` para ferramentas de lint/format).
- Sem tabs. Sem espaços no fim de linha. Linha em branco ao final do arquivo.
- Imports agrupados no topo; remover imports não utilizados.
- Sem código morto, variáveis sem uso ou comentários desatualizados.

## JavaScript / TypeScript em runtime

- APIs nativas do navegador; sem jQuery e sem dependência de framework.
- Sem variáveis globais desnecessárias.
- Evitar manipulação insegura de HTML (`innerHTML` com valores externos é proibido).
- Event delegation quando apropriado; não registrar o mesmo listener duas vezes.
- `destroy()` remove eventos e referências.
- Evitar inicialização duplicada de um mesmo elemento.
- Retornos antecipados em vez de aninhamento profundo.

## Comentários

Não comentar. Exceção: quando for extremamente necessário para o entendimento (decisão não óbvia ou limitação que o código não consegue expressar), em inglês e em uma linha. Ver `mandatory-rules.md` §4.

## Idioma

Código, nomes, mensagens, testes, exemplos e documentação pública em inglês. Somente `AGENTS.md`, `CLAUDE.md` e `.ai/` ficam em português.
