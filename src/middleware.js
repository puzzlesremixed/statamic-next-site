import {NextResponse} from 'next/server';
import {getAllSites} from "@/lib/api";


let SUPPORTED_LOCALES = [];

async function updateSupportedLocales() {
    try {
        const sites = await getAllSites();
        SUPPORTED_LOCALES = sites.map(site => site.short_locale);
    } catch (error) {
        console.error("Failed to fetch sites for middleware:", error);
        // Fallback to default if API fails
        SUPPORTED_LOCALES = ['en'];
    }
}

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE;

export async function middleware(request) {
    if (SUPPORTED_LOCALES.length === 0) {
        await updateSupportedLocales();
    }
    const {pathname} = request.nextUrl;
    const pathnameHasLocale = SUPPORTED_LOCALES.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || /\..+$/.test(pathname)) {
        return NextResponse.next();
    }

    const acceptLanguage = request.headers.get('accept-language');
    const preferredLocale = acceptLanguage?.split(',')[0].split('-')[0] || DEFAULT_LOCALE;

    const localeToRedirect = SUPPORTED_LOCALES.includes(preferredLocale)
        ? preferredLocale
        : DEFAULT_LOCALE;

    request.nextUrl.pathname = `/${localeToRedirect}${pathname}`;

    return NextResponse.redirect(request.nextUrl);
}

// exclude files that don't need localization
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
    ],
};