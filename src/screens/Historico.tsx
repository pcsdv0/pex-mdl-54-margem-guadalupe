import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Icone, NomeIcone } from '../components/Icone';
import { calcularVariacaoCusto, Sentido, sentidoVariacao } from '../domain/calculos';
import { formatarData, formatarPercentual, formatarReais } from '../domain/formatacao';
import { Rotas } from '../navigation';
import { Produto, RegistroCusto, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte, linha, NomeCor, numeros, peso, raio } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'Historico'>;

// RF-16: seta + palavra + cor, nunca só a cor (RNF-06).
const VISUAL: Record<Sentido, { icone: NomeIcone; palavra: string; cor: NomeCor }> = {
  subiu: { icone: 'arrow-up', palavra: 'subiu', cor: 'vermelho' },
  caiu: { icone: 'arrow-down', palavra: 'caiu', cor: 'verde' },
  igual: { icone: 'remove', palavra: 'igual', cor: 'textoSuave' },
};

// RF-06 e RF-16: data e custo de cada compra, mais recente primeiro, com o sentido da variação.
export function HistoricoScreen({ route }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [registros, setRegistros] = useState<RegistroCusto[]>([]);

  useEffect(() => {
    repositorio.listarProdutos().then((lista) => {
      setProduto(lista.find((p) => p.id === produtoId) ?? null);
    });
    repositorio.listarHistorico(produtoId).then(setRegistros);
  }, [produtoId]);

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estilos.conteudo}
      data={registros}
      keyExtractor={(r) => r.id}
      ListHeaderComponent={
        <View style={estilos.cabecalho}>
          {produto ? <Text style={estilos.nome}>{produto.nome}</Text> : null}
          <Text style={estilos.explicacao}>
            Custo de cada compra, da mais recente para a mais antiga, comparado com a compra anterior.
          </Text>
        </View>
      }
      renderItem={({ item, index }) => {
        // A lista vem do mais recente para o mais antigo: a compra anterior é a próxima da lista.
        const anterior = registros[index + 1]?.custo ?? null;
        return (
          <LinhaHistorico registro={item} variacao={calcularVariacaoCusto(anterior, item.custo)} />
        );
      }}
    />
  );
}

function LinhaHistorico({ registro, variacao }: { registro: RegistroCusto; variacao: number | null }) {
  const sentido = sentidoVariacao(variacao);
  const v = sentido ? VISUAL[sentido] : null;
  const descricao = v
    ? `${formatarData(registro.data)}, ${formatarReais(registro.custo)}, ${v.palavra} ${formatarPercentual(variacao, true)}`
    : `${formatarData(registro.data)}, ${formatarReais(registro.custo)}, primeira compra`;
  return (
    <View style={estilos.linha} accessible accessibilityLabel={descricao}>
      <View style={estilos.esquerda}>
        <Text style={estilos.data}>{formatarData(registro.data)}</Text>
        <Text style={[estilos.custo, numeros]}>{formatarReais(registro.custo)}</Text>
      </View>
      {v ? (
        <View style={estilos.variacao}>
          <Icone nome={v.icone} cor={v.cor} />
          <View style={estilos.variacaoTextos}>
            <Text style={[estilos.palavra, { color: cores[v.cor] }]}>{v.palavra}</Text>
            <Text style={[estilos.percentual, numeros, { color: cores[v.cor] }]}>
              {formatarPercentual(variacao, true)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={estilos.variacaoTextos}>
          <Text style={estilos.primeira}>—</Text>
          <Text style={estilos.palavraSuave}>primeira compra</Text>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.l, gap: espaco.s, paddingBottom: espaco.xxl },
  cabecalho: { gap: espaco.xs, marginBottom: espaco.s },
  nome: { fontSize: fonte.titulo, fontWeight: peso.forte, color: cores.texto },
  explicacao: { fontSize: fonte.legenda, color: cores.textoSuave },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.superficie,
    borderRadius: raio.cartao,
    borderWidth: linha.fina,
    borderColor: cores.borda,
    padding: espaco.l,
  },
  esquerda: { gap: espaco.xs },
  data: { fontSize: fonte.legenda, color: cores.textoSuave },
  custo: { fontSize: fonte.subtitulo, fontWeight: peso.forte, color: cores.texto },
  variacao: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
  variacaoTextos: { alignItems: 'flex-end' },
  palavra: { fontSize: fonte.legenda, fontWeight: peso.forte },
  percentual: { fontSize: fonte.corpo, fontWeight: peso.forte },
  primeira: { fontSize: fonte.corpo, fontWeight: peso.forte, color: cores.textoSuave },
  palavraSuave: { fontSize: fonte.legenda, color: cores.textoSuave },
});
