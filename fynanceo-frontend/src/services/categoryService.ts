import api from './api';
import { Category, CategoryFormData, PaginatedCategoryResponse } from '../types/category';

export const categoryService = {
  async listar(): Promise<Category[]> {
    try {
      console.log('🔄 Buscando categorias da API...');
      const response = await api.get('/categories');
      console.log('✅ Categorias carregadas:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao carregar categorias:', error);
      throw error;
    }
  },

  async obterPorId(id: number): Promise<Category> {
    try {
      console.log(`🔄 Buscando categoria ${id}...`);
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao carregar categoria ${id}:`, error);
      throw error;
    }
  },

  async criar(categoria: CategoryFormData): Promise<Category> {
    try {
      console.log('🔄 Criando nova categoria...', categoria);
      const response = await api.post('/categories', categoria);
      console.log('✅ Categoria criada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar categoria:', error);
      throw error;
    }
  },

  async atualizar(id: number, categoria: CategoryFormData): Promise<Category> {
    try {
      console.log(`🔄 Atualizando categoria ${id}...`, categoria);
      const response = await api.put(`/categories/${id}`, categoria);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao atualizar categoria ${id}:`, error);
      throw error;
    }
  },

  async excluir(id: number): Promise<void> {
    try {
      console.log(`🔄 Excluindo categoria ${id}...`);
      await api.delete(`/categories/${id}`);
      console.log('✅ Categoria excluída');
    } catch (error) {
      console.error(`❌ Erro ao excluir categoria ${id}:`, error);
      throw error;
    }
  }
};