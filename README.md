# GestorFlow

GestorFlow é um sistema web de gestão pensado para MEIs, profissionais autônomos, microempresas e pequenos negócios que precisam organizar sua operação sem depender de sistemas caros, complexos ou difíceis de usar.

A proposta é combinar simplicidade, boa experiência de uso e uma interface visualmente agradável com uma arquitetura enxuta, modular e preparada para evoluir.

> **Princípio do produto:** organize seu negócio sem precisar aprender a usar um ERP.

## Objetivo do MVP

O MVP de portfólio demonstra uma experiência de produto completa, funcional e apresentável, com:

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

O MVP opera atualmente nos planos Free, com **custo obrigatório de infraestrutura de R$ 0/mês** enquanto respeitados os limites dos provedores.

Infraestrutura adotada:

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

**MVP de portfólio funcionalmente concluído.** GF-7A preparou a publicação, GF-7B publicou e validou a aplicação, e GF-7C registra o fechamento documental. Acesse [gestorflow.pages.dev](https://gestorflow.pages.dev/).

Há dois caminhos de acesso: **Explorar demonstração**, com dados locais descartáveis e CRUD funcional, e **Entrar** em uma conta existente, com Supabase Auth e dados privados persistidos no PostgreSQL. A demo dispensa configuração e permanece funcional sem Supabase, inclusive se o projeto remoto estiver pausado. Recarregar a página reinicia o dataset demo; alterações da demo não são enviadas à nuvem nem salvas no navegador. As datas das OS demo são geradas a partir do calendário local, mantendo conclusões e faturamento no mês corrente.

Na GF-6, o status da OS salva automaticamente com feedback de progresso, sucesso ou erro; a ação separada de conclusão pede confirmação. A interface apresenta o código `OS-…` e mantém o UUID nas rotas. A criação de OS orienta o cadastro do primeiro cliente e permite adicionar um cliente pelo formulário existente, retornando com a seleção pronta. Listas vazias, falhas de carregamento e layouts de 360, 390 e 768 px têm cobertura automatizada. A validação pública e a revisão visual humana encerraram essa etapa; o usuário também confirmou os fluxos no Moto G06 e o isolamento entre duas contas reais.

## Execução local

Requer Node.js 24 e npm:

```bash
npm ci
npm run dev
```

Para usar uma conta persistente, copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` com os valores públicos do projeto existente. A aplicação compila e a demo funciona sem essas variáveis. Nunca use service role, secret key ou senha do banco no frontend. `.env.local` não deve ser versionado.

`VITE_PUBLIC_SIGNUP_ENABLED` controla a apresentação do cadastro: por padrão ele está disponível no desenvolvimento local e indisponível no build de produção. O `.env.example` usa `false` como configuração conservadora; ao copiá-lo para testar cadastro local, mude a flag para `true`. Quando houver envio confiável de confirmação para visitantes e a configuração de Auth estiver validada, defina `true` no ambiente de produção do Pages e publique um novo build. Essa flag não bloqueia cadastro no servidor; qualquer restrição real de criação de contas deve ser avaliada separadamente nas configurações remotas do Supabase. O login de contas existentes e a demo permanecem disponíveis com a flag desligada. O SMTP padrão do Supabase não atende cadastro público irrestrito: limita destinatários aos endereços autorizados do projeto e tem limite de envio; não há SMTP pago configurado neste checkpoint.

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

O schema remoto existente está registrado em `supabase/migrations/20260923175233_gf4_initial_persistence_schema.sql` para versionamento e instalações futuras. Não aplique essa migration novamente ao projeto já configurado. Uma reconstrução em projeto novo requer a opção de RLS automático do Supabase, que cria a função `public.rls_auto_enable()` usada pela migration. RLS limita leitura, criação e atualização ao proprietário; o MVP não inclui exclusão. A UI usa repositories demo/Supabase sob contratos comuns e TanStack Query para consultas, mutations e invalidação. O dashboard deriva métricas, ordens recentes e atenção das ordens correntes, tanto na demo quanto em contas persistentes.

## Publicação: Cloudflare Pages (GF-7B)

O usuário publicou o frontend Vite estático no Cloudflare Pages com integração GitHub, branch `main`, comando `npm run build`, diretório de saída `dist` e Node.js 24. Endereço público: [https://gestorflow.pages.dev/](https://gestorflow.pages.dev/). A infraestrutura atual usa os planos Free do Cloudflare Pages e Supabase, sem custo obrigatório de infraestrutura enquanto o uso respeitar os limites dos provedores. O Supabase Free pode pausar por inatividade: a demo continua local, mas login e dados reais dependem da retomada do projeto.

O build não gera `404.html` de nível superior. O Pages serve o documento raiz para rotas SPA não correspondidas por arquivos, sem regra `_redirects`; assets do Vite continuam entregues pelos próprios caminhos. O componente interno de página não encontrada do React Router trata rotas que não pertencem à aplicação. Na validação humana do domínio público, a aplicação abriu, os botões de demonstração e login apareceram, a demo exibiu as ordens fictícias e a rota interna da OS-1048 funcionou. O usuário entrou na conta real pelo domínio público e recuperou registros previamente cadastrados; também testou os fluxos no Moto G06 e informou sucesso.

O `signUp` envia `emailRedirectTo` derivado da origem atual, sempre na rota raiz, sem parâmetro de destino fornecido pelo usuário. A validação acima não inclui uma nova verificação documental do fluxo de confirmação por e-mail ou de todas as recargas de rotas internas.

Na auditoria simulada com o papel `authenticated`, outra identidade não conseguiu consultar ou atualizar dados do proprietário. Depois, o usuário testou duas contas reais no aplicativo e confirmou que uma não conseguia visualizar nem editar dados da outra. A última inspeção do Supabase encontrou duas contas, dois clientes com proprietários distintos e duas ordens. O teste E2E da demo usa dados locais; a confirmação de isolamento real veio dos testes de contas e da auditoria, não desse E2E.

## Limitações conhecidas

- O cadastro público está oculto na interface de produção. `VITE_PUBLIC_SIGNUP_ENABLED` não desativa o cadastro no Supabase Auth; o controle de novos cadastros no servidor ainda precisa de revisão operacional.
- O SMTP padrão do Supabase é inadequado para cadastro público irrestrito.
- O Security Advisor apresenta aviso de proteção contra senhas vazadas desativada. Revisar disponibilidade e configuração sem contratar plano pago.
- O projeto Supabase Free está sujeito a pausa por inatividade e limites de uso; a demo local permanece independente do banco.
- O MVP não inclui DELETE, estoque, agenda, financeiro completo, PDF, anexos, WhatsApp, APK ou permissões avançadas.

## Licença

Ainda não definida.
