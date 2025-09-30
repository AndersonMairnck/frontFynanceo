// src/hooks/useOrders.ts
import { useState, useEffect, useCallback } from 'react';
import { DeliveryOrder, DeliveryStats, DeliveryFilters, UpdateDeliveryStatusDTO } from '../types/delivery';
import { deliveryService } from '../services/deliveryService';

interface UseOrdersReturn {
  // Estado
  orders: DeliveryOrder[];
  activeOrders: DeliveryOrder[];
  selectedOrder: DeliveryOrder | null;
  stats: DeliveryStats | null;
  loading: boolean;
  error: string | null;
  filters: DeliveryFilters;
  
  // Ações
  loadOrders: (filters?: DeliveryFilters) => Promise<void>;
  loadActiveOrders: () => Promise<void>;
  loadStats: () => Promise<void>;
  selectOrder: (order: DeliveryOrder | null) => void;
  updateOrderStatus: (orderId: number, status: string, notes?: string) => Promise<boolean>;
  assignDeliveryPerson: (orderId: number, deliveryPerson: string) => Promise<boolean>;
  updateFilters: (newFilters: DeliveryFilters) => void;
  clearError: () => void;
}

// Dados mock para desenvolvimento (ATUALIZADO com productId)
const mockOrders: DeliveryOrder[] = [
  {
    id: 1,
    orderId: 1001,
    orderNumber: 'PED-20231201-0001',
    customerName: 'João Silva',
    customerPhone: '(11) 99999-9999',
    customerAddress: 'Rua das Flores, 123 - Centro - São Paulo/SP',
    deliveryPerson: 'Carlos Entregador',
    status: 'Pendente',
    deliveryFee: 5.00,
    estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000),
    actualDeliveryTime: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderAmount: 45.50,
    orderItems: [
      { 
        productId: 1, // ✅ ADICIONADO
        productName: 'Pizza Calabresa', 
        quantity: 1, 
        unitPrice: 35.00, 
        totalPrice: 35.00 
      },
      { 
        productId: 2, // ✅ ADICIONADO
        productName: 'Coca-Cola 2L', 
        quantity: 1, 
        unitPrice: 10.50, 
        totalPrice: 10.50 
      }
    ]
  },
  {
    id: 2,
    orderId: 1002,
    orderNumber: 'PED-20231201-0002',
    customerName: 'Maria Santos',
    customerPhone: '(11) 98888-8888',
    customerAddress: 'Av. Paulista, 1000 - Bela Vista - São Paulo/SP',
    deliveryPerson: 'Não atribuído',
    status: 'EmPreparo',
    deliveryFee: 7.00,
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
    actualDeliveryTime: null,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(),
    orderAmount: 68.00,
    orderItems: [
      { 
        productId: 3, // ✅ ADICIONADO
        productName: 'Hambúrguer Artesanal', 
        quantity: 2, 
        unitPrice: 25.00, 
        totalPrice: 50.00 
      },
      { 
        productId: 4, // ✅ ADICIONADO
        productName: 'Batata Frita', 
        quantity: 1, 
        unitPrice: 18.00, 
        totalPrice: 18.00 
      }
    ]
  }
];

const mockStats: DeliveryStats = {
  totalDeliveries: 156,
  pendingDeliveries: 8,
  inProgressDeliveries: 12,
  completedDeliveries: 136,
  todayDeliveries: 23,
  averageDeliveryTime: 35.5
};

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<DeliveryOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DeliveryFilters>({});

  // Função para validar e garantir que orderItems existe
  const validateOrderItems = (order: DeliveryOrder): DeliveryOrder => {
    return {
      ...order,
      orderItems: order.orderItems || [] // Garante que orderItems é um array
    };
  };

  // Carregar pedidos com filtros
  const loadOrders = useCallback(async (newFilters?: DeliveryFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      
      // Tentar carregar da API, se falhar usar dados mock
      let ordersData: DeliveryOrder[];
      try {
        ordersData = await deliveryService.listDeliveries(filtersToUse);
        // Validar os dados da API
        ordersData = ordersData.map(validateOrderItems);
      } catch (apiError) {
        console.warn('API não disponível, usando dados mock:', apiError);
        // Filtrar dados mock baseado nos filtros
        ordersData = mockOrders.filter(order => {
          if (filtersToUse.status && order.status !== filtersToUse.status) return false;
          if (filtersToUse.date) {
            const orderDate = new Date(order.createdAt).toDateString();
            const filterDate = new Date(filtersToUse.date).toDateString();
            if (orderDate !== filterDate) return false;
          }
          return true;
        });
      }
      
      setOrders(ordersData);
      
      if (newFilters) {
        setFilters(newFilters);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Carregar pedidos ativos
  const loadActiveOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Tentar carregar da API, se falhar usar dados mock
      let activeOrdersData: DeliveryOrder[];
      try {
        activeOrdersData = await deliveryService.getActiveDeliveries();
        // Validar os dados da API
        activeOrdersData = activeOrdersData.map(validateOrderItems);
      } catch (apiError) {
        console.warn('API não disponível, usando dados mock:', apiError);
        activeOrdersData = mockOrders.filter(order => 
          ['Pendente', 'EmPreparo', 'EmRota', 'SaiuParaEntrega'].includes(order.status)
        );
      }
      
      setActiveOrders(activeOrdersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos ativos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    setError(null);
    
    try {
      // Tentar carregar da API, se falhar usar dados mock
      let statsData: DeliveryStats;
      try {
        statsData = await deliveryService.getDeliveryStats();
      } catch (apiError) {
        console.warn('API não disponível, usando dados mock:', apiError);
        statsData = mockStats;
      }
      
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    }
  }, []);

  // Atualizar status do pedido
  const updateOrderStatus = useCallback(async (orderId: number, status: string, notes?: string): Promise<boolean> => {
    setError(null);
    
    try {
      // Tentar atualizar na API
      try {
        await deliveryService.updateDeliveryStatus(orderId, { status, notes });
      } catch (apiError) {
        console.warn('API não disponível, atualizando apenas localmente:', apiError);
      }
      
      // Atualizar lista local (mesmo se a API falhar)
      const updatedOrder = { 
        status, 
        updatedAt: new Date(),
        ...(notes && { notes })
      };
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...validateOrderItems(order), ...updatedOrder } : order
      ));
      
      setActiveOrders(prev => prev.map(order => 
        order.id === orderId ? { ...validateOrderItems(order), ...updatedOrder } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...validateOrderItems(prev), ...updatedOrder } : null);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    }
  }, [selectedOrder]);

  // Atribuir entregador
  const assignDeliveryPerson = useCallback(async (orderId: number, deliveryPerson: string): Promise<boolean> => {
    setError(null);
    
    try {
      // Tentar atualizar na API
      try {
        await deliveryService.assignDeliveryPerson(orderId, { deliveryPerson });
      } catch (apiError) {
        console.warn('API não disponível, atualizando apenas localmente:', apiError);
      }
      
      // Atualizar lista local
      const updatedOrder = { 
        deliveryPerson, 
        updatedAt: new Date() 
      };
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...validateOrderItems(order), ...updatedOrder } : order
      ));
      
      setActiveOrders(prev => prev.map(order => 
        order.id === orderId ? { ...validateOrderItems(order), ...updatedOrder } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...validateOrderItems(prev), ...updatedOrder } : null);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atribuir entregador');
      return false;
    }
  }, [selectedOrder]);

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: DeliveryFilters) => {
    setFilters(newFilters);
    loadOrders(newFilters);
  }, [loadOrders]);

  // Selecionar pedido
  const selectOrder = useCallback((order: DeliveryOrder | null) => {
    setSelectedOrder(order ? validateOrderItems(order) : null);
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadOrders();
    loadActiveOrders();
    loadStats();
  }, []);

  return {
    orders,
    activeOrders,
    selectedOrder,
    stats,
    loading,
    error,
    filters,
    loadOrders,
    loadActiveOrders,
    loadStats,
    selectOrder,
    updateOrderStatus,
    assignDeliveryPerson,
    updateFilters,
    clearError
  };
};