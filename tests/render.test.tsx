// RNF-11 e CA-29: montagem dos componentes comuns em cada tamanho de tela e de fonte.
// O corte de texto em si só aparece no aparelho (checklist CA-29); aqui se confere o que dá para
// conferir sem aparelho: o texto está inteiro na árvore, nada limita as linhas e a disposição
// segue a regra de theme/layout.ts.
import { act, ReactElement } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { create, ReactTestInstance } from 'react-test-renderer';

import { CampoMoeda } from '../src/components/CampoMoeda';
import { CartaoSituacao } from '../src/components/CartaoSituacao';
import { ComoChegamos } from '../src/components/ComoChegamos';
import { ProdutoCard } from '../src/components/ProdutoCard';
import { situacaoProduto } from '../src/domain/calculos';
import { NOTA_ESCOPO_CALCULO } from '../src/domain/explicacao';
import { empilhar, larguraDoConteudo } from '../src/theme/layout';

// Os ícones carregam fontes (expo-asset), que não existem no Jest; o teste usa um ícone vazio.
jest.mock('@expo/vector-icons/Ionicons', () => ({
  __esModule: true,
  default: () => null,
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const TELAS = [
  { largura: 320, altura: 568 },
  { largura: 360, altura: 640 },
  { largura: 411, altura: 891 },
  { largura: 430, altura: 932 },
  { largura: 768, altura: 1024 },
];
const ESCALAS = [1, 1.3, 1.5, 2];
const COMBINACOES = TELAS.flatMap((t) => ESCALAS.map((e) => ({ ...t, escala: e })));

function definirTela(largura: number, altura: number, escala: number) {
  const medidas = { width: largura, height: altura, scale: 2.625, fontScale: escala };
  Dimensions.set({ window: medidas, screen: medidas });
}

const montadas: ReturnType<typeof create>[] = [];

function montar(elemento: ReactElement) {
  let arvore!: ReturnType<typeof create>;
  act(() => {
    arvore = create(elemento);
  });
  montadas.push(arvore);
  return arvore;
}

// Desmonta antes de mudar o tamanho da janela no teste seguinte (evita atualização fora do act).
afterEach(() => {
  act(() => montadas.splice(0).forEach((a) => a.unmount()));
});

function textos(raiz: ReactTestInstance): string[] {
  return raiz
    .findAll((n) => (n.type as unknown) === 'Text')
    .map((n) => n.children.filter((c) => typeof c === 'string').join(''));
}

function estiloDe(no: ReactTestInstance) {
  return StyleSheet.flatten(no.props.style) ?? {};
}

/** Views reais (não os componentes do React) acima do nó, do mais próximo ao mais distante. */
function ancestraisView(no: ReactTestInstance): ReactTestInstance[] {
  const lista: ReactTestInstance[] = [];
  for (let n = no.parent; n; n = n.parent) {
    if ((n.type as unknown) === 'View') lista.push(n);
  }
  return lista;
}

const produto = { id: 'a', nome: 'Arroz 1 kg', custoAtual: 440, precoVenda: 550, margemDesejada: 25 };
const situacao = situacaoProduto(550, 440, 25);

describe.each(COMBINACOES)('$largura x $altura, fonte $escala', ({ largura, altura, escala }) => {
  beforeEach(() => definirTela(largura, altura, escala));
  const empilhado = empilhar(larguraDoConteudo(largura), escala);

  test('CartaoSituacao: rótulos e valores inteiros, sem limite de linhas', () => {
    const arvore = montar(
      <CartaoSituacao
        titulo="Situação atual"
        precoVenda={550}
        margemDesejada={25}
        situacao={situacao}
        mostrarSugerido
      />,
    );
    const lista = textos(arvore.root);
    expect(lista).toEqual(
      expect.arrayContaining(['Preço de venda', 'Margem (meta 25%)', 'R$\u00a05,50', '20,0%', 'Sugerido: R$\u00a05,87']),
    );
    arvore.root
      .findAll((n) => (n.type as unknown) === 'Text')
      .forEach((n) => {
        expect(n.props.numberOfLines).toBeUndefined();
        expect(n.props.ellipsizeMode).toBeUndefined();
      });
  });

  test('ProdutoCard: preço e margem seguem a regra de disposição', () => {
    const arvore = montar(<ProdutoCard produto={produto} onPress={() => {}} />);
    expect(textos(arvore.root)).toEqual(
      expect.arrayContaining(['Arroz 1 kg', 'Preço', 'Margem (meta 25%)', 'R$\u00a05,50', '20,0%']),
    );
    const rotuloMargem = arvore.root.find(
      (n) => (n.type as unknown) === 'Text' && n.children.join('') === 'Margem (meta 25%)',
    );
    // De dentro para fora: bloco do valor, metade da linha, linha do par. A metade tem flex 1
    // (lado a lado) ou nada (empilhado, linha toda).
    const [, metade, par] = ancestraisView(rotuloMargem);
    expect(estiloDe(metade).flex === 1).toBe(!empilhado);
    expect(estiloDe(par).flexDirection ?? 'column').toBe(empilhado ? 'column' : 'row');
  });
});

describe('CampoMoeda (RN-08, CA-28)', () => {
  beforeEach(() => definirTela(360, 640, 1));

  function campo(valor: string) {
    const onChange = jest.fn();
    const arvore = montar(<CampoMoeda rotulo="Custo" valor={valor} onChange={onChange} />);
    const entrada = arvore.root.findByProps({ accessibilityLabel: 'Custo', placeholder: '0,00' });
    return { arvore, entrada, onChange };
  }

  test('o prefixo "R$" aparece e não encolhe', () => {
    const { arvore } = campo('4');
    const prefixo = arvore.root.find(
      (n) => (n.type as unknown) === 'Text' && n.children.join('') === 'R$',
    );
    expect(estiloDe(prefixo).flexShrink).toBe(0);
  });

  test('ao sair do campo, "4" vira "4,00"', () => {
    const { entrada, onChange } = campo('4');
    act(() => entrada.props.onBlur());
    expect(onChange).toHaveBeenCalledWith('4,00');
  });

  test('ao sair do campo, valor já completo, vazio ou inválido não é alterado', () => {
    for (const valor of ['5,33', '', 'abc']) {
      const { entrada, onChange } = campo(valor);
      act(() => entrada.props.onBlur());
      expect(onChange).not.toHaveBeenCalled();
    }
  });
});

describe('"Como chegamos nisso" (RN-11, CA-31)', () => {
  test('aberto, termina com a nota do escopo do cálculo; fechado, não mostra', () => {
    definirTela(360, 640, 1);
    const arvore = montar(<ComoChegamos blocos={[{ titulo: 'Conta', passos: ['1 + 1 = 2'] }]} />);
    expect(textos(arvore.root)).not.toContain(NOTA_ESCOPO_CALCULO);
    const cabecalho = arvore.root.findByProps({ accessibilityRole: 'button' });
    act(() => cabecalho.props.onPress());
    expect(textos(arvore.root)).toContain(NOTA_ESCOPO_CALCULO);
  });
});
