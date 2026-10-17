import { contraste } from '../src/theme/contraste';
import { cores, espaco, fonte, PARES_DE_TEXTO, TOQUE_MINIMO } from '../src/theme/tema';

describe('contraste (WCAG 2)', () => {
  test('preto sobre branco = 21:1 e branco sobre branco = 1:1', () => {
    expect(contraste('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contraste('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });

  test('a ordem das cores não importa', () => {
    expect(contraste('#0B4F8A', '#FFFFFF')).toBeCloseTo(contraste('#FFFFFF', '#0B4F8A'), 10);
  });

  test('valor conhecido: #767676 sobre branco ≈ 4,54:1', () => {
    expect(contraste('#767676', '#FFFFFF')).toBeCloseTo(4.54, 2);
  });
});

describe('tema (RNF-05, RNF-06, RNF-07)', () => {
  test.each(PARES_DE_TEXTO)('CA-21: contraste de %s sobre %s ≥ 4,5:1', (texto, fundo) => {
    expect(contraste(cores[texto], cores[fundo])).toBeGreaterThanOrEqual(4.5);
  });

  test('espaçamento em escala de 4', () => {
    for (const valor of Object.values(espaco)) {
      expect(valor % 4).toBe(0);
    }
  });

  test('CA-33: o tamanho destaque é o maior do tema, acima do título', () => {
    const maior = Math.max(...Object.values(fonte));
    expect(fonte.destaque).toBe(maior);
    expect(fonte.destaque).toBeGreaterThan(fonte.titulo);
  });

  test('4 a 5 tamanhos de fonte', () => {
    const tamanhos = new Set(Object.values(fonte));
    expect(tamanhos.size).toBeGreaterThanOrEqual(4);
    expect(tamanhos.size).toBeLessThanOrEqual(5);
  });

  test('área de toque mínima de 48 px', () => {
    expect(TOQUE_MINIMO).toBeGreaterThanOrEqual(48);
  });
});

