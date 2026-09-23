# GestorFlow — Status

## Estado atual

**Fase:** GF-7A — Preparação técnica concluída; deploy e validação pública pendentes

**Próxima fase:** GF-7B — Deploy e validação

**MVP:** em execução
**Deploy:** inexistente  
**Infraestrutura obrigatória:** R$ 0/mês

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
| GF-0 | Fundação técnica | 0,5–1 dia | Implementada; pendente de revisão |
| GF-1 | Shell visual | 1 dia | Gate técnico concluído; revisão visual pendente |
| GF-2 | Clientes | 1–1,5 dia | Gate técnico concluído; revisão visual pendente |
| GF-3 | Ordens | 1,5–2 dias | Gate técnico concluído; revisão visual pendente |
| GF-4 | Persistência | 1 dia | Gate técnico concluído; revisão visual pendente |
| GF-5 | Dashboard real | 0,5–1 dia | Gate técnico concluído; revisão visual pendente |
| GF-6 | Polish | 1–2 dias | Gate técnico concluído; revisão visual humana pendente |
| GF-7A | Preparação técnica para deploy | — | Gate técnico concluído; publicação pendente |
| GF-7B | Deploy e validação | — | Pendente |

Janela desejada: **7–10 dias**.  
Teto absoluto: **14 dias**.

## Gate atual

GF-1 substituiu a página técnica por shell desktop/mobile e dashboard com dados demonstrativos centralizados em `src/data/demo.ts`. `@types/node` foi alinhado à linha 24.x para o runtime Node 24.

GF-2 implementou listagem, pesquisa, ficha de leitura, cadastro e edição de clientes. O modelo contém id, nome, telefone, e-mail, observações e data de criação. React Hook Form e Zod validam o formulário. O estado em memória é compartilhado entre Clientes e dashboard; alterações são perdidas ao recarregar.

GF-3 implementou modelo e store em memória para ordens, lista com pesquisa e filtro de status, detalhe, criação, edição e alteração de status. A ficha do cliente consulta as ordens correntes, e a criação iniciada nela traz o cliente preenchido. O dashboard oferece o caminho para criar uma ordem, mas suas métricas e listas continuam demonstrativas; sua derivação do estado atual pertence à GF-5. As mudanças nas ordens são perdidas ao recarregar. Supabase e persistência real continuam em GF-4. Os testes automatizados incluem os fluxos de Clientes e Ordens em desktop e viewports mobile de 360px e 390px. A revisão visual humana permanece separada; não houve teste físico em smartphone.

## GF-4

Supabase Auth por e-mail e senha, entrada demo sem cadastro e recuperação de sessão estão integrados. Os contratos de CustomerRepository e WorkOrderRepository têm implementações locais e Supabase. A UI acessa as entidades pelos providers com TanStack Query; RLS protege clientes e ordens do usuário autenticado. A migration do schema remoto existente foi versionada localmente, sem alteração remota. O MVP não permite DELETE. Variáveis públicas: `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`; sem elas, a demo continua disponível. O dashboard ainda usava métricas demonstrativas nesta fase.

## GF-5

O dashboard usa as ordens e clientes correntes fornecidos pelos mesmos contratos de dados da demo e da conta persistente. Em andamento, aguardando, concluídas e faturamento do mês são calculados das ordens atuais; recentes têm ordenação estável, e atenção inclui ordens aguardando. Mutations invalidam as queries, atualizando o dashboard sem reload. A data e a saudação usam o relógio local. Os números deixam de depender de `demoOrders` estático.

## GF-6

O seletor de status salva automaticamente e comunica andamento, sucesso confirmado e erro sem alterar visualmente o status real em caso de falha. A finalização fica em seção separada, com confirmação cancelável. A listagem mostra o código amigável da OS, mantendo UUID em rotas e chaves internas. Nova OS sem clientes orienta o cadastro; o formulário existente retorna à criação com o cliente pré-selecionado. O cadastro normal continua levando à ficha do cliente. Foram ajustados estados vazios de ordens, erros de consulta em detalhes e formulários, mensagens conhecidas de Auth e quebras de texto. Há testes E2E com módulos demo interceptados para falha de mutation, UUID, base vazia e cliente recém-criado; não usam dados remotos. Os fluxos foram verificados em 360, 390 e 768 px por Playwright, além do golden path demo existente.

Permanecem pendentes a revisão visual humana, o teste de isolamento entre duas contas distintas e a validação física no Moto G06, adiada até haver acesso pela internet. Integração remota e publicação pública não foram executadas nesta fase.

## GF-7A

GF-7A — Preparação técnica concluída; deploy e validação pública pendentes.

As datas das ordens demo são relativas ao mês e ao dia locais, com códigos, IDs, serviços, status e valores preservados. A demo continua em memória, sem login, variáveis Supabase ou persistência entre recargas. O golden path local é testado com requisições externas bloqueadas. A conta real mantém Supabase Auth, PostgreSQL e RLS sem mudanças de schema ou dados remotos.

O cadastro público fica oculto por padrão no build de produção por `VITE_PUBLIC_SIGNUP_ENABLED`; o desenvolvimento local mantém o formulário disponível se a flag estiver ausente ou for `true`. A flag é apresentação de produto, não controle de segurança do backend. O SMTP padrão do Supabase limita o envio de confirmações a endereços autorizados; cadastro externo irrestrito permanece indisponível até infraestrutura e configuração de Auth adequadas. O `signUp` usa a origem atual da aplicação como retorno à rota raiz. Login de contas existentes e demo continuam acessíveis.

Destino planejado: Cloudflare Pages via integração Git, branch `main`, `npm run build`, saída `dist`, Node.js 24. A ausência de `404.html` permite o fallback SPA padrão do Pages; confirmação das rotas por acesso direto ocorrerá após publicação. Configurar as variáveis públicas de produção do Pages e, depois de atribuído o domínio, Site URL e Redirect URLs no Supabase. O projeto depende dos limites gratuitos de Pages e Supabase para manter R$ 0/mês; o Supabase Free pode pausar por inatividade, afetando apenas contas persistentes enquanto estiver pausado.

Permanecem pendentes GF-7B, publicação pública, teste de confirmação por e-mail e recarga em rotas no domínio real, teste físico no Moto G06, revisão visual humana, estado vazio de conta real recém-criada e prova E2E de isolamento entre duas contas reais. O MVP ainda não está publicado nem concluído.

## Próximo passo

GF-7B — Deploy e validação, com o usuário após auditoria.

A primeira implementação deve preservar a prioridade do projeto:

> produto pequeno, visualmente forte, funcional e terminável.

Se uma decisão técnica aumentar significativamente o prazo sem melhorar o MVP ou sua capacidade real de evolução, ela deve ser rejeitada ou adiada.
