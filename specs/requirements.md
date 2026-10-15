# requirements.md

> Estado: **v1.3 — aprovada pelo líder (portão 1).** Mudanças desde a v1.0 no registro de mudanças, no fim. Fonte da verdade do problema. Qualquer mudança aqui vem antes de mudar design, tarefas ou código.

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
- **RN-09 Conferência do custo** (v1.3): quando a variação do novo custo em relação ao custo atual passa de +50% ou fica abaixo de −50%, o app mostra "Confira o valor". É só um aviso: a compra pode ser gravada mesmo assim. Exatamente +50% ou −50% não avisa.

## 5. Requisitos funcionais
| ID | Requisito | Regras |
| --- | --- | --- |
| RF-01 | Cadastrar produto com nome, custo atual, preço de venda e margem desejada. Tocar duas vezes em salvar não cria produto repetido | RN-07 |
| RF-02 | Editar e excluir produto. Na edição, o custo é só leitura (custo muda apenas por "Nova compra"). Excluir apaga também o histórico de custos do produto | RN-07 |
| RF-03 | Listar produtos com margem atual e semáforo | RN-01, RN-05 |
| RF-04 | Registrar nova compra (novo custo) e mostrar: nova margem com o preço atual, variação do custo, alerta e preço sugerido. A compra é gravada ao confirmar o novo custo | RN-01 a RN-04, RN-06, RN-07 |
| RF-05 | Aplicar o preço sugerido (atualiza o preço de venda) ou manter o preço atual (só volta para a lista; a compra já foi gravada) | RN-01, RN-05 |
| RF-06 | Consultar o histórico de custos do produto (data e custo, mais recente primeiro) | RN-04 |
| RF-07 | Guardar os dados no aparelho, preservando-os ao fechar o app | — |
| RF-08 | Carregar produtos de exemplo para demonstração. Tocar duas vezes em "Carregar exemplos" carrega os 8 produtos uma vez só | — |
| RF-09 | **Resposta em destaque:** na tela de resultado, um cartão grande responde à pergunta do app ("Venda a R$ 5,87 para manter 25% de margem"). Abaixo dele, a situação atual: preço, margem e semáforo com ícone e texto | RN-01, RN-02, RN-05, RN-06 |
| RF-10 | **"Como chegamos nisso":** área que abre e fecha, com a conta feita com os números do produto e em linguagem simples (ex.: "R$ 4,40 ÷ (1 − 0,25) = R$ 5,87" e "(R$ 5,50 − R$ 4,40) ÷ R$ 5,50 = 20,0%") | RN-01, RN-02, RN-06 |
| RF-11 | **Prévia ao digitar:** na tela Nova compra, enquanto o novo custo é digitado, mostrar em tempo real a margem com o preço atual, o semáforo e o preço sugerido. Sem valor válido, mostrar só uma orientação | RN-01, RN-02, RN-05, RN-08 |
| RF-12 | **Lista mais útil:** produtos abaixo da meta primeiro (depois em ordem alfabética); resumo de uma frase no topo ("1 de 8 produtos abaixo da meta"), sem gráficos nem painéis; busca por nome (sem diferenciar maiúsculas e acentos); filtro Todos / Abaixo da meta / Na meta. O cartão vermelho mostra o preço sugerido ("Sugerido: R$ 8,67") | RN-02, RN-05 |
| RF-13 | **Ajuda embutida:** textos curtos de apoio nos campos do formulário e um botão "?" no topo das telas, que abre uma tela de ajuda: o que é margem, margem desejada, preço sugerido e semáforo, com o exemplo do arroz | RN-01, RN-02, RN-05 |
| RF-14 | **Feedback:** aviso rápido na tela depois de cadastrar, salvar, aplicar preço, manter preço e excluir. Mensagens de erro sempre junto ao campo. A exclusão é confirmada numa janela do próprio app | RN-07 |
| RF-15 | **Boas-vindas:** na primeira abertura, um cartão curto (3 linhas) explica o que o app faz. Pode ser dispensado e não volta depois (fica guardado no aparelho) | — |
| RF-17 | **Apagar todos os dados** (v1.3): no fim da tela Ajuda, um botão apaga produtos, histórico e preferências, depois de confirmação numa janela do app, e o app volta ao estado de primeira abertura (com as boas-vindas) | — |
| RF-18 | **Conferência do custo** (v1.3): na prévia da Nova compra, aviso "Confira o valor" quando a variação passa dos limites da RN-09; não impede a gravação | RN-04, RN-09 |
| RF-16 | **Histórico com sentido da variação:** cada compra mostra seta para cima e "subiu" (vermelho) ou seta para baixo e "caiu" (verde), além da variação em % | RN-04 |

## 6. Requisitos não funcionais
- RNF-01 Funciona offline.
- RNF-02 Interface em português do Brasil, valores em R$ (formato 5,33), leitura conforme RN-08.
- RNF-03 Registrar uma nova compra em no máximo 3 toques a partir da lista.
- RNF-04 Fórmulas cobertas por testes automatizados.
- RNF-05 **Tema único:** cores, espaçamentos (escala de 4/8), 5 tamanhos de fonte, raios e sombras definidos em `src/theme`. Nenhuma cor ou tamanho solto nas telas e componentes (verificado por teste automatizado).
- RNF-06 **Contraste:** texto com contraste mínimo de 4,5:1 sobre o fundo (verificado por teste automatizado). Semáforo sempre com cor + ícone + palavra ("Na meta", "Abaixo da meta").
- RNF-07 **Toque e destaque:** áreas de toque de pelo menos 48 px; um botão principal por tela, claramente destacado; botões secundários visualmente mais fracos.
- RNF-08 **Números em destaque:** preço e margem grandes e alinhados (algarismos de largura fixa); rótulos pequenos e discretos.
- RNF-09 **Teclado:** o teclado não cobre o campo em foco; tecla "próximo" passa ao campo seguinte; foco automático no primeiro campo.
- RNF-10 **Acessibilidade:** botões e ícones com rótulo de acessibilidade (`accessibilityLabel`) em português.

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
- **CA-12 (RF-09)** Dado o arroz (preço R$ 5,50, margem desejada 25%) e nova compra a R$ 4,40, a tela de resultado mostra em destaque "Venda a R$ 5,87 para manter 25% de margem" e, abaixo, preço R$ 5,50, margem 20,0% e "Abaixo da meta".
- **CA-13 (RF-10)** No mesmo caso, "Como chegamos nisso" mostra "R$ 4,40 ÷ (1 − 0,25) = R$ 5,87" e "(R$ 5,50 − R$ 4,40) ÷ R$ 5,50 = 20,0%".
- **CA-14 (RF-11)** Na Nova compra do arroz (preço R$ 5,50, margem 25%), ao digitar 4,40 e antes de confirmar, a prévia mostra margem 20,0%, "Abaixo da meta" e sugerido R$ 5,87. Com o campo vazio ou inválido, não mostra números.
- **CA-15 (RF-12)** Com os exemplos carregados, o topo mostra "1 de 8 produtos abaixo da meta", o refrigerante aparece primeiro e o cartão dele mostra "Sugerido: R$ 8,67".
- **CA-16 (RF-12)** A busca "feijao" mostra só "Feijão 1 kg"; o filtro "Abaixo da meta" mostra só o refrigerante; uma busca sem resultado mostra uma mensagem.
- **CA-17 (RF-13)** O botão "?" abre a ajuda com margem, margem desejada, preço sugerido, semáforo e o exemplo do arroz; os campos do formulário mostram texto de apoio.
- **CA-18 (RF-14)** Depois de salvar, aplicar preço e excluir aparece um aviso na tela; excluir pede confirmação numa janela do app.
- **CA-19 (RF-15)** O cartão de boas-vindas aparece na primeira abertura; depois de dispensado, não volta ao reabrir o app.
- **CA-20 (RF-16)** No histórico do arroz após a compra a R$ 4,40, a linha de R$ 4,40 mostra seta para cima, "subiu" e +10,0%; a de R$ 4,00 mostra "—".
- **CA-22 (RF-01, RF-08)** Tocar duas vezes rápido em "Carregar exemplos" deixa 8 produtos, não 16; tocar duas vezes em "Salvar produto" cadastra um produto só.
- **CA-23 (RF-02)** Na edição de um produto, o que foi digitado e ainda não salvo continua nos campos depois de abrir a Ajuda ("?") ou o Histórico e voltar.
- **CA-24 (RF-17)** Em Ajuda → "Apagar todos os dados" → confirmar, a lista fica vazia e o cartão de boas-vindas volta; "Cancelar" não apaga nada.
- **CA-25 (RF-18, RN-09)** Na Nova compra do arroz (custo R$ 4,00), digitar 6,50 (+62,5%) ou 1,90 (−52,5%) mostra "Confira o valor"; digitar 4,40 (+10,0%) ou 6,00 (+50,0%) não mostra; com o aviso, "Confirmar compra" grava normalmente.
- **CA-21 (RNF-05, RNF-06)** O teste automatizado confirma contraste ≥ 4,5:1 nos pares de texto do tema e nenhuma cor ou tamanho de fonte solto em `src/screens` e `src/components`.

## 8. Fora do escopo (MVP)
Estoque, vendas no caixa, relatórios, painéis e gráficos, tema escuro, animações pesadas, login, app do cliente, backend e servidor, entrega e pedidos, leitor de código de barras, impostos e despesas fixas.

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
| v1.1 | 14/10/2026 | **design §3/§7 e T10:** componentes `Botao` (botão grande) e `Campo` (campo de texto base, também usado no nome); `EstadoVazio`, `LinhaInfo` e `LinhaHistorico` ficam dentro das telas. | Botões grandes em todas as telas pedem um componente comum; os outros três não estavam na lista de pastas do §7. |
| v1.2 | 14/10/2026 | **RF-09 a RF-16, RNF-05 a RNF-10, CA-12 a CA-21:** resposta em destaque, "Como chegamos nisso", prévia ao digitar, lista com resumo/ordem/busca/filtro, ajuda embutida, avisos de confirmação, boas-vindas, setas no histórico, tema único, contraste, toque, teclado e acessibilidade. Gráficos, tema escuro e animações pesadas entram no "fora do escopo". As regras RN-01 a RN-08 não mudaram. | Melhorar a usabilidade e a didática. O diagnóstico das telas da v1.1 mostrou que a resposta ao comerciante ficava escondida entre outros números, que as contas não eram explicadas, que a lista não dizia o que precisava de atenção e que não havia retorno depois das ações. |
| v1.2 | 14/10/2026 | **design §7 e §10, tasks:** a varredura de cores/tamanhos soltos e de rótulos de acessibilidade fica em `tests/varredura.test.ts`; o contraste continua em `tests/tema.test.ts`. | Separar a checagem do código das telas da checagem dos valores do tema. |
| v1.3 | 14/10/2026 | **RF-01, RF-08, CA-22:** tocar duas vezes em "Salvar produto" ou "Carregar exemplos" não duplica produtos. | Erro achado na auditoria, lendo o código: `ListaProdutos.tsx` e `ProdutoForm.tsx` não bloqueavam o botão enquanto gravavam. Um toque duplo, comum ao vivo, criava 16 produtos de exemplo ou dois produtos iguais. |
| v1.3 | 14/10/2026 | **RF-02, CA-23:** o que foi digitado na edição e não salvo não se perde ao abrir a Ajuda ou o Histórico. | Erro achado na auditoria: a tela Produto recarregava os campos sempre que voltava ao foco e apagava, sem aviso, o que o comerciante tinha digitado. |
| v1.3 | 14/10/2026 | **RF-17, CA-24:** "Apagar todos os dados" no fim da Ajuda, com confirmação. | Não havia como voltar o app ao estado inicial entre ensaios e antes da apresentação. |
| v1.3 | 14/10/2026 | **RN-09, RF-18, CA-25:** aviso "Confira o valor" quando a variação do custo passa de ±50%. Só avisa. | O custo não pode ser corrigido depois de gravado; o aviso pega o erro de digitação mais provável ("440" no lugar de "4,40") antes de confirmar. |
| v1.3 | 14/10/2026 | **design e tasks:** alinhados ao código (nomes do repositório, rótulos, frases do resumo, tamanhos de fonte); T15 cobre CA-01 a CA-25 e T16 reaberta até a T15 fechar. | A auditoria encontrou divergências entre design e código e uma tarefa marcada como feita antes da sua dependência. |
