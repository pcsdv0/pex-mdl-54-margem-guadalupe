import { StatusBar } from 'expo-status-bar';

import { Navegacao } from './src/navigation';

export default function App() {
  return (
    <>
      <Navegacao />
      <StatusBar style="light" />
    </>
  );
}
