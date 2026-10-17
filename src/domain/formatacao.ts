// RNF-02 e RN-08: exibição em pt-BR e leitura do que o comerciante digita.
// A conversão de/para centavos acontece só aqui (ADR-004).

/** 533 → "R$ 5,33"; 123456 → "R$ 1.234,56". */
export function formatarReais(centavos: number): string {
  const sinal = centavos < 0 ? '-' : '';
  const abs = Math.abs(Math.round(centavos));
  const reais = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const cents = (abs % 100).toString().padStart(2, '0');
  return `${sinal}R$ ${reais},${cents}`;
}

/** 20 → "20,0%"; com sinal: 10 → "+10,0%"; 10900 → "10.900,0%". null → "—" (sem variação, CA-06). */
export function formatarPercentual(valor: number | null, comSinal = false): string {
  if (valor === null) {
    return '—';
  }
  const decimos = Math.round(Math.abs(valor) * 10);
  let sinal = '';
  if (decimos !== 0) {
    if (valor < 0) {
      sinal = '-';
    } else if (comSinal) {
      sinal = '+';
    }
  }
  const inteiro = Math.floor(decimos / 10)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const texto = `${inteiro},${decimos % 10}`;
  return `${sinal}${texto}%`;
}

/** Data ISO → "dd/mm/aaaa" no horário do aparelho. */
export function formatarData(iso: string): string {
  const d = new Date(iso);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

/**
 * Texto digitado → centavos. Aceita "5,33" ou "5.33", até 2 casas, sem separador
 * de milhar. Devolve null quando o texto não é um valor válido.
 */
export function parseReais(texto: string): number | null {
  const m = /^(\d*)(?:[.,](\d{1,2}))?$/.exec(texto.trim());
  if (!m || (m[1] === '' && m[2] === undefined)) {
    return null;
  }
  const reais = m[1] === '' ? 0 : parseInt(m[1], 10);
  const cents = m[2] === undefined ? 0 : parseInt(m[2].padEnd(2, '0'), 10);
  return reais * 100 + cents;
}

/**
 * RN-08: ao sair do campo de dinheiro, um valor válido ganha as duas casas ("4" → "4,00").
 * Texto vazio ou inválido volta igual, para a mensagem de erro continuar valendo.
 * Sem separador de milhar, porque o campo não o aceita ("1234" → "1234,00").
 */
export function normalizarMoeda(texto: string): string {
  const centavos = parseReais(texto);
  if (centavos === null) {
    return texto;
  }
  return `${Math.floor(centavos / 100)},${String(centavos % 100).padStart(2, '0')}`;
}
