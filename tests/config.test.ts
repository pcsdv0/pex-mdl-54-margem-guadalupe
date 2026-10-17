// RNF-12 e RNF-11: configuração de instalação (app.json e eas.json) do APK de teste.
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { cores } from '../src/theme/tema';

const raiz = join(__dirname, '..');
const lerJson = (arquivo: string) => JSON.parse(readFileSync(join(raiz, arquivo), 'utf8'));
const app = lerJson('app.json').expo;
const eas = lerJson('eas.json');

describe('app.json (RNF-12)', () => {
  test('nome, versão e pacote do Android', () => {
    expect(app.name).toBe('Controle de Margem');
    expect(app.version).toBe('1.0.0');
    expect(app.android.package).toBe('br.edu.uninassau.controlemargem');
    expect(app.android.versionCode).toBe(1);
  });

  test('orientação travada em retrato e tema claro (RNF-11)', () => {
    expect(app.orientation).toBe('portrait');
    expect(app.userInterfaceStyle).toBe('light');
  });

  test('ícone, ícone adaptativo e tela de abertura existem', () => {
    const arquivos = [
      app.icon,
      app.android.adaptiveIcon.foregroundImage,
      app.android.adaptiveIcon.backgroundImage,
      app.android.adaptiveIcon.monochromeImage,
    ];
    const splash = app.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-splash-screen');
    expect(splash).toBeDefined();
    arquivos.push(splash[1].image);
    for (const arquivo of arquivos) {
      expect(existsSync(join(raiz, arquivo))).toBe(true);
    }
  });

  test('tela de abertura e fundo do ícone adaptativo na cor do tema', () => {
    const splash = app.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-splash-screen');
    expect(splash[1].backgroundColor.toLowerCase()).toBe(cores.primaria.toLowerCase());
    expect(app.android.adaptiveIcon.backgroundColor.toLowerCase()).toBe(cores.primaria.toLowerCase());
  });
});

describe('eas.json (RNF-12)', () => {
  test('o perfil "preview" gera APK', () => {
    expect(eas.build.preview.android.buildType).toBe('apk');
    expect(eas.build.preview.distribution).toBe('internal');
  });
});
