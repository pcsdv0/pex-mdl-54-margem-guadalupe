# design.md

> Estado: **v1.0 — para aprovação do líder (portão 2).** Só vale depois do `requirements.md` aprovado. Cada decisão aponta para os requisitos que atende.

## 1. Visão geral
App mobile em React Native + Expo (TypeScript), 100% local. Três camadas, para que a lógica seja testável sem interface:

```
screens/ (interface)  →  domain/ (regras puras, sem React)  →  storage/ (AsyncStorage)
```

## 2. Telas e fluxos
| Tela | Função | Atende |
| --- | --- | --- |
| Lista de produtos (inicial) | Cartões com nome, preço, margem atual e semáforo; botão "Novo produto"; botão "Carregar exemplos" quando vazia | RF-03, RF-08 |
| Produto (cadastro/edição) | Formulário nome, custo, preço, margem desejada; excluir | RF-01, RF-02 |
| Nova compra | Campo "novo custo"; ao confirmar, mostra o resultado | RF-04 |
| Resultado da compra | Nova margem, variação do custo, alerta, preço sugerido; botões "Aplicar preço sugerido" e "Manter preço" | RF-04, RF-05 |
| Histórico de custos | Lista de data e custo, com variação entre compras | RF-06 |

Fluxo principal (RNF-03): Lista → toque no produto → "Nova compra" → informar custo → Resultado (3 toques até o resultado).

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

## 4. Modelo de dados
- `Produto`: `id: string`, `nome: string`, `custoAtual: number` (centavos), `precoVenda: number` (centavos), `margemDesejada: number` (1–99).
- `RegistroCusto`: `id: string`, `produtoId: string`, `custo: number` (centavos), `data: string` (ISO).
- Ao cadastrar um produto, grava-se o primeiro `RegistroCusto`. Cada nova compra grava outro e atualiza `custoAtual`.

## 5. Módulo de domínio (`src/domain`)
Funções puras, sem dependência de React ou de armazenamento:
- `calcularMargem(precoCentavos, custoCentavos): number` — RN-01
- `calcularPrecoSugerido(custoCentavos, margemDesejada): number` — RN-02, RN-06
- `calcularVariacaoCusto(anterior | null, novo): number | null` — RN-04
- `statusMargem(margemAtual, margemDesejada): 'verde' | 'vermelho'` — RN-03, RN-05
- `validarProduto(dados): erros` — RN-07
- `formatarReais(centavos)`, `formatarPercentual(valor)`, `parseReais(texto)` — RNF-02

## 6. Armazenamento (`src/storage`)
`AsyncStorage` com uma chave por coleção (`produtos`, `historico`), serializada em JSON. Interface `repositorio` com `listar`, `salvar`, `excluir`, para trocar a implementação sem tocar nas telas. Atende RF-07.

## 7. Estrutura de pastas
```
src/
  domain/      calculos.ts, validacao.ts, formatacao.ts
  storage/     repositorio.ts
  data/        exemplos.ts
  screens/     ListaProdutos, ProdutoForm, NovaCompra, ResultadoCompra, Historico
  components/  ProdutoCard, SemaforoBadge, AlertaBanner, CampoMoeda, CampoPercentual
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
