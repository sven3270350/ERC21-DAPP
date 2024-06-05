import { NextAuthOptions, Session } from "next-auth"
import EmailProvider, { SendVerificationRequestParams } from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { createTransport } from "nodemailer"
import { prisma } from "../../prisma"
import { html, text } from "@/app/utils/emailTemplate"
import { ExtendedUser } from "@/types/user"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
    verifyRequest: '/login/verified',
    error: '/login/error',
  },
  callbacks: {
    async session({ session, token, user }) {
      
      if (session.user) {
        let res = await prisma.user.findUnique({
          where: {
            id: Number(user.id)
          }
        });
        
        session.user = res as ExtendedUser;
        //? Access id using extended user type to avoid undefined error
        // console.log(res, session.user, "res", "session.user");
        // console.log((session?.user as ExtendedUser)?.id); 
        
      }

      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
  }
}
