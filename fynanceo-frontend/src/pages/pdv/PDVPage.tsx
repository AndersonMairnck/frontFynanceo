import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Snackbar,
  Alert,
  TextField,
  MenuItem,
  Typography
} from '@mui/material';
import { Search, Category } from '@mui/icons-material';

// Components
import PDVHeader from '../../components/pdv/PDVHeader';
import ProductGrid from '../../components/pdv/ProductGrid';
import Cart from '../../components/pdv/Cart';
import CustomerSelector from '../../components/pdv/CustomerSelector';
import OrderTypeSelector from '../../components/pdv/OrderTypeSelector';
import PaymentModal from '../../components/pdv/PaymentModal';
import TableSelector from '../../components/pdv/TableSelector';

// Hooks and Types
import { usePDV } from '../../hooks/usePDV';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { Product } from '../../types/product';

const PDVPage: React.FC = () => {
  // Hooks
  const {
    cart,
    selectedCustomer,
    selectedTable,
    orderType,
    paymentMethod,
    loading: pdvLoading,
    error: pdvError, // Renomear para evitar conflito
    adicionarProduto,
    removerProduto,
    atualizarQuantidade,
    limparCarrinho,
    selecionarCliente,
    selecionarMesa,
    selecionarTipoVenda,
    selecionarFormaPagamento,
    finalizarVenda,
    calcularTotal,
    limparErro: limparPdvErro // Renomear para evitar conflito
  } = usePDV();

  const { products, carregarProducts, loading: productsLoading, error: productsError } = useProducts();
  const { categories, carregarCategories, loading: categoriesLoading, error: categoriesError } = useCategories();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Combinar erros
  const error = pdvError || productsError || categoriesError;
  const loading = pdvLoading || productsLoading || categoriesLoading;

  // Load data
  useEffect(() => {
    carregarProducts(true); // Include inactive products
    carregarCategories();
  }, [carregarProducts, carregarCategories]);

  // Handlers
  const handleAddProduct = (product: Product) => {
    if (product.stockQuantity > 0) {
      adicionarProduto(product);
    }
  };

  const handleFinalizeSale = async () => {
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (method: string, amountReceived?: number) => {
    selecionarFormaPagamento(method);
    
    const result = await finalizarVenda();
    
    if (result.success) {
      setSuccessMessage(`Venda finalizada com sucesso! Pedido: ${result.order.orderNumber}`);
      setPaymentModalOpen(false);
    } else {
      setPaymentModalOpen(false);
    }
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage('');
  };

  // Mock tables data
  const tables = [
    { id: 1, number: 1, capacity: 4, status: 'available' as const },
    { id: 2, number: 2, capacity: 2, status: 'occupied' as const },
    { id: 3, number: 3, capacity: 6, status: 'available' as const },
    { id: 4, number: 4, capacity: 4, status: 'reserved' as const },
    { id: 5, number: 5, capacity: 8, status: 'available' as const },
  ];

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', p: 0 }}>
      {/* Header */}
      <PDVHeader
        selectedCustomer={selectedCustomer}
        selectedTable={selectedTable}
        orderType={orderType}
        onEditCustomer={() => setCustomerModalOpen(true)}
        onEditTable={() => setTableModalOpen(true)}
      />

      <Grid container sx={{ height: 'calc(100vh - 80px)' }}>
        {/* Left Panel - Products */}
        <Grid item xs={8} sx={{ borderRight: 1, borderColor: 'divider' }}>
          {/* Filters */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Categoria"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <Category sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                >
                  <MenuItem value={0}>Todas as categorias</MenuItem>
                  {categories
                    .filter(cat => cat.isActive)
                    .map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>

            {/* Order Type Selector */}
            <Box mt={2}>
              <OrderTypeSelector
                selectedType={orderType}
                onTypeChange={selecionarTipoVenda}
              />
            </Box>
          </Box>

          {/* Product Grid */}
          <ProductGrid
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onAddProduct={handleAddProduct}
            searchTerm={searchTerm}
          />
        </Grid>

        {/* Right Panel - Cart */}
        <Grid item xs={4}>
          <Cart
            items={cart}
            onUpdateQuantity={atualizarQuantidade}
            onRemoveItem={removerProduto}
            onClearCart={limparCarrinho}
            onFinalizeSale={handleFinalizeSale}
            total={calcularTotal()}
            loading={pdvLoading} // Usar pdvLoading específico
          />
        </Grid>
      </Grid>

      {/* Modals */}
      <CustomerSelector
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        onSelect={selecionarCliente} // Agora é compatível
        selectedCustomer={selectedCustomer}
      />

      <TableSelector
        open={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        onSelect={selecionarMesa}
        tables={tables}
        selectedTable={selectedTable}
      />

      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onConfirm={handleConfirmPayment}
        total={calcularTotal()}
      />

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={limparPdvErro} // Usar nome correto
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={limparPdvErro}> {/* Usar nome correto */}
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={handleCloseSuccessMessage}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PDVPage;