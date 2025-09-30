// src/hooks/useTableManagement.ts
import { useState, useCallback } from 'react';
import { Order, CreateOrderItemDTO } from '../types/order';
import { tableService } from '../services/tableService';
import { Product } from '../types/product';

interface UseTableManagementReturn {
  // Estado
  tableOrders: { [key: number]: Order[] };
  loading: boolean;
  error: string | null;
  
  // Ações
  loadTableOrders: (tableNumber: number) => Promise<void>;
  createOrder: (tableNumber: number, orderType?: string) => Promise<Order>;
  addItemsToOrder: (orderId: number, items: CreateOrderItemDTO[]) => Promise<Order>;
  processPayment: (orderId: number, paymentMethod: string, amount: number) => Promise<Order>;
  clearError: () => void;
}

export const useTableManagement = (): UseTableManagementReturn => {
  const [tableOrders, setTableOrders] = useState<{ [key: number]: Order[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar pedidos de uma mesa específica
  const loadTableOrders = useCallback(async (tableNumber: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const orders = await tableService.getOrdersByTable(tableNumber);
      setTableOrders(prev => ({
        ...prev,
        [tableNumber]: orders
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Erro ao carregar pedidos da mesa ${tableNumber}`;
      setError(errorMessage);
      console.error(`Erro ao carregar pedidos da mesa ${tableNumber}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar novo pedido
  const createOrder = useCallback(async (tableNumber: number, orderType: string = 'Mesa'): Promise<Order> => {
    setLoading(true);
    setError(null);
    
    try {
      const newOrder = await tableService.createOrderWithoutPayment({
        tableNumber,
        orderType
      });
      
      // Atualizar estado local
      setTableOrders(prev => ({
        ...prev,
        [tableNumber]: [...(prev[tableNumber] || []), newOrder]
      }));
      
      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pedido';
      setError(errorMessage);
      console.error('Erro ao criar pedido:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Adicionar itens ao pedido (usando mesma lógica do PDV)
  const addItemsToOrder = useCallback(async (orderId: number, items: CreateOrderItemDTO[]): Promise<Order> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedOrder = await tableService.addItemsToOrder({
        orderId,
        items
      });
      
      // Atualizar estado local
      if (updatedOrder.tableNumber) {
        setTableOrders(prev => ({
          ...prev,
          [updatedOrder.tableNumber!]: (prev[updatedOrder.tableNumber!] || []).map(order =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        }));
      }
      
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar itens';
      setError(errorMessage);
      console.error('Erro ao adicionar itens:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Processar pagamento
  const processPayment = useCallback(async (orderId: number, paymentMethod: string, amount: number): Promise<Order> => {
    setLoading(true);
    setError(null);
    
    try {
      const paidOrder = await tableService.processPayment({
        orderId,
        paymentMethod,
        amount
      });
      
      // Atualizar estado local
      if (paidOrder.tableNumber) {
        setTableOrders(prev => ({
          ...prev,
          [paidOrder.tableNumber!]: (prev[paidOrder.tableNumber!] || []).map(order =>
            order.id === paidOrder.id ? paidOrder : order
          )
        }));
      }
      
      return paidOrder;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      setError(errorMessage);
      console.error('Erro ao processar pagamento:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tableOrders,
    loading,
    error,
    loadTableOrders,
    createOrder,
    addItemsToOrder,
    processPayment,
    clearError
  };
};