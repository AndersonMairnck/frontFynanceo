/**
 * Configurações da API
 * Explicação: Centralizamos todas as configurações relacionadas à API aqui
 */

// URL base da API - ajuste conforme seu ambiente
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5000/api';

// Configurações de CORS (se necessário)
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Verificar se a API está respondendo
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Customers`);
    return response.ok;
  } catch (error) {
    console.warn('⚠️ API não está respondendo:', error);
    return false;
  }
};