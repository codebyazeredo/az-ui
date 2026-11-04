# Testes — AZ UI

Ferramentas: **Vitest** + **jsdom**.

## Princípios

- Testar comportamento real; sem testes artificiais para inflar cobertura.
- Corrigir regressões antes de concluir a tarefa.
- Só afirmar que testes passaram se foram executados (execução depende de autorização, ver `conventions/mandatory-rules.md`).

## O que testar por componente

- Renderização e propriedades.
- Estados (disabled, readonly, invalid, loading, etc.).
- Eventos e interações, incluindo teclado.
- Acessibilidade básica (roles, labels, ARIA).
- Inicialização, destruição (`destroy()` remove eventos) e prevenção de duplicidade.

## O que testar no pacote

- Exports públicos (`index.ts` e `exports` do `package.json`).
- Build (artefatos esperados em `dist/`).
- Imports de CSS e de fontes.
- Tipagem TypeScript das APIs públicas.
- API declarativa: markup gerado, escape de HTML, equivalência entre `element` e `render()`.

## Organização

- Testes em `tests/`, espelhando a estrutura de `src/` (ex.: `tests/components/button/`).
- Um arquivo de teste por unidade de comportamento.
- Limitação conhecida: jsdom não calcula layout nem CSS real; contraste e aparência são verificados no catálogo visual.
