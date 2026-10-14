# tasks.md

> Estado: **v1.0 — para aprovação do líder (portão 3).** Só vale depois do `design.md` aprovado. Tarefas pequenas, na ordem de dependência. Marque `[x]` ao concluir; um commit por tarefa, com o ID no início da mensagem (ex.: `T04: calcular preço sugerido`).

| ID | Tarefa | Liga a | Depende de | Feito |
| --- | --- | --- | --- | --- |
| T01 | Criar projeto Expo (TypeScript), configurar Jest e estrutura de pastas de `src/` | design §7 | — | [ ] |
| T02 | `calcularMargem` + testes | RN-01, CA-02 | T01 | [ ] |
| T03 | `calcularPrecoSugerido` + testes (inclui R$ 4,00 / 25% → R$ 5,33) | RN-02, RN-06, CA-01 | T01 | [ ] |
| T04 | `calcularVariacaoCusto` + testes | RN-04, CA-05, CA-06 | T01 | [ ] |
| T05 | `statusMargem` + testes | RN-03, RN-05, CA-03, CA-04 | T02 | [ ] |
| T06 | `validarProduto` + testes | RN-07, CA-10 | T01 | [ ] |
| T07 | Formatação e leitura de valores (`formatarReais`, `formatarPercentual`, `parseReais`) + testes | RNF-02 | T01 | [ ] |
| T08 | Repositório com AsyncStorage (produtos e histórico) + testes com mock | RF-07, CA-09 | T01 | [ ] |
| T09 | Dados de exemplo (`exemplos.ts`) e função de carga | RF-08 | T08 | [ ] |
| T10 | Componentes base: `SemaforoBadge`, `AlertaBanner`, `CampoMoeda`, `CampoPercentual`, tema | design §3 | T07 | [ ] |
| T11 | Navegação em pilha e tela Lista de produtos (com estado vazio e carga de exemplos) | RF-03, RF-08 | T05, T08, T09, T10 | [ ] |
| T12 | Tela Produto (cadastro, edição, exclusão) | RF-01, RF-02 | T06, T08, T10 | [ ] |
| T13 | Telas Nova compra e Resultado (aplicar ou manter preço) | RF-04, RF-05 | T03, T04, T05, T08, T10 | [ ] |
| T14 | Tela Histórico de custos | RF-06, CA-08 | T04, T08 | [ ] |
| T15 | Checklist de teste manual (`tests/checklist-manual.md`) cobrindo CA-01 a CA-10, executado no Expo Go | todos os CA | T11–T14 | [ ] |
| T16 | Revisão final: rodar testes e `tsc`, conferir o fora do escopo, atualizar README com como rodar | RNF-04 | T15 | [ ] |

## Matriz de rastreabilidade
| Requisito | Tarefas | Teste |
| --- | --- | --- |
| RF-01, RF-02 | T06, T12 | domain.test (validação), checklist CA-10 |
| RF-03 | T05, T11 | domain.test (status), checklist CA-03/04 |
| RF-04 | T03, T04, T13 | domain.test (CA-01, CA-05, CA-06) |
| RF-05 | T13 | checklist CA-07 |
| RF-06 | T14 | checklist CA-08 |
| RF-07 | T08 | storage.test, checklist CA-09 |
| RF-08 | T09, T11 | checklist |
| RN-01 | T02 | domain.test (CA-02) |
| RN-02, RN-06 | T03 | domain.test (CA-01) |
| RN-03, RN-05 | T05 | domain.test (CA-03, CA-04) |
| RN-04 | T04 | domain.test (CA-05, CA-06) |
| RN-07 | T06 | domain.test (CA-10) |
| RNF-02 | T07 | domain.test (formatação) |
