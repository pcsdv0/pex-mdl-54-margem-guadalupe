import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { calcularVariacaoCusto } from '../domain/calculos';
import { formatarData, formatarPercentual, formatarReais } from '../domain/formatacao';
import { Rotas } from '../navigation';
import { Produto, RegistroCusto, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'Historico'>;

// RF-06: data e custo de cada compra, mais recente primeiro, com a variação (RN-04).
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
          <View style={estilos.titulos}>
            <Text style={[estilos.colTitulo, estilos.colData]}>Data</Text>
            <Text style={[estilos.colTitulo, estilos.colCusto]}>Custo</Text>
            <Text style={[estilos.colTitulo, estilos.colVariacao]}>Variação</Text>
          </View>
        </View>
      }
      renderItem={({ item, index }) => {
        // A lista vem do mais recente para o mais antigo: a compra anterior é a próxima da lista.
        const anterior = registros[index + 1]?.custo ?? null;
        return <LinhaHistorico registro={item} variacao={calcularVariacaoCusto(anterior, item.custo)} />;
      }}
    />
  );
}

function LinhaHistorico({ registro, variacao }: { registro: RegistroCusto; variacao: number | null }) {
  const cor =
    variacao === null || variacao === 0 ? cores.texto : variacao > 0 ? cores.vermelho : cores.verde;
  return (
    <View style={estilos.linha}>
      <Text style={[estilos.celula, estilos.colData]}>{formatarData(registro.data)}</Text>
      <Text style={[estilos.celula, estilos.colCusto]}>{formatarReais(registro.custo)}</Text>
      <Text style={[estilos.celula, estilos.colVariacao, { color: cor }]}>
        {formatarPercentual(variacao, true)}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.l, gap: 8 },
  cabecalho: { gap: espaco.l, marginBottom: 4 },
  nome: { fontSize: fonte.titulo, fontWeight: '800', color: cores.texto },
  titulos: { flexDirection: 'row', paddingHorizontal: espaco.l },
  colTitulo: { fontSize: fonte.legenda, color: cores.textoSuave, fontWeight: '700' },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espaco.l,
  },
  celula: { fontSize: fonte.corpo, color: cores.texto },
  colData: { flex: 1.2 },
  colCusto: { flex: 1, textAlign: 'right' },
  colVariacao: { flex: 1, textAlign: 'right', fontWeight: '700' },
});
