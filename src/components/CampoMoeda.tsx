import { normalizarMoeda, parseReais } from '../domain/formatacao';
import { Campo, PropsCampo } from './Campo';

/** Valor em R$, com teclado numérico. Aceita "5,33" ou "5.33" (RN-08); a leitura é feita com parseReais. */
export function CampoMoeda(props: PropsCampo) {
  const { valor, onChange } = props;
  // RN-08: ao sair do campo, "4" vira "4,00". Só mexe no texto se ele mudar.
  function aoSair() {
    const normalizado = normalizarMoeda(valor);
    if (normalizado !== valor) onChange?.(normalizado);
    props.aoSair?.();
  }
  return (
    <Campo {...props} aoSair={aoSair} prefixo="R$" teclado="decimal-pad" placeholder="0,00" numerico />
  );
}

export const MSG_VALOR_INVALIDO = 'Valor inválido. Use só números e vírgula, por exemplo 5,33.';

/**
 * Mensagem para texto preenchido que não é um valor (RN-08); null quando vazio ou legível.
 * Número negativo também devolve null: a validação (RN-07) dá a mensagem "maior que zero".
 */
export function erroFormatoMoeda(texto: string): string | null {
  const t = texto.trim();
  if (t === '' || parseReais(t.replace(/^-/, '')) !== null) {
    return null;
  }
  return MSG_VALOR_INVALIDO;
}

/** Centavos → texto para o campo, sem "R$" e sem separador de milhar (533 → "5,33"). */
export function centavosParaCampo(centavos: number): string {
  return `${Math.floor(centavos / 100)},${String(centavos % 100).padStart(2, '0')}`;
}
