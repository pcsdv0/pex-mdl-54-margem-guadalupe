# tasks.md

> Estado: **v1.1 — aprovada pelo líder (portão 3).** Mudanças da v1.1 no registro de mudanças do `requirements.md`. Só vale depois do `design.md` aprovado. Tarefas pequenas, na ordem de dependência. Marque `[x]` ao concluir; um commit por tarefa, com o ID no início da mensagem (ex.: `T04: calcular preço sugerido`).

| ID | Tarefa | Liga a | Depende de | Feito |
| --- | --- | --- | --- | --- |
| T01 | Criar projeto Expo (TypeScript), configurar Jest e estrutura de pastas de `src/` | design §7 | — | [x] |
| T02 | `calcularMargem` + testes | RN-01, CA-02 | T01 | [x] |
| T03 | `calcularPrecoSugerido` + testes (inclui R$ 4,00 / 25% → R$ 5,33) | RN-02, RN-06, CA-01 | T01 | [x] |
| T04 | `calcularVariacaoCusto` + testes | RN-04, CA-05, CA-06 | T01 | [x] |
| T05 | `statusMargem(preço, custo, margem desejada)` + testes (inclui R$ 5,33 com margem 25% → verde) | RN-03, RN-05, CA-03, CA-04, CA-11 | T02, T03 | [x] |
| T06 | `validarProduto` e `validarCusto` + testes | RN-07, CA-10 | T01 | [x] |
| T07 | Formatação e leitura de valores (`formatarReais`, `formatarPercentual`, `formatarData`, `parseReais`) + testes | RNF-02, RN-08 | T01 | [x] |
| T08 | Repositório com AsyncStorage (produtos e histórico; excluir produto apaga o histórico dele) + testes com mock | RF-07, RF-02, CA-09 | T01 | [ ] |
| T09 | Dados de exemplo (`exemplos.ts`) e função de carga | RF-08 | T08 | [ ] |
| T10 | Componentes base: `SemaforoBadge`, `AlertaBanner`, `CampoMoeda`, `CampoPercentual`, tema | design §3 | T07 | [ ] |
| T11 | Navegação em pilha e tela Lista de produtos (com estado vazio e carga de exemplos) | RF-03, RF-08 | T05, T08, T09, T10 | [ ] |
| T12 | Tela Produto (cadastro, edição com custo só leitura, exclusão com histórico; botões "Nova compra" e "Ver histórico") | RF-01, RF-02 | T06, T08, T10 | [ ] |
| T13 | Telas Nova compra (valida e grava ao confirmar) e Resultado (aplicar ou manter preço) | RF-04, RF-05, CA-11 | T03, T04, T05, T06, T08, T10, T12 | [ ] |
| T14 | Tela Histórico de custos | RF-06, CA-08 | T04, T07, T08, T12 | [ ] |
| T15 | Checklist de teste manual (`tests/checklist-manual.md`) cobrindo CA-01 a CA-11, executado no Expo Go | todos os CA | T11–T14 | [ ] |
| T16 | Revisão final: rodar testes e `tsc`, conferir o fora do escopo, atualizar README com como rodar | RNF-04 | T15 | [ ] |

## Matriz de rastreabilidade
| Requisito | Tarefas | Teste |
| --- | --- | --- |
| RF-01, RF-02 | T06, T08, T12 | domain.test (validação), storage.test (exclusão com histórico), checklist CA-10 |
| RF-03 | T05, T11 | domain.test (status), checklist CA-03/04 |
| RF-04 | T03, T04, T06, T13 | domain.test (CA-01, CA-05, CA-06, CA-10), checklist CA-01 |
| RF-05 | T05, T13 | domain.test (CA-11), checklist CA-07, CA-11 |
| RF-06 | T14 | checklist CA-08 |
| RF-07 | T08 | storage.test, checklist CA-09 |
| RF-08 | T09, T11 | checklist |
| RN-01 | T02 | domain.test (CA-02) |
| RN-02, RN-06 | T03 | domain.test (CA-01) |
| RN-03, RN-05 | T05 | domain.test (CA-03, CA-04, CA-11) |
| RN-04 | T04 | domain.test (CA-05, CA-06) |
| RN-07 | T06 | domain.test (CA-10) |
| RNF-02, RN-08 | T07 | domain.test (formatação e leitura) |
