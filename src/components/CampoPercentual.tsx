import { Campo, PropsCampo } from './Campo';

/** Porcentagem inteira (margem desejada, RN-07), com teclado numérico. */
export function CampoPercentual(props: PropsCampo) {
  return <Campo {...props} sufixo="%" teclado="number-pad" placeholder="25" />;
}

/** Texto do campo → número (null quando vazio ou ilegível). A faixa 1–99 é checada em validarProduto. */
export function lerPercentual(texto: string): number | null {
  const t = texto.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(t)) {
    return null;
  }
  return Number(t);
}
