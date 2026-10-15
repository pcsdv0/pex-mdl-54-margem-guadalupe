import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, fonte, NomeCor, numeros, peso } from '../theme/tema';

interface Props {
  rotulo: string;
  valor: string;
  /** "grande" para os números que importam (RNF-08). */
  tamanho?: 'grande' | 'medio';
  cor?: NomeCor;
  alinhar?: 'inicio' | 'fim';
}

/** Rótulo pequeno e discreto em cima; número grande, com algarismos alinhados, embaixo (RNF-08). */
export function LinhaValor({ rotulo, valor, tamanho = 'grande', cor = 'texto', alinhar = 'inicio' }: Props) {
  const alinhamento = alinhar === 'fim' ? estilos.fim : null;
  return (
    <View style={[estilos.bloco, alinhamento]} accessible accessibilityLabel={`${rotulo}: ${valor}`}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text
        style={[
          tamanho === 'grande' ? estilos.grande : estilos.medio,
          numeros,
          { color: cores[cor] },
        ]}
      >
        {valor}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: espaco.xs },
  fim: { alignItems: 'flex-end' },
  rotulo: { fontSize: fonte.legenda, color: cores.textoSuave },
  grande: { fontSize: fonte.titulo, fontWeight: peso.forte },
  medio: { fontSize: fonte.subtitulo, fontWeight: peso.medio },
});
