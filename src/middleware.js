import {NextResponse} from 'next/server';
import {getAllSites} from "@/lib/api";

let SUPPORTED_LOCALES = [];
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';

async function updateSupportedLocales() {
    try {
        const sites = await getAllSites();
        SUPPORTED_LOCALES = sites.map(site => site.short_locale);
    } catch (error) {
        console.error("Failed to fetch sites for middleware:", error);
        SUPPORTED_LOCALES = ['en', 'id'];
    }
}

export async function middleware(request) {
    if (SUPPORTED_LOCALES.length === 0) {
        await updateSupportedLocales();
    }

    const {pathname} = request.nextUrl;

    if (pathname.startsWith('/_next/') || pathname.startsWith('/api/') || /\..+$/.test(pathname)) {
        return NextResponse.next();
    }

    // Check if the pathname already has a supported locale prefix
    const pathnameLocale = SUPPORTED_LOCALES.find(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Redirect /default-locale/* to /*
    if (pathnameLocale === DEFAULT_LOCALE) {
        const newPath = pathname.replace(`/${DEFAULT_LOCALE}`, '') || '/';
        const url = new URL(newPath, request.url);
        return NextResponse.redirect(url);
    }

    if (pathnameLocale && pathnameLocale !== DEFAULT_LOCALE) {
        return NextResponse.next();
    }

    // Logic for paths without a locale prefix
    // Try to get the preferred locale from the 'accept-language' header
    const acceptLanguage = request.headers.get('accept-language');
    const preferredLocale = acceptLanguage?.split(',')[0].split('-')[0];

    // If the preferred locale is a supported, non-default locale, redirect to that locale's path
    if (SUPPORTED_LOCALES.includes(preferredLocale) && preferredLocale !== DEFAULT_LOCALE) {
        request.nextUrl.pathname = `/${preferredLocale}${pathname}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // For all other cases (default locale or unsupported preferred locale),
    // rewrite the path to include the default locale internally.
    // The URL in the browser will remain without the prefix.
    request.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.rewrite(request.nextUrl);
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
    ],
};