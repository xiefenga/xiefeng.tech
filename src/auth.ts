import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { env } from './env.mjs'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth }) {
      return Boolean(auth?.user)
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials
        if (username === env.ADMIN_ACCOUNT && password === env.ADMIN_PASSWORD) {
          return {
            id: username,
            name: 'admin',
          }
        }
        return null
      },
    }),
  ],
})
