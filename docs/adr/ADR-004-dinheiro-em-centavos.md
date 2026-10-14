# ADR-004 — Dinheiro em centavos inteiros
- **Status:** aceita
- **Contexto:** números decimais em ponto flutuante geram erros (ex.: 0,1 + 0,2).
- **Decisão:** todo valor monetário é guardado e calculado em centavos (inteiro). A conversão para "R$ 5,33" acontece só na exibição; a leitura do texto digitado converte para centavos.
- **Consequências:** cálculos previsíveis e testáveis; exige funções de formatação e leitura (T07).
- **Atende:** RN-01, RN-02, RNF-02.
