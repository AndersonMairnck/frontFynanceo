import React, { useEffect, useState } from 'react'; // Adicionar useState
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Category, CategoryFormData } from '../../types/category';
import { useCategories } from '../../hooks/useCategories';
import CategoryForm from '../../components/categorias/CategoryForm';

const CategoryFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    category,
    loading,
    error,
    carregarCategory,
    criarCategory,
    atualizarCategory,
    limparErro
  } = useCategories();

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
  const categoryId = id ? parseInt(id) : undefined;

  useEffect(() => {
    if (isEdit && categoryId) {
      carregarCategory(categoryId);
    }
  }, [isEdit, categoryId, carregarCategory]);

  const handleSubmit = async (formData: CategoryFormData) => {
    try {
      if (isEdit && categoryId) {
        await atualizarCategory(categoryId, formData);
        mostrarSnackbar('Categoria atualizada com sucesso!', 'success');
      } else {
        await criarCategory(formData);
        mostrarSnackbar('Categoria criada com sucesso!', 'success');
      }
      
      setTimeout(() => navigate('/categorias'), 1000);
    } catch (error) {
      mostrarSnackbar(
        `Erro ao ${isEdit ? 'atualizar' : 'criar'} categoria`, 
        'error'
      );
    }
  };

  const handleCancel = () => {
    navigate('/categorias');
  };

  const mostrarSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev: any) => ({ ...prev, open: false })); // Corrigir tipo do prev
  };

  useEffect(() => {
    return () => {
      limparErro();
    };
  }, [limparErro]);

  if (isEdit && !category && loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <CategoryForm
          category={isEdit ? category || undefined : undefined}
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
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={limparErro}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default CategoryFormPage;