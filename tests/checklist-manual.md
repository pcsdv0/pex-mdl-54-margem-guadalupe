# Checklist de teste manual (T15 e T29)

Passos na tela para os critérios de aceite CA-01 a CA-21 (`specs/requirements.md` §7), na interface da v1.2.

**Como executar:** `npm install`, depois `npx expo start` e ler o QR code com o **Expo Go** no celular. Comece com o app sem produtos. Se já houver dados, desinstale e reinstale o Expo Go, ou exclua os produtos.

**Colunas:**
- **Navegador (Claude):** o que o assistente conferiu em 14/10/2026 rodando o app no navegador (Expo web), com dependências web instaladas só durante o teste. "v1.1" = conferido na interface anterior; "v1.2" = conferido na interface atual. Não substitui o teste no celular.
- **Resultado (Expo Go):** fica em branco para a equipe preencher no aparelho (OK / falhou + observação).

## Parte 1 — fluxo principal (CA-01 a CA-11)

| CA | Passos | Resultado esperado | Navegador (Claude) | Resultado (Expo Go) |
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
| RF-05, CA-18 | Outro produto → "Nova compra" → qualquer custo → "Manter preço atual" | Volta para a lista; aviso "Compra registrada. Preço mantido em R$ …"; o custo novo aparece no histórico | Não conferido | |
| CA-09 | Fechar o Expo Go por completo (tirar dos apps recentes) e abrir de novo | Produtos, preços e histórico iguais; boas-vindas não volta | Só no navegador (recarregar a página); **no celular, não** | |

## Parte 2 — usabilidade (CA-16 a CA-21)

| CA | Passos | Resultado esperado | Navegador (Claude) | Resultado (Expo Go) |
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

Itens não conferidos pelo assistente: CA-04 na tela, CA-10 no cadastro com 0/negativo, "Manter preço atual", filtro "Na meta", "?" fora da lista, CA-09 no celular, teclado (RNF-09), tamanho real de toque (RNF-07), leitor de tela e a aparência no aparelho real.
