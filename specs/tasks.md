# tasks.md

> Estado: **v1.4 — mudanças pedidas pelo líder em 16/10/2026.** A v1.3 foi aprovada no portão 3. Mudanças da v1.1 a v1.4 no registro de mudanças do `requirements.md`. Só vale depois do `design.md` aprovado. Tarefas pequenas, na ordem de dependência. Marque `[x]` ao concluir; um commit por tarefa, com o ID no início da mensagem (ex.: `T04: calcular preço sugerido`).

| ID | Tarefa | Liga a | Depende de | Feito |
| --- | --- | --- | --- | --- |
| T01 | Criar projeto Expo (TypeScript), configurar Jest e estrutura de pastas de `src/` | design §7 | — | [x] |
| T02 | `calcularMargem` + testes | RN-01, CA-02 | T01 | [x] |
| T03 | `calcularPrecoSugerido` + testes (inclui R$ 4,00 / 25% → R$ 5,33) | RN-02, RN-06, CA-01 | T01 | [x] |
| T04 | `calcularVariacaoCusto` + testes | RN-04, CA-05, CA-06 | T01 | [x] |
| T05 | `statusMargem(preço, custo, margem desejada)` + testes (inclui R$ 5,33 com margem 25% → verde) | RN-03, RN-05, CA-03, CA-04, CA-11 | T02, T03 | [x] |
| T06 | `validarProduto` e `validarCusto` + testes | RN-07, CA-10 | T01 | [x] |
| T07 | Formatação e leitura de valores (`formatarReais`, `formatarPercentual`, `formatarData`, `parseReais`) + testes | RNF-02, RN-08 | T01 | [x] |
| T08 | Repositório com AsyncStorage (produtos e histórico; excluir produto apaga o histórico dele) + testes com mock | RF-07, RF-02, CA-09 | T01 | [x] |
| T09 | Dados de exemplo (`exemplos.ts`) e função de carga | RF-08 | T08 | [x] |
| T10 | Componentes base: `SemaforoBadge`, `AlertaBanner`, `CampoMoeda`, `CampoPercentual`, `Campo`, `Botao`, tema | design §3 | T07 | [x] |
| T11 | Navegação em pilha e tela Lista de produtos (com estado vazio e carga de exemplos) | RF-03, RF-08 | T05, T08, T09, T10 | [x] |
| T12 | Tela Produto (cadastro, edição com custo só leitura, exclusão com histórico; botões "Nova compra" e "Ver histórico") | RF-01, RF-02 | T06, T08, T10 | [x] |
| T13 | Telas Nova compra (valida e grava ao confirmar) e Resultado (aplicar ou manter preço) | RF-04, RF-05, CA-11 | T03, T04, T05, T06, T08, T10, T12 | [x] |
| T14 | Tela Histórico de custos | RF-06, CA-08 | T04, T07, T08, T12 | [x] |
| T15 | Checklist de teste manual (`tests/checklist-manual.md`) cobrindo CA-01 a CA-25, executado no Expo Go (coluna "Resultado (Expo Go)" preenchida pela equipe) | todos os CA | T11–T14, T36 | [ ] |
| T16 | Revisão final: rodar testes e `tsc`, conferir o fora do escopo, atualizar README com como rodar. Reaberta na v1.3: só fecha depois da T15 | RNF-04 | T15 | [ ] |

### v1.2 — usabilidade e didática
Blocos por prioridade: **A** (funcional e didático), **B** (UI e consistência), **C** (se sobrar tempo). Funções novas de domínio nascem com teste antes.

| ID | Bloco | Tarefa | Liga a | Depende de | Feito |
| --- | --- | --- | --- | --- | --- |
| T17 | A | `situacaoProduto`, `fraseResposta`, `explicarPrecoSugerido`, `explicarMargem` + testes | RF-09, RF-10, RF-11, CA-12, CA-13, CA-14 | T05 | [x] |
| T18 | A | `organizarLista` e `resumoLista` + testes | RF-12, CA-15, CA-16 | T05 | [x] |
| T19 | B | Tema em tokens (`tema.ts`: cores, espaço 4/8, 5 tamanhos de fonte, raios, sombra, toque 48) e `contraste.ts` + teste de contraste ≥ 4,5:1 | RNF-05, RNF-06, CA-21 | T10 | [x] |
| T20 | B | Ícones (`@expo/vector-icons`) e componentes base revisados: `Botao` (principal/secundário/texto), `Icone`, `SemaforoBadge`, `Campo` (apoio, "próximo"), `LinhaValor`, `CartaoSituacao`, `AvisoProvider`, `DialogoConfirmacao`, `BotaoAjuda` | RNF-06, RNF-07, RNF-08, RNF-09, RNF-10, RF-14 | T19 | [x] |
| T21 | A | Tela Ajuda e botão "?" no cabeçalho de todas as telas | RF-13, CA-17 | T20 | [x] |
| T22 | A | Lista: resumo, ordem, busca, filtro, sugerido no cartão vermelho, mensagem de busca vazia | RF-12, CA-15, CA-16 | T18, T20 | [x] |
| T23 | A | Tela Produto: cartão de situação, "Nova compra" como principal, textos de apoio, teclado ("próximo", foco), confirmação de exclusão no app e avisos | RF-13, RF-14, RNF-07, RNF-09, CA-17, CA-18 | T17, T20 | [x] |
| T24 | A | Nova compra com prévia em tempo real | RF-11, RNF-09, CA-14 | T17, T20 | [x] |
| T25 | A | Resultado: resposta em destaque, situação atual, "Como chegamos nisso" e avisos | RF-09, RF-10, RF-14, CA-12, CA-13, CA-18 | T17, T20 | [x] |
| T26 | C | `sentidoVariacao` + testes e histórico com seta e palavra | RF-16, CA-20 | T20 | [x] |
| T27 | C | Preferência de boas-vindas (`preferencias.ts`) + testes e `CartaoBoasVindas` na lista | RF-15, CA-19 | T22 | [x] |
| T28 | B | Varredura final: teste que proíbe cor e tamanho soltos em telas e componentes; rótulos de acessibilidade | RNF-05, RNF-10, CA-21 | T21–T27 | [x] |
| T29 | — | Checklist manual com CA-12 a CA-21 e README atualizado | todos os CA novos | T28 | [x] |

### v1.3 — correções da auditoria

| ID | Tarefa | Liga a | Depende de | Feito |
| --- | --- | --- | --- | --- |
| T30 | Toque duplo não duplica: `carregarExemplos` sem carga repetida + testes; bloqueio de segundo toque em cadastro, carga de exemplos, nova compra e aplicar preço | RF-01, RF-08, CA-22 | T29 | [x] |
| T31 | Tela Produto não sobrescreve o que foi digitado e não salvo ao voltar ao foco | RF-02, CA-23 | T29 | [x] |
| T32 | `apagarTodosOsDados` + testes; botão "Apagar todos os dados" na Ajuda com confirmação; boas-vindas voltam | RF-17, CA-24 | T29 | [x] |
| T33 | `variacaoSuspeita` e `avisoConferencia` + testes; aviso "Confira o valor" na prévia da Nova compra | RF-18, RN-09, CA-25 | T29 | [x] |
| T34 | Alinhar design ao código (§2 rótulos, §5 frases do resumo, §6 nomes do repositório, §10 tamanhos de fonte), `tests/README.md` e nota do ADR-005 | design, RNF-05 | T33 | [x] |
| T35 | T15 cobrindo CA-01 a CA-25; T16 reaberta até a T15 fechar | tasks | T34 | [x] |
| T36 | Checklist manual com CA-22 a CA-25; README com a equipe; `docs/entrevista.md`; desfazer última compra em `docs/depois.md` | todos os CA novos | T35 | [x] |
| T37 | `docs/processo-sdd.md` atualizado para a v1.3 com os hashes reais do git log | RNF-04 | T36 | [x] |

### v1.4 — apresentação de 23/10/2026

Funções novas de domínio e de layout nascem com teste antes. T15 e T16 só são marcadas depois de a equipe executar o checklist no celular.

| ID | Tarefa | Liga a | Depende de | Feito |
| --- | --- | --- | --- | --- |
| T38 | `normalizarMoeda`, milhar em `formatarPercentual` e `textoResultado` + testes | RN-08, RF-09, CA-27, CA-28 | T37 | [x] |
| T39 | `theme/layout.ts` (`empilhar`, largura máxima) + `tests/layout.test.ts`; `useLayout` e `Tela` | RNF-11, CA-29 | T38 | [ ] |
| T40 | Componentes comuns sem corte: `LinhaValor`, `CartaoSituacao`, `ProdutoCard`, `Campo`/`CampoMoeda` (prefixo e duas casas), `Botao`, `CartaoResposta`, linha do histórico; varredura proíbe limite de linhas | RNF-11, RN-08, CA-28, CA-29 | T39 | [ ] |
| T41 | Todas as telas com `Tela`/`useLayout`: rolagem, teclado, barras do sistema, largura máxima; cabeçalho, janela de confirmação e aviso | RNF-11, RNF-09, CA-29 | T40 | [ ] |
| T42 | Resultado na meta (frase, observação e botões) e histórico com "igual" | RF-09, RF-06, RN-10, CA-26, CA-27 | T41 | [ ] |
| T43 | Teste de repetição: apagar tudo e carregar exemplos várias vezes | RF-08, RF-17, CA-30 | T42 | [ ] |
| T44 | `app.json` (nome, pacote, versionCode, ícone, splash), `eas.json` (perfil `preview` APK) e README do APK | RNF-12 | T43 | [ ] |
| T45 | Checklist com CA-26 a CA-30, README, `docs/processo-sdd.md` e `docs/depois.md` com os números reais | todos os CA novos | T44 | [ ] |

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
| RF-09 | T17, T25 | domain.test (fraseResposta, CA-12), checklist CA-12 |
| RF-10 | T17, T25 | domain.test (explicações, CA-13), checklist CA-13 |
| RF-11 | T17, T24 | domain.test (situacaoProduto, CA-14), checklist CA-14 |
| RF-12 | T18, T22 | domain.test (organizarLista, resumoLista, CA-15, CA-16), checklist CA-15/16 |
| RF-13 | T21, T23 | checklist CA-17 |
| RF-14 | T20, T23, T25 | checklist CA-18 |
| RF-15 | T27 | storage.test (preferências), checklist CA-19 |
| RF-16 | T26 | domain.test (sentidoVariacao), checklist CA-20 |
| RNF-05 | T19, T28 | varredura.test (sem cor ou tamanho solto, CA-21) |
| RNF-06 | T19, T20 | tema.test (contraste, CA-21), checklist |
| RNF-07, RNF-08 | T20, T22–T25 | checklist |
| RNF-09 | T20, T23, T24 | checklist (só no aparelho) |
| RNF-10 | T20, T28 | varredura.test (rótulo em todo Pressable), checklist |
| RF-01, RF-08 (CA-22) | T30 | storage.test (carga de exemplos sem duplicar), checklist CA-22 |
| RF-02 (CA-23) | T31 | checklist CA-23 |
| RF-17 | T32 | storage.test (apagarTodosOsDados), checklist CA-24 |
| RF-18, RN-09 | T33 | domain.test (variacaoSuspeita, avisoConferencia, CA-25), checklist CA-25 |
| RN-08 (duas casas, milhar) | T38, T40 | domain.test (normalizarMoeda, formatarPercentual), checklist CA-28 |
| RF-09 (na meta) | T38, T42 | domain.test (textoResultado, CA-27), checklist CA-27 |
| RN-10, RF-06 (igual) | T42 | domain.test (sentidoVariacao), checklist CA-26 |
| RNF-11 | T39, T40, T41 | layout.test (empilhar), varredura.test (sem limite de linhas), checklist CA-29 (só no aparelho) |
| RF-08, RF-17 (CA-30) | T43 | storage.test (apagar e carregar várias vezes), checklist CA-30 |
| RNF-12 | T44 | leitura de `app.json` e `eas.json`; build manual (fora desta versão) |
