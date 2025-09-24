import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { useProducts } from '../../hooks/useProducts';
import ProductDetail from '../../components/produtos/ProductDetail';

const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    product,
    loading,
    error,
    carregarProduct,
    limparErro
  } = useProducts();

  const productId = id ? parseInt(id) : undefined;

  useEffect(() => {
    if (productId) {
      carregarProduct(productId);
    }
  }, [productId, carregarProduct]);

  const handleEdit = () => {
    if (product) {
      navigate(`/produtos/editar/${product.id}`);
    }
  };

  const handleBack = () => {
    navigate('/produtos');
  };

  useEffect(() => {
    return () => {
      limparErro();
    };
  }, [limparErro]);

  if (loading || !product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={handleBack}>
          Voltar para a lista
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ProductDetail
        product={product}
        onEdit={handleEdit}
        onBack={handleBack}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={limparErro}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetailPage;