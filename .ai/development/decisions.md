# Registro de decisões — AZ UI

Formato: ID · data · status (`aceita`, `proposta`, `substituída`) · decisão · motivo. Decisões novas entram no fim. Não editar decisões aceitas: substituir por uma nova.

| ID | Data | Status | Decisão | Motivo |
|---|---|---|---|---|
| D-001 | 2026-11-04 | aceita | Nome do pacote `az-ui`, prefixo CSS `az-`, namespace `AZUI`, atributos `data-az-*`. | Especificação. |
| D-002 | 2026-11-04 | aceita | Sem Bootstrap, Tailwind, jQuery ou framework no núcleo; zero dependências de runtime. | Independência de frameworks. |
| D-003 | 2026-11-04 | aceita | Stack: TypeScript, Vite, PostCSS, Vitest, jsdom, VitePress, npm. | Especificação §2. |
| D-004 | 2026-11-04 | aceita | Fonte padrão Inter; IBM Plex Sans, Source Sans 3 e System UI como alternativas com import próprio. | Especificação §4. |
| D-005 | 2026-11-04 | aceita | Tema por `data-az-theme` com CSS Custom Properties; temas claro e escuro. | Especificação §9. |
| D-006 | 2026-11-04 | aceita | Acessibilidade alvo WCAG 2.2 AA em todo componente. | Especificação §11. |
| D-007 | 2026-11-04 | aceita | Desenvolvimento em fases; adaptador PHP fora da primeira fase. | Especificação §15 e §5.5. |
| D-008 | 2026-11-04 | aceita | Diretório de contexto para IA é `.ai/` (não `ai/`); estrutura de subpastas conforme `structure.md` original. | Pedido do mantenedor; `AGENTS.md` ajustado. |
| D-009 | 2026-11-04 | aceita | Arquivos antigos planos (`conventions.md`, `glossary.md`, `rules.md`, `structure.md`) foram redistribuídos nas subpastas; `specifications.md` permanece como fonte da visão do produto. | Organização. |
| D-010 | 2026-11-04 | aceita | Comandos de ambiente (instalar, build, testes, servidores) e operações git só com autorização do mantenedor. | Instrução do mantenedor. |
| D-011 | 2026-11-04 | aceita | Contraste (Q-01): escurecer `--az-text-muted` para ≥4,5:1 sobre branco; criar `--az-color-warning-text`; cores originais de warning só em fundos/ícones. Script de verificação de contraste dos tokens. | WCAG 2.2 AA. |
| D-012 | 2026-11-04 | aceita | Navegadores (Q-12): últimas 2 versões de Chrome, Edge, Firefox e Safari; sem IE; `browserslist` configurado; CSS moderno (`@layer`, nesting, `:has`, `color-mix`) liberado. | Simplicidade do CSS. |
| D-013 | 2026-11-04 | aceita | Licença do projeto (Q-17): MIT. Licenças das fontes (OFL, a confirmar) incluídas junto aos arquivos. | Padrão em bibliotecas de UI. |
| D-014 | 2026-11-04 | aceita | Qualidade (Q-16): ESLint + Prettier + Stylelint como devDependencies, 2 espaços, Node LTS atual. Instalação só com autorização. | Consistência. |
| D-015 | 2026-11-04 | aceita | Breakpoints (Q-03): `sm 640`, `md 768`, `lg 1024`, `xl 1280`, mobile-first. Variantes responsivas só em display, flex, gap, text-align, margin e padding, geradas por script. | Evitar CSS inflado. |
| D-016 | 2026-11-04 | aceita | Fontes (Q-04): o build copia as fontes para `dist/fonts/` e gera CSS com `url()` relativo ao arquivo publicado; teste de resolução obrigatório. | Imports funcionando após publicação. |
| D-017 | 2026-11-04 | aceita | Escalas e tema escuro (Q-09, Q-10): escalas `--az-primary-50…900` (idem demais cores); tokens semânticos apontam para a escala; tema escuro definido na Fase 1 com contraste verificado; sem atributo = tema claro. | Tokens previsíveis. |
| D-018 | 2026-11-04 | aceita | Tipografia (Q-11): corpo `--az-font-size-base` (0,9375rem); controles e tabelas `md` (0,875rem); legendas `sm`/`xs`. | Densidade enterprise. |
| D-019 | 2026-11-04 | aceita | O nome `az-ui` retornou 404 no registro npm em 2026-11-04 (livre). Reconferir imediatamente antes da publicação. | Disponibilidade do nome. |
| D-020 | 2026-11-04 | aceita | Inter, IBM Plex Sans e Source Sans 3 estão sob SIL OFL 1.1 (redistribuição e uso comercial permitidos). Nomes reservados ("Inter", "Plex", "Source"): não renomear nem modificar os arquivos sem rever a licença. Incluir o `LICENSE.txt` oficial de cada projeto ao adicionar os arquivos. | Pesquisa em fontes secundárias; confirmação no repositório oficial pendente. |
| D-021 | 2026-11-04 | aceita | Reset opt-in: `box-sizing` e estilo base (fonte, cor, fundo) só dentro de `.az-body`; nenhum seletor global de elemento. | Regra de estilos não invasivos. |
| D-022 | 2026-11-04 | aceita | Q-02: `.az-text-primary` = texto principal (`--az-text-primary`); cor de marca = `.az-text-brand`. Utilitários de cor de status usam tokens `*-text`. | Evitar ambiguidade de nomes. |
| D-023 | 2026-11-04 | aceita | Cada tema define tokens `--az-color-{primary,success,warning,danger,info}-text` para texto sobre superfícies. `text-secondary` = gray-700, `text-muted` = gray-600 (`#637082`), `success-text` = success-700 no claro. Valores validados por teste de contraste (≥4,5:1). | D-011 e resultado dos testes. |
| D-024 | 2026-11-04 | aceita | Utilitários gerados por `scripts/generate-utilities.mjs` (tabelas no script) para `utilities.generated.css`, ignorado pelo git e regenerado por hooks `pre*` do npm. Media queries em notação `(width >= N px)`. | D-015; fonte única de verdade. |
| D-025 | 2026-11-04 | aceita | Build: Vite em modo biblioteca, somente ESM (CJS adiado, Q-18); declarações via `tsc`; CSS via PostCSS (`postcss-import`) com reescrita dos `url()` de fontes; fontes copiadas para `dist/fonts`. | D-016; menor pipeline possível. |
| D-026 | 2026-11-04 | aceita | TypeScript fixado em `~6.0` porque `typescript-eslint` 8.72 exige TypeScript <6.1. Reavaliar quando houver suporte ao 7.x. | Conflito de peer dependency no `npm install`. |
| D-027 | 2026-11-04 | aceita | Breakpoints têm fonte única em `src/foundations/breakpoints/breakpoints.json`, lida pelo TypeScript e pelo gerador de utilitários. | Evitar divergência. |
| D-028 | 2026-11-04 | aceita | Sem comentários no código, exceto quando extremamente necessário para o entendimento. | Regra do mantenedor. |
| D-029 | 2026-11-04 | aceita | Tudo em inglês (código, mensagens, testes, exemplos, README, CHANGELOG, docs, commits, PRs), exceto `AGENTS.md`, `CLAUDE.md` e `.ai/`, que ficam em português. | Produto open source de uso geral. |

## Candidatas (resolver via `open-questions.md`)

Ao responder uma questão, mover para a tabela acima com novo ID.
