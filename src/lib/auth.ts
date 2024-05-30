import { NextAuthOptions } from "next-auth"
import EmailProvider, { SendVerificationRequestParams } from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { createTransport } from "nodemailer"
import { prisma } from "../../prisma"
import { html, text } from "@/app/utils/emailTemplate"

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
      maxAge: 60 * 60,
      sendVerificationRequest: async (params: SendVerificationRequestParams) => {
        const { identifier, url, provider } = params
        const { host } = new URL(url)
        // NOTE: You are not required to use `nodemailer`, use whatever you want.
        const transport = createTransport(provider.server)
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: text({ url, host }),
          html: html({ url, host }),
        })
        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
        }
      }
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token, user }) {
      // Add custom properties to the session object
      if (session.user) {
        let res = await prisma.User.findUnique({
          where: {
            id: user.id
          }
        });
      }

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
