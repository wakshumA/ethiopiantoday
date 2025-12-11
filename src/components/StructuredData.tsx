'use client'

export default function StructuredData() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://ethiopiantoday.com/#website',
        url: 'https://ethiopiantoday.com',
        name: 'Ethiopian Today',
        description: 'Real-time Ethiopian Birr exchange rates, currency conversion, and economic news',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://ethiopiantoday.com/?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://ethiopiantoday.com/#organization',
        name: 'Ethiopian Today',
        url: 'https://ethiopiantoday.com',
        logo: {
          '@type': 'ImageObject',
          inLanguage: 'en-US',
          '@id': 'https://ethiopiantoday.com/#/schema/logo/image/',
          url: 'https://ethiopiantoday.com/favicon.svg',
          contentUrl: 'https://ethiopiantoday.com/favicon.svg',
          width: 200,
          height: 200,
          caption: 'Ethiopian Today',
        },
        image: {
          '@id': 'https://ethiopiantoday.com/#/schema/logo/image/',
        },
        sameAs: ['https://twitter.com/ethiopiantoday'],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://ethiopiantoday.com/#webpage',
        url: 'https://ethiopiantoday.com',
        name: 'Ethiopian Today - Live Exchange Rates & Economic News',
        isPartOf: {
          '@id': 'https://ethiopiantoday.com/#website',
        },
        inLanguage: 'en-US',
        description: 'Real-time Ethiopian Birr exchange rates, currency conversion, and daily economic news from Ethiopia',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://ethiopiantoday.com/#breadcrumbs',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://ethiopiantoday.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Exchange Rates',
            item: 'https://ethiopiantoday.com/#rates',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Blog',
            item: 'https://ethiopiantoday.com/blog',
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}
