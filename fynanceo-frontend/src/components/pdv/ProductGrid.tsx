import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { Add, Inventory } from '@mui/icons-material';
import { Product } from '../../types/product';

interface ProductGridProps {
  products: Product[];
  categories: any[];
  selectedCategory: number;
  onAddProduct: (product: Product) => void;
  searchTerm: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onAddProduct,
  searchTerm
}) => {
  // Filtrar produtos por categoria e busca
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 0 || product.categoryId === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && product.isActive;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Contador de produtos */}
      <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
        {filteredProducts.length} produto(s) encontrado(s)
      </Typography>

      {/* Grade de produtos */}
      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={6} sm={4} md={3} key={product.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => onAddProduct(product)}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {/* Cabeçalho do produto */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="subtitle2" fontWeight="bold" noWrap>
                    {product.name}
                  </Typography>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddProduct(product);
                    }}
                  >
                    <Add />
                  </IconButton>
                </Box>

                {/* Descrição */}
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1, height: 40, overflow: 'hidden' }}>
                  {product.description || 'Sem descrição'}
                </Typography>

                {/* Preço e Estoque */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(product.price)}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Inventory fontSize="small" color={product.stockQuantity > 0 ? 'success' : 'error'} />
                    <Typography 
                      variant="caption" 
                      color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}
                    >
                      {product.stockQuantity}
                    </Typography>
                  </Box>
                </Box>

                {/* Alertas */}
                {product.stockQuantity <= product.minStockLevel && (
                  <Chip 
                    label="Estoque Baixo" 
                    size="small" 
                    color="warning" 
                    sx={{ mt: 1, width: '100%' }}
                  />
                )}

                {product.stockQuantity === 0 && (
                  <Chip 
                    label="Fora de Estoque" 
                    size="small" 
                    color="error" 
                    sx={{ mt: 1, width: '100%' }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Mensagem quando não há produtos */}
      {filteredProducts.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Nenhum produto encontrado
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Tente alterar os filtros ou a busca
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductGrid;