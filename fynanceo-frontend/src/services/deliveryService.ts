// src/services/deliveryService.ts
import api from './api';
import { DeliveryOrder, DeliveryStats, UpdateDeliveryStatusDTO, AssignDeliveryPersonDTO, DeliveryFilters } from '../types/delivery';

export const deliveryService = {
  // Listar todas as entregas com filtros
  async listDeliveries(filters: DeliveryFilters = {}): Promise<DeliveryOrder[]> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date.toISOString());
    if (filters.type) params.append('type', filters.type);
    if (filters.deliveryPerson) params.append('deliveryPerson', filters.deliveryPerson);

    const response = await api.get(`/deliveries?${params.toString()}`);
    return response.data;
  },

  // Buscar entregas ativas (pendentes, em preparo, em rota)
  async getActiveDeliveries(): Promise<DeliveryOrder[]> {
    const response = await api.get('/deliveries/active');
    return response.data;
  },

  // Buscar entrega por ID
  async getDeliveryById(id: number): Promise<DeliveryOrder> {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  },

  // Atualizar status da entrega
  async updateDeliveryStatus(id: number, dto: UpdateDeliveryStatusDTO): Promise<void> {
    await api.patch(`/deliveries/${id}/status`, dto);
  },

  // Atribuir entregador
  async assignDeliveryPerson(id: number, dto: AssignDeliveryPersonDTO): Promise<void> {
    await api.patch(`/deliveries/${id}/assign`, dto);
  },

  // Obter estatísticas
  async getDeliveryStats(): Promise<DeliveryStats> {
    const response = await api.get('/deliveries/stats');
    return response.data;
  },

  // Atualizar tempo estimado de entrega
  async updateEstimatedTime(id: number, estimatedTime: Date): Promise<void> {
    await api.patch(`/deliveries/${id}/estimated-time`, { estimatedDeliveryTime: estimatedTime });
  }
};