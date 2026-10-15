import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';

import { cores, icone, NomeCor } from '../theme/tema';

export type NomeIcone = ComponentProps<typeof Ionicons>['name'];

interface Props {
  nome: NomeIcone;
  tamanho?: keyof typeof icone;
  cor?: NomeCor;
  /** Sem rótulo, o ícone é decorativo e fica oculto para o leitor de tela (RNF-10). */
  rotulo?: string;
}

export function Icone({ nome, tamanho = 'medio', cor = 'texto', rotulo }: Props) {
  return (
    <Ionicons
      name={nome}
      size={icone[tamanho]}
      color={cores[cor]}
      accessible={rotulo !== undefined}
      accessibilityLabel={rotulo}
      importantForAccessibility={rotulo ? 'yes' : 'no-hide-descendants'}
      accessibilityElementsHidden={!rotulo}
    />
  );
}
