import { useState, useCallback } from 'react';
import { Category, CategoryFormData } from '../types/category';
import { categoryService } from '../services/categoryService';

interface UseCategoriesReturn {
  categories: Category[];
  category: Category | null;
  loading: boolean;
  error: string | null;
  carregarCategories: () => Promise<void>;
  carregarCategory: (id: number) => Promise<void>;
  criarCategory: (category: CategoryFormData) => Promise<Category>;
  atualizarCategory: (id: number, category: CategoryFormData) => Promise<Category>;
  excluirCategory: (id: number) => Promise<void>;
  limparErro: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limparErro = useCallback(() => setError(null), []);

  const carregarCategories = useCallback(async () => {
    try {
      console.log('🔄 Hook: Carregando categorias...');
      setLoading(true);
      limparErro();
      const data = await categoryService.listar();
      setCategories(data);
      console.log('✅ Hook: Categorias carregadas com sucesso');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar categorias';
      console.error('❌ Hook: Erro ao carregar categorias:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('🔚 Hook: Loading finalizado');
    }
  }, [limparErro]);

  const carregarCategory = useCallback(async (id: number) => {
    try {
      setLoading(true);
      limparErro();
      const data = await categoryService.obterPorId(id);
      setCategory(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar categoria';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const criarCategory = useCallback(async (categoryData: CategoryFormData): Promise<Category> => {
    try {
      setLoading(true);
      limparErro();
      const novaCategory = await categoryService.criar(categoryData);
      setCategories(prev => [...prev, novaCategory]);
      return novaCategory;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar categoria';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const atualizarCategory = useCallback(async (id: number, categoryData: CategoryFormData): Promise<Category> => {
    try {
      setLoading(true);
      limparErro();
      const categoryAtualizada = await categoryService.atualizar(id, categoryData);
      setCategories(prev => prev.map(c => c.id === id ? categoryAtualizada : c));
      setCategory(categoryAtualizada);
      return categoryAtualizada;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar categoria';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const excluirCategory = useCallback(async (id: number) => {
    try {
      setLoading(true);
      limparErro();
      await categoryService.excluir(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      if (category?.id === id) {
        setCategory(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao excluir categoria';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [category, limparErro]);

  return {
    categories,
    category,
    loading,
    error,
    carregarCategories,
    carregarCategory,
    criarCategory,
    atualizarCategory,
    excluirCategory,
    limparErro
  };
};