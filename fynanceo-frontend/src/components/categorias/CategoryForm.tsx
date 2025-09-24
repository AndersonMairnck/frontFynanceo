import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { Category, CategoryFormData } from '../../types/category';
import { categorySchema, CategoryFormValues } from '../../validations/categoryValidation';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      isActive: category?.isActive ?? true
    }
  });

  const onSubmitForm = async (data: CategoryFormValues) => {
    try {
      const formData: CategoryFormData = {
        name: data.name,
        description: data.description || '',
        isActive: data.isActive
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro no formulário:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {category ? 'Editar Categoria' : 'Nova Categoria'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome da Categoria *"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message as string} // Adicionar cast para string
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={3}
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message as string} // Adicionar cast para string
              defaultValue=""
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch {...register('isActive')} defaultChecked />}
              label="Categoria Ativa"
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                onClick={onCancel}
                startIcon={<Cancel />}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CategoryForm;