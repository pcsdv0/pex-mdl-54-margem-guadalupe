import { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';

import { cores, espaco } from '../theme/tema';
import { useLayout } from './useLayout';

interface Props {
  children: ReactNode;
  /** Espaço entre os blocos da tela. */
  intervalo?: keyof typeof espaco;
  /** Janelas (Modal) e outros itens que não rolam junto com o conteúdo. */
  sobreposicao?: ReactNode;
}

/**
 * RNF-09 e RNF-11: tela que rola quando o conteúdo não cabe, não deixa o teclado cobrir o campo,
 * respeita a barra de navegação e centraliza o conteúdo em telas largas.
 */
export function Tela({ children, intervalo = 'l', sobreposicao }: Props) {
  const { estiloConteudo } = useLayout();
  return (
    <KeyboardAvoidingView style={estilos.tela} behavior="padding">
      <ScrollView
        style={estilos.tela}
        contentContainerStyle={estiloConteudo(espaco[intervalo])}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {children}
      </ScrollView>
      {sobreposicao}
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
});
