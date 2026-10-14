# design.md

> Estado: **v1.2 — aprovada pelo líder (portão 2).** Mudanças da v1.1 e da v1.2 no registro de mudanças do `requirements.md`. Só vale depois do `requirements.md` aprovado. Cada decisão aponta para os requisitos que atende.

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
| Produto (cadastro) | Mesmo formulário com foco automático no nome e tecla "próximo" entre os campos | "Salvar" | RF-01, RF-13, RF-14 |
| Nova compra | Campo "novo custo" com foco automático. Prévia em tempo real (margem com o preço atual, semáforo, preço sugerido) usando as funções do domínio. Ao confirmar, grava a compra e abre o resultado | "Confirmar compra" | RF-04, RF-11 |
| Resultado da compra | Cartão grande com a resposta ("Venda a R$ 5,87 para manter 25% de margem"). Abaixo, situação atual (preço, margem, semáforo), variação do custo e alerta. Área "Como chegamos nisso" que abre e fecha. "Aplicar preço sugerido" (principal) e "Manter preço atual" (secundário), com aviso de confirmação | "Aplicar preço sugerido" | RF-04, RF-05, RF-09, RF-10, RF-14 |
| Histórico de custos | Lista de data, custo e variação; cada linha com seta e palavra ("subiu", "caiu", "igual") ou "—" na primeira compra | — | RF-06, RF-16 |
| Ajuda | Explicação em linguagem simples de margem, margem desejada, preço sugerido e semáforo, com o exemplo do arroz | — | RF-13 |

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
- `LinhaValor`: rótulo pequeno e discreto em cima, número grande com algarismos de largura fixa embaixo (RNF-08).
- `CartaoSituacao`: preço, margem e semáforo de um produto; com preço sugerido quando pedido. Usado na tela Produto, na prévia da Nova compra e no Resultado.
- `CartaoResposta`: a frase de resposta em fonte grande (RF-09).
- `ComoChegamos`: área que abre e fecha com os passos da conta (RF-10).
- `Campo` ganha texto de apoio, tecla "próximo"/"concluir" e referência para passar o foco (RNF-09). `CampoBusca` é um campo com ícone de lupa.
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
- `lista.ts` — RF-12:
  - `organizarLista(produtos, { busca, filtro })`: filtra (busca sem diferenciar maiúsculas e acentos; filtro `todos` / `abaixo` / `na-meta`) e ordena (abaixo da meta primeiro, depois nome A–Z em pt-BR).
  - `resumoLista(produtos)` → "1 de 8 produtos abaixo da meta", "Todos os 8 produtos estão na meta" ou "1 de 1 produto abaixo da meta".

## 6. Armazenamento (`src/storage`)
`AsyncStorage` com uma chave por coleção (`produtos`, `historico`), serializada em JSON. Interface `repositorio` com `listar`, `salvar`, `excluir`, para trocar a implementação sem tocar nas telas. `excluir` de um produto remove também o histórico dele. Atende RF-07, RF-02.

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
               Aviso, DialogoConfirmacao, BotaoAjuda, CartaoBoasVindas
  navigation/  index.tsx
  theme/       tema.ts (tokens), contraste.ts (cálculo de contraste WCAG)
tests/         domain.test.ts, storage.test.ts, tema.test.ts, checklist-manual.md
```

## 8. Decisões de arquitetura
- ADR-001 React Native + Expo + TypeScript
- ADR-002 Dados no aparelho com AsyncStorage
- ADR-003 Arredondamento do preço sugerido ao centavo mais próximo
- ADR-004 Dinheiro em centavos inteiros
- ADR-005 Expo SDK 57, React Navigation e ferramentas de teste
- ADR-006 Ícones com @expo/vector-icons; avisos e confirmação sem biblioteca extra

## 9. Rastreabilidade
Cada RF/RN aparece em ao menos uma tarefa (`tasks.md`) e um teste. A matriz está no fim do `tasks.md`.

## 10. Tema e interação (v1.2)
Tokens em `src/theme/tema.ts`; telas e componentes só usam tokens (RNF-05, verificado em `tests/tema.test.ts`).
- **Cores:** fundo, superfície, texto, texto suave, borda, primária (+ texto sobre primária), verde/vermelho (+ fundos claros), perigo. Todo par texto/fundo usado tem contraste ≥ 4,5:1 (RNF-06, verificado com `contraste.ts`).
- **Espaço:** escala 4, 8, 12, 16, 24, 32.
- **Fonte:** 5 tamanhos: legenda 14, corpo 17, subtítulo 20, título 26, número 34. Pesos: normal, médio, forte. Números com `fontVariant: ['tabular-nums']` (RNF-08).
- **Raio:** 8 (campos), 12 (cartões), redondo (selos).
- **Sombra:** uma sombra suave para cartões.
- **Toque:** mínimo de 48 px (RNF-07).
- **Teclado (RNF-09):** formulário dentro de `KeyboardAvoidingView` + `ScrollView` (`keyboardShouldPersistTaps="handled"`); `returnKeyType="next"` com foco no campo seguinte; `autoFocus` no primeiro campo do cadastro e da Nova compra.
