import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {

  const tokenValue  = req.cookies.get('token'); // Get token from cookies
  const token = tokenValue?.value;
  const url = req.nextUrl.clone();

  // Allow requests to public pages
  if (url.pathname ==='/' ||  url.pathname === '/signup') {
    return NextResponse.next();
  }

  if (!token) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  // Send token to your backend for validation
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/account/validate-session`, {
    headers: {
      'Content-Type': 'application/json',
      "authorization": `Bearer ${token}`,
    },
  });
  if (response.status === 401 || !response.ok) {
    // If token is invalid, redirect to login page
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|public/.*|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}