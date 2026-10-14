# Processo SDD: do requisito ao commit

Rastreabilidade tirada do `git log` real do repositório. Cada linha liga um requisito do `specs/requirements.md` (v1.1) à tarefa do `specs/tasks.md` que o implementou, ao commit e ao teste que o cobre.

## Linha do tempo

1. `b652499`: specs v1.0 (requirements, design, tasks), ADRs e CLAUDE.md.
2. `5a84044` **spec: v1.1**: a revisão das specs, **antes de qualquer código**, achou um erro de regra. Aplicar o preço sugerido (R$ 5,33 para custo R$ 4,00 e margem 25%) deixava a margem em 24,95% e o produto continuava vermelho. A RN-05 foi corrigida e entrou o CA-11. Detalhes no registro de mudanças do `requirements.md` §11.
3. `aa02270` a `4efaca8`: tarefas T01 a T16, um commit por tarefa. Nas tarefas de domínio (T02 a T09), os testes foram escritos e vistos falhando antes da implementação.
4. Três ajustes de spec feitos durante o código, cada um em commit próprio antes da tarefa que dependia dele:
   - `d120ebe`: assinatura de `validarCusto`;
   - `38ba135` e `dc53bf6`: componentes `Botao` e `Campo`;
   - `1a6432a`: ADR-005 citado no design.

## Requisitos funcionais

| Requisito | Tarefa | Commit | Teste |
| --- | --- | --- | --- |
| RF-01 Cadastrar produto | T06, T12 | `e1dbb06`, `a16c0ea` | `domain.test` › validarProduto e validarCusto (RN-07); checklist CA-10 |
| RF-02 Editar e excluir (exclui o histórico) | T08, T12 | `cc525ba`, `a16c0ea` | `storage.test` › "RF-02: excluir produto apaga também o histórico dele"; checklist RF-02 |
| RF-03 Lista com margem e semáforo | T05, T11 | `1bd948f`, `594a81f` | `domain.test` › statusMargem (CA-03, CA-04); checklist |
| RF-04 Nova compra e resultado | T03, T04, T13 | `e4177e2`, `62cc925`, `a849974` | `domain.test` › CA-01, CA-05, CA-06; `storage.test` › "registrar compra…"; checklist CA-05 |
| RF-05 Aplicar ou manter preço | T05, T13 | `1bd948f`, `a849974` | `domain.test` › CA-11; checklist CA-07, CA-11 |
| RF-06 Histórico de custos | T08, T14 | `cc525ba`, `f492649` | `storage.test` › CA-08; checklist CA-06/CA-08 |
| RF-07 Dados no aparelho | T08 | `cc525ba` | `storage.test` › CA-09 (novo repositório lê os mesmos dados); checklist CA-09 |
| RF-08 Produtos de exemplo | T09, T11 | `164cf3e`, `594a81f` | `storage.test` › produtos de exemplo (valores de §9, só o refrigerante vermelho) |

## Regras de negócio

| Regra | Tarefa | Commit | Teste |
| --- | --- | --- | --- |
| RN-01 Margem | T02 | `f002fe5` | `domain.test` › calcularMargem (CA-02, bordas: custo 0, preço 0, margem negativa) |
| RN-02 Preço sugerido | T03 | `e4177e2` | `domain.test` › calcularPrecoSugerido (CA-01, margem 99, custo 0) |
| RN-03 Alerta | T05 | `1bd948f` | `domain.test` › statusMargem (CA-03, CA-11) |
| RN-04 Variação do custo | T04, T07 | `62cc925`, `c98b7e9` | `domain.test` › calcularVariacaoCusto (CA-05, CA-06) e formatarPercentual com sinal |
| RN-05 Semáforo (v1.1) | T05 | `1bd948f` | `domain.test` › statusMargem (CA-04, CA-11, "preço sugerido aplicado deixa verde para qualquer custo e margem") |
| RN-06 Arredondamento | T03 | `e4177e2` | `domain.test` › "arredonda ao centavo mais próximo, sem erro de ponto flutuante (512,5 → 513)" |
| RN-07 Validação | T06 | `e1dbb06` | `domain.test` › validarProduto e validarCusto (CA-10) |
| RN-08 Leitura de valores e datas | T07 | `c98b7e9` | `domain.test` › parseReais e formatarData |

## Situação na entrega

- Testes automáticos: 63 passando (`npm test`); `npx tsc --noEmit` sem erros.
- Teste de tela: conferido no navegador pelo assistente. Falta a execução no **Expo Go**, a cargo da equipe (`tests/checklist-manual.md`). Por isso a T15 continua `[ ]` no `tasks.md`.
