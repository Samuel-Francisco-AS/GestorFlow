# GestorFlow — Status

## Estado atual

**Fase:** pré-desenvolvimento concluído  
**Próxima fase:** GF-0 — Fundação  
**MVP:** não iniciado  
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
| GF-0 | Fundação técnica | 0,5–1 dia | Próxima |
| GF-1 | Shell visual | 1 dia | Pendente |
| GF-2 | Clientes | 1–1,5 dia | Pendente |
| GF-3 | Ordens | 1,5–2 dias | Pendente |
| GF-4 | Persistência | 1 dia | Pendente |
| GF-5 | Dashboard real | 0,5–1 dia | Pendente |
| GF-6 | Polish | 1–2 dias | Pendente |
| GF-7 | Demo & deploy | 0,5–1 dia | Pendente |

Janela desejada: **7–10 dias**.  
Teto absoluto: **14 dias**.

## Gate atual

Antes de considerar GF-0 concluída, devem existir:

- app React + TypeScript + Vite executando;
- estrutura modular inicial;
- router;
- providers;
- lint/format;
- Vitest baseline;
- design tokens;
- primitives essenciais suficientes para iniciar o shell;
- nenhuma feature fora de escopo adicionada.

## Próximo passo

Iniciar **GF-0 — Fundação**.

A primeira implementação deve preservar a prioridade do projeto:

> produto pequeno, visualmente forte, funcional e terminável.

Se uma decisão técnica aumentar significativamente o prazo sem melhorar o MVP ou sua capacidade real de evolução, ela deve ser rejeitada ou adiada.
