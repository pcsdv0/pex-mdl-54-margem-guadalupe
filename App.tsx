import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AvisoProvider } from './src/components/Aviso';
import { Navegacao } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <AvisoProvider>
        <Navegacao />
      </AvisoProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
