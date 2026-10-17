import { StyleSheet, Text, View } from 'react-native';

import { Status } from '../domain/calculos';
import { cores, espaco, fonte, linha, NomeCor, peso, raio } from '../theme/tema';
import { Icone, NomeIcone } from './Icone';

// RN-05 e RNF-06: cor + ícone + palavra, nunca só a cor.
const VISUAL: Record<Status, { icone: NomeIcone; texto: string; cor: NomeCor; fundo: NomeCor }> = {
  verde: { icone: 'checkmark-circle', texto: 'Na meta', cor: 'verde', fundo: 'verdeFundo' },
  vermelho: { icone: 'alert-circle', texto: 'Abaixo da meta', cor: 'vermelho', fundo: 'vermelhoFundo' },
};

export function SemaforoBadge({ status }: { status: Status }) {
  const v = VISUAL[status];
  return (
    <View
      accessible
      accessibilityLabel={`Margem ${v.texto.toLowerCase()}`}
      style={[estilos.selo, { backgroundColor: cores[v.fundo], borderColor: cores[v.cor] }]}
    >
      <Icone nome={v.icone} tamanho="pequeno" cor={v.cor} />
      <Text style={[estilos.texto, { color: cores[v.cor] }]}>{v.texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    borderWidth: linha.fina,
    borderRadius: raio.redondo,
    paddingHorizontal: espaco.m,
    paddingVertical: espaco.xs,
    gap: espaco.xs,
  },
  texto: { flexShrink: 1, fontSize: fonte.legenda, fontWeight: peso.forte },
});
