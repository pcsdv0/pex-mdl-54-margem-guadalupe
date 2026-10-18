# Checklist de teste manual (T15, T29, T36, T45 e T50)

Passos na tela para os critérios de aceite CA-01 a CA-25 (`specs/requirements.md` §7), na interface da v1.4.

**Antes de cada ensaio:** Ajuda ("?") → "Apagar todos os dados" → "Apagar tudo". O app volta à primeira abertura (CA-24).

**Como executar:** `npm install`, depois `npx expo start` e ler o QR code com o **Expo Go** no celular. Comece com o app sem produtos. Se já houver dados, desinstale e reinstale o Expo Go, ou exclua os produtos.

**Colunas:**
- **Navegador:** conferido no navegador (Expo web) em 14/10/2026, com dependências web instaladas só durante o teste. "v1.1", "v1.2" e "v1.3" indicam em que versão da interface foi conferido. Não substitui o teste no celular.
- **Resultado (Expo Go):** a equipe preenche no aparelho (OK / falhou + observação). O "☐" marca o que ainda não foi executado no celular. Nenhum resultado do celular foi preenchido pelo desenvolvimento: T15 e T16 só fecham quando esta coluna estiver completa.

## Parte 1 — fluxo principal (CA-01 a CA-11)

| CA | Passos | Resultado esperado | Navegador | Resultado (Expo Go) |
| --- | --- | --- | --- | --- |
| CA-19 | Abrir o app pela primeira vez | Cartão "Boas-vindas!" com 3 linhas e botão "Entendi" | v1.2: conferido | ☐ |
| — | Com o app vazio | "Nenhum produto cadastrado", explicação curta, botões "Novo produto" e "Carregar exemplos", aviso de valores ilustrativos | v1.2: conferido | ☐ |
| CA-15 | Tocar em "Carregar exemplos" | Aviso "8 produtos de exemplo carregados"; topo "1 de 8 produtos abaixo da meta"; Refrigerante 2 L primeiro, com "Abaixo da meta", 18,8% e "Sugerido: R$ 8,67"; os outros "Na meta" | v1.2: conferido | ☐ |
| CA-10 | "Novo produto" → "Salvar produto" com tudo vazio | Mensagem embaixo de cada campo (nome, custo, preço, margem), com ícone | v1.1: conferido | ☐ |
| CA-10 | No cadastro, custo `0` e depois `-4` → "Salvar produto" | "Informe o custo. Ele precisa ser maior que zero." | Não conferido | ☐ |
| CA-02, CA-03 | Cadastrar "Produto teste": custo `4,00`, preço `5,00`, margem `25` | Aviso "Produto cadastrado"; na lista: 20,0% em vermelho, "Abaixo da meta" | v1.1: conferido | ☐ |
| CA-04 | Cadastrar "Produto 30": custo `7,00`, preço `10,00`, margem `25` | 30,0% em verde, "Na meta", sem "Sugerido" | Não conferido (coberto pelo teste automático) | ☐ |
| RNF-03 | Na lista, contar os toques: produto → "Nova compra" → digitar → "Confirmar compra" | Resultado com 3 toques | v1.2: conferido | ☐ |
| CA-10 | Em "Nova compra" do Arroz: "Confirmar compra" vazio; depois `0`; depois `-4` | Mensagem embaixo do campo; nada é gravado | v1.1: vazio e 0 conferidos; `-4` não reconferido | ☐ |
| CA-14 | Arroz → "Nova compra" → digitar `4,40` (sem confirmar) | Prévia: R$ 5,50, 20,0%, "Abaixo da meta" e "Preço para manter 25% de margem R$ 5,87". Campo vazio: só a orientação | v1.2: conferido | ☐ |
| CA-05, CA-12 | "Confirmar compra" | "Compra registrada a R$ 4,40 (antes R$ 4,00, variação +10,0%)"; cartão "Venda a R$ 5,87 para manter 25% de margem"; abaixo, R$ 5,50, 20,0%, "Abaixo da meta" e alerta | v1.2: conferido | ☐ |
| CA-13 | Tocar em "Como chegamos nisso" | Aparece "R$ 4,40 ÷ (1 − 0,25) = R$ 5,87" e "(R$ 5,50 − R$ 4,40) ÷ R$ 5,50 = 20,0%"; tocar de novo esconde | v1.2: conferido | ☐ |
| CA-07, CA-18 | "Aplicar preço sugerido (R$ 5,87)" | Volta para a lista; aviso "Preço atualizado para R$ 5,87"; Arroz R$ 5,87, 25,0%, "Na meta" | v1.2: conferido | ☐ |
| CA-06, CA-08, CA-20 | Arroz → "Ver histórico de custos" | Duas linhas, mais recente primeiro: R$ 4,40 com seta para cima, "subiu", +10,0%; R$ 4,00 com "—" e "primeira compra"; datas dd/mm/aaaa | v1.2: conferido | ☐ |
| CA-01, CA-11 | "Produto teste" → "Nova compra" → `4` → "Confirmar compra" | "Venda a R$ 5,33 para manter 25% de margem" | v1.1: conferido | ☐ |
| CA-11 | "Aplicar preço sugerido" | Lista: R$ 5,33, 25,0%, "Na meta" (verde), sem "Sugerido" | v1.1: conferido | ☐ |
| RF-05, CA-18 | Outro produto → "Nova compra" → qualquer custo → "Manter preço atual" | Volta para a lista; aviso "Compra registrada. Preço mantido em R$ …"; o custo novo aparece no histórico | v1.3: conferido (Feijão, "Compra registrada. Preço mantido em R$ 8,50") | |
| CA-09 | Fechar o Expo Go por completo (tirar dos apps recentes) e abrir de novo | Produtos, preços e histórico iguais; boas-vindas não volta | Só no navegador (recarregar a página); **no celular, não** | ☐ |

## Parte 2 — usabilidade (CA-16 a CA-21)

| CA | Passos | Resultado esperado | Navegador | Resultado (Expo Go) |
| --- | --- | --- | --- | --- |
| CA-16 | Na busca, digitar `feijao` | Só "Feijão 1 kg"; aparece o "x" para limpar | v1.2: conferido | ☐ |
| CA-16 | Com a busca `feijao`, tocar em "Abaixo da meta" | "Nenhum produto encontrado." e botão "Limpar busca e filtro" | v1.2: conferido | ☐ |
| CA-16 | Limpar a busca, filtro "Abaixo da meta"; depois "Na meta" | Só o refrigerante; depois só os que estão na meta | v1.2: "Abaixo da meta" conferido; "Na meta" não | ☐ |
| CA-17 | Tocar no "?" do topo (em qualquer tela) | Tela "Ajuda": margem, margem desejada, preço sugerido e semáforo, com o exemplo do arroz | v1.2: conferido (a partir da lista) | ☐ |
| CA-17 | Abrir um produto e ler os campos | Texto de apoio embaixo de nome, custo, preço e margem desejada | v1.2: conferido | ☐ |
| CA-18, RF-14 | Produto → preço `abc` → "Salvar alterações" | Mensagem "Valor inválido…" embaixo do campo, com borda vermelha | v1.2: conferido | ☐ |
| CA-18 | Mudar o preço para um valor válido → "Salvar alterações" | Aviso "Alterações salvas"; o cartão "Situação atual" atualiza | v1.2: conferido | ☐ |
| CA-18 | "Excluir produto" → janela → "Cancelar"; depois "Excluir" → "Excluir" | Cancelar fecha sem apagar; Excluir volta para a lista com aviso "… foi excluído" | v1.2: conferido | ☐ |
| CA-19 | "Entendi" no cartão de boas-vindas; fechar e abrir o app | O cartão não volta | v1.2: só no navegador (recarregar) | ☐ |
| CA-21 | `npm test` | Testes de contraste e varredura passam | v1.2: conferido (181 testes) | ☐ |
| RNF-06 | Olhar os selos e o histórico | Sempre cor + ícone + palavra ("Na meta", "Abaixo da meta", "subiu", "caiu") | v1.2: conferido | ☐ |
| RNF-07 | Tocar nos botões, no "?", no "x" da busca e nas opções do filtro | Fáceis de acertar com o dedo; um botão cheio por tela | Não medido no aparelho | ☐ |
| RNF-09 | Cadastro: o teclado abre no nome; "próximo" passa para custo, preço e margem; o campo em foco fica visível acima do teclado | Funciona sem precisar rolar a tela à mão | **Não conferido** (só no aparelho; no iPhone o teclado numérico não tem tecla "próximo") | ☐ |
| RNF-10 | Ligar o leitor de tela (TalkBack/VoiceOver) e passar pela lista | Cada cartão é lido como uma frase (nome, preço, margem, situação) | Rótulos conferidos no navegador; leitor de tela não testado | ☐ |

## Parte 3 — correções da v1.3 (CA-22 a CA-25)

| CA | Passos | Resultado esperado | Navegador | Resultado (Expo Go) |
| --- | --- | --- | --- | --- |
| CA-22 | Com o app vazio, tocar duas vezes rápido em "Carregar exemplos" | 8 produtos, não 16 | v1.3: conferido (clique duplo → 8) | ☐ |
| CA-22 | "Novo produto", preencher tudo, tocar duas vezes rápido em "Salvar produto" | Um produto só na lista | v1.3: conferido (clique duplo → 1) | ☐ |
| CA-22 | Na tela de resultado, tocar duas vezes rápido em "Aplicar preço sugerido" | Um aviso só; preço aplicado uma vez | v1.3: conferido | ☐ |
| CA-23 | Abrir um produto, mudar o preço **sem salvar**, tocar no "?" e voltar | O preço digitado continua no campo; "Situação atual" ainda mostra o preço salvo | v1.3: conferido (Óleo, 9,40 mantido) | ☐ |
| CA-23 | Mesma coisa, mas abrindo "Ver histórico de custos" e voltando | O preço digitado continua no campo | Não conferido (mesmo código do caso acima) | ☐ |
| CA-24 | Ajuda → "Apagar todos os dados" → "Cancelar" | Nada é apagado | v1.3: conferido | ☐ |
| CA-24 | Ajuda → "Apagar todos os dados" → "Apagar tudo" | Lista vazia, cartão de boas-vindas de volta, aviso "Todos os dados foram apagados" | v1.3: conferido | ☐ |
| CA-25 | Arroz (custo R$ 4,00) → "Nova compra" → digitar `6,50`, depois `1,90` | "Confira o valor: o custo subiu 62,5%…" e depois "…caiu 52,5%…" | v1.3: conferido | ☐ |
| CA-25 | Mesmo campo: digitar `6,00`, depois `4,40` | Sem o aviso (+50,0% e +10,0% estão dentro do limite) | v1.3: conferido | ☐ |
| CA-25 | Feijão (custo R$ 6,20) → digitar `9,50` (+53,2%) → "Confirmar compra" | O aviso aparece, mas a compra é gravada e o resultado abre normalmente | v1.3: conferido | ☐ |

## Parte 4 — v1.4: apresentação (CA-26 a CA-30)

| CA | Passos | Resultado esperado | Navegador | Resultado (Expo Go) |
| --- | --- | --- | --- | --- |
| CA-28 | Arroz → "Nova compra" → digitar `4,4` e tocar fora do campo | O campo mostra `4,40`, com "R$" inteiro à esquerda | v1.4: conferido (`4,4` → `4,40`) | ☐ |
| CA-28 | No mesmo campo, digitar `abc` e tocar fora | O texto fica como está e aparece "Valor inválido…" ao confirmar | Teste automático (render.test) | ☐ |
| CA-25 | Mesmo campo: digitar `440` | "Confira o valor: o custo subiu 10.900,0%…", sem bloquear | v1.4: conferido | ☐ |
| CA-26 | Arroz (custo R$ 4,00) → "Nova compra" → `4` → "Confirmar compra" → "Manter preço atual" → "Ver histórico de custos" | Duas linhas de R$ 4,00; a de cima com "igual" e 0,0% | v1.4: conferido (com R$ 4,40: "igual", 0,0%) | ☐ |
| CA-27 | Com os exemplos carregados, Arroz (R$ 4,00 / R$ 5,50) → "Nova compra" → `4` → "Confirmar compra" | "Seu preço de R$ 5,50 já garante 25% de margem" e "O mínimo para manter 25% é R$ 5,33."; botão principal "Manter preço atual (R$ 5,50)"; abaixo, "Usar o preço sugerido (R$ 5,33)" | v1.4: conferido com preço igual ao sugerido ("Esse é o preço sugerido."); o texto do caso R$ 5,50 está no teste automático | ☐ |
| CA-30 | Ajuda → "Apagar todos os dados" → "Apagar tudo" → "Carregar exemplos". Repetir 3 vezes | Sempre 8 produtos; refrigerante primeiro, 18,8%, "Sugerido: R$ 8,67"; arroz R$ 5,50 | Teste automático (4 repetições) | ☐ |
| Demo | Lista → Arroz → Nova compra `4,40` → Resultado "Venda a R$ 5,87 para manter 25% de margem" → "Como chegamos nisso" (R$ 4,40 ÷ (1 − 0,25) = R$ 5,87) → "Aplicar preço sugerido" → Lista com arroz verde e aviso "Preço atualizado para R$ 5,87" → Histórico com +10,0% | Cada passo funciona sem travar | v1.4: conferido do começo ao fim | ☐ |

## Parte 4b — acabamento (CA-31 a CA-34 e estados)

| CA | Passos | Resultado esperado | Navegador | Resultado (Expo Go) |
| --- | --- | --- | --- | --- |
| CA-31 | "?" no topo, seção "Margem" | Abaixo do exemplo: "Margem bruta sobre o preço de venda, calculada a partir do custo pago. Impostos sobre a venda e despesas fixas não entram nesta versão." | Teste automático (a Ajuda usa a mesma constante) | ☐ |
| CA-31 | Resultado de uma compra → "Como chegamos nisso" aberto | A mesma frase no fim da área | v1.4: conferido (área aberta no resultado) | ☐ |
| CA-32 | Ler boas-vindas, lista vazia, Ajuda e cadastro | Só "margem desejada" (e "meta" nos selos); nada de "a sua margem" ou "a margem que você quer" | Teste automático (varredura de `src`) | ☐ |
| CA-33 | Tela de resultado | A frase "Venda a R$ … para manter …% de margem" é o maior texto da tela | v1.4: conferido (360 dp) | ☐ |
| CA-33 | Histórico com compras que subiram e caíram | Setas e palavras em azul; sem verde nem vermelho | v1.4: conferido | ☐ |
| CA-34 | Resultado do arroz a R$ 4,40, em 320 dp ou com fonte em 200% | "Aplicar preço sugerido (R$ 5,87)": se o texto quebrar, "R$ 5,87" vai inteiro para a linha de baixo; o mesmo na frase da resposta e no "Sugerido: R$ 8,67" da lista | Teste automático (formatarReais e varredura) | ☐ |
| Estados | App vazio (lista vazia); cadastro com campos vazios (erro junto ao campo); histórico de produto novo ("primeira compra"); "Aplicar preço sugerido" (aviso "Preço atualizado para R$ …") | Cada estado tem texto claro, ícone e um botão principal | v1.4: conferidos (lista vazia, erro, primeira compra, aviso após aplicar) | ☐ |
| Ícones | Percorrer as telas | Alerta e erro sempre com o mesmo ícone (círculo com "!"); confirmação sempre com o círculo com "✓" | Teste automático (sem "warning") | ☐ |

## Parte 5 — telas e fontes (CA-29, RNF-11)

Em cada combinação, abra a Lista, um produto, "Nova compra" (com um custo digitado), o Resultado, o Histórico e a Ajuda. Procure: texto cortado ("Margem (meta 25%)", "Preço de venda", data "16/10/2026", "R$" no campo), botão atrás do teclado ou da barra de navegação, conteúdo que não rola.

Como mudar no Android: Configurações → Tela → **Tamanho da fonte** (padrão, 130%, 150%, 200% com "Maior") e **Tamanho de exibição** ("Maior").

| Tela / fonte | 100% | 130% | 150% | 200% | Tamanho de exibição "grande" |
| --- | --- | --- | --- | --- | --- |
| Celular pequeno (≈ 320–360 dp) | ☐ | ☐ | ☐ | ☐ | ☐ |
| Celular comum (≈ 411 dp) | ☐ | ☐ | ☐ | ☐ | ☐ |
| Celular grande (≈ 430 dp) | ☐ | ☐ | ☐ | ☐ | ☐ |
| Tablet, se houver (≥ 768 dp): conteúdo centralizado, até 600 dp | ☐ | — | — | — | — |

Outros itens da v1.4 para o aparelho: botão "Voltar" do Android em cada tela; toque duplo em "Confirmar compra" e em "Aplicar preço" (grava uma vez); edição não salva continua depois de abrir a Ajuda; barra de status legível sobre o cabeçalho azul; app só em retrato (girar o celular não muda a tela).

**Observação do teste no navegador (v1.3):** num clique duplo em "Carregar exemplos", "Salvar produto" ou "Aplicar preço sugerido", o segundo clique pode cair num cartão da lista que acabou de aparecer e abrir aquele produto. Não grava nada; só navega. Vale ver se acontece no celular.

Itens não conferidos no navegador (a v1.4 foi conferida em 320, 360 e 411 dp no navegador; corte de texto, teclado e barras do sistema só se vê no aparelho): CA-04 na tela, CA-10 no cadastro com 0/negativo, CA-23 voltando do Histórico, filtro "Na meta", "?" fora da lista, CA-09 no celular, teclado (RNF-09), tamanho real de toque (RNF-07), leitor de tela e a aparência no aparelho real.
