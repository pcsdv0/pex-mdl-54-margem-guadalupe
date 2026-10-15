import { Modal, StyleSheet, Text, View } from 'react-native';

import { cores, espaco, fonte, peso, raio, sombra } from '../theme/tema';
import { Botao } from './Botao';

interface Props {
  visivel: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** Confirmação dentro do app, igual em Android, iOS e navegador (RF-14, ADR-006). */
export function DialogoConfirmacao({
  visivel,
  titulo,
  mensagem,
  textoConfirmar,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onCancelar}>
      <View style={estilos.veu}>
        <View style={estilos.caixa} accessibilityViewIsModal>
          <Text style={estilos.titulo} accessibilityRole="header">
            {titulo}
          </Text>
          <Text style={estilos.mensagem}>{mensagem}</Text>
          <View style={estilos.botoes}>
            <Botao titulo={textoConfirmar} variante="secundario" perigo onPress={onConfirmar} />
            <Botao titulo="Cancelar" variante="texto" onPress={onCancelar} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  veu: {
    flex: 1,
    backgroundColor: cores.veu,
    justifyContent: 'center',
    padding: espaco.xl,
  },
  caixa: {
    backgroundColor: cores.superficie,
    borderRadius: raio.cartao,
    padding: espaco.xl,
    gap: espaco.m,
    ...sombra.cartao,
  },
  titulo: { fontSize: fonte.subtitulo, fontWeight: peso.forte, color: cores.texto },
  mensagem: { fontSize: fonte.corpo, color: cores.texto },
  botoes: { gap: espaco.s, marginTop: espaco.s },
});
