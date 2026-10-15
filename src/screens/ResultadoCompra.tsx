import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AlertaBanner } from '../components/AlertaBanner';
import { Botao } from '../components/Botao';
import { SemaforoBadge } from '../components/SemaforoBadge';
import {
  calcularMargem,
  calcularPrecoSugerido,
  calcularVariacaoCusto,
  statusMargem,
} from '../domain/calculos';
import { formatarPercentual, formatarReais } from '../domain/formatacao';
import { Rotas } from '../navigation';
import { Produto, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'ResultadoCompra'>;

// RF-04 e RF-05: nova margem, variação, alerta e preço sugerido; aplicar ou manter o preço.
export function ResultadoCompraScreen({ navigation, route }: Props) {
  const { produtoId, custoAnterior } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);

  useEffect(() => {
    repositorio.listarProdutos().then((lista) => {
      setProduto(lista.find((p) => p.id === produtoId) ?? null);
    });
  }, [produtoId]);

  if (!produto) {
    return <View style={estilos.tela} />;
  }

  const margem = calcularMargem(produto.precoVenda, produto.custoAtual);
  const variacao = calcularVariacaoCusto(custoAnterior, produto.custoAtual);
  const sugerido = calcularPrecoSugerido(produto.custoAtual, produto.margemDesejada);
  const status = statusMargem(produto.precoVenda, produto.custoAtual, produto.margemDesejada);

  async function aplicar() {
    await repositorio.salvarProduto({ ...produto!, precoVenda: sugerido });
    navigation.popToTop();
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.nome}>{produto.nome}</Text>

      <View style={estilos.cartao}>
        <LinhaInfo rotulo="Novo custo" valor={formatarReais(produto.custoAtual)} />
        <LinhaInfo rotulo="Variação do custo" valor={formatarPercentual(variacao, true)} />
        <LinhaInfo rotulo="Preço de venda atual" valor={formatarReais(produto.precoVenda)} />
        <LinhaInfo rotulo="Margem com o preço atual" valor={formatarPercentual(margem)} forte />
        <LinhaInfo rotulo="Margem desejada" valor={`${produto.margemDesejada}%`} />
        <SemaforoBadge status={status} />
      </View>

      {status === 'vermelho' ? (
        <AlertaBanner
          mensagem={`Com o preço atual, a margem fica abaixo da meta de ${produto.margemDesejada}%.`}
        />
      ) : null}

      <View style={estilos.sugerido}>
        <Text style={estilos.sugeridoRotulo}>Preço sugerido para manter a margem</Text>
        <Text style={estilos.sugeridoValor}>{formatarReais(sugerido)}</Text>
      </View>

      <Botao titulo={`Aplicar preço sugerido (${formatarReais(sugerido)})`} onPress={aplicar} />
      <Botao
        titulo={`Manter preço (${formatarReais(produto.precoVenda)})`}
        variante="secundario"
        onPress={() => navigation.popToTop()}
      />
    </ScrollView>
  );
}

function LinhaInfo({ rotulo, valor, forte }: { rotulo: string; valor: string; forte?: boolean }) {
  return (
    <View style={estilos.linha}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text style={[estilos.valor, forte ? estilos.forte : null]}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.l, gap: espaco.l, paddingBottom: espaco.xl * 2 },
  nome: { fontSize: fonte.titulo, fontWeight: '800', color: cores.texto },
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.l,
    gap: 10,
  },
  linha: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  rotulo: { fontSize: fonte.corpo, color: cores.textoSuave, flexShrink: 1 },
  valor: { fontSize: fonte.corpo, color: cores.texto, fontWeight: '600' },
  forte: { fontSize: fonte.subtitulo, fontWeight: '800' },
  sugerido: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: cores.primaria,
    padding: espaco.l,
    alignItems: 'center',
    gap: 4,
  },
  sugeridoRotulo: { fontSize: fonte.corpo, color: cores.texto, textAlign: 'center' },
  sugeridoValor: { fontSize: 36, fontWeight: '800', color: cores.primaria },
});
