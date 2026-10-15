# Testes

- `setup.ts` — liga o mock oficial do AsyncStorage em todos os testes.
- `domain.test.ts` — fórmulas, validações, textos das contas, lista e conferência do custo (RN-01 a RN-09, RF-09 a RF-12, RF-16, RF-18), cobrindo CA-01 a CA-06, CA-10 a CA-16, CA-20 e CA-25.
- `storage.test.ts` — repositório, exemplos, boas-vindas e "apagar todos os dados" com o mock do AsyncStorage (RF-02, RF-07, RF-08, RF-15, RF-17), cobrindo CA-08, CA-09, CA-19, CA-22 e CA-24.
- `tema.test.ts` — contraste dos pares de texto do tema, escala de espaços, tamanhos de fonte e toque mínimo (RNF-05 a RNF-07, CA-21).
- `varredura.test.ts` — nenhuma cor ou tamanho solto nas telas e componentes, e rótulo de acessibilidade em todo elemento tocável (RNF-05, RNF-10, CA-21).
- `checklist-manual.md` — passos de tela de CA-01 a CA-25, para executar no Expo Go.

Rodar: `npm test`.
