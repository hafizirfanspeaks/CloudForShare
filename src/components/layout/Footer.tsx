import { Link } from 'react-router-dom'
import { Cloud, Mail, Code2, Briefcase } from 'lucide-react'
import {
  APP_NAME,
  ROUTES,
  COMPANY_NAME,
  COMPANY_EMAIL,
  COMPANY_TAGLINE,
  COMPANY_SERVICES,
  COMPANY_SOCIALS,
  COMPANY_WEBSITE,
} from '@/lib/constants'

// Custom SVG Icons (lucide-react v1 removed brand icons)
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11 11 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const footerLinks = {
  Product: [
    { label: 'Home', to: ROUTES.HOME },
    { label: 'Upload', to: ROUTES.UPLOAD },
    { label: 'Dashboard', to: ROUTES.DASHBOARD },
  ],
  Company: [
    { label: 'About', to: ROUTES.ABOUT },
    { label: 'Contact', to: ROUTES.CONTACT },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
  Services: COMPANY_SERVICES.slice(0, 4).map((s) => ({
    label: s,
    to: ROUTES.CONTACT,
  })),
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 mt-auto">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand + Company Info */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 font-bold text-lg text-white"
            >
              <span className="size-9 rounded-lg bg-linear-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Cloud className="size-5 text-white" strokeWidth={2.5} />
              </span>
              <span>{APP_NAME}</span>
            </Link>

            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Share files, text, and code instantly with a live link. No signup
              required.
            </p>

            {/* Company Badge */}
            <div className="mt-5 pt-5 border-t border-gray-800">
              <p className="text-xs text-gray-500 mb-1.5">A product by</p>
              <p className="text-sm font-semibold text-white">{COMPANY_NAME}</p>
              <p className="text-xs text-gray-400 mt-0.5">{COMPANY_TAGLINE}</p>

              {/* Contact */}
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
              >
                <Mail className="size-3.5" />
                {COMPANY_EMAIL}
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.Product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.Company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.Services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={ROUTES.CONTACT}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors cursor-pointer"
            >
              <Briefcase className="size-3.5" />
              Hire us →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            © {currentYear} {APP_NAME} — Built by{' '}
            <a
              href={COMPANY_WEBSITE}
              className="font-medium text-gray-300 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {COMPANY_NAME}
            </a>
            . All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-2">
            <a
              href={COMPANY_SOCIALS.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="size-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={COMPANY_SOCIALS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="size-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <TwitterIcon className="size-4" />
            </a>
            <a
              href={COMPANY_SOCIALS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="size-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <LinkedinIcon className="size-4" />
            </a>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              aria-label="Email"
              className="size-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        {/* Services Tagline */}
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <Code2 className="size-3.5" />
            Need a custom software solution?{' '}
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}