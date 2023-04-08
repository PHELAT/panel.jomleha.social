import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accountId: string | undefined,
    accessToken: string | undefined
    refreshToken: string | undefined,
    expiresAt: number | undefined,
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accountId: string | undefined,
    accessToken: string | undefined,
    refreshToken: string | undefined,
    expiresAt: number | undefined,
  }
}
