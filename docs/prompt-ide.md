# Prompt para o Claude na IDE (Opus 5.5)

Como usar: abra esta pasta na IDE (clone do repositório), abra o Claude Code com o modelo Opus 5.5 e cole o bloco abaixo.

```
Você é o desenvolvedor do projeto neste repositório. Vou aprovar e acompanhar; você executa.

CONTEXTO
Projeto de extensão PEX-MDL-54 (UNINASSAU Olinda): "Controle Simples de Margem de Lucro para o Mercado de Guadalupe", uma mercearia de bairro. O app responde: "dado o custo que paguei hoje, a que preço devo vender para manter a minha margem?". Metodologia: Spec-Driven Development. Os três documentos em specs/ (requirements, design, tasks) estão na v1.0 e eu, como líder, os aprovo ao enviar este prompt. Na sexta-feira apresento ao professor o processo SDD que levou ao protótipo, então o processo precisa ficar visível no histórico do git.

PASSO 0 — LEIA ANTES DE ESCREVER QUALQUER COISA
CLAUDE.md, specs/requirements.md, specs/design.md, specs/tasks.md, docs/adr/*, docs/glossario.md. Se achar contradição, ambiguidade ou erro nas specs (fórmulas, exemplos, números, dependências), liste agora e proponha a correção. Corrija a spec primeiro, em commit separado ("spec: ..."), e só depois siga. Não pergunte nada que as specs já respondam.

PASSO 1 — EXECUTE tasks.md DE T01 A T16, NA ORDEM
- T01: crie o projeto Expo com TypeScript na raiz deste repositório, preservando specs/, docs/, README.md, CLAUDE.md e CONTRIBUTING.md (gere o template numa pasta temporária e mova os arquivos). Use a versão estável mais recente do Expo, compatível com o Expo Go da loja. Configure Jest (jest-expo) lendo os testes de tests/. Estrutura de src/ conforme design.md §7.
- Funções de src/domain: puras, sem React nem AsyncStorage, dinheiro em centavos inteiros. Teste primeiro (TDD): escreva os testes dos critérios de aceite CA-01 a CA-10 aplicáveis e depois a implementação. Cubra também bordas: custo e preço zero, margem desejada 99, margem negativa, arredondamento, variação sem custo anterior.
- Armazenamento: AsyncStorage atrás da interface repositorio; teste com o mock oficial.
- Interface: React Navigation (native stack), telas e componentes do design.md §2 e §3. Visual limpo, botões grandes, fonte legível, cores do semáforo com contraste e também com texto/ícone (não depender só da cor). Teclado numérico nos campos de valor. Campo de moeda aceita "5,33" e "5.33".
- Estado vazio da lista com botão "Carregar exemplos" (T09). Valores de exemplo exatamente como em requirements.md §9.
- Um commit por tarefa, mensagem iniciando com o ID. Marque [x] em tasks.md no mesmo commit. Antes de cada commit: npm test e npx tsc --noEmit sem erro.

PASSO 2 — VERIFIQUE DE VERDADE
- T15: crie tests/checklist-manual.md com os passos de CA-01 a CA-10 na tela. Rode o app (npx expo start) o quanto o ambiente permitir; se não for possível abrir no aparelho, diga claramente o que NÃO foi verificado na tela e deixe a coluna "Resultado" do checklist em branco para eu preencher no Expo Go. Não marque como verificado o que você não executou.
- T16: rode toda a suíte e o tsc; confira item a item o "fora do escopo" (nada de estoque, caixa, login, backend, etc.); atualize o README com: como instalar, como rodar (npm install, npx expo start, abrir no Expo Go), como testar e a estrutura final.
- Gere docs/processo-sdd.md: um quadro curto com, para cada RF e RN, a tarefa que o implementou, o commit (hash) e o teste que o cobre, tirado do git log real.

REGRAS DURANTE TODO O TRABALHO
- Não implemente nada que não esteja em tasks.md. Ideia nova vai para docs/depois.md.
- Se uma decisão técnica não prevista surgir, registre em docs/adr/ADR-00N-....md (modelo em ADR-000) em vez de decidir em silêncio.
- Não invente dados reais do mercado: os produtos de exemplo são ilustrativos e assim devem ficar rotulados.
- Não escreva em nenhum arquivo que alguém da equipe é dono da mercearia.
- Idioma da interface e dos documentos: português do Brasil.
- Ao terminar, responda com: o que foi feito (uma frase por bloco), o que não consegui verificar, comandos para rodar, e perguntas em aberto. Não faça push; eu faço.

COMECE PELO PASSO 0 E ME MOSTRE O RESULTADO DA LEITURA EM POUCAS LINHAS ANTES DE ESCREVER CÓDIGO.
```
