import Script from "next/script";

export default function Head() {
  const pageTitle = "WHFdev - Desenvolvimento de Sistemas e Aplicativos";
    const description = "Crie seu site, monte seu negócio com a melhor agência digital e design em criação de logo, sites, produção de vídeos, marketing digital e muito mais com a WHFDEV."
    const pageImage = "";

    const GTM_ID = "G-B4F22YPY1E";

  return (
    <>
    <meta charSet="utf-8" />
    <link rel="shortcut icon" href="/whfdev.png" />

    <meta name="description" content="Crie seu site, monte seu negócio com a melhor agência digital
    e design em criação de logo, sites, produção de vídeos, marketing digital e muito mais com a WHFDEV." />

    <meta name="keywords" content="whfdev, whf, websites, desenvolvedor front-end,
      webdesigner rio de janeiro, webdesigner, webdesigner rj, front-end rio de janeiro,
      desginer gráfico, desenvolvimento de site rj, criação de sites rio de janeiro,
      criação de site rj, agencia web rio de janeiro, sites rio de janeiro, criação de
      sites no rio de janeiro, criação de sites rio, criação de site rio de janeiro,
      criar sites, criação de sites, web designer, freelancer, blog, wordpress, criação de sites rj,
      sites e blogs, criar sites em wordpress, web designer rio de janeiro, freelancer rio de janeiro, web design rio de janeiro, webdesigner rio de janeiro, sites em wordpress" />
    <meta httpEquiv="x-ua-compatible" content="IE=edge,chrome=1" />

    <meta name="author" content="WHF - Web Designer & Designer Gráfico" />
    <meta name="reply-to" content="contato@whfdev.com.br" />
    <meta property="business:contact_data:street_address" content="Rua Joaquim Martins, nº 517" />
    <meta property="business:contact_data:locality" content="Piedade RJ" />
    <meta property="business:contact_data:postal_code" content="20745-230" />
    <meta name="author" content="Wander Hungerbühler" />

    <meta name="MobileOptimized" content="320" />
    <meta name="HandheldFriendly" content="True" />
    <meta name="theme-color" content="#111111" />
    <meta name="msapplication-TileColor" content="#111111" />
    <meta name="referrer" content="no-referrer-when-downgrade" />
    <meta name="google" content="notranslate" />

    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={pageTitle} />
    <meta property="og:image" content={pageImage} />
    <meta property="og:image:secure_url" content={pageImage} />
    <meta property="og:image:alt" content="Thumbnail" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <meta name="twitter:title" content={pageTitle} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@whfdev" />
    <meta name="twitter:creator" content="@whfdev" />
    <meta name="twitter:image" content={pageImage} />
    <meta name="twitter:image:src" content={pageImage} />
    <meta name="twitter:image:alt" content="Thumbnail" />
    <meta name="twitter:image:width" content="1200" />
    <meta name="twitter:image:height" content="620" />

    <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2906000400105513"
      crossOrigin="anonymous" />

    <Script
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-133551967-1"
    />

    <Script id="google-tag-manager" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
    </Script>
    </>
  )
}
