// RN-07: validação dos dados digitados. Recebe valores já lidos (null = vazio ou ilegível).

export interface DadosProduto {
  nome: string;
  custo: number | null; // centavos
  preco: number | null; // centavos
  margemDesejada: number | null; // inteiro, 1–99
}

export type ErrosProduto = Partial<Record<keyof DadosProduto, string>>;

const MSG_CUSTO = 'Informe o custo. Ele precisa ser maior que zero.';
const MSG_PRECO = 'Informe o preço de venda. Ele precisa ser maior que zero.';
const MSG_NOME = 'Informe o nome do produto.';
const MSG_MARGEM = 'A margem desejada deve ser um número inteiro de 1 a 99.';

function positivo(valor: number | null): boolean {
  return valor !== null && Number.isFinite(valor) && valor > 0;
}

/** Custo > 0. Usado no cadastro e na tela Nova compra (CA-10). */
export function validarCusto(custoCentavos: number | null): string | null {
  return positivo(custoCentavos) ? null : MSG_CUSTO;
}

export function validarProduto(dados: DadosProduto): ErrosProduto {
  const erros: ErrosProduto = {};
  if (dados.nome.trim() === '') {
    erros.nome = MSG_NOME;
  }
  const erroCusto = validarCusto(dados.custo);
  if (erroCusto) {
    erros.custo = erroCusto;
  }
  if (!positivo(dados.preco)) {
    erros.preco = MSG_PRECO;
  }
  const m = dados.margemDesejada;
  if (m === null || !Number.isInteger(m) || m < 1 || m > 99) {
    erros.margemDesejada = MSG_MARGEM;
  }
  return erros;
}
