# design.md

> Estado: **v1.4 — mudanças pedidas pelo líder em 16/10/2026.** A v1.3 foi aprovada no portão 2. Mudanças da v1.1 a v1.4 no registro de mudanças do `requirements.md`. Só vale depois do `requirements.md` aprovado. Cada decisão aponta para os requisitos que atende.

## 1. Visão geral
App mobile em React Native + Expo (TypeScript), 100% local. Três camadas, para que a lógica seja testável sem interface:

```
screens/ (interface)  →  domain/ (regras puras, sem React)  →  storage/ (AsyncStorage)
```

## 2. Telas e fluxos
Cada tela tem **um** botão principal (RNF-07) e um botão "?" no cabeçalho, que abre a Ajuda (RF-13).

| Tela | Função | Botão principal | Atende |
| --- | --- | --- | --- |
| Lista de produtos (inicial) | Cartão de boas-vindas na primeira abertura (dispensável). Resumo de uma frase ("1 de 8 produtos abaixo da meta"), busca por nome, filtro Todos / Abaixo da meta / Na meta. Cartões ordenados: abaixo da meta primeiro, depois A–Z. Cada cartão: nome, preço e margem em destaque, semáforo; o vermelho mostra "Sugerido: R$ X". Vazia: explicação e botões "Novo produto" e "Carregar exemplos". Busca sem resultado: mensagem | "+ Novo produto" | RF-03, RF-08, RF-12, RF-15 |
| Produto (edição) | Cartão de situação (preço, margem, semáforo e, se vermelho, preço sugerido). "Nova compra" como botão principal; "Ver histórico" secundário. Seção "Dados do produto" com nome, custo (só leitura), preço e margem desejada, cada um com texto de apoio; "Salvar alterações" secundário; "Excluir produto" como botão de texto, com confirmação numa janela do app | "Nova compra" | RF-01, RF-02, RF-04, RF-06, RF-13, RF-14 |
| Produto (cadastro) | Mesmo formulário com foco automático no nome e tecla "próximo" entre os campos | "Salvar produto" | RF-01, RF-13, RF-14 |
| Nova compra | Campo "novo custo" com foco automático. Prévia em tempo real (margem com o preço atual, semáforo, preço sugerido) usando as funções do domínio, e aviso "Confira o valor" quando a variação passa de ±50% (RN-09; não bloqueia). Ao confirmar, grava a compra e abre o resultado | "Confirmar compra" | RF-04, RF-11 |
| Resultado da compra | Cartão grande com a resposta ("Venda a R$ 5,87 para manter 25% de margem"). Abaixo, situação atual (preço, margem, semáforo), variação do custo e alerta. Área "Como chegamos nisso" que abre e fecha. Abaixo da meta: "Aplicar preço sugerido" (principal) e "Manter preço atual" (secundário). Na meta (v1.4): a resposta é "Seu preço de R$ 5,50 já garante 25% de margem" e "Manter preço atual" é o principal, com "Usar o preço sugerido" secundário. Os dois com aviso de confirmação | "Aplicar preço sugerido" | RF-04, RF-05, RF-09, RF-10, RF-14 |
| Histórico de custos | Lista de data, custo e variação; cada linha com seta e palavra ("subiu", "caiu", "igual") ou "—" na primeira compra; compra com custo igual ao anterior também é uma linha, com "igual" e 0,0% (RN-10) | — | RF-06, RF-16 |
| Ajuda | Explicação em linguagem simples de margem, margem desejada, preço sugerido e semáforo, com o exemplo do arroz. No fim, "Apagar todos os dados" (botão de texto, com confirmação; depois volta à lista vazia com as boas-vindas) | — | RF-13 |

Fluxo principal (RNF-03): Lista → toque no produto (abre a tela Produto) → "Nova compra" → informar custo → "Confirmar compra" → Resultado (3 toques até o resultado; digitar não conta).

Histórico: Lista → toque no produto → "Ver histórico".

Navegação: pilha simples (React Navigation, native stack). Avisos rápidos (RF-14) ficam acima da navegação, para continuarem visíveis depois de voltar à lista.

## 3. Componentes
```
App
└─ AvisoProvider (avisos rápidos, RF-14)
   └─ NavigationContainer / Stack   (cabeçalho com BotaoAjuda em todas as telas)
      ├─ ListaProdutosScreen
      │   ├─ CartaoBoasVindas
      │   ├─ CampoBusca, FiltroSegmentado
      │   ├─ ProdutoCard  (nome, LinhaValor, SemaforoBadge, sugerido)
      │   └─ EstadoVazio
      ├─ ProdutoFormScreen  (CartaoSituacao, Campo, CampoMoeda, CampoPercentual, DialogoConfirmacao)
      ├─ NovaCompraScreen   (CampoMoeda, CartaoSituacao como prévia)
      ├─ ResultadoCompraScreen (CartaoResposta, CartaoSituacao, AlertaBanner, ComoChegamos)
      ├─ HistoricoScreen    (LinhaHistorico)
      └─ AjudaScreen
```

- `Botao` tem três variantes: **principal** (cheio), **secundário** (contorno fino, mais fraco) e **texto** (sem caixa; usado em "Excluir produto"). Altura mínima 48 px (RNF-07).
- `Icone` envolve `@expo/vector-icons` (Ionicons) com tamanhos e cores do tema; ícones decorativos ficam ocultos para o leitor de tela e ícones que são botões têm `accessibilityLabel` (RNF-10).
- `SemaforoBadge`: cor + ícone + palavra (RNF-06).
- `LinhaValor`: rótulo pequeno e discreto em cima, número grande com algarismos de largura fixa embaixo (RNF-08). O rótulo quebra em mais de uma linha se precisar; o número grande limita o crescimento da fonte (`maxFontSizeMultiplier`) para caber (RNF-11).
- `Tela` (v1.4): invólucro comum das telas com rolagem — `KeyboardAvoidingView` + `ScrollView` (`keyboardShouldPersistTaps="handled"`), espaço extra embaixo igual à barra do sistema (`useSafeAreaInsets`) e conteúdo centralizado com largura máxima de 600 dp (RNF-11). `ProdutoFormScreen`, `NovaCompraScreen`, `ResultadoCompraScreen` e `AjudaScreen` usam `Tela`; as telas com `FlatList` usam o mesmo estilo de conteúdo pelo hook `useLayout`.
- `useLayout()` (v1.4): lê a largura da janela e a escala da fonte (`useWindowDimensions`) e devolve `empilhar` (regra de `theme/layout.ts`) e o estilo do conteúdo. `LinhaValor`s lado a lado dividem a linha em partes iguais (`flex: 1`); quando `empilhar` é verdadeiro ficam uma embaixo da outra, em largura total (`CartaoSituacao`, `ProdutoCard`, linha do histórico).
- `CartaoSituacao`: preço, margem e semáforo de um produto; com preço sugerido quando pedido. Usado na tela Produto, na prévia da Nova compra e no Resultado.
- `CartaoResposta`: a frase de resposta no tamanho `destaque`, o maior do tema (RF-09, v1.4).
- `ComoChegamos`: área que abre e fecha com os passos da conta e, no fim, a nota do escopo do cálculo (RF-10, RN-11).
- `Campo` ganha texto de apoio, tecla "próximo"/"concluir" e referência para passar o foco (RNF-09). Prefixo ("R$") e sufixo ("%") nunca encolhem; `CampoMoeda`, ao sair do campo, reescreve um valor válido com duas casas (`normalizarMoeda`, RN-08). `CampoBusca` é um campo com ícone de lupa.
- `FiltroSegmentado`: três opções lado a lado, cada uma com área ≥ 48 px.
- `AvisoProvider` / `useAviso()`: aviso rápido no rodapé por cerca de 3 s, sem biblioteca extra (RF-14).
- `DialogoConfirmacao`: janela (`Modal` do React Native) com "Cancelar" e a ação destrutiva (RF-14).
- `BotaoAjuda`: ícone "?" no cabeçalho, área de toque ≥ 48 px, abre a Ajuda.
- `CartaoBoasVindas`: 3 linhas e botão "Entendi" (RF-15).
- `EstadoVazio` e `LinhaHistorico` ficam dentro da tela que os usa.

## 4. Modelo de dados
- `Produto`: `id: string`, `nome: string`, `custoAtual: number` (centavos), `precoVenda: number` (centavos), `margemDesejada: number` (inteiro, 1–99).
- `RegistroCusto`: `id: string`, `produtoId: string`, `custo: number` (centavos), `data: string` (ISO).
- Ao cadastrar um produto, grava-se o primeiro `RegistroCusto`. Cada nova compra grava outro e atualiza `custoAtual`; por isso o custo não é editável no formulário de edição.
- Excluir um produto exclui também os `RegistroCusto` dele.

## 5. Módulo de domínio (`src/domain`)
Funções puras, sem dependência de React ou de armazenamento:
- `calcularMargem(precoCentavos, custoCentavos): number` — RN-01. Preço ≤ 0 lança erro (a validação impede esse caso na tela).
- `calcularPrecoSugerido(custoCentavos, margemDesejada): number` — RN-02, RN-06. Calculado só com inteiros: `Math.round(custo × 100 ÷ (100 − margem))`, para evitar erro de ponto flutuante (410 ÷ 0,8 = 512,4999…). Custo 0 → 0.
- `calcularVariacaoCusto(anterior | null, novo): number | null` — RN-04. Anterior nulo (ou ≤ 0) → `null`.
- `statusMargem(precoCentavos, custoCentavos, margemDesejada): 'verde' | 'vermelho'` — RN-03, RN-05. Verde quando preço ≥ `calcularPrecoSugerido(custo, margem)`.
- `validarProduto(dados): erros` e `validarCusto(custoCentavos | null): erro | null` — RN-07 (o segundo também na Nova compra). Recebem valores já lidos por `parseReais` (`null` = vazio ou ilegível); `erros` é um objeto campo → mensagem, vazio quando tudo está certo.
- `formatarReais(centavos)`, `formatarPercentual(valor, comSinal?)`, `formatarData(iso)`, `parseReais(texto)` — RNF-02, RN-08.

Novas na v1.2 (a interface só chama estas funções; não faz contas):
- `situacaoProduto(precoCentavos, custoCentavos, margemDesejada)` em `calculos.ts`: `{ margem, status, precoSugerido }`. Usada nos cartões, na prévia (RF-11) e no resultado.
- `sentidoVariacao(variacao | null): 'subiu' | 'caiu' | 'igual' | null` em `calculos.ts` — RF-16.
- `explicacao.ts` — RF-09, RF-10:
  - `fraseResposta(precoSugerido, margemDesejada)` → "Venda a R$ 5,87 para manter 25% de margem".
  - `explicarPrecoSugerido(custo, margemDesejada)` → passos em texto, incluindo "R$ 4,40 ÷ (1 − 0,25) = R$ 5,87" e a observação do arredondamento quando houver.
  - `explicarMargem(preco, custo)` → passos em texto, incluindo "(R$ 5,50 − R$ 4,40) ÷ R$ 5,50 = 20,0%".
- `variacaoSuspeita(variacao | null): boolean` em `calculos.ts` (v1.3) — RN-09: `true` acima de +50% ou abaixo de −50%.
- `avisoConferencia(custoAnterior, novoCusto): string | null` em `explicacao.ts` (v1.3) — RF-18: "Confira o valor: o custo subiu 62,5% em relação ao custo atual (R$ 4,00)." ou `null`.
- `normalizarMoeda(texto): string` em `formatacao.ts` (v1.4) — RN-08: "4" → "4,00", "5.5" → "5,50"; texto inválido ou vazio volta igual. `formatarPercentual` passa a separar milhar com ponto ("10.900,0%").
- `textoResultado(situacao, precoAtual, margemDesejada)` em `explicacao.ts` (v1.4) — RF-09: `{ frase, observacao? }`. Abaixo da meta: "Venda a R$ 5,87 para manter 25% de margem" (sem observação). Na meta: "Seu preço de R$ 5,50 já garante 25% de margem", com "O mínimo para manter 25% é R$ 5,33." ou, se o preço atual for igual ao sugerido, "Esse é o preço sugerido.".
- `NOTA_ESCOPO_CALCULO` em `explicacao.ts` (v1.4) — RN-11: "Margem bruta sobre o preço de venda, calculada a partir do custo pago. Impostos sobre a venda e despesas fixas não entram nesta versão." Mostrada pela Ajuda e por `ComoChegamos`.
- `lista.ts` — RF-12:
  - `organizarLista(produtos, { busca, filtro })`: filtra (busca sem diferenciar maiúsculas e acentos; filtro `todos` / `abaixo` / `na-meta`) e ordena (abaixo da meta primeiro, depois nome A–Z em pt-BR).
  - `resumoLista(produtos)` → "1 de 8 produtos abaixo da meta", "1 de 1 produto abaixo da meta", "Todos os 8 produtos estão na meta", "O produto está na meta" (um só, na meta) ou "Nenhum produto cadastrado".

## 6. Armazenamento (`src/storage`)
`AsyncStorage` com uma chave por coleção (`produtos`, `historico`), serializada em JSON. Interface `Repositorio` (`repositorio.ts`), para trocar a implementação sem tocar nas telas:
- `listarProdutos()`, `salvarProduto(produto)` (insere ou atualiza pelo id), `excluirProduto(id)` (remove também o histórico dele);
- `listarHistorico(produtoId)` (mais recente primeiro), `salvarRegistro(registro)`.

Funções que usam a interface: `cadastrarProduto(repo, dados)` (produto + primeiro registro de custo) e `registrarCompra(repo, produto, novoCusto)` (novo registro + `custoAtual`; devolve o custo anterior). A instância usada pelo app é `repositorio`. Atende RF-07, RF-02.

`apagarTodosOsDados()` (v1.3, RF-17; repetível com `carregarExemplos`, CA-30) remove as chaves `produtos`, `historico` e `boasVindasDispensada`. `carregarExemplos` (RF-08) não duplica: se já houver uma carga em andamento, devolve a mesma; se já houver produtos, não carrega de novo.

Telas que gravam (cadastro, carga de exemplos, nova compra, aplicar preço) ignoram um segundo toque enquanto a gravação anterior não termina (CA-22). A tela Produto, ao voltar ao foco, atualiza a situação e o custo, mas não sobrescreve campos que o comerciante alterou e não salvou (CA-23).

`preferencias.ts` (v1.2): chave `boasVindasDispensada` no AsyncStorage, com `boasVindasDispensada(): Promise<boolean>` e `dispensarBoasVindas()`. Atende RF-15.

## 7. Estrutura de pastas
```
src/
  domain/      calculos.ts, validacao.ts, formatacao.ts, explicacao.ts, lista.ts
  storage/     repositorio.ts, preferencias.ts
  data/        exemplos.ts
  screens/     ListaProdutos, ProdutoForm, NovaCompra, ResultadoCompra, Historico, Ajuda
  components/  ProdutoCard, SemaforoBadge, AlertaBanner, Campo, CampoMoeda, CampoPercentual, CampoBusca,
               Botao, Icone, LinhaValor, CartaoSituacao, CartaoResposta, ComoChegamos, FiltroSegmentado,
               Aviso, DialogoConfirmacao, BotaoAjuda, CartaoBoasVindas, Tela, useLayout
  navigation/  index.tsx
  theme/       tema.ts (tokens), contraste.ts (cálculo de contraste WCAG), layout.ts (regras de disposição, sem React)
tests/         domain.test.ts, storage.test.ts, tema.test.ts (contraste), layout.test.ts (disposição por tamanho de tela e fonte), varredura.test.ts (tokens, rótulos e texto sem limite de linhas), checklist-manual.md
```

## 8. Decisões de arquitetura
- ADR-001 React Native + Expo + TypeScript
- ADR-002 Dados no aparelho com AsyncStorage
- ADR-003 Arredondamento do preço sugerido ao centavo mais próximo
- ADR-004 Dinheiro em centavos inteiros
- ADR-005 Expo SDK 57, React Navigation e ferramentas de teste
- ADR-006 Ícones com @expo/vector-icons; avisos e confirmação sem biblioteca extra
- ADR-007 Margem desejada por produto

## 9. Rastreabilidade
Cada RF/RN aparece em ao menos uma tarefa (`tasks.md`) e um teste. A matriz está no fim do `tasks.md`.

## 10. Tema e interação (v1.2)
Tokens em `src/theme/tema.ts`; telas e componentes só usam tokens (RNF-05, verificado em `tests/varredura.test.ts`).
- **Cores:** fundo, superfície, texto, texto suave, borda, primária (+ texto sobre primária), verde/vermelho (+ fundos claros). Só azul, neutros, verde e vermelho; verde e vermelho têm sentido de situação (RNF-05). O histórico usa o azul. O alerta usa o ícone `alert-circle`, o mesmo do semáforo vermelho e dos erros de campo. Todo par texto/fundo usado tem contraste ≥ 4,5:1 (RNF-06, verificado com `contraste.ts`).
- **Espaço:** escala 4, 8, 12, 16, 24, 32.
- **Fonte:** 5 tamanhos: legenda 14, corpo 17, subtítulo 20, título 26 (os números importantes) e destaque 32 (só a frase da resposta, o maior elemento da tela de resultado). Pesos: normal, médio, forte. Números com `fontVariant: ['tabular-nums']` (RNF-08).
- **Raio:** 8 (campos), 12 (cartões), redondo (selos).
- **Sombra:** uma sombra suave para cartões.
- **Toque:** mínimo de 48 px (RNF-07).
- **Teclado (RNF-09):** formulário dentro de `KeyboardAvoidingView` + `ScrollView` (`keyboardShouldPersistTaps="handled"`); `returnKeyType="next"` com foco no campo seguinte; `autoFocus` no primeiro campo do cadastro e da Nova compra.

## 11. Telas, fontes e barras do sistema (v1.4, RNF-11)
Causa dos cortes vistos no Android (Expo Go): dois blocos de texto lado a lado, sem largura definida, dentro de uma linha com `flexWrap`. A largura de cada bloco era calculada antes de a linha dividir o espaço; o texto quebrava numa segunda linha que não tinha altura, e o fim sumia ("Margem (meta" sem "25%)"). A correção fica nos componentes comuns, não tela por tela. Hipótese tirada da leitura do código e dos sintomas; a confirmação é no aparelho (checklist CA-29).
- **Regra de disposição** (`theme/layout.ts`, testada em `tests/layout.test.ts`): `empilhar(larguraDp, escalaFonte)` é verdadeiro quando a largura é menor que 360 dp ou a escala da fonte passa de 1,15. Valores lado a lado só aparecem em linha quando `empilhar` é falso, e cada um com `flex: 1` e `minWidth: 0`.
- **Sem limite de linhas:** nenhuma tela ou componente usa `numberOfLines` nem `ellipsizeMode` (verificado em `varredura.test.ts`). Textos em linha com outro elemento ficam em `flexShrink: 1`.
- **Fonte grande:** números grandes (`LinhaValor` grande, resposta) usam `maxFontSizeMultiplier` de 1,3; o resto cresce até o limite do sistema. O título do cabeçalho não escala (`headerTitleAllowFontScaling: false`), para não ser cortado ao lado dos botões.
- **Largura:** `LARGURA_MAXIMA = 600` em `tema.ts`; o conteúdo fica centralizado a partir daí (tablet e web). A janela de confirmação e o aviso rápido seguem o mesmo limite.
- **Barras do sistema:** o rodapé da lista, o aviso rápido e o fim de cada tela com rolagem somam a margem inferior de `useSafeAreaInsets()`. O cabeçalho nativo já respeita a barra de status e o recorte da câmera.
- **Teclado:** `KeyboardAvoidingView` com `behavior="padding"` nas duas plataformas (no Android com tela de ponta a ponta, que é o padrão do Expo atual, a janela não encolhe sozinha).
- **Retrato:** `orientation: "portrait"` no `app.json`.
- **Instalação (RNF-12):** `app.json` (nome "Controle de Margem", `slug` mantido por estar ligado ao projeto no EAS, pacote `br.edu.uninassau.controlemargem`, `versionCode` 1, ícone, ícone adaptativo e tela de abertura na cor `primaria` pelo plugin `expo-splash-screen`) e `eas.json` com o perfil `preview` (`android.buildType: "apk"`). O build é manual e fica documentado no README.
