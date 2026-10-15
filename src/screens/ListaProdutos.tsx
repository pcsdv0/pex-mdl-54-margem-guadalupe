import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAviso } from '../components/Aviso';
import { Botao } from '../components/Botao';
import { CampoBusca } from '../components/CampoBusca';
import { CartaoBoasVindas } from '../components/CartaoBoasVindas';
import { FiltroSegmentado } from '../components/FiltroSegmentado';
import { Icone } from '../components/Icone';
import { ProdutoCard } from '../components/ProdutoCard';
import { carregarExemplos, EXEMPLOS } from '../data/exemplos';
import { Filtro, organizarLista, resumoLista } from '../domain/lista';
import { Rotas } from '../navigation';
import { boasVindasDispensada, dispensarBoasVindas } from '../storage/preferencias';
import { Produto, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte, linha, peso, raio } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'ListaProdutos'>;

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'abaixo', rotulo: 'Abaixo da meta' },
  { valor: 'na-meta', rotulo: 'Na meta' },
];

// RF-03, RF-08 e RF-12: lista com resumo, busca, filtro e os abaixo da meta primeiro.
export function ListaProdutosScreen({ navigation }: Props) {
  const [produtos, setProdutos] = useState<Produto[] | null>(null);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const avisar = useAviso();
  const [boasVindas, setBoasVindas] = useState(false);

  // RF-15: cartão de boas-vindas até ser dispensado.
  useEffect(() => {
    boasVindasDispensada().then((dispensada) => setBoasVindas(!dispensada));
  }, []);

  async function onDispensarBoasVindas() {
    setBoasVindas(false);
    await dispensarBoasVindas();
  }

  const cartaoBoasVindas = boasVindas ? (
    <CartaoBoasVindas onDispensar={onDispensarBoasVindas} />
  ) : null;

  const recarregar = useCallback(async () => {
    setProdutos(await repositorio.listarProdutos());
  }, []);

  useFocusEffect(
    useCallback(() => {
      recarregar();
    }, [recarregar]),
  );

  // CA-22: ignora o segundo toque enquanto a carga anterior não termina.
  const carregando = useRef(false);
  async function onCarregarExemplos() {
    if (carregando.current) return;
    carregando.current = true;
    try {
      await carregarExemplos(repositorio);
      await recarregar();
      avisar(`${EXEMPLOS.length} produtos de exemplo carregados`);
    } finally {
      carregando.current = false;
    }
  }

  const novoProduto = () => navigation.navigate('ProdutoForm', {});

  if (produtos === null) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  if (produtos.length === 0) {
    return (
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.rolagemVazia}>
        {cartaoBoasVindas}
        <EstadoVazio onCarregarExemplos={onCarregarExemplos} onNovoProduto={novoProduto} />
      </ScrollView>
    );
  }

  const visiveis = organizarLista(produtos, { busca, filtro });
  const algumAbaixo = organizarLista(produtos, { busca: '', filtro: 'abaixo' }).length > 0;

  const cabecalho = (
    <View style={estilos.cabecalho}>
      {cartaoBoasVindas}
      <View
        style={[estilos.resumo, algumAbaixo ? estilos.resumoAlerta : estilos.resumoOk]}
        accessibilityRole="summary"
      >
        <Icone
          nome={algumAbaixo ? 'alert-circle' : 'checkmark-circle'}
          cor={algumAbaixo ? 'vermelho' : 'verde'}
        />
        <Text style={estilos.resumoTexto}>{resumoLista(produtos)}</Text>
      </View>
      <CampoBusca valor={busca} onChange={setBusca} />
      <FiltroSegmentado opcoes={FILTROS} selecionado={filtro} onChange={setFiltro} />
    </View>
  );

  return (
    <View style={estilos.tela}>
      <FlatList
        data={visiveis}
        keyExtractor={(p) => p.id}
        contentContainerStyle={estilos.lista}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={
          <View style={estilos.semResultado}>
            <Text style={estilos.texto}>Nenhum produto encontrado.</Text>
            <Botao
              titulo="Limpar busca e filtro"
              variante="secundario"
              onPress={() => {
                setBusca('');
                setFiltro('todos');
              }}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
            onPress={() => navigation.navigate('ProdutoForm', { produtoId: item.id })}
          />
        )}
      />
      <View style={estilos.rodape}>
        <Botao titulo="Novo produto" icone="add" onPress={novoProduto} />
      </View>
    </View>
  );
}

function EstadoVazio({
  onCarregarExemplos,
  onNovoProduto,
}: {
  onCarregarExemplos: () => void;
  onNovoProduto: () => void;
}) {
  return (
    <View style={estilos.vazio}>
      <Icone nome="pricetags-outline" tamanho="grande" cor="primaria" />
      <Text style={estilos.titulo}>Nenhum produto cadastrado</Text>
      <Text style={estilos.texto}>
        Cadastre um produto com o custo, o preço de venda e a margem que você quer. A cada compra, o
        app diz a que preço vender.
      </Text>
      <View style={estilos.botoes}>
        <Botao titulo="Novo produto" icone="add" onPress={onNovoProduto} />
        <Botao titulo="Carregar exemplos" variante="secundario" onPress={onCarregarExemplos} />
      </View>
      <Text style={estilos.nota}>
        Os exemplos têm valores ilustrativos, só para demonstração. Não são preços reais do mercado.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  lista: { padding: espaco.l, gap: espaco.m, paddingBottom: espaco.xl },
  cabecalho: { gap: espaco.m, marginBottom: espaco.xs },
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.s,
    borderRadius: raio.cartao,
    borderWidth: linha.fina,
    padding: espaco.m,
  },
  resumoAlerta: { backgroundColor: cores.vermelhoFundo, borderColor: cores.vermelho },
  resumoOk: { backgroundColor: cores.verdeFundo, borderColor: cores.verde },
  resumoTexto: { flex: 1, fontSize: fonte.corpo, fontWeight: peso.medio, color: cores.texto },
  rodape: {
    padding: espaco.l,
    backgroundColor: cores.superficie,
    borderTopWidth: linha.fina,
    borderTopColor: cores.borda,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  rolagemVazia: { flexGrow: 1, padding: espaco.l, gap: espaco.l, justifyContent: 'center' },
  vazio: { alignItems: 'center', padding: espaco.l, gap: espaco.l },
  titulo: { fontSize: fonte.titulo, fontWeight: peso.forte, color: cores.texto, textAlign: 'center' },
  texto: { fontSize: fonte.corpo, color: cores.texto, textAlign: 'center' },
  botoes: { alignSelf: 'stretch', gap: espaco.m },
  nota: { fontSize: fonte.legenda, color: cores.textoSuave, textAlign: 'center' },
  semResultado: { gap: espaco.l, paddingVertical: espaco.xl },
});
