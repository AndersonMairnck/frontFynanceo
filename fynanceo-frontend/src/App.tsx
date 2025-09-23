import React from 'react';
import { SnackbarProvider } from 'notistack';
import MainLayout from './components/layout/MainLayout';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
      >
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </SnackbarProvider>
    </ErrorBoundary>
  );
};

export default App;