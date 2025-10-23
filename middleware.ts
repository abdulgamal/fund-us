import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required user types
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/funder': ['lender'],
  '/bank': ['lender', 'admin'],
  '/borrower': ['borrower'],
  '/submit-loan': ['borrower'],
  '/applications': ['borrower'],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/funder-register',
  '/auth/borrower-register',
  '/loans',
];

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/funder-register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get authentication data from cookies
  const authToken = request.cookies.get('auth-token')?.value;
  const userType = request.cookies.get('user-type')?.value as 'superadmin' | 'admin' | 'lender' | 'borrower' | undefined;
  
  const isAuthenticated = !!authToken;

  // Check if the current path is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is an auth route (login/register)
  const isAuthRoute = AUTH_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // If user is authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access a protected route without authentication
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for protected routes
  if (isAuthenticated && userType) {
    for (const [route, allowedTypes] of Object.entries(PROTECTED_ROUTES)) {
      if (pathname.startsWith(route)) {
        if (!allowedTypes.includes(userType)) {
          // User doesn't have permission for this route
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};