import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

const serverEnvs = {
  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (str) => !str.includes('YOUR_MYSQL_URL_HERE'),
      'You forgot to change the default URL',
    ),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  BEIAN_ICP: z.string(),
  LEGACY_SITE_URL: z.string().url(),
  SITE_START_YEAR: z.string().transform((str) => parseInt(str, 10)),
  SITE_AUTHOR: z.string(),
  GITHUB_URL: z.string().url(),
  JUEJIN_URL: z.string().url(),
  ZHIHU_URL: z.string().url(),
  EMAIL_URL: z.string().email(),
  SITE_URL: z.string().url().default('http://localhost:3000'),
  ADMIN_ACCOUNT: z.string(),
  ADMIN_PASSWORD: z.string(),
}

export const env = createEnv({
  server: {
    ...serverEnvs,
  },
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  runtimeEnv: {
    ...Object.keys(serverEnvs).reduce((runtimeServerEnvs, key) => ({
      ...runtimeServerEnvs,
      [key]: process.env[key],
    }), /** @type{Record<keyof  serverEnvs, string>}*/ ({})),
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
