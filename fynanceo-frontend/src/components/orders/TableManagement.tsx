// src/components/orders/TableManagement.tsx (ATUALIZADO)
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
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Receipt, AttachMoney, Close, Restaurant, Edit } from '@mui/icons-material';
import { useTableManagement } from '../../hooks/useTableManagement';
import { useProducts } from '../../hooks/useProducts';
import { Order } from '../../types/order';
import OrderItemsModal from './OrderItemsModal';

interface TableManagementProps {
  tables: number[];
}

const TableManagement: React.FC<TableManagementProps> = ({ tables }) => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [itemsModal, setItemsModal] = useState<{ open: boolean; order: Order | null }>({ 
    open: false, 
    order: null 
  });
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; order: Order | null }>({ 
    open: false, 
    order: null 
  });
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Hooks para API real
  const {
    tableOrders,
    loading,
    error,
    loadTableOrders,
    createOrder,
    addItemsToOrder,
    processPayment,
    clearError
  } = useTableManagement();

  const { products, carregarProducts } = useProducts();

  // Carregar produtos e pedidos iniciais
  useEffect(() => {
    carregarProducts(true);
    tables.forEach(table => {
      loadTableOrders(table);
    });
  }, [carregarProducts, loadTableOrders, tables]);

  // Criar novo pedido para mesa
  const handleCreateOrder = async (tableNumber: number) => {
    try {
      const newOrder = await createOrder(tableNumber, 'Mesa');
      
      // Abrir modal automaticamente
      setItemsModal({ open: true, order: newOrder });
      
      setSnackbar({
        open: true,
        message: `Novo pedido criado para Mesa ${tableNumber}`,
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erro ao criar pedido',
        severity: 'error'
      });
    }
  };

  // Atualizar pedido quando itens forem modificados
  const handleOrderUpdated = (updatedOrder: Order) => {
    if (updatedOrder.tableNumber) {
      loadTableOrders(updatedOrder.tableNumber);
    }
  };

  // Processar pagamento
  const handleProcessPayment = async (order: Order) => {
    try {
      await processPayment(order.id, paymentMethod, order.totalAmount);
      
      setPaymentDialog({ open: false, order: null });
      setSnackbar({
        open: true,
        message: `Pagamento processado para pedido ${order.orderNumber}`,
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erro ao processar pagamento',
        severity: 'error'
      });
    }
  };

  // Funções auxiliares para status
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'Aberto': return 'warning';
      case 'EmAndamento': return 'info';
      case 'AguardandoPagamento': return 'secondary';
      case 'Finalizado': return 'success';
      case 'Cancelado': return 'error';
      default: return 'default';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'Aberto': return 'Aberto';
      case 'EmAndamento': return 'Em Andamento';
      case 'AguardandoPagamento': return 'Aguardando Pagamento';
      case 'Finalizado': return 'Finalizado';
      case 'Cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
    clearError();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Restaurant />
        Gestão de Mesas
      </Typography>

      <Grid container spacing={2}>
        {tables.map(tableNumber => {
          const tableOrdersList = tableOrders[tableNumber] || [];
          const activeOrders = tableOrdersList.filter(order => 
            order.status !== 'Finalizado' && order.status !== 'Cancelado'
          );
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tableNumber}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedTable === tableNumber ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => setSelectedTable(tableNumber)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      Mesa {tableNumber}
                    </Typography>
                    <Chip 
                      label={activeOrders.length}
                      color={activeOrders.length > 0 ? "primary" : "default"}
                      size="small"
                    />
                  </Box>

                  {/* Pedidos ativos da mesa */}
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {activeOrders.length > 0 ? (
                      activeOrders.map(order => (
                        <Box 
                          key={order.id} 
                          sx={{ 
                            mb: 1, 
                            p: 1, 
                            bgcolor: 'grey.50', 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200'
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="start" mb={0.5}>
                            <Typography variant="body2" fontWeight="medium" noWrap sx={{ flex: 1 }}>
                              {order.orderNumber}
                            </Typography>
                            <Chip 
                              label={getOrderStatusText(order.status)}
                              color={getOrderStatusColor(order.status) as any}
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="caption" display="block">
                            R$ {order.totalAmount.toFixed(2)} • {order.items?.length || 0} itens
                          </Typography>
                          
                          {/* Lista rápida de itens */}
                          {order.items && order.items.length > 0 && (
                            <Box mt={0.5}>
                              {order.items.slice(0, 2).map((item, index) => (
                                <Typography key={index} variant="caption" display="block" color="textSecondary">
                                  • {item.quantity}x {item.productName || `Produto ${item.productId}`}
                                </Typography>
                              ))}
                              {order.items.length > 2 && (
                                <Typography variant="caption" color="textSecondary">
                                  • +{order.items.length - 2} itens...
                                </Typography>
                              )}
                            </Box>
                          )}

                          <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                            <Button 
                              size="small" 
                              startIcon={<Edit />}
                              variant="outlined"
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemsModal({ open: true, order });
                              }}
                            >
                              Itens
                            </Button>
                            
                            <Button 
                              size="small" 
                              startIcon={<AttachMoney />}
                              variant="contained"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPaymentDialog({ open: true, order });
                              }}
                              color="success"
                              disabled={order.totalAmount === 0}
                            >
                              Pagar
                            </Button>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                        Nenhum pedido ativo
                      </Typography>
                    )}
                  </Box>

                  <Button
                    fullWidth
                    startIcon={<Add />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateOrder(tableNumber);
                    }}
                    sx={{ mt: 1 }}
                    disabled={loading}
                    variant="outlined"
                  >
                    {loading ? 'Criando...' : 'Novo Pedido'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal de Gerenciamento de Itens */}
      <OrderItemsModal
        open={itemsModal.open}
        order={itemsModal.order}
        onClose={() => setItemsModal({ open: false, order: null })}
        onOrderUpdated={handleOrderUpdated}
      />

      {/* Dialog de Pagamento */}
      <Dialog 
        open={paymentDialog.open} 
        onClose={() => setPaymentDialog({ open: false, order: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            Processar Pagamento
            <IconButton
              onClick={() => setPaymentDialog({ open: false, order: null })}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {paymentDialog.order && (
            <Box>
              <Typography variant="body1" gutterBottom fontWeight="medium">
                Pedido: {paymentDialog.order.orderNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Mesa: {paymentDialog.order.tableNumber}
              </Typography>
              <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                Total: R$ {paymentDialog.order.totalAmount.toFixed(2)}
              </Typography>
              <TextField
                select
                label="Forma de Pagamento"
                fullWidth
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ mt: 2 }}
              >
                <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                <MenuItem value="Cartão Débito">Cartão Débito</MenuItem>
                <MenuItem value="Cartão Crédito">Cartão Crédito</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
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
            startIcon={<AttachMoney />}
          >
            Confirmar Pagamento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Snackbar para erros da API */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TableManagement;