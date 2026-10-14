import {
  calcularMargem,
  calcularPrecoSugerido,
  calcularVariacaoCusto,
} from '../src/domain/calculos';

describe('calcularMargem (RN-01)', () => {
  test('CA-02: custo R$ 4,00 e preço R$ 5,00 → margem 20%', () => {
    expect(calcularMargem(500, 400)).toBeCloseTo(20, 10);
  });

  test('exemplo do arroz: custo R$ 4,00 e preço R$ 5,50 → 27,27…%', () => {
    expect(calcularMargem(550, 400)).toBeCloseTo(27.2727, 3);
  });

  test('custo zero → margem 100%', () => {
    expect(calcularMargem(500, 0)).toBe(100);
  });

  test('preço igual ao custo → margem 0%', () => {
    expect(calcularMargem(500, 500)).toBe(0);
  });

  test('preço abaixo do custo → margem negativa', () => {
    expect(calcularMargem(400, 500)).toBeCloseTo(-25, 10);
  });

  test('preço zero ou negativo lança erro', () => {
    expect(() => calcularMargem(0, 400)).toThrow(RangeError);
    expect(() => calcularMargem(-100, 400)).toThrow(RangeError);
  });
});

describe('calcularPrecoSugerido (RN-02, RN-06)', () => {
  test('CA-01: custo R$ 4,00 e margem 25% → R$ 5,33', () => {
    expect(calcularPrecoSugerido(400, 25)).toBe(533);
  });

  test('demonstração: arroz a R$ 4,40 e margem 25% → R$ 5,87', () => {
    expect(calcularPrecoSugerido(440, 25)).toBe(587);
  });

  test('arredonda ao centavo mais próximo, sem erro de ponto flutuante (512,5 → 513)', () => {
    // 410 ÷ 0,8 em ponto flutuante dá 512,4999…; com inteiros dá 512,5 exato.
    expect(calcularPrecoSugerido(410, 20)).toBe(513);
  });

  test('arredonda para baixo quando a fração é menor que meio centavo', () => {
    expect(calcularPrecoSugerido(10, 25)).toBe(13); // 13,33…
  });

  test('custo zero → preço sugerido zero', () => {
    expect(calcularPrecoSugerido(0, 25)).toBe(0);
  });

  test('margem desejada 99 → preço 100 vezes o custo', () => {
    expect(calcularPrecoSugerido(400, 99)).toBe(40000);
  });

  test('resultado é sempre inteiro (centavos)', () => {
    for (const custo of [1, 7, 333, 999, 12345]) {
      for (const margem of [1, 13, 25, 33, 50, 99]) {
        expect(Number.isInteger(calcularPrecoSugerido(custo, margem))).toBe(true);
      }
    }
  });
});

describe('calcularVariacaoCusto (RN-04)', () => {
  test('CA-05: custo anterior R$ 4,00 e novo R$ 4,40 → +10%', () => {
    expect(calcularVariacaoCusto(400, 440)).toBeCloseTo(10, 10);
  });

  test('queda de custo → variação negativa', () => {
    expect(calcularVariacaoCusto(400, 380)).toBeCloseTo(-5, 10);
  });

  test('custo igual → variação zero', () => {
    expect(calcularVariacaoCusto(400, 400)).toBe(0);
  });

  test('CA-06: sem custo anterior → sem variação (null)', () => {
    expect(calcularVariacaoCusto(null, 400)).toBeNull();
  });

  test('custo anterior zero ou negativo → sem variação (null)', () => {
    expect(calcularVariacaoCusto(0, 400)).toBeNull();
    expect(calcularVariacaoCusto(-10, 400)).toBeNull();
  });
});
