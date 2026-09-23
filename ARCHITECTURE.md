# GestorFlow — Architecture

## 1. Objetivo técnico

A arquitetura do GestorFlow deve equilibrar três necessidades:

1. entregar o MVP em 7–10 dias;
2. permanecer simples o suficiente para manutenção rápida;
3. aceitar novas features sem exigir reconstrução estrutural.

A solução adotada é um **monólito modular orientado por features**.

Não haverá backend próprio no MVP. O frontend utilizará Supabase por meio de uma camada de acesso a dados própria.

## 2. Restrições arquiteturais

### Custo zero no MVP

A infraestrutura obrigatória deve permanecer em **R$ 0/mês** enquanto o projeto for apenas uma demonstração de portfólio.

Arquitetura prevista:

```text
Usuário
  ↓
Cloudflare Pages
React + TypeScript
  ↓
Camada de acesso a dados
  ↓
Supabase
PostgreSQL + Auth + RLS
```

GitHub hospeda o código e participa do fluxo de deploy.

Serviços pagos só serão considerados em uma etapa posterior, caso tráfego, disponibilidade, armazenamento ou uso real ultrapassem a proposta de portfólio.

### Sem acoplamento direto da UI ao Supabase

Componentes React não devem espalhar chamadas como:

```ts
supabase.from("work_orders").select("*")
```

A UI deve depender de contratos do domínio/aplicação, por exemplo:

```ts
customerRepository.list()
customerRepository.getById(id)
customerRepository.create(input)

workOrderRepository.list(filters)
workOrderRepository.create(input)
workOrderRepository.updateStatus(id, status)
```

A implementação inicial pode usar Supabase, mas a interface não precisa saber disso.

## 3. Stack

### React

Escolhido para a camada de interface por maturidade, ecossistema e capacidade de criar uma experiência rica e componentizada rapidamente.

### TypeScript

Usado para tornar contratos e dados explícitos, reduzir erros triviais e preservar capacidade de evolução do projeto.

### Vite

Responsável pelo ambiente de desenvolvimento e build, com configuração pequena e feedback rápido.

### Tailwind CSS

Utilizado como ferramenta de composição visual.

Regra: Tailwind **não define a identidade do produto**. Tokens e componentes do GestorFlow definem.

### shadcn/ui

Serve como matéria-prima para primitives e componentes acessíveis.

Componentes importados devem ser adaptados ao design system do GestorFlow. O produto não deve manter aparência padrão de biblioteca.

### Motion

Usado apenas para microinterações e continuidade espacial:

- drawers;
- sheets;
- menus;
- transições;
- feedback de criação/alteração;
- entradas discretas.

Animações não devem atrasar tarefas.

Faixa preferencial: aproximadamente 150–300 ms.

### Lucide

Biblioteca base de ícones outline.

A aplicação deve manter consistência de peso, tamanho e significado dos ícones.

### React Hook Form + Zod

Responsáveis por:

- gerenciamento de formulário;
- validação;
- schemas de entrada;
- mensagens de erro previsíveis.

### TanStack Query

Responsável por estado remoto:

- queries;
- mutations;
- cache;
- invalidação;
- estados de loading/erro;
- refetch quando necessário.

### Supabase

Backend do MVP.

Responsabilidades:

- PostgreSQL;
- autenticação;
- acesso a dados;
- Row Level Security.

O Supabase é uma dependência de infraestrutura, não uma dependência direta dos componentes visuais.

### Vitest

Usado para lógica, schemas e unidades que tragam valor real ao MVP.

### Playwright

Usado principalmente para o golden path e fluxos críticos.

O projeto não buscará cobertura artificial de cada componente visual.

### Cloudflare Pages

Destino preferencial para publicação do frontend estático do MVP.

Razões:

- camada gratuita compatível com demonstração;
- CDN;
- HTTPS;
- integração simples com build;
- frontend independente do backend.

A escolha deve ser validada novamente antes do deploy para confirmar que o plano gratuito continua compatível com o uso pretendido.

## 4. Estrutura de diretórios

Estrutura inicial:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── layouts/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── customers/
│   └── work-orders/
│
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── utils/
│   └── constants/
│
├── data/
│   ├── repositories/
│   └── supabase/
│
├── styles/
│   ├── tokens.css
│   └── globals.css
│
└── main.tsx
```

Uma feature pode seguir:

```text
features/customers/
├── components/
├── hooks/
├── pages/
├── schemas/
├── services/
├── types/
└── index.ts
```

Pastas só devem existir quando houver responsabilidade real. A árvore acima é direção, não obrigação de criar diretórios vazios.

## 5. Fronteiras

### app/

Composição global:

- router;
- providers;
- layouts;
- bootstrap.

Não deve conter regras específicas de clientes ou ordens.

### features/

Responsabilidades de negócio organizadas por capacidade.

Uma feature deve preferir depender de `shared` e contratos de dados, evitando dependência circular com outras features.

### shared/

Elementos reutilizáveis e sem conhecimento de domínio específico.

Exemplos:

- Button;
- Input;
- Drawer;
- Toast;
- utilitários;
- hooks genéricos.

Não usar `shared` como depósito de qualquer coisa.

### data/

Integrações e implementações de persistência.

Contém:

- cliente Supabase;
- repositories;
- mapeamento de dados quando necessário.

## 6. Design system mínimo

Tokens previstos:

- colors;
- typography;
- spacing;
- radius;
- borders;
- shadows;
- motion;
- breakpoints;
- z-index.

Componentes fundamentais:

- Button;
- Input;
- Textarea;
- Select;
- Badge;
- Card;
- Drawer;
- Sheet;
- Dialog;
- Toast;
- Table/List;
- EmptyState;
- Skeleton;
- PageHeader;
- Stat.

Regra:

> nenhum componente visual novo deve inventar sua própria linguagem sem pertencer ao sistema existente.

## 7. Responsividade

O layout será pensado em dois modos de experiência, não apenas em breakpoints.

### Desktop

- sidebar;
- tabelas/listas mais densas;
- drawers laterais;
- maior quantidade de contexto simultâneo.

### Mobile

- navegação inferior para destinos principais;
- cards/listas adequados a toque;
- sheets ou telas completas;
- ações primárias acessíveis;
- sem tabelas desktop comprimidas.

O Moto G06 será um dos dispositivos físicos de validação.

## 8. Dados iniciais

Entidades mínimas previstas:

### User/Profile

Identidade necessária para autenticação e contexto da aplicação.

### Customer

Campos exatos serão fechados na implementação, mas o domínio deve suportar ao menos:

- id;
- name;
- contact data;
- createdAt;
- notes.

### WorkOrder

Mínimo conceitual:

- id;
- customerId;
- title;
- description;
- value;
- status;
- openedAt;
- notes;
- createdAt;
- updatedAt.

Status:

```text
new
in_progress
waiting
completed
```

O schema definitivo deve ser versionado no projeto quando o Supabase entrar em GF-4.

## 9. Mocks e persistência

GF-1 a GF-3 podem usar dados mockados para validar produto e UX rapidamente.

A migração para Supabase deve ocorrer por trás dos repositories.

Objetivo:

> trocar a origem dos dados sem reescrever componentes de tela.

## 10. Autenticação e demonstração

A aplicação terá:

- caminho de autenticação;
- modo de demonstração de acesso simples.

O visitante do portfólio não deve precisar confirmar e-mail para conhecer o produto.

O modo demo usa repositories locais em memória, reiniciados no reload; contas usam Auth e repositories Supabase. Ambos seguem os mesmos contratos. A estratégia preserva:

- custo zero;
- segurança;
- previsibilidade da demonstração.

## 11. Segurança

No MVP:

- credenciais sensíveis nunca entram no repositório;
- variáveis públicas e privadas devem ser diferenciadas;
- Supabase RLS será habilitado quando aplicável;
- validação de frontend não substitui política de acesso;
- dados de demo não conterão dados pessoais reais.

## 12. Testes

### Unitários

Priorizar:

- schemas;
- transformação de dados;
- lógica de métricas;
- filtros;
- comportamento de repositories quando adequado.

### E2E

O golden path é obrigatório.

Fluxos adicionais só entram quando protegem um risco relevante.

## 13. Fases técnicas

### GF-0 — Fundação

- projeto;
- dependências;
- estrutura;
- router;
- providers;
- tokens;
- primitives essenciais;
- lint/format/test baseline.

### GF-1 — Shell visual

- navegação;
- layouts;
- dashboard mockado;
- tabelas/listas;
- drawer/sheet;
- responsividade base.

### GF-2 — Clientes

- lista;
- busca;
- detalhe;
- criação;
- edição;
- validação.

### GF-3 — Ordens

- lista;
- filtros;
- criação;
- edição;
- status;
- associação cliente → ordem.

### GF-4 — Persistência

- Supabase;
- schema;
- repositories;
- auth;
- RLS;
- substituição de mocks.

### GF-5 — Dashboard real

- métricas;
- ordens recentes;
- atenção;
- atualização derivada dos dados reais.

### GF-6 — Polish

- motion;
- loading;
- empty/error states;
- acessibilidade;
- ergonomia mobile;
- revisão visual.

### GF-7 — Demo & Deploy

- dataset demo;
- caminho de demonstração;
- deploy;
- Playwright golden path;
- README final;
- material de portfólio.

## 14. Regra de evolução

Novos módulos devem ser adicionados como features independentes sempre que possível.

Exemplos futuros:

```text
features/
├── quotations/
├── appointments/
├── inventory/
├── finance/
├── reports/
├── notifications/
└── ai/
```

A existência futura desses módulos não justifica implementá-los ou criar infraestrutura para eles durante o MVP.
