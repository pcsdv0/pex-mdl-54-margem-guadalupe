# Testes

- `setup.ts` — liga o mock oficial do AsyncStorage em todos os testes.
- `domain.test.ts` — fórmulas, validações, textos das contas, lista e conferência do custo (RN-01 a RN-09, RF-09 a RF-12, RF-16, RF-18), cobrindo CA-01 a CA-06, CA-10 a CA-16, CA-20, CA-25, CA-27 e CA-31.
- `storage.test.ts` — repositório, exemplos, boas-vindas e "apagar todos os dados" com o mock do AsyncStorage (RF-02, RF-07, RF-08, RF-15, RF-17), cobrindo CA-08, CA-09, CA-19, CA-22, CA-24, CA-26 e CA-30.
- `tema.test.ts` — contraste dos pares de texto do tema, escala de espaços, tamanhos de fonte e toque mínimo (RNF-05 a RNF-07, CA-21).
- `varredura.test.ts` — nenhuma cor ou tamanho solto nas telas e componentes, rótulo de acessibilidade em todo elemento tocável e nenhum texto limitado a uma linha (RNF-05, RNF-10, RNF-11, CA-21, CA-29, CA-32, CA-33).
- `layout.test.ts` — regra de disposição por tamanho de tela e de fonte: 320, 360, 411, 430 e 768 dp, fonte de 100% a 200% (RNF-11, CA-29).
- `render.test.tsx` — monta `CartaoSituacao`, `ProdutoCard` e `CampoMoeda` nas 20 combinações de tela e fonte e confere texto inteiro, disposição e o campo de dinheiro (RN-08, RNF-11, CA-28, CA-29).
- `docs.test.ts` — nenhum documento deixa ponto solto (as marcas procuradas estão no próprio teste) e o ADR-007 existe (RN-12).
- `config.test.ts` — `app.json` e `eas.json`: nome, pacote, versão, ícones, tela de abertura e perfil APK (RNF-12).
- `checklist-manual.md` — passos de tela de CA-01 a CA-33, para executar no Expo Go.

Rodar: `npm test`.
