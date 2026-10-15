import { Helmet } from 'react-helmet-async'
import { APP_NAME, APP_URL, APP_DESCRIPTION } from '@/lib/constants'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  author?: string
}

const DEFAULT_IMAGE = `${APP_URL}/og-image.png`

export default function SEO({
  title,
  description = APP_DESCRIPTION,
  keywords = [],
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noindex = false,
  author = APP_NAME,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} — Share Files Instantly`
  const fullUrl = url ? `${APP_URL}${url}` : APP_URL

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="author" content={author} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large" />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph (Facebook, LinkedIn, WhatsApp) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@cloudforshare" />

      {/* Theme + Mobile */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />

      {/* Extra */}
      <meta name="format-detection" content="telephone=no" />
    </Helmet>
  )
}