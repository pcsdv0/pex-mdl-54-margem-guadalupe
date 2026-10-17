import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, fonte, linha, peso, raio } from '../theme/tema';
import { Botao } from './Botao';
import { Icone } from './Icone';

/** RF-15: explica em 3 linhas o que o app faz; some depois de "Entendi". */
export function CartaoBoasVindas({ onDispensar }: { onDispensar: () => void }) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.topo}>
        <Icone nome="hand-right-outline" cor="primaria" />
        <Text style={estilos.titulo} accessibilityRole="header">
          Boas-vindas!
        </Text>
      </View>
      <Text style={estilos.linha}>1. Cadastre o produto com custo, preço e a margem desejada.</Text>
      <Text style={estilos.linha}>2. A cada compra, informe o novo custo em "Nova compra".</Text>
      <Text style={estilos.linha}>3. O app diz a que preço vender para manter a margem desejada.</Text>
      <Botao titulo="Entendi" variante="secundario" onPress={onDispensar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.primariaFundo,
    borderColor: cores.primaria,
    borderWidth: linha.fina,
    borderRadius: raio.cartao,
    padding: espaco.l,
    gap: espaco.s,
  },
  topo: { flexDirection: 'row', alignItems: 'center', gap: espaco.s },
  titulo: { fontSize: fonte.subtitulo, fontWeight: peso.forte, color: cores.texto },
  linha: { fontSize: fonte.corpo, color: cores.texto },
});
