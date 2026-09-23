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

**Fase atual:** GF-7A — preparação técnica para publicação. **Próxima fase:** GF-7B — deploy e validação. O site ainda não foi publicado.

Há dois caminhos de acesso: **Explorar demonstração**, com dados locais descartáveis e CRUD funcional, e **Entrar** em uma conta existente, com Supabase Auth e dados privados persistidos no PostgreSQL. A demo dispensa configuração e permanece funcional sem Supabase, inclusive se o projeto remoto estiver pausado. Recarregar a página reinicia o dataset demo; alterações da demo não são enviadas à nuvem nem salvas no navegador. As datas das OS demo são geradas a partir do calendário local, mantendo conclusões e faturamento no mês corrente.

Na GF-6, o status da OS salva automaticamente com feedback de progresso, sucesso ou erro; a ação separada de conclusão pede confirmação. A interface apresenta o código `OS-…` e mantém o UUID nas rotas. A criação de OS orienta o cadastro do primeiro cliente e permite adicionar um cliente pelo formulário existente, retornando com a seleção pronta. Listas vazias, falhas de carregamento e layouts de 360, 390 e 768 px têm cobertura automatizada. A revisão visual humana, o teste de isolamento entre duas contas e a validação física no Moto G06 seguem pendentes; esta última aguarda acesso pela internet. Não houve publicação pública.

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

## Publicação planejada: Cloudflare Pages (GF-7B)

O frontend Vite é estático. Na integração Git com este repositório, usar branch de produção `main`, comando `npm run build`, diretório de saída `dist` e Node.js 24 (fixado em `.node-version`; também pode ser configurado como `NODE_VERSION=24`). O build funciona sem variáveis Supabase e mantém a demo acessível. Antes de publicar a conta persistente, configurar `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` nas variáveis **de produção** do Pages, com valores públicos do projeto existente, e manter `VITE_PUBLIC_SIGNUP_ENABLED=false`. Nenhuma credencial administrativa pertence ao build. A solução prevista usa apenas os planos gratuitos do Cloudflare Pages e Supabase; respeitar os limites desses planos mantém o custo obrigatório em R$ 0/mês. O Supabase Free pode pausar por inatividade: a demo continua local, mas login e dados reais dependem da retomada do projeto.

O build não gera `404.html` de nível superior. O Pages então serve o documento raiz para rotas SPA não correspondidas por arquivos, sem regra `_redirects`; assets do Vite continuam entregues pelos próprios caminhos. O componente interno de página não encontrada do React Router trata rotas que não pertencem à aplicação. Depois do deploy, abrir **diretamente no navegador** e recarregar `/`, `/clientes`, `/clientes/<id>` (por exemplo, `marina` na demo), `/ordens` e `/ordens/<id>` (por exemplo, `demo-order-1048` na demo). Confirmar conteúdo correto, ausência de 404 do servidor e carregamento dos assets.

Após a Cloudflare atribuir o domínio, ajustar em **Supabase Auth → URL Configuration** a Site URL para a origem HTTPS de produção com `/` final. Autorizar como Redirect URLs pelo menos a URL raiz exata de produção e as origens locais usadas no desenvolvimento (`http://localhost:5173/` e `http://127.0.0.1:5173/`; adicionar outras portas apenas se usadas). O `signUp` envia `emailRedirectTo` derivado da origem atual, sempre na rota raiz, sem parâmetro de destino fornecido pelo usuário. Verificar também o template de e-mail para que respeite o redirecionamento autorizado. Em GF-7B, testar a confirmação pelo link, o retorno e a sessão, além de recargas na raiz e em rotas internas. Não há domínio de produção definido neste checkpoint.

Antes de declarar o MVP publicado, validar no endereço público o golden path da demo e o login de conta existente; conferir o estado vazio de uma conta nova sem alterar registros reais; testar fisicamente em Moto G06; fazer a revisão visual humana; e comprovar isolamento entre duas contas distintas. O teste E2E atual usa somente dados locais e não comprova esse isolamento real.

## Licença

Ainda não definida.
