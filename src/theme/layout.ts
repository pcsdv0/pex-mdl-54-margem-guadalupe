// Regras de disposição por tamanho de tela e de fonte (design §11, RNF-11).
// Sem React: testadas em tests/layout.test.ts.
import { LARGURA_MAXIMA } from './tema';

/** Abaixo desta largura (dp), valores não ficam lado a lado. */
const LARGURA_MINIMA_LADO_A_LADO = 360;
/** Acima desta escala da fonte do sistema, valores não ficam lado a lado. */
const ESCALA_MAXIMA_LADO_A_LADO = 1.15;

/** Largura útil do conteúdo: a da janela, no máximo LARGURA_MAXIMA (tablet e web). */
export function larguraDoConteudo(larguraJanela: number): number {
  return Math.min(larguraJanela, LARGURA_MAXIMA);
}

/**
 * true quando rótulo e valor de dois blocos não cabem lado a lado e devem ficar um embaixo do
 * outro. Dado inválido (0, NaN) empilha, que é o lado seguro: nada fica cortado.
 */
export function empilhar(larguraConteudo: number, escalaFonte: number): boolean {
  const cabeLargura = larguraConteudo >= LARGURA_MINIMA_LADO_A_LADO;
  const cabeFonte = escalaFonte <= ESCALA_MAXIMA_LADO_A_LADO;
  return !(cabeLargura && cabeFonte);
}
