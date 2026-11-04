# Convenções de TypeScript — AZ UI

- TypeScript para APIs públicas e comportamentos complexos.
- `strict` habilitado.
- Evitar `any`; usar `unknown` quando o tipo for realmente desconhecido.
- Tipos explícitos em toda API pública (parâmetros e retorno).
- Uma interface específica por componente; evitar interfaces genéricas permissivas. Campos comuns ficam em uma interface base pequena (ex.: `FormFieldOptions`) estendida pelas específicas.
- `readonly` quando apropriado.
- Valores opcionais tratados explicitamente.
- Sem casts (`as`) para esconder erro de tipagem.
- Union types literais para variantes (`"sm" | "md" | "lg"`) em vez de `string`.
- Declarações de tipos (`.d.ts`) geradas no build e testadas como parte do pacote.
- Exports públicos apenas por `index.ts` de cada módulo; nada de import profundo documentado sem estar em `exports` do `package.json`.
