import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cores, espaco, fonte, peso, raio, sombra } from '../theme/tema';
import { Icone } from './Icone';

// RF-14: aviso rápido no rodapé depois de uma ação (ADR-006: sem biblioteca extra).
const DURACAO_MS = 3000;

type Mostrar = (mensagem: string) => void;

const AvisoContexto = createContext<Mostrar>(() => {});

export function useAviso(): Mostrar {
  return useContext(AvisoContexto);
}

export function AvisoProvider({ children }: { children: ReactNode }) {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const margens = useSafeAreaInsets();

  const mostrar = useCallback<Mostrar>((texto) => {
    if (temporizador.current) clearTimeout(temporizador.current);
    setMensagem(texto);
    temporizador.current = setTimeout(() => setMensagem(null), DURACAO_MS);
  }, []);

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    [],
  );

  return (
    <AvisoContexto.Provider value={mostrar}>
      <View style={estilos.raiz}>
        {children}
        {mensagem ? (
          <View
            pointerEvents="none"
            style={[estilos.aviso, { bottom: margens.bottom + espaco.xl }]}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            <Icone nome="checkmark-circle" cor="sobreAviso" />
            <Text style={estilos.texto}>{mensagem}</Text>
          </View>
        ) : null}
      </View>
    </AvisoContexto.Provider>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  aviso: {
    position: 'absolute',
    left: espaco.l,
    right: espaco.l,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.m,
    backgroundColor: cores.aviso,
    borderRadius: raio.cartao,
    paddingHorizontal: espaco.l,
    paddingVertical: espaco.m,
    ...sombra.cartao,
  },
  texto: { flex: 1, color: cores.sobreAviso, fontSize: fonte.corpo, fontWeight: peso.medio },
});
