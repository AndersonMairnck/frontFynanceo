// src/components/orders/OrderDetailsModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  TextField,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Close,
  Person,
  Phone,
  LocationOn,
  AttachMoney,
  Edit,
  Check
} from '@mui/icons-material';
import { DeliveryOrder } from '../../types/delivery';
import StatusBadge from './StatusBadge';

interface OrderDetailsModalProps {
  open: boolean;
  order: DeliveryOrder | null;
  onClose: () => void;
  onStatusChange: (orderId: number, newStatus: string, notes?: string) => Promise<boolean>;
}

const statusSteps = [
  { label: 'Pendente', status: 'Pendente' },
  { label: 'Em Preparo', status: 'EmPreparo' },
  { label: 'Saiu para Entrega', status: 'SaiuParaEntrega' },
  { label: 'Entregue', status: 'Entregue' }
];

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  order,
  onClose,
  onStatusChange
}) => {
  const [editingDeliveryPerson, setEditingDeliveryPerson] = useState(false);
  const [deliveryPerson, setDeliveryPerson] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  if (!order) return null;

  // Garantir que orderItems existe
  const orderItems = order.orderItems || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'Não informado';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getActiveStep = () => {
    switch (order.status) {
      case 'Pendente': return 0;
      case 'EmPreparo': return 1;
      case 'SaiuParaEntrega': return 2;
      case 'Entregue': return 3;
      default: return 0;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const success = await onStatusChange(order.id, newStatus, notes);
      
      if (success) {
        setSnackbar({
          open: true,
          message: `Status atualizado para: ${statusSteps.find(step => step.status === newStatus)?.label || newStatus}`,
          severity: 'success'
        });
        setNotes('');
      } else {
        setSnackbar({
          open: true,
          message: 'Erro ao atualizar status',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar status',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryPersonSave = () => {
    // Aqui você implementaria a lógica real de salvar o entregador
    setEditingDeliveryPerson(false);
    setSnackbar({
      open: true,
      message: 'Entregador atualizado com sucesso',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Detalhes do Pedido
            </Typography>
            <IconButton onClick={onClose} size="small" disabled={loading}>
              <Close />
            </IconButton>
          </Box>
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            {order.orderNumber}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Criado em: {formatDateTime(order.createdAt)}
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Coluna 1: Informações do Pedido */}
            <Grid item xs={12} md={6}>
              {/* Status e Andamento */}
              <Box mb={3}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <StatusBadge status={order.status} />
                  <Typography variant="body2" color="textSecondary">
                    Status atual
                  </Typography>
                </Box>

                <Stepper activeStep={getActiveStep()} orientation="vertical">
                  {statusSteps.map((step, index) => (
                    <Step key={step.status}>
                      <StepLabel>
                        <Typography variant="body2" fontWeight="medium">
                          {step.label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleStatusChange(step.status)}
                          disabled={getActiveStep() >= index || loading}
                        >
                          {getActiveStep() >= index ? 'Concluído' : `Marcar como ${step.label}`}
                        </Button>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Informações do Cliente */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Informações do Cliente
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="body1" fontWeight="medium">
                    {order.customerName || 'Cliente não informado'}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">
                    {order.customerPhone || 'Telefone não informado'}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="flex-start" gap={1}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2">
                    {order.customerAddress || 'Endereço não informado'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Coluna 2: Detalhes da Entrega e Itens */}
            <Grid item xs={12} md={6}>
              {/* Informações de Entrega */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Informações de Entrega
                </Typography>
                
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight="medium">
                      Entregador:
                    </Typography>
                    {editingDeliveryPerson ? (
                      <Box display="flex" gap={1}>
                        <TextField
                          size="small"
                          value={deliveryPerson}
                          onChange={(e) => setDeliveryPerson(e.target.value)}
                          placeholder="Nome do entregador"
                        />
                        <IconButton 
                          size="small" 
                          onClick={handleDeliveryPersonSave}
                          disabled={loading}
                        >
                          <Check />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {order.deliveryPerson || 'Não atribuído'}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setDeliveryPerson(order.deliveryPerson || '');
                            setEditingDeliveryPerson(true);
                          }}
                          disabled={loading}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  {order.estimatedDeliveryTime && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" fontWeight="medium">
                        Previsão de entrega:
                      </Typography>
                      <Typography variant="body2">
                        {formatDateTime(order.estimatedDeliveryTime)}
                      </Typography>
                    </Box>
                  )}

                  {order.actualDeliveryTime && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" fontWeight="medium">
                        Entregue em:
                      </Typography>
                      <Typography variant="body2">
                        {formatDateTime(order.actualDeliveryTime)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Itens do Pedido */}
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Itens do Pedido {orderItems.length > 0 && `(${orderItems.length})`}
                </Typography>
                {orderItems.length > 0 ? (
                  <>
                    <List dense>
                      {orderItems.map((item, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" fontWeight="medium">
                                  {item.quantity}x {item.productName}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                  {formatCurrency(item.totalPrice)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="textSecondary">
                                Unitário: {formatCurrency(item.unitPrice)}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body1" fontWeight="bold">
                        Total:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {formatCurrency(order.orderAmount || 0)}
                      </Typography>
                    </Box>

                    {order.deliveryFee > 0 && (
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">
                          Taxa de entrega:
                        </Typography>
                        <Typography variant="body2">
                          {formatCurrency(order.deliveryFee)}
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary" fontStyle="italic">
                    Nenhum item encontrado neste pedido.
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Observações */}
          <Box mt={2}>
            <Typography variant="h6" gutterBottom>
              Observações
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre o pedido..."
              variant="outlined"
              disabled={loading}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Fechar
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleStatusChange('Cancelado')}
            color="error"
            disabled={loading || order.status === 'Cancelado'}
          >
            {order.status === 'Cancelado' ? 'Pedido Cancelado' : 'Cancelar Pedido'}
          </Button>
          {order.status !== 'Entregue' && order.status !== 'Cancelado' && (
            <Button 
              variant="contained" 
              onClick={() => {
                const nextStatus = statusSteps[getActiveStep() + 1]?.status;
                if (nextStatus) {
                  handleStatusChange(nextStatus);
                }
              }}
              disabled={loading}
            >
              Próximo Status
            </Button>
          )}
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
    </>
  );
};

export default OrderDetailsModal;