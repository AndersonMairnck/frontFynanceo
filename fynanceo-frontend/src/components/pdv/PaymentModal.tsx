// src/components/pdv/PaymentModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton
} from '@mui/material';
import {
  AttachMoney,
  CreditCard,
  Close,
  Pix
} from '@mui/icons-material';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (method: string, amountReceived?: number) => void;
  total: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
  requiresAmount?: boolean;
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

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'dinheiro',
      name: 'Dinheiro',
      icon: <AttachMoney />,
      description: 'Pagamento em espécie',
      requiresAmount: true
    },
    {
      id: 'pix',
      name: 'PIX',
      icon: <Pix />,
      description: 'Pagamento instantâneo'
    },
    {
      id: 'cartao_debito',
      name: 'Cartão Débito',
      icon: <CreditCard />,
      description: 'Débito na hora'
    },
    {
      id: 'cartao_credito',
      name: 'Cartão Crédito',
      icon: <CreditCard />,
      description: 'Parcelado ou à vista'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateChange = () => {
    const received = parseFloat(amountReceived) || 0;
    return Math.max(0, received - total);
  };

  const suggestedAmounts = [
    total,
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 50) * 50,
    Math.ceil(total / 100) * 100
  ].filter((value, index, array) => 
    value >= total && array.indexOf(value) === index
  );

  const handleAmountSuggestion = (amount: number) => {
    setAmountReceived(amount.toString());
    setCustomAmount('');
  };

  const handleConfirm = () => {
    if (!selectedMethod) return;

    const amount = selectedMethod === 'dinheiro' ? parseFloat(amountReceived) : undefined;
    onConfirm(selectedMethod, amount);
    
    // Reset form
    setSelectedMethod('');
    setAmountReceived('');
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setAmountReceived(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Finalizar Pagamento</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" color="primary" fontWeight="bold">
          Total: {formatCurrency(total)}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Métodos de Pagamento */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Selecione a Forma de Pagamento
          </Typography>
          
          <RadioGroup
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
          >
            <Grid container spacing={2}>
              {paymentMethods.map((method) => (
                <Grid item xs={6} key={method.id}>
                  <Card 
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      borderColor: selectedMethod === method.id ? 'primary.main' : 'divider',
                      backgroundColor: selectedMethod === method.id ? 'action.selected' : 'background.paper'
                    }}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <FormControlLabel
                        value={method.id}
                        control={<Radio />}
                        label={
                          <Box>
                            <Box sx={{ color: 'primary.main', mb: 1 }}>
                              {method.icon}
                            </Box>
                            <Typography variant="body2" fontWeight="bold">
                              {method.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {method.description}
                            </Typography>
                          </Box>
                        }
                        sx={{ 
                          width: '100%',
                          margin: 0,
                          '& .MuiFormControlLabel-label': { width: '100%' }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </Box>

        {/* Valor Recebido (apenas para dinheiro) */}
        {selectedMethod === 'dinheiro' && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Valor Recebido
            </Typography>
            
            {/* Sugestões de Valor */}
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Sugestões:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {suggestedAmounts.map((amount) => (
                  <Button
                    key={`suggestion-${amount}`}
                    variant="outlined"
                    size="small"
                    onClick={() => handleAmountSuggestion(amount)}
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Campo Personalizado */}
         <TextField
  fullWidth
  label="Valor Recebido"
  type="text"                      // <- mudou de number para text
  inputMode="numeric"              // abre teclado numérico em mobile
  value={customAmount}
  onChange={(e) => {
    // Remove qualquer coisa que não seja número
    const onlyNumbers = e.target.value.replace(/\D/g, '');
    setCustomAmount(onlyNumbers);
    setAmountReceived(onlyNumbers);
  }}
  InputProps={{
    startAdornment: <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
  }}
  sx={{ mb: 2 }}
/>

            {/* Cálculo do Troco */}
            {amountReceived && (
              <Box 
                p={2} 
                bgcolor="success.light" 
                borderRadius={1}
                textAlign="center"
              >
                <Typography variant="body2" fontWeight="bold" color="success.dark">
                  Troco: {formatCurrency(calculateChange())}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Resumo */}
        <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="subtitle2" gutterBottom>
            Resumo do Pagamento
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Total da Compra:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {formatCurrency(total)}
            </Typography>
          </Box>
          {selectedMethod === 'dinheiro' && amountReceived && (
            <>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Valor Recebido:</Typography>
                <Typography variant="body2">
                  {formatCurrency(parseFloat(amountReceived))}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" fontWeight="bold">Troco:</Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {formatCurrency(calculateChange())}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedMethod || (selectedMethod === 'dinheiro' && !amountReceived)}
        >
          Confirmar Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;