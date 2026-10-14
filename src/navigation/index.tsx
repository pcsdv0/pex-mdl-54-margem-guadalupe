// Navegação em pilha (design §2): React Navigation, native stack.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ListaProdutosScreen } from '../screens/ListaProdutos';
import { NovaCompraScreen } from '../screens/NovaCompra';
import { ProdutoFormScreen } from '../screens/ProdutoForm';
import { ResultadoCompraScreen } from '../screens/ResultadoCompra';
import { cores, fonte } from '../theme/cores';

export type Rotas = {
  ListaProdutos: undefined;
  ProdutoForm: { produtoId?: string };
  NovaCompra: { produtoId: string };
  ResultadoCompra: { produtoId: string; custoAnterior: number | null };
  Historico: { produtoId: string };
};

const Stack = createNativeStackNavigator<Rotas>();

export function Navegacao() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: cores.primaria },
          headerTintColor: cores.primariaTexto,
          headerTitleStyle: { fontSize: fonte.grande, fontWeight: '700' },
          contentStyle: { backgroundColor: cores.fundo },
        }}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
