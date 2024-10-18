import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "./libs/definitions";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
 
  if (!token) {
    if (pathname === '/auth' || pathname.includes('/api/auth') || pathname.includes('/api/register')) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/auth', req.url));
  } 
  
  if ( (pathname === '/auth')) {
      return NextResponse.redirect(new URL('/', req.url));
  } 

  if (pathname === '/admin' && token.role !== Role.ADMIN) {
    return NextResponse.redirect(new URL('/', req.url));
  }  
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};