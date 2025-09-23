import { useState, useCallback } from 'react';
import { Cliente, ClienteFormData } from '../types/cliente';
import { clienteService } from '../services/clienteService';

interface UseClientesReturn {
  clientes: Cliente[];
  cliente: Cliente | null;
  loading: boolean;
  error: string | null;
  carregarClientes: (page?: number, pageSize?: number, search?: string) => Promise<void>;
  carregarCliente: (id: number) => Promise<void>;
  criarCliente: (cliente: ClienteFormData) => Promise<Cliente>;
  atualizarCliente: (id: number, cliente: ClienteFormData) => Promise<Cliente>;
  inativarCliente: (id: number) => Promise<void>;
  ativarCliente: (id: number) => Promise<void>;
  limparErro: () => void;
}

export const useClientes = (): UseClientesReturn => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limparErro = useCallback(() => setError(null), []);

  const carregarClientes = useCallback(async (page = 1, pageSize = 10, search = '') => {
    try {
      setLoading(true);
      limparErro();
      const response = await clienteService.listar(page, pageSize, search);
      setClientes(response.items);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao carregar clientes: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const carregarCliente = useCallback(async (id: number) => {
    try {
      setLoading(true);
      limparErro();
      const data = await clienteService.obterPorId(id);
      setCliente(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao carregar cliente: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const criarCliente = useCallback(async (clienteData: ClienteFormData): Promise<Cliente> => {
    try {
      setLoading(true);
      limparErro();
      const novoCliente = await clienteService.criar(clienteData);
      setClientes(prev => [...prev, novoCliente]);
      return novoCliente;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao criar cliente: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const atualizarCliente = useCallback(async (id: number, clienteData: ClienteFormData): Promise<Cliente> => {
    try {
      setLoading(true);
      limparErro();
      const clienteAtualizado = await clienteService.atualizar(id, clienteData);
      
      setClientes(prev => prev.map(c => c.id === id ? clienteAtualizado : c));
      setCliente(clienteAtualizado);
      
      return clienteAtualizado;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao atualizar cliente: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [limparErro]);

  const inativarCliente = useCallback(async (id: number) => {
    try {
      setLoading(true);
      limparErro();
      await clienteService.inativar(id);
      
      setClientes(prev => prev.map(c => c.id === id ? { ...c, ativo: false } : c));
      if (cliente && cliente.id === id) {
        setCliente({ ...cliente, ativo: false });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao inativar cliente: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cliente, limparErro]);

  const ativarCliente = useCallback(async (id: number) => {
    try {
      setLoading(true);
      limparErro();
      await clienteService.ativar(id);
      
      setClientes(prev => prev.map(c => c.id === id ? { ...c, ativo: true } : c));
      if (cliente && cliente.id === id) {
        setCliente({ ...cliente, ativo: true });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao ativar cliente: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cliente, limparErro]);

  return {
    clientes,
    cliente,
    loading,
    error,
    carregarClientes,
    carregarCliente,
    criarCliente,
    atualizarCliente,
    inativarCliente,
    ativarCliente,
    limparErro
  };
};