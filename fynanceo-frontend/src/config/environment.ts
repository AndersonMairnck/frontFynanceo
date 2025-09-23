// Configurações baseadas no ambiente
interface EnvironmentConfig {
  API_BASE_URL: string;
  APP_VERSION: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  FEATURES: {
    DEBUG_MODE: boolean;
    ANALYTICS: boolean;
    MAINTENANCE_MODE: boolean;
  };
}

// Configurações padrão para desenvolvimento
const defaultConfig: EnvironmentConfig = {
  API_BASE_URL: 'http://localhost:5000/api',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: 'development',
  LOG_LEVEL: 'debug',
  FEATURES: {
    DEBUG_MODE: true,
    ANALYTICS: false,
    MAINTENANCE_MODE: false,
  },
};

// Configurações específicas por ambiente
const environmentConfigs: Record<string, Partial<EnvironmentConfig>> = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
    LOG_LEVEL: 'debug',
    FEATURES: {
      DEBUG_MODE: true,
      ANALYTICS: false,
      MAINTENANCE_MODE: false,
    },
  },
  staging: {
    API_BASE_URL: 'https://staging.api.fynanceo.com/api',
    ENVIRONMENT: 'staging',
    LOG_LEVEL: 'info',
    FEATURES: {
      DEBUG_MODE: false,
      ANALYTICS: true,
      MAINTENANCE_MODE: false,
    },
  },
  production: {
    API_BASE_URL: 'https://api.fynanceo.com/api',
    ENVIRONMENT: 'production',
    LOG_LEVEL: 'error',
    FEATURES: {
      DEBUG_MODE: false,
      ANALYTICS: true,
      MAINTENANCE_MODE: false,
    },
  },
};

// Obter configuração atual baseada no VITE_NODE_ENV
const currentEnv = import.meta.env.VITE_NODE_ENV || 'development';
const envConfig = environmentConfigs[currentEnv] || {};

export const config: EnvironmentConfig = {
  ...defaultConfig,
  ...envConfig,
};

// Validação de variáveis de ambiente obrigatórias
export const validateEnvironment = (): void => {
  const requiredEnvVars = ['VITE_API_BASE_URL'];
  
  requiredEnvVars.forEach((envVar) => {
    if (!import.meta.env[envVar] && !config.API_BASE_URL) {
      console.warn(`Variável de ambiente ${envVar} não está definida`);
    }
  });
};

// Helper para verificar features
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['FEATURES']): boolean => {
  return config.FEATURES[feature];
};

// Helper para logging condicional
export const logger = {
  debug: (...args: any[]) => {
    if (config.LOG_LEVEL === 'debug') {
      console.debug('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (['debug', 'info'].includes(config.LOG_LEVEL)) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (['debug', 'info', 'warn'].includes(config.LOG_LEVEL)) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};