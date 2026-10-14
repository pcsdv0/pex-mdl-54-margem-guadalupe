import { Pressable, StyleSheet, Text } from 'react-native';

import { cores, fonte, TOQUE_MINIMO } from '../theme/cores';

type Variante = 'primario' | 'secundario' | 'perigo';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  desabilitado?: boolean;
}

export function Botao({ titulo, onPress, variante = 'primario', desabilitado = false }: Props) {
  const primario = variante === 'primario';
  const corBorda = variante === 'perigo' ? cores.perigo : cores.primaria;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: desabilitado }}
      onPress={onPress}
      disabled={desabilitado}
      style={({ pressed }) => [
        estilos.botao,
        {
          backgroundColor: primario ? cores.primaria : cores.superficie,
          borderColor: corBorda,
          opacity: desabilitado ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[estilos.texto, { color: primario ? cores.primariaTexto : corBorda }]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: TOQUE_MINIMO,
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontSize: fonte.normal + 2,
    fontWeight: '700',
    textAlign: 'center',
  },
});
