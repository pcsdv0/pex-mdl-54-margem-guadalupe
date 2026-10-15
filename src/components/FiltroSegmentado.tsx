import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espaco, fonte, linha, peso, raio, TOQUE_MINIMO } from '../theme/tema';

interface Opcao<T extends string> {
  valor: T;
  rotulo: string;
}

interface Props<T extends string> {
  opcoes: Opcao<T>[];
  selecionado: T;
  onChange: (valor: T) => void;
}

/** Opções lado a lado; a escolhida fica cheia (RF-12, RNF-07). */
export function FiltroSegmentado<T extends string>({ opcoes, selecionado, onChange }: Props<T>) {
  return (
    <View style={estilos.grupo} accessibilityRole="tablist">
      {opcoes.map((o) => {
        const ativo = o.valor === selecionado;
        return (
          <Pressable
            key={o.valor}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={`Mostrar: ${o.rotulo}`}
            onPress={() => onChange(o.valor)}
            style={[estilos.opcao, ativo ? estilos.ativo : null]}
          >
            <Text style={[estilos.texto, ativo ? estilos.textoAtivo : null]}>{o.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    flexDirection: 'row',
    borderWidth: linha.fina,
    borderColor: cores.bordaForte,
    borderRadius: raio.campo,
    backgroundColor: cores.superficie,
    overflow: 'hidden',
  },
  opcao: {
    flex: 1,
    minHeight: TOQUE_MINIMO,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espaco.xs,
  },
  ativo: { backgroundColor: cores.primaria },
  texto: { fontSize: fonte.legenda, fontWeight: peso.medio, color: cores.primaria, textAlign: 'center' },
  textoAtivo: { color: cores.sobrePrimaria, fontWeight: peso.forte },
});
