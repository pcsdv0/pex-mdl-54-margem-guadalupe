// Tema do app (RNF-05): todas as cores e tamanhos usados nas telas e componentes vêm daqui.
// Contraste dos pares de texto conferido em tests/tema.test.ts (RNF-06).

export const cores = {
  fundo: '#F3F4F6',
  superficie: '#FFFFFF',
  texto: '#111827',
  textoSuave: '#4B5563',
  borda: '#D1D5DB',
  bordaForte: '#6B7280',
  primaria: '#0B4F8A',
  primariaFundo: '#E8F0F8',
  sobrePrimaria: '#FFFFFF',
  verde: '#146C2E',
  verdeFundo: '#E6F4EA',
  vermelho: '#B42318',
  vermelhoFundo: '#FDECEA',
  aviso: '#1F2937',
  sobreAviso: '#FFFFFF',
  sombra: '#000000',
  veu: 'rgba(17, 24, 39, 0.5)',
};

export type NomeCor = keyof typeof cores;

/** Pares [texto, fundo] usados no app; todos precisam de contraste ≥ 4,5:1. */
export const PARES_DE_TEXTO: [NomeCor, NomeCor][] = [
  ['texto', 'fundo'],
  ['texto', 'superficie'],
  ['textoSuave', 'fundo'],
  ['textoSuave', 'superficie'],
  ['sobrePrimaria', 'primaria'],
  ['primaria', 'superficie'],
  ['primaria', 'fundo'],
  ['primaria', 'primariaFundo'],
  ['texto', 'primariaFundo'],
  ['verde', 'verdeFundo'],
  ['verde', 'superficie'],
  ['vermelho', 'vermelhoFundo'],
  ['vermelho', 'superficie'],
  ['texto', 'vermelhoFundo'],
  ['sobreAviso', 'aviso'],
];

/** Escala de espaçamento (múltiplos de 4). */
export const espaco = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
};

/** 5 tamanhos de fonte. */
export const fonte = {
  legenda: 14,
  corpo: 17,
  subtitulo: 20,
  titulo: 26,
  numero: 34,
};

export const peso = {
  normal: '400',
  medio: '600',
  forte: '800',
} as const;

export const raio = {
  campo: 8,
  cartao: 12,
  redondo: 999,
};

export const linha = {
  fina: 1,
  grossa: 2,
  destaque: 6,
};

export const sombra = {
  cartao: {
    shadowColor: cores.sombra,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
};

/** Tamanho dos ícones. */
export const icone = {
  pequeno: 18,
  medio: 24,
  grande: 32,
};

/** Área mínima de toque (RNF-07). */
export const TOQUE_MINIMO = 48;

/** Algarismos de largura fixa, para números alinhados (RNF-08). */
export const numeros = { fontVariant: ['tabular-nums'] as 'tabular-nums'[] };
