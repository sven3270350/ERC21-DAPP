import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// interface CredentialsType {
//   email: any;
//   password: any;
// }
const handler = NextAuth({
  session: {
      strategy: "jwt",
  },
  pages: {
      signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
          email: {},
          password: {},
          walletAddress: {}
      },
      async authorize(credentials, req): Promise<any> {        
        const email = credentials?.email;
        const password = credentials?.password;
        const walletAddress = credentials?.walletAddress
        return {
          email: email,
          password: password,
          walletAddress: walletAddress
        }

      },
    }),
  ],
});

export { handler as GET, handler as POST };