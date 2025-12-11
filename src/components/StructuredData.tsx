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
        description: 'Live Ethiopian Birr exchange rates - Official CBE rates and Black Market (Parallel) rates with real-time tracking',
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
        name: 'Live Ethiopian Exchange Rates - Official & Black Market Rates',
        isPartOf: {
          '@id': 'https://ethiopiantoday.com/#website',
        },
        inLanguage: 'en-US',
        description: 'Track real-time Ethiopian Birr exchange rates including CBE official rates and black market (parallel) market rates. Free currency converter and economic news.',
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
