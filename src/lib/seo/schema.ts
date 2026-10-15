import type {
  WebApplication,
  FAQPage,
  Organization,
  SoftwareApplication,
  BreadcrumbList,
  WithContext,
} from 'schema-dts'
import {
  APP_NAME,
  APP_URL,
  APP_DESCRIPTION,
  COMPANY_NAME,
  COMPANY_EMAIL,
  COMPANY_DESCRIPTION,
  COMPANY_FOUNDER,
  COMPANY_LOCATION,
  COMPANY_SERVICES,
  COMPANY_SOCIALS,
} from '@/lib/constants'

/**
 * WebApplication schema — homepage ke liye
 */
export function getWebAppSchema(): WithContext<WebApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: APP_NAME,
    url: APP_URL,
    description: APP_DESCRIPTION,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Instant file sharing',
      'No signup required',
      'Text and code sharing',
      'Password protection',
      'File expiry',
      'Download limits',
      'QR code sharing',
      'Up to 50 MB per file',
      'Real-time sync',
      'Custom board links',
      'ZIP download',
      'Dark mode',
      'PWA installable',
    ],
    screenshot: `${APP_URL}/og-image.png`,
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      url: COMPANY_WEBSITE,
    },
  }
}

/**
 * Organization schema — Irfanz Solutions (Parent Company)
 */
export function getOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_NAME,
    alternateName: ['Irfanz', 'Irfanz Solution'],
    url: COMPANY_WEBSITE,
    logo: `${APP_URL}/favicon.svg`,
    description: COMPANY_DESCRIPTION,
    founder: {
      '@type': 'Person',
      name: COMPANY_FOUNDER,
    },
    email: COMPANY_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressCountry: COMPANY_LOCATION,
    },
    sameAs: [
      COMPANY_SOCIALS.github,
      COMPANY_SOCIALS.twitter,
      COMPANY_SOCIALS.linkedin,
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: COMPANY_EMAIL,
        contactType: 'customer support',
        availableLanguage: ['English', 'Urdu'],
      },
      {
        '@type': 'ContactPoint',
        email: COMPANY_EMAIL,
        contactType: 'sales',
        availableLanguage: ['English', 'Urdu'],
      },
    ],
    knowsAbout: COMPANY_SERVICES,
  }
}

/**
 * ProfessionalService schema — Irfanz Solutions services
 */
export function getProfessionalServiceSchema(): WithContext<any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: COMPANY_NAME,
    description: COMPANY_DESCRIPTION,
    url: COMPANY_WEBSITE,
    email: COMPANY_EMAIL,
    serviceType: COMPANY_SERVICES,
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    priceRange: '$$',
    founder: {
      '@type': 'Person',
      name: COMPANY_FOUNDER,
    },
  }
}

/**
 * FAQ schema
 */
export function getFAQSchema(
  faqs: { question: string; answer: string }[]
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * SoftwareApplication schema
 */
export function getSoftwareSchema(): WithContext<SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      email: COMPANY_EMAIL,
    },
  }
}

/**
 * Breadcrumb schema
 */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${APP_URL}${item.url}`,
    })),
  }
}

// Fix: COMPANY_WEBSITE not imported — import kar lein
import { COMPANY_WEBSITE } from '@/lib/constants'