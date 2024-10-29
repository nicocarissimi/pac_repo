import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "./libs/definitions";

export async function middleware(req: NextRequest) {
  const cookie = req.cookies._headers.get('cookie')
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
  if(token && !cookie?.includes('preferences') && !pathname.includes('/preferences') && !pathname.includes('/api')){
      const res = await fetch(`http://localhost:3000/api/preferences?userId=${token.id}`);
      if (res.status !== 200) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();
      if(data.categories.length !== 0 || data.role === 'admin'){
        const res = NextResponse.next()
        console.log(res.cookies.getAll())
        res.cookies.set("preferences","ok")
        console.log(res.cookies.getAll())
        return res
      }
      else{
        return NextResponse.redirect(new URL('/preferences', req.url));
      }
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};