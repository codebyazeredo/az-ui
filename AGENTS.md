# AGENTS.md — AZ UI

## Identidade do projeto

AZ UI é uma biblioteca de componentes e Design System voltada à construção de aplicações web corporativas, administrativas, gerenciais e enterprise.

O objetivo é facilitar o desenvolvimento de interfaces profissionais por meio de componentes reutilizáveis, APIs declarativas, estilos consistentes e ferramentas independentes de frameworks.

Pacote npm: `az-ui`.

Prefixo CSS: `az-`.

Namespace JavaScript: `AZUI`.

## Antes de desenvolver

Antes de realizar qualquer alteração:

1. Leia este arquivo.
2. Leia `.ai/conventions/mandatory-rules.md`.
3. Consulte `.ai/development/roadmap.md` para saber a fase atual e o que está permitido.
4. Consulte `.ai/development/open-questions.md` e `.ai/development/decisions.md`.
5. Consulte as convenções específicas da tecnologia ou componente envolvido (`.ai/README.md` indica quais).
6. Consulte a arquitetura existente em `.ai/architecture/`.
7. Verifique se já existe uma implementação semelhante.
8. Respeite os padrões e decisões já estabelecidos.

Não presuma que uma funcionalidade precisa ser criada antes de verificar se já existe.

A visão completa do produto está em `.ai/specifications.md`.

## Regras fundamentais

- Implementar somente o escopo solicitado.
- Trabalhar uma fase por vez, na ordem do roadmap.
- Não modificar arquivos não relacionados à tarefa.
- Não criar funcionalidades adicionais por iniciativa própria.
- Não adicionar dependências sem justificativa técnica.
- Não utilizar Bootstrap, Tailwind ou jQuery no núcleo.
- Não introduzir dependência obrigatória de frameworks.
- Não duplicar componentes, estilos ou comportamentos.
- Não criar abstrações prematuras.
- Não misturar responsabilidades.
- Não comprometer acessibilidade.
- Não utilizar estilos globais invasivos.
- Não alterar APIs públicas sem avaliar compatibilidade.
- Não publicar pacotes sem autorização explícita.
- Não escrever comentários no código; só quando for extremamente necessário para o entendimento.
- Escrever em inglês tudo que não seja instrução para IA: código, nomes, mensagens, testes, exemplos, README, CHANGELOG, docs, commits e PRs. `AGENTS.md`, `CLAUDE.md` e `.ai/` permanecem em português.
- Não instalar dependências, executar build/testes/servidores nem usar git sem autorização do mantenedor.

## Identidade visual

A AZ UI deve possuir aparência enterprise.

Priorizar:

- Sobriedade visual.
- Clareza.
- Consistência.
- Densidade informacional adequada.
- Hierarquia tipográfica.
- Bordas discretas.
- Sombras moderadas.
- Componentes funcionais.
- Espaçamentos consistentes.

Evitar:

- Aparência genérica de SaaS.
- Estética de interface gerada por IA.
- Gradientes decorativos.
- Glassmorphism indiscriminado.
- Cards desnecessários.
- Bordas excessivamente arredondadas.
- Animações exageradas.
- Elementos decorativos sem função.

Consultar `.ai/design-system/` antes de desenvolver componentes visuais.

## Arquitetura

A biblioteca deve manter separação entre:

- Foundations.
- Design System.
- Componentes.
- Estilos.
- Comportamentos JavaScript.
- APIs declarativas.
- Documentação.

Os componentes devem ser independentes e reutilizáveis.

## API pública

Todas as APIs públicas devem ser:

- Consistentes.
- Tipadas.
- Documentadas.
- Previsíveis.
- Independentes de frameworks.

A API declarativa de formulários é um dos principais diferenciais da AZ UI.

Consultar `.ai/architecture/form-api.md` antes de modificar essa API.

## Processo de desenvolvimento

1. Entender o problema.
2. Consultar as convenções.
3. Identificar o menor escopo necessário.
4. Implementar a solução.
5. Executar os testes pertinentes (mediante autorização).
6. Atualizar a documentação quando necessário.
7. Atualizar o controle: `roadmap.md`, `decisions.md`, `open-questions.md`, `CHANGELOG.md`.
8. Apresentar um resumo das alterações.

Detalhes em `.ai/development/implementation-workflow.md`.

Não criar servidores, bancos de dados, ambientes ou infraestrutura sem necessidade explícita.

## Documentação

Toda funcionalidade pública deve possuir documentação correspondente.

Não documentar funcionalidades que ainda não existem como se estivessem implementadas.

## Critério de qualidade

O código deve ser simples, legível, previsível e sustentável.

Priorizar a menor implementação que resolva corretamente o problema, sem comprometer a arquitetura.

A AZ UI deve ser tratada como uma biblioteca de software que será utilizada e mantida por outros desenvolvedores, não como um projeto de demonstração.
