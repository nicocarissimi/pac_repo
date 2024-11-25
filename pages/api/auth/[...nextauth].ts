import NextAuth, { NextAuthOptions, Profile, User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import prismadb from '@/libs/prismadb';
import { Account } from '@prisma/client';


export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials) {
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        try {
          const user = await prismadb.user.findUnique({ where: {
            email: credentials.email
          }});
          if (!user || !user.hashedPassword) {
            throw new Error('Email does not exist');
          }   
  
          const isCorrectPassword = await compare(credentials.password, user.hashedPassword);
          
          if (!isCorrectPassword) {
            throw new Error('Incorrect password');
          }
  
          return user as User;
        } catch (error) {
          console.log(error)  
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        let dbUser = null;
        if (account?.provider === 'github' || account?.provider === 'google' ) {
          dbUser = await prismadb.user.findUnique({
            where: {email: user.email}
          });
        }
        token.name = user.name;
        token.id = user.id || dbUser?.id!;
        token.role = user.role || dbUser?.role!;
        token.image = user.image;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          name: token.name,
          email: token.email,
          image: token.image,
        };
      }
      return session;
    },
    signIn: async ({ user, account }) => {
      if (account) {
        if (account.provider === 'google' || account.provider === 'github') {
          user.role = 'user'; // Set a default role or customize it
          user.image = '/images/user/default-green.png';
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth'
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prismadb),
  session: { 
    strategy: 'jwt', 
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
}


export default NextAuth(authOptions);
