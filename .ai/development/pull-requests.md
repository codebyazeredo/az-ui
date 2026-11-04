# Pull requests e versionamento — AZ UI

Status: o repositório ainda não é git. Este arquivo vale a partir da inicialização do git (por solicitação do mantenedor).

## Regras

- Commits, pushes, merges e troca de branch somente por solicitação.
- Um PR por item coeso do roadmap; sem misturar fases.
- Branches: `feat/<escopo>`, `fix/<escopo>`, `docs/<escopo>`, `chore/<escopo>`.
- Commits no estilo Conventional Commits (`feat(button): ...`), mensagens e descrições de PR em inglês.
- Versionamento semântico; alterações visíveis em `CHANGELOG.md` (Keep a Changelog).

## Descrição do PR

1. O que mudou e por quê.
2. Item do roadmap / decisão relacionada.
3. Checklist de componente (se aplicável).
4. Testes executados (apenas os reais).
5. Impacto em API pública / compatibilidade.
6. Pendências.

## Publicação

Nunca publicar no npm sem autorização explícita do mantenedor.
