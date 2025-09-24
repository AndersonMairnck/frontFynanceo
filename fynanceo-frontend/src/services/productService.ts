import api from './api';
import { ProductDTO, CreateProductDTO, PaginatedProductResponse, DeactivateRequest } from '../types/product'; // Corrigir caminho
export const productService = {
  // Listar produtos (com opção de incluir inativos)
  async listar(includeInactive = false): Promise<ProductDTO[]> {
    const response = await api.get('/products', {
      params: { includeInactive }
    });
    return response.data;
  },

  // Buscar produto por ID
  async obterPorId(id: number): Promise<ProductDTO> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Criar novo produto
  async criar(produto: CreateProductDTO): Promise<ProductDTO> {
    const response = await api.post('/products', produto);
    return response.data;
  },

  // Atualizar produto existente
  async atualizar(id: number, produto: CreateProductDTO): Promise<ProductDTO> {
    const response = await api.put(`/products/${id}`, produto);
    return response.data;
  },

  // Desativar produto
  async desativar(id: number, motivo: string): Promise<void> {
    const request: DeactivateRequest = { reason: motivo };
    await api.patch(`/products/deactivate/${id}`, request);
  },

  // Ativar produto
  async ativar(id: number): Promise<void> {
    await api.patch(`/products/activate/${id}`);
  }
};