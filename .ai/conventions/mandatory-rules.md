# Regras obrigatórias — AZ UI

Leitura obrigatória antes de qualquer alteração. Em caso de conflito, a ordem de precedência é:

1. Instrução explícita do mantenedor no chat.
2. Este arquivo.
3. Demais arquivos de `.ai/`.
4. `.ai/specifications.md` (fonte da visão do produto; decisões posteriores ficam em `development/decisions.md`).

## 1. Princípios de engenharia

- Single Responsibility, Separation of Concerns, alta coesão, baixo acoplamento.
- DRY sem abstrações artificiais; KISS.
- Composição antes de herança, quando aplicável.
- Simplicidade prevalece sobre complexidade desnecessária.

## 2. Escopo

- Implementar somente o que foi solicitado.
- Desenvolver por fases, na ordem de `development/roadmap.md`. Não antecipar componentes futuros.
- Não refatorar partes não relacionadas à tarefa.
- Não alterar arquitetura ou API pública sem necessidade demonstrável e registro em `development/decisions.md`.

## 3. Proibições do núcleo

- Bootstrap, Tailwind, jQuery ou qualquer framework como dependência interna.
- Dependência obrigatória de React, Vue, Angular ou outro framework.
- Estilos globais invasivos (seletores de elemento, reset fora do escopo definido).
- `!important` sem justificativa registrada.
- Valores de design repetidos fora dos tokens.
- Variáveis globais obrigatórias.
- Inserir valores do usuário como HTML não confiável.
- Carregar todas as famílias tipográficas por padrão.
- Usar fontes sem verificar e incluir a licença.
- Publicar no npm sem autorização explícita.

## 4. Comentários e idioma

**Comentários**

- Não escrever comentários no código. Só é permitido quando for extremamente necessário para o entendimento (decisão não óbvia, limitação ou contorno que o código não consegue expressar).
- Se um nome melhor, uma função extraída ou um teste resolve, não comentar.
- Proibido: comentário que descreve o que o código faz, cabeçalhos de seção, JSDoc redundante, código comentado, "TODO" sem tarefa.

**Idioma (produto open source de uso geral)**

- Tudo em **inglês**: código, nomes de variáveis, funções, tipos, classes CSS, tokens, comentários (quando permitidos), mensagens de erro e de log, nomes e descrições de testes, textos de exemplos e páginas, `README.md`, `CHANGELOG.md`, `docs/`, mensagens de commit e descrições de PR, `package.json`, `LICENSE`.
- **Exceção:** os arquivos de instrução para IA — `AGENTS.md`, `CLAUDE.md` e tudo em `.ai/` — permanecem em português.

## 5. Execução (ambiente do mantenedor)

- Não instalar dependências, executar build, testes, servidores ou qualquer comando de ambiente sem solicitação ou autorização explícita. Quando uma verificação for necessária, informar o comando e aguardar.
- Não fazer commit, push, merge ou troca de branch sem solicitação.
- Não criar servidores, bancos de dados ou infraestrutura.

## 6. Controle do projeto

Toda tarefa deve deixar rastro nos arquivos de controle:

| Situação | Onde registrar |
|---|---|
| Item de fase concluído | `development/roadmap.md` (marcar checkbox) |
| Decisão técnica ou de design tomada | `development/decisions.md` |
| Dúvida ou inconsistência encontrada | `development/open-questions.md` |
| Mudança visível ao consumidor | `CHANGELOG.md` (seção Unreleased) |
| API pública criada ou alterada | `docs/` e o arquivo de `architecture/` correspondente |

## 7. Entrega

Ao concluir, informar de forma breve:

- O que foi implementado.
- Arquivos criados e modificados.
- Testes executados (somente os realmente executados).
- Dependências adicionadas, com justificativa.
- Pendências conhecidas.

Nunca afirmar que algo foi testado ou verificado sem ter executado.
