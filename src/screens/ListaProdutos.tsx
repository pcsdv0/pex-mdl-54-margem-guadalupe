import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { Botao } from '../components/Botao';
import { ProdutoCard } from '../components/ProdutoCard';
import { carregarExemplos } from '../data/exemplos';
import { Rotas } from '../navigation';
import { Produto, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte } from '../theme/cores';

type Props = NativeStackScreenProps<Rotas, 'ListaProdutos'>;

// RF-03 e RF-08: lista de produtos com margem e semáforo; estado vazio com carga de exemplos.
export function ListaProdutosScreen({ navigation }: Props) {
  const [produtos, setProdutos] = useState<Produto[] | null>(null);

  const recarregar = useCallback(async () => {
    setProdutos(await repositorio.listarProdutos());
  }, []);

  useFocusEffect(
    useCallback(() => {
      recarregar();
    }, [recarregar]),
  );

  async function onCarregarExemplos() {
    await carregarExemplos(repositorio);
    await recarregar();
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
      <EstadoVazio onCarregarExemplos={onCarregarExemplos} onNovoProduto={novoProduto} />
    );
  }

  return (
    <View style={estilos.tela}>
      <FlatList
        data={produtos}
        keyExtractor={(p) => p.id}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <ProdutoCard
            produto={item}
            onPress={() => navigation.navigate('ProdutoForm', { produtoId: item.id })}
          />
        )}
      />
      <View style={estilos.rodape}>
        <Botao titulo="+ Novo produto" onPress={novoProduto} />
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
    <View style={[estilos.centro, estilos.vazio]}>
      <Text style={estilos.titulo}>Nenhum produto cadastrado</Text>
      <Text style={estilos.texto}>
        Cadastre seus produtos para ver a margem de lucro de cada um.
      </Text>
      <View style={estilos.botoes}>
        <Botao titulo="+ Novo produto" onPress={onNovoProduto} />
        <Botao titulo="Carregar exemplos" variante="secundario" onPress={onCarregarExemplos} />
      </View>
      <Text style={estilos.nota}>
        Os exemplos têm valores ilustrativos, só para demonstração. Não são preços reais do
        mercado.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  lista: { padding: espaco.m, gap: 12 },
  rodape: {
    padding: espaco.m,
    backgroundColor: cores.superficie,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
  },
  vazio: { padding: espaco.g, gap: espaco.m },
  titulo: { fontSize: fonte.titulo, fontWeight: '800', color: cores.texto, textAlign: 'center' },
  texto: { fontSize: fonte.normal, color: cores.texto, textAlign: 'center' },
  botoes: { alignSelf: 'stretch', gap: 12 },
  nota: { fontSize: fonte.pequena, color: cores.textoSuave, textAlign: 'center' },
});
