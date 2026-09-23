# GestorFlow — Status

## Estado atual

**Fase:** GF-3 — Gate técnico concluído; revisão visual humana pendente

**Próxima fase:** GF-4 — Persistência, ainda não iniciada

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
| GF-4 | Persistência | 1 dia | Pendente |
| GF-5 | Dashboard real | 0,5–1 dia | Pendente |
| GF-6 | Polish | 1–2 dias | Pendente |
| GF-7 | Demo & deploy | 0,5–1 dia | Pendente |

Janela desejada: **7–10 dias**.  
Teto absoluto: **14 dias**.

## Gate atual

GF-1 substituiu a página técnica por shell desktop/mobile e dashboard com dados demonstrativos centralizados em `src/data/demo.ts`. `@types/node` foi alinhado à linha 24.x para o runtime Node 24.

GF-2 implementou listagem, pesquisa, ficha de leitura, cadastro e edição de clientes. O modelo contém id, nome, telefone, e-mail, observações e data de criação. React Hook Form e Zod validam o formulário. O estado em memória é compartilhado entre Clientes e dashboard; alterações são perdidas ao recarregar.

GF-3 implementou modelo e store em memória para ordens, lista com pesquisa e filtro de status, detalhe, criação, edição e alteração de status. A ficha do cliente consulta as ordens correntes, e a criação iniciada nela traz o cliente preenchido. O dashboard oferece o caminho para criar uma ordem, mas suas métricas e listas continuam demonstrativas; sua derivação do estado atual pertence à GF-5. As mudanças nas ordens são perdidas ao recarregar. Supabase e persistência real continuam em GF-4. Os testes automatizados incluem os fluxos de Clientes e Ordens em desktop e viewports mobile de 360px e 390px. A revisão visual humana permanece separada; não houve teste físico em smartphone.

## Próximo passo

Revisar visualmente GF-1, GF-2 e GF-3. Após autorização separada, GF-4 tratará da persistência real.

A primeira implementação deve preservar a prioridade do projeto:

> produto pequeno, visualmente forte, funcional e terminável.

Se uma decisão técnica aumentar significativamente o prazo sem melhorar o MVP ou sua capacidade real de evolução, ela deve ser rejeitada ou adiada.
