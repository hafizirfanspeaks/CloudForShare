import { Link } from 'react-router-dom'
import { Upload, Zap, Lock, Clock, QrCode, Shield, ArrowRight } from 'lucide-react'
import SEO from '@/components/seo/SEO'
import JsonLd from '@/components/seo/JsonLd'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import {
  getWebAppSchema,
  getOrganizationSchema,
  getFAQSchema,
  getSoftwareSchema,
} from '@/lib/seo/schema'
import { HOME_FAQS } from '@/lib/seo/faqs'
import { ROUTES } from '@/lib/constants'

const features = [
  {
    icon: Zap,
    title: 'Instant Upload',
    description: 'Drag, drop, share. Get a link in seconds — no waiting, no signup.',
  },
  {
    icon: Lock,
    title: 'Password Protection',
    description: 'Add a password to sensitive files. Only people you trust can download.',
  },
  {
    icon: Clock,
    title: 'Auto Expiry',
    description: 'Set files to self-destruct in 1 hour, 24 hours, 7 days, or 30 days.',
  },
  {
    icon: QrCode,
    title: 'QR Code Sharing',
    description: 'Every file gets a unique QR code. Scan to download instantly.',
  },
  {
    icon: Shield,
    title: 'Secure Storage',
    description: 'HTTPS encryption + secure cloud storage. Your files stay private.',
  },
  {
    icon: Upload,
    title: 'Up to 100 MB',
    description: 'Share large files easily — documents, photos, videos, archives.',
  },
]

export default function Home() {
  return (
    <>
      {/* SEO Meta Tags */}
      <SEO
        title="Free File Sharing — No Signup Required"
        description="Share files instantly with a link. Free, fast, and secure. Up to 100 MB per file. No signup required. Password protection, expiry times, and QR codes included."
        keywords={[
          'file sharing',
          'free file upload',
          'share files online',
          'no signup file share',
          'send large files',
          'temporary file hosting',
          'cloudforshare',
        ]}
        url="/"
      />

      {/* JSON-LD Schemas for Google & AI */}
      <JsonLd
        data={[
          getWebAppSchema(),
          getOrganizationSchema(),
          getSoftwareSchema(),
          getFAQSchema(HOME_FAQS),
        ]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="container-custom py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
              <span className="size-2 rounded-full bg-green-400 animate-pulse" />
              <span>Free forever. No signup required.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Share Files{' '}
              <span className="bg-linear-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Instantly
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Upload any file up to 100 MB and get a shareable link in seconds.
              Password protection, expiry times, and QR codes included — all free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={ROUTES.UPLOAD} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  fullWidth
                  rightIcon={<ArrowRight className="size-5" />}
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  Upload a File
                </Button>
              </Link>
              <Link to={ROUTES.DASHBOARD} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  className="bg-transparent text-white border-white/30 hover:bg-white/10"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Blur */}
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-400/20 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to share files
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features, zero complexity. All completely free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} hoverable padding="lg" className="border border-gray-100">
                <div className="size-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <Icon className="size-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Share in 3 simple steps
            </h2>
            <p className="text-lg text-gray-600">No learning curve. Just upload and share.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Upload', desc: 'Drag & drop your files or click to browse.' },
              { step: '02', title: 'Configure', desc: 'Set expiry, password, and download limits.' },
              { step: '03', title: 'Share', desc: 'Copy link or QR code. Send it anywhere.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="size-16 rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-5 text-white text-xl font-bold shadow-lg shadow-brand-500/30">
                  {step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-gray-600">Everything you need to know about CloudForShare.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {HOME_FAQS.slice(0, 6).map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-xl border border-gray-200 p-6 open:shadow-md transition-shadow"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-gray-900">
                  <span>{faq.question}</span>
                  <span className="text-brand-500 group-open:rotate-45 transition-transform text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-linear-to-br from-brand-600 to-purple-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to share your first file?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            No signup. No credit card. Just upload and share.
          </p>
          <Link to={ROUTES.UPLOAD}>
            <Button
              size="lg"
              className="bg-white text-brand-700 hover:bg-blue-50"
              rightIcon={<ArrowRight className="size-5" />}
            >
              Start Uploading — It's Free
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}