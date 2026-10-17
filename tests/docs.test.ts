// RN-12 e CA-32: os documentos não deixam pendência com cara de esquecimento.
// Dúvida vira decisão (spec e ADR) ou item de docs/depois.md.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const raiz = join(__dirname, '..');

function markdowns(pasta: string): string[] {
  return readdirSync(join(raiz, pasta)).flatMap((nome) => {
    const caminho = join(pasta, nome);
    if (statSync(join(raiz, caminho)).isDirectory()) return markdowns(caminho);
    // prompt-ide.md é um arquivo local, fora do repositório (.git/info/exclude).
    return caminho.endsWith('.md') && nome !== 'prompt-ide.md' ? [caminho] : [];
  });
}

const documentos = [
  ...markdowns('specs'),
  ...markdowns('docs'),
  ...markdowns('tests'),
  'README.md',
  'CONTRIBUTING.md',
];

// Marcas de pendência e frases que deixam algo em aberto ("dependência" e "dependente" não contam).
const MARCA = /\b(TBD|TODO|FIXME)\b/;
const FRASE = /a definir|em aberto|(?<![a-zà-ú])pendente|(?<![a-zà-ú])pendência|trocar pelos reais|se possível/i;
const PENDENCIA = { test: (linha: string) => MARCA.test(linha) || FRASE.test(linha) };

describe('documentos sem pendência solta', () => {
  test('existem documentos para conferir', () => {
    expect(documentos.length).toBeGreaterThan(10);
  });

  test.each(documentos)('%s não tem "TBD", "a definir" nem pergunta em aberto', (arquivo) => {
    const linhas = readFileSync(join(raiz, arquivo), 'utf8').split('\n');
    const achadas = linhas.filter((l) => PENDENCIA.test(l));
    expect(achadas).toEqual([]);
  });
});

describe('ADR-007 (RN-12)', () => {
  test('existe e diz que a margem desejada é por produto', () => {
    const texto = readFileSync(join(raiz, 'docs/adr/ADR-007-margem-desejada-por-produto.md'), 'utf8');
    expect(texto).toMatch(/Status:\*\* aceita/);
    expect(texto).toMatch(/por produto/);
  });
});
