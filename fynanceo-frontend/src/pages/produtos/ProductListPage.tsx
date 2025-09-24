import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';
import { Product } from '../../types/product'; // Mudar de ProductDTO para Product
import { ProductDTO } from '../../types/product';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductList from '../../components/produtos/ProductList';
import { StockAlert } from '../../components/produtos/StockAlert';

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    loading,
    error,
    carregarProducts,
    desativarProduct,
    ativarProduct,
    limparErro
  } = useProducts();

  const { categories, carregarCategories } = useCategories();

  const [includeInactive, setIncludeInactive] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Carregar produtos e categorias
  useEffect(() => {
    carregarProducts(includeInactive);
    carregarCategories();
  }, [carregarProducts, carregarCategories, includeInactive]);

  const mostrarSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Navegação
  const handleAdd = () => navigate('/produtos/novo');
  const handleEdit = (product: ProductDTO) => navigate(`/produtos/editar/${product.id}`);
  const handleView = (product: ProductDTO) => navigate(`/produtos/${product.id}`);

  // Ativar/Desativar produto
  const handleDesativar = async (id: number, motivo: string) => {
    try {
      await desativarProduct(id, motivo);
      mostrarSnackbar('Produto desativado com sucesso!', 'success');
    } catch (error) {
      mostrarSnackbar('Erro ao desativar produto', 'error');
    }
  };

  const handleAtivar = async (id: number) => {
    try {
      await ativarProduct(id);
      mostrarSnackbar('Produto ativado com sucesso!', 'success');
    } catch (error) {
      mostrarSnackbar('Erro ao ativar produto', 'error');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    return () => {
      limparErro();
    };
  }, [limparErro]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box>
        {/* Alertas de estoque */}
        <StockAlert products={products.filter(p => p.isActive)} />

        {/* Filtros */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Produtos Cadastrados</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
                color="primary"
              />
            }
            label="Incluir produtos inativos"
          />
        </Box>

        <ProductList
          products={products}
          categories={categories}
          loading={loading}
          error={error}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onView={handleView}
          onDesativar={handleDesativar}
          onAtivar={handleAtivar}
          includeInactive={includeInactive}
        />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductListPage;