# SPEC.md — documento-mestre

Porta de entrada do projeto **Controle Simples de Margem de Lucro para o Mercado de Guadalupe** (PEX-MDL-54), feito com Spec-Driven Development (SDD). Este documento resume; quem manda são os documentos do índice.

## Objetivo e a pergunta do aplicativo
A cada compra de mercadoria, mostrar a margem de lucro do produto e sugerir o preço de venda que preserva a margem desejada.

> **Dado o custo que paguei hoje, a que preço devo vender para manter a margem desejada?**

Usuário: um comerciante, no celular, no balcão ou no recebimento de mercadoria. Sem treinamento e sem internet obrigatória.

## Escopo
- **Dentro:** cadastro de produtos (custo, preço de venda, margem desejada por produto), nova compra com prévia, resultado com o preço sugerido e a conta explicada, histórico de custos, lista com semáforo, busca e filtro, ajuda embutida, dados guardados no aparelho.
- **Como a margem é calculada:** margem bruta sobre o preço de venda, a partir do custo pago (RN-01, RN-11).
- **Fora:** impostos sobre a venda e despesas fixas (não entram no cálculo), estoque, vendas no caixa, relatórios, painéis e gráficos, tema escuro, login, app do cliente, backend, entrega e pedidos, leitor de código de barras. Ideias para depois ficam em `docs/depois.md`.

## Princípios do processo
1. **Spec primeiro.** Antes do código, a spec: `requirements.md` (o quê e por quê), depois `design.md` (como), depois `tasks.md` (em que ordem).
2. **Portões aprovados.** Cada documento só vale depois da aprovação do líder; o seguinte só começa depois.
3. **Mudança de regra começa na spec.** Se o código contradiz a spec, ou falta algo, para-se e muda-se a spec num commit `spec:` e registra-se no Registro de mudanças do `requirements.md`. Spec e código nunca divergem.
4. **Um commit por tarefa.** A mensagem começa com o ID (`T04: calcular variação do custo`) e a tarefa é marcada `[x]` no mesmo commit.
5. **Testes nas regras de cálculo.** As fórmulas ficam em `src/domain`, em centavos inteiros (ADR-004), e nascem com teste antes do código. Antes de marcar uma tarefa: `npm test` e `npx tsc --noEmit` sem erros.

## Índice
| Documento | Para quê |
| --- | --- |
| [requirements.md](requirements.md) | O quê e por quê: regras de negócio, requisitos, critérios de aceite, registro de mudanças |
| [design.md](design.md) | Como: telas, componentes, domínio, armazenamento, tema |
| [tasks.md](tasks.md) | Em que ordem: tarefas, dependências e matriz de rastreabilidade |
| [docs/adr](../docs/adr) | Decisões de arquitetura já tomadas |
| [docs/glossario.md](../docs/glossario.md) | Vocabulário do projeto ("margem desejada", "meta", "semáforo"…) |
| [docs/processo-sdd.md](../docs/processo-sdd.md) | Rastreabilidade requisito → tarefa → commit → teste |
| [README](../README.md) | Como instalar, rodar, testar e gerar o APK |

## Estado atual
- **Versão da spec:** v1.4
- **Tarefas concluídas:** 49
- **Tarefas no total:** 52
- **Requisitos funcionais:** 18
- **Requisitos não funcionais:** 12
- **Regras de negócio:** 12
- **Critérios de aceite:** 34
- **ADRs:** 7

Faltam as tarefas T15 (checklist executado no Expo Go) e T16 (revisão final), que só fecham depois de a equipe rodar o `tests/checklist-manual.md` no celular. Os números acima são conferidos por `tests/spec-mestre.test.ts`.
