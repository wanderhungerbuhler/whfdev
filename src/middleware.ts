import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['pt-BR', 'pt-PT', 'en', 'fr'],

  defaultLocale: 'pt-BR',
})

export const config = {
  matcher: ['/', '/(pt-BR|pt-PT|en|fr)/:path*'],
}
