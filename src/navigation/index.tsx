// Navegação em pilha (design §2): React Navigation, native stack.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BotaoAjuda } from '../components/BotaoAjuda';
import { AjudaScreen } from '../screens/Ajuda';
import { HistoricoScreen } from '../screens/Historico';
import { ListaProdutosScreen } from '../screens/ListaProdutos';
import { NovaCompraScreen } from '../screens/NovaCompra';
import { ProdutoFormScreen } from '../screens/ProdutoForm';
import { ResultadoCompraScreen } from '../screens/ResultadoCompra';
import { cores, fonte, peso } from '../theme/tema';

export type Rotas = {
  ListaProdutos: undefined;
  ProdutoForm: { produtoId?: string };
  NovaCompra: { produtoId: string };
  ResultadoCompra: { produtoId: string; custoAnterior: number | null };
  Historico: { produtoId: string };
  Ajuda: undefined;
};

const Stack = createNativeStackNavigator<Rotas>();

export function Navegacao() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: cores.sobrePrimaria,
          headerTitleStyle: { fontSize: fonte.subtitulo, fontWeight: peso.forte },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: cores.fundo },
          // RF-13: "?" em todas as telas, menos na própria Ajuda.
          headerRight: () => <BotaoAjuda onPress={() => navigation.navigate('Ajuda')} />,
        })}
      >
        <Stack.Screen
          name="ListaProdutos"
          component={ListaProdutosScreen}
          options={{ title: 'Meus produtos' }}
        />
        <Stack.Screen
          name="ProdutoForm"
          component={ProdutoFormScreen}
          options={({ route }) => ({
            title: route.params.produtoId ? 'Produto' : 'Novo produto',
          })}
        />
        <Stack.Screen
          name="NovaCompra"
          component={NovaCompraScreen}
          options={{ title: 'Nova compra' }}
        />
        <Stack.Screen
          name="ResultadoCompra"
          component={ResultadoCompraScreen}
          options={{ title: 'Resultado da compra' }}
        />
        <Stack.Screen
          name="Historico"
          component={HistoricoScreen}
          options={{ title: 'Histórico de custos' }}
        />
        <Stack.Screen
          name="Ajuda"
          component={AjudaScreen}
          options={{ title: 'Como funcionam as contas', headerRight: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
