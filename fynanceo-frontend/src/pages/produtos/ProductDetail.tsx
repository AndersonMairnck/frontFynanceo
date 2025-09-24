import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  AttachMoney,
  Inventory,
  Category,
  Description,
  CalendarToday,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { ProductDTO } from '../../types/product';

interface ProductDetailProps {
  product: ProductDTO;
  onEdit: () => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onEdit, onBack }) => {
  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: Date): string => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const calcularMargem = (): string => {
    if (product.costPrice > 0) {
      const margem = ((product.price - product.costPrice) / product.costPrice) * 100;
      return `${margem.toFixed(2)}%`;
    }
    return 'N/A';
  };

  const calcularLucro = (): string => {
    return formatarMoeda(product.price - product.costPrice);
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <Chip
              label={product.isActive ? 'Ativo' : 'Inativo'}
              color={product.isActive ? 'success' : 'default'}
              icon={product.isActive ? <CheckCircle /> : <Cancel />}
            />
            {product.stockQuantity <= product.minStockLevel && product.isActive && (
              <Chip
                label="Estoque Baixo"
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
        
        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={onBack}>
            Voltar
          </Button>
          <Button variant="contained" onClick={onEdit}>
            Editar
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Informações Básicas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} />
                Informações do Produto
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Category />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Categoria" 
                    secondary={product.categoryName}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Descrição" 
                    secondary={product.description || 'Sem descrição'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Data de Cadastro" 
                    secondary={formatarData(product.createdAt)}
                  />
                </ListItem>
                
                {product.modifiedAt && (
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Última Modificação" 
                      secondary={formatarData(product.modifiedAt)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Preços e Estoque */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1 }} />
                Informações Financeiras
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Preço de Venda" 
                    secondary={formatarMoeda(product.price)}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Preço de Custo" 
                    secondary={product.costPrice > 0 ? formatarMoeda(product.costPrice) : 'Não informado'}
                  />
                </ListItem>
                
                {product.costPrice > 0 && (
                  <>
                    <ListItem>
                      <ListItemText 
                        primary="Margem de Lucro" 
                        secondary={calcularMargem()}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Lucro por Unidade" 
                        secondary={calcularLucro()}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory sx={{ mr: 1 }} />
                Controle de Estoque
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Quantidade em Estoque" 
                    secondary={product.stockQuantity}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Estoque Mínimo" 
                    secondary={product.minStockLevel}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Status do Estoque" 
                    secondary={
                      product.stockQuantity <= product.minStockLevel 
                        ? '⚠️ Abaixo do mínimo' 
                        : '✅ Normal'
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Valor total em estoque */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Valor Total em Estoque
          </Typography>
          <Typography variant="h4" color="primary">
            {formatarMoeda(product.price * product.stockQuantity)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Preço de venda × Quantidade em estoque
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default ProductDetail;