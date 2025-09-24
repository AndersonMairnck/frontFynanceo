import api from './api';
import { 
  OrderDTO, 
  CreateOrderDTO, 
  CreateOrderWithDeliveryDTO, 
  UpdateOrderStatusDTO,
  DeliveryStatsDTO 
} from '../types/order';

export const orderService = {
  // Listar pedidos com filtros
  async listar(params: {
    status?: string;
    customerId?: number;
    startDate?: Date;
    endDate?: Date;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<{ orders: OrderDTO[]; totalCount: number }> {
    const response = await api.get('/orders', { params });
    const totalCount = parseInt(response.headers['x-total-count'] || '0');
    return { orders: response.data, totalCount };
  },

  // Buscar pedido por ID
  async obterPorId(id: number): Promise<OrderDTO> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Criar pedido normal
  async criar(dto: CreateOrderDTO): Promise<OrderDTO> {
    const response = await api.post('/orders/create', dto);
    return response.data;
  },

  // Criar pedido com entrega
  async criarComEntrega(dto: CreateOrderWithDeliveryDTO): Promise<OrderDTO> {
    const response = await api.post('/orders/create-delivery', dto);
    return response.data;
  },

  // Atualizar status do pedido
  async atualizarStatus(id: number, dto: UpdateOrderStatusDTO): Promise<void> {
    await api.put(`/orders/${id}/status`, dto);
  },

  // Excluir pedido
  async excluir(id: number): Promise<void> {
    await api.delete(`/orders/${id}`);
  },

  // Obter estatísticas de entregas
  async obterEstatisticas(): Promise<DeliveryStatsDTO> {
    const response = await api.get('/orders/stats');
    return response.data;
  }
};