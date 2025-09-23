export interface RetryConfig {
  maxRetries: number;
  delay: number;
  backoffMultiplier: number;
}

const defaultConfig: RetryConfig = {
  maxRetries: 3,
  delay: 1000,
  backoffMultiplier: 2
};

export const retry = async <T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> => {
  const { maxRetries, delay, backoffMultiplier } = { ...defaultConfig, ...config };
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }

      const waitTime = delay * Math.pow(backoffMultiplier, attempt - 1);
      console.warn(`Tentativa ${attempt} falhou. Tentando novamente em ${waitTime}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
};