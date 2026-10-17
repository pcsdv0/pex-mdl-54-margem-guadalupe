import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AlertaBanner } from '../components/AlertaBanner';
import { useAviso } from '../components/Aviso';
import { Botao } from '../components/Botao';
import { CartaoResposta } from '../components/CartaoResposta';
import { CartaoSituacao } from '../components/CartaoSituacao';
import { ComoChegamos } from '../components/ComoChegamos';
import { Tela } from '../components/Tela';
import { calcularVariacaoCusto, situacaoProduto } from '../domain/calculos';
import { explicarMargem, explicarPrecoSugerido, fraseResposta } from '../domain/explicacao';
import { formatarPercentual, formatarReais } from '../domain/formatacao';
import { Rotas } from '../navigation';
import { Produto, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte, peso } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'ResultadoCompra'>;

// RF-04, RF-05, RF-09, RF-10 e RF-14: resposta em destaque, situação atual, contas e ação.
export function ResultadoCompraScreen({ navigation, route }: Props) {
  const { produtoId, custoAnterior } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const avisar = useAviso();
  // CA-22: aplicar ou manter só uma vez.
  const concluido = useRef(false);

  useEffect(() => {
    repositorio.listarProdutos().then((lista) => {
      setProduto(lista.find((p) => p.id === produtoId) ?? null);
    });
  }, [produtoId]);

  if (!produto) {
    return <View style={estilos.tela} />;
  }

  const situacao = situacaoProduto(produto.precoVenda, produto.custoAtual, produto.margemDesejada);
  const variacao = calcularVariacaoCusto(custoAnterior, produto.custoAtual);
  const abaixo = situacao.status === 'vermelho';

  async function aplicar() {
    if (concluido.current) return;
    concluido.current = true;
    await repositorio.salvarProduto({ ...produto!, precoVenda: situacao.precoSugerido });
    avisar(`Preço atualizado para ${formatarReais(situacao.precoSugerido)}`);
    navigation.popToTop();
  }

  function manter() {
    if (concluido.current) return;
    concluido.current = true;
    avisar(`Compra registrada. Preço mantido em ${formatarReais(produto!.precoVenda)}`);
    navigation.popToTop();
  }

  return (
    <Tela>
      <View style={estilos.cabecalho}>
        <Text style={estilos.nome}>{produto.nome}</Text>
        <Text style={estilos.compra}>
          Compra registrada a {formatarReais(produto.custoAtual)}
          {custoAnterior !== null
            ? ` (antes ${formatarReais(custoAnterior)}, variação ${formatarPercentual(variacao, true)})`
            : ''}
        </Text>
      </View>

      <CartaoResposta
        frase={fraseResposta(situacao.precoSugerido, produto.margemDesejada)}
        observacao={
          abaixo
            ? undefined
            : `Seu preço atual de ${formatarReais(produto.precoVenda)} já garante essa margem.`
        }
      />

      <CartaoSituacao
        titulo="Se mantiver o preço atual"
        precoVenda={produto.precoVenda}
        margemDesejada={produto.margemDesejada}
        situacao={situacao}
      />

      {abaixo ? (
        <AlertaBanner
          mensagem={`Com o preço atual, a margem fica abaixo da meta de ${produto.margemDesejada}%.`}
        />
      ) : null}

      <ComoChegamos
        blocos={[
          {
            titulo: 'Preço sugerido',
            passos: explicarPrecoSugerido(produto.custoAtual, produto.margemDesejada),
          },
          {
            titulo: 'Margem com o preço atual',
            passos: explicarMargem(produto.precoVenda, produto.custoAtual),
          },
        ]}
      />

      <View style={estilos.botoes}>
        <Botao
          titulo={`Aplicar preço sugerido (${formatarReais(situacao.precoSugerido)})`}
          icone="checkmark"
          onPress={aplicar}
        />
        <Botao
          titulo={`Manter preço atual (${formatarReais(produto.precoVenda)})`}
          variante="secundario"
          onPress={manter}
        />
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { gap: espaco.xs },
  nome: { fontSize: fonte.titulo, fontWeight: peso.forte, color: cores.texto },
  compra: { fontSize: fonte.legenda, color: cores.textoSuave },
  botoes: { gap: espaco.m, marginTop: espaco.s },
});
