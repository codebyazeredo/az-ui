# Pull requests e versionamento — AZ UI

Status: o repositório ainda não é git. Este arquivo vale a partir da inicialização do git (por solicitação do mantenedor).

## Regras

- Commits, pushes, merges e troca de branch somente por solicitação.
- Um PR por item coeso do roadmap; sem misturar fases.
- Branches: `feat/<escopo>`, `fix/<escopo>`, `docs/<escopo>`, `chore/<escopo>`.
- Commits no estilo Conventional Commits (`feat(button): ...`), mensagens e descrições de PR em inglês.
- Versionamento semântico; alterações visíveis em `CHANGELOG.md` (Keep a Changelog).

## Descrição do PR

Obrigatória, no modelo `.github/PULL_REQUEST_TEMPLATE.md` (em inglês), com as três seções preenchidas:

1. **Responsible:** nome e usuário do GitHub de quem é responsável.
2. **What was done:** o que foi feito.
3. **Why it was done:** por que foi feito.

O modelo ainda traz, como complemento: tipo de mudança, item relacionado, impacto na API pública, verificação (lint, format, testes, conferência visual) e checklist (tokens, acessibilidade, testes, docs e CHANGELOG, sem comentários, inglês). PR com seção obrigatória vazia não é revisado. A obrigatoriedade técnica (checagem automática e proteção de branch) ainda não está configurada.

## Publicação

Nunca publicar no npm sem autorização explícita do mantenedor.
