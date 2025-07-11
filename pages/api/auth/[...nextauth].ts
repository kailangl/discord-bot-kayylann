import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: { 
          scope: "identify guilds guilds.members.read",
          prompt: "consent" 
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
          if (session.user) {
           session.user.id = token.sub! as string; 
          }
      }
      return session;
    },
  },
 
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', 
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', 
  }
});
