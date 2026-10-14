// Mock oficial do AsyncStorage para os testes (ADR-002).
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
