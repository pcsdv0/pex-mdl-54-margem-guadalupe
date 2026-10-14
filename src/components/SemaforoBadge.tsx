import { StyleSheet, Text, View } from 'react-native';

import { Status } from '../domain/calculos';
import { cores, fonte } from '../theme/cores';

// RN-05: verde ou vermelho, sempre com ícone e texto (não depende só da cor).
const VISUAL = {
  verde: { icone: '✓', texto: 'Na meta', cor: cores.verde, fundo: cores.verdeFundo },
  vermelho: { icone: '!', texto: 'Abaixo da meta', cor: cores.vermelho, fundo: cores.vermelhoFundo },
};

export function SemaforoBadge({ status }: { status: Status }) {
  const v = VISUAL[status];
  return (
    <View
      accessible
      accessibilityLabel={`Margem ${v.texto.toLowerCase()}`}
      style={[estilos.badge, { backgroundColor: v.fundo, borderColor: v.cor }]}
    >
      <Text style={[estilos.icone, { color: v.cor }]}>{v.icone}</Text>
      <Text style={[estilos.texto, { color: v.cor }]}>{v.texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 6,
  },
  icone: { fontSize: fonte.normal, fontWeight: '900' },
  texto: { fontSize: fonte.pequena, fontWeight: '700' },
});
