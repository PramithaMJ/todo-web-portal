/**
 * Environment Configuration
 * Centralizes all environment variables with type safety and validation
 */

interface EnvironmentConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  enableMocks: boolean;
  oauthGoogleClientId: string;
  oauthGithubClientId: string;
  appEnv: 'development' | 'staging' | 'production';
}

/**
 * Validates and returns environment configuration
 * @throws Error if required environment variables are missing
 */
const getEnvConfig = (): EnvironmentConfig => {
  const config: EnvironmentConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    enableMocks: import.meta.env.VITE_ENABLE_MOCKS === 'true',
    oauthGoogleClientId: import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID || '',
    oauthGithubClientId: import.meta.env.VITE_OAUTH_GITHUB_CLIENT_ID || '',
    appEnv: (import.meta.env.VITE_APP_ENV as EnvironmentConfig['appEnv']) || 'development',
  };

  // Validate required fields in production
  if (config.appEnv === 'production') {
    if (!config.apiBaseUrl) {
      throw new Error('VITE_API_BASE_URL is required in production');
    }
  }

  return config;
};

export const env = getEnvConfig();

export const isDevelopment = env.appEnv === 'development';
export const isProduction = env.appEnv === 'production';
export const isStaging = env.appEnv === 'staging';
