// src/components/orders/OrderItemsModal.tsx (CORREÇÃO)
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Alert,
  Snackbar,
  CircularProgress // ✅ ADICIONADO PARA LOADING
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Restaurant
} from '@mui/icons-material';
import {  OrderItemDTO } from '../../types/delivery';
import { tableService } from '../../services/tableService';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { Product } from '../../types/product';
import {Order,CreateOrderItemDTO} from '../../types/order'; 
interface OrderItemsModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
}

const OrderItemsModal: React.FC<OrderItemsModalProps> = ({
  open,
  order,
  onClose,
  onOrderUpdated
}) => {
  const { products, carregarProducts, loading: productsLoading } = useProducts();
  const { categories, carregarCategories, loading: categoriesLoading } = useCategories();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentItems, setCurrentItems] = useState<OrderItemDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Carregar produtos e categorias quando o modal abrir
  useEffect(() => {
    if (open) {
      console.log('🔄 Modal aberto - Carregando produtos e categorias...');
      carregarProducts(true);
      carregarCategories();
    }
  }, [open, carregarProducts, carregarCategories]);

  // Debug: Verificar quando produtos são carregados
  useEffect(() => {
    if (products.length > 0) {
      console.log('✅ Produtos carregados no modal:', products);
    }
  }, [products]);

  // Debug: Verificar quando categorias são carregadas
  useEffect(() => {
    if (categories.length > 0) {
      console.log('✅ Categorias carregadas no modal:', categories);
    }
  }, [categories]);

  // Carregar itens atuais do pedido
  useEffect(() => {
    if (order) {
      setCurrentItems(order.items || []);
      console.log('📦 Itens do pedido carregados:', order.items);
    }
  }, [order]);

  // ✅ FUNÇÃO PARA OBTER O NOME DA CATEGORIA
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sem categoria';
  };

  // ✅ FUNÇÃO PARA OBTER PRODUTO POR ID
  const getProductById = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  const handleAddItem = async () => {
    if (!selectedProduct || !order) return;

    const product = getProductById(selectedProduct);
    if (!product) {
      console.error('❌ Produto não encontrado:', selectedProduct);
      return;
    }

    console.log('➕ Adicionando produto:', product.name, 'Quantidade:', quantity);

    const newItem: CreateOrderItemDTO = {
      productId: product.id,
      quantity: quantity,
      unitPrice: product.price
    };

    setLoading(true);
    try {
      const updatedOrder = await tableService.addItemsToOrder({
        orderId: order.id,
        items: [newItem]
      });
      
      setCurrentItems(updatedOrder.items || []);
      onOrderUpdated(updatedOrder);
      setSnackbar({
        open: true,
        message: `${quantity}x ${product.name} adicionado ao pedido!`,
        severity: 'success'
      });
      
      // Reset form
      setSelectedProduct(null);
      setQuantity(1);
    } catch (error) {
      console.error('❌ Erro ao adicionar item:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao adicionar item ao pedido',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemIndex: number) => {
    if (!order) return;

    // Para remover itens, precisaríamos de um endpoint específico
    setSnackbar({
      open: true,
      message: 'Funcionalidade de remoção em desenvolvimento',
      severity: 'info'
    });
  };

  const handleUpdateQuantity = async (itemIndex: number, newQuantity: number) => {
    if (!order || newQuantity < 1) return;

    // Para atualizar quantidade, também precisaríamos de endpoint específico
    setSnackbar({
      open: true,
      message: 'Funcionalidade de atualização em desenvolvimento',
      severity: 'info'
    });
  };

  const getTotalAmount = () => {
    return currentItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getProductName = (productId: number) => {
    const product = getProductById(productId);
    return product?.name || `Produto ${productId}`;
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!order) return null;

  const isLoading = productsLoading || categoriesLoading;

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <Restaurant color="primary" />
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Gerenciar Pedido
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  {order.orderNumber} - Mesa {order.tableNumber}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {isLoading ? (
            // ✅ LOADING ENQUANTO CARREGA PRODUTOS
            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
              <Box textAlign="center">
                <CircularProgress size={40} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Carregando produtos...
                </Typography>
              </Box>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Coluna 1: Adicionar Produtos */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Add />
                  Adicionar Produtos ({products.length} disponíveis)
                </Typography>

                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selecione um produto:
                  </Typography>
                  
                  {products.length === 0 ? (
                    // ✅ MENSAGEM SE NÃO HOUVER PRODUTOS
                    <Box textAlign="center" py={4}>
                      <Typography variant="body1" color="textSecondary">
                        Nenhum produto disponível
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Grid container spacing={1} sx={{ mb: 2, maxHeight: 300, overflow: 'auto' }}>
                        {products.map(product => (
                          <Grid item xs={6} key={product.id}>
                            <Card
                              sx={{
                                cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                                border: selectedProduct === product.id ? '2px solid' : '1px solid',
                                borderColor: selectedProduct === product.id ? 'primary.main' : 'divider',
                                opacity: product.stockQuantity > 0 ? 1 : 0.6,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  borderColor: product.stockQuantity > 0 ? 'primary.main' : 'divider',
                                  backgroundColor: product.stockQuantity > 0 ? 'action.hover' : 'transparent'
                                }
                              }}
                              onClick={() => product.stockQuantity > 0 && setSelectedProduct(product.id)}
                            >
                              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <Typography variant="body2" fontWeight="medium" noWrap>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {getCategoryName(product.categoryId)}
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="primary">
                                  R$ {product.price.toFixed(2)}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}
                                >
                                  Estoque: {product.stockQuantity}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>

                      <Box display="flex" gap={2} alignItems="center">
                        <Typography variant="body2" fontWeight="medium">
                          Quantidade:
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            disabled={quantity <= 1 || !selectedProduct}
                          >
                            <Remove />
                          </IconButton>
                          <TextField
                            size="small"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            sx={{ width: 80 }}
                            type="number"
                            disabled={!selectedProduct}
                          />
                          <IconButton
                            size="small"
                            onClick={() => setQuantity(prev => prev + 1)}
                            disabled={!selectedProduct}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* ✅ Validação de estoque */}
                      {selectedProduct && (
                        <Box mt={1}>
                          <Typography 
                            variant="caption" 
                            color={
                              getProductById(selectedProduct)?.stockQuantity === 0 ? 'error' : 
                              (getProductById(selectedProduct)?.stockQuantity || 0) < quantity ? 'warning' : 'success'
                            }
                          >
                            {getProductById(selectedProduct)?.stockQuantity === 0 ? 'Produto sem estoque' :
                             (getProductById(selectedProduct)?.stockQuantity || 0) < quantity ? 
                             `Estoque insuficiente. Disponível: ${getProductById(selectedProduct)?.stockQuantity}` :
                             'Estoque disponível'}
                          </Typography>
                        </Box>
                      )}

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAddItem}
                        disabled={
                          !selectedProduct || 
                          loading || 
                          getProductById(selectedProduct)?.stockQuantity === 0 ||
                          (getProductById(selectedProduct)?.stockQuantity || 0) < quantity
                        }
                        sx={{ mt: 2 }}
                      >
                        {loading ? 'Adicionando...' : 'Adicionar ao Pedido'}
                      </Button>
                    </>
                  )}
                </Paper>
              </Grid>

              {/* Coluna 2: Itens do Pedido */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingCart />
                  Itens do Pedido ({currentItems.length})
                </Typography>

                {currentItems.length > 0 ? (
                  <Paper>
                    <List>
                      {currentItems.map((item, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                {getProductName(item.productId)}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  R$ {item.unitPrice.toFixed(2)} un.
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                                  >
                                    <Remove fontSize="small" />
                                  </IconButton>
                                  <Chip 
                                    label={item.quantity} 
                                    size="small"
                                    variant="outlined"
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                                  >
                                    <Add fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body1" fontWeight="bold" color="primary">
                                R$ {item.totalPrice.toFixed(2)}
                              </Typography>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>

                    <Divider />

                    <Box sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                          Total:
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          R$ {getTotalAmount().toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ) : (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <ShoppingCart sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Nenhum item no pedido
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Selecione produtos à esquerda para adicionar ao pedido
                    </Typography>
                  </Paper>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Fechar
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              // Aqui poderia abrir o modal de pagamento diretamente
              onClose();
            }}
            disabled={currentItems.length === 0 || isLoading}
          >
            Finalizar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default OrderItemsModal;