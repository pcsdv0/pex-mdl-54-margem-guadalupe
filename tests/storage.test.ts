import AsyncStorage from '@react-native-async-storage/async-storage';

import {
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
