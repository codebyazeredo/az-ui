# Acessibilidade — AZ UI

Objetivo de conformidade: **WCAG 2.2 nível AA**. Acessibilidade faz parte de cada componente; não é correção posterior.

## Requisitos por componente

- HTML semântico antes de ARIA; ARIA somente quando necessário.
- Navegação completa por teclado.
- Foco visível (token de foco) e ordem de foco lógica.
- Contraste mínimo: 4,5:1 para texto normal, 3:1 para texto grande e componentes de interface.
- Labels associados a todos os campos.
- Estados acessíveis (`aria-expanded`, `aria-invalid`, `aria-disabled`, `aria-busy`) quando o HTML nativo não os expressa.
- Erros e ajuda ligados ao campo (`aria-describedby`); erro com `aria-invalid="true"`.
- Componentes sobrepostos (modal, offcanvas, popover, dropdown): gerenciar foco ao abrir, prender foco quando modal, devolver foco ao fechar, fechar com `Escape`.
- Respeitar `prefers-reduced-motion`.
- Tamanho mínimo de alvo de toque conforme WCAG 2.2 (2.5.8).

## Verificação

- Teste automatizado de acessibilidade básica por componente (roles, labels, atributos ARIA, teclado).
- Verificação de contraste dos tokens ao alterar paleta (ver Q-01 em `development/open-questions.md`).
- Revisão manual com leitor de tela antes de marcar componente interativo como concluído.
