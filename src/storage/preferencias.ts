// RF-15: preferência do aparelho — se o cartão de boas-vindas já foi dispensado.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAVE_BOAS_VINDAS = 'boasVindasDispensada';

export async function boasVindasDispensada(): Promise<boolean> {
  return (await AsyncStorage.getItem(CHAVE_BOAS_VINDAS)) === 'true';
}

export async function dispensarBoasVindas(): Promise<void> {
  await AsyncStorage.setItem(CHAVE_BOAS_VINDAS, 'true');
}
