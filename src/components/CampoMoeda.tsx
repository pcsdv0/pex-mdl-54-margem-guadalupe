import { Campo, PropsCampo } from './Campo';

/** Valor em R$, com teclado numérico. Aceita "5,33" ou "5.33" (RN-08); a leitura é feita com parseReais. */
export function CampoMoeda(props: PropsCampo) {
  return <Campo {...props} prefixo="R$" teclado="decimal-pad" placeholder="0,00" />;
}
