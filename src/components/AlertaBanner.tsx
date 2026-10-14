import { StyleSheet, Text, View } from 'react-native';

import { cores, fonte } from '../theme/cores';

// RN-03: aviso de que o preço atual está abaixo do necessário para a margem desejada.
export function AlertaBanner({ mensagem }: { mensagem: string }) {
  return (
    <View accessibilityRole="alert" style={estilos.banner}>
      <Text style={estilos.titulo}>⚠ Atenção</Text>
      <Text style={estilos.mensagem}>{mensagem}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  banner: {
    backgroundColor: cores.vermelhoFundo,
    borderColor: cores.vermelho,
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  titulo: { color: cores.vermelho, fontSize: fonte.normal, fontWeight: '800' },
  mensagem: { color: cores.texto, fontSize: fonte.normal },
});
