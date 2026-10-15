import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espaco, fonte, linha, peso, raio, TOQUE_MINIMO } from '../theme/tema';
import { Icone, NomeIcone } from './Icone';

/**
 * RNF-07: "principal" é cheio e chama a atenção (um por tela); "secundario" tem contorno
 * fino e pesa menos; "texto" não tem caixa (ações de menor importância, como excluir).
 */
type Variante = 'principal' | 'secundario' | 'texto';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  perigo?: boolean;
  icone?: NomeIcone;
  desabilitado?: boolean;
  rotulo?: string;
}

export function Botao({
  titulo,
  onPress,
  variante = 'principal',
  perigo = false,
  icone,
  desabilitado = false,
  rotulo,
}: Props) {
  const corTexto =
    variante === 'principal' ? 'sobrePrimaria' : perigo ? 'vermelho' : 'primaria';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo ?? titulo}
      accessibilityState={{ disabled: desabilitado }}
      onPress={onPress}
      disabled={desabilitado}
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        perigo && variante === 'secundario' ? estilos.bordaPerigo : null,
        desabilitado ? estilos.desabilitado : pressed ? estilos.pressionado : null,
      ]}
    >
      <View style={estilos.conteudo}>
        {icone ? <Icone nome={icone} cor={corTexto} /> : null}
        <Text
          style={[
            estilos.rotulo,
            variante === 'principal' ? estilos.rotuloPrincipal : null,
            { color: cores[corTexto] },
          ]}
        >
          {titulo}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: TOQUE_MINIMO,
    borderRadius: raio.cartao,
    paddingHorizontal: espaco.l,
    paddingVertical: espaco.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  principal: {
    backgroundColor: cores.primaria,
    paddingVertical: espaco.l,
  },
  secundario: {
    backgroundColor: cores.superficie,
    borderWidth: linha.fina,
    borderColor: cores.bordaForte,
  },
  texto: {
    backgroundColor: 'transparent',
  },
  bordaPerigo: { borderColor: cores.vermelho },
  pressionado: { opacity: 0.75 },
  desabilitado: { opacity: 0.5 },
  conteudo: { flexDirection: 'row', alignItems: 'center', gap: espaco.s },
  rotulo: {
    fontSize: fonte.corpo,
    fontWeight: peso.medio,
    textAlign: 'center',
  },
  rotuloPrincipal: {
    fontSize: fonte.subtitulo,
    fontWeight: peso.forte,
  },
});
