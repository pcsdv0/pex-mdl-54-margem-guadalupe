# requirements.md — RASCUNHO (aguardando aprovação do grupo)

> Responsável: Analista de requisitos. Este arquivo é a fonte da verdade do problema.

## 1. Problema (na visão do comerciante)
<!-- Escrever sem jargão técnico. O custo de compra varia com promoções e reajustes, e o preço de venda é definido por hábito, sem registro de margem. -->

## 2. Objetivo da ferramenta
Mostrar, a cada compra, a margem de lucro do produto e sugerir o preço de venda que preserva a margem desejada.

## 3. Regras de negócio
- RN-01 Margem = (preço − custo) ÷ preço
- RN-02 Preço sugerido = custo ÷ (1 − margem desejada). Exemplo: custo R$ 4,00 e margem 25% → R$ 5,33
- RN-03 Alerta quando a margem atual fica abaixo da margem desejada do produto
- RN-04 Variação do custo = (novo custo − custo anterior) ÷ custo anterior
- RN-05 <!-- arredondamento do preço sugerido: decidir (vira ADR) -->

## 4. Critérios de sucesso
- [ ] O proprietário cadastra um produto, informa um novo custo e vê margem e preço sugerido, sem ajuda
- [ ] O sistema alerta corretamente quando a margem fica abaixo da desejada
- [ ] A fórmula passa nos testes com os exemplos deste arquivo

## 5. Fora do escopo (MVP)
Estoque, vendas no caixa, relatórios e painéis, login, app do cliente, backend e entregador.

## 6. Produtos de exemplo (8 a 10, com preços reais)
| Produto | Custo (R$) | Preço de venda (R$) | Margem desejada |
| --- | --- | --- | --- |
|  |  |  |  |
