import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, fonte, linha, peso, raio, sombra } from '../theme/tema';
import { Icone } from './Icone';

/** A frase grande cresce no máximo isto com a fonte do sistema (RNF-11). */
const CRESCIMENTO_MAXIMO_FRASE = 1.3;

/** RF-09: a resposta à pergunta do comerciante, em letras grandes. */
export function CartaoResposta({ frase, observacao }: { frase: string; observacao?: string }) {
  return (
    <View style={estilos.cartao} accessible accessibilityRole="summary">
      <View style={estilos.topo}>
        <Icone nome="pricetag" cor="primaria" />
        <Text style={estilos.rotulo}>A resposta</Text>
      </View>
      <Text style={estilos.frase} maxFontSizeMultiplier={CRESCIMENTO_MAXIMO_FRASE}>
        {frase}
      </Text>
      {observacao ? <Text style={estilos.observacao}>{observacao}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.primariaFundo,
    borderColor: cores.primaria,
    borderWidth: linha.grossa,
    borderRadius: raio.cartao,
    padding: espaco.xl,
    gap: espaco.s,
    ...sombra.cartao,
  },
  topo: { flexDirection: 'row', alignItems: 'center', gap: espaco.s },
  rotulo: { fontSize: fonte.legenda, fontWeight: peso.forte, color: cores.primaria },
  frase: { fontSize: fonte.destaque, fontWeight: peso.forte, color: cores.texto },
  observacao: { fontSize: fonte.corpo, color: cores.texto },
});
