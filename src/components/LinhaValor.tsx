import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, fonte, NomeCor, numeros, peso } from '../theme/tema';
import { useEmpilhar } from './useLayout';

/** Número grande cresce no máximo isto com a fonte do sistema; acima, não cabe (RNF-11). */
const CRESCIMENTO_MAXIMO_NUMERO = 1.3;

interface Props {
  rotulo: string;
  valor: string;
  /** "grande" para os números que importam (RNF-08). */
  tamanho?: 'grande' | 'medio';
  cor?: NomeCor;
  alinhar?: 'inicio' | 'fim';
}

/**
 * Rótulo pequeno e discreto em cima; número grande, com algarismos alinhados, embaixo (RNF-08).
 * O rótulo pode quebrar em mais de uma linha: nunca é cortado (RNF-11).
 */
export function LinhaValor({ rotulo, valor, tamanho = 'grande', cor = 'texto', alinhar = 'inicio' }: Props) {
  // Quando os valores ficam empilhados, cada um ocupa a largura toda, alinhado à esquerda.
  const empilhado = useEmpilhar();
  const alinhamento = alinhar === 'fim' && !empilhado ? estilos.textoFim : null;
  return (
    <View style={estilos.bloco} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <Text style={[estilos.rotulo, alinhamento]}>{rotulo}</Text>
      <Text
        maxFontSizeMultiplier={CRESCIMENTO_MAXIMO_NUMERO}
        style={[
          tamanho === 'grande' ? estilos.grande : estilos.medio,
          numeros,
          alinhamento,
          { color: cores[cor] },
        ]}
      >
        {valor}
      </Text>
    </View>
  );
}

interface PropsPar {
  esquerda: ReactNode;
  direita: ReactNode;
}

/**
 * Dois valores lado a lado, cada um com metade da linha, ou um embaixo do outro quando a tela
 * é estreita ou a fonte é grande (RNF-11). Os dois nunca disputam a mesma largura.
 */
export function ParDeValores({ esquerda, direita }: PropsPar) {
  const empilhado = useEmpilhar();
  return (
    <View style={empilhado ? estilos.coluna : estilos.linha}>
      <View style={empilhado ? null : estilos.metade}>{esquerda}</View>
      <View style={empilhado ? null : estilos.metade}>{direita}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: espaco.xs },
  rotulo: { fontSize: fonte.legenda, color: cores.textoSuave },
  grande: { fontSize: fonte.titulo, fontWeight: peso.forte },
  medio: { fontSize: fonte.subtitulo, fontWeight: peso.medio },
  textoFim: { textAlign: 'right' },
  linha: { flexDirection: 'row', alignItems: 'flex-end', gap: espaco.m },
  coluna: { gap: espaco.m },
  metade: { flex: 1, minWidth: 0 },
});
