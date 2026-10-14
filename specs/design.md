# design.md — RASCUNHO (só começa depois do requirements.md aprovado)

> Responsável: Arquiteto.

## 1. Telas e fluxos
- Lista de produtos (semáforo: verde ≥ margem desejada, vermelho abaixo)
- Cadastro/edição de produto
- Nova compra (informar novo custo) e resultado (margem, variação, alerta, preço sugerido)
- Histórico de custos do produto

## 2. Hierarquia de componentes
<!-- árvore de componentes por tela -->

## 3. Modelo de dados
- Produto: id, nome, custoAtual, precoVenda, margemDesejada
- HistóricoDeCusto: produtoId, custo, data

## 4. Decisões de arquitetura
Registrar em `docs/adr/` (ADR-001, ADR-002…), por exemplo: React Native + Expo; dados em memória ou no aparelho; arredondamento do preço sugerido.

## 5. Glossário
Ver `docs/glossario.md`.
