# AZ UI — Especificação Completa do Projeto

## 1. Visão do produto

Desenvolver uma biblioteca de interface chamada **AZ UI**, voltada à construção rápida de aplicações web profissionais, corporativas e enterprise.

A AZ UI deve ser mais do que uma coleção de estilos CSS. Deve funcionar como um pequeno ecossistema de desenvolvimento de interfaces, oferecendo:

- Design System próprio.
- Componentes visuais prontos.
- Componentes de formulários.
- API declarativa para criação de elementos.
- Sistema de classes utilitárias.
- Gerenciamento de temas.
- Tipografia e fontes próprias.
- Componentes interativos com JavaScript.
- Padrões de layout corporativo.
- Documentação com exemplos práticos.
- Distribuição por npm.

O principal objetivo é reduzir o tempo necessário para desenvolver interfaces, mantendo consistência visual, qualidade de código e aparência profissional.

### Filosofia

A AZ UI deve transmitir:

- Confiabilidade.
- Organização.
- Clareza.
- Maturidade visual.
- Consistência.
- Funcionalidade.
- Profissionalismo.

Não deve transmitir:

- Aparência de template genérico.
- Visual excessivamente futurista.
- Estética de interface gerada por IA.
- Excesso de gradientes.
- Excesso de sombras.
- Bordas arredondadas exageradas.
- Cards para absolutamente todas as informações.
- Botões gigantes sem necessidade.
- Ícones decorativos sem função.
- Animações excessivas.
- Interfaces com grandes espaços vazios e pouca informação útil.

A biblioteca deve priorizar interfaces utilizadas diariamente por profissionais em ambientes corporativos.

---

# 2. Tecnologias e arquitetura

### Stack principal

| Tecnologia | Responsabilidade |
|---|---|
| TypeScript | APIs e comportamento dos componentes |
| JavaScript nativo | Interações no navegador |
| CSS moderno | Estilização |
| Vite | Build e desenvolvimento |
| PostCSS | Processamento CSS |
| Vitest | Testes unitários |
| jsdom | Testes de DOM |
| VitePress | Documentação |
| npm | Distribuição |

Não utilizar Bootstrap, Tailwind, jQuery ou qualquer outro framework como dependência interna.

A AZ UI deve funcionar independentemente de frameworks.

Deve ser compatível com:

- HTML tradicional.
- PHP.
- Laravel Blade.
- Laminas MVC.
- React.
- Vue.
- Angular.
- Aplicações com Vite.
- Aplicações sem bundler, quando possível.

Não desenvolver adaptadores específicos para todos esses frameworks inicialmente. A compatibilidade deve vir da arquitetura independente.

### Estrutura inicial

```text
az-ui/
├── src/
│   ├── foundations/
│   │   ├── colors/
│   │   ├── typography/
│   │   ├── spacing/
│   │   ├── borders/
│   │   ├── shadows/
│   │   ├── breakpoints/
│   │   ├── motion/
│   │   └── z-index/
│   │
│   ├── styles/
│   │   ├── reset/
│   │   ├── utilities/
│   │   ├── layout/
│   │   ├── themes/
│   │   └── styles.css
│   │
│   ├── components/
│   │   ├── button/
│   │   ├── badge/
│   │   ├── alert/
│   │   ├── form/
│   │   ├── card/
│   │   ├── modal/
│   │   ├── dropdown/
│   │   ├── tabs/
│   │   ├── table/
│   │   └── ...
│   │
│   ├── javascript/
│   │   ├── core/
│   │   ├── dom/
│   │   ├── events/
│   │   └── index.ts
│   │
│   ├── api/
│   │   ├── form/
│   │   ├── components/
│   │   └── index.ts
│   │
│   └── index.ts
│
├── fonts/
├── docs/
├── examples/
├── tests/
├── scripts/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
├── README.md
└── LICENSE
```

A estrutura pode ser ajustada durante a implementação, desde que as responsabilidades permaneçam separadas.

---

# 3. Design System e identidade visual

A AZ UI precisa ter um sistema visual próprio, com tokens centralizados e reutilizáveis.

## 3.1 Direção visual

Adotar uma identidade visual corporativa moderna, inspirada em produtos empresariais maduros.

Características:

- Superfícies claras e neutras.
- Fundo de aplicação levemente acinzentado.
- Branco para áreas de conteúdo.
- Azul profundo como cor primária.
- Cores semânticas discretas.
- Bordas finas e consistentes.
- Sombras sutis.
- Cantos discretamente arredondados.
- Hierarquia tipográfica objetiva.
- Densidade informacional equilibrada.

Evitar transformar todos os elementos em cards.

Uma interface enterprise deve saber utilizar tabelas, divisores, agrupamentos, cabeçalhos e espaços em branco sem depender de caixas decorativas.

## 3.2 Paleta inicial

Criar tokens configuráveis:

```css
:root {
    --az-color-primary: #23415C;
    --az-color-primary-hover: #1B344A;

    --az-color-secondary: #64748B;

    --az-color-success: #16845B;
    --az-color-warning: #B7791F;
    --az-color-danger: #C0392B;
    --az-color-info: #2874A6;

    --az-color-background: #F5F7F9;
    --az-color-surface: #FFFFFF;
    --az-color-surface-muted: #F8FAFC;

    --az-color-border: #DCE2E8;
    --az-color-border-strong: #C5CED8;

    --az-text-primary: #263445;
    --az-text-secondary: #687586;
    --az-text-muted: #8A96A5;
    --az-text-inverse: #FFFFFF;
}
```

Não utilizar essas cores diretamente dentro de cada componente. Todos os componentes devem consumir tokens.

Criar também escalas para:

- Primary.
- Secondary.
- Success.
- Warning.
- Danger.
- Info.
- Gray.

Cada escala deve possuir tonalidades suficientes para estados, fundos, bordas e textos.

## 3.3 Bordas e espaçamentos

```css
:root {
    --az-radius-none: 0;
    --az-radius-sm: 4px;
    --az-radius-md: 6px;
    --az-radius-lg: 8px;

    --az-spacing-1: 4px;
    --az-spacing-2: 8px;
    --az-spacing-3: 12px;
    --az-spacing-4: 16px;
    --az-spacing-5: 20px;
    --az-spacing-6: 24px;
    --az-spacing-8: 32px;
    --az-spacing-10: 40px;

    --az-shadow-sm: 0 1px 2px rgba(15, 23, 42, .05);
    --az-shadow-md: 0 4px 12px rgba(15, 23, 42, .08);
}
```

Criar tokens adicionais para:

- Altura de controles.
- Larguras máximas.
- Camadas de sobreposição.
- Breakpoints.
- Transições.
- Foco.
- Opacidade.

Não utilizar valores aleatórios repetidos nos componentes.

---

# 4. Tipografia e gerenciamento de fontes

A tipografia será uma das principais responsáveis pela identidade da AZ UI.

Não utilizar uma fonte escolhida aleatoriamente em cada projeto.

A biblioteca deve disponibilizar uma família padrão e alternativas opcionais.

## 4.1 Fontes oficiais

Implementar suporte às seguintes famílias:

| Fonte | Utilização |
|---|---|
| Inter | Fonte padrão da AZ UI |
| IBM Plex Sans | Alternativa corporativa |
| Source Sans 3 | Alternativa para aplicações administrativas |
| System UI | Alternativa sem download de fontes |

A escolha padrão será **Inter**.

A IBM Plex Sans será uma alternativa especialmente interessante para sistemas com grande quantidade de informações.

A Source Sans 3 deve ser disponibilizada como outra opção de personalização.

## 4.2 Distribuição das fontes

Disponibilizar as fontes em formato WOFF2.

Organização sugerida:

```text
fonts/
├── inter/
│   ├── inter-regular.woff2
│   ├── inter-medium.woff2
│   ├── inter-semibold.woff2
│   └── inter-bold.woff2
│
├── ibm-plex-sans/
│   ├── ibm-plex-sans-regular.woff2
│   ├── ibm-plex-sans-medium.woff2
│   ├── ibm-plex-sans-semibold.woff2
│   └── ibm-plex-sans-bold.woff2
│
└── source-sans-3/
    ├── source-sans-3-regular.woff2
    ├── source-sans-3-medium.woff2
    ├── source-sans-3-semibold.woff2
    └── source-sans-3-bold.woff2
```

Não baixar arquivos de fontes sem verificar a licença de redistribuição.

Incluir os respectivos arquivos de licença no repositório.

Não carregar todas as famílias automaticamente.

A fonte padrão deve ser carregada quando o CSS principal for utilizado. As alternativas devem possuir imports próprios.

## 4.3 CSS das fontes

Exemplo:

```css
@font-face {
    font-family: "AZ Inter";
    src: url("./fonts/inter/inter-regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: "AZ Inter";
    src: url("./fonts/inter/inter-medium.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: "AZ Inter";
    src: url("./fonts/inter/inter-semibold.woff2") format("woff2");
    font-weight: 600;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: "AZ Inter";
    src: url("./fonts/inter/inter-bold.woff2") format("woff2");
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}
```

O build precisa preservar os caminhos dos arquivos e garantir que os imports funcionem após a publicação no npm.

## 4.4 Tokens tipográficos

```css
:root {
    --az-font-family: "AZ Inter", Inter, system-ui, sans-serif;

    --az-font-size-xs: 0.75rem;
    --az-font-size-sm: 0.8125rem;
    --az-font-size-md: 0.875rem;
    --az-font-size-base: 0.9375rem;
    --az-font-size-lg: 1.125rem;
    --az-font-size-xl: 1.25rem;
    --az-font-size-2xl: 1.5rem;

    --az-font-weight-normal: 400;
    --az-font-weight-medium: 500;
    --az-font-weight-semibold: 600;
    --az-font-weight-bold: 700;

    --az-line-height-tight: 1.25;
    --az-line-height-normal: 1.5;
    --az-line-height-relaxed: 1.65;
}
```

A tipografia deve ser apropriada para sistemas corporativos.

Não utilizar títulos gigantes ou textos exageradamente destacados.

O tamanho padrão de texto deve ser confortável para leitura, considerando que muitos sistemas enterprise possuem tabelas e formulários extensos.

## 4.5 Personalização

Permitir que o projeto consumidor altere a família tipográfica:

```css
:root {
    --az-font-family: "IBM Plex Sans", sans-serif;
}
```

Criar classes e imports específicos para as alternativas.

Exemplo esperado:

```ts
import "@codebyazeredo/az-ui/styles.css";
import "@codebyazeredo/az-ui/fonts/ibm-plex-sans.css";
```

O sistema deve permitir também utilizar uma fonte externa ou já instalada, sem exigir os arquivos da AZ UI.

---

# 5. API declarativa de componentes

Este é um dos pontos mais importantes do projeto.

A AZ UI deve oferecer uma API simples para construir elementos, principalmente formulários.

A experiência deve ser inspirada na praticidade de bibliotecas como Laravel Collective.

O desenvolvedor não deve precisar escrever repetidamente estruturas HTML extensas para criar um input, select, botão ou outro elemento comum.

A API deve ser previsível, tipada e extensível.

## 5.1 API de formulários

A interface pública deve permitir algo semelhante a:

```ts
AZUI.Form.input({
    type: "text",
    name: "nome",
    label: "Nome completo",
    placeholder: "Digite o nome",
    required: true
});
```

Também oferecer métodos especializados:

```ts
AZUI.Form.text({
    name: "nome",
    label: "Nome completo"
});

AZUI.Form.email({
    name: "email",
    label: "E-mail"
});

AZUI.Form.password({
    name: "senha",
    label: "Senha"
});

AZUI.Form.number({
    name: "idade",
    label: "Idade"
});

AZUI.Form.date({
    name: "data_nascimento",
    label: "Data de nascimento"
});

AZUI.Form.textarea({
    name: "observacao",
    label: "Observações",
    rows: 4
});

AZUI.Form.select({
    name: "status",
    label: "Status",
    options: [
        { value: "active", label: "Ativo" },
        { value: "inactive", label: "Inativo" }
    ]
});

AZUI.Form.checkbox({
    name: "ativo",
    label: "Registro ativo"
});

AZUI.Form.radio({
    name: "tipo",
    label: "Pessoa física",
    value: "fisica"
});

AZUI.Form.switch({
    name: "notificacoes",
    label: "Receber notificações"
});
```

Os métodos devem compartilhar uma estrutura de configuração consistente.

## 5.2 Propriedades comuns dos campos

Todos os campos devem aceitar, quando aplicável:

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

Criar interfaces específicas para cada componente quando suas propriedades forem diferentes.

Não utilizar uma única interface genérica para todos os componentes se isso prejudicar a tipagem.

## 5.3 Retorno da API

Os métodos devem permitir gerar elementos HTML sem depender de frameworks.

A API pode retornar um `HTMLElement`, permitindo:

```ts
const input = AZUI.Form.input({
    type: "text",
    name: "nome",
    label: "Nome"
});

document.querySelector("#formulario")?.append(input);
```

Também deve existir uma forma de gerar markup HTML quando isso for útil para integrações com templates:

```ts
const html = AZUI.Form.render({
    type: "text",
    name: "nome",
    label: "Nome"
});
```

O método `render()` deve ser seguro e não permitir injeção de HTML por valores fornecidos pelo usuário.

O comportamento precisa ser documentado com clareza.

Não criar APIs duplicadas sem necessidade.

## 5.4 Agrupamento de campos

Disponibilizar uma forma consistente de criar grupos de campos:

```ts
AZUI.Form.group({
    label: "Informações pessoais",
    fields: [
        AZUI.Form.text({
            name: "nome",
            label: "Nome"
        }),
        AZUI.Form.email({
            name: "email",
            label: "E-mail"
        })
    ]
});
```

O agrupamento deve gerar uma estrutura semântica e visualmente consistente.

## 5.5 Compatibilidade com PHP

A arquitetura deve permitir futuramente uma integração opcional com PHP.

Exemplo de API desejada:

```php
AZForm::text([
    'name' => 'nome',
    'label' => 'Nome completo',
    'required' => true,
]);

AZForm::email([
    'name' => 'email',
    'label' => 'E-mail',
]);

AZForm::select([
    'name' => 'status',
    'label' => 'Status',
    'options' => $statusOptions,
]);
```

Essa integração não deve fazer parte obrigatória do núcleo JavaScript.

Deve ser um pacote ou adaptador separado, preservando a independência da biblioteca.

Não implementar esse adaptador na primeira fase.

---

# 6. Componentes preparados

A AZ UI precisa entregar componentes que possam ser utilizados imediatamente em aplicações reais.

Cada componente deve possuir:

- HTML semântico.
- Estilização própria.
- Variações.
- Estados.
- Responsividade.
- Acessibilidade.
- Documentação.
- Exemplos.
- Testes.
- API JavaScript quando necessário.

## 6.1 Componentes básicos

Implementar:

| Componente | Recursos |
|---|---|
| Button | Primário, secundário, outline, ghost, danger, loading |
| Badge | Status, categorias, cores semânticas |
| Alert | Success, warning, danger, info |
| Spinner | Indicador de carregamento |
| Skeleton | Placeholder de carregamento |
| Divider | Separadores horizontais e verticais |
| Avatar | Imagem, iniciais e tamanhos |
| Card | Header, body e footer opcionais |
| Tooltip | Informações auxiliares |
| Progress | Barra de progresso |
| Empty State | Estados sem registros |
| Breadcrumb | Navegação hierárquica |

## 6.2 Formulários

Os formulários devem receber atenção especial.

Implementar:

- Input text.
- Input email.
- Input password.
- Input number.
- Input search.
- Input date.
- Input datetime-local.
- Input time.
- Input file.
- Textarea.
- Select.
- Multi-select.
- Checkbox.
- Radio.
- Switch.
- Range.
- Input group.
- Input com ícone.
- Input com prefixo e sufixo.
- Campo com contador de caracteres.
- Campo com validação.
- Campo com mensagem de ajuda.
- Campo com mensagem de erro.

Todos devem seguir os mesmos padrões de espaçamento, tipografia, altura e estados.

Estados obrigatórios:

- Default.
- Hover.
- Focus.
- Disabled.
- Readonly.
- Invalid.
- Valid.
- Loading, quando aplicável.

Não desenvolver validação de negócio dentro dos componentes. A biblioteca deve oferecer apresentação de erros e integração com a validação do projeto consumidor.

## 6.3 Componentes interativos

Implementar:

- Modal.
- Dropdown.
- Popover.
- Tabs.
- Accordion.
- Offcanvas.
- Toast.
- Notification.
- Datepicker.
- Command Menu.
- Context Menu.

Esses componentes devem possuir gerenciamento correto de eventos, foco, teclado e ciclo de vida.

## 6.4 Componentes de dados

Sistemas enterprise trabalham com grandes volumes de informação.

Implementar:

- Table.
- DataTable.
- Pagination.
- Sortable Table.
- Filter.
- Search.
- Table Actions.
- Row Selection.
- Empty State.
- Loading State.
- Status Indicator.
- Timeline.
- Stat.
- Key Value.
- List Group.

A DataTable deve ser pensada para cenários corporativos, oferecendo:

- Ordenação.
- Paginação.
- Seleção de registros.
- Colunas configuráveis.
- Estados de carregamento.
- Estado vazio.
- Ações por linha.
- Responsividade.
- Integração com dados externos.

Não obrigar a biblioteca a controlar a busca ou paginação no servidor. A arquitetura deve permitir que o projeto consumidor controle essas operações.

## 6.5 Componentes de layout

Implementar:

- Container.
- Grid.
- Row.
- Column.
- Stack.
- Flex.
- Page Header.
- Toolbar.
- Navbar.
- Sidebar.
- Navigation Menu.
- Breadcrumb.
- Content Section.
- Split Layout.

Esses componentes devem ajudar a construir sistemas completos, não apenas elementos isolados.

---

# 7. Classes utilitárias

A AZ UI deve oferecer classes utilitárias para agilizar o desenvolvimento.

Todas devem utilizar o prefixo `az-`.

Não tentar reproduzir integralmente o Tailwind.

Implementar apenas classes que tragam produtividade real.

### Display

```css
.az-d-none
.az-d-block
.az-d-inline
.az-d-inline-block
.az-d-flex
.az-d-grid
```

### Flexbox

```css
.az-flex-row
.az-flex-column
.az-flex-wrap
.az-flex-nowrap
.az-justify-start
.az-justify-center
.az-justify-between
.az-justify-end
.az-align-start
.az-align-center
.az-align-end
```

### Espaçamento

```css
.az-m-0
.az-m-1
.az-m-2
.az-m-3
.az-m-4

.az-mt-1
.az-mt-2
.az-mt-3
.az-mb-1
.az-mb-2
.az-mb-3

.az-p-1
.az-p-2
.az-p-3
.az-p-4

.az-px-2
.az-px-3
.az-py-2
.az-py-3

.az-gap-1
.az-gap-2
.az-gap-3
.az-gap-4
```

### Tipografia

```css
.az-text-primary
.az-text-secondary
.az-text-muted
.az-text-success
.az-text-danger
.az-text-warning

.az-text-left
.az-text-center
.az-text-right

.az-fw-normal
.az-fw-medium
.az-fw-semibold
.az-fw-bold

.az-text-sm
.az-text-md
.az-text-lg
```

### Bordas

```css
.az-border
.az-border-0
.az-border-top
.az-border-bottom

.az-rounded-sm
.az-rounded-md
.az-rounded-lg
```

### Dimensões

```css
.az-w-100
.az-w-auto
.az-h-100
.az-h-auto
.az-min-w-0
```

### Background

```css
.az-bg-surface
.az-bg-muted
.az-bg-primary
.az-bg-success
.az-bg-warning
.az-bg-danger
```

### Responsividade

Permitir modificadores responsivos para os utilitários mais utilizados.

Exemplo:

```html
<div class="az-d-block az-md-d-flex">
```

A sintaxe final deve ser consistente e documentada.

---

# 8. JavaScript e comportamento dos componentes

A biblioteca deve utilizar JavaScript nativo e TypeScript.

Não utilizar jQuery.

A arquitetura JavaScript deve oferecer:

- Inicialização manual.
- Inicialização automática quando configurada.
- Event delegation quando apropriado.
- Controle de eventos.
- Prevenção de inicialização duplicada.
- Destruição de instâncias.
- Compatibilidade com conteúdo inserido dinamicamente.
- Gerenciamento de estado interno quando necessário.
- APIs públicas previsíveis.

Exemplo de API:

```ts
import { Modal } from "@codebyazeredo/az-ui";

const modal = new Modal("#modal");

modal.show();
modal.hide();
modal.destroy();
```

Exemplo de utilização via HTML:

```html
<button
    class="az-btn az-btn-primary"
    data-az-toggle="modal"
    data-az-target="#modal">
    Abrir modal
</button>
```

A biblioteca deve documentar quando utilizar atributos HTML e quando utilizar a API programática.

Não depender de variáveis globais obrigatórias.

Se oferecer uma API global, disponibilizá-la como opção separada.

---

# 9. Temas e personalização

Implementar inicialmente:

- Tema claro.
- Tema escuro.

Permitir alteração por atributo:

```html
<html data-az-theme="light">
```

Ou:

```html
<html data-az-theme="dark">
```

O sistema deve utilizar CSS Custom Properties.

Permitir que o projeto consumidor sobrescreva tokens sem precisar alterar arquivos internos.

A biblioteca não deve forçar cores, tipografia ou estilos em elementos que não pertencem a ela.

Evitar seletores globais invasivos.

---

# 10. Padrões enterprise de interface

Este tópico é fundamental para a identidade da AZ UI.

Os componentes devem ser projetados para interfaces utilizadas durante várias horas por dia.

## 10.1 Hierarquia

Utilizar hierarquia visual clara:

- Título da página.
- Descrição contextual, quando necessária.
- Ações principais.
- Filtros.
- Conteúdo.
- Informações complementares.

Não criar grandes cabeçalhos decorativos.

## 10.2 Densidade informacional

Oferecer tamanhos compactos e confortáveis.

Especialmente para:

- Tabelas.
- Formulários.
- Listagens.
- Menus.
- Barras de ferramentas.

Não desperdiçar espaço vertical.

## 10.3 Cards

Cards devem ser utilizados quando existe uma separação lógica de conteúdo.

Não envolver cada seção em um card apenas por estética.

## 10.4 Cores

Utilizar cores com significado.

- Verde: sucesso e situação positiva.
- Amarelo: atenção.
- Vermelho: erro e situação crítica.
- Azul: informação e ação primária.
- Cinza: informações neutras.

Não utilizar cores vibrantes em excesso.

## 10.5 Ícones

Preparar uma estratégia consistente para ícones.

Preferencialmente utilizar uma biblioteca de ícones leve, com imports específicos e sem dependência de fontes de ícones pesadas.

Os ícones devem ser funcionais, discretos e visualmente consistentes.

Não criar ícones decorativos sem necessidade.

## 10.6 Microinterações

Utilizar transições discretas para:

- Hover.
- Focus.
- Abertura de modal.
- Expansão de menus.
- Feedback de ações.
- Estados de carregamento.

Respeitar `prefers-reduced-motion`.

Evitar animações chamativas.

---

# 11. Acessibilidade

Adotar WCAG 2.2 nível AA como objetivo.

Todos os componentes devem considerar:

- Navegação por teclado.
- Indicadores de foco.
- Contraste adequado.
- HTML semântico.
- Labels associados aos campos.
- Estados acessíveis.
- ARIA somente quando necessário.
- Gerenciamento de foco.
- Leitores de tela.
- Navegação em modais.
- Escape para fechar componentes apropriados.
- Respeito à preferência de movimento reduzido.

Acessibilidade não deve ser adicionada posteriormente como correção. Deve fazer parte da implementação de cada componente.

---

# 12. Distribuição npm

O pacote principal será:

```bash
npm install @codebyazeredo/az-ui
```

Também deve funcionar com pnpm, yarn e bun.

Preparar exports públicos para:

```ts
import "@codebyazeredo/az-ui/styles.css";

import {
    AZUI,
    Button,
    Modal,
    DataTable
} from "@codebyazeredo/az-ui";
```

Preparar também imports específicos quando fizer sentido:

```ts
import "@codebyazeredo/az-ui/fonts/ibm-plex-sans.css";
```

O `package.json` deve contemplar:

- name.
- version.
- description.
- license.
- exports.
- main.
- module.
- types.
- files.
- sideEffects.

O build deve produzir:

- ESM.
- CommonJS, se necessário para compatibilidade.
- Declarações TypeScript.
- CSS distribuível.
- Arquivos de fontes.
- Imports individuais.

Evitar publicar arquivos de desenvolvimento desnecessários.

O pacote é publicado como `@codebyazeredo/az-ui` (D-065): o nome `az-ui` foi recusado pelo npm por similaridade com `azui`.

Não publicar automaticamente.

---

# 13. Documentação

Utilizar VitePress.

A documentação deve possuir:

1. Introdução.
2. Instalação.
3. Primeiros passos.
4. Design System.
5. Cores.
6. Tipografia.
7. Fontes.
8. Espaçamentos.
9. Temas.
10. Componentes.
11. Formulários.
12. API JavaScript.
13. Classes utilitárias.
14. Layouts.
15. Acessibilidade.
16. Personalização.
17. Integração com PHP.
18. Integração com frameworks.
19. Migração e versionamento.

Cada componente deve apresentar:

- Descrição.
- Exemplo visual.
- Código HTML.
- Código TypeScript, quando aplicável.
- Propriedades.
- Variações.
- Estados.
- Acessibilidade.
- Observações de utilização.

Criar um catálogo visual interativo para demonstrar os componentes.

A documentação também deve servir como referência de identidade visual para quem utiliza a biblioteca.

---

# 14. Testes e qualidade

Utilizar Vitest e jsdom.

Cada componente deve ter testes para:

- Renderização.
- Propriedades.
- Estados.
- Eventos.
- Acessibilidade básica.
- Destruição de instâncias.
- Prevenção de duplicidade.
- Comportamento de teclado, quando aplicável.

Testar também:

- Exports.
- Build.
- Imports CSS.
- Imports de fontes.
- Tipagem TypeScript.
- Compatibilidade da API declarativa.

Não adicionar testes artificiais apenas para aumentar cobertura.

Priorizar testes que comprovem comportamento real.

---

# 15. Roadmap de desenvolvimento

A implementação deve ser dividida em etapas.

## Fase 1 — Fundação

- Configuração do projeto.
- TypeScript.
- Vite.
- Estrutura de diretórios.
- Tokens de cores.
- Tokens tipográficos.
- Gerenciamento de fontes.
- Reset CSS.
- Temas.
- Utilitários CSS.
- Build inicial.

## Fase 2 — Componentes básicos

- Button.
- Badge.
- Alert.
- Spinner.
- Skeleton.
- Divider.
- Card.
- Avatar.
- Formulários básicos.
- API declarativa de formulários.

## Fase 3 — Componentes interativos

- Modal.
- Dropdown.
- Tooltip.
- Popover.
- Tabs.
- Toast.
- Accordion.
- Offcanvas.
- Datepicker.

## Fase 4 — Dados e componentes avançados

- Table.
- DataTable.
- Pagination.
- Filter.
- Timeline.
- Progress.
- Empty State.
- Stat.
- Toolbar.

## Fase 5 — Layouts

- Container.
- Grid.
- Stack.
- Sidebar.
- Navbar.
- Page Header.
- Navigation Menu.

## Fase 6 — Documentação

- VitePress.
- Catálogo de componentes.
- Exemplos.
- Guia de instalação.
- API.
- Personalização.

## Fase 7 — Distribuição

- Build de produção.
- Testes finais.
- Versionamento semântico.
- Preparação do pacote.
- Publicação npm mediante autorização.

---

# 16. Regras obrigatórias para a implementação

1. Desenvolver a biblioteca incrementalmente.
2. Não tentar implementar todas as fases de uma vez.
3. Começar pela Fase 1.
4. Não implementar componentes futuros antecipadamente.
5. Não instalar dependências sem justificativa.
6. Não utilizar Bootstrap ou Tailwind internamente.
7. Não utilizar jQuery.
8. Não criar abstrações desnecessárias.
9. Não duplicar estilos e comportamentos.
10. Não misturar lógica de componentes com configurações globais.
11. Não utilizar estilos globais invasivos.
12. Não comprometer a acessibilidade.
13. Não adicionar funcionalidades que não foram solicitadas.
14. Não criar servidores, bancos de dados ou infraestrutura desnecessária.
15. Não publicar no npm sem autorização.
16. Não utilizar fontes sem verificar suas licenças.
17. Não carregar todas as famílias tipográficas por padrão.
18. Não criar uma interface visual genérica com aparência de IA.
19. Priorizar legibilidade, simplicidade e baixo acoplamento.
20. Manter a documentação atualizada conforme as APIs forem implementadas.

## 17. Critérios de identidade visual

Antes de considerar qualquer componente concluído, avaliar:

- Ele parece pertencer a um sistema corporativo?
- É visualmente consistente com os demais componentes?
- Funciona bem em interfaces com grande quantidade de dados?
- Possui hierarquia visual clara?
- Evita excesso de decoração?
- Tem estados bem definidos?
- É acessível?
- É fácil de personalizar?
- É fácil de utilizar?

Não aprovar componentes apenas porque estão visualmente bonitos em uma demonstração isolada.

Eles precisam funcionar bem em aplicações reais.

---

# 18. Primeira tarefa da IA

Comece exclusivamente pela **Fase 1 — Fundação**.

Antes de implementar:

1. Apresente uma análise breve da arquitetura proposta.
2. Identifique eventuais inconsistências técnicas.
3. Proponha a estrutura final de diretórios.
4. Defina como os tokens, fontes e estilos serão distribuídos no npm.
5. Defina a estratégia para os imports públicos.

Depois, implemente a fundação.

Ao finalizar, apresentar:

- Arquivos criados.
- Arquivos modificados.
- Funcionalidades implementadas.
- Dependências adicionadas e justificativas.
- Testes executados.
- Pendências.
- Próxima etapa recomendada.

Não avançar para a Fase 2 sem validação da fundação.