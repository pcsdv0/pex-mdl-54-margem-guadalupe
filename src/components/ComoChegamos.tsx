import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { NOTA_ESCOPO_CALCULO } from '../domain/explicacao';
import { cores, espaco, fonte, linha, numeros, peso, raio, TOQUE_MINIMO } from '../theme/tema';
import { Icone } from './Icone';

interface Bloco {
  titulo: string;
  passos: string[];
}

/** RF-10: área que abre e fecha com os passos das contas (montados em domain/explicacao). */
export function ComoChegamos({ blocos }: { blocos: Bloco[] }) {
  const [aberto, setAberto] = useState(false);
  return (
    <View style={estilos.caixa}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: aberto }}
        accessibilityLabel={aberto ? 'Esconder as contas' : 'Como chegamos nisso: mostrar as contas'}
        onPress={() => setAberto(!aberto)}
        style={estilos.cabecalho}
      >
        <Icone nome="calculator-outline" cor="primaria" />
        <Text style={estilos.titulo}>Como chegamos nisso</Text>
        <Icone nome={aberto ? 'chevron-up' : 'chevron-down'} cor="primaria" />
      </Pressable>
      {aberto ? (
        <View style={estilos.corpo}>
          {blocos.map((b) => (
            <View key={b.titulo} style={estilos.bloco}>
              <Text style={estilos.subtitulo}>{b.titulo}</Text>
              {b.passos.map((p) => (
                <Text key={p} style={[estilos.passo, numeros]}>
                  {p}
                </Text>
              ))}
            </View>
          ))}
          <Text style={estilos.nota}>{NOTA_ESCOPO_CALCULO}</Text>
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    backgroundColor: cores.superficie,
    borderRadius: raio.cartao,
    borderWidth: linha.fina,
    borderColor: cores.borda,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.s,
    minHeight: TOQUE_MINIMO,
    paddingHorizontal: espaco.l,
  },
  titulo: { flex: 1, fontSize: fonte.corpo, fontWeight: peso.medio, color: cores.primaria },
  corpo: { paddingHorizontal: espaco.l, paddingBottom: espaco.l, gap: espaco.l },
  bloco: {
    gap: espaco.xs,
    backgroundColor: cores.primariaFundo,
    borderRadius: raio.campo,
    padding: espaco.m,
  },
  subtitulo: { fontSize: fonte.legenda, fontWeight: peso.forte, color: cores.texto },
  passo: { fontSize: fonte.corpo, color: cores.texto },
  nota: { fontSize: fonte.legenda, color: cores.textoSuave },
});
