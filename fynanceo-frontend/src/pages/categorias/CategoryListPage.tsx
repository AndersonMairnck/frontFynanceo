import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { Category, CategoryFormData } from '../../types/category';
import { useCategories } from '../../hooks/useCategories';
import CategoryList from '../../components/categorias/CategoryList';

const CategoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    categories,
    loading,
    error,
    carregarCategories,
    excluirCategory,
    limparErro
  } = useCategories();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Carregar categorias ao iniciar
  useEffect(() => {
    carregarCategories();
  }, [carregarCategories]);

  const mostrarSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // Navegação
  const handleAdd = () => navigate('/categorias/nova');
  const handleEdit = (category: Category) => navigate(`/categorias/editar/${category.id}`);

  // Excluir categoria
  const handleDelete = async (id: number) => {
    try {
      await excluirCategory(id);
      mostrarSnackbar('Categoria excluída com sucesso!', 'success');
    } catch (error) {
      mostrarSnackbar('Erro ao excluir categoria', 'error');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Limpar erro ao desmontar
  useEffect(() => {
    return () => {
      limparErro();
    };
  }, [limparErro]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <CategoryList
          categories={categories}
          loading={loading}
          error={error}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
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

export default CategoryListPage;