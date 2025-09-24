import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip
} from '@mui/material';
import { TableRestaurant, Check, Clear } from '@mui/icons-material';
import { Table } from '../../types/order';

interface TableSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (table: Table | null) => void;
  tables: Table[];
  selectedTable: Table | null;
}

const TableSelector: React.FC<TableSelectorProps> = ({
  open,
  onClose,
  onSelect,
  tables,
  selectedTable
}) => {
  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'error';
      case 'reserved': return 'warning';
      default: return 'default';
    }
  };

  const getTableStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Livre';
      case 'occupied': return 'Ocupada';
      case 'reserved': return 'Reservada';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Selecionar Mesa</Typography>
          <Button onClick={() => onSelect(null)} variant="outlined" size="small">
            Sem Mesa
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          {tables.map((table) => (
            <Grid item xs={6} sm={4} md={3} key={table.id}>
              <Card
                sx={{
                  cursor: table.status === 'available' ? 'pointer' : 'not-allowed',
                  opacity: table.status === 'available' ? 1 : 0.6,
                  border: selectedTable?.id === table.id ? 2 : 1,
                  borderColor: selectedTable?.id === table.id ? 'primary.main' : 'divider',
                  transition: 'all 0.2s',
                  '&:hover': table.status === 'available' ? {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)'
                  } : {}
                }}
                onClick={() => table.status === 'available' && onSelect(table)}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  {/* Ícone e número da mesa */}
                  <TableRestaurant 
                    sx={{ 
                      fontSize: 40, 
                      color: table.status === 'available' ? 'success.main' : 'text.secondary',
                      mb: 1 
                    }} 
                  />
                  
                  <Typography variant="h5" fontWeight="bold">
                    {table.number}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Capacidade: {table.capacity} pessoas
                  </Typography>

                  {/* Status da mesa */}
                  <Chip
                    label={getTableStatusText(table.status)}
                    color={getTableStatusColor(table.status) as any}
                    size="small"
                  />

                  {/* Indicador de seleção */}
                  {selectedTable?.id === table.id && (
                    <Box mt={1}>
                      <Check color="primary" />
                    </Box>
                  )}

                  {/* Mesa ocupada/reservada */}
                  {table.status !== 'available' && (
                    <Box mt={1}>
                      <Clear color="error" />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {tables.length === 0 && (
          <Box textAlign="center" py={4}>
            <TableRestaurant sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Nenhuma mesa cadastrada
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Configure as mesas do estabelecimento
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TableSelector;