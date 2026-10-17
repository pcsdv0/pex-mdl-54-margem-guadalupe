// T51: o SPEC.md (documento-mestre) cita os mesmos números e links que os outros documentos.
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const raiz = join(__dirname, '..');
const ler = (arquivo: string) => readFileSync(join(raiz, arquivo), 'utf8');

const mestre = ler('specs/SPEC.md');
const requisitos = ler('specs/requirements.md');
const tarefas = ler('specs/tasks.md');

/** IDs distintos de um prefixo (RF-, RNF-, RN-, CA-) definidos em linhas de definição do requirements. */
function contar(prefixo: string): number {
  const ids = new Set<string>();
  for (const linha of requisitos.split('\n')) {
    const m = new RegExp(String.raw`^(?:\| |- \*{0,2})${prefixo}-(\d+)\b`).exec(linha);
    if (m) ids.add(m[1]);
  }
  return ids.size;
}

function numeroNoMestre(rotulo: string): number {
  const m = new RegExp(String.raw`\*\*${rotulo}:\*\* (\d+)`).exec(mestre);
  expect(m).not.toBeNull();
  return Number(m![1]);
}

describe('SPEC.md alinhado aos outros documentos (T51)', () => {
  test('versão da spec igual à do requirements', () => {
    const versao = /Estado: \*\*(v\d+\.\d+)/.exec(requisitos)![1];
    expect(mestre).toContain(`**Versão da spec:** ${versao}`);
  });

  test.each([
    ['RF', 'Requisitos funcionais'],
    ['RNF', 'Requisitos não funcionais'],
    ['RN', 'Regras de negócio'],
    ['CA', 'Critérios de aceite'],
  ])('quantidade de %s', (prefixo, rotulo) => {
    expect(numeroNoMestre(rotulo)).toBe(contar(prefixo));
  });

  test('quantidade de ADRs (decisões, sem o modelo)', () => {
    const adrs = readdirSync(join(raiz, 'docs/adr')).filter((f) => /^ADR-\d+/.test(f) && !f.startsWith('ADR-000'));
    expect(numeroNoMestre('ADRs')).toBe(adrs.length);
  });

  test('tarefas concluídas e total', () => {
    const linhas = tarefas.split('\n').filter((l) => /^\| T\d+ \|/.test(l));
    const feitas = linhas.filter((l) => /\[x\] \|$/.test(l.trim())).length;
    expect(numeroNoMestre('Tarefas concluídas')).toBe(feitas);
    expect(numeroNoMestre('Tarefas no total')).toBe(linhas.length);
  });

  test('os links do índice apontam para arquivos que existem', () => {
    const links = [...mestre.matchAll(/\]\(([^)#]+)\)/g)].map((m) => m[1]);
    expect(links.length).toBeGreaterThanOrEqual(5);
    for (const link of links) {
      expect(existsSync(join(raiz, 'specs', link))).toBe(true);
    }
  });

  test('traz os princípios, o escopo e o que fica de fora', () => {
    expect(mestre).toMatch(/Spec primeiro/);
    expect(mestre).toMatch(/Um commit por tarefa/);
    expect(mestre).toMatch(/impostos/i);
    expect(mestre).toMatch(/despesas fixas/i);
  });
});
