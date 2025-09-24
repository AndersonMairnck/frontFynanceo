import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { Edit, Delete, Add, Visibility, Block, CheckCircle } from '@mui/icons-material';
import { Category } from '../../types/category';

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  onEdit: (category: Category) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  loading,
  error,
  onEdit,
  onAdd,
  onDelete
}) => {
  const [categoryParaExcluir, setCategoryParaExcluir] = useState<Category | null>(null);

  const formatarData = (data: Date): string => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const confirmarExcluir = (category: Category) => {
    setCategoryParaExcluir(category);
  };

  const executarExcluir = () => {
    if (categoryParaExcluir) {
      onDelete(categoryParaExcluir.id);
      setCategoryParaExcluir(null);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Categorias Cadastradas</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
          Nova Categoria
        </Button>
      </Box>

      {error && (
        <Box px={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell>Status</TableCell>
              <TableCell width="100px">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    {loading ? 'Carregando...' : 'Nenhuma categoria encontrada'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">{category.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {category.description || 'Sem descrição'}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatarData(category.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={category.isActive ? 'Ativa' : 'Inativa'}
                      color={category.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(category)}
                        title="Editar"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => confirmarExcluir(category)}
                        title="Excluir"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmação para excluir */}
      <Dialog open={!!categoryParaExcluir} onClose={() => setCategoryParaExcluir(null)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir a categoria "{categoryParaExcluir?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryParaExcluir(null)}>Cancelar</Button>
          <Button onClick={executarExcluir} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CategoryList;