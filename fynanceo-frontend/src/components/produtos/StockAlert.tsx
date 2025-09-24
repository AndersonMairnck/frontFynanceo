import React from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { Product } from '../../types/product'; // Mudar de ProductDTO para Product

interface StockAlertProps {
  products: Product[];
}

export const StockAlert: React.FC<StockAlertProps> = ({ products }) => {
  const produtosComEstoqueBaixo = products.filter(
    product => product.isActive && product.stockQuantity <= product.minStockLevel
  );

  if (produtosComEstoqueBaixo.length === 0) {
    return null;
  }

  return (
    <Alert 
      severity="warning" 
      icon={<Warning />}
      sx={{ mb: 2 }}
    >
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          ⚠️ Alerta de Estoque Baixo
        </Typography>
        <Typography variant="body2">
          {produtosComEstoqueBaixo.length} produto(s) com estoque abaixo do mínimo:
        </Typography>
        <Box component="ul" sx={{ mt: 1, pl: 2 }}>
          {produtosComEstoqueBaixo.slice(0, 5).map(product => (
            <li key={product.id}>
              <Typography variant="body2">
                {product.name} - Estoque: {product.stockQuantity} (Mínimo: {product.minStockLevel})
              </Typography>
            </li>
          ))}
          {produtosComEstoqueBaixo.length > 5 && (
            <Typography variant="body2" fontStyle="italic">
              ... e mais {produtosComEstoqueBaixo.length - 5} produtos
            </Typography>
          )}
        </Box>
      </Box>
    </Alert>
  );
};