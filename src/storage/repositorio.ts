// Armazenamento no aparelho (design §6, ADR-002). As telas usam só a interface
// Repositorio; trocar o AsyncStorage por outra coisa não mexe nas telas.
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Modelo de dados (design §4). Dinheiro em centavos. */
export interface Produto {
  id: string;
  nome: string;
  custoAtual: number;
  precoVenda: number;
  margemDesejada: number;
}

export interface RegistroCusto {
  id: string;
  produtoId: string;
  custo: number;
  data: string; // ISO
}

export interface Repositorio {
  listarProdutos(): Promise<Produto[]>;
  /** Insere ou atualiza pelo id. */
  salvarProduto(produto: Produto): Promise<void>;
  /** Exclui o produto e o histórico de custos dele (RF-02). */
  excluirProduto(id: string): Promise<void>;
  /** Histórico de um produto, mais recente primeiro (RF-06). */
  listarHistorico(produtoId: string): Promise<RegistroCusto[]>;
  salvarRegistro(registro: RegistroCusto): Promise<void>;
}

const CHAVE_PRODUTOS = 'produtos';
const CHAVE_HISTORICO = 'historico';

async function ler<T>(chave: string): Promise<T[]> {
  const json = await AsyncStorage.getItem(chave);
  return json ? (JSON.parse(json) as T[]) : [];
}

async function gravar<T>(chave: string, itens: T[]): Promise<void> {
  await AsyncStorage.setItem(chave, JSON.stringify(itens));
}

export function criarRepositorio(): Repositorio {
  return {
    listarProdutos: () => ler<Produto>(CHAVE_PRODUTOS),

    async salvarProduto(produto) {
      const produtos = await ler<Produto>(CHAVE_PRODUTOS);
      const i = produtos.findIndex((p) => p.id === produto.id);
      if (i >= 0) {
        produtos[i] = produto;
      } else {
        produtos.push(produto);
      }
      await gravar(CHAVE_PRODUTOS, produtos);
    },

    async excluirProduto(id) {
      const produtos = await ler<Produto>(CHAVE_PRODUTOS);
      const historico = await ler<RegistroCusto>(CHAVE_HISTORICO);
      await gravar(CHAVE_HISTORICO, historico.filter((r) => r.produtoId !== id));
      await gravar(CHAVE_PRODUTOS, produtos.filter((p) => p.id !== id));
    },

    async listarHistorico(produtoId) {
      const historico = await ler<RegistroCusto>(CHAVE_HISTORICO);
      // Inverte a ordem de gravação antes de ordenar: no empate de data, o último gravado vem primeiro.
      return historico
        .filter((r) => r.produtoId === produtoId)
        .reverse()
        .sort((a, b) => b.data.localeCompare(a.data));
    },

    async salvarRegistro(registro) {
      const historico = await ler<RegistroCusto>(CHAVE_HISTORICO);
      historico.push(registro);
      await gravar(CHAVE_HISTORICO, historico);
    },
  };
}

export function novoId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Cadastra o produto e grava o primeiro registro de custo (design §4). */
export async function cadastrarProduto(
  repo: Repositorio,
  dados: Omit<Produto, 'id'>,
  agora: Date = new Date(),
): Promise<Produto> {
  const produto: Produto = { id: novoId(), ...dados };
  await repo.salvarProduto(produto);
  await repo.salvarRegistro({
    id: novoId(),
    produtoId: produto.id,
    custo: produto.custoAtual,
    data: agora.toISOString(),
  });
  return produto;
}

/** Nova compra (RF-04): grava o registro e atualiza o custo atual. */
export async function registrarCompra(
  repo: Repositorio,
  produto: Produto,
  novoCusto: number,
  agora: Date = new Date(),
): Promise<{ produto: Produto; custoAnterior: number | null }> {
  const anteriores = await repo.listarHistorico(produto.id);
  const custoAnterior = anteriores.length > 0 ? anteriores[0].custo : null;
  await repo.salvarRegistro({
    id: novoId(),
    produtoId: produto.id,
    custo: novoCusto,
    data: agora.toISOString(),
  });
  const atualizado: Produto = { ...produto, custoAtual: novoCusto };
  await repo.salvarProduto(atualizado);
  return { produto: atualizado, custoAnterior };
}
