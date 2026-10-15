# GF-8A — Recovery & Smoke Report

**Data da execução:** 14/10/2026  
**Branch:** `gf-8a-recovery-smoke`  
**Baseline (`main` e `origin/main`):** `0aea2e0dce1b43f4e2e59377698e9f05fcaa50a0`  
**Resultado:** **BLOCKED**

## 1. Ambiente, baseline e SHA inicial

- Repositório: `Samuel-Francisco-AS/GestorFlow`.
- Antes da branch, `main` estava sincronizada com `origin/main`, sem alterações locais (`git status --short --branch`: `## main...origin/main`).
- A branch dedicada foi criada diretamente desse baseline. Nenhuma alteração preexistente precisou ser preservada.
- Runtime: Node.js `v24.18.0`; npm `12.0.2`; dependências já instaladas.
- Os arquivos `.env.local` têm URL e chave pública Supabase configuradas, mas não disponibilizam sessão, senha de usuário ou credenciais de duas contas. Valores não foram exibidos nem registrados.
- Custo observado para as verificações: R$ 0. Nenhum projeto, branch ou recurso pago foi criado.

## 2. Testes executados e resultados

| Verificação | Resultado e evidência |
| --- | --- |
| Supabase Management API / projeto | `ACTIVE_HEALTHY`, região `sa-east-1`, PostgreSQL 17.6.1.166 (`get_project`, leitura). |
| Schema | `public.customers` e `public.work_orders` existem; colunas, chaves, restrições e FK de propriedade conferem com a migration GF-4 (`list_tables`, verbose). |
| Migration | `20260923175233_gf4_initial_persistence_schema` consta no histórico remoto (`list_migrations`). Não foi executada migration. |
| Dados existentes | Consulta SQL somente leitura: 2 clientes e 2 ordens. Nenhum campo pessoal foi consultado ou registrado. |
| Integridade referencial | Consulta de ordens sem cliente correspondente pelo par `(customer_id, owner_id)`: 0 órfãs. A FK composta correspondente existe no schema. |
| RLS / políticas / grants | RLS ativa nas duas tabelas; seis políticas por proprietário para SELECT/INSERT/UPDATE; `authenticated` tem somente esses três privilégios. Nenhum grant para `anon` apareceu. RLS não está configurada como FORCE. |
| Security Advisor | Um aviso: proteção contra senhas comprometidas desativada. Não foi alterada configuração. |
| `npm run lint` | Aprovado; ESLint e Prettier terminaram sem erros. |
| `npm run typecheck` | Aprovado; `tsc -b --pretty false` terminou com código 0. |
| `npm run test` | Aprovado: 10 arquivos, 26 testes. |
| `npm run build` | Aprovado; build Vite concluído. Aviso não bloqueante: bundle JavaScript de 724,94 kB excede o limite informativo de 500 kB. |
| `npm run test:e2e` | Aprovado: 30 testes Playwright/Chromium. |
| Playwright sem configuração Supabase | Aprovado: repetidos os 30 testes com `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` vazias; 30 passaram. |

## 3. Evidências da persistência real

A leitura administrativa, sem PII, confirmou que os registros restaurados continuam presentes: 2 clientes e 2 ordens; também confirmou zero ordens órfãs. Isso comprova dados e integridade no banco remoto, mas **não comprova persistência pelo frontend após reload**.

Não foi feito login no app publicado ou local, nem leitura/criação/atualização autenticada. Não havia credenciais ou sessão de usuário autorizada disponíveis. Criar registros no projeto de produção para testar seria uma alteração remota persistente: a aplicação não oferece exclusão, e a autorização fornecida proíbe modificar dados de produção sem autorização específica. Por isso, a prova de persistência de ponta a ponta fica pendente; os 2+2 registros existentes não foram tocados.

## 4. Evidências de RLS e isolamento

A inspeção de catálogo e privilégios comprova configuração: ambas as tabelas têm RLS ativa; as políticas restringem leitura, inserção e atualização ao `owner_id = auth.uid()`; `work_orders_customer_owner_fk` também exige que cliente e ordem compartilhem proprietário. A role `authenticated` não recebeu DELETE.

Isso **não é prova de isolamento efetivo entre duas identidades**. Nenhum teste com duas sessões reais foi possível. Não foi usado SQL com role simulada como substituto e não foi criado usuário.

## 5. Verificação do modo demonstração

Playwright passou duas vezes (30/30): na execução normal e com as variáveis Supabase vazias. O golden path automatizado navega por dashboard, clientes e OS, cria/atualiza uma ordem demo, verifica que a mutação desaparece após reload e confirma zero requisições externas. Isso demonstra que o caminho demo usado pela suíte independe do Supabase.

O teste `falha de mutation mantém status real e mostra somente erro` injeta erro em atualização de status: a interface conserva `waiting`, informa erro e não mostra confirmação de sucesso. A falha é simulada no repository demo; uma queda real de rede no backend persistente não foi reproduzida.

## 6. Problemas encontrados e correções

- Sem regressões reproduzidas nos testes executados; nenhuma correção de código foi necessária.
- O Security Advisor mantém o aviso de proteção contra senhas vazadas desativada.
- O build emite aviso de bundle acima de 500 kB; o build conclui normalmente.
- A ferramenta `list_tables` reportou estimativa de linhas 0, divergente da consulta SQL exata. Para contagens, este relatório usa a consulta SQL somente leitura, que retornou 2+2.
- Nenhuma migration, alteração de schema/configuração, mutation remota, deploy ou modificação de dados foi feita.

## 7. Testes não executados e motivos

- Login/logout e recuperação de sessão no app publicado: sem sessão ou credenciais de conta fornecidas/autorizadas.
- Leitura, criação e atualização de cliente/OS pela conta persistente e verificação após reload: sem acesso autenticado autorizado; criação em produção deixaria dados de teste persistentes e não há exclusão na UI.
- Teste cruzado real com duas contas, leitura e escrita: duas sessões autorizadas não disponíveis. Não substituído por mocks ou simulação SQL.
- Falha real de conectividade do Supabase no modo autenticado: sem sessão autenticada; foi executada a falha automatizada de mutation da demo e a demo sem variáveis Supabase.
- Backup/restauração: fora do escopo GF-8A (GF-8D), não solicitado nesta execução.

## 8. Riscos remanescentes

- O fluxo autenticado e a persistência frontend pós-restauração continuam sem validação operacional nesta execução.
- Isolamento entre duas identidades reais permanece sem evidência atual; a configuração RLS está presente, mas configuração não substitui o teste com sessões reais.
- A proteção contra senhas comprometidas continua desativada conforme o Advisor.
- O plano Supabase Free ainda pode pausar por inatividade; a demo automatizada segue funcionando sem backend.
- A integridade das 2 ordens foi conferida, mas não houve inspeção de conteúdo ou adequação semântica dos dados.

## 9. Resultado final

**BLOCKED.** Schema, migration, contagens, integridade, configuração de RLS, demo sem Supabase, falha simulada de mutation e qualidade local foram verificados com sucesso. O gate de operação autenticada e isolamento real entre contas não pode ser declarado aprovado sem credenciais/sessões autorizadas e um conjunto de teste controlado aprovado para persistência. Nenhum dado preexistente foi modificado.
