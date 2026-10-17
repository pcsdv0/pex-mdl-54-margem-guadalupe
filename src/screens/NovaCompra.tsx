import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AlertaBanner } from '../components/AlertaBanner';
import { Botao } from '../components/Botao';
import { CampoMoeda, erroFormatoMoeda } from '../components/CampoMoeda';
import { CartaoSituacao } from '../components/CartaoSituacao';
import { Icone } from '../components/Icone';
import { LinhaValor } from '../components/LinhaValor';
import { Tela } from '../components/Tela';
import { situacaoProduto } from '../domain/calculos';
import { avisoConferencia } from '../domain/explicacao';
import { formatarReais, parseReais } from '../domain/formatacao';
import { validarCusto } from '../domain/validacao';
import { Rotas } from '../navigation';
import { Produto, registrarCompra, repositorio } from '../storage/repositorio';
import { cores, espaco, fonte, linha, peso, raio } from '../theme/tema';

type Props = NativeStackScreenProps<Rotas, 'NovaCompra'>;

// RF-04 e RF-11: informa o novo custo, vê a prévia enquanto digita e confirma a compra.
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

  function aoDigitar(texto: string) {
    setCusto(texto);
    setErro(null);
  }

  // CA-22: o ref barra o segundo toque antes mesmo de a tela redesenhar.
  const gravandoRef = useRef(false);

  async function confirmar() {
    if (!produto || gravandoRef.current) return;
    const valor = parseReais(custo);
    const novoErro = erroFormatoMoeda(custo) ?? validarCusto(valor);
    setErro(novoErro);
    if (novoErro) return;
    gravandoRef.current = true;
    setGravando(true);
    const { custoAnterior } = await registrarCompra(repositorio, produto, valor!);
    // replace: voltar do resultado não deve reabrir esta tela e gravar a compra de novo.
    navigation.replace('ResultadoCompra', { produtoId, custoAnterior });
  }

  if (!produto) {
    return <View style={estilos.tela} />;
  }

  // RF-11: prévia só com um custo válido (RN-07, RN-08).
  const valor = parseReais(custo);
  const valido = erroFormatoMoeda(custo) === null && validarCusto(valor) === null;
  const previa = valido
    ? situacaoProduto(produto.precoVenda, valor!, produto.margemDesejada)
    : null;
  // RF-18 e RN-09: só avisa; a compra pode ser confirmada mesmo assim.
  const conferir = valido ? avisoConferencia(produto.custoAtual, valor!) : null;

  return (
    <Tela>
        <View style={estilos.cabecalho}>
          <Text style={estilos.nome}>{produto.nome}</Text>
          <Text style={estilos.info}>
            Custo atual {formatarReais(produto.custoAtual)} · Preço {formatarReais(produto.precoVenda)}
          </Text>
        </View>

        <CampoMoeda
          rotulo="Quanto você pagou nesta compra (por unidade)?"
          valor={custo}
          onChange={aoDigitar}
          erro={erro}
          autoFocus
          tecla="done"
          aoConfirmar={confirmar}
        />

        {previa ? (
          <View style={estilos.previa} accessibilityLiveRegion="polite">
            {conferir ? <AlertaBanner mensagem={conferir} /> : null}
            <CartaoSituacao
              titulo="Prévia: se mantiver o preço atual"
              precoVenda={produto.precoVenda}
              margemDesejada={produto.margemDesejada}
              situacao={previa}
            />
            <View style={estilos.sugerido}>
              <LinhaValor
                rotulo={`Preço para manter ${produto.margemDesejada}% de margem`}
                valor={formatarReais(previa.precoSugerido)}
                cor="primaria"
              />
            </View>
          </View>
        ) : (
          <View style={estilos.orientacao}>
            <Icone nome="information-circle-outline" cor="textoSuave" />
            <Text style={estilos.orientacaoTexto}>
              Digite o custo para ver, antes de confirmar, como fica a margem e o preço sugerido.
            </Text>
          </View>
        )}

        <Botao
          titulo="Confirmar compra"
          icone="checkmark"
          onPress={confirmar}
          desabilitado={gravando}
        />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { gap: espaco.xs },
  nome: { fontSize: fonte.titulo, fontWeight: peso.forte, color: cores.texto },
  info: { fontSize: fonte.legenda, color: cores.textoSuave },
  previa: { gap: espaco.m },
  sugerido: {
    backgroundColor: cores.primariaFundo,
    borderRadius: raio.cartao,
    borderWidth: linha.fina,
    borderColor: cores.primaria,
    padding: espaco.l,
  },
  orientacao: {
    flexDirection: 'row',
    gap: espaco.s,
    padding: espaco.l,
    borderRadius: raio.cartao,
    borderWidth: linha.fina,
    borderColor: cores.borda,
    borderStyle: 'dashed',
  },
  orientacaoTexto: { flex: 1, fontSize: fonte.corpo, color: cores.textoSuave },
});
