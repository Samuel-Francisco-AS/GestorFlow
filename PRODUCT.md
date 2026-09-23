# GestorFlow — Product Contract

## 1. Visão

GestorFlow é um sistema web de gestão para MEIs, profissionais autônomos, microempresas e pequenos negócios.

O produto existe para ajudar pessoas que precisam organizar clientes e serviços sem adotar um ERP caro, burocrático ou difícil de aprender.

A primeira versão é, antes de tudo, uma **demonstração de portfólio**. Ela deve parecer e se comportar como um produto comercial real, sem tentar cobrir todas as necessidades de um ERP.

## 2. Objetivo do MVP

Demonstrar que o produto consegue oferecer uma experiência completa de gestão simples, bonita, responsiva e funcional.

O MVP é considerado concluído quando uma pessoa consegue, sem tutorial:

1. abrir a demonstração;
2. compreender o dashboard;
3. navegar até clientes;
4. consultar um cliente e seu histórico;
5. criar uma ordem de serviço;
6. alterar o status dessa ordem;
7. perceber a atualização refletida no sistema;
8. repetir o fluxo tanto em desktop quanto em mobile.

Se esse caminho estiver funcional, claro e visualmente polido, o MVP está terminado.

## 3. Público-alvo

Prioridade do MVP:

- MEI;
- profissional autônomo;
- microempresa;
- pequena empresa;
- prestador de serviço;
- pessoa começando um pequeno negócio.

Empresas médias podem ser compatíveis futuramente, mas **não fazem parte da promessa do MVP**.

## 4. Restrições de produto

### Prazo

Janela desejada: **7 a 10 dias de execução**.

Teto absoluto: **14 dias**.

Qualquer funcionalidade que ameace essa janela deve sair do MVP.

### Custo

O MVP deve operar como demonstração de portfólio com **custo obrigatório de infraestrutura de R$ 0/mês**.

Planos pagos, upgrades ou infraestrutura adicional só poderão ser considerados quando houver uso real do produto que justifique a escala.

### Complexidade

O produto deve ser preparado para evoluir, mas não antecipará abstrações ou módulos que não sejam necessários ao MVP.

Regra:

> modularidade agora; arquitetura especulativa, não.

## 5. Princípios de experiência

### Estética

A primeira impressão importa. O produto deve parecer comercialmente pronto, e não um CRUD de tutorial.

### Simplicidade

O usuário deve conseguir descobrir o que fazer sem tutorial longo, onboarding obrigatório ou textos explicativos excessivos.

### Responsividade

Mobile não será uma versão desktop comprimida. Navegação, densidade, tabelas, painéis e ações devem se adaptar de forma deliberada.

### Acessibilidade

O MVP deve considerar desde a fundação:

- contraste adequado;
- foco visível;
- navegação por teclado;
- labels reais;
- mensagens de erro compreensíveis;
- alvos de toque adequados;
- estados que não dependam apenas de cor.

### Divulgação progressiva

A interface mostra primeiro o que o usuário precisa saber e revela complexidade apenas quando ele decide agir.

Exemplo:

- lista: resumo;
- detalhe: contexto;
- edição: formulário.

Visualizar não é editar.

## 6. Direção visual

Conceito: **SaaS operacional elegante**.

Referências conceituais:

- organização e densidade controlada;
- hierarquia tipográfica forte;
- sensação de produto profissional;
- acabamento cuidadoso;
- pequenas referências a fichas, registros e papelaria comercial.

A identidade deve evitar a estética genérica de “aplicativo feito por IA”.

### Base visual

- fundo off-white quente, com sensação de papel timbrado;
- superfícies claras;
- texto grafite;
- verde petróleo profundo como acento principal;
- areia/âmbar queimado como acento secundário discreto;
- bordas sutis;
- poucas sombras;
- raio moderado;
- animações curtas e funcionais.

Valores iniciais, sujeitos a refinamento visual:

- app background: `#F6F3EC`;
- surface: `#FCFAF6`;
- strong surface: `#FFFFFF`;
- graphite: `#18201E`;
- muted text: `#69716D`.

### Evitar

- gradiente azul/roxo como identidade;
- glassmorphism gratuito;
- branco clínico ou azulado;
- sombras pesadas;
- arredondamento excessivo;
- tudo dentro de cards;
- gráficos decorativos;
- “AI powered” como decoração;
- lorem ipsum e dados genéricos.

## 7. Navegação do MVP

Desktop:

- Visão geral;
- Clientes;
- Ordens de serviço.

Mobile:

- Início;
- Clientes;
- Ordens.

Configurações e utilidades podem ficar em posição secundária.

Cada tela deve ter uma ação primária visualmente evidente.

## 8. Telas e experiências

### 8.1 Entrada / demonstração

Objetivo: permitir entrada rápida.

Deve oferecer:

- autenticação normal;
- ação clara para **Explorar demonstração**.

A demo não deve exigir cadastro do visitante.

### 8.2 Visão geral

Deve apresentar:

- saudação curta;
- CTA `Nova ordem`;
- ordens em andamento;
- ordens aguardando;
- concluídas no mês;
- faturamento do mês;
- ordens recentes;
- itens que precisam de atenção.

Nenhum gráfico entra apenas para preencher espaço.

### 8.3 Clientes

Deve permitir:

- listar;
- buscar;
- filtrar de forma essencial;
- criar;
- abrir detalhe;
- editar.

Desktop pode usar tabela/lista híbrida. Mobile deve usar composição adequada a toque, sem tabela espremida.

### 8.4 Detalhe do cliente

Deve funcionar como ficha de leitura, não como formulário permanente.

Conteúdo esperado:

- identidade e contato;
- resumo;
- ordens relacionadas;
- histórico;
- ação de editar;
- ação de criar ordem.

### 8.5 Ordens de serviço

Deve permitir:

- listar;
- buscar;
- filtrar;
- criar;
- editar;
- alterar status.

Estados do MVP:

- Novo;
- Em andamento;
- Aguardando;
- Concluído.

Campos mínimos:

- cliente;
- título/serviço;
- descrição;
- valor;
- status;
- data;
- observações.

No desktop, criação/edição pode usar drawer. No mobile, sheet ou tela dedicada conforme ergonomia.

## 9. Golden path da demonstração

Fluxo principal:

```text
Entrar na demonstração
    ↓
Ver dashboard populado
    ↓
Abrir Clientes
    ↓
Abrir um cliente
    ↓
Consultar histórico
    ↓
Abrir Ordens
    ↓
Criar uma nova ordem
    ↓
Definir cliente, serviço e valor
    ↓
Salvar
    ↓
Ver a ordem na listagem
    ↓
Alterar status para Em andamento
    ↓
Ver o dashboard refletir a alteração
```

Esse é o principal fluxo E2E do MVP.

## 10. Dados de demonstração

A demo deve começar populada e parecer brasileira.

Exemplos de clientes:

- Marina Albuquerque;
- Café Aurora;
- João Ferreira;
- Oficina Estrela;
- Studio Ana Luz;
- Papelaria Central;
- Escola Horizonte.

Regras:

- valores em reais;
- formatos brasileiros;
- datas coerentes;
- serviços plausíveis;
- nada de `John Doe`, `Company Inc`, `Test User` ou `Lorem ipsum`.

## 11. Escopo funcional do MVP

Incluído:

- autenticação;
- modo demonstração;
- dashboard;
- clientes;
- ordens de serviço;
- busca e filtros essenciais;
- persistência;
- atualização de status;
- estados de loading, vazio e erro;
- responsividade;
- acessibilidade básica;
- deploy público;
- dados demo;
- golden path automatizado.

## 12. Fora do MVP

Explicitamente fora:

- agenda/calendário;
- estoque;
- financeiro completo;
- orçamentos como módulo separado;
- geração de PDF;
- nota fiscal;
- WhatsApp;
- e-mail transacional;
- uploads;
- fotos;
- pagamentos;
- multiempresa;
- equipes e permissões avançadas;
- relatórios configuráveis;
- modo offline;
- APK;
- IA;
- automações;
- webhooks;
- integrações externas.

Uma ideia estar fora do MVP não significa estar rejeitada. Significa apenas que não pode comprometer a entrega inicial.

## 13. Evolução possível

Após o MVP, módulos podem ser adicionados incrementalmente, por exemplo:

- orçamentos;
- agenda;
- anexos;
- relatórios;
- financeiro;
- multiusuário;
- notificações;
- IA.

IA só deverá entrar quando houver uma função útil, como:

- resumir histórico;
- preparar mensagem para cliente;
- sugerir próximos passos;
- gerar descrição de orçamento;
- busca em linguagem natural;
- insights operacionais.

## 14. Definição de pronto

O MVP está pronto quando:

- o golden path funciona;
- a experiência desktop está polida;
- a experiência mobile foi validada;
- a persistência é real;
- a demo pública pode ser usada sem assistência;
- os principais estados de erro/loading/vazio foram tratados;
- não existem bugs bloqueadores;
- o deploy obrigatório continua em R$ 0/mês;
- a aplicação parece produto, não protótipo.
