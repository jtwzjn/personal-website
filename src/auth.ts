import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== 'github' || !profile) {
        return false
      }

      const adminGitHubId = process.env.ADMIN_GITHUB_ID
      if (!adminGitHubId) {
        console.error('ADMIN_GITHUB_ID is not configured')
        return false
      }

      const githubId = String((profile as { id: string | number }).id)
      return githubId === adminGitHubId
    },
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id
      }
      return session
    },
  },
})
