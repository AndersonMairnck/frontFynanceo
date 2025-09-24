import { useState, useCallback } from 'react';
import { CartItem, OrderType, Table, CreateOrderDTO, CreateOrderWithDeliveryDTO, Customer } from '../types/order';
import { Product } from '../types/product';
import { orderService } from '../services/orderService';
import { Cliente } from '../types/cliente'; // Importar Cliente
import { convertClienteToCustomer } from '../utils/customerConverter'; // Importar conversor

interface UsePDVReturn {
  // Estado do PDV
  cart: CartItem[];
  selectedCustomer: Customer | null; // Manter Customer no retorno
  selectedTable: Table | null;
  orderType: OrderType;
  paymentMethod: string;
  loading: boolean;
  error: string | null;
  
  // Ações do Carrinho
  adicionarProduto: (product: Product) => void;
  removerProduto: (productId: number) => void;
  atualizarQuantidade: (productId: number, quantity: number) => void;
  limparCarrinho: () => void;
  
  // Ações de Configuração
  selecionarCliente: (customer: Cliente | null) => void; // Aceitar Cliente como parâmetro
  selecionarMesa: (table: Table | null) => void;
  selecionarTipoVenda: (type: OrderType) => void;
  selecionarFormaPagamento: (method: string) => void;
  
  // Ações de Pedido
  finalizarVenda: () => Promise<{ success: boolean; order?: any; error?: string }>;
  calcularTotal: () => number;
  calcularTroco: (valorRecebido: number) => number;
  limparErro: () => void;
}

export const usePDV = (): UsePDVReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null); // Estado interno como Customer
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('dinein');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adicionar produto ao carrinho
  const adicionarProduto = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Se já existe, aumenta a quantidade
        return prevCart.map(item =>
          item.productId === product.id
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price
              }
            : item
        );
      } else {
        // Se não existe, adiciona novo item
        return [
          ...prevCart,
          {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
            total: product.price,
            stock: product.stockQuantity
          }
        ];
      }
    });
  }, []);

  // Remover produto do carrinho
  const removerProduto = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  }, []);

  // Atualizar quantidade do produto
  const atualizarQuantidade = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removerProduto(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { 
              ...item, 
              quantity,
              total: quantity * item.price
            }
          : item
      )
    );
  }, [removerProduto]);

  // Limpar carrinho
  const limparCarrinho = useCallback(() => {
    setCart([]);
  }, []);

  // Selecionar cliente
  const selecionarCliente = useCallback((customer: Cliente | null) => {
    if (customer) {
      const convertedCustomer = convertClienteToCustomer(customer);
      setSelectedCustomer(convertedCustomer);
    } else {
      setSelectedCustomer(null);
    }
  }, []);

  // Selecionar mesa
  const selecionarMesa = useCallback((table: Table | null) => {
    setSelectedTable(table);
  }, []);

  // Selecionar tipo de venda
  const selecionarTipoVenda = useCallback((type: OrderType) => {
    setOrderType(type);
    // Se for consumo local, limpa mesa selecionada
    if (type !== 'dinein') {
      setSelectedTable(null);
    }
  }, []);

  // Selecionar forma de pagamento
  const selecionarFormaPagamento = useCallback((method: string) => {
    setPaymentMethod(method);
  }, []);

  // Calcular total do carrinho
  const calcularTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.total, 0);
  }, [cart]);

  // Calcular troco
  const calcularTroco = useCallback((valorRecebido: number) => {
    return Math.max(0, valorRecebido - calcularTotal());
  }, [calcularTotal]);

  // Finalizar venda
  const finalizarVenda = useCallback(async () => {
    if (cart.length === 0) {
      return { success: false, error: 'Carrinho vazio' };
    }

    if (!paymentMethod) {
      return { success: false, error: 'Selecione uma forma de pagamento' };
    }

    setLoading(true);
    setError(null);

    try {
      const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      }));

      let order;
      
      if (orderType === 'delivery') {
        // Pedido com entrega
        const dto: CreateOrderWithDeliveryDTO = {
          customerId: selectedCustomer?.id,
          paymentMethod,
          items,
          deliveryInfo: {
            deliveryType: 'Delivery',
            customerPhone: selectedCustomer?.telefone,
            deliveryAddress: selectedCustomer?.enderecos?.find(e => e.principal)?.logradouro || ''
          }
        };
        order = await orderService.criarComEntrega(dto);
      } else {
        // Pedido normal
        const deliveryType = orderType === 'dinein' ? 'ConsumoLocal' : 'Retirada';
        
        const dto: CreateOrderDTO = {
          customerId: selectedCustomer?.id,
          paymentMethod,
          deliveryType,
          items
        };
        order = await orderService.criar(dto);
      }

      // Limpar estado após venda bem-sucedida
      limparCarrinho();
      setSelectedCustomer(null);
      setSelectedTable(null);
      setPaymentMethod('');

      return { success: true, order };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar venda';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [cart, paymentMethod, orderType, selectedCustomer, limparCarrinho]);

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    cart,
    selectedCustomer,
    selectedTable,
    orderType,
    paymentMethod,
    loading,
    error,
    
    // Ações
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
    calcularTroco,
    limparErro
  };
};