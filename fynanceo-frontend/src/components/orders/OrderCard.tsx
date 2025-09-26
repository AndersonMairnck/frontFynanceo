// src/components/orders/OrderCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Person, 
  Phone, 
  LocationOn, 
  Schedule,
  AttachMoney,
  Visibility 
} from '@mui/icons-material';
import { DeliveryOrder } from '../../types/delivery';
import StatusBadge from './StatusBadge';

interface OrderCardProps {
  order: DeliveryOrder;
  onViewDetails: (order: DeliveryOrder) => void;
  onStatusChange: (orderId: number, newStatus: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, onStatusChange }) => {
  // Garantir que orderItems existe e é um array
  const orderItems = order.orderItems || [];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={() => onViewDetails(order)}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Cabeçalho com Número do Pedido e Status */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {order.orderNumber}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatTime(order.createdAt)}
            </Typography>
          </Box>
          <StatusBadge status={order.status} />
        </Box>

        {/* Informações do Cliente */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Avatar sx={{ width: 24, height: 24 }}>
            <Person fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {order.customerName || 'Cliente não informado'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Phone fontSize="small" color="action" />
          <Typography variant="body2" color="textSecondary">
            {order.customerPhone || 'Telefone não informado'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }}>
            {order.customerAddress || 'Endereço não informado'}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Itens do Pedido */}
        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight="bold" mb={1}>
            Itens do Pedido:
          </Typography>
          {orderItems.length > 0 ? (
            <>
              {orderItems.slice(0, 3).map((item, index) => (
                <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    {item.quantity}x {item.productName}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(item.totalPrice)}
                  </Typography>
                </Box>
              ))}
              {orderItems.length > 3 && (
                <Typography variant="caption" color="textSecondary">
                  +{orderItems.length - 3} itens...
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="caption" color="textSecondary">
              Nenhum item listado
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Rodapé com Valor e Entregador */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" display="flex" alignItems="center" gap={0.5}>
              <AttachMoney fontSize="small" />
              Total: {formatCurrency(order.orderAmount || 0)}
            </Typography>
            {order.deliveryFee > 0 && (
              <Typography variant="caption" color="textSecondary">
                Taxa: {formatCurrency(order.deliveryFee)}
              </Typography>
            )}
          </Box>
          
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(order);
            }}
            color="primary"
          >
            <Visibility />
          </IconButton>
        </Box>

        {/* Entregador */}
        {order.deliveryPerson && order.deliveryPerson !== 'Não atribuído' && (
          <Box mt={1} p={1} bgcolor="action.hover" borderRadius={1}>
            <Typography variant="caption" fontWeight="medium">
              Entregador: {order.deliveryPerson}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;