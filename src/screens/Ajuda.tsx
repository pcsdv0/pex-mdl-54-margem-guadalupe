import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ReactNode, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAviso } from '../components/Aviso';
import { Botao } from '../components/Botao';
import { DialogoConfirmacao } from '../components/DialogoConfirmacao';
import { Icone, NomeIcone } from '../components/Icone';
import { SemaforoBadge } from '../components/SemaforoBadge';
import { Tela } from '../components/Tela';
import { EXEMPLOS } from '../data/exemplos';
import { explicarMargem, explicarPrecoSugerido } from '../domain/explicacao';
import { formatarReais } from '../domain/formatacao';
import { Rotas } from '../navigation';
import { apagarTodosOsDados } from '../storage/repositorio';
import { cores, espaco, fonte, linha, numeros, peso, raio } from '../theme/tema';

// RF-13: explicação de uma tela, com o exemplo do arroz (valores ilustrativos, requirements §9).
const ARROZ = EXEMPLOS[0];
const NOVO_CUSTO_DEMONSTRACAO = 440; // a "nova compra" do roteiro de demonstração (requirements §9)

type Props = NativeStackScreenProps<Rotas, 'Ajuda'>;

export function AjudaScreen({ navigation }: Props) {
  const avisar = useAviso();
  const [confirmar, setConfirmar] = useState(false);
  const apagando = useRef(false);

  // RF-17: volta o app ao estado de primeira abertura.
  async function apagar() {
    if (apagando.current) return;
    apagando.current = true;
    setConfirmar(false);
    await apagarTodosOsDados();
    avisar('Todos os dados foram apagados');
    navigation.popToTop();
  }

  return (
    <Tela
      sobreposicao={
        <DialogoConfirmacao
          visivel={confirmar}
          titulo="Apagar todos os dados?"
          mensagem="Todos os produtos e o histórico de custos serão apagados deste celular, e o app volta como na primeira abertura. Não dá para desfazer."
          textoConfirmar="Apagar tudo"
          onConfirmar={apagar}
          onCancelar={() => setConfirmar(false)}
        />
      }
    >
        <Text style={estilos.intro}>
          O app responde: <Text style={estilos.forte}>“dado o custo que paguei hoje, a que preço devo vender para manter a minha margem?”</Text>
        </Text>

        <Secao icone="pie-chart-outline" titulo="Margem">
          <Text style={estilos.texto}>
            É quanto sobra do preço de venda depois de pagar o custo, em porcentagem.
          </Text>
          <Exemplo
            titulo={`${ARROZ.nome}: custo ${formatarReais(ARROZ.custoAtual)}, venda ${formatarReais(ARROZ.precoVenda)}`}
            passos={explicarMargem(ARROZ.precoVenda, ARROZ.custoAtual)}
          />
        </Secao>

        <Secao icone="flag-outline" titulo="Margem desejada">
          <Text style={estilos.texto}>
            É a margem que você quer manter naquele produto. Com {ARROZ.margemDesejada}%, de cada R$ 1,00
            vendido você quer que sobrem {formatarReais(ARROZ.margemDesejada /* 25% de 100 centavos */)}.
          </Text>
        </Secao>

        <Secao icone="pricetag-outline" titulo="Preço sugerido">
          <Text style={estilos.texto}>
            Quando o custo muda, o app calcula o preço que mantém a sua margem desejada.
          </Text>
          <Exemplo
            titulo={`${ARROZ.nome} comprado a ${formatarReais(NOVO_CUSTO_DEMONSTRACAO)}`}
            passos={explicarPrecoSugerido(NOVO_CUSTO_DEMONSTRACAO, ARROZ.margemDesejada)}
          />
        </Secao>

        <Secao icone="ellipse-outline" titulo="Semáforo">
          <View style={estilos.semaforo}>
            <SemaforoBadge status="verde" />
            <Text style={estilos.texto}>O preço de venda já garante a margem desejada.</Text>
          </View>
          <View style={estilos.semaforo}>
            <SemaforoBadge status="vermelho" />
            <Text style={estilos.texto}>
              O preço está abaixo do sugerido: você está lucrando menos do que quer.
            </Text>
          </View>
        </Secao>

        <Text style={estilos.nota}>
          Os valores do exemplo são ilustrativos, não são preços reais do mercado.
        </Text>

        <View style={estilos.apagar}>
          <Botao
            titulo="Apagar todos os dados"
            icone="trash-outline"
            variante="texto"
            perigo
            onPress={() => setConfirmar(true)}
          />
        </View>
    </Tela>
  );
}

function Secao({ icone, titulo, children }: { icone: NomeIcone; titulo: string; children: ReactNode }) {
  return (
    <View style={estilos.secao}>
      <View style={estilos.cabecalho}>
        <Icone nome={icone} cor="primaria" />
        <Text style={estilos.titulo} accessibilityRole="header">
          {titulo}
        </Text>
      </View>
      {children}
    </View>
  );
}

function Exemplo({ titulo, passos }: { titulo: string; passos: string[] }) {
  return (
    <View style={estilos.exemplo}>
      <Text style={estilos.exemploTitulo}>Exemplo — {titulo}</Text>
      {passos.map((p) => (
        <Text key={p} style={[estilos.passo, numeros]}>
          {p}
        </Text>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  intro: { fontSize: fonte.corpo, color: cores.texto },
  forte: { fontWeight: peso.forte },
  secao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.cartao,
    borderWidth: linha.fina,
    borderColor: cores.borda,
    padding: espaco.l,
    gap: espaco.m,
  },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: espaco.s },
  titulo: { fontSize: fonte.subtitulo, fontWeight: peso.forte, color: cores.texto },
  texto: { flex: 1, fontSize: fonte.corpo, color: cores.texto },
  exemplo: {
    backgroundColor: cores.primariaFundo,
    borderRadius: raio.campo,
    padding: espaco.m,
    gap: espaco.xs,
  },
  exemploTitulo: { fontSize: fonte.legenda, fontWeight: peso.forte, color: cores.texto },
  passo: { fontSize: fonte.corpo, color: cores.texto },
  semaforo: { gap: espaco.s },
  nota: { fontSize: fonte.legenda, color: cores.textoSuave, textAlign: 'center' },
  apagar: {
    marginTop: espaco.xl,
    paddingTop: espaco.l,
    borderTopWidth: linha.fina,
    borderTopColor: cores.borda,
  },
});
