import { Pressable, StyleSheet, Text, View } from 'react-native';

import { situacaoProduto } from '../domain/calculos';
import { formatarPercentual, formatarReais } from '../domain/formatacao';
import { Produto } from '../storage/repositorio';
import { cores, espaco, fonte, linha, peso, raio, sombra } from '../theme/tema';
import { Icone } from './Icone';
import { LinhaValor, ParDeValores } from './LinhaValor';
import { SemaforoBadge } from './SemaforoBadge';

// RF-03 e RF-12: nome, preço e margem em destaque, semáforo e, se abaixo da meta, o preço sugerido.
export function ProdutoCard({ produto, onPress }: { produto: Produto; onPress: () => void }) {
  const s = situacaoProduto(produto.precoVenda, produto.custoAtual, produto.margemDesejada);
  const abaixo = s.status === 'vermelho';
  const descricao = [
    produto.nome,
    `preço ${formatarReais(produto.precoVenda)}`,
    `margem ${formatarPercentual(s.margem)}`,
    abaixo ? `abaixo da meta de ${produto.margemDesejada}%` : `na meta de ${produto.margemDesejada}%`,
    abaixo ? `sugerido ${formatarReais(s.precoSugerido)}` : null,
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={descricao}
      accessibilityHint="Abre o produto"
      onPress={onPress}
      style={({ pressed }) => [
        estilos.cartao,
        { borderLeftColor: abaixo ? cores.vermelho : cores.verde },
        pressed ? estilos.pressionado : null,
      ]}
    >
      <View style={estilos.topo}>
        <Text style={estilos.nome}>{produto.nome}</Text>
        <Icone nome="chevron-forward" cor="textoSuave" />
      </View>
      <ParDeValores
        esquerda={<LinhaValor rotulo="Preço" valor={formatarReais(produto.precoVenda)} tamanho="medio" />}
        direita={
          <LinhaValor
            rotulo={`Margem (meta ${produto.margemDesejada}%)`}
            valor={formatarPercentual(s.margem)}
            cor={abaixo ? 'vermelho' : 'verde'}
            alinhar="fim"
          />
        }
      />
      <View style={estilos.linha}>
        <SemaforoBadge status={s.status} />
        {abaixo ? (
          <Text style={estilos.sugerido}>Sugerido: {formatarReais(s.precoSugerido)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.cartao,
    borderWidth: linha.fina,
    borderColor: cores.borda,
    borderLeftWidth: linha.destaque,
    padding: espaco.l,
    gap: espaco.m,
    ...sombra.cartao,
  },
  pressionado: { opacity: 0.8 },
  topo: { flexDirection: 'row', alignItems: 'center', gap: espaco.s },
  nome: { flex: 1, fontSize: fonte.subtitulo, fontWeight: peso.forte, color: cores.texto },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: espaco.s,
  },
  sugerido: { flexShrink: 1, fontSize: fonte.corpo, fontWeight: peso.forte, color: cores.vermelho },
});
