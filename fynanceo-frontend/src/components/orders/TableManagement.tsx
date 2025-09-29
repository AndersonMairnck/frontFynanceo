// src/components/orders/TableManagement.tsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton
} from '@mui/material';
import { Add, Receipt, AttachMoney, Close } from '@mui/icons-material';
import { tableService } from '../../services/tableService';

import { Order } from '../../types/order'; 

interface TableManagementProps {
  tables: number[]; // [1, 2, 3, 4, 5, ...]
}

const TableManagement: React.FC<TableManagementProps> = ({ tables }) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tableOrders, setTableOrders] = useState<{ [key: number]: Order[] }>({});
  const [createOrderDialog, setCreateOrderDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; order: Order | null }>({ 
    open: false, 
    order: null 
  });

  // Carregar pedidos das mesas
  const loadTableOrders = async (tableNumber: number) => {
    try {
      const orders = await tableService.getOrdersByTable(tableNumber);
      setTableOrders(prev => ({
        ...prev,
        [tableNumber]: orders
      }));
    } catch (error) {
      console.error(`Erro ao carregar pedidos da mesa ${tableNumber}:`, error);
    }
  };

  // Criar novo pedido para mesa
  const handleCreateOrder = async (tableNumber: number) => {
    try {
      await tableService.createOrderWithoutPayment({
        tableNumber,
        orderType: 'Mesa'
      });
      await loadTableOrders(tableNumber);
      setCreateOrderDialog(false);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  };

  // Processar pagamento
  const handleProcessPayment = async (order: Order) => {
    try {
      await tableService.processPayment({
        orderId: order.id,
        paymentMethod: 'Dinheiro',
        amount: order.totalAmount
      });
      setPaymentDialog({ open: false, order: null });
      if (order.tableNumber) {
        await loadTableOrders(order.tableNumber);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Gestão de Mesas
      </Typography>

      <Grid container spacing={2}>
        {tables.map(tableNumber => (
          <Grid item xs={12} sm={6} md={4} key={tableNumber}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedTable === tableNumber ? '2px solid #1976d2' : '1px solid #e0e0e0'
              }}
              onClick={() => setSelectedTable(tableNumber)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold">
                    Mesa {tableNumber}
                  </Typography>
                  <Chip 
                    label={
                      tableOrders[tableNumber]?.filter(o => 
                        o.status !== 'Finalizado' && o.status !== 'Cancelado'
                      ).length || 0
                    } 
                    color="primary" 
                  />
                </Box>

                {/* Pedidos ativos da mesa */}
                <Box mt={1}>
                  {tableOrders[tableNumber]?.filter(order => 
                    order.status !== 'Finalizado' && order.status !== 'Cancelado'
                  ).map(order => (
                    <Box key={order.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {order.orderNumber}
                      </Typography>
                      <Typography variant="caption">
                        R$ {order.totalAmount.toFixed(2)} • {order.items.length} itens
                      </Typography>
                      <Box display="flex" gap={1} mt={0.5}>
                        <Button 
                          size="small" 
                          startIcon={<Receipt />}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Abrir modal para adicionar itens
                          }}
                        >
                          Itens
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<AttachMoney />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaymentDialog({ open: true, order });
                          }}
                          color="success"
                        >
                          Pagar
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Button
                  fullWidth
                  startIcon={<Add />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateOrder(tableNumber);
                  }}
                  sx={{ mt: 1 }}
                >
                  Novo Pedido
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog de Pagamento */}
      <Dialog 
        open={paymentDialog.open} 
        onClose={() => setPaymentDialog({ open: false, order: null })}
      >
        <DialogTitle>
          Processar Pagamento
          <IconButton
            onClick={() => setPaymentDialog({ open: false, order: null })}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {paymentDialog.order && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Pedido: {paymentDialog.order.orderNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Total: R$ {paymentDialog.order.totalAmount.toFixed(2)}
              </Typography>
              <TextField
                select
                label="Forma de Pagamento"
                fullWidth
                sx={{ mt: 2 }}
                defaultValue="Dinheiro"
              >
                <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                <MenuItem value="Cartão">Cartão</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialog({ open: false, order: null })}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={() => paymentDialog.order && handleProcessPayment(paymentDialog.order)}
            color="success"
          >
            Confirmar Pagamento
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableManagement;