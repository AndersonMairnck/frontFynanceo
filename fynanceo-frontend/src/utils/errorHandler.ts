// Tipos de erro personalizados
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Handler global de erros
export const handleError = (error: unknown): AppError => {
  console.error('Erro capturado:', error);

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  return new AppError('Erro desconhecido', 'UNKNOWN_ERROR', 500);
};

// Handler para erros de API
export const handleApiError = (error: any): AppError => {
  if (error.response) {
    // Erro da resposta da API
    const { data, status } = error.response;
    return new AppError(
      data?.message || `Erro ${status}`,
      data?.code || 'API_ERROR',
      status,
      data?.details
    );
  }

  if (error.request) {
    // Erro de rede
    return new AppError(
      'Erro de conexão. Verifique sua internet.',
      'NETWORK_ERROR',
      0
    );
  }

  // Outros erros
  return handleError(error);
};