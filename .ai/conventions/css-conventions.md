# Convenções de CSS — AZ UI

- Todas as classes públicas usam o prefixo `az-`.
- Cores, espaçamentos, tipografia, raios, sombras, alturas e z-index vêm de tokens (`--az-*`).
- Nenhum componente define identidade visual própria. Antes de criar um valor novo, verificar se existe token equivalente.
- Sem seletores globais de elemento fora do reset documentado; nada de estilo em elementos que não pertencem à biblioteca.
- Sem `!important` sem justificativa em comentário.
- Evitar especificidade alta: preferir uma classe por regra; evitar encadeamento profundo.
- Sem estilos inline como padrão.
- Não misturar estilos de componentes diferentes no mesmo arquivo.
- Estados visuais padronizados: default, hover, focus, active, disabled, readonly, invalid, valid, loading.
- Foco visível em todo elemento interativo, via token de foco.
- Transições via tokens de motion; respeitar `prefers-reduced-motion`.
- Responsividade por breakpoints oficiais (tokens), mobile-first.
- Temas via `[data-az-theme]` e CSS Custom Properties; o consumidor sobrescreve tokens sem editar arquivos internos.
- Convenção de classes de componente (bloco/modificador) a definir em `architecture/css-architecture.md` antes da Fase 2.
