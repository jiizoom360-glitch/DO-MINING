import { z } from 'zod';

const ProviderModeSchema = z.enum(['mock', 'manual', 'real']).default('mock');

const ServerEnvSchema = z.object({
  // Base configuration
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Modes
  INTEGRATION_MODE: ProviderModeSchema,
  STORAGE_MODE: ProviderModeSchema,
  LIVE_SESSION_MODE: z.enum(['mock', 'manual', 'real']).default('manual'),
  DEPLOYMENT_MODE: ProviderModeSchema,
  REPOSITORY_MODE: ProviderModeSchema,
  DNS_MODE: ProviderModeSchema,

  // Supabase (Server)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // R2 (Server)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_PUBLIC_BASE_URL: z.string().url().optional(),
}).refine(data => {
  if (data.STORAGE_MODE === 'real') {
    return !!(data.R2_ACCOUNT_ID && data.R2_BUCKET_NAME && data.R2_ACCESS_KEY_ID && data.R2_SECRET_ACCESS_KEY);
  }
  return true;
}, {
  message: "R2 credentials are required when STORAGE_MODE is 'real'",
});

const PublicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;
export type PublicEnv = z.infer<typeof PublicEnvSchema>;

export function getServerEnv(): ServerEnv {
  if (typeof process === 'undefined') {
    throw new Error('getServerEnv can only be called on the server');
  }

  const parsed = ServerEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid server environment variables:', parsed.error.format());
    throw new Error('Invalid server environment variables');
  }

  return parsed.data;
}

export function getPublicEnv(): PublicEnv {
  const publicVars = {
    NEXT_PUBLIC_APP_URL: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_APP_URL : (globalThis as any).NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : (globalThis as any).NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : (globalThis as any).NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const parsed = PublicEnvSchema.safeParse(publicVars);
  
  if (!parsed.success) {
    console.error('❌ Invalid public environment variables:', parsed.error.format());
    throw new Error('Invalid public environment variables');
  }

  return parsed.data;
}
