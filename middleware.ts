import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('admin_token')?.value
    const isLoginPage = request.nextUrl.pathname === '/'

    // 1. If trying to access admin pages without token, redirect to login
    if (!token && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 2. If already logged in and trying to access login page, redirect to admin
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

// Config to specify which routes should be handled by this proxy
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - logo.png, logo-dark.png (brand assets)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png|logo-dark.png).*)',
    ],
}
