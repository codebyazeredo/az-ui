# Convenções de arquitetura — AZ UI

Detalhes estruturais estão em `../architecture/`. Este arquivo define as regras de design.

## Camadas

Foundations → Styles → Componentes → JavaScript (core) → API declarativa → Documentação.

- Camadas superiores podem depender das inferiores; nunca o contrário.
- Foundations (tokens) não conhecem componentes.
- Componentes consomem tokens; nunca valores literais de design.
- API declarativa gera markup que usa as classes dos componentes; não duplica estilos.
- Documentação consome a biblioteca como um consumidor externo.

## Independência

- Núcleo independente de frameworks. Compatibilidade com React, Vue, Angular, PHP, Blade e Laminas vem da arquitetura, não de adaptadores na primeira fase.
- Integração PHP (`AZForm`) é pacote separado e opcional; fora da Fase 1.
- Componentes independentes e reutilizáveis; um componente não importa outro sem dependência real.

## Compatibilidade

- Navegadores modernos (baseline em `development/open-questions.md`, Q-12).
- Sem APIs experimentais.
- Funcionar com e sem bundler quando possível.
- Não assumir o framework do consumidor.

## Padrões de projeto

Usar somente com problema concreto. Sem factory, strategy, adapter ou registry para uma única implementação. Registrar o motivo em `development/decisions.md` quando um padrão for adotado.
