# CLAUDE.md — regras do projeto

Projeto: **Controle Simples de Margem de Lucro para o Mercado de Guadalupe** (PEX-MDL-54). App mobile React Native + Expo + TypeScript, feito com Spec-Driven Development (SDD).

## Fonte da verdade (ler antes de qualquer trabalho)
1. `specs/requirements.md` — o quê e por quê
2. `specs/design.md` — como
3. `specs/tasks.md` — em que ordem
4. `docs/adr/` — decisões já tomadas (não reabrir sem pedir)
5. `docs/glossario.md` — vocabulário

## Regras
- Código só implementa o que está em `tasks.md`. Uma tarefa por vez, na ordem de dependência.
- Se o código contradiz uma spec, ou falta algo, **pare e proponha a mudança na spec primeiro**; só depois mude o código. Nunca deixe a spec e o código divergirem.
- Ideia fora do escopo vai para `docs/depois.md`, não para o código.
- Dinheiro sempre em centavos inteiros (ADR-004). Regras de cálculo ficam em `src/domain`, sem importar React nem AsyncStorage.
- Uma tarefa = um commit, com o ID no início: `T04: calcular variação do custo`. Marque `[x]` em `tasks.md` no mesmo commit.
- Antes de marcar tarefa como feita: testes passando (`npm test`) e `npx tsc --noEmit` sem erros.
- Interface em português do Brasil. Texto simples, para um comerciante sem treinamento.
- Não afirme em nenhum documento que alguém da equipe é dono da mercearia.
- Fora do escopo: estoque, vendas/caixa, dashboards, login, app do cliente, backend, entrega.
