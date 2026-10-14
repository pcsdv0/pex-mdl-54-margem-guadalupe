// Regras de cálculo (requirements §4). Funções puras: sem React, sem armazenamento.
// Dinheiro sempre em centavos inteiros (ADR-004); porcentagens em número (25 = 25%).

/** RN-01: margem = (preço − custo) ÷ preço, em %. Pode ser negativa. */
export function calcularMargem(precoCentavos: number, custoCentavos: number): number {
  if (precoCentavos <= 0) {
    throw new RangeError('O preço de venda precisa ser maior que zero.');
  }
  return ((precoCentavos - custoCentavos) * 100) / precoCentavos;
}
