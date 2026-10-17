// RF-09 e RF-10: textos que explicam as contas com os números do produto.
// Funções puras; os números vêm de calculos.ts e o formato de formatacao.ts.
import {
  calcularMargem,
  calcularPrecoSugerido,
  calcularVariacaoCusto,
  Situacao,
  variacaoSuspeita,
} from './calculos';
import { formatarPercentual, formatarReais } from './formatacao';

/** 25 → "0,25"; 7 → "0,07". Margem desejada é inteira de 1 a 99 (RN-07). */
function margemDecimal(margemDesejada: number): string {
  return `0,${String(margemDesejada).padStart(2, '0')}`;
}

/** RF-09: "Venda a R$ 5,87 para manter 25% de margem". */
export function fraseResposta(precoSugeridoCentavos: number, margemDesejada: number): string {
  return `Venda a ${formatarReais(precoSugeridoCentavos)} para manter ${margemDesejada}% de margem`;
}

/**
 * RF-09 (v1.4): o que o cartão de resposta diz. Abaixo da meta, a frase de sempre; na meta,
 * que o preço atual já garante a margem, para não sugerir uma baixa de preço sem querer.
 */
export function textoResultado(
  situacao: Situacao,
  precoAtualCentavos: number,
  margemDesejada: number,
): { frase: string; observacao?: string } {
  if (situacao.status === 'vermelho') {
    return { frase: fraseResposta(situacao.precoSugerido, margemDesejada) };
  }
  return {
    frase: `Seu preço de ${formatarReais(precoAtualCentavos)} já garante ${margemDesejada}% de margem`,
    observacao:
      precoAtualCentavos === situacao.precoSugerido
        ? 'Esse é o preço sugerido.'
        : `O mínimo para manter ${margemDesejada}% é ${formatarReais(situacao.precoSugerido)}.`,
  };
}

/** RF-10: passos da conta do preço sugerido (RN-02, RN-06). */
export function explicarPrecoSugerido(custoCentavos: number, margemDesejada: number): string[] {
  const sugerido = calcularPrecoSugerido(custoCentavos, margemDesejada);
  const passos = [
    `Você quer que sobre ${margemDesejada}% do preço de venda. Então o custo deve ser ${100 - margemDesejada}% do preço (100% − ${margemDesejada}%).`,
    'Preço sugerido = custo ÷ (1 − margem desejada)',
    `${formatarReais(custoCentavos)} ÷ (1 − ${margemDecimal(margemDesejada)}) = ${formatarReais(sugerido)}`,
  ];
  if ((custoCentavos * 100) % (100 - margemDesejada) !== 0) {
    passos.push('A conta não dá um valor exato em centavos, então arredondamos para o centavo mais próximo.');
  }
  return passos;
}

/** RF-10: passos da conta da margem com o preço atual (RN-01). */
export function explicarMargem(precoCentavos: number, custoCentavos: number): string[] {
  const diferenca = precoCentavos - custoCentavos;
  const margem = formatarPercentual(calcularMargem(precoCentavos, custoCentavos));
  const preco = formatarReais(precoCentavos);
  const custo = formatarReais(custoCentavos);
  const sobra =
    diferenca >= 0
      ? `Com o preço de ${preco} e o custo de ${custo}, sobram ${formatarReais(diferenca)} por unidade.`
      : `Com o preço de ${preco} e o custo de ${custo}, o preço não cobre o custo: faltam ${formatarReais(-diferenca)} por unidade.`;
  return [
    'Margem = (preço − custo) ÷ preço',
    sobra,
    `(${preco} − ${custo}) ÷ ${preco} = ${margem}`,
  ];
}

/** RF-18 e RN-09: "Confira o valor…" quando a variação passa de ±50%; null quando está dentro. */
export function avisoConferencia(custoAnteriorCentavos: number, novoCustoCentavos: number): string | null {
  const variacao = calcularVariacaoCusto(custoAnteriorCentavos, novoCustoCentavos);
  if (variacao === null || !variacaoSuspeita(variacao)) {
    return null;
  }
  const sentido = variacao > 0 ? 'subiu' : 'caiu';
  return `Confira o valor: o custo ${sentido} ${formatarPercentual(Math.abs(variacao))} em relação ao custo atual (${formatarReais(custoAnteriorCentavos)}).`;
}
