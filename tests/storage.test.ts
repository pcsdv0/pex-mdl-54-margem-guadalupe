import AsyncStorage from '@react-native-async-storage/async-storage';

import { EXEMPLOS, carregarExemplos } from '../src/data/exemplos';
import {
  calcularMargem,
  calcularVariacaoCusto,
  sentidoVariacao,
  situacaoProduto,
  statusMargem,
} from '../src/domain/calculos';
import { fraseResposta } from '../src/domain/explicacao';
import { formatarPercentual } from '../src/domain/formatacao';
import { boasVindasDispensada, dispensarBoasVindas } from '../src/storage/preferencias';
import {
  apagarTodosOsDados,
  cadastrarProduto,
  criarRepositorio,
  registrarCompra,
} from '../src/storage/repositorio';

const ARROZ = { nome: 'Arroz 1 kg', custoAtual: 400, precoVenda: 550, margemDesejada: 25 };

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('repositório com AsyncStorage (RF-07)', () => {
  test('começa vazio', async () => {
    const repo = criarRepositorio();
    expect(await repo.listarProdutos()).toEqual([]);
  });

  test('cadastrar produto grava o produto e o primeiro registro de custo', async () => {
    const repo = criarRepositorio();
    const p = await cadastrarProduto(repo, ARROZ, new Date('2026-10-01T10:00:00Z'));
    expect(p.id).toBeTruthy();
    expect(await repo.listarProdutos()).toEqual([p]);
    const hist = await repo.listarHistorico(p.id);
    expect(hist).toHaveLength(1);
    expect(hist[0]).toMatchObject({ produtoId: p.id, custo: 400, data: '2026-10-01T10:00:00.000Z' });
  });

  test('salvar produto existente atualiza, sem duplicar', async () => {
    const repo = criarRepositorio();
    const p = await cadastrarProduto(repo, ARROZ);
    await repo.salvarProduto({ ...p, precoVenda: 587 });
    const lista = await repo.listarProdutos();
    expect(lista).toHaveLength(1);
    expect(lista[0].precoVenda).toBe(587);
  });

  test('registrar compra grava o custo, atualiza custoAtual e devolve o custo anterior', async () => {
    const repo = criarRepositorio();
    const p = await cadastrarProduto(repo, ARROZ, new Date('2026-10-01T10:00:00Z'));
    const r = await registrarCompra(repo, p, 440, new Date('2026-10-08T10:00:00Z'));
    expect(r.custoAnterior).toBe(400);
    expect(r.produto.custoAtual).toBe(440);
    expect(r.produto.precoVenda).toBe(550);
    expect((await repo.listarProdutos())[0].custoAtual).toBe(440);
  });

  test('CA-08: após duas compras o histórico mostra os custos, mais recente primeiro', async () => {
    const repo = criarRepositorio();
    const p = await cadastrarProduto(repo, ARROZ, new Date('2026-10-01T10:00:00Z'));
    const r1 = await registrarCompra(repo, p, 440, new Date('2026-10-08T10:00:00Z'));
    await registrarCompra(repo, r1.produto, 420, new Date('2026-10-15T10:00:00Z'));
    const custos = (await repo.listarHistorico(p.id)).map((h) => h.custo);
    expect(custos).toEqual([420, 440, 400]);
  });

  test('registros no mesmo instante: o último gravado vem primeiro', async () => {
    const repo = criarRepositorio();
    const agora = new Date('2026-10-01T10:00:00Z');
    const p = await cadastrarProduto(repo, ARROZ, agora);
    await registrarCompra(repo, p, 440, agora);
    expect((await repo.listarHistorico(p.id)).map((h) => h.custo)).toEqual([440, 400]);
  });

  test('histórico é separado por produto', async () => {
    const repo = criarRepositorio();
    const a = await cadastrarProduto(repo, ARROZ);
    const b = await cadastrarProduto(repo, { ...ARROZ, nome: 'Feijão 1 kg', custoAtual: 620 });
    expect((await repo.listarHistorico(a.id)).map((h) => h.custo)).toEqual([400]);
    expect((await repo.listarHistorico(b.id)).map((h) => h.custo)).toEqual([620]);
  });

  test('RF-02: excluir produto apaga também o histórico dele, e só dele', async () => {
    const repo = criarRepositorio();
    const a = await cadastrarProduto(repo, ARROZ);
    await registrarCompra(repo, a, 440);
    const b = await cadastrarProduto(repo, { ...ARROZ, nome: 'Feijão 1 kg' });
    await repo.excluirProduto(a.id);
    expect((await repo.listarProdutos()).map((p) => p.id)).toEqual([b.id]);
    expect(await repo.listarHistorico(a.id)).toEqual([]);
    expect(await repo.listarHistorico(b.id)).toHaveLength(1);
  });

  test('CA-09: ao "reabrir o app" (novo repositório), produtos e histórico continuam lá', async () => {
    const p = await cadastrarProduto(criarRepositorio(), ARROZ);
    await registrarCompra(criarRepositorio(), p, 440);
    const reaberto = criarRepositorio();
    expect((await reaberto.listarProdutos())[0]).toMatchObject({ nome: 'Arroz 1 kg', custoAtual: 440 });
    expect((await reaberto.listarHistorico(p.id)).map((h) => h.custo)).toEqual([440, 400]);
  });

  test('guarda uma chave por coleção, em JSON', async () => {
    await cadastrarProduto(criarRepositorio(), ARROZ);
    expect(JSON.parse((await AsyncStorage.getItem('produtos')) ?? 'null')).toHaveLength(1);
    expect(JSON.parse((await AsyncStorage.getItem('historico')) ?? 'null')).toHaveLength(1);
  });
});

describe('compra com custo igual ao anterior (RN-10, CA-26)', () => {
  test('é gravada e aparece no histórico como "igual", com 0,0%', async () => {
    const repo = criarRepositorio();
    const p = await cadastrarProduto(repo, ARROZ, new Date('2026-10-01T10:00:00Z'));
    const r = await registrarCompra(repo, p, 400, new Date('2026-10-15T10:00:00Z'));
    expect(r.custoAnterior).toBe(400);

    const historico = await repo.listarHistorico(p.id);
    expect(historico.map((h) => h.custo)).toEqual([400, 400]);
    const variacao = calcularVariacaoCusto(historico[1].custo, historico[0].custo);
    expect(sentidoVariacao(variacao)).toBe('igual');
    expect(formatarPercentual(variacao, true)).toBe('0,0%');
  });
});

describe('produtos de exemplo (RF-08, requirements §9)', () => {
  test('valores exatamente como em requirements §9', () => {
    expect(EXEMPLOS).toEqual([
      { nome: 'Arroz 1 kg', custoAtual: 400, precoVenda: 550, margemDesejada: 25 },
      { nome: 'Feijão 1 kg', custoAtual: 620, precoVenda: 850, margemDesejada: 25 },
      { nome: 'Açúcar 1 kg', custoAtual: 330, precoVenda: 450, margemDesejada: 25 },
      { nome: 'Óleo de soja 900 ml', custoAtual: 680, precoVenda: 890, margemDesejada: 20 },
      { nome: 'Café 250 g', custoAtual: 950, precoVenda: 1290, margemDesejada: 25 },
      { nome: 'Leite 1 L', custoAtual: 410, precoVenda: 540, margemDesejada: 20 },
      { nome: 'Macarrão 500 g', custoAtual: 300, precoVenda: 420, margemDesejada: 25 },
      { nome: 'Refrigerante 2 L', custoAtual: 650, precoVenda: 800, margemDesejada: 25 },
    ]);
  });

  test('na carga, só o refrigerante nasce vermelho (18,8% contra 25%)', () => {
    const vermelhos = EXEMPLOS.filter(
      (p) => statusMargem(p.precoVenda, p.custoAtual, p.margemDesejada) === 'vermelho',
    );
    expect(vermelhos.map((p) => p.nome)).toEqual(['Refrigerante 2 L']);
    expect(formatarPercentual(calcularMargem(800, 650))).toBe('18,8%');
  });

  test('CA-22: dois toques ao mesmo tempo em "Carregar exemplos" gravam 8 produtos, não 16', async () => {
    const repo = criarRepositorio();
    await Promise.all([carregarExemplos(repo), carregarExemplos(repo)]);
    expect(await repo.listarProdutos()).toHaveLength(8);
  });

  test('CA-22: carregar de novo com produtos já gravados não duplica', async () => {
    const repo = criarRepositorio();
    await carregarExemplos(repo);
    await carregarExemplos(repo);
    expect(await repo.listarProdutos()).toHaveLength(8);
  });

  test('carregar exemplos grava os 8 produtos, cada um com o primeiro registro de custo', async () => {
    const repo = criarRepositorio();
    await carregarExemplos(repo);
    const produtos = await repo.listarProdutos();
    expect(produtos.map((p) => p.nome)).toEqual(EXEMPLOS.map((e) => e.nome));
    for (const p of produtos) {
      expect((await repo.listarHistorico(p.id)).map((h) => h.custo)).toEqual([p.custoAtual]);
    }
  });
});

describe('preferências: boas-vindas (RF-15)', () => {
  test('CA-19: aparece na primeira abertura e, depois de dispensado, não volta', async () => {
    expect(await boasVindasDispensada()).toBe(false);
    await dispensarBoasVindas();
    expect(await boasVindasDispensada()).toBe(true);
    // "reabrir o app": a leitura vem do armazenamento, não da memória
    expect(await AsyncStorage.getItem('boasVindasDispensada')).toBe('true');
  });
});

describe('apagar todos os dados (RF-17)', () => {
  test('CA-24: apaga produtos, histórico e a preferência de boas-vindas', async () => {
    const repo = criarRepositorio();
    const p = await cadastrarProduto(repo, ARROZ);
    await registrarCompra(repo, p, 440);
    await dispensarBoasVindas();

    await apagarTodosOsDados();

    expect(await repo.listarProdutos()).toEqual([]);
    expect(await repo.listarHistorico(p.id)).toEqual([]);
    expect(await boasVindasDispensada()).toBe(false);
  });

  test('não mexe em outras chaves do aparelho', async () => {
    await AsyncStorage.setItem('outra-coisa', 'x');
    await apagarTodosOsDados();
    expect(await AsyncStorage.getItem('outra-coisa')).toBe('x');
  });

  test('CA-30: apagar e carregar exemplos, várias vezes, sempre deixa o mesmo estado de ensaio', async () => {
    const repo = criarRepositorio();
    for (let ensaio = 0; ensaio < 4; ensaio++) {
      await carregarExemplos(repo);
      // Um ensaio qualquer mexe nos dados antes de zerar.
      const antes = await repo.listarProdutos();
      const arrozAntes = antes.find((x) => x.nome === 'Arroz 1 kg')!;
      await registrarCompra(repo, arrozAntes, 440);
      await repo.salvarProduto({ ...arrozAntes, custoAtual: 440, precoVenda: 587 });
      await dispensarBoasVindas();

      await apagarTodosOsDados();
      expect(await repo.listarProdutos()).toEqual([]);
      expect(await boasVindasDispensada()).toBe(false);

      // Dois toques seguidos em "Carregar exemplos" depois de zerar.
      await Promise.all([carregarExemplos(repo), carregarExemplos(repo)]);
      const produtos = await repo.listarProdutos();
      expect(produtos).toHaveLength(8);
      expect(produtos.map(({ id, ...resto }) => resto)).toEqual(EXEMPLOS);

      const abaixo = produtos.filter(
        (x) => situacaoProduto(x.precoVenda, x.custoAtual, x.margemDesejada).status === 'vermelho',
      );
      expect(abaixo.map((x) => x.nome)).toEqual(['Refrigerante 2 L']);
      const refri = abaixo[0];
      expect(situacaoProduto(refri.precoVenda, refri.custoAtual, refri.margemDesejada).precoSugerido).toBe(867);

      const arroz = produtos.find((x) => x.nome === 'Arroz 1 kg')!;
      expect([arroz.custoAtual, arroz.precoVenda]).toEqual([400, 550]);
      expect((await repo.listarHistorico(arroz.id)).map((h) => h.custo)).toEqual([400]);
      // A demonstração volta a dar R$ 5,87 (CA-12).
      const demo = situacaoProduto(arroz.precoVenda, 440, arroz.margemDesejada);
      expect(fraseResposta(demo.precoSugerido, arroz.margemDesejada)).toBe(
        'Venda a R$\u00a05,87 para manter 25% de margem',
      );
    }
  });

  test('depois de apagar, carregar exemplos funciona de novo', async () => {
    const repo = criarRepositorio();
    await carregarExemplos(repo);
    await apagarTodosOsDados();
    await carregarExemplos(repo);
    expect(await repo.listarProdutos()).toHaveLength(8);
  });
});
