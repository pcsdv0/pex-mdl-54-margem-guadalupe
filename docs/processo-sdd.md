# Processo SDD: do requisito ao commit

Porta de entrada do processo: [`specs/SPEC.md`](../specs/SPEC.md) (objetivo, escopo, princípios, índice e estado atual). Rastreabilidade tirada do `git log` real do repositório. Cada linha liga um requisito do `specs/requirements.md` (v1.4) à tarefa do `specs/tasks.md` que o implementou, ao commit e ao teste que o cobre. Todos os hashes citados existem no histórico (`git log --oneline`).

## Linha do tempo

1. **v1.0** — `b652499`: specs v1.0 (requirements, design, tasks), ADRs e regras do projeto.
2. **v1.1** — `5a84044` *spec*: a revisão das specs, **antes de qualquer código**, achou um erro de regra. Aplicar o preço sugerido (R$ 5,33 para custo R$ 4,00 e margem 25%) deixava a margem em 24,95%, e o produto continuava vermelho. A RN-05 foi corrigida e entrou o CA-11.
3. **Protótipo** — `aa02270` a `4efaca8`: tarefas T01 a T16, um commit por tarefa. Nas tarefas de domínio (T02 a T09), os testes foram escritos e vistos falhando antes da implementação. Ajustes de spec durante o código, cada um em commit próprio antes da tarefa que dependia dele: `d120ebe`, `38ba135`, `dc53bf6`, `1a6432a`.
4. **v1.2 (usabilidade e didática)** — `30362fe` *spec*: diagnóstico das telas e RF-09 a RF-16, RNF-05 a RNF-10, CA-12 a CA-21. Tarefas T17 a T29 (`da6779a` a `81c47c5`), com um ajuste de spec no meio (`c84e646`).
5. **v1.3 (correções da auditoria)** — `03be394` *spec*: uma auditoria só de leitura comparou spec, código, testes e documentos. Achou dois erros que a v1.2 não pegou:
   - um toque duplo em "Carregar exemplos" ou "Salvar produto" duplicava produtos;
   - a tela Produto apagava o que tinha sido digitado e não salvo ao voltar da Ajuda.

   Também entraram "Apagar todos os dados" (RF-17) e o aviso "Confira o valor" (RN-09, RF-18). Tarefas T30 a T37 (`a16e4fd` em diante). O design foi alinhado ao código, e a T16 foi reaberta porque depende da T15, que ainda não foi executada no celular.

6. **v1.4 (apresentação de 23/10/2026)** — `22d1b93` *spec*: o teste no celular real (Android, Expo Go) mostrou texto cortado ("Margem (meta" sem "25%)", "Preço de" e a data "16/10/202"), "R 4" no campo de custo e uma frase de resultado que sugeria baixar o preço. A spec veio antes: RNF-11 e RNF-12, RN-10 e CA-26 a CA-30, mais as mudanças em RN-08 e RF-09. Tarefas T38 a T45 (`7f6ac97` em diante), com os testes de domínio e de layout escritos antes do código.

7. **v1.4, acabamento** — `2953697` *spec* e `67e9caa` *spec*: a margem passa a ser definida como bruta (RN-11), a margem desejada fica por produto (RN-12, ADR-007), o vocabulário é único ("margem desejada" e "meta") e a cor significa uma coisa só. As dúvidas do antigo §10 viraram decisão ou item de `docs/depois.md`. Tarefas T46 a T50 (`806cc42` em diante) e T51, o `specs/SPEC.md` (documento-mestre; `tests/spec-mestre.test.ts` confere que os números dele batem com os outros documentos); os testes de varredura foram escritos antes da mudança dos textos e dos estilos e vistos falhando.

## Requisitos funcionais

| Requisito | Tarefa | Commit | Teste |
| --- | --- | --- | --- |
| RF-01 Cadastrar produto (sem duplicar) | T06, T12, T30 | `e1dbb06`, `a16c0ea`, `a16e4fd` | `domain.test` › validarProduto (RN-07); checklist CA-10, CA-22 |
| RF-02 Editar e excluir (exclui o histórico; não perde o digitado) | T08, T12, T31 | `cc525ba`, `a16c0ea`, `d6d3f91` | `storage.test` › "excluir produto apaga também o histórico dele"; checklist RF-02, CA-23 |
| RF-03 Lista com margem e semáforo | T05, T11 | `1bd948f`, `594a81f` | `domain.test` › statusMargem (CA-03, CA-04); checklist |
| RF-04 Nova compra e resultado | T03, T04, T13 | `e4177e2`, `62cc925`, `a849974` | `domain.test` › CA-01, CA-05, CA-06; `storage.test` › "registrar compra…"; checklist CA-05 |
| RF-05 Aplicar ou manter preço | T05, T13 | `1bd948f`, `a849974` | `domain.test` › CA-11; checklist CA-07, CA-11 |
| RF-06 Histórico de custos | T08, T14 | `cc525ba`, `f492649` | `storage.test` › CA-08; checklist CA-06/CA-08 |
| RF-07 Dados no aparelho | T08 | `cc525ba` | `storage.test` › CA-09 (novo repositório lê os mesmos dados); checklist CA-09 |
| RF-08 Produtos de exemplo (sem duplicar) | T09, T11, T30 | `164cf3e`, `594a81f`, `a16e4fd` | `storage.test` › valores de §9; CA-22 (dois toques → 8 produtos) |
| RF-09 Resposta em destaque | T17, T25 | `da6779a`, `335702f` | `domain.test` › fraseResposta (CA-12); checklist CA-12 |
| RF-10 "Como chegamos nisso" | T17, T25 | `da6779a`, `335702f` | `domain.test` › explicarPrecoSugerido, explicarMargem (CA-13); checklist CA-13 |
| RF-11 Prévia ao digitar | T17, T24 | `da6779a`, `1c246a5` | `domain.test` › situacaoProduto (CA-14); checklist CA-14 |
| RF-12 Lista com resumo, ordem, busca e filtro | T18, T22 | `30ff853`, `0c7c1a5` | `domain.test` › organizarLista, resumoLista (CA-15, CA-16); checklist |
| RF-13 Ajuda embutida | T21, T23 | `68c47f2`, `6199a5b` | checklist CA-17 |
| RF-14 Avisos e erro junto ao campo | T20, T23, T25 | `07a8f25`, `6199a5b`, `335702f` | checklist CA-18 |
| RF-15 Boas-vindas | T27 | `39578c5` | `storage.test` › preferências (CA-19); checklist CA-19 |
| RF-16 Histórico com seta e palavra | T26 | `a7abad7` | `domain.test` › sentidoVariacao (CA-20); checklist CA-20 |
| RF-17 Apagar todos os dados | T32 | `d0a51f9` | `storage.test` › apagarTodosOsDados (CA-24); checklist CA-24 |
| RF-18 Conferência do custo | T33 | `c092e6a` | `domain.test` › avisoConferencia (CA-25); checklist CA-25 |
| Vocabulário (CA-32) | T47 | `3b6a851` | `varredura.test` (termos proibidos em `src`) |
| RF-09 (v1.4) Resposta na meta | T38, T42 | `7f6ac97`, `d82c705` | `domain.test` › textoResultado (CA-27); checklist CA-27 |
| RF-06 (v1.4) Compra igual no histórico | T42 | `d82c705` | `storage.test` › "compra com custo igual ao anterior" (CA-26); checklist CA-26 |
| RF-08, RF-17 (v1.4) Ensaio repetível | T43 | `eb1c557` | `storage.test` › CA-30 (4 repetições de apagar e carregar); checklist CA-30 |

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
| RN-09 Conferência do custo (±50%) | T33 | `c092e6a` | `domain.test` › variacaoSuspeita (CA-25, inclusive exatamente ±50%) |
| RN-08 (v1.4) Duas casas ao sair do campo, milhar nos percentuais | T38, T40 | `7f6ac97`, `bad1eff` | `domain.test` › normalizarMoeda, formatarPercentual; `render.test` › CampoMoeda (CA-28) |
| RN-10 Compra com custo igual | T42 | `d82c705` | `storage.test` (CA-26) |
| RN-11 Escopo do cálculo (margem bruta) | T46 | `806cc42` | `domain.test` › NOTA_ESCOPO_CALCULO; `render.test` › "Como chegamos nisso"; `varredura.test` (Ajuda) (CA-31) |
| RN-12 Margem desejada por produto | T49 | `e942d67` | ADR-007; `docs.test` |

## Requisitos não funcionais

| Requisito | Tarefa | Commit | Teste |
| --- | --- | --- | --- |
| RNF-01 Offline | T08 | `cc525ba` | Leitura do código: nenhuma chamada de rede em `src` |
| RNF-02 pt-BR e R$ | T07 | `c98b7e9` | `domain.test` › formatação e leitura |
| RNF-03 3 toques até o resultado | T13, T24 | `a849974`, `1c246a5` | checklist RNF-03 |
| RNF-04 Fórmulas com testes | todas de domínio | — | `npm test` |
| RNF-05 Tema único | T19, T28, T34, T48 | `d344e0e`, `060d48e`, `8ac1d96`, `a6ca51d` | `varredura.test` (sem cor ou tamanho solto, CA-21; histórico sem verde/vermelho, um só ícone de alerta, CA-33); `tema.test` (tamanho destaque) |
| RNF-06 Contraste e semáforo com ícone e palavra | T19, T20 | `d344e0e`, `07a8f25` | `tema.test` (contraste ≥ 4,5:1, CA-21); checklist |
| RNF-07 Toque ≥ 48 px, um botão principal | T20, T22–T25 | `07a8f25` … `335702f` | `tema.test` (toque mínimo); checklist (só no aparelho) |
| RNF-08 Números em destaque | T20 | `07a8f25` | checklist |
| RNF-09 Teclado | T20, T23, T24 | `07a8f25`, `6199a5b`, `1c246a5` | checklist (só no aparelho; **ainda não verificado**) |
| RNF-10 Acessibilidade | T20, T28 | `07a8f25`, `060d48e` | `varredura.test` (rótulo em todo elemento tocável); checklist |
| RNF-11 Telas e fontes | T39, T40, T41 | `b6a6c30`, `bad1eff`, `1947505` | `layout.test`, `render.test` (20 combinações de tela e fonte), `varredura.test` (sem limite de linhas); checklist CA-29 (**só no aparelho, ainda não executado**) |
| RNF-12 Instalação (APK) | T44 | `b14fb49` | `config.test` (`app.json`, `eas.json`); o build não foi gerado |

## Situação na entrega

- Requisitos: 18 RF, 12 RNF, 12 RN, 33 critérios de aceite; 8 arquivos em `docs/adr` (o modelo e 7 decisões); 51 tarefas (T01 a T51).
- Testes automáticos: 364 passando em 9 suítes (`npm test`); `npx tsc --noEmit` sem erros; `npx expo-doctor` 21/21.
- Teste de tela: o roteiro da demonstração e os estados foram conferidos no navegador (Expo web) na v1.4, em 320, 360 e 411 dp. Falta a execução no **Expo Go**, a cargo da equipe (`tests/checklist-manual.md`, incluindo a Parte 5 de tamanhos de tela e fontes). Por isso T15 e T16 continuam `[ ]` no `tasks.md`.
- A correção dos cortes de texto vem de uma hipótese tirada do código e dos sintomas (design §11); só o aparelho confirma.
