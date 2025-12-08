import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import { prisma } from "./lib/prisma"
import { Role } from "@prisma/client"
import errorResponse from "./lib/error"

const providers: Provider[] = [Google]

export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider()
            return { id: providerData.id, name: providerData.name }
        } else {
            return { id: provider.id, name: provider.name }
        }
    })
    .filter((provider) => provider.id !== "credentials")

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers,
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async authorized({ request, auth }) {
            const isAdmin = auth?.user.role === Role.ADMIN

            if (request.nextUrl.pathname.startsWith("/api/admin")) {
                if (!isAdmin) {
                    return errorResponse(401, "Not Authorized")
                }
            }

            if (request.nextUrl.pathname.startsWith("/admin")) {
                // If path is admin and user is not admin, redirect
                if (!isAdmin) {
                    return Response.redirect(new URL("/auth/signin", request.url))
                }
                return !!auth
            }

            return true
        },
        async session({ session, user }) {
            session.user.role = user.role
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
})