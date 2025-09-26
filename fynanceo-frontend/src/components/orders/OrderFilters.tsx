// src/components/orders/OrderFilters.tsx
import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Clear,
  Today 
} from '@mui/icons-material';
import { DeliveryFilters } from '../../types/delivery';

interface OrderFiltersProps {
  filters: DeliveryFilters;
  onFiltersChange: (filters: DeliveryFilters) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'Pendente', label: 'Pendente' },
  { value: 'EmPreparo', label: 'Em Preparo' },
  { value: 'EmRota', label: 'Em Rota' },
  { value: 'SaiuParaEntrega', label: 'Saiu para Entrega' },
  { value: 'Entregue', label: 'Entregue' },
  { value: 'Cancelado', label: 'Cancelado' }
];

const typeOptions = [
  { value: '', label: 'Todos os tipos' },
  { value: 'Delivery', label: 'Delivery' },
  { value: 'Retirada', label: 'Retirada' },
  { value: 'ConsumoLocal', label: 'Consumo Local' }
];

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const handleFilterChange = (key: keyof DeliveryFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <FilterList color="primary" />
        <Typography variant="h6">Filtros</Typography>
        {hasActiveFilters && (
          <Button
            startIcon={<Clear />}
            onClick={onClearFilters}
            size="small"
            color="error"
          >
            Limpar Filtros
          </Button>
        )}
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap">
        {/* Filtro por Status */}
        <TextField
          select
          label="Status"
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          {statusOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Filtro por Tipo */}
        <TextField
          select
          label="Tipo de Entrega"
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
          sx={{ minWidth: 150 }}
          size="small"
        >
          {typeOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Filtro por Data */}
        <TextField
          type="date"
          label="Data"
          value={filters.date ? filters.date.toISOString().split('T')[0] : ''}
          onChange={(e) => handleFilterChange('date', e.target.value ? new Date(e.target.value) : undefined)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />

        {/* Filtro por Entregador */}
        <TextField
          label="Entregador"
          value={filters.deliveryPerson || ''}
          onChange={(e) => handleFilterChange('deliveryPerson', e.target.value || undefined)}
          placeholder="Nome do entregador"
          size="small"
        />
      </Box>
    </Paper>
  );
};

export default OrderFilters;