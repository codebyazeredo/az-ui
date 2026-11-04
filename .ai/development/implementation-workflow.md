# Fluxo de implementação — AZ UI

## Por tarefa

1. **Entender**: qual item do `roadmap.md`? Está na fase atual?
2. **Consultar**: `conventions/mandatory-rules.md`, convenções da tecnologia, `design-system/` (se visual), `architecture/` (se API).
3. **Verificar** se já existe implementação semelhante.
4. **Pendências**: há questão em `open-questions.md` que bloqueia? Resolver e registrar em `decisions.md` antes de codar.
5. **Escopo mínimo**: definir o menor conjunto de arquivos.
6. **Implementar**.
7. **Verificar**: testes pertinentes (executar somente com autorização).
8. **Documentar**: `docs/`, arquivo de `architecture/` correspondente e `CHANGELOG.md`.
9. **Controlar**: marcar checkbox no `roadmap.md`.
10. **Resumir**: seguir o formato de entrega.

## Regras de fase

- Uma fase por vez, na ordem do roadmap.
- Fim de fase exige validação do mantenedor antes da próxima.
- Nada de componente de fase futura "adiantado".

## Quando parar e perguntar

- Falta informação essencial para a tarefa.
- A tarefa exige alterar API pública ou arquitetura.
- Há conflito entre documentos de `.ai/`.
- Uma dependência nova parece necessária.
