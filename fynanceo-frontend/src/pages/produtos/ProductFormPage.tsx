import React, { useEffect, useState } from 'react'; // Adicionar useState
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { ProductDTO, ProductFormData } from '../../types/product';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import ProductForm from '../../components/produtos/ProductForm';

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    product,
    loading,
    error,
    carregarProduct,
    criarProduct,
    atualizarProduct,
    limparErro
  } = useProducts();

  const { categories, carregarCategories } = useCategories();

  const [snackbar, setSnackbar] = useState<{ // Corrigido
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const isEdit = Boolean(id);
  const productId = id ? parseInt(id) : undefined;

  useEffect(() => {
    carregarCategories();
    
    if (isEdit && productId) {
      carregarProduct(productId);
    }
  }, [isEdit, productId, carregarProduct, carregarCategories]);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      if (isEdit && productId) {
        await atualizarProduct(productId, formData);
        mostrarSnackbar('Produto atualizado com sucesso!', 'success');
      } else {
        await criarProduct(formData);
        mostrarSnackbar('Produto criado com sucesso!', 'success');
      }
      
      setTimeout(() => navigate('/produtos'), 1000);
    } catch (error) {
      mostrarSnackbar(
        `Erro ao ${isEdit ? 'atualizar' : 'criar'} produto`, 
        'error'
      );
    }
  };

  const handleCancel = () => {
    navigate('/produtos');
  };

  const mostrarSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev: any) => ({ ...prev, open: false })); // Corrigir tipo
  };

  useEffect(() => {
    return () => {
      limparErro();
    };
  }, [limparErro]);

  if (isEdit && !product && loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <ProductForm
          product={isEdit ? product || undefined : undefined}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
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

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={limparErro}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default ProductFormPage;