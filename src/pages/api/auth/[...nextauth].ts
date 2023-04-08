import NextAuth, { AuthOptions } from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read offline.access tweet.write",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accountId = account.providerAccountId
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      return token
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.accountId = token.accountId
      session.refreshToken = token.refreshToken
      session.expiresAt = token.expiresAt
      return session
    },
  }
}

export default NextAuth(authOptions)
