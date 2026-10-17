// RNF-11 e CA-29: regras de disposição por tamanho de tela e de fonte (src/theme/layout.ts).
import { empilhar, larguraDoConteudo } from '../src/theme/layout';
import { LARGURA_MAXIMA } from '../src/theme/tema';

// Telas da RNF-11 (largura em dp) e escalas de fonte do Android.
const TELAS = [320, 360, 411, 430, 768];
const ESCALAS = [1, 1.3, 1.5, 2];

describe('larguraDoConteudo (RNF-11)', () => {
  test('em telas estreitas usa a largura toda', () => {
    expect(larguraDoConteudo(320)).toBe(320);
    expect(larguraDoConteudo(430)).toBe(430);
  });

  test('em telas largas limita a 600 dp', () => {
    expect(LARGURA_MAXIMA).toBe(600);
    expect(larguraDoConteudo(768)).toBe(600);
    expect(larguraDoConteudo(1280)).toBe(600);
  });
});

describe('empilhar (RNF-11, CA-29)', () => {
  test('tela de 320 dp empilha em qualquer fonte', () => {
    for (const escala of ESCALAS) {
      expect(empilhar(320, escala)).toBe(true);
    }
  });

  test('fonte do sistema em 100%: de 360 dp para cima fica lado a lado', () => {
    for (const largura of [360, 411, 430, 768]) {
      expect(empilhar(larguraDoConteudo(largura), 1)).toBe(false);
    }
  });

  test('fonte em 130%, 150% e 200% empilha em todas as telas', () => {
    for (const largura of TELAS) {
      for (const escala of [1.3, 1.5, 2]) {
        expect(empilhar(larguraDoConteudo(largura), escala)).toBe(true);
      }
    }
  });

  test('os limites exatos: 360 dp e escala 1,15 ainda cabem lado a lado', () => {
    expect(empilhar(360, 1.15)).toBe(false);
    expect(empilhar(359, 1)).toBe(true);
    expect(empilhar(360, 1.16)).toBe(true);
  });

  test('dados de janela inválidos (0, NaN) empilham, que é o lado seguro', () => {
    expect(empilhar(0, 1)).toBe(true);
    expect(empilhar(NaN, 1)).toBe(true);
    expect(empilhar(400, NaN)).toBe(true);
  });
});
