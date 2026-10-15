import { Pressable, StyleSheet } from 'react-native';

import { TOQUE_MINIMO } from '../theme/tema';
import { Icone } from './Icone';

/** Ícone "?" do cabeçalho; área de toque ≥ 48 px (RF-13, RNF-07, RNF-10). */
export function BotaoAjuda({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Ajuda: como funcionam as contas"
      onPress={onPress}
      style={({ pressed }) => [estilos.botao, pressed ? estilos.pressionado : null]}
    >
      <Icone nome="help-circle-outline" tamanho="grande" cor="sobrePrimaria" />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minWidth: TOQUE_MINIMO,
    minHeight: TOQUE_MINIMO,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionado: { opacity: 0.6 },
});
