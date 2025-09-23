// Interface que corresponde exatamente ao Customer da API C#
export interface ClienteAPI {
  id: number;
  name: string;           // Note: 'name' em vez de 'nome'
  email: string;
  phone: string;          // Note: 'phone' em vez de 'telefone'
  createdAt: string;      // Vem como string da API
  updatedAt?: string;
  isActive: boolean;      // Note: 'isActive' em vez de 'ativo'
   cpfCnpj: string;
  tipoPessoa: string;
  // Endereço (campos diretos em vez de array)
  rua: string;            // Note: 'rua' em vez de 'logradouro'
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;

}

// Interface para o formulário (sem id e createdAt)
export type ClienteFormDataAPI = Omit<ClienteAPI, 'id' | 'createdAt' | 'updatedAt'>;

// Nossa interface original (mantemos para compatibilidade)
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  tipoPessoa: 'FISICA' | 'JURIDICA';
  dataCadastro: Date;
  dataNascimento?: Date;
  ativo: boolean;
  observacoes?: string;
  enderecos: Endereco[];
}

export interface Endereco {
  id?: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
}

export type ClienteFormData = Omit<Cliente, 'id' | 'dataCadastro'>;

// Interfaces de resposta
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}