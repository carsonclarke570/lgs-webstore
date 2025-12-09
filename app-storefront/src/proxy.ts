import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth as authMiddleware } from "@/auth"

function isProtectedEnvironment() {
    return (
        process.env.VERCEL_ENV === 'preview' ||
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging'
    )
}

function checkBasicAuth(request: NextRequest): boolean {
    const basicAuth = request.headers.get('authorization')

    if (!basicAuth) {
        return false
    }

    try {
        const authValue = basicAuth.split(' ')[1]
        const [user, pwd] = atob(authValue).split(':')

        return (
            user === process.env.STAGING_AUTH_USER &&
            pwd === process.env.STAGING_AUTH_PASSWORD
        )
    } catch {
        return false
    }
}

function stagingProtectionMiddleware(request: NextRequest) {
    // Skip protection for production
    if (!isProtectedEnvironment()) {
        return NextResponse.next()
    }

    // Check if already authenticated
    if (checkBasicAuth(request)) {
        return NextResponse.next()
    }

    // Require authentication
    return new NextResponse('Authentication required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Staging Environment - The Respite"',
        },
    })
}

export default authMiddleware(stagingProtectionMiddleware)

// Don't run middleware on static files
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}