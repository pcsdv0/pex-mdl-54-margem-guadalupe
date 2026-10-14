# design.md

> Estado: **v1.1 — aprovada pelo líder (portão 2).** Mudanças da v1.1 no registro de mudanças do `requirements.md`. Só vale depois do `requirements.md` aprovado. Cada decisão aponta para os requisitos que atende.

## 1. Visão geral
App mobile em React Native + Expo (TypeScript), 100% local. Três camadas, para que a lógica seja testável sem interface:

```
screens/ (interface)  →  domain/ (regras puras, sem React)  →  storage/ (AsyncStorage)
```

## 2. Telas e fluxos
| Tela | Função | Atende |
| --- | --- | --- |
| Lista de produtos (inicial) | Cartões com nome, preço, margem atual e semáforo; botão "Novo produto"; botão "Carregar exemplos" quando vazia | RF-03, RF-08 |
| Produto (cadastro/edição) | Formulário nome, custo, preço, margem desejada. Na edição: botões "Nova compra" e "Ver histórico" no topo, custo só leitura, botão excluir (apaga o produto e o histórico dele, com confirmação) | RF-01, RF-02, RF-04, RF-06 |
| Nova compra | Campo "novo custo" (validado, RN-07); ao confirmar, grava a compra (novo `RegistroCusto` e `custoAtual`) e mostra o resultado | RF-04 |
| Resultado da compra | Nova margem, variação do custo, alerta, preço sugerido; botões "Aplicar preço sugerido" (atualiza o preço e volta para a lista) e "Manter preço" (só volta para a lista) | RF-04, RF-05 |
| Histórico de custos | Lista de data e custo, com variação entre compras | RF-06 |

Fluxo principal (RNF-03): Lista → toque no produto (abre a tela Produto) → "Nova compra" → informar custo → "Confirmar" → Resultado (3 toques até o resultado; digitar não conta).

Histórico: Lista → toque no produto → "Ver histórico".

Navegação: pilha simples (React Navigation, native stack).

## 3. Componentes
```
App
└─ NavigationContainer / Stack
   ├─ ListaProdutosScreen
   │   ├─ ProdutoCard  (nome, preço, margem, SemaforoBadge)
   │   └─ EstadoVazio  (botão carregar exemplos)
   ├─ ProdutoFormScreen  (CampoMoeda, CampoPercentual)
   ├─ NovaCompraScreen   (CampoMoeda)
   ├─ ResultadoCompraScreen (SemaforoBadge, LinhaInfo, AlertaBanner)
   └─ HistoricoScreen    (LinhaHistorico)
```

Todas as telas usam `Botao` (botão grande, área de toque ≥ 56 px). `Campo` é o campo de texto base (rótulo, erro, só leitura), usado no nome do produto e por `CampoMoeda` e `CampoPercentual`. `EstadoVazio`, `LinhaInfo` e `LinhaHistorico` ficam dentro da tela que os usa.

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

## 6. Armazenamento (`src/storage`)
`AsyncStorage` com uma chave por coleção (`produtos`, `historico`), serializada em JSON. Interface `repositorio` com `listar`, `salvar`, `excluir`, para trocar a implementação sem tocar nas telas. `excluir` de um produto remove também o histórico dele. Atende RF-07, RF-02.

## 7. Estrutura de pastas
```
src/
  domain/      calculos.ts, validacao.ts, formatacao.ts
  storage/     repositorio.ts
  data/        exemplos.ts
  screens/     ListaProdutos, ProdutoForm, NovaCompra, ResultadoCompra, Historico
  components/  ProdutoCard, SemaforoBadge, AlertaBanner, Campo, CampoMoeda, CampoPercentual, Botao
  navigation/  index.tsx
  theme/       cores.ts
tests/         domain.test.ts, storage.test.ts, checklist-manual.md
```

## 8. Decisões de arquitetura
- ADR-001 React Native + Expo + TypeScript
- ADR-002 Dados no aparelho com AsyncStorage
- ADR-003 Arredondamento do preço sugerido ao centavo mais próximo
- ADR-004 Dinheiro em centavos inteiros

## 9. Rastreabilidade
Cada RF/RN aparece em ao menos uma tarefa (`tasks.md`) e um teste. A matriz está no fim do `tasks.md`.
