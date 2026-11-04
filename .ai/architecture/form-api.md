# API declarativa de formulários — AZ UI

Fonte: `specifications.md` §5. Um dos principais diferenciais da biblioteca. Status: **contrato de intenção**; consultar antes de qualquer alteração.

## Métodos

`AZUI.Form.input` (genérico, com `type`) e especializados: `text`, `email`, `password`, `number`, `date`, `textarea`, `select`, `checkbox`, `radio`, `switch`. Campos futuros (search, datetime-local, time, file, range, multi-select) seguem o mesmo padrão.

Agrupamento: `AZUI.Form.group({ label, fields: [...] })`, gerando estrutura semântica (`fieldset` + `legend`).

## Opções comuns

```ts
interface FormFieldOptions {
  name: string;
  label?: string;
  value?: string | number | boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  helpText?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  attributes?: Record<string, string | number | boolean>;
}
```

Cada componente estende essa base com sua própria interface (ex.: `SelectOptions` com `options`; `TextareaOptions` com `rows`). Sem interface única genérica se prejudicar a tipagem. Valores de multi-select e file em Q-15.

## Retornos

- Elemento: `AZUI.Form.text({...})` retorna `HTMLElement`.
- Markup: `AZUI.Form.render({...})` retorna `string` HTML.
- `render()` **nunca** permite injeção de HTML por valores do usuário (escape obrigatório). Funcionamento sem DOM (Node/SSR) em Q-05.
- Sem APIs duplicadas sem necessidade.

## Regras de formulário

- Todo campo associável a um label.
- `name` sempre preservado.
- `id` previsível ou gerado de forma segura e única.
- Erros e ajuda acessíveis (`aria-describedby`, `aria-invalid`).
- `disabled` e `readonly` com estados visuais distintos.
- Sem validação de negócio: a biblioteca só apresenta erros fornecidos pelo consumidor.

## PHP

Adaptador `AZForm::text([...])` é pacote separado, opcional e **fora da primeira fase**. O contrato de opções deve ser serializável (arrays/JSON) para facilitar esse adaptador.
