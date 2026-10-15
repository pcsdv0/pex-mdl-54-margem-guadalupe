// RF-08: produtos de exemplo para demonstração (requirements §9).
// Valores ILUSTRATIVOS, não são dados reais do Mercado de Guadalupe.
import { cadastrarProduto, Produto, Repositorio } from '../storage/repositorio';

export const EXEMPLOS: Omit<Produto, 'id'>[] = [
  { nome: 'Arroz 1 kg', custoAtual: 400, precoVenda: 550, margemDesejada: 25 },
  { nome: 'Feijão 1 kg', custoAtual: 620, precoVenda: 850, margemDesejada: 25 },
  { nome: 'Açúcar 1 kg', custoAtual: 330, precoVenda: 450, margemDesejada: 25 },
  { nome: 'Óleo de soja 900 ml', custoAtual: 680, precoVenda: 890, margemDesejada: 20 },
  { nome: 'Café 250 g', custoAtual: 950, precoVenda: 1290, margemDesejada: 25 },
  { nome: 'Leite 1 L', custoAtual: 410, precoVenda: 540, margemDesejada: 20 },
  { nome: 'Macarrão 500 g', custoAtual: 300, precoVenda: 420, margemDesejada: 25 },
  { nome: 'Refrigerante 2 L', custoAtual: 650, precoVenda: 800, margemDesejada: 25 },
];

// CA-22: uma carga por vez; um segundo toque recebe a carga que já está em andamento.
let cargaEmAndamento: Promise<void> | null = null;

/**
 * Cadastra os exemplos, cada um com o primeiro registro de custo. Não duplica: se já houver
 * produtos gravados, não faz nada; se já houver uma carga em andamento, devolve a mesma.
 */
export function carregarExemplos(repo: Repositorio, agora: Date = new Date()): Promise<void> {
  if (!cargaEmAndamento) {
    cargaEmAndamento = (async () => {
      if ((await repo.listarProdutos()).length > 0) return;
      for (const exemplo of EXEMPLOS) {
        await cadastrarProduto(repo, exemplo, agora);
      }
    })().finally(() => {
      cargaEmAndamento = null;
    });
  }
  return cargaEmAndamento;
}
