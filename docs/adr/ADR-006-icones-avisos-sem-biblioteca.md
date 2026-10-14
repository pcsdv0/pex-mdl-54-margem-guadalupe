# ADR-006 — Ícones com @expo/vector-icons; avisos e confirmação sem biblioteca extra
- **Status:** aceita
- **Contexto:** a v1.2 pede ícones no semáforo, no histórico e nos botões, avisos rápidos depois das ações (RF-14) e confirmação de exclusão. O líder liberou só a biblioteca de ícones. No Expo SDK 57, o `@expo/vector-icons` não vem instalado no projeto por padrão. A confirmação com `Alert.alert` não aparece no navegador e tem aparência diferente em cada sistema.
- **Decisão:**
  - Instalar `@expo/vector-icons` com `npx expo install` (versão compatível com o SDK; já incluída no Expo Go). Usar só o conjunto Ionicons, através do componente `Icone`.
  - Avisos rápidos com um `AvisoProvider` próprio (contexto + `View` posicionada no rodapé + temporizador), sem biblioteca de toast.
  - Confirmação com um `DialogoConfirmacao` próprio, sobre o `Modal` do React Native, no lugar de `Alert.alert`.
- **Consequências:** uma dependência a mais (ícones), sem módulo nativo novo, e o app continua abrindo no Expo Go. Avisos e confirmação têm a mesma aparência em Android, iOS e navegador e seguem o tema (RNF-05). Por outro lado, não usam a aparência nativa do sistema.
- **Atende:** RF-14, RF-16, RNF-06, RNF-10.
