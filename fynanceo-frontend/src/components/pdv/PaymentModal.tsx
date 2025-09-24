import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Divider
} from '@mui/material';
import {
  AttachMoney,
  CreditCard,
  Pix,
  Receipt
} from '@mui/icons-material';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string, amountReceived?: number) => void;
  total: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onConfirm,
  total
}) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const paymentMethods = [
    { id: 'Dinheiro', name: 'Dinheiro', icon: AttachMoney, color: 'success' },
    { id: 'CartaoDebito', name: 'Cartão Débito', icon: CreditCard, color: 'primary' },
    { id: 'CartaoCredito', name: 'Cartão Crédito', icon: CreditCard, color: 'secondary' },
    { id: 'Pix', name: 'PIX', icon: Pix, color: 'info' }
  ];

  const calculateChange = () => {
    if (selectedMethod === 'Dinheiro' && amountReceived) {
      const received = parseFloat(amountReceived);
      return Math.max(0, received - total);
    }
    return 0;
  };

  const handleConfirm = () => {
    if (!selectedMethod) return;

    let finalAmount: number | undefined;
    if (selectedMethod === 'Dinheiro') {
      finalAmount = customAmount ? parseFloat(customAmount) : parseFloat(amountReceived);
    }

    onConfirm(selectedMethod, finalAmount);
    // Resetar estado
    setSelectedMethod('');
    setAmountReceived('');
    setCustomAmount('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const change = calculateChange();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <AttachMoney color="primary" />
          <Typography variant="h6">Finalizar Pagamento</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Resumo do Pedido */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumo do Pedido
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Total a Pagar:</Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {formatCurrency(total)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Seleção de Método de Pagamento */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Método de Pagamento
            </Typography>
            <Grid container spacing={2}>
              {paymentMethods.map((method) => (
                <Grid item xs={6} key={method.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedMethod === method.id ? 2 : 1,
                      borderColor: selectedMethod === method.id ? `${method.color}.main` : 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: `${method.color}.main`
                      }
                    }}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <method.icon sx={{ fontSize: 32, color: `${method.color}.main`, mb: 1 }} />
                      <Typography variant="body1" fontWeight="bold">
                        {method.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Campo para valor recebido (apenas dinheiro) */}
          {selectedMethod === 'Dinheiro' && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Valor Recebido
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Valor Recebido"
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    InputProps={{
                      startAdornment: 'R$'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Valor Personalizado"
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Ou digite um valor"
                    InputProps={{
                      startAdornment: 'R$'
                    }}
                  />
                </Grid>
              </Grid>

              {/* Sugestões de valores */}
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Sugestões:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {[total, Math.ceil(total), Math.ceil(total + 10), Math.ceil(total + 20)].map((value) => (
                    <Button
                      key={value}
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setAmountReceived(value.toString());
                        setCustomAmount('');
                      }}
                    >
                      {formatCurrency(value)}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Cálculo do troco */}
              {amountReceived && (
                <Box mt={2} p={2} bgcolor="success.light" borderRadius={1}>
                  <Typography variant="body1" fontWeight="bold">
                    Troco: {formatCurrency(change)}
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedMethod || (selectedMethod === 'Dinheiro' && !amountReceived && !customAmount)}
          startIcon={<Receipt />}
        >
          Confirmar Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;