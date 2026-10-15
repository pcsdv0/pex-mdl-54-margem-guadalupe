import { StyleSheet, Text, View } from 'react-native';

import { Situacao } from '../domain/calculos';
import { formatarPercentual, formatarReais } from '../domain/formatacao';
import { cores, espaco, fonte, linha, peso, raio, sombra } from '../theme/tema';
import { LinhaValor } from './LinhaValor';
import { SemaforoBadge } from './SemaforoBadge';

interface Props {
  titulo?: string;
  precoVenda: number;
  margemDesejada: number;
  /** Calculada no domínio por situacaoProduto; o componente só mostra. */
  situacao: Situacao;
  /** Mostra "Sugerido: R$ X" quando o produto está abaixo da meta. */
  mostrarSugerido?: boolean;
}

/** Preço, margem e semáforo de um produto (RF-09, RF-11; RNF-08). */
export function CartaoSituacao({
  titulo,
  precoVenda,
  margemDesejada,
  situacao,
  mostrarSugerido = false,
}: Props) {
  return (
    <View style={estilos.cartao}>
      {titulo ? <Text style={estilos.titulo}>{titulo}</Text> : null}
      <View style={estilos.linha}>
        <LinhaValor rotulo="Preço de venda" valor={formatarReais(precoVenda)} />
        <LinhaValor
          rotulo={`Margem (meta ${margemDesejada}%)`}
          valor={formatarPercentual(situacao.margem)}
          cor={situacao.status === 'verde' ? 'verde' : 'vermelho'}
          alinhar="fim"
        />
      </View>
      <View style={estilos.linha}>
        <SemaforoBadge status={situacao.status} />
        {mostrarSugerido && situacao.status === 'vermelho' ? (
          <Text style={estilos.sugerido}>Sugerido: {formatarReais(situacao.precoSugerido)}</Text>
        ) : null}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.cartao,
    borderWidth: linha.fina,
    borderColor: cores.borda,
    padding: espaco.l,
    gap: espaco.m,
    ...sombra.cartao,
  },
  titulo: { fontSize: fonte.legenda, fontWeight: peso.medio, color: cores.textoSuave },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: espaco.s,
  },
  sugerido: { fontSize: fonte.corpo, fontWeight: peso.forte, color: cores.vermelho },
});
