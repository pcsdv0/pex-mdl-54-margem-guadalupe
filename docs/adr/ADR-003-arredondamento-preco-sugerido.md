# ADR-003 — Arredondamento do preço sugerido ao centavo mais próximo
- **Status:** aceita
- **Contexto:** custo ÷ (1 − margem) gera dízimas (R$ 5,3333…). É preciso um preço com centavos, e o exemplo de referência é R$ 4,00 a 25% → R$ 5,33.
- **Decisão:** `Math.round` sobre o valor em centavos. Não se arredonda para cima nem para "preços de prateleira" (ex.: 5,49).
- **Consequências:** o resultado bate com o exemplo do requisito; a margem real pode ficar décimos abaixo da desejada por causa do arredondamento (tolerância aceita em CA-07). Arredondar para preços de prateleira fica em `docs/depois.md`.
- **Atende:** RN-02, RN-06.
