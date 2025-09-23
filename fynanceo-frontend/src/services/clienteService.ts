import api from './api';
import { Cliente, ClienteFormData, PaginatedResponse } from '../types/cliente';
import { ClienteAPI, ClienteFormDataAPI } from '../types/cliente';
import { 
  mapClienteAPIToCliente, 
  mapClienteFormDataToAPI, 
  mapClienteFormDataToAPIForCreate,
  mapClientesAPIToClientes 
} from '../utils/mappers';
import { AxiosError } from 'axios'; // Importar AxiosError
import { handleApiError, ApiError } from '../types/errors';
export const clienteService = {
  async listar(page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Cliente>> {
    try {
      console.log(`📋 Buscando clientes - página ${page}, busca: "${search}"`);
      
      const response = await api.get<ClienteAPI[]>('/Customers');
      
      let clientesAPI = response.data;
      
      if (search) {
        clientesAPI = clientesAPI.filter(cliente =>
          cliente.name.toLowerCase().includes(search.toLowerCase()) ||
          cliente.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const clientesPaginados = clientesAPI.slice(startIndex, endIndex);
      
      const clientes = mapClientesAPIToClientes(clientesPaginados);
      
      return {
        items: clientes,
        totalCount: clientesAPI.length,
        pageNumber: page,
        pageSize: pageSize,
        totalPages: Math.ceil(clientesAPI.length / pageSize)
      };
      
    } catch (error) {
      console.error('❌ Erro ao buscar clientes:', error);
      throw error;
    }
  },

  async obterPorId(id: number): Promise<Cliente> {
    try {
      console.log(`🔍 Buscando cliente ID: ${id}`);
      
      const response = await api.get<ClienteAPI>(`/Customers/${id}`);
      return mapClienteAPIToCliente(response.data);
      
    } catch (error) {
      console.error(`❌ Erro ao buscar cliente ${id}:`, error);
      throw error;
    }
  },

  async criar(clienteData: ClienteFormData): Promise<Cliente> {
    try {
      console.log('➕ Criando novo cliente');
      
      const clienteAPI: ClienteFormDataAPI = mapClienteFormDataToAPIForCreate(clienteData);
      
      console.log('📤 Dados sendo enviados para criação:', clienteAPI);
      
      const response = await api.post<ClienteAPI>('/Customers', clienteAPI);
      return mapClienteAPIToCliente(response.data);
      
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      throw error;
    }
  },

  async atualizar(id: number, clienteData: ClienteFormData): Promise<Cliente> {
    try {
      console.log(`✏️ Atualizando cliente ID: ${id}`);
      
      // PRIMEIRO: Buscar o cliente existente para obter todos os dados
      const clienteExistente = await api.get<ClienteAPI>(`/Customers/${id}`);
      
      // SEGUNDO: Mapear os dados do formulário + dados existentes
      const clienteAPI: ClienteFormDataAPI = mapClienteFormDataToAPI(clienteData, clienteExistente.data);
      
      console.log('📤 Dados sendo enviados para atualização:', clienteAPI);
      
      // TERCEIRO: Fazer o PUT com dados completos
      const response = await api.put<ClienteAPI>(`/Customers/${id}`, clienteAPI);
      return mapClienteAPIToCliente(response.data);
      
    }  catch (error) {
    const apiError = handleApiError(error);
    
    console.error(`❌ Erro ao atualizar cliente ${id}:`, apiError.message);
    console.error('📋 Detalhes do erro:', apiError);
    
    throw new Error(apiError.message);
      
      // // Log mais detalhado do erro - agora com type casting seguro
      // if (axiosError.response) {
      //   console.error('📋 Detalhes do erro:', {
      //     status: axiosError.response.status,
      //     data: axiosError.response.data,
      //     headers: axiosError.response.headers
      //   });
      // }
      
      // throw error;
    }
  },

  async inativar(id: number): Promise<void> {
    try {
      console.log(`🚫 Inativando cliente ID: ${id}`);
      await api.delete(`/Customers/${id}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Erro ao inativar cliente ${id}:`, axiosError.message);
      throw error;
    }
  },

  async ativar(id: number): Promise<void> {
    try {
      console.log(`✅ Ativando cliente ID: ${id}`);
      
      const clienteExistente = await this.obterPorId(id);
      
      const clienteAtivado: ClienteFormData = {
        nome: clienteExistente.nome,
        email: clienteExistente.email,
        telefone: clienteExistente.telefone,
        cpfCnpj: clienteExistente.cpfCnpj,
        tipoPessoa: clienteExistente.tipoPessoa,
        dataNascimento: clienteExistente.dataNascimento,
        ativo: true,
        observacoes: clienteExistente.observacoes,
        enderecos: clienteExistente.enderecos
      };
      
      await this.atualizar(id, clienteAtivado);
      
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`❌ Erro ao ativar cliente ${id}:`, axiosError.message);
      throw error;
    }
  }
};