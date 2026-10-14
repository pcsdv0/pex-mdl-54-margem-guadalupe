import {
  calcularMargem,
  calcularPrecoSugerido,
  calcularVariacaoCusto,
  statusMargem,
} from '../src/domain/calculos';
import { validarCusto, validarProduto } from '../src/domain/validacao';

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

describe('statusMargem (RN-03, RN-05)', () => {
  test('CA-03: margem atual 20,0% e desejada 25% → vermelho (com alerta)', () => {
    expect(statusMargem(500, 400, 25)).toBe('vermelho');
  });

  test('CA-04: margem atual 30% e desejada 25% → verde (sem alerta)', () => {
    // custo R$ 7,00 e preço R$ 10,00 → margem 30%
    expect(statusMargem(1000, 700, 25)).toBe('verde');
  });

  test('CA-11: depois de aplicar o preço sugerido R$ 5,33 o produto fica verde', () => {
    const sugerido = calcularPrecoSugerido(400, 25);
    expect(sugerido).toBe(533);
    expect(calcularMargem(sugerido, 400)).toBeLessThan(25); // 24,95% por causa do arredondamento
    expect(statusMargem(sugerido, 400, 25)).toBe('verde');
  });

  test('um centavo abaixo do preço sugerido → vermelho', () => {
    expect(statusMargem(532, 400, 25)).toBe('vermelho');
  });

  test('margem exatamente igual à desejada → verde', () => {
    expect(statusMargem(400, 300, 25)).toBe('verde');
  });

  test('preço sugerido aplicado deixa verde para qualquer custo e margem', () => {
    for (const custo of [1, 10, 99, 410, 1234]) {
      for (const margem of [1, 20, 25, 33, 99]) {
        expect(statusMargem(calcularPrecoSugerido(custo, margem), custo, margem)).toBe('verde');
      }
    }
  });

  test('exemplos de requirements §9: só o refrigerante nasce vermelho', () => {
    expect(statusMargem(550, 400, 25)).toBe('verde'); // arroz
    expect(statusMargem(540, 410, 20)).toBe('verde'); // leite
    expect(statusMargem(800, 650, 25)).toBe('vermelho'); // refrigerante
  });

  test('demonstração: arroz com novo custo R$ 4,40 e preço R$ 5,50 → vermelho', () => {
    expect(statusMargem(550, 440, 25)).toBe('vermelho');
  });
});

describe('validarProduto e validarCusto (RN-07)', () => {
  const valido = { nome: 'Arroz 1 kg', custo: 400, preco: 550, margemDesejada: 25 };

  test('produto válido → sem erros', () => {
    expect(validarProduto(valido)).toEqual({});
  });

  test('nome vazio ou só espaços → erro no nome', () => {
    expect(validarProduto({ ...valido, nome: '' }).nome).toBeDefined();
    expect(validarProduto({ ...valido, nome: '   ' }).nome).toBeDefined();
  });

  test('CA-10: custo zero, negativo ou vazio é recusado com mensagem', () => {
    for (const custo of [0, -100, null]) {
      expect(validarProduto({ ...valido, custo }).custo).toMatch(/custo/i);
      expect(validarCusto(custo)).toMatch(/custo/i);
    }
  });

  test('custo válido na Nova compra → sem erro', () => {
    expect(validarCusto(440)).toBeNull();
  });

  test('preço zero, negativo ou vazio → erro no preço', () => {
    for (const preco of [0, -1, null]) {
      expect(validarProduto({ ...valido, preco }).preco).toMatch(/preço/i);
    }
  });

  test('preço abaixo do custo é aceito (margem negativa é permitida)', () => {
    expect(validarProduto({ ...valido, preco: 300 })).toEqual({});
  });

  test('margem desejada aceita 1 e 99', () => {
    expect(validarProduto({ ...valido, margemDesejada: 1 })).toEqual({});
    expect(validarProduto({ ...valido, margemDesejada: 99 })).toEqual({});
  });

  test('margem desejada fora de 1–99, não inteira ou vazia → erro', () => {
    for (const margemDesejada of [0, 100, -5, 25.5, null]) {
      expect(validarProduto({ ...valido, margemDesejada }).margemDesejada).toBeDefined();
    }
  });

  test('vários erros ao mesmo tempo', () => {
    const erros = validarProduto({ nome: '', custo: null, preco: null, margemDesejada: null });
    expect(Object.keys(erros).sort()).toEqual(['custo', 'margemDesejada', 'nome', 'preco']);
  });
});
