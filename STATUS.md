# GestorFlow — Status

## Estado atual

**Fase:** GF-7C — fechamento documental da GF-7

**GF-7A:** preparação técnica concluída

**GF-7B:** publicada e validada

**GF-7C:** registro de encerramento documental

**MVP de portfólio:** funcionalmente concluído

**Deploy:** [https://gestorflow.pages.dev/](https://gestorflow.pages.dev/)

**Infraestrutura atual:** planos Free do Cloudflare Pages e Supabase, sem custo obrigatório enquanto respeitados os limites dos provedores

## Baseline aprovado

Definidos:

- propósito do produto;
- público-alvo;
- promessa do MVP;
- experiência principal;
- direção visual;
- telas do MVP;
- golden path;
- stack planejada;
- arquitetura modular;
- restrição de custo zero;
- escopo explicitamente excluído;
- decomposição GF-0 → GF-7.

## Direção visual aprovada

Conceito:

**SaaS operacional elegante**

Ajuste central:

- fundo off-white quente com sensação de papel timbrado;
- verde petróleo como acento principal;
- grafite para texto;
- acentos quentes discretos;
- pouca sombra;
- bordas sutis;
- poucos cards;
- motion curto e funcional;
- sem estética genérica de “AI SaaS”.

Os mockups conceituais de dashboard, clientes, detalhe do cliente e ordens servem como referência de composição, não como especificação pixel-perfect.

## Escopo do MVP

### Incluído

- entrada/autenticação;
- modo demonstração;
- dashboard;
- clientes;
- detalhe de cliente;
- ordens de serviço;
- busca e filtros essenciais;
- status de ordens;
- persistência;
- responsividade;
- acessibilidade básica;
- estados de loading/erro/vazio;
- dataset demo;
- deploy público;
- golden path E2E.

### Fora

- agenda;
- estoque;
- financeiro completo;
- orçamentos separados;
- PDF;
- notas fiscais;
- WhatsApp;
- e-mail;
- uploads;
- pagamentos;
- multiempresa;
- permissões avançadas;
- relatórios configuráveis;
- offline;
- APK;
- IA;
- automações;
- webhooks;
- integrações externas.

## Plano de execução

| Fase | Objetivo | Estimativa | Estado |
| --- | --- | ---: | --- |
| GF-0 | Fundação técnica | 0,5–1 dia | Implementada |
| GF-1 | Shell visual | 1 dia | Implementada |
| GF-2 | Clientes | 1–1,5 dia | Implementada |
| GF-3 | Ordens | 1,5–2 dias | Implementada |
| GF-4 | Persistência | 1 dia | Implementada |
| GF-5 | Dashboard real | 0,5–1 dia | Implementada |
| GF-6 | Polish | 1–2 dias | Implementada; revisão visual humana encerrada na validação pública |
| GF-7A | Preparação técnica para deploy | — | Concluída (`b067ee5`) |
| GF-7B | Deploy e validação | — | Publicada e validada pelo usuário |
| GF-7C | Fechamento documental | — | Registro de encerramento do MVP |

Janela desejada: **7–10 dias**.  
Teto absoluto: **14 dias**.

## Gate atual

GF-1 substituiu a página técnica por shell desktop/mobile e dashboard com dados demonstrativos centralizados em `src/data/demo.ts`. `@types/node` foi alinhado à linha 24.x para o runtime Node 24.

GF-2 implementou listagem, pesquisa, ficha de leitura, cadastro e edição de clientes. O modelo contém id, nome, telefone, e-mail, observações e data de criação. React Hook Form e Zod validam o formulário. O estado em memória é compartilhado entre Clientes e dashboard; alterações são perdidas ao recarregar.

GF-3 implementou modelo e store em memória para ordens, lista com pesquisa e filtro de status, detalhe, criação, edição e alteração de status. A ficha do cliente consulta as ordens correntes, e a criação iniciada nela traz o cliente preenchido. O dashboard oferece o caminho para criar uma ordem, mas suas métricas e listas continuam demonstrativas; sua derivação do estado atual pertence à GF-5. As mudanças nas ordens são perdidas ao recarregar. Supabase e persistência real continuam em GF-4. Os testes automatizados incluem os fluxos de Clientes e Ordens em desktop e viewports mobile de 360px e 390px. Naquela fase, a revisão visual humana e o teste físico ainda não haviam ocorrido; a validação posterior consta em GF-7B.

## GF-4

Supabase Auth por e-mail e senha, entrada demo sem cadastro e recuperação de sessão estão integrados. Os contratos de CustomerRepository e WorkOrderRepository têm implementações locais e Supabase. A UI acessa as entidades pelos providers com TanStack Query; RLS protege clientes e ordens do usuário autenticado. A migration do schema remoto existente foi versionada localmente, sem alteração remota. O MVP não permite DELETE. Variáveis públicas: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; sem elas, a demo continua disponível. O dashboard ainda usava métricas demonstrativas nesta fase.

## GF-5

O dashboard usa as ordens e clientes correntes fornecidos pelos mesmos contratos de dados da demo e da conta persistente. Em andamento, aguardando, concluídas e faturamento do mês são calculados das ordens atuais; recentes têm ordenação estável, e atenção inclui ordens aguardando. Mutations invalidam as queries, atualizando o dashboard sem reload. A data e a saudação usam o relógio local. Os números deixam de depender de `demoOrders` estático.

## GF-6

O seletor de status salva automaticamente e comunica andamento, sucesso confirmado e erro sem alterar visualmente o status real em caso de falha. A finalização fica em seção separada, com confirmação cancelável. A listagem mostra o código amigável da OS, mantendo UUID em rotas e chaves internas. Nova OS sem clientes orienta o cadastro; o formulário existente retorna à criação com o cliente pré-selecionado. O cadastro normal continua levando à ficha do cliente. Foram ajustados estados vazios de ordens, erros de consulta em detalhes e formulários, mensagens conhecidas de Auth e quebras de texto. Há testes E2E com módulos demo interceptados para falha de mutation, UUID, base vazia e cliente recém-criado; não usam dados remotos. Os fluxos foram verificados em 360, 390 e 768 px por Playwright, além do golden path demo existente.

Na GF-6, a revisão visual humana, o teste de isolamento entre duas contas e a validação física no Moto G06 ainda aguardavam a publicação. Esses itens foram encerrados na validação pública posterior, descrita em GF-7B.

## GF-7A

GF-7A — preparação técnica concluída no commit `b067ee5`.

As datas das ordens demo são relativas ao mês e ao dia locais, com códigos, IDs, serviços, status e valores preservados. A demo continua em memória, sem login, variáveis Supabase ou persistência entre recargas. O golden path local é testado com requisições externas bloqueadas. A conta real mantém Supabase Auth, PostgreSQL e RLS sem mudanças de schema ou dados remotos.

O cadastro público fica oculto por padrão no build de produção por `VITE_PUBLIC_SIGNUP_ENABLED`; o desenvolvimento local mantém o formulário disponível se a flag estiver ausente ou for `true`. A flag é apresentação de produto, não controle de segurança do backend. O SMTP padrão do Supabase é inadequado para cadastro público irrestrito. O `signUp` usa a origem atual da aplicação como retorno à rota raiz. Login de contas existentes e demo continuam acessíveis.

O Códex informou 26/26 testes Vitest e 30/30 Playwright aprovados, além de format, lint, typecheck, build e diff check. A auditoria posterior revisou o código, sem executar novamente essas suítes. Esses resultados pertencem à GF-7A; não foram produzidos neste fechamento documental.

## GF-7B

O usuário publicou a aplicação no Cloudflare Pages com GitHub, branch `main`, build `npm run build`, saída `dist` e Node.js 24. Endereço público: [https://gestorflow.pages.dev/](https://gestorflow.pages.dev/).

Na validação humana, a aplicação abriu no domínio de produção, os botões de demonstração e login apareceram corretamente, a demo exibiu ordens fictícias e a rota interna da OS-1048 funcionou. O usuário entrou na conta real pelo domínio público e recuperou os registros previamente cadastrados. Testou os fluxos no Moto G06 e informou sucesso. A revisão visual humana da GF-6 foi encerrada nesse contexto.

Na auditoria simulada com o papel `authenticated`, outra identidade não conseguiu consultar ou atualizar dados do proprietário. Posteriormente, o usuário testou duas contas reais no aplicativo e confirmou que elas não conseguiam visualizar ou editar dados uma da outra. A última inspeção do Supabase encontrou duas contas, dois clientes com proprietários distintos e duas ordens. O E2E automatizado da demo usa dados locais; a comprovação entre contas reais veio do teste do usuário.

## GF-7C — fechamento documental

Este registro encerra documentalmente a GF-7 e marca o MVP de portfólio como funcionalmente concluído. A demo usa dados locais em memória, reiniciados a cada recarga e independentes do Supabase. A conta autenticada usa Supabase Auth, PostgreSQL e RLS para dados persistentes. A infraestrutura atual usa planos Free do Cloudflare Pages e Supabase, sujeita aos limites de ambos; o Supabase Free pode pausar por inatividade, afetando o acesso à conta persistente até a retomada do projeto.

### Limitações conhecidas

1. O cadastro público está oculto na interface de produção. A flag `VITE_PUBLIC_SIGNUP_ENABLED` não desativa cadastro no Supabase Auth; o controle de novos cadastros no servidor ainda precisa de revisão operacional.
2. O SMTP padrão do Supabase é inadequado para cadastro público irrestrito.
3. O Security Advisor apresenta aviso de proteção contra senhas vazadas desativada. Revisar disponibilidade e configuração sem contratar plano pago.
4. O projeto Supabase Free está sujeito a pausa por inatividade e limites de uso. A demo local permanece independente do banco.
5. O MVP não inclui DELETE, estoque, agenda, financeiro completo, PDF, anexos, WhatsApp, APK ou permissões avançadas.

A validação registrada não equivale a garantia absoluta de segurança ou a medições de desempenho. Não há neste fechamento registro de nova execução das suítes, do fluxo de confirmação por e-mail ou de recarga de todas as rotas internas.

## Diretriz preservada

A implementação preserva a prioridade do projeto:

> produto pequeno, visualmente forte, funcional e terminável.

Se uma decisão técnica aumentar significativamente o prazo sem melhorar o MVP ou sua capacidade real de evolução, ela deve ser rejeitada ou adiada.
