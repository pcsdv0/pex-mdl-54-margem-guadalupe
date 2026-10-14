# requirements.md

> Estado: **v1.1 — aprovada pelo líder (portão 1).** Mudanças desde a v1.0 no registro de mudanças, no fim. Fonte da verdade do problema. Qualquer mudança aqui vem antes de mudar design, tarefas ou código.

## 1. Problema (na visão do comerciante)
O Mercado de Guadalupe é uma mercearia de bairro: o cliente entra e compra. O custo de compra dos produtos muda com promoções e reajustes dos fornecedores, mas o preço de venda costuma ser mantido por hábito. Sem registro, o comerciante não sabe se ainda lucra o que pretende em cada produto.

## 2. Objetivo da ferramenta
A cada compra de mercadoria, mostrar a margem de lucro do produto e sugerir o preço de venda que preserva a margem desejada.

Pergunta que o app responde: **"dado o custo que paguei hoje, a que preço devo vender para manter a minha margem?"**

## 3. Usuário
Um comerciante, usando o celular no balcão ou no recebimento de mercadoria. Sem treinamento, sem internet obrigatória.

## 4. Regras de negócio
Valores monetários são tratados em **centavos (inteiros)**; porcentagens em número (25 = 25%).

- **RN-01 Margem** = (preço − custo) ÷ preço. Exibida em %, com 1 casa decimal. Pode ser negativa.
- **RN-02 Preço sugerido** = custo ÷ (1 − margem desejada). Exemplo: custo R$ 4,00 e margem 25% → R$ 5,33.
- **RN-03 Alerta**: há alerta quando o preço de venda é menor que o preço sugerido (RN-02, RN-06) para o custo atual. Fora da diferença do arredondamento, equivale a "margem atual menor que a desejada".
- **RN-04 Variação do custo** = (novo custo − custo anterior) ÷ custo anterior, em %, com 1 casa decimal e sinal (ex.: +10,0%, −5,0%). Sem custo anterior, não há variação (exibir "—").
- **RN-05 Semáforo**: verde quando o preço de venda ≥ preço sugerido; vermelho (com alerta, RN-03) quando abaixo. Assim, depois de aplicar o preço sugerido o produto fica sempre verde, mesmo que o arredondamento deixe a margem décimos abaixo da desejada (ADR-003).
- **RN-06 Arredondamento**: o preço sugerido é arredondado ao centavo mais próximo (5,3333… → R$ 5,33). Ver ADR-003.
- **RN-07 Validação**: nome obrigatório; custo > 0; preço de venda > 0; margem desejada inteira entre 1 e 99. A regra do custo vale também para o novo custo na tela Nova compra.
- **RN-08 Leitura de valores**: o campo de dinheiro aceita vírgula ou ponto como separador decimal ("5,33" ou "5.33"), com até 2 casas, sem separador de milhar ("1.234" é recusado). Datas são exibidas como dd/mm/aaaa.

## 5. Requisitos funcionais
| ID | Requisito | Regras |
| --- | --- | --- |
| RF-01 | Cadastrar produto com nome, custo atual, preço de venda e margem desejada | RN-07 |
| RF-02 | Editar e excluir produto. Na edição, o custo é só leitura (custo muda apenas por "Nova compra"). Excluir apaga também o histórico de custos do produto | RN-07 |
| RF-03 | Listar produtos com margem atual e semáforo | RN-01, RN-05 |
| RF-04 | Registrar nova compra (novo custo) e mostrar: nova margem com o preço atual, variação do custo, alerta e preço sugerido. A compra é gravada ao confirmar o novo custo | RN-01 a RN-04, RN-06, RN-07 |
| RF-05 | Aplicar o preço sugerido (atualiza o preço de venda) ou manter o preço atual (só volta para a lista; a compra já foi gravada) | RN-01, RN-05 |
| RF-06 | Consultar o histórico de custos do produto (data e custo, mais recente primeiro) | RN-04 |
| RF-07 | Guardar os dados no aparelho, preservando-os ao fechar o app | — |
| RF-08 | Carregar produtos de exemplo para demonstração | — |

## 6. Requisitos não funcionais
- RNF-01 Funciona offline.
- RNF-02 Interface em português do Brasil, valores em R$ (formato 5,33), leitura conforme RN-08.
- RNF-03 Registrar uma nova compra em no máximo 3 toques a partir da lista.
- RNF-04 Fórmulas cobertas por testes automatizados.

## 7. Critérios de aceite
- **CA-01 (RF-04, RN-02, RN-06)** Dado custo R$ 4,00 e margem desejada 25%, quando registro a compra, então o preço sugerido é R$ 5,33.
- **CA-02 (RN-01)** Dado custo R$ 4,00 e preço R$ 5,00, então a margem é 20,0%.
- **CA-03 (RN-03, RN-05)** Dado margem desejada 25% e margem atual 20,0%, então o produto aparece em vermelho com alerta.
- **CA-04 (RN-05)** Dado margem atual 30% e desejada 25%, então o produto aparece em verde, sem alerta.
- **CA-05 (RN-04)** Dado custo anterior R$ 4,00 e novo custo R$ 4,40, então a variação é +10,0%.
- **CA-06 (RN-04)** Primeiro custo de um produto não exibe variação ("—").
- **CA-07 (RF-05)** Ao aplicar o preço sugerido, o preço de venda muda e a margem passa a ser igual ou maior que a desejada (dentro do arredondamento).
- **CA-08 (RF-06)** Após duas compras, o histórico mostra os dois custos, mais recente primeiro.
- **CA-09 (RF-07)** Ao fechar e reabrir o app, produtos e histórico continuam lá.
- **CA-10 (RN-07)** Custo zero, negativo ou vazio é recusado com mensagem clara, no cadastro do produto e na tela Nova compra.
- **CA-11 (RF-05, RN-05)** Dado custo R$ 4,00, preço R$ 5,00 e margem desejada 25%, quando aplico o preço sugerido (R$ 5,33), então o produto fica verde e sem alerta, embora a margem real seja 24,95% (exibida 25,0%).

## 8. Fora do escopo (MVP)
Estoque, vendas no caixa, relatórios e painéis, login, app do cliente, backend e servidor, entrega e pedidos, leitor de código de barras, impostos e despesas fixas.

## 9. Produtos de exemplo (RF-08)
Valores **ilustrativos**, para demonstração; trocar pelos reais do mercado antes da apresentação, se possível.

| Produto | Custo (R$) | Preço de venda (R$) | Margem desejada |
| --- | --- | --- | --- |
| Arroz 1 kg | 4,00 | 5,50 | 25% |
| Feijão 1 kg | 6,20 | 8,50 | 25% |
| Açúcar 1 kg | 3,30 | 4,50 | 25% |
| Óleo de soja 900 ml | 6,80 | 8,90 | 20% |
| Café 250 g | 9,50 | 12,90 | 25% |
| Leite 1 L | 4,10 | 5,40 | 20% |
| Macarrão 500 g | 3,00 | 4,20 | 25% |
| Refrigerante 2 L | 6,50 | 8,00 | 25% |

(Na carga inicial, o refrigerante nasce em vermelho: margem 18,8% contra 25% desejada, e os demais em verde. Na demonstração, a nova compra do arroz a R$ 4,40 leva a margem de 27,3% a 20,0%, vermelha, e o preço sugerido é R$ 5,87.)

## 10. Perguntas em aberto
- Os preços e margens reais de 8 a 10 produtos do mercado (para trocar os de exemplo).
- A margem desejada é a mesma para todos os produtos ou varia por categoria? (MVP: por produto.)

## 11. Registro de mudanças
| Versão | Data | O que mudou | Por quê |
| --- | --- | --- | --- |
| v1.0 | — | Versão inicial. | — |
| v1.1 | 14/10/2026 | **RN-03 e RN-05:** o semáforo e o alerta passam a comparar o preço de venda com o preço sugerido, e não mais a margem atual com a desejada. Novo **CA-11**. | Erro achado na revisão das specs, **antes de escrever código**: com custo R$ 4,00 e margem desejada 25%, aplicar o preço sugerido de R$ 5,33 deixava a margem real em 24,95%. Pela regra antiga (margem ≥ desejada), o produto continuava **vermelho e com alerta**, embora a tela mostrasse 25,0%. Isso contradizia o CA-07 e o ADR-003. Em preços baixos a diferença é maior (custo R$ 0,10 a 25% → R$ 0,13, margem 23,1%). A regra nova dá o mesmo resultado da antiga fora da faixa do arredondamento. Os CA-01 a CA-10 e os exemplos do §9 foram reconferidos e continuam iguais. |
| v1.1 | 14/10/2026 | **Fluxo:** tocar no produto abre a tela Produto, com os botões "Nova compra" e "Ver histórico" (design §2). | O fluxo da RNF-03 citava o botão "Nova compra", mas nenhuma tela o tinha. |
| v1.1 | 14/10/2026 | **RF-02:** custo só leitura na edição; excluir produto apaga o histórico dele. | Editar o custo pelo formulário quebraria o histórico; um histórico sem produto ficaria órfão. |
| v1.1 | 14/10/2026 | **RF-04/RF-05:** a compra é gravada ao confirmar o novo custo; "Manter preço" só volta para a lista. | Não estava definido em que momento a compra era gravada. |
| v1.1 | 14/10/2026 | **RN-07 e CA-10:** margem desejada inteira; a validação do custo vale também na tela Nova compra. | Ambiguidade: a regra só citava o cadastro. |
| v1.1 | 14/10/2026 | **RN-04 e RN-08 (nova):** variação com sinal; leitura de valores com vírgula ou ponto, até 2 casas, sem milhar; data dd/mm/aaaa. | Formatos não estavam definidos. |
| v1.1 | 14/10/2026 | **design §5:** contrato das bordas das funções de domínio (preço ≤ 0, custo anterior nulo, custo zero, cálculo com inteiros). | Evitar divisão por zero e erro de ponto flutuante (ex.: 410 ÷ 0,8 = 512,4999…). |
| v1.1 | 14/10/2026 | **design §5:** `validarCusto` recebe centavos já lidos, e não o texto digitado. | A T06 não depende da T07 (`parseReais`); assim a ordem das tarefas continua válida. |
| v1.1 | 14/10/2026 | **design §3/§7 e T10:** componente `Botao` (botão grande); `EstadoVazio`, `LinhaInfo` e `LinhaHistorico` ficam dentro das telas. | Botões grandes em todas as telas pedem um componente comum; os outros três não estavam na lista de pastas do §7. |
