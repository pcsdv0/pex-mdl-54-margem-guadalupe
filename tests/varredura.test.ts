// RNF-05, RNF-10 e RNF-11 (CA-21, CA-29): telas e componentes só usam tokens do tema,
// todo elemento tocável tem rótulo de acessibilidade e nenhum texto é limitado a uma linha.
import { readdirSync, readFileSync, statSync } from 'fs';
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

  test.each(arquivos)('CA-34: %s não escreve "R$" seguido de espaço comum', (arquivo) => {
    const codigo = ler(arquivo)
      .split('\n')
      .filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l));
    expect(codigo.join('\n')).not.toMatch(/R\$ /);
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

  test('RN-11, CA-31: a Ajuda mostra a nota do escopo do cálculo', () => {
    expect(ler('src/screens/Ajuda.tsx')).toMatch(/NOTA_ESCOPO_CALCULO/);
  });

  // CA-32: um nome só para a margem desejada ("meta" é o apelido curto).
  const TERMO_PROIBIDO =
    /margem[- ]alvo|margem objetivo|margem esperada|margem pretendida|margem que (você|voce) quer|(sua|minha|nossa) margem(?! desejada)/i;

  function todosOsArquivos(pasta: string): string[] {
    return readdirSync(join(__dirname, '..', pasta)).flatMap((nome) => {
      const caminho = join(pasta, nome);
      return statSync(join(__dirname, '..', caminho)).isDirectory()
        ? todosOsArquivos(caminho)
        : [caminho];
    });
  }
  const textosDoApp = todosOsArquivos('src').filter((f) => /\.tsx?$/.test(f));

  test.each(textosDoApp)('CA-32: %s usa só "margem desejada" (e "meta")', (arquivo) => {
    expect(ler(arquivo)).not.toMatch(TERMO_PROIBIDO);
  });

  // CA-33: a cor significa uma coisa só, e a resposta é o maior texto.
  test('CA-33: o histórico não usa verde nem vermelho', () => {
    expect(ler('src/screens/Historico.tsx')).not.toMatch(/'verde'|'vermelho'|cores\.(verde|vermelho)/);
  });

  test('CA-33: a frase da resposta usa o tamanho destaque', () => {
    expect(ler('src/components/CartaoResposta.tsx')).toMatch(/fonte\.destaque/);
  });

  test('CA-33: um só ícone de alerta (alert-circle); sem "warning"', () => {
    for (const arquivo of arquivos) {
      expect(ler(arquivo)).not.toMatch(/['"]warning['"]/);
    }
  });
});
