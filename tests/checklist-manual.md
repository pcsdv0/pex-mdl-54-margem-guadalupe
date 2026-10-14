# Checklist de teste manual (T15)

Passos na tela para os critérios de aceite CA-01 a CA-11 (`specs/requirements.md` §7).

**Como executar:** `npm install`, depois `npx expo start` e ler o QR code com o **Expo Go** no celular. Comece com o app sem produtos. Se já houver dados, desinstale e reinstale o Expo Go, ou exclua os produtos.

**Colunas:**
- **Navegador (Claude):** o que o assistente conferiu em 14/10/2026 rodando o app no navegador (Expo web), com dependências web instaladas só durante o teste. Não substitui o teste no celular.
- **Resultado (Expo Go):** fica em branco para a equipe preencher no aparelho (OK / falhou + observação).

| CA | Passos | Resultado esperado | Navegador (Claude) | Resultado (Expo Go) |
| --- | --- | --- | --- | --- |
| — | Abrir o app sem produtos | Mensagem "Nenhum produto cadastrado" com botões "+ Novo produto" e "Carregar exemplos" e aviso de valores ilustrativos | Conferido | |
| — | Tocar em "Carregar exemplos" | 8 produtos; só "Refrigerante 2 L" aparece com "! Abaixo da meta" (18,8%), os outros com "✓ Na meta" | Conferido | |
| CA-10 | "+ Novo produto" → "Salvar" com tudo vazio | Mensagens em cada campo: nome, custo, preço e margem | Conferido | |
| CA-10 | No cadastro, custo `0` e depois `-4` → "Salvar" | "Informe o custo. Ele precisa ser maior que zero." | Não conferido no cadastro (conferido na Nova compra) | |
| CA-02, CA-03 | Cadastrar "Produto teste": custo `4,00`, preço `5,00`, margem `25` → "Salvar" | Na lista: margem 20,0%, "! Abaixo da meta" (vermelho) | Conferido | |
| CA-04 | Cadastrar "Produto 30": custo `7,00`, preço `10,00`, margem `25` | Margem 30,0%, "✓ Na meta" (verde), sem alerta | Não conferido (coberto pelo teste automático) | |
| RNF-03 | Na lista, contar os toques: produto → "Nova compra" → digitar → "Confirmar" | Resultado aparece com 3 toques | Conferido | |
| CA-10 | Em "Nova compra" do Arroz: "Confirmar" vazio; depois `0`; depois `-4` | Recusa com mensagem; nada é gravado | Conferido (vazio e 0: "maior que zero"; -4 mostrava "Valor inválido", mensagem ajustada depois para "maior que zero" e não reconferida na tela) | |
| CA-05 | Arroz → "Nova compra" → `4.40` (com ponto) → "Confirmar" | Variação +10,0%; margem 20,0%; "! Abaixo da meta" com alerta; preço sugerido R$ 5,87 | Conferido | |
| CA-07 | Na tela de resultado do Arroz, "Aplicar preço sugerido" | Volta para a lista; Arroz com preço R$ 5,87, margem 25,0%, "✓ Na meta" | Conferido | |
| CA-06, CA-08 | Arroz → "Ver histórico" | Duas linhas, mais recente primeiro: R$ 4,40 (+10,0%) e R$ 4,00 (—), com data dd/mm/aaaa | Conferido | |
| CA-01, CA-11 | "Produto teste" → "Nova compra" → `4` → "Confirmar" | Preço sugerido R$ 5,33 | Conferido | |
| CA-11 | "Aplicar preço sugerido" | Na lista: R$ 5,33, margem 25,0%, "✓ Na meta" (verde), sem alerta | Conferido | |
| RF-05 | Outro produto → "Nova compra" → qualquer custo → "Manter preço" | Volta para a lista; preço igual; o custo novo aparece no histórico | Não conferido | |
| RF-02 | Abrir um produto, mudar o preço → "Salvar" | Lista mostra o preço novo; o campo custo não pode ser editado | Campo custo só leitura conferido; salvar edição não conferido | |
| RF-02 | Abrir um produto → "Excluir produto" → confirmar | Aviso de confirmação; produto some da lista | **Não conferido** (o aviso de confirmação não funciona no navegador) | |
| CA-09 | Fechar o Expo Go por completo (tirar da lista de apps recentes) e abrir de novo | Produtos, preços e histórico continuam iguais | Conferido só no navegador (recarregar a página); **no celular, não** | |

Itens não conferidos pelo assistente: CA-04 na tela, CA-10 no cadastro com valor 0/negativo, "Manter preço", salvar edição, exclusão, CA-09 no celular, aparência e teclado numérico no aparelho real.
