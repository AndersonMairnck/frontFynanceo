import axios, { AxiosError } from 'axios';

/**
 * Configuração base do axios para comunicação com a API C#
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Sua URL atual
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação se necessário
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🔄 Fazendo requisição: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro na configuração da requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Resposta recebida: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error: AxiosError) => { // Especificar o tipo AxiosError
    console.error('❌ Erro na resposta da API:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Tratamento de erros específicos
    if (error.response) {
      // A API respondeu com erro
      switch (error.response.status) {
        case 400:
          throw new Error(`Dados inválidos: ${JSON.stringify(error.response.data)}`);
        case 401:
          window.location.href = '/login';
          throw new Error('Não autorizado');
        case 404:
          throw new Error('Recurso não encontrado');
        case 500:
          throw new Error('Erro interno do servidor');
        default:
          throw new Error(`Erro ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      throw new Error('Sem resposta do servidor. Verifique sua conexão.');
    } else {
      // Outro tipo de erro
      throw new Error('Erro na configuração da requisição');
    }
  }
);

export default api;