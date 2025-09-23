import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import {
  Refresh,
  Home,
  BugReport
} from '@mui/icons-material';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportError = () => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    console.error('Error Report:', errorDetails);
    // Aqui você pode enviar para um serviço de logging
    alert('Erro reportado para a equipe de desenvolvimento.');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <BugReport color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom color="error">
            Oops! Algo deu errado
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Desculpe pelo inconveniente. Um erro inesperado ocorreu.
          </Typography>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detalhes do Erro
            </Typography>
            <Alert severity="error" sx={{ textAlign: 'left' }}>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {error.message}
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={resetErrorBoundary}
            size="large"
          >
            Tentar Novamente
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={handleGoHome}
            size="large"
          >
            Página Inicial
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleReload}
            size="large"
          >
            Recarregar Página
          </Button>
          
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="text"
              onClick={handleReportError}
              size="large"
            >
              Reportar Erro
            </Button>
          )}
        </Box>

        {/* Stack trace apenas em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && error.stack && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stack Trace (Desenvolvimento)
              </Typography>
              <Box 
                component="pre" 
                sx={{ 
                  p: 2, 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: '300px',
                  fontSize: '12px'
                }}
              >
                {error.stack}
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};