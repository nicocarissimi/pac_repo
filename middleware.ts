import { withAuth } from "next-auth/middleware"
import { NextRequest } from "next/server"
import prismadb from '@/libs/prismadb';
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt";
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_JWT_SECRET,
      });
  return null
}
// Optionally, don't invoke Middleware on some paths
export const config = {
  //matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
  matcher: ["/", "/auth/login"]
}