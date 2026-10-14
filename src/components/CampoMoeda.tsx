import { parseReais } from '../domain/formatacao';
import { Campo, PropsCampo } from './Campo';

/** Valor em R$, com teclado numérico. Aceita "5,33" ou "5.33" (RN-08); a leitura é feita com parseReais. */
export function CampoMoeda(props: PropsCampo) {
  return <Campo {...props} prefixo="R$" teclado="decimal-pad" placeholder="0,00" />;
}

export const MSG_VALOR_INVALIDO = 'Valor inválido. Use só números e vírgula, por exemplo 5,33.';

/** Mensagem para texto preenchido que não é um valor (RN-08); null quando vazio ou legível. */
export function erroFormatoMoeda(texto: string): string | null {
  return texto.trim() !== '' && parseReais(texto) === null ? MSG_VALOR_INVALIDO : null;
}

/** Centavos → texto para o campo, sem "R$" e sem separador de milhar (533 → "5,33"). */
export function centavosParaCampo(centavos: number): string {
  return `${Math.floor(centavos / 100)},${String(centavos % 100).padStart(2, '0')}`;
}
