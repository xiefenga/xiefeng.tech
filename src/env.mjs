import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
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
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    BEIAN_ICP: process.env.BEIAN_ICP,
    GITHUB_URL: process.env.GITHUB_URL,
    LEGACY_SITE_URL: process.env.LEGACY_SITE_URL,
    SITE_START_YEAR: process.env.SITE_START_YEAR,
    SITE_AUTHOR: process.env.SITE_AUTHOR,
    JUEJIN_URL: process.env.JUEJIN_URL,
    ZHIHU_URL: process.env.ZHIHU_URL,
    EMAIL_URL: process.env.EMAIL_URL,
    SITE_URL: process.env.SITE_URL,
    ADMIN_ACCOUNT: process.env.ADMIN_ACCOUNT,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
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
