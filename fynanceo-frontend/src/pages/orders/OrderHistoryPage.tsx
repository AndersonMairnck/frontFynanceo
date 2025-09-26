// src/pages/orders/OrderHistoryPage.tsx
import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { History } from '@mui/icons-material';

const OrderHistoryPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <History fontSize="large" color="primary" />
        <Typography variant="h4" fontWeight="bold">
          Histórico de Pedidos
        </Typography>
      </Box>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Página em Desenvolvimento
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Esta página será implementada em breve. 
          Por enquanto, utilize a página principal de Pedidos.
        </Typography>
      </Paper>
    </Container>
  );
};

export default OrderHistoryPage;