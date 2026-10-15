import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { CampoMoeda, centavosParaCampo, erroFormatoMoeda } from '../components/CampoMoeda';
import { CampoPercentual, lerPercentual } from '../components/CampoPercentual';
import { parseReais } from '../domain/formatacao';
import { ErrosProduto, validarProduto } from '../domain/validacao';
import { Rotas } from '../navigation';
import { cadastrarProduto, Produto, repositorio } from '../storage/repositorio';
import { cores, espaco } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'ProdutoForm'>;

// RF-01 e RF-02: cadastro, edição (custo só leitura) e exclusão do produto.
export function ProdutoFormScreen({ navigation, route }: Props) {
  const produtoId = route.params.produtoId;
  const edicao = produtoId !== undefined;

  const [produto, setProduto] = useState<Produto | null>(null);
  const [nome, setNome] = useState('');
  const [custo, setCusto] = useState('');
  const [preco, setPreco] = useState('');
  const [margem, setMargem] = useState('');
  const [erros, setErros] = useState<ErrosProduto>({});

  // Recarrega ao voltar para a tela: o custo e o preço podem ter mudado numa nova compra.
  useFocusEffect(
    useCallback(() => {
      if (!edicao) {
        return;
      }
      repositorio.listarProdutos().then((lista) => {
        const p = lista.find((x) => x.id === produtoId);
        if (!p) {
          navigation.goBack();
          return;
        }
        setProduto(p);
        setNome(p.nome);
        setCusto(centavosParaCampo(p.custoAtual));
        setPreco(centavosParaCampo(p.precoVenda));
        setMargem(String(p.margemDesejada));
        setErros({});
      });
    }, [edicao, produtoId, navigation]),
  );

  async function salvar() {
    const dados = {
      nome,
      custo: parseReais(custo),
      preco: parseReais(preco),
      margemDesejada: lerPercentual(margem),
    };
    const novosErros = validarProduto(dados);
    const formatoCusto = erroFormatoMoeda(custo);
    const formatoPreco = erroFormatoMoeda(preco);
    if (formatoCusto) novosErros.custo = formatoCusto;
    if (formatoPreco) novosErros.preco = formatoPreco;
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      return;
    }
    const valores = {
      nome: nome.trim(),
      precoVenda: dados.preco!,
      margemDesejada: dados.margemDesejada!,
    };
    if (produto) {
      await repositorio.salvarProduto({ ...produto, ...valores });
    } else {
      await cadastrarProduto(repositorio, { ...valores, custoAtual: dados.custo! });
    }
    navigation.goBack();
  }

  function confirmarExclusao() {
    if (!produto) return;
    Alert.alert(
      'Excluir produto?',
      `"${produto.nome}" e o histórico de custos dele serão apagados.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await repositorio.excluirProduto(produto.id);
            navigation.popToTop();
          },
        },
      ],
    );
  }

  if (edicao && !produto) {
    return <View style={estilos.tela} />;
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        {produto ? (
          <View style={estilos.acoes}>
            <Botao
              titulo="Nova compra"
              onPress={() => navigation.navigate('NovaCompra', { produtoId: produto.id })}
            />
            <Botao
              titulo="Ver histórico"
              variante="secundario"
              onPress={() => navigation.navigate('Historico', { produtoId: produto.id })}
            />
          </View>
        ) : null}

        <Campo rotulo="Nome do produto" valor={nome} onChange={setNome} erro={erros.nome} />
        {produto ? (
          <CampoMoeda
            rotulo="Custo atual"
            valor={custo}
            somenteLeitura
            dica='Para mudar o custo, use "Nova compra".'
          />
        ) : (
          <CampoMoeda
            rotulo="Custo (quanto você paga)"
            valor={custo}
            onChange={setCusto}
            erro={erros.custo}
          />
        )}
        <CampoMoeda
          rotulo="Preço de venda"
          valor={preco}
          onChange={setPreco}
          erro={erros.preco}
        />
        <CampoPercentual
          rotulo="Margem desejada"
          valor={margem}
          onChange={setMargem}
          erro={erros.margemDesejada}
          dica="Quanto do preço você quer que sobre de lucro (1 a 99)."
        />

        <Botao titulo="Salvar" onPress={salvar} />
        {produto ? (
          <Botao titulo="Excluir produto" variante="texto" perigo onPress={confirmarExclusao} />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.l, gap: espaco.l, paddingBottom: espaco.xl * 2 },
  acoes: { gap: 12, marginBottom: espaco.s },
});
