
# GestorFlow

GestorFlow é um sistema web de gestão pensado para MEIs, profissionais autônomos, microempresas e pequenos negócios que precisam organizar sua operação sem depender de sistemas caros, complexos ou difíceis de usar.

A proposta do projeto é combinar simplicidade, boa experiência de uso e uma interface visualmente agradável com uma arquitetura enxuta, modular e preparada para evoluir.

## Objetivo do MVP

O MVP terá foco em demonstrar uma experiência de produto completa e funcional, com:

- dashboard de visão geral;
- cadastro e gerenciamento de clientes;
- ordens de serviço;
- busca e filtros;
- atualização de status;
- autenticação;
- persistência de dados;
- responsividade para desktop e mobile;
- dados de demonstração prontos para uso.

A interface será orientada pelos seguintes princípios:

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

A identidade visual deverá utilizar:

- fundo em off-white quente, inspirado em papel timbrado;
- superfícies claras;
- texto em grafite;
- verde petróleo como cor principal;
- acentos discretos em tons quentes;
- bordas sutis;
- poucas sombras;
- animações curtas e funcionais;
- interface limpa, porém sem aparência vazia.

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

A estratégia inicial prevê serviços com camada gratuita, como:

- Cloudflare Pages para o frontend;
- Supabase Free para backend e banco de dados;
- GitHub para versionamento e integração com o fluxo de deploy.

Serviços pagos ou upgrades só deverão ser considerados caso o projeto deixe de ser apenas uma demonstração de portfólio e passe a ter utilização real que justifique sua escalabilidade.

## Arquitetura

O GestorFlow seguirá uma arquitetura de **monólito modular orientado por features**.

O objetivo é manter o MVP simples e rápido de desenvolver, sem impedir a evolução futura do sistema.

A aplicação deverá evitar acoplamento direto entre a interface e o provedor de backend, utilizando uma camada de acesso a dados que permita substituir ou evoluir a infraestrutura futuramente sem necessidade de reconstrução da interface.

## Escopo inicial

O MVP será limitado às funcionalidades essenciais para demonstrar o produto.

Funcionalidades como:

- agenda;
- estoque;
- módulo financeiro completo;
- orçamentos;
- notificações;
- integrações externas;
- anexos;
- multiusuário avançado;
- relatórios;
- inteligência artificial;

ficarão fora do escopo inicial e poderão ser adicionadas futuramente.

## Status

**Fase atual:** pré-desenvolvimento / definição inicial.

Próximos passos:

1. consolidar documentação de produto;
2. definir arquitetura detalhada;
3. estabelecer design system;
4. iniciar a fundação técnica;
5. construir o shell visual do MVP.

## Licença

Ainda não definida.