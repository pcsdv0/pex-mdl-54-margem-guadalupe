# ADR-007 — Margem desejada por produto
- **Status:** aceita
- **Contexto:** o app compara o preço de venda com o preço sugerido, que depende da margem desejada. Era preciso decidir se há uma margem só para o mercado, uma por categoria ou uma por produto. O app não tem categorias, e produtos do mesmo tipo podem ter margens diferentes (o óleo e o leite dos exemplos usam 20%, os demais 25%).
- **Decisão:** a margem desejada é **por produto**: um número inteiro de 1 a 99, informado no cadastro e editável depois (RN-07, RN-12). Não existe margem por categoria nem margem geral.
- **Consequências:** o cadastro tem um campo a mais por produto, mas as contas, o semáforo e a lista não precisam de agrupamentos. Quem tem muitos produtos com a mesma margem digita o mesmo valor várias vezes; margem por categoria ficou em `docs/depois.md`. O modelo de dados (design §4) já guarda `margemDesejada` em cada `Produto`.
- **Atende:** RN-07, RN-12; design §4.
