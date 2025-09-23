import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configuração global para testes
configure({
  testIdAttribute: 'data-testid',
});

// // Mock do console.error para evitar poluição nos testes
// const originalError = console.error;
// beforeAll(() => {
//   console.error = (...args) => {
//     if (/Warning.*not wrapped in act/.test(args[0])) {
//       return;
//     }
//     originalError.call(console, ...args);
//   };
// });

// afterAll(() => {
//   console.error = originalError;
// });