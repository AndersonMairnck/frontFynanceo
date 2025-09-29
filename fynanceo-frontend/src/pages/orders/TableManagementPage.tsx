// src/pages/orders/TableManagementPage.tsx
import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { Restaurant } from '@mui/icons-material';
import TableManagement from '../../components/orders/TableManagement';

const TableManagementPage: React.FC = () => {
  // Definir mesas disponíveis (pode vir de configuração ou API)
  const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Restaurant sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Gestão de Mesas
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Controle de pedidos por mesa - abra novos pedidos e gerencie pagamentos
            </Typography>
          </Box>
        </Box>
      </Paper>

      <TableManagement tables={tables} />
    </Container>
  );
};

export default TableManagementPage;