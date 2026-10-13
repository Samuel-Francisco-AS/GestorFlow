# GestorFlow — Roadmap executivo do ciclo 2 (GF-8 a GF-12)

**Aprovado para planejamento:** 13/10/2026  
**Baseline:** MVP GF-0 a GF-7C concluído (`52f7244`).  
**Estado:** somente planejamento; nenhuma fase nova implementada por este documento.  
**Produção atual:** https://gestorflow.pages.dev/

## 1. Objetivo e decisões

Evoluir o MVP de portfólio para um produto mais confiável, visualmente refinado e útil para MEIs e prestadores de serviço. Preservar a simplicidade e a identidade visual off-white, verde petróleo e acentos quentes, com acabamento mais maduro.

**Decisões aprovadas:**
- Priorizar recuperação/segurança **GF-8**, depois redesign **GF-9**, antes dos novos módulos.
- Permanecer com **Cloudflare Pages + Supabase Free** até que um estudo documentado prove motivo para mudança.
- Tratar **Azure for Students** como opção de laboratório e avaliação, **não como migração aprovada**. Créditos temporários não satisfazem, por si, o requisito de custo obrigatório permanente de R$ 0. Verificar termos educacionais/não comerciais e regras de cobrança antes de provisionar.
- Manter a demo independente do Supabase e contas persistentes isoladas por RLS. Não quebrar contratos de repositories.
- Usar animações com propósito, gráficos corretos e design acessível; Moto G06 é gate físico.
- Não autorizar nesta trilha provisionamento pago, alteração em produção, migração de backend, criação de cron/keepalive ou acesso a credenciais novas.

## 2. Estado operacional observado em 13/10/2026

O Supabase Free ficou inativo e foi restaurado via integração. Após a retomada, retornou `ACTIVE_HEALTHY`. Consulta SQL **somente leitura** confirmou **2 clientes** e **2 ordens de serviço**; `public.customers` e `public.work_orders` estavam com RLS ativa, e a migration `20260923175233_gf4_initial_persistence_schema` registrada.

**Limites da comprovação:** não foram executados nesta verificação login real pelo domínio, mutations do frontend, teste posterior com duas contas nem ensaio de restauração de backup. Permanecem como critérios GF-8. O Security Advisor relata aviso de proteção contra senhas vazadas desabilitada. A pausa por inatividade permanece possível no plano Free.

Referências: [Supabase: Pausing](https://supabase.com/docs/guides/platform/free-project-pausing), [Auth password security](https://supabase.com/docs/guides/auth/password-security) e [Azure for Students FAQ](https://learn.microsoft.com/en-us/azure/education-hub/faq).

## 3. Sequência executiva

| Fase | Prioridade | Resultado |
| --- | --- | --- |
| GF-8 — Recovery & Operations | P0 | Aplicação persistente validada, segurança e recuperação documentadas, decisão infra fundamentada |
| GF-9 — UI/UX Evolution | P1 | Interface 2.0, motion system, gráficos úteis, ergonomia e performance |
| GF-10 — Quotations & PDF | P1 | Orçamentos profissionais, PDF e conversão em OS |
| GF-11 — Finance Lite | P1 | Recebimentos/despesas, conciliação simples e relatórios claros |
| GF-12 — Scheduling | P2 | Agenda, prazos e lembretes com limites explícitos |

Esforço preliminar (dias úteis, sujeito a auditoria antes da fase): GF-8 **1–3**; GF-9 **4–8**; GF-10 **3–6**; GF-11 **3–6**; GF-12 **3–5**. Não são prazos contratados.

## 4. GF-8 — Recovery & Operations

**Objetivo:** recuperar confiança operacional, preservar registros e criar procedimento de contingência.

- **8A Recovery & smoke:** confirmar dados/esquema e disponibilidade; login/logout/sessão no app publicado; consulta e mutation de teste controlada; duas contas demonstrando isolamento em leitura/escrita; verificar demo sem backend e comportamento da UI durante erro. Não alterar dados existentes sem necessidade.
- **8B Continuity:** documentar procedimento de restauração, sinais de inatividade e mensagens ao usuário; reconhecer que plano Free não oferece disponibilidade garantida; não implantar keepalive artificial como solução automática sem análise de termos, necessidade e quotas.
- **8C Auth & RLS:** revisar políticas de propriedade, privilégios e controles reais de signup; `VITE_PUBLIC_SIGNUP_ENABLED` é apenas exibição; avaliar SMTP padrão e aviso de senhas vazadas sem contratar serviços.
- **8D Backup & DR:** definir/exportar backup seguro fora de repositório público, schema e dados; documentar recuperação e, quando houver ambiente isolado viável sem cobrança, testar restauração sem afetar produção. Não versionar PII ou segredos.
- **8E Azure/alternativas ADR:** comparar Supabase, Azure e eventual Cloudflare D1 em custo durante/pós-créditos, limites, manutenção, isolamento por usuário, Auth, dados, backup, risco e restrições de uso. Resultado escrito: **manter, migrar ou híbrido** com justificativa. Nenhuma migração nesta etapa.

**Gate GF-8 PASS:** base e aplicação autenticada operam; isolamento entre contas comprovado; demo íntegra; segurança, recuperação, backups e riscos documentados; nenhuma cobrança. Caso ensaio de backup não seja viável, registrar bloqueio/risco em vez de PASS sem ressalva.

**Não inclui:** migração Azure/D1, SMTP pago, novos recursos de produto, novos planos pagos.

## 5. GF-9 — UI/UX Evolution

**Objetivo:** lapidar o GestorFlow até um padrão visual comercial premium, sem virar uma coleção de efeitos decorativos.

- **9A Visual foundation:** auditoria de telas e baseline de capturas; tokens, tipografia, cores, superfícies, grid, densidade, cards, tabelas, navegação e hierarquia editorial. Manter identidade própria do GestorFlow; referência da Narys é de qualidade, não cópia de marca.
- **9B Motion foundation:** transições de navegação, drawers/sheets, feedback de salvar/status, botões, estados de carregamento e microinterações coerentes. Respeitar `prefers-reduced-motion`, foco visível e teclado. Evitar animação contínua e layout shift.
- **9C Dashboard & charts:** repensar composição, CTA, prioridade e visualização de resultados. Gráficos de faturamento, ordens por status ou evolução **somente com dados reais/coerentes**; comparações e períodos com definição explícita, estados sem dados, legenda textual e alternativa acessível. Não inventar métricas.
- **9D Feature polish:** refinar clientes, ficha, OS, buscas/filtros, formulários, confirmação, erros e estados vazios; desktop e mobile como layouts específicos.
- **9E Quality:** Vitest, Playwright, golden path demo e persistente, 360/390/768 px, contraste, motion reduzido, bundle, usabilidade e fluidez física no Moto G06; comparar antes/depois.

**Gate GF-9 PASS:** direção visual detalhada aprovada antes da codificação; revisão humana do acabamento; gráficos semanticamente corretos; fluxos intactos e sem regressão relevante de performance ou acessibilidade.

**Não inclui:** 3D pesado, animações de fachada, painéis com números inventados ou novos módulos de negócio.

## 6. GF-10 — Quotations & PDF

Criar feature `quotations` com cliente, itens/serviços, quantidades, preços exatos em centavos, totais, prazo de validade, observações e estados mínimos (rascunho, enviado, aprovado, recusado). Gerar PDF/versão de impressão preferencialmente client-side; converter orçamento aprovado em OS vinculada com proteção contra duplicidade.

**Gate:** fluxo orçamento → documento → aprovação → OS testado no demo e no persistente, RLS entre contas, totais corretos e mobile. **Fora:** nota fiscal, assinatura certificada e e-mail pago.

## 7. GF-11 — Finance Lite

Registrar valores recebidos, pendentes e despesas básicas; período, categoria e origem. **Separar explicitamente OS concluída, valor cobrado e pagamento recebido** para não inflar faturamento ou saldo. Relatórios/indicadores pequenos, confiáveis, com dados em centavos e no domínio do usuário.

**Gate:** totais reconciliados, sem dupla contagem, testes de autorização, demo e persistência consistentes, experiência mobile. **Fora:** gateway, banco, tributação e contabilidade profissional.

## 8. GF-12 — Scheduling

Agenda diária/semanal associada a cliente/OS, início, término, situação, notas e prevenção de conflitos básicos; indicadores de prazos e atrasos. Notificações apenas internas/locais se confiáveis; não prometer push/background sem infraestrutura definida.

**Gate:** criar, reagendar, filtrar e detectar conflitos na demo e no backend persistente; timezone consistente, RLS e toque acessível. **Fora:** SMS, WhatsApp, sincronização externa paga.

## 9. Gates transversais e fluxo de trabalho

1. Uma branch por fase/subfase; definir critérios de pronto e não-objetivos antes de implementar.
2. Preservar `main` e produção até auditoria e aprovação; migrations versionadas e plano de reversão; não reaplicar migration GF-4 no mesmo projeto.
3. Registrar evidências, testes e limitações honestamente, sem credenciais/dados pessoais no GitHub público.
4. Respeitar custo obrigatório R$ 0 e não usar crédito Azure como justificativa para dependência permanente.
5. Verificar responsividade, acessibilidade, demo, login e isolamento por usuário nas alterações que impactam cada fluxo.
6. Finalizar cada etapa com relatório, status, revisão independente e merge verificável.

**Próximo trabalho:** GF-8A. Este commit só registra planejamento e checkpoint: não executa deploy manual, altera schema, configura Azure nem muda código funcional.
