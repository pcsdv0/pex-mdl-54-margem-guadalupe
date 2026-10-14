# ADR-001 — React Native + Expo + TypeScript
- **Status:** aceita
- **Contexto:** o projeto exige um aplicativo mobile prototipado com SDD, rodando no celular durante a Semana Ubíqua e com prazo curto.
- **Decisão:** React Native com Expo (fluxo gerenciado) e TypeScript. Execução pelo Expo Go, sem build nativo.
- **Consequências:** ganha-se rapidez e teste direto no celular por QR code; perde-se acesso a módulos nativos fora do Expo, o que não é necessário no MVP. TypeScript reduz erros nas fórmulas.
- **Atende:** RNF-01, RNF-04.
