// Regras de cálculo (requirements §4). Funções puras: sem React, sem armazenamento.
// Dinheiro sempre em centavos inteiros (ADR-004); porcentagens em número (25 = 25%).

/** RN-01: margem = (preço − custo) ÷ preço, em %. Pode ser negativa. */
export function calcularMargem(precoCentavos: number, custoCentavos: number): number {
  if (precoCentavos <= 0) {
    throw new RangeError('O preço de venda precisa ser maior que zero.');
  }
  return ((precoCentavos - custoCentavos) * 100) / precoCentavos;
}

/**
 * RN-02 e RN-06: preço sugerido = custo ÷ (1 − margem desejada), arredondado ao
 * centavo mais próximo (ADR-003). Calculado só com inteiros, para evitar erro de
 * ponto flutuante (410 ÷ 0,8 = 512,4999…).
 */
export function calcularPrecoSugerido(custoCentavos: number, margemDesejada: number): number {
  return Math.round((custoCentavos * 100) / (100 - margemDesejada));
}

/** RN-04: variação = (novo − anterior) ÷ anterior, em %. Sem custo anterior → null ("—"). */
export function calcularVariacaoCusto(
  anteriorCentavos: number | null,
  novoCentavos: number,
): number | null {
  if (anteriorCentavos === null || anteriorCentavos <= 0) {
    return null;
  }
  return ((novoCentavos - anteriorCentavos) * 100) / anteriorCentavos;
}

export type Status = 'verde' | 'vermelho';

/**
 * RN-03 e RN-05 (v1.1): verde quando o preço de venda ≥ preço sugerido; vermelho
 * (com alerta) quando abaixo. Assim, aplicar o preço sugerido sempre deixa verde (CA-11).
 */
export function statusMargem(
  precoCentavos: number,
  custoCentavos: number,
  margemDesejada: number,
): Status {
  return precoCentavos >= calcularPrecoSugerido(custoCentavos, margemDesejada) ? 'verde' : 'vermelho';
}
