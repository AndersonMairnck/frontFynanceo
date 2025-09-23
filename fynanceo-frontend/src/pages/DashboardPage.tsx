import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button // Adicionar esta importação
} from '@mui/material';
import {
  People,
  PointOfSale,
  Inventory,
  TrendingUp
} from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  const stats = [
    { icon: <People />, label: 'Total Clientes', value: '154', color: '#1976d2' },
    { icon: <PointOfSale />, label: 'Vendas Hoje', value: 'R$ 2.845,00', color: '#2e7d32' },
    { icon: <Inventory />, label: 'Produtos em Estoque', value: '1.247', color: '#ed6c02' },
    { icon: <TrendingUp />, label: 'Crescimento', value: '+12.5%', color: '#9c27b0' }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Estatísticas */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box 
                    sx={{ 
                      bgcolor: stat.color, 
                      color: 'white', 
                      p: 1, 
                      borderRadius: 1 
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Conteúdo principal */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Visão Geral
            </Typography>
            <Typography color="text.secondary">
              Bem-vindo ao Fynanceo ERP. Aqui você pode gerenciar todas as operações do seu negócio.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Atalhos Rápidos
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Button variant="outlined" href="/clientes/novo">
                Novo Cliente
              </Button>
              <Button variant="outlined" href="/pdv">
                Ponto de Venda
              </Button>
              <Button variant="outlined" href="/produtos/novo">
                Novo Produto
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;