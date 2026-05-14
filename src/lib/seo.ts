export const SITE_URL = 'https://whfdev.com'

export const SEO_TITLES: Record<string, string> = {
  'pt-BR': 'WHFDEV — Estúdio de produto digital · CRMs, dashboards, web e apps',
  'pt-PT': 'WHFDEV — Estúdio de produto digital · CRMs, dashboards, web e apps',
  en: 'WHFDEV — Digital product studio · CRMs, dashboards, web & apps',
  fr: 'WHFDEV — Studio de produit numérique · CRM, dashboards, web et apps',
}

export const SEO_DESCRIPTIONS: Record<string, string> = {
  'pt-BR':
    '14 anos desenhando e desenvolvendo CRMs, dashboards, landing pages e aplicativos iOS e Android para marcas como SIC Notícias, Expresso e SPMS. Vamos tirar seu projeto do papel.',
  'pt-PT':
    '14 anos a desenhar e desenvolver CRMs, dashboards, landing pages e aplicações iOS e Android para marcas como SIC Notícias, Expresso e SPMS. Vamos tirar o seu projeto do papel.',
  en: '14 years designing and shipping CRMs, dashboards, landing pages and iOS/Android apps for brands like SIC Notícias, Expresso and SPMS. Let’s ship your idea.',
  fr: '14 ans à concevoir et livrer des CRM, dashboards, landing pages et applications iOS/Android pour des marques comme SIC Notícias, Expresso et SPMS.',
}

export function pickTitle(locale: string) {
  return SEO_TITLES[locale] ?? SEO_TITLES['pt-BR']
}

export function pickDescription(locale: string) {
  return SEO_DESCRIPTIONS[locale] ?? SEO_DESCRIPTIONS['pt-BR']
}

const SERVICES_BY_LOCALE: Record<string, string[]> = {
  'pt-BR': [
    'Desenvolvimento de CRM sob medida',
    'Criação de dashboards e painéis',
    'Landing pages de alta conversão',
    'Aplicativos iOS nativos',
    'Aplicativos Android nativos',
    'Web apps e plataformas SaaS',
    'E-commerce',
    'Consultoria técnica e arquitetura',
  ],
  'pt-PT': [
    'Desenvolvimento de CRM à medida',
    'Criação de dashboards e painéis',
    'Landing pages de alta conversão',
    'Aplicações iOS nativas',
    'Aplicações Android nativas',
    'Web apps e plataformas SaaS',
    'E-commerce',
    'Consultoria técnica e arquitetura',
  ],
  en: [
    'Custom CRM development',
    'Dashboards and admin panels',
    'High-conversion landing pages',
    'Native iOS apps',
    'Native Android apps',
    'Web apps and SaaS platforms',
    'E-commerce',
    'Technical consulting and architecture',
  ],
  fr: [
    'Développement de CRM sur mesure',
    'Création de dashboards et tableaux de bord',
    'Landing pages à fort taux de conversion',
    'Applications iOS natives',
    'Applications Android natives',
    'Web apps et plateformes SaaS',
    'E-commerce',
    'Conseil technique et architecture',
  ],
}

export function buildOrganizationSchema(locale: string, description: string) {
  const services = SERVICES_BY_LOCALE[locale] ?? SERVICES_BY_LOCALE['pt-BR']

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}#organization`,
    name: 'WHFDEV Consultoria em Tecnologia LTDA',
    alternateName: 'WHFDEV',
    legalName: 'WHFDEV Consultoria em Tecnologia LTDA',
    url: SITE_URL,
    logo: `${SITE_URL}/whfdev.png`,
    image: `${SITE_URL}/og-image.png`,
    email: 'talkto@whfdev.com',
    description,
    foundingDate: '2011',
    taxID: '46.185.304/0001-71',
    founder: {
      '@type': 'Person',
      name: 'Wander Hungerbühler',
      jobTitle: 'Founder & Lead Developer',
      url: SITE_URL,
      sameAs: [
        'https://www.linkedin.com/in/wanderhungerbuhler',
        'https://github.com/wanderhungerbuhler',
      ],
    },
    knowsAbout: [
      'Next.js',
      'React',
      'React Native',
      'TypeScript',
      'Node.js',
      'CRM development',
      'SaaS development',
      'iOS development',
      'Android development',
      'Web development',
      'E-commerce',
      'UI/UX design',
      'Product engineering',
    ],
    areaServed: [
      { '@type': 'Country', name: 'Brazil' },
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'United States' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'talkto@whfdev.com',
      contactType: 'sales',
      availableLanguage: ['Portuguese', 'English', 'French'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços WHFDEV',
      itemListElement: services.map((s, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: { '@type': 'Service', name: s },
      })),
    },
    sameAs: [
      'https://www.linkedin.com/in/wanderhungerbuhler',
      'https://github.com/wanderhungerbuhler',
    ],
  }
}

export function buildWebSiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: 'WHFDEV',
    inLanguage: locale,
    publisher: { '@id': `${SITE_URL}#organization` },
  }
}
