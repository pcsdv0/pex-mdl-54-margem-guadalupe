import { StyleSheet, Text, TextInput, View } from 'react-native';

import { cores, fonte, TOQUE_MINIMO } from '../theme/cores';

export interface PropsCampo {
  rotulo: string;
  valor: string;
  onChange?: (texto: string) => void;
  erro?: string | null;
  somenteLeitura?: boolean;
  dica?: string;
  autoFocus?: boolean;
}

interface PropsBase extends PropsCampo {
  prefixo?: string;
  sufixo?: string;
  teclado?: 'decimal-pad' | 'number-pad' | 'default';
  placeholder?: string;
}

/** Campo de texto com rótulo, prefixo/sufixo e mensagem de erro. Base de CampoMoeda e CampoPercentual. */
export function Campo({
  rotulo,
  valor,
  onChange,
  erro,
  somenteLeitura = false,
  dica,
  autoFocus,
  prefixo,
  sufixo,
  teclado = 'default',
  placeholder,
}: PropsBase) {
  return (
    <View style={estilos.bloco}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <View
        style={[
          estilos.caixa,
          erro ? { borderColor: cores.erro } : null,
          somenteLeitura ? estilos.caixaLeitura : null,
        ]}
      >
        {prefixo ? <Text style={estilos.extra}>{prefixo}</Text> : null}
        <TextInput
          accessibilityLabel={rotulo}
          style={estilos.entrada}
          value={valor}
          onChangeText={onChange}
          editable={!somenteLeitura}
          keyboardType={teclado}
          placeholder={placeholder}
          placeholderTextColor={cores.textoSuave}
          autoFocus={autoFocus}
        />
        {sufixo ? <Text style={estilos.extra}>{sufixo}</Text> : null}
      </View>
      {dica ? <Text style={estilos.dica}>{dica}</Text> : null}
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: 6 },
  rotulo: { fontSize: fonte.normal, fontWeight: '700', color: cores.texto },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOQUE_MINIMO,
    borderWidth: 2,
    borderColor: cores.borda,
    borderRadius: 10,
    backgroundColor: cores.superficie,
    paddingHorizontal: 12,
  },
  caixaLeitura: { backgroundColor: cores.fundo },
  entrada: { flex: 1, fontSize: fonte.grande, color: cores.texto, paddingVertical: 8 },
  extra: { fontSize: fonte.grande, color: cores.textoSuave, marginHorizontal: 4 },
  dica: { fontSize: fonte.pequena, color: cores.textoSuave },
  erro: { fontSize: fonte.pequena, color: cores.erro, fontWeight: '700' },
});
