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
  TextField,
  InputAdornment,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  MenuItem
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Visibility,
  Block,
  CheckCircle,
  Search,
  Warning
} from '@mui/icons-material';
import { ProductDTO } from '../../types/product';
import { Category } from '../../types/category';

interface ProductListProps {
  products: ProductDTO[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  onEdit: (product: ProductDTO) => void;
  onView: (product: ProductDTO) => void;
  onAdd: () => void;
  onDesativar: (id: number, motivo: string) => void;
  onAtivar: (id: number) => void;
  includeInactive: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  loading,
  error,
  onEdit,
  onView,
  onAdd,
  onDesativar,
  onAtivar,
  includeInactive
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number>(0);
  const [productParaDesativar, setProductParaDesativar] = useState<ProductDTO | null>(null);
  const [productParaAtivar, setProductParaAtivar] = useState<ProductDTO | null>(null);
  const [motivoDesativacao, setMotivoDesativacao] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 0 || product.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const produtosEstoqueBaixo = filteredProducts.filter(
    p => p.isActive && p.stockQuantity <= p.minStockLevel
  );

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const confirmarDesativar = (product: ProductDTO) => {
    setProductParaDesativar(product);
    setMotivoDesativacao('');
  };

  const confirmarAtivar = (product: ProductDTO) => {
    setProductParaAtivar(product);
  };

  const executarDesativar = () => {
    if (productParaDesativar) {
      onDesativar(productParaDesativar.id, motivoDesativacao);
      setProductParaDesativar(null);
      setMotivoDesativacao('');
    }
  };

  const executarAtivar = () => {
    if (productParaAtivar) {
      onAtivar(productParaAtivar.id);
      setProductParaAtivar(null);
    }
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3}>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Produtos Cadastrados</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
            Novo Produto
          </Button>
        </Box>

        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ minWidth: 200 }}
          />

          <TextField
            select
            label="Filtrar por categoria"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(Number(e.target.value))}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value={0}>Todas as categorias</MenuItem>
            {categories.filter(c => c.isActive).map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          {produtosEstoqueBaixo.length > 0 && (
            <Chip
              icon={<Warning />}
              label={`${produtosEstoqueBaixo.length} com estoque baixo`}
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
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
              <TableCell>Categoria</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell>Status</TableCell>
              <TableCell width="120px">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    {loading ? 'Carregando...' : 'Nenhum produto encontrado'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow 
                  key={product.id} 
                  hover
                  sx={{
                    backgroundColor: product.stockQuantity <= product.minStockLevel && product.isActive 
                      ? '#fff3e0' 
                      : 'inherit'
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography fontWeight="medium">{product.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {product.description?.substring(0, 50)}...
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>{formatarMoeda(product.price)}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography>
                        {product.stockQuantity}
                        {product.stockQuantity <= product.minStockLevel && product.isActive && (
                          <Warning color="warning" sx={{ fontSize: 16, ml: 0.5 }} />
                        )}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Mín: {product.minStockLevel}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.isActive ? 'Ativo' : 'Inativo'}
                      color={product.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton size="small" onClick={() => onView(product)} title="Visualizar">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => onEdit(product)} title="Editar">
                        <Edit fontSize="small" />
                      </IconButton>
                      {product.isActive ? (
                        <IconButton
                          size="small"
                          onClick={() => confirmarDesativar(product)}
                          title="Desativar"
                          color="warning"
                        >
                          <Block fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => confirmarAtivar(product)}
                          title="Ativar"
                          color="success"
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!productParaDesativar} onClose={() => setProductParaDesativar(null)}>
        <DialogTitle>Desativar Produto</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Tem certeza que deseja desativar o produto "{productParaDesativar?.name}"?
          </DialogContentText>
          <TextField
            autoFocus
            label="Motivo da desativação"
            fullWidth
            multiline
            rows={3}
            value={motivoDesativacao}
            onChange={(e) => setMotivoDesativacao(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductParaDesativar(null)}>Cancelar</Button>
          <Button 
            onClick={executarDesativar} 
            color="warning"
            disabled={!motivoDesativacao.trim()}
          >
            Desativar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!productParaAtivar} onClose={() => setProductParaAtivar(null)}>
        <DialogTitle>Ativar Produto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja ativar o produto "{productParaAtivar?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductParaAtivar(null)}>Cancelar</Button>
          <Button onClick={executarAtivar} color="success">
            Ativar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProductList;