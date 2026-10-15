# Checklist de teste manual (T15, T29 e T36)

Passos na tela para os critérios de aceite CA-01 a CA-25 (`specs/requirements.md` §7), na interface da v1.3.

**Antes de cada ensaio:** Ajuda ("?") → "Apagar todos os dados" → "Apagar tudo". O app volta à primeira abertura (CA-24).

**Como executar:** `npm install`, depois `npx expo start` e ler o QR code com o **Expo Go** no celular. Comece com o app sem produtos. Se já houver dados, desinstale e reinstale o Expo Go, ou exclua os produtos.

**Colunas:**
- **Navegador:** conferido no navegador (Expo web) em 14/10/2026, com dependências web instaladas só durante o teste. "v1.1", "v1.2" e "v1.3" indicam em que versão da interface foi conferido. Não substitui o teste no celular.
- **Resultado (Expo Go):** fica em branco para a equipe preencher no aparelho (OK / falhou + observação).

## Parte 1 — fluxo principal (CA-01 a CA-11)

| CA | Passos | Resultado esperado | Navegador | Resultado (Expo Go) |
| --- | --- | --- | --- | --- |
| CA-19 | Abrir o app pela primeira vez | Cartão "Boas-vindas!" com 3 linhas e botão "Entendi" | v1.2: conferido | |
| — | Com o app vazio | "Nenhum produto cadastrado", explicação curta, botões "Novo produto" e "Carregar exemplos", aviso de valores ilustrativos | v1.2: conferido | |
| CA-15 | Tocar em "Carregar exemplos" | Aviso "8 produtos de exemplo carregados"; topo "1 de 8 produtos abaixo da meta"; Refrigerante 2 L primeiro, com "Abaixo da meta", 18,8% e "Sugerido: R$ 8,67"; os outros "Na meta" | v1.2: conferido | |
| CA-10 | "Novo produto" → "Salvar produto" com tudo vazio | Mensagem embaixo de cada campo (nome, custo, preço, margem), com ícone | v1.1: conferido | |
| CA-10 | No cadastro, custo `0` e depois `-4` → "Salvar produto" | "Informe o custo. Ele precisa ser maior que zero." | Não conferido | |
| CA-02, CA-03 | Cadastrar "Produto teste": custo `4,00`, preço `5,00`, margem `25` | Aviso "Produto cadastrado"; na lista: 20,0% em vermelho, "Abaixo da meta" | v1.1: conferido | |
| CA-04 | Cadastrar "Produto 30": custo `7,00`, preço `10,00`, margem `25` | 30,0% em verde, "Na meta", sem "Sugerido" | Não conferido (coberto pelo teste automático) | |
| RNF-03 | Na lista, contar os toques: produto → "Nova compra" → digitar → "Confirmar compra" | Resultado com 3 toques | v1.2: conferido | |
| CA-10 | Em "Nova compra" do Arroz: "Confirmar compra" vazio; depois `0`; depois `-4` | Mensagem embaixo do campo; nada é gravado | v1.1: vazio e 0 conferidos; `-4` não reconferido | |
| CA-14 | Arroz → "Nova compra" → digitar `4,40` (sem confirmar) | Prévia: R$ 5,50, 20,0%, "Abaixo da meta" e "Preço para manter 25% de margem R$ 5,87". Campo vazio: só a orientação | v1.2: conferido | |
| CA-05, CA-12 | "Confirmar compra" | "Compra registrada a R$ 4,40 (antes R$ 4,00, variação +10,0%)"; cartão "Venda a R$ 5,87 para manter 25% de margem"; abaixo, R$ 5,50, 20,0%, "Abaixo da meta" e alerta | v1.2: conferido | |
| CA-13 | Tocar em "Como chegamos nisso" | Aparece "R$ 4,40 ÷ (1 − 0,25) = R$ 5,87" e "(R$ 5,50 − R$ 4,40) ÷ R$ 5,50 = 20,0%"; tocar de novo esconde | v1.2: conferido | |
| CA-07, CA-18 | "Aplicar preço sugerido (R$ 5,87)" | Volta para a lista; aviso "Preço atualizado para R$ 5,87"; Arroz R$ 5,87, 25,0%, "Na meta" | v1.2: conferido | |
| CA-06, CA-08, CA-20 | Arroz → "Ver histórico de custos" | Duas linhas, mais recente primeiro: R$ 4,40 com seta para cima, "subiu", +10,0%; R$ 4,00 com "—" e "primeira compra"; datas dd/mm/aaaa | v1.2: conferido | |
| CA-01, CA-11 | "Produto teste" → "Nova compra" → `4` → "Confirmar compra" | "Venda a R$ 5,33 para manter 25% de margem" | v1.1: conferido | |
| CA-11 | "Aplicar preço sugerido" | Lista: R$ 5,33, 25,0%, "Na meta" (verde), sem "Sugerido" | v1.1: conferido | |
| RF-05, CA-18 | Outro produto → "Nova compra" → qualquer custo → "Manter preço atual" | Volta para a lista; aviso "Compra registrada. Preço mantido em R$ …"; o custo novo aparece no histórico | v1.3: conferido (Feijão, "Compra registrada. Preço mantido em R$ 8,50") | |
| CA-09 | Fechar o Expo Go por completo (tirar dos apps recentes) e abrir de novo | Produtos, preços e histórico iguais; boas-vindas não volta | Só no navegador (recarregar a página); **no celular, não** | |

## Parte 2 — usabilidade (CA-16 a CA-21)

| CA | Passos | Resultado esperado | Navegador | Resultado (Expo Go) |
| --- | --- | --- | --- | --- |
| CA-16 | Na busca, digitar `feijao` | Só "Feijão 1 kg"; aparece o "x" para limpar | v1.2: conferido | |
| CA-16 | Com a busca `feijao`, tocar em "Abaixo da meta" | "Nenhum produto encontrado." e botão "Limpar busca e filtro" | v1.2: conferido | |
| CA-16 | Limpar a busca, filtro "Abaixo da meta"; depois "Na meta" | Só o refrigerante; depois só os que estão na meta | v1.2: "Abaixo da meta" conferido; "Na meta" não | |
| CA-17 | Tocar no "?" do topo (em qualquer tela) | Tela "Como funcionam as contas": margem, margem desejada, preço sugerido e semáforo, com o exemplo do arroz | v1.2: conferido (a partir da lista) | |
| CA-17 | Abrir um produto e ler os campos | Texto de apoio embaixo de nome, custo, preço e margem desejada | v1.2: conferido | |
| CA-18, RF-14 | Produto → preço `abc` → "Salvar alterações" | Mensagem "Valor inválido…" embaixo do campo, com borda vermelha | v1.2: conferido | |
| CA-18 | Mudar o preço para um valor válido → "Salvar alterações" | Aviso "Alterações salvas"; o cartão "Situação atual" atualiza | v1.2: conferido | |
| CA-18 | "Excluir produto" → janela → "Cancelar"; depois "Excluir" → "Excluir" | Cancelar fecha sem apagar; Excluir volta para a lista com aviso "… foi excluído" | v1.2: conferido | |
| CA-19 | "Entendi" no cartão de boas-vindas; fechar e abrir o app | O cartão não volta | v1.2: só no navegador (recarregar) | |
| CA-21 | `npm test` | Testes de contraste e varredura passam | v1.2: conferido (181 testes) | |
| RNF-06 | Olhar os selos e o histórico | Sempre cor + ícone + palavra ("Na meta", "Abaixo da meta", "subiu", "caiu") | v1.2: conferido | |
| RNF-07 | Tocar nos botões, no "?", no "x" da busca e nas opções do filtro | Fáceis de acertar com o dedo; um botão cheio por tela | Não medido no aparelho | |
| RNF-09 | Cadastro: o teclado abre no nome; "próximo" passa para custo, preço e margem; o campo em foco fica visível acima do teclado | Funciona sem precisar rolar a tela à mão | **Não conferido** (só no aparelho; no iPhone o teclado numérico não tem tecla "próximo") | |
| RNF-10 | Ligar o leitor de tela (TalkBack/VoiceOver) e passar pela lista | Cada cartão é lido como uma frase (nome, preço, margem, situação) | Rótulos conferidos no navegador; leitor de tela não testado | |

## Parte 3 — correções da v1.3 (CA-22 a CA-25)

| CA | Passos | Resultado esperado | Navegador | Resultado (Expo Go) |
| --- | --- | --- | --- | --- |
| CA-22 | Com o app vazio, tocar duas vezes rápido em "Carregar exemplos" | 8 produtos, não 16 | v1.3: conferido (clique duplo → 8) | |
| CA-22 | "Novo produto", preencher tudo, tocar duas vezes rápido em "Salvar produto" | Um produto só na lista | v1.3: conferido (clique duplo → 1) | |
| CA-22 | Na tela de resultado, tocar duas vezes rápido em "Aplicar preço sugerido" | Um aviso só; preço aplicado uma vez | v1.3: conferido | |
| CA-23 | Abrir um produto, mudar o preço **sem salvar**, tocar no "?" e voltar | O preço digitado continua no campo; "Situação atual" ainda mostra o preço salvo | v1.3: conferido (Óleo, 9,40 mantido) | |
| CA-23 | Mesma coisa, mas abrindo "Ver histórico de custos" e voltando | O preço digitado continua no campo | Não conferido (mesmo código do caso acima) | |
| CA-24 | Ajuda → "Apagar todos os dados" → "Cancelar" | Nada é apagado | v1.3: conferido | |
| CA-24 | Ajuda → "Apagar todos os dados" → "Apagar tudo" | Lista vazia, cartão de boas-vindas de volta, aviso "Todos os dados foram apagados" | v1.3: conferido | |
| CA-25 | Arroz (custo R$ 4,00) → "Nova compra" → digitar `6,50`, depois `1,90` | "Confira o valor: o custo subiu 62,5%…" e depois "…caiu 52,5%…" | v1.3: conferido | |
| CA-25 | Mesmo campo: digitar `6,00`, depois `4,40` | Sem o aviso (+50,0% e +10,0% estão dentro do limite) | v1.3: conferido | |
| CA-25 | Feijão (custo R$ 6,20) → digitar `9,50` (+53,2%) → "Confirmar compra" | O aviso aparece, mas a compra é gravada e o resultado abre normalmente | v1.3: conferido | |

**Observação do teste no navegador (v1.3):** num clique duplo em "Carregar exemplos", "Salvar produto" ou "Aplicar preço sugerido", o segundo clique pode cair num cartão da lista que acabou de aparecer e abrir aquele produto. Não grava nada; só navega. Vale ver se acontece no celular.

Itens não conferidos no navegador: CA-04 na tela, CA-10 no cadastro com 0/negativo, CA-23 voltando do Histórico, filtro "Na meta", "?" fora da lista, CA-09 no celular, teclado (RNF-09), tamanho real de toque (RNF-07), leitor de tela e a aparência no aparelho real.
