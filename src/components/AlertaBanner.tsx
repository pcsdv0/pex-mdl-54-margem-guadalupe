import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, fonte, linha, peso, raio } from '../theme/tema';
import { Icone } from './Icone';

// RN-03: aviso de que o preço atual está abaixo do necessário para a margem desejada.
export function AlertaBanner({ mensagem }: { mensagem: string }) {
  return (
    <View accessibilityRole="alert" style={estilos.banner}>
      <Icone nome="alert-circle" cor="vermelho" />
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>Atenção</Text>
        <Text style={estilos.mensagem}>{mensagem}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: espaco.m,
    backgroundColor: cores.vermelhoFundo,
    borderColor: cores.vermelho,
    borderWidth: linha.fina,
    borderRadius: raio.cartao,
    padding: espaco.l,
  },
  textos: { flex: 1, gap: espaco.xs },
  titulo: { color: cores.vermelho, fontSize: fonte.corpo, fontWeight: peso.forte },
  mensagem: { color: cores.texto, fontSize: fonte.corpo },
});
