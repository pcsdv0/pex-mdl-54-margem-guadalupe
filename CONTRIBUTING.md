# Como contribuir

## Portões do SDD (nada de código do produto antes do tasks.md aprovado)
1. `specs/requirements.md` aprovado pelo líder
2. `specs/design.md` aprovado pelo líder
3. `specs/tasks.md` aprovado pelo líder
4. Só então: código em `src/`

Antes do portão 3, é permitido preparar o ambiente (Expo, Snack, estrutura de pastas), sem escrever código do produto.

## Regras
- Um commit por tarefa, com o ID no início da mensagem (ex.: `T04: calcular preço sugerido`). Branch `main` apenas, sem trabalho paralelo no código.
- Cada tarefa do `tasks.md` aponta para uma regra do `requirements.md` ou uma tela do `design.md`.
- Mudou requisito? Atualize o `requirements.md` primeiro e avise se afeta `design.md` ou `tasks.md`.
- Ideia nova vai para a lista de depois (`docs/depois.md`), não para o escopo.
- Reunião fixa de 15 minutos por dia.
- Depois do ensaio final, ninguém mexe no código.
