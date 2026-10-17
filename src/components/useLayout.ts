import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { empilhar, larguraDoConteudo } from '../theme/layout';
import { espaco, LARGURA_MAXIMA } from '../theme/tema';

/**
 * RNF-11: o que depende do aparelho. `empilhar` diz se dois valores ficam um embaixo do outro;
 * `estiloConteudo` centraliza o conteúdo (largura máxima) e soma a barra do sistema embaixo.
 */
export function useLayout() {
  const { width, fontScale } = useWindowDimensions();
  const margens = useSafeAreaInsets();
  return {
    empilhar: empilhar(larguraDoConteudo(width), fontScale),
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
