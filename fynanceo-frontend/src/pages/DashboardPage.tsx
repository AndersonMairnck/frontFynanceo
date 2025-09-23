import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  People,
  PointOfSale,
  Inventory,
  TrendingUp,
  TrendingDown,
  ArrowUpward,
  ArrowDownward,
  ShoppingCart,
  AttachMoney
} from '@mui/icons-material';
import { Receipt } from '@mui/icons-material'
const DashboardPage: React.FC = () => {
  // Dados mockados para o dashboard
  const stats = [
    { 
      icon: <People />, 
      label: 'Total Clientes', 
      value: '154', 
      change: '+12%',
      trend: 'up',
      color: '#6366F1',
      progress: 75
    },
    { 
      icon: <AttachMoney />, 
      label: 'Vendas Hoje', 
      value: 'R$ 2.845,00', 
      change: '+8.5%',
      trend: 'up',
      color: '#10B981',
      progress: 60
    },
    { 
      icon: <Inventory />, 
      label: 'Produtos em Estoque', 
      value: '1.247', 
      change: '-3%',
      trend: 'down',
      color: '#F59E0B',
      progress: 45
    },
    { 
      icon: <ShoppingCart />, 
      label: 'Pedidos Pendentes', 
      value: '23', 
      change: '+15%',
      trend: 'up',
      color: '#EF4444',
      progress: 30
    }
  ];

  const recentActivities = [
    { action: 'Novo cliente cadastrado', time: '2 min atrás', user: 'João Silva' },
    { action: 'Venda realizada', time: '15 min atrás', user: 'Maria Santos' },
    { action: 'Produto atualizado', time: '1 hora atrás', user: 'Pedro Costa' },
    { action: 'Pedido entregue', time: '2 horas atrás', user: 'Ana Oliveira' }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Header do Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Visão geral do seu negócio
        </Typography>
      </Box>

      {/* Grid de Estatísticas */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar 
                    sx={{ 
                      bgcolor: `${stat.color}15`, 
                      color: stat.color,
                      width: 48,
                      height: 48
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box display="flex" alignItems="center" sx={{ color: stat.trend === 'up' ? '#10B981' : '#EF4444' }}>
                    {stat.trend === 'up' ? <ArrowUpward sx={{ fontSize: 16 }} /> : <ArrowDownward sx={{ fontSize: 16 }} />}
                    <Typography variant="body2" fontWeight="600" sx={{ ml: 0.5 }}>
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h4" fontWeight="700" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.label}
                </Typography>

                <LinearProgress 
                  variant="determinate" 
                  value={stat.progress} 
                  sx={{ 
                    mt: 2,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: `${stat.color}15`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: stat.color,
                      borderRadius: 3
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Gráfico de Vendas (Placeholder) */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Vendas dos Últimos 7 Dias
            </Typography>
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              height="100%"
              sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
            >
              <Typography color="text.secondary">
                Gráfico de vendas será implementado aqui
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Atividades Recentes */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Atividades Recentes
            </Typography>
            <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
              {recentActivities.map((activity, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    mb: 1, 
                    borderRadius: 2,
                    bgcolor: index === 0 ? 'primary.50' : 'transparent',
                    border: index === 0 ? '1px solid' : 'none',
                    borderColor: 'primary.100'
                  }}
                >
                  <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: 'primary.main' }}>
                    {activity.user.charAt(0)}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="500">
                      {activity.action}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      por {activity.user} • {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Atalhos Rápidos */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Atalhos Rápidos
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  href="/clientes/novo"
                  startIcon={<People />}
                  sx={{ py: 2 }}
                >
                  Novo Cliente
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  href="/pdv"
                  startIcon={<PointOfSale />}
                  sx={{ py: 2 }}
                >
                  Ponto de Venda
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  href="/produtos/novo"
                  startIcon={<Inventory />}
                  sx={{ py: 2 }}
                >
                  Novo Produto
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  href="/vendas"
                  startIcon={<Receipt />}
                  sx={{ py: 2 }}
                >
                  Ver Vendas
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;