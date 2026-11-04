# Padrões enterprise de interface — AZ UI

Fonte: `specifications.md` §10.

## Hierarquia de página

Título → descrição contextual (se necessária) → ações principais → filtros → conteúdo → informações complementares. Sem grandes cabeçalhos decorativos.

## Densidade

Tamanhos compacto e confortável para tabelas, formulários, listagens, menus e barras de ferramentas. Aproveitar o espaço vertical.

## Estrutura

Preferir tabelas, divisores, agrupamentos, cabeçalhos e espaço em branco a caixas. Card apenas para separação lógica.

## Cores com significado

Verde: sucesso. Amarelo: atenção. Vermelho: erro/crítico. Azul: informação e ação primária. Cinza: neutro.

## Ícones

Biblioteca leve com imports individuais, sem fonte de ícones pesada. Ícones funcionais, discretos e consistentes. Definição pendente (Q-13).

## Microinterações

Transições discretas em hover, focus, abertura de modal, expansão de menus, feedback de ações e carregamento. `prefers-reduced-motion` respeitado. Sem animações chamativas.

## Cenários de referência

Toda decisão visual deve funcionar em: listagem com filtros e tabela, formulário extenso, tela de detalhe, dashboard administrativo, uso por várias horas seguidas.
