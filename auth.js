import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // JWT sessions — no database required
  session: { strategy: 'jwt' },
  callbacks: {
    // Persist name, email, and picture into the session token
    async jwt({ token, profile }) {
      if (profile) {
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.name    = token.name;
        session.user.email   = token.email;
        session.user.image   = token.picture;
      }
      return session;
    },
  },
});
