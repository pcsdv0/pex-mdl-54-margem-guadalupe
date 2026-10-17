import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Icone, NomeIcone } from '../components/Icone';
import { useEmpilhar, useLayout } from '../components/useLayout';
import { calcularVariacaoCusto, Sentido, sentidoVariacao } from '../domain/calculos';
import { formatarData, formatarPercentual, formatarReais } from '../domain/formatacao';
import { Rotas } from '../navigation';
import { Produto, RegistroCusto, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte, linha, NomeCor, numeros, peso, raio } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'Historico'>;

// RF-16: seta + palavra, em azul: subir ou cair o custo não é, sozinho, bom nem ruim (CA-33).
const VISUAL: Record<Sentido, { icone: NomeIcone; palavra: string; cor: NomeCor }> = {
  subiu: { icone: 'arrow-up', palavra: 'subiu', cor: 'primaria' },
  caiu: { icone: 'arrow-down', palavra: 'caiu', cor: 'primaria' },
  igual: { icone: 'remove', palavra: 'igual', cor: 'textoSuave' },
};

// RF-06 e RF-16: data e custo de cada compra, mais recente primeiro, com o sentido da variação.
export function HistoricoScreen({ route }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [registros, setRegistros] = useState<RegistroCusto[]>([]);
  const { estiloConteudo } = useLayout();

  useEffect(() => {
    repositorio.listarProdutos().then((lista) => {
      setProduto(lista.find((p) => p.id === produtoId) ?? null);
    });
    repositorio.listarHistorico(produtoId).then(setRegistros);
  }, [produtoId]);

  return (
    <FlatList
      style={estilos.tela}
      contentContainerStyle={estiloConteudo(espaco.s)}
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
  // RNF-11: com tela estreita ou fonte grande, data/custo e variação ficam um embaixo do outro.
  const empilhado = useEmpilhar();
  const descricao = v
    ? `${formatarData(registro.data)}, ${formatarReais(registro.custo)}, ${v.palavra} ${formatarPercentual(variacao, true)}`
    : `${formatarData(registro.data)}, ${formatarReais(registro.custo)}, primeira compra`;
  return (
    <View style={[estilos.linha, empilhado ? estilos.linhaEmpilhada : null]} accessible accessibilityLabel={descricao}>
      <View style={empilhado ? null : estilos.esquerda}>
        <Text style={estilos.data}>{formatarData(registro.data)}</Text>
        <Text style={[estilos.custo, numeros]}>{formatarReais(registro.custo)}</Text>
      </View>
      {v ? (
        <View style={[estilos.variacao, empilhado ? estilos.inicio : null]}>
          <Icone nome={v.icone} cor={v.cor} />
          <View style={estilos.variacaoTextos}>
            <Text style={[estilos.palavra, { color: cores[v.cor] }]}>{v.palavra}</Text>
            <Text style={[estilos.percentual, numeros, { color: cores[v.cor] }]}>
              {formatarPercentual(variacao, true)}
            </Text>
          </View>
        </View>
      ) : (
        <View style={[estilos.variacaoTextos, empilhado ? estilos.inicio : null]}>
          <Text style={estilos.primeira}>—</Text>
          <Text style={estilos.palavraSuave}>primeira compra</Text>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { gap: espaco.xs, marginBottom: espaco.s },
  nome: { fontSize: fonte.titulo, fontWeight: peso.forte, color: cores.texto },
  explicacao: { fontSize: fonte.legenda, color: cores.textoSuave },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.m,
    backgroundColor: cores.superficie,
    borderRadius: raio.cartao,
    borderWidth: linha.fina,
    borderColor: cores.borda,
    padding: espaco.l,
  },
  linhaEmpilhada: { flexDirection: 'column', alignItems: 'flex-start' },
  // A data e o custo ocupam o que sobra; a variação não encolhe (RNF-11, CA-29).
  esquerda: { flex: 1, minWidth: 0, gap: espaco.xs },
  inicio: { alignItems: 'flex-start' },
  data: { fontSize: fonte.legenda, color: cores.textoSuave },
  custo: { fontSize: fonte.subtitulo, fontWeight: peso.forte, color: cores.texto },
  variacao: { flexShrink: 0, flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
  variacaoTextos: { flexShrink: 0, alignItems: 'flex-end' },
  palavra: { fontSize: fonte.legenda, fontWeight: peso.forte },
  percentual: { fontSize: fonte.corpo, fontWeight: peso.forte },
  primeira: { fontSize: fonte.corpo, fontWeight: peso.forte, color: cores.textoSuave },
  palavraSuave: { fontSize: fonte.legenda, color: cores.textoSuave },
});
