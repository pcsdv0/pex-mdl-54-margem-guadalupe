import { calcularMargem } from '../src/domain/calculos';

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
