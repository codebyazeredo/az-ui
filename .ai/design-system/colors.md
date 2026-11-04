# Cores — AZ UI

Fonte: `specifications.md` §3.2 e §10.4. Valores abaixo são o ponto de partida; ajustes são registrados em `development/decisions.md`.

## Tokens semânticos iniciais

| Token | Valor |
|---|---|
| `--az-color-primary` | `#23415C` |
| `--az-color-primary-hover` | `#1B344A` |
| `--az-color-secondary` | `#64748B` |
| `--az-color-success` | `#16845B` |
| `--az-color-warning` | `#B7791F` |
| `--az-color-danger` | `#C0392B` |
| `--az-color-info` | `#2874A6` |
| `--az-color-background` | `#F5F7F9` |
| `--az-color-surface` | `#FFFFFF` |
| `--az-color-surface-muted` | `#F8FAFC` |
| `--az-color-border` | `#DCE2E8` |
| `--az-color-border-strong` | `#C5CED8` |
| `--az-text-primary` | `#263445` |
| `--az-text-secondary` | `#687586` |
| `--az-text-muted` | `#8A96A5` |
| `--az-text-inverse` | `#FFFFFF` |

## Escalas

Criar escalas completas para Primary, Secondary, Success, Warning, Danger, Info e Gray, com tons suficientes para estados, fundos, bordas e textos. Nomenclatura a definir (Q-10).

## Regras

- Componentes consomem tokens; nunca hexadecimais.
- Significado das cores: verde = sucesso; amarelo = atenção; vermelho = erro/crítico; azul = informação e ação primária; cinza = neutro.
- Sem cores vibrantes em excesso ou grandes áreas saturadas.
- Tema claro e escuro por `[data-az-theme]`, com os mesmos nomes de token.

## Pendências conhecidas

- Contraste: `--az-text-muted` (~3,0:1 sobre branco) e `--az-color-warning` como texto (~3,6:1) ficam abaixo de 4,5:1. Resolver antes da Fase 1 (Q-01).
- Valores do tema escuro ainda não definidos (Q-09).
