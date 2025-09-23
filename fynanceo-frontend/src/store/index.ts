import { configureStore } from '@reduxjs/toolkit';
import clienteSlice from './slices/clienteSlice';

export const store = configureStore({
  reducer: {
    clientes: clienteSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['register'],
      },
    }),
   devTools: import.meta.env.DEV, // Usar import.meta.env em vez de process.env
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;