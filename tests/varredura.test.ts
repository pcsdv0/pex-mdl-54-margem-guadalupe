// RNF-05, RNF-10 e RNF-11 (CA-21, CA-29): telas e componentes só usam tokens do tema,
// todo elemento tocável tem rótulo de acessibilidade e nenhum texto é limitado a uma linha.
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const PASTAS = ['src/screens', 'src/components', 'src/navigation'];

const arquivos = PASTAS.flatMap((pasta) =>
  readdirSync(join(__dirname, '..', pasta))
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => join(pasta, f)),
);

function ler(arquivo: string): string {
  return readFileSync(join(__dirname, '..', arquivo), 'utf8');
}

const COR_SOLTA = /#[0-9a-fA-F]{3,8}\b|rgba?\(/;
const TAMANHO_SOLTO =
  /\b(fontSize|padding[A-Za-z]*|margin[A-Za-z]*|gap|borderRadius|border[A-Za-z]*Width|minHeight|minWidth|height|width|top|bottom|left|right|lineHeight)\s*:\s*-?[1-9]|fontWeight\s*:\s*'/;

describe('varredura das telas e componentes (RNF-05, RNF-10)', () => {
  test('existem arquivos para conferir', () => {
    expect(arquivos.length).toBeGreaterThan(10);
  });

  test.each(arquivos)('CA-21: %s não tem cor solta', (arquivo) => {
    expect(ler(arquivo)).not.toMatch(COR_SOLTA);
  });

  test.each(arquivos)('CA-21: %s não tem tamanho, espaço ou peso de fonte solto', (arquivo) => {
    expect(ler(arquivo)).not.toMatch(TAMANHO_SOLTO);
  });

  test.each(arquivos)('RNF-11: %s não limita o texto a uma linha nem usa reticências', (arquivo) => {
    expect(ler(arquivo)).not.toMatch(/numberOfLines|ellipsizeMode|adjustsFontSizeToFit/);
  });

  test.each(arquivos)('RNF-10: todo Pressable de %s tem rótulo de acessibilidade', (arquivo) => {
    const linhas = ler(arquivo).split('\n');
    linhas.forEach((linha, i) => {
      if (linha.includes('<Pressable')) {
        const abertura = linhas.slice(i, i + 12).join('\n');
        expect(abertura).toMatch(/accessibilityLabel=/);
      }
    });
  });
});
