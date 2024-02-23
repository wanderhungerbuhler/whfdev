import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['pt', 'en', 'fr'],

  defaultLocale: 'pt',
})

export const config = {
  matcher: ['/', '/(pt|en|fr)/:path*'],
}
