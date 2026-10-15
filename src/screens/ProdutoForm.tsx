import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAviso } from '../components/Aviso';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { CampoMoeda, centavosParaCampo, erroFormatoMoeda } from '../components/CampoMoeda';
import { CampoPercentual, lerPercentual } from '../components/CampoPercentual';
import { CartaoSituacao } from '../components/CartaoSituacao';
import { DialogoConfirmacao } from '../components/DialogoConfirmacao';
import { situacaoProduto } from '../domain/calculos';
import { parseReais } from '../domain/formatacao';
import { ErrosProduto, validarProduto } from '../domain/validacao';
import { Rotas } from '../navigation';
import { cadastrarProduto, Produto, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte, linha, peso } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'ProdutoForm'>;

// RF-01, RF-02, RF-13 e RF-14: cadastro e edição com textos de apoio, avisos e exclusão confirmada.
export function ProdutoFormScreen({ navigation, route }: Props) {
  const produtoId = route.params.produtoId;
  const edicao = produtoId !== undefined;
  const avisar = useAviso();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [nome, setNome] = useState('');
  const [custo, setCusto] = useState('');
  const [preco, setPreco] = useState('');
  const [margem, setMargem] = useState('');
  const [erros, setErros] = useState<ErrosProduto>({});
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  // RNF-09: "próximo" leva ao campo seguinte.
  const refCusto = useRef<TextInput>(null);
  const refPreco = useRef<TextInput>(null);
  const refMargem = useRef<TextInput>(null);

  // CA-23: marca o que foi digitado e ainda não salvo, para não ser apagado ao voltar à tela.
  const alterado = useRef(false);
  function digitar(setter: (texto: string) => void) {
    return (texto: string) => {
      alterado.current = true;
      setter(texto);
    };
  }

  // Recarrega ao voltar para a tela: o custo e o preço podem ter mudado numa nova compra.
  // A situação e o custo (só leitura) sempre atualizam; os campos editáveis só se nada foi alterado.
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
        setCusto(centavosParaCampo(p.custoAtual));
        if (!alterado.current) {
          setNome(p.nome);
          setPreco(centavosParaCampo(p.precoVenda));
          setMargem(String(p.margemDesejada));
          setErros({});
        }
      });
    }, [edicao, produtoId, navigation]),
  );

  // CA-22: ignora o segundo toque enquanto a gravação anterior não termina.
  const salvando = useRef(false);

  async function salvar() {
    if (salvando.current) return;
    salvando.current = true;
    try {
      await gravarFormulario();
    } finally {
      salvando.current = false;
    }
  }

  async function gravarFormulario() {
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
      const atualizado = { ...produto, ...valores };
      await repositorio.salvarProduto(atualizado);
      setProduto(atualizado);
      alterado.current = false;
      avisar('Alterações salvas');
    } else {
      await cadastrarProduto(repositorio, { ...valores, custoAtual: dados.custo! });
      avisar('Produto cadastrado');
      navigation.goBack();
    }
  }

  async function excluir() {
    if (!produto) return;
    setConfirmarExclusao(false);
    await repositorio.excluirProduto(produto.id);
    avisar(`"${produto.nome}" foi excluído`);
    navigation.popToTop();
  }

  if (edicao && !produto) {
    return <View style={estilos.tela} />;
  }

  const situacao = produto
    ? situacaoProduto(produto.precoVenda, produto.custoAtual, produto.margemDesejada)
    : null;

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        {produto && situacao ? (
          <View style={estilos.secao}>
            <Text style={estilos.nomeProduto}>{produto.nome}</Text>
            <CartaoSituacao
              titulo="Situação atual"
              precoVenda={produto.precoVenda}
              margemDesejada={produto.margemDesejada}
              situacao={situacao}
              mostrarSugerido
            />
            <Botao
              titulo="Nova compra"
              icone="cart-outline"
              onPress={() => navigation.navigate('NovaCompra', { produtoId: produto.id })}
            />
            <Botao
              titulo="Ver histórico de custos"
              icone="time-outline"
              variante="secundario"
              onPress={() => navigation.navigate('Historico', { produtoId: produto.id })}
            />
          </View>
        ) : null}

        <View style={estilos.secao}>
          {produto ? (
            <Text style={estilos.tituloSecao} accessibilityRole="header">
              Dados do produto
            </Text>
          ) : null}
          <Campo
            rotulo="Nome do produto"
            valor={nome}
            onChange={digitar(setNome)}
            erro={erros.nome}
            dica="Como vai aparecer na lista. Ex.: Arroz 1 kg"
            autoFocus={!edicao}
            tecla="next"
            aoConfirmar={() => (produto ? refPreco : refCusto).current?.focus()}
          />
          {produto ? (
            <CampoMoeda
              rotulo="Custo atual"
              valor={custo}
              somenteLeitura
              dica='Para mudar o custo, use "Nova compra".'
            />
          ) : (
            <CampoMoeda
              ref={refCusto}
              rotulo="Custo"
              valor={custo}
              onChange={setCusto}
              erro={erros.custo}
              dica="Quanto você paga ao fornecedor por unidade."
              tecla="next"
              aoConfirmar={() => refPreco.current?.focus()}
            />
          )}
          <CampoMoeda
            ref={refPreco}
            rotulo="Preço de venda"
            valor={preco}
            onChange={digitar(setPreco)}
            erro={erros.preco}
            dica="Quanto o cliente paga por unidade."
            tecla="next"
            aoConfirmar={() => refMargem.current?.focus()}
          />
          <CampoPercentual
            ref={refMargem}
            rotulo="Margem desejada"
            valor={margem}
            onChange={digitar(setMargem)}
            erro={erros.margemDesejada}
            dica="Quanto % do preço de venda você quer que sobre. Ex.: 25"
            tecla="done"
            aoConfirmar={salvar}
          />
          {produto ? (
            <Botao titulo="Salvar alterações" variante="secundario" onPress={salvar} />
          ) : (
            <Botao titulo="Salvar produto" icone="checkmark" onPress={salvar} />
          )}
        </View>

        {produto ? (
          <Botao
            titulo="Excluir produto"
            icone="trash-outline"
            variante="texto"
            perigo
            onPress={() => setConfirmarExclusao(true)}
          />
        ) : null}
      </ScrollView>

      <DialogoConfirmacao
        visivel={confirmarExclusao}
        titulo="Excluir produto?"
        mensagem={`"${produto?.nome ?? ''}" e o histórico de custos dele serão apagados. Não dá para desfazer.`}
        textoConfirmar="Excluir"
        onConfirmar={excluir}
        onCancelar={() => setConfirmarExclusao(false)}
      />
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espaco.l, gap: espaco.xl, paddingBottom: espaco.xxl },
  secao: { gap: espaco.l },
  nomeProduto: { fontSize: fonte.titulo, fontWeight: peso.forte, color: cores.texto },
  tituloSecao: {
    fontSize: fonte.subtitulo,
    fontWeight: peso.forte,
    color: cores.texto,
    paddingTop: espaco.l,
    borderTopWidth: linha.fina,
    borderTopColor: cores.borda,
  },
});
