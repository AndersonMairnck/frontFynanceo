// src/components/APIConnectionTest.tsx
import React, { useState, useEffect } from 'react';
import { Button, Alert, Box, CircularProgress } from '@mui/material';
import { checkAPIHealth } from '../config/api';

export const APIConnectionTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const testConnection = async () => {
    setIsTesting(true);
    const connected = await checkAPIHealth();
    setIsConnected(connected);
    setIsTesting(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Box sx={{ mb: 2 }}>
      {isTesting ? (
        <Alert severity="info">
          <Box display="flex" alignItems="center">
            <CircularProgress size={20} sx={{ mr: 2 }} />
            Testando conexão com a API...
          </Box>
        </Alert>
      ) : isConnected === true ? (
        <Alert severity="success">
          ✅ Conexão com a API estabelecida com sucesso!
        </Alert>
      ) : isConnected === false ? (
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={testConnection}>
              Tentar Novamente
            </Button>
          }
        >
          ❌ Não foi possível conectar com a API. Verifique:
          <ul>
            <li>A API está rodando?</li>
            <li>A URL está correta?</li>
            <li>O CORS está configurado?</li>
          </ul>
        </Alert>
      ) : null}
    </Box>
  );
};