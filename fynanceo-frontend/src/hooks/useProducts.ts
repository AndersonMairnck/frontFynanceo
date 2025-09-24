import { useState, useCallback } from 'react';
import { ProductDTO, CreateProductDTO, ProductFormData } from '../types/product';
import { productService } from '../services/productService';

interface UseProductsReturn {
  products: ProductDTO[];
  product: ProductDTO | null;
  loading: boolean;
  error: string | null;
  carregarProducts: (includeInactive?: boolean) => Promise<void>;
  carregarProduct: (id: number) => Promise<void>;
  criarProduct: (product: CreateProductDTO) => Promise<ProductDTO>;
  atualizarProduct: (id: number, product: CreateProductDTO) => Promise<ProductDTO>;
  desativarProduct: (id: number, motivo: string) => Promise<void>;
  ativarProduct: (id: number) => Promise<void>;
  limparErro: () => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limparErro = useCallback(() => setError(null), []);

  const carregarProducts = useCallback(async (includeInactive = false) => {
    try {
      console.log('🔄 useProducts: Iniciando carregamento...');
      setLoading(true);
      limparErro();
      const data = await productService.listar(includeInactive);
      console.log('✅ useProducts: Dados carregados:', data);
      setProducts(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar produtos';
      console.error('❌ useProducts: Erro:', errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 useProducts: Loading finalizado');
    }
  }, [limparErro]);

  const carregarProduct = useCallback(async (id: number) => {
    try {
      setLoading(true);
      limparErro();
      const data = await productService.obterPorId(id);
      setProduct(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar produto';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const criarProduct = useCallback(async (productData: CreateProductDTO): Promise<ProductDTO> => {
    try {
      setLoading(true);
      limparErro();
      const novoProduct = await productService.criar(productData);
      setProducts(prev => [...prev, novoProduct]);
      return novoProduct;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const atualizarProduct = useCallback(async (id: number, productData: CreateProductDTO): Promise<ProductDTO> => {
    try {
      setLoading(true);
      limparErro();
      const productAtualizado = await productService.atualizar(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? productAtualizado : p));
      setProduct(productAtualizado);
      return productAtualizado;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const desativarProduct = useCallback(async (id: number, motivo: string) => {
    try {
      setLoading(true);
      limparErro();
      await productService.desativar(id, motivo);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: false } : p));
      if (product?.id === id) {
        setProduct({ ...product, isActive: false });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao desativar produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [product, limparErro]);

  const ativarProduct = useCallback(async (id: number) => {
    try {
      setLoading(true);
      limparErro();
      await productService.ativar(id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isActive: true } : p));
      if (product?.id === id) {
        setProduct({ ...product, isActive: true });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao ativar produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [product, limparErro]);

  return {
    products,
    product,
    loading,
    error,
    carregarProducts,
    carregarProduct,
    criarProduct,
    atualizarProduct,
    desativarProduct,
    ativarProduct,
    limparErro
  };
};