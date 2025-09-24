import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Divider,
  Paper,
  Button,
  CircularProgress // Adicionar import
} from '@mui/material';
import { Add, Remove, Delete, ShoppingCart } from '@mui/icons-material';
import { CartItem } from '../../types/order';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onFinalizeSale: () => void;
  total: number;
  loading?: boolean;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onFinalizeSale,
  total,
  loading = false
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Cabeçalho do Carrinho */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
            <ShoppingCart />
            Carrinho
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {items.length} item(s)
          </Typography>
        </Box>
      </Box>

      {/* Lista de Itens */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {items.length === 0 ? (
          <Box textAlign="center" py={4}>
            <ShoppingCart sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" color="textSecondary">
              Carrinho vazio
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Adicione produtos para começar
            </Typography>
          </Box>
        ) : (
          <List>
            {items.map((item, index) => (
              <React.Fragment key={item.productId}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" noWrap>
                        {item.productName}
                      </Typography>
                    }
                    secondary={formatPrice(item.price)}
                  />
                  
                  {/* Controles de Quantidade */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton 
                      size="small" 
                      onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    
                    <TextField
                      size="small"
                      value={item.quantity}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value) || 1;
                        onUpdateQuantity(item.productId, quantity);
                      }}
                      inputProps={{ 
                        style: { textAlign: 'center', width: 40 },
                        min: 1,
                        max: item.stock
                      }}
                    />
                    
                    <IconButton 
                      size="small" 
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                    
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => onRemoveItem(item.productId)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Rodapé com Total e Ações */}
      {items.length > 0 && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          {/* Total */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {formatPrice(total)}
            </Typography>
          </Box>

          {/* Ações */}
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              color="error"
              onClick={onClearCart}
              fullWidth
              disabled={loading}
            >
              Limpar
            </Button>
            <Button
              variant="contained"
              onClick={onFinalizeSale}
              fullWidth
              disabled={loading || items.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : undefined} // Corrigido: usar startIcon em vez de loading
            >
              {loading ? 'Processando...' : 'Finalizar Venda'}
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default Cart;