# Checklist de componente — AZ UI

Copiar para a descrição da tarefa e marcar. Um componente só está concluído com todos os itens aplicáveis.

## Design
- [ ] Usa somente tokens.
- [ ] Parece pertencer a um sistema corporativo (`design-system/visual-identity.md`).
- [ ] Não viola `design-system/anti-ai-design.md`.
- [ ] Variações definidas e nomeadas conforme o vocabulário padrão.
- [ ] Estados: default, hover, focus, disabled (+ readonly, invalid, valid, loading quando aplicável).
- [ ] Tamanhos/densidade compacta e confortável quando aplicável.
- [ ] Funciona com grande volume de dados (quando aplicável).
- [ ] Tema claro e escuro.

## Código
- [ ] Responsabilidade única; arquivos separados por estrutura, estilo e comportamento.
- [ ] Classes com prefixo `az-`; sem `!important` injustificado.
- [ ] API pública tipada (interface específica).
- [ ] Sem HTML inseguro com valores do usuário.
- [ ] Ciclo de vida: init sem duplicidade, `destroy()` limpa tudo (quando interativo).
- [ ] Exportado no `index.ts` correto.

## Acessibilidade
- [ ] HTML semântico; ARIA só quando necessário.
- [ ] Teclado completo; foco visível.
- [ ] Contraste verificado.
- [ ] Gestão de foco e `Escape` (sobrepostos).
- [ ] `prefers-reduced-motion`.

## Qualidade
- [ ] Testes: renderização, props, estados, eventos, a11y básica, destroy, duplicidade.
- [ ] Documentação com todos os itens de `development/documentation.md`.
- [ ] `CHANGELOG.md` e `roadmap.md` atualizados.
