import Script from 'next/script'

const GTM_ID = 'G-B4F22YPY1E'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WHFDEV',
  legalName: 'WHFDEV Consultoria em Tecnologia LTDA',
  url: 'https://whfdev.com',
  logo: 'https://whfdev.com/whfdev.png',
  email: 'talkto@whfdev.com',
  founder: {
    '@type': 'Person',
    name: 'Wander Hungerbühler',
  },
  sameAs: [
    'https://github.com/wanderhungerbuhler',
    'https://www.linkedin.com/in/wanderhungerbuhler',
  ],
  foundingDate: '2011',
  description:
    'Estúdio de produto digital. CRMs, dashboards, landing pages e aplicativos iOS e Android.',
}

export function SiteScripts() {
  return (
    <>
      <Script
        id="ld-organization"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Script
        id="adsbygoogle"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2906000400105513"
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />

      <Script
        id="gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
        strategy="afterInteractive"
      />

      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GTM_ID}');
        `}
      </Script>
    </>
  )
}
