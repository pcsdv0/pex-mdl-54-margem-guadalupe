import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { cores, espaco, fonte, linha, raio, TOQUE_MINIMO } from '../theme/tema';
import { Icone } from './Icone';

/** Busca por nome, com botão para limpar (RF-12). */
export function CampoBusca({ valor, onChange }: { valor: string; onChange: (t: string) => void }) {
  return (
    <View style={estilos.caixa}>
      <Icone nome="search" cor="textoSuave" />
      <TextInput
        accessibilityLabel="Buscar produto pelo nome"
        style={estilos.entrada}
        value={valor}
        onChangeText={onChange}
        placeholder="Buscar produto"
        placeholderTextColor={cores.textoSuave}
        returnKeyType="search"
        autoCorrect={false}
      />
      {valor !== '' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
          onPress={() => onChange('')}
          style={estilos.limpar}
        >
          <Icone nome="close-circle" cor="textoSuave" />
        </Pressable>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.s,
    minHeight: TOQUE_MINIMO,
    borderWidth: linha.fina,
    borderColor: cores.bordaForte,
    borderRadius: raio.campo,
    backgroundColor: cores.superficie,
    paddingLeft: espaco.m,
  },
  entrada: { flex: 1, fontSize: fonte.corpo, color: cores.texto, paddingVertical: espaco.s },
  limpar: {
    minWidth: TOQUE_MINIMO,
    minHeight: TOQUE_MINIMO,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
