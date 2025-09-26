// src/pages/orders/OrdersPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  LocalShipping, 
  AccessTime, 
  CheckCircle, 
  TrendingUp 
} from '@mui/icons-material';

// Components
import OrderGrid from '../../components/orders/OrderGrid';
import OrderFilters from '../../components/orders/OrderFilters';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';

// Hooks
import { useOrders } from '../../hooks/useOrders';
import { DeliveryOrder, DeliveryFilters } from '../../types/delivery';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    orders,
    activeOrders,
    stats,
    loading,
    error,
    filters,
    loadOrders,
    loadActiveOrders,
    updateFilters,
    updateOrderStatus,
    assignDeliveryPerson,
    clearError
  } = useOrders();

  // Dados da tab atual
  const currentOrders = activeTab === 0 ? activeOrders : orders;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewDetails = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  // CORREÇÃO: Função deve retornar Promise<boolean>
  const handleStatusChange = async (orderId: number, newStatus: string, notes?: string): Promise<boolean> => {
    try {
      const success = await updateOrderStatus(orderId, newStatus, notes);
      
      if (success) {
        // Recarregar listas se necessário
        if (activeTab === 0) {
          loadActiveOrders();
        } else {
          loadOrders();
        }
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return false;
    }
  };

  const handleAssignDeliveryPerson = async (orderId: number, deliveryPerson: string): Promise<boolean> => {
    try {
      const success = await assignDeliveryPerson(orderId, deliveryPerson);
      return success;
    } catch (error) {
      console.error('Erro ao atribuir entregador:', error);
      return false;
    }
  };

  const handleFiltersChange = (newFilters: DeliveryFilters) => {
    updateFilters(newFilters);
  };

  const handleClearFilters = () => {
    updateFilters({});
  };

  // Atualizar dados a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 0) {
        loadActiveOrders();
      } else {
        loadOrders();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab, loadOrders, loadActiveOrders]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Cabeçalho com Estatísticas */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Gestão de Pedidos
        </Typography>
        
        {stats && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <LocalShipping color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  {stats.totalDeliveries}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total de Entregas
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <AccessTime color="warning" />
                <Typography variant="h6" fontWeight="bold">
                  {stats.pendingDeliveries}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pendentes
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <TrendingUp color="info" />
                <Typography variant="h6" fontWeight="bold">
                  {stats.inProgressDeliveries}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Em Andamento
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <CheckCircle color="success" />
                <Typography variant="h6" fontWeight="bold">
                  {stats.completedDeliveries}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Concluídas
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {Math.round(stats.averageDeliveryTime)}min
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tempo Médio
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime />
                Pedidos Ativos
                {activeOrders.length > 0 && (
                  <Chip label={activeOrders.length} size="small" color="primary" />
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <LocalShipping />
                Todos os Pedidos
                {orders.length > 0 && (
                  <Chip label={orders.length} size="small" />
                )}
              </Box>
            } 
          />
        </Tabs>

        {/* Filtros (apenas na tab de todos os pedidos) */}
        <TabPanel value={activeTab} index={1}>
          <OrderFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </TabPanel>

        {/* Conteúdo das Tabs */}
        <TabPanel value={activeTab} index={0}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <OrderGrid
              orders={activeOrders}
              loading={loading}
              error={error}
              onViewDetails={handleViewDetails}
              onStatusChange={(orderId, newStatus) => handleStatusChange(orderId, newStatus)}
            />
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <OrderGrid
              orders={orders}
              loading={loading}
              error={error}
              onViewDetails={handleViewDetails}
              onStatusChange={(orderId, newStatus) => handleStatusChange(orderId, newStatus)}
            />
          )}
        </TabPanel>
      </Paper>

      {/* Modal de Detalhes */}
      <OrderDetailsModal
        open={modalOpen}
        order={selectedOrder}
        onClose={() => setModalOpen(false)}
        onStatusChange={handleStatusChange} // Agora retorna Promise<boolean>
      />

      {/* Notificação de Erro */}
      {error && (
        <Alert 
          severity="error" 
          onClose={clearError}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
        >
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default OrdersPage;