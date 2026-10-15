# Controle de Margem de Lucro — Mercado de Guadalupe (PEX-MDL-54)

Projeto de extensão da UNINASSAU (Olinda), disciplina Atividades e Práticas Interdisciplinares de Extensão, curso de Sistemas de Informação.
Protótipo mobile (React Native + Expo) feito com a metodologia **Spec-Driven Development (SDD)**, para apresentação na Semana Ubíqua.

**A pergunta que o app responde:** dado o custo que paguei hoje, a que preço devo vender para manter a minha margem?

## Como instalar

Requisitos: [Node.js](https://nodejs.org) 20 ou mais novo (testado com 22) e o app **Expo Go** no celular (Play Store ou App Store).

```bash
npm install
```

## Como rodar

```bash
npx expo start
```

Abra o **Expo Go** no celular e leia o QR code que aparece no terminal (no iPhone, use a câmera). O celular e o computador precisam estar na mesma rede Wi-Fi. Se a rede bloquear, use `npx expo start --tunnel`.

Na primeira vez, toque em **"Carregar exemplos"** para ver 8 produtos com valores ilustrativos (não são preços reais do mercado).

Para voltar ao estado inicial (antes de um ensaio ou da apresentação): toque no **"?"** → **"Apagar todos os dados"** → **"Apagar tudo"**.

## Como testar

```bash
npm test           # testes automáticos das fórmulas, validações e armazenamento
npx tsc --noEmit   # checagem de tipos do TypeScript
```

Teste de tela: siga `tests/checklist-manual.md` no Expo Go e preencha a coluna "Resultado".

## Estrutura

| Pasta | Conteúdo |
| --- | --- |
| `specs/` | `requirements.md`, `design.md` e `tasks.md` (a fonte da verdade do projeto) |
| `docs/` | Glossário, entrevista, `adr/` (decisões de arquitetura), `depois.md` (ideias fora do escopo) e `processo-sdd.md` (requisito → tarefa → commit → teste) |
| `src/domain/` | Regras de cálculo puras, em centavos: `calculos.ts`, `validacao.ts`, `formatacao.ts`, `explicacao.ts` (textos das contas), `lista.ts` (ordem, busca, filtro, resumo) |
| `src/storage/` | `repositorio.ts` (produtos e histórico) e `preferencias.ts` (boas-vindas), no AsyncStorage |
| `src/data/` | `exemplos.ts`: produtos de exemplo (ilustrativos) |
| `src/screens/` | Telas: Lista de produtos, Produto, Nova compra, Resultado, Histórico, Ajuda |
| `src/components/` | Peças da interface: botões, campos, cartões (situação, resposta, boas-vindas), semáforo, ícones, avisos, janela de confirmação, busca e filtro |
| `src/navigation/` | Navegação em pilha |
| `src/theme/` | `tema.ts` (cores, espaços, fontes, raios, sombra, toque mínimo) e `contraste.ts` |
| `tests/` | `domain.test.ts`, `storage.test.ts`, `tema.test.ts` (contraste), `varredura.test.ts` (sem cor/tamanho solto, rótulos), `setup.ts` e `checklist-manual.md` |
| `App.tsx`, `index.ts` | Entrada do app |

## Equipe

- Bruno Vinicius Lira de Almeida
- Carlos Wagner Farias Da Fonseca
- Douglas Lino Da Paz
- Lucy Lopes Carvalho
- Paulo César Santos de Vasconcelos (líder)
- Thomas Eustáquio Pereira da Silva

## Como trabalhamos

Leia o `CONTRIBUTING.md` antes de começar. Resumo: requirements → design → tasks → código, e cada etapa só avança com o aprovado do grupo.
