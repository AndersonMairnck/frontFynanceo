import React from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material'; // Adicionar Button

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = "Esta funcionalidade está em desenvolvimento." 
}) => {
  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          🚧 Em Desenvolvimento
        </Typography>
        <Typography color="text.secondary">
          {description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            href="/dashboard"
            sx={{ mr: 1 }}
          >
            Voltar ao Dashboard
          </Button>
          <Button 
            variant="outlined" 
            href="/clientes"
          >
            Ir para Clientes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PlaceholderPage;