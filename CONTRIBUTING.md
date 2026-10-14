# Como contribuir

## Portões do SDD (nada de código do produto antes do tasks.md aprovado)
1. `specs/requirements.md` aprovado pelo grupo
2. `specs/design.md` aprovado pelo grupo
3. `specs/tasks.md` aprovado pelo grupo
4. Só então: código em `src/`

Antes do portão 3, é permitido preparar o ambiente (Expo, Snack, estrutura de pastas), sem escrever código do produto.

## Regras
- Uma branch por tarefa, com o código da tarefa no nome (ex.: `t03-calculo-margem`). Nada direto na `main`.
- Pull request pequeno; quem faz a lógica revisa a interface e vice-versa.
- Cada tarefa do `tasks.md` aponta para uma regra do `requirements.md` ou uma tela do `design.md`.
- Mudou requisito? Atualize o `requirements.md` primeiro e avise se afeta `design.md` ou `tasks.md`.
- Ideia nova vai para a lista de depois (`docs/depois.md`), não para o escopo.
- Reunião fixa de 15 minutos por dia.
- Depois do ensaio final, ninguém mexe no código.
