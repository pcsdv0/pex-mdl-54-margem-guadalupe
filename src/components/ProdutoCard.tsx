import { Pressable, StyleSheet, Text, View } from 'react-native';

import { calcularMargem, statusMargem } from '../domain/calculos';
import { formatarPercentual, formatarReais } from '../domain/formatacao';
import { Produto } from '../storage/repositorio';
import { cores, fonte } from '../theme/cores';
import { SemaforoBadge } from './SemaforoBadge';

// RF-03: nome, preço, margem atual e semáforo.
export function ProdutoCard({ produto, onPress }: { produto: Produto; onPress: () => void }) {
  const margem = calcularMargem(produto.precoVenda, produto.custoAtual);
  const status = statusMargem(produto.precoVenda, produto.custoAtual, produto.margemDesejada);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Abre o produto"
      onPress={onPress}
      style={({ pressed }) => [
        estilos.card,
        { borderLeftColor: status === 'verde' ? cores.verde : cores.vermelho },
        pressed ? { opacity: 0.8 } : null,
      ]}
    >
      <Text style={estilos.nome}>{produto.nome}</Text>
      <View style={estilos.linha}>
        <Text style={estilos.info}>Preço: {formatarReais(produto.precoVenda)}</Text>
        <Text style={estilos.info}>
          Margem: <Text style={estilos.destaque}>{formatarPercentual(margem)}</Text>
        </Text>
      </View>
      <View style={estilos.linha}>
        <SemaforoBadge status={status} />
        <Text style={estilos.meta}>Meta: {produto.margemDesejada}%</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    borderLeftWidth: 8,
    padding: 16,
    gap: 8,
  },
  nome: { fontSize: fonte.grande, fontWeight: '700', color: cores.texto },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  info: { fontSize: fonte.normal, color: cores.texto },
  destaque: { fontWeight: '800' },
  meta: { fontSize: fonte.pequena, color: cores.textoSuave },
});
