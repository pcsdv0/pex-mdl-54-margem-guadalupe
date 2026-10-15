import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Botao } from '../components/Botao';
import { CampoMoeda, erroFormatoMoeda } from '../components/CampoMoeda';
import { formatarReais, parseReais } from '../domain/formatacao';
import { validarCusto } from '../domain/validacao';
import { Rotas } from '../navigation';
import { Produto, registrarCompra, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'NovaCompra'>;

// RF-04: informa o novo custo; ao confirmar, grava a compra e mostra o resultado.
export function NovaCompraScreen({ navigation, route }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);
  const [custo, setCusto] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [gravando, setGravando] = useState(false);

  useEffect(() => {
    repositorio.listarProdutos().then((lista) => {
      setProduto(lista.find((p) => p.id === produtoId) ?? null);
    });
  }, [produtoId]);

  async function confirmar() {
    if (!produto || gravando) return;
    const valor = parseReais(custo);
    const novoErro = erroFormatoMoeda(custo) ?? validarCusto(valor);
    setErro(novoErro);
    if (novoErro) return;
    setGravando(true);
    const { custoAnterior } = await registrarCompra(repositorio, produto, valor!);
    // replace: voltar do resultado não deve reabrir esta tela e gravar a compra de novo.
    navigation.replace('ResultadoCompra', { produtoId, custoAnterior });
  }

  if (!produto) {
    return <View style={estilos.tela} />;
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={estilos.nome}>{produto.nome}</Text>
        <Text style={estilos.info}>Custo atual: {formatarReais(produto.custoAtual)}</Text>
        <CampoMoeda
          rotulo="Quanto você pagou nesta compra?"
          valor={custo}
          onChange={setCusto}
          erro={erro}
          autoFocus
        />
        <Botao titulo="Confirmar" onPress={confirmar} desabilitado={gravando} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.l, gap: espaco.l },
  nome: { fontSize: fonte.titulo, fontWeight: '800', color: cores.texto },
  info: { fontSize: fonte.corpo, color: cores.textoSuave },
});
