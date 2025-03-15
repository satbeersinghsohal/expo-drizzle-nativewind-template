import type { Config } from 'drizzle-kit';
export default {
  schema: './src//db/models',
  out: './src/db/migrations',
  driver: 'expo',
  dialect: 'sqlite',
} satisfies Config;
