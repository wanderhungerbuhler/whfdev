import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

const locales = ['pt-BR', 'pt-PT', 'en', 'fr'] as const
type Locale = (typeof locales)[number]
const defaultLocale: Locale = 'pt-BR'

const COOKIE = 'NEXT_LOCALE'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function pickLocaleFromGeo(country?: string): Locale | null {
  if (!country) return null
  switch (country.toUpperCase()) {
    case 'BR':
      return 'pt-BR'
    case 'PT':
      return 'pt-PT'
    case 'FR':
    case 'BE':
    case 'CH':
    case 'LU':
    case 'MC':
      return 'fr'
    case 'AO':
    case 'MZ':
    case 'CV':
    case 'GW':
    case 'ST':
    case 'TL':
      return 'pt-PT'
    default:
      return null
  }
}

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localeDetection: true,
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasExplicitLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  )
  if (hasExplicitLocale) return intlMiddleware(request)

  const cookieLocale = request.cookies.get(COOKIE)?.value
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return intlMiddleware(request)
  }

  const country = request.geo?.country
  const geoLocale = pickLocaleFromGeo(country)
  if (geoLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/${geoLocale}${pathname === '/' ? '' : pathname}`
    const response = NextResponse.redirect(url)
    response.cookies.set(COOKIE, geoLocale, {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    })
    return response
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(pt-BR|pt-PT|en|fr)/:path*'],
}
