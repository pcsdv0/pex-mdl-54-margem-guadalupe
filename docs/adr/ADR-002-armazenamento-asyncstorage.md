# ADR-002 — Dados no aparelho com AsyncStorage
- **Status:** aceita
- **Contexto:** o MVP não tem backend nem login (fora do escopo) e precisa guardar dados ao fechar o app.
- **Decisão:** `@react-native-async-storage/async-storage`, uma chave por coleção, atrás de uma interface `repositorio`.
- **Consequências:** funciona offline e é simples; os dados ficam só naquele aparelho, sem sincronização nem backup. A interface permite trocar por outro armazenamento depois, sem mexer nas telas.
- **Atende:** RF-07, RNF-01.
