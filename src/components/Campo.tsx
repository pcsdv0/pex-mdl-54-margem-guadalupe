import { Ref } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { cores, espaco, fonte, linha, numeros, peso, raio, TOQUE_MINIMO } from '../theme/tema';
import { Icone } from './Icone';

export interface PropsCampo {
  rotulo: string;
  valor: string;
  onChange?: (texto: string) => void;
  erro?: string | null;
  somenteLeitura?: boolean;
  /** Texto de apoio curto, abaixo do campo (RF-13). */
  dica?: string;
  autoFocus?: boolean;
  /** RNF-09: "next" passa ao próximo campo; "done" fecha o teclado. */
  tecla?: 'next' | 'done';
  aoConfirmar?: () => void;
  /** Ao sair do campo (perder o foco). */
  aoSair?: () => void;
  ref?: Ref<TextInput>;
}

interface PropsBase extends PropsCampo {
  prefixo?: string;
  sufixo?: string;
  teclado?: 'decimal-pad' | 'number-pad' | 'default';
  placeholder?: string;
  numerico?: boolean;
}

/** Campo de texto com rótulo, texto de apoio e erro junto ao campo (RF-14). */
export function Campo({
  rotulo,
  valor,
  onChange,
  erro,
  somenteLeitura = false,
  dica,
  autoFocus,
  tecla = 'done',
  aoConfirmar,
  aoSair,
  ref,
  prefixo,
  sufixo,
  teclado = 'default',
  placeholder,
  numerico = false,
}: PropsBase) {
  return (
    <View style={estilos.bloco}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <View
        style={[
          estilos.caixa,
          erro ? estilos.caixaErro : null,
          somenteLeitura ? estilos.caixaLeitura : null,
        ]}
      >
        {prefixo ? <Text style={estilos.extra}>{prefixo}</Text> : null}
        <TextInput
          ref={ref}
          accessibilityLabel={rotulo}
          accessibilityHint={dica}
          style={[estilos.entrada, numerico ? numeros : null]}
          value={valor}
          onChangeText={onChange}
          editable={!somenteLeitura}
          keyboardType={teclado}
          placeholder={placeholder}
          placeholderTextColor={cores.textoSuave}
          autoFocus={autoFocus}
          returnKeyType={tecla}
          submitBehavior={tecla === 'next' ? 'submit' : 'blurAndSubmit'}
          onSubmitEditing={aoConfirmar}
          onBlur={aoSair}
        />
        {sufixo ? <Text style={estilos.extra}>{sufixo}</Text> : null}
      </View>
      {erro ? (
        <View style={estilos.linhaErro} accessibilityRole="alert">
          <Icone nome="alert-circle" tamanho="pequeno" cor="vermelho" />
          <Text style={estilos.erro}>{erro}</Text>
        </View>
      ) : dica ? (
        <Text style={estilos.dica}>{dica}</Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: espaco.xs },
  rotulo: { fontSize: fonte.legenda, fontWeight: peso.medio, color: cores.texto },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOQUE_MINIMO,
    borderWidth: linha.fina,
    borderColor: cores.bordaForte,
    borderRadius: raio.campo,
    backgroundColor: cores.superficie,
    paddingHorizontal: espaco.m,
  },
  caixaErro: { borderColor: cores.vermelho, borderWidth: linha.grossa },
  caixaLeitura: { backgroundColor: cores.fundo, borderColor: cores.borda },
  entrada: {
    flex: 1,
    minWidth: 0,
    fontSize: fonte.subtitulo,
    color: cores.texto,
    paddingVertical: espaco.s,
  },
  // Prefixo e sufixo nunca encolhem: "R$" não pode sair cortado (RNF-11, CA-28).
  extra: { flexShrink: 0, fontSize: fonte.subtitulo, color: cores.textoSuave, marginHorizontal: espaco.xs },
  dica: { fontSize: fonte.legenda, color: cores.textoSuave },
  linhaErro: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
  erro: { flex: 1, fontSize: fonte.legenda, color: cores.vermelho, fontWeight: peso.medio },
});
