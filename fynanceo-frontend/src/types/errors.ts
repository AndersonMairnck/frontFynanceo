import { AxiosError } from 'axios';

// Tipo personalizado para erros da API
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
  url?: string;
}

// Função helper para converter AxiosError para ApiError
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    return {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message
    };
  }
  
  return {
    message: 'Erro desconhecido'
  };
};