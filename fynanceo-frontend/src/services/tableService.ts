// src/services/tableService.ts
import api from './api';
import {  } from '../types/delivery';
import { Order,CreateOrderRequest, AddItemsRequest, ProcessPaymentRequest } from '../types/order';

export const tableService = {
  // Criar pedido sem pagamento
  async createOrderWithoutPayment(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const response = await api.post<Order>('/orders/create-without-payment', orderData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  // Adicionar itens a pedido existente
  async addItemsToOrder(request: AddItemsRequest): Promise<Order> {
    try {
      const response = await api.post<Order>(`/orders/${request.orderId}/add-items`, request);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar itens:', error);
      throw error;
    }
  },

  // Processar pagamento
  async processPayment(request: ProcessPaymentRequest): Promise<Order> {
    try {
      const response = await api.post<Order>(`/orders/${request.orderId}/process-payment`, request);
      return response.data;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  },

  // Buscar pedidos por mesa
  async getOrdersByTable(tableNumber: number): Promise<Order[]> {
    try {
      const response = await api.get<Order[]>(`/orders/table/${tableNumber}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos da mesa:', error);
      throw error;
    }
  }
};