// RF-12: organização da lista de produtos (ordem, busca, filtro) e resumo de uma frase.
import { statusMargem } from './calculos';

/** O mínimo de um produto que a lista precisa. */
export interface ItemLista {
  nome: string;
  custoAtual: number;
  precoVenda: number;
  margemDesejada: number;
}

export type Filtro = 'todos' | 'abaixo' | 'na-meta';

/** Minúsculas e sem acentos: "Feijão" → "feijao". */
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function abaixoDaMeta(p: ItemLista): boolean {
  return statusMargem(p.precoVenda, p.custoAtual, p.margemDesejada) === 'vermelho';
}

/** Filtra por nome e situação; ordena com os abaixo da meta primeiro e depois por nome (A–Z). */
export function organizarLista<T extends ItemLista>(
  produtos: T[],
  opcoes: { busca: string; filtro: Filtro },
): T[] {
  const busca = normalizar(opcoes.busca);
  return produtos
    .filter((p) => busca === '' || normalizar(p.nome).includes(busca))
    .filter((p) => {
      if (opcoes.filtro === 'abaixo') return abaixoDaMeta(p);
      if (opcoes.filtro === 'na-meta') return !abaixoDaMeta(p);
      return true;
    })
    .map((p) => ({ p, abaixo: abaixoDaMeta(p), chave: normalizar(p.nome) }))
    .sort((a, b) => {
      if (a.abaixo !== b.abaixo) return a.abaixo ? -1 : 1;
      return a.chave < b.chave ? -1 : a.chave > b.chave ? 1 : 0;
    })
    .map((x) => x.p);
}

/** "1 de 8 produtos abaixo da meta" ou "Todos os 8 produtos estão na meta". */
export function resumoLista(produtos: ItemLista[]): string {
  const total = produtos.length;
  if (total === 0) return 'Nenhum produto cadastrado';
  const abaixo = produtos.filter(abaixoDaMeta).length;
  if (abaixo === 0) {
    return total === 1 ? 'O produto está na meta' : `Todos os ${total} produtos estão na meta`;
  }
  return `${abaixo} de ${total} ${total === 1 ? 'produto' : 'produtos'} abaixo da meta`;
}
