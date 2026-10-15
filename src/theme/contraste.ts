// RNF-06: razão de contraste entre duas cores, pela fórmula da WCAG 2.

function canal(valor: number): number {
  const c = valor / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminancia(hex: string): number {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

/** Razão de contraste (1 a 21) entre duas cores "#RRGGBB". */
export function contraste(cor1: string, cor2: string): number {
  const l1 = luminancia(cor1);
  const l2 = luminancia(cor2);
  const [claro, escuro] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (claro + 0.05) / (escuro + 0.05);
}
