# .ai — Matriz de contexto do AZ UI

Diretório de contexto para IA e pessoas que desenvolvem a biblioteca. Não é publicado no npm.

## Ordem de leitura

1. `../AGENTS.md`
2. `conventions/mandatory-rules.md`
3. `development/roadmap.md` — onde estamos e o que vem a seguir
4. `development/open-questions.md` e `development/decisions.md` — pendências e decisões
5. Arquivos específicos da tarefa (tabela abaixo)

## Mapa

```text
.ai/
├── README.md
├── specifications.md          # visão completa do produto (fonte original)
├── conventions/               # como escrever o código
│   ├── mandatory-rules.md  code-style.md  naming.md  architecture.md
│   ├── css-conventions.md  typescript-conventions.md
│   └── accessibility.md  testing.md  dependencies.md
├── design-system/             # como a interface deve parecer
│   ├── visual-identity.md  colors.md  typography.md  spacing.md
│   └── components.md  enterprise-ui.md  anti-ai-design.md
├── architecture/              # como a biblioteca é organizada
│   ├── project-structure.md  component-architecture.md
│   ├── javascript-api.md  form-api.md
│   └── css-architecture.md  theme-system.md  npm-distribution.md
├── development/               # como trabalhar e acompanhar
│   ├── implementation-workflow.md  component-checklist.md
│   ├── documentation.md  pull-requests.md  definition-of-done.md
│   └── roadmap.md  decisions.md  open-questions.md
└── glossary/
    └── glossary.md  design-system.md  components.md  forms.md  technical-terms.md
```

## Qual arquivo consultar

| Tarefa | Ler |
|---|---|
| Qualquer alteração | `conventions/mandatory-rules.md`, `development/roadmap.md` |
| Tokens, CSS, temas | `design-system/*`, `architecture/css-architecture.md`, `architecture/theme-system.md`, `conventions/css-conventions.md` |
| Novo componente | `design-system/components.md`, `architecture/component-architecture.md`, `development/component-checklist.md`, `conventions/accessibility.md` |
| API de formulários | `architecture/form-api.md`, `glossary/forms.md` |
| Comportamento JS | `architecture/javascript-api.md`, `conventions/typescript-conventions.md` |
| Build / npm | `architecture/npm-distribution.md`, `conventions/dependencies.md` |
| Testes | `conventions/testing.md` |
| Documentação | `development/documentation.md` |
| Dúvida de termo | `glossary/` |

## Controle do projeto

| Arquivo | Função |
|---|---|
| `development/roadmap.md` | Fases e checkboxes; fonte do andamento |
| `development/decisions.md` | Registro imutável de decisões |
| `development/open-questions.md` | Inconsistências e dúvidas com proposta padrão |
| `../CHANGELOG.md` | Mudanças visíveis ao consumidor |

## Manutenção

- Atualizar estes arquivos na mesma tarefa que muda o que eles descrevem.
- Em conflito, vale a ordem de precedência de `conventions/mandatory-rules.md`.
- Arquivos marcados como "rascunho" devem ser fechados antes da fase indicada.
