import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { empilhar, larguraDoConteudo } from '../theme/layout';
import { espaco, LARGURA_MAXIMA } from '../theme/tema';

/**
 * RNF-11: true quando dois valores não cabem lado a lado (tela estreita ou fonte grande).
 * Só lê a janela; funciona sem SafeAreaProvider.
 */
export function useEmpilhar(): boolean {
  const { width, fontScale } = useWindowDimensions();
  return empilhar(larguraDoConteudo(width), fontScale);
}

/**
 * RNF-11: o que depende do aparelho. `estiloConteudo` centraliza o conteúdo (largura máxima)
 * e soma a barra do sistema embaixo.
 */
export function useLayout() {
  const margens = useSafeAreaInsets();
  return {
    empilhar: useEmpilhar(),
    margens,
    estiloConteudo: (intervalo: number = espaco.l) => ({
      width: '100%' as const,
      maxWidth: LARGURA_MAXIMA,
      alignSelf: 'center' as const,
      padding: espaco.l,
      gap: intervalo,
      paddingBottom: espaco.xxl + margens.bottom,
    }),
  };
}
