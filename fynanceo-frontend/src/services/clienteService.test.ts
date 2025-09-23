import api from './api';
import { Cliente, ClienteFormData, PaginatedResponse } from '@/types/cliente';

// Serviço com todas as operações de cliente
export const clienteService = {
  // Listar clientes com paginação
  async listar(page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Cliente>> {
    try {
      const response = await api.get('/clientes', {
        params: { page, pageSize, search }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  },

  // Buscar cliente por ID
  async obterPorId(id: number): Promise<Cliente> {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar cliente ${id}:`, error);
      throw error;
    }
  },

  // Criar novo cliente
  async criar(cliente: ClienteFormData): Promise<Cliente> {
    try {
      const response = await api.post('/clientes', cliente);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  // Atualizar cliente existente
  async atualizar(id: number, cliente: ClienteFormData): Promise<Cliente> {
    try {
      
      const response = await api.put(`/clientes/${id}`, cliente);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar cliente ${id}:`, error);
      throw error;
    }
  },

  // Inativar cliente (exclusão lógica)
  async inativar(id: number): Promise<void> {
    try {
      await api.patch(`/clientes/${id}/inativar`);
    } catch (error) {
      console.error(`Erro ao inativar cliente ${id}:`, error);
      throw error;
    }
  },

  // Ativar cliente
  async ativar(id: number): Promise<void> {
    try {
      await api.patch(`/clientes/${id}/ativar`);
    } catch (error) {
      console.error(`Erro ao ativar cliente ${id}:`, error);
      throw error;
    }
  }
};