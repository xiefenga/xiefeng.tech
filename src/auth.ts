import NextAuth from 'next-auth'
import Github from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

import { prisma } from '@/server/db'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
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
    Github,
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials as Record<string, string>
        if (!username || !password) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: {
            username,
            password,
          },
        })
        if (!user) {
          return null
        }
        return {
          id: user.id.toString(),
          image: user.avatar,
          name: user.username,
        }
      },
    }),
  ],
})
