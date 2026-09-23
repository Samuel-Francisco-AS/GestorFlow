# GestorFlow

GestorFlow é um sistema web de gestão pensado para MEIs, profissionais autônomos, microempresas e pequenos negócios que precisam organizar sua operação sem depender de sistemas caros, complexos ou difíceis de usar.

A proposta é combinar simplicidade, boa experiência de uso e uma interface visualmente agradável com uma arquitetura enxuta, modular e preparada para evoluir.

> **Princípio do produto:** organize seu negócio sem precisar aprender a usar um ERP.

## Objetivo do MVP

O MVP deve demonstrar uma experiência de produto completa, funcional e apresentável como portfólio, com:

- dashboard de visão geral;
- cadastro e gerenciamento de clientes;
- ordens de serviço;
- busca e filtros essenciais;
- atualização de status;
- autenticação;
- persistência de dados;
- responsividade real para desktop e mobile;
- dados de demonstração prontos para uso.

A interface será orientada por:

- estética;
- simplicidade;
- responsividade;
- acessibilidade;
- baixa carga cognitiva;
- complexidade exibida apenas quando necessária.

## Público-alvo

O GestorFlow é pensado principalmente para:

- MEIs;
- profissionais autônomos;
- microempresas;
- pequenas empresas;
- prestadores de serviço;
- pequenos negócios em processo de organização ou digitalização.

## Direção visual

O produto busca uma estética de **SaaS operacional elegante**, evitando o visual genérico de dashboards excessivamente tecnológicos.

Diretrizes principais:

- fundo em off-white quente, inspirado em papel timbrado;
- superfícies claras;
- texto em grafite;
- verde petróleo como cor principal;
- acentos discretos em tons quentes;
- bordas sutis;
- poucas sombras;
- animações curtas e funcionais;
- interface limpa, mas nunca vazia.

## Stack planejada

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Motion
- Lucide
- React Hook Form
- Zod
- TanStack Query

### Backend e dados

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security

### Testes

- Vitest
- Playwright

### Deploy

O MVP deverá operar com **custo obrigatório de infraestrutura de R$ 0/mês**.

Estratégia inicial:

- Cloudflare Pages para o frontend;
- Supabase Free para backend e banco de dados;
- GitHub para versionamento e integração com o fluxo de deploy.

Serviços pagos ou upgrades só deverão ser considerados caso o projeto deixe de ser apenas uma demonstração de portfólio e passe a ter utilização real que justifique sua escalabilidade.

## Arquitetura

O GestorFlow seguirá um **monólito modular orientado por features**.

A interface não deverá depender diretamente do provedor de backend. O acesso a dados ficará atrás de uma camada própria, permitindo evoluir ou substituir a infraestrutura sem reconstruir a aplicação.

## Documentação

- [PRODUCT.md](./PRODUCT.md) — contrato de produto, escopo e experiência do MVP.
- [ARCHITECTURE.md](./ARCHITECTURE.md) — stack, estrutura, fronteiras e decisões técnicas.
- [STATUS.md](./STATUS.md) — estado atual, fases, gates e próximos passos.

## Escopo inicial

O MVP será deliberadamente limitado às funcionalidades essenciais para demonstrar o produto.

Ficam fora do MVP, entre outros:

- agenda;
- estoque;
- módulo financeiro completo;
- orçamentos como módulo separado;
- notificações;
- integrações externas;
- anexos;
- multiusuário avançado;
- relatórios configuráveis;
- inteligência artificial.

Essas funcionalidades poderão entrar em versões futuras sem fazer parte do compromisso inicial de prazo.

## Status

**Fase atual:** GF-2 — Gestão demonstrativa de clientes implementada; revisão visual pendente.

A página inicial apresenta indicadores e ordens fictícios de setembro de 2026. Em Clientes, é possível pesquisar, abrir fichas, cadastrar e editar registros. As alterações ficam apenas na memória da sessão e são perdidas ao recarregar a aplicação. A persistência real pertence à GF-4.

## Execução local

Requer Node.js 22.12+ e npm. Com Node.js 24 instalado:

```bash
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite. A página inicial é o dashboard demonstrativo. Clientes está disponível com dados mockados. A ação de criar ordem e o destino Ordens de serviço são apresentados como indisponíveis até GF-3.

```bash
npm run build
npm run lint
npm run typecheck
npm run test
npx playwright install chromium
npm run test:e2e
```

O último teste usa Chromium local e pode exigir bibliotecas de sistema no Linux. Nenhuma variável de ambiente ou serviço externo é necessária nesta fase.

## Licença

Ainda não definida.
