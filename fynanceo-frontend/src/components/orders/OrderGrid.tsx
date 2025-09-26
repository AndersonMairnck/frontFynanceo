// src/components/orders/OrderGrid.tsx
import React from 'react';
import { Grid, Box, Typography, Alert } from '@mui/material';
import { DeliveryOrder } from '../../types/delivery';
import OrderCard from './OrderCard';

interface OrderGridProps {
  orders: DeliveryOrder[];
  loading: boolean;
  error: string | null;
  onViewDetails: (order: DeliveryOrder) => void;
  onStatusChange: (orderId: number, newStatus: string) => void; // Removido o retorno Promise
}

const OrderGrid: React.FC<OrderGridProps> = ({
  orders,
  loading,
  error,
  onViewDetails,
  onStatusChange
}) => {
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!loading && orders.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary">
          Nenhum pedido encontrado
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Tente alterar os filtros de busca
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order.id}>
            <OrderCard
              order={order}
              onViewDetails={onViewDetails}
              onStatusChange={onStatusChange}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OrderGrid;