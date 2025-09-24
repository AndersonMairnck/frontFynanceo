import React from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  FormControlLabel,
  MenuItem,
  Divider
} from '@mui/material';
import { Save, Cancel, AttachMoney, Inventory } from '@mui/icons-material';
import { ProductDTO, ProductFormData } from '../../types/product';
import { Category } from '../../types/category';
import { productSchema, ProductFormValues } from '../../validations/productValidation';

interface ProductFormProps {
  product?: ProductDTO;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      costPrice: product?.costPrice || 0,
      stockQuantity: product?.stockQuantity || 0,
      minStockLevel: product?.minStockLevel || 0,
      categoryId: product?.categoryId || 0,
      isActive: product?.isActive ?? true
    }
  });

  const onSubmitForm = async (data: ProductFormValues) => {
    try {
      // Garantir que todos os números tenham valores padrão
      const formData: ProductFormData = {
        name: data.name,
        description: data.description || '',
        price: data.price || 0,
        costPrice: data.costPrice || 0, // Corrigido: garantir que não seja undefined
        stockQuantity: data.stockQuantity || 0,
        minStockLevel: data.minStockLevel || 0,
        categoryId: data.categoryId || 0,
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
        {product ? 'Editar Produto' : 'Novo Produto'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Informações Básicas</Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome do Produto *"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  select
                  label="Categoria *"
                  {...field}
                  error={!!errors.categoryId}
                  helperText={errors.categoryId?.message as string}
                >
                  <MenuItem value={0}>Selecione uma categoria</MenuItem>
                  {categories
                    .filter(cat => cat.isActive)
                    .map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </TextField>
              )}
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
              helperText={errors.description?.message as string}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">
              <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
              Preços
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preço de Venda *"
              type="number"
              InputProps={{ startAdornment: 'R$' }}
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message as string}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Preço de Custo"
              type="number"
              InputProps={{ startAdornment: 'R$' }}
              {...register('costPrice')}
              error={!!errors.costPrice}
              helperText={errors.costPrice?.message as string}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">
              <Inventory sx={{ mr: 1, verticalAlign: 'middle' }} />
              Controle de Estoque
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantidade em Estoque *"
              type="number"
              {...register('stockQuantity')}
              error={!!errors.stockQuantity}
              helperText={errors.stockQuantity?.message as string}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estoque Mínimo *"
              type="number"
              {...register('minStockLevel')}
              error={!!errors.minStockLevel}
              helperText={errors.minStockLevel?.message as string}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch {...register('isActive')} defaultChecked />}
              label="Produto Ativo"
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button onClick={onCancel} startIcon={<Cancel />} disabled={loading}>
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

export default ProductForm;