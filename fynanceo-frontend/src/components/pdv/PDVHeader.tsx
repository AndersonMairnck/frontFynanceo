import React from 'react';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import { Person, Store, TableRestaurant } from '@mui/icons-material';
import { Customer, Table } from '../../types/order';

interface PDVHeaderProps {
  selectedCustomer: Customer | null;
  selectedTable: Table | null;
  orderType: string;
  onEditCustomer: () => void;
  onEditTable: () => void;
}

const PDVHeader: React.FC<PDVHeaderProps> = ({
  selectedCustomer,
  selectedTable,
  orderType,
  onEditCustomer,
  onEditTable
}) => {
  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'dinein': return 'primary';
      case 'takeaway': return 'secondary';
      case 'delivery': return 'success';
      default: return 'default';
    }
  };

  const getOrderTypeText = (type: string) => {
    switch (type) {
      case 'dinein': return 'Consumo no Local';
      case 'takeaway': return 'Retirada';
      case 'delivery': return 'Delivery';
      default: return type;
    }
  };

  return (
    <Box 
      sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Informações da Venda */}
        <Box display="flex" alignItems="center" gap={3}>
          {/* Tipo de Venda */}
          <Box>
            <Typography variant="caption" color="textSecondary">
              Tipo de Venda
            </Typography>
            <Chip 
              label={getOrderTypeText(orderType)} 
              color={getOrderTypeColor(orderType) as any}
              size="small"
            />
          </Box>

          {/* Cliente */}
          <Box onClick={onEditCustomer} sx={{ cursor: 'pointer' }}>
            <Typography variant="caption" color="textSecondary">
              Cliente
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ width: 32, height: 32 }}>
                <Person />
              </Avatar>
              <Typography variant="body2">
                {selectedCustomer ? selectedCustomer.nome : 'Cliente não identificado'}
              </Typography>
            </Box>
          </Box>

          {/* Mesa (apenas para consumo local) */}
          {orderType === 'dinein' && (
            <Box onClick={onEditTable} sx={{ cursor: 'pointer' }}>
              <Typography variant="caption" color="textSecondary">
                Mesa
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <TableRestaurant />
                <Typography variant="body2">
                  {selectedTable ? `Mesa ${selectedTable.number}` : 'Selecionar Mesa'}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Logo/Nome do Estabelecimento */}
        <Box display="flex" alignItems="center" gap={1}>
          <Store color="primary" />
          <Typography variant="h6" color="primary">
            PDV - Fynanceo
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PDVHeader;