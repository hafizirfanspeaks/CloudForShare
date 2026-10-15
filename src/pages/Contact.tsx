import { useState } from 'react'
import {
  Mail,
  Briefcase,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  User,
  Code2,
  Rocket,
  Handshake,
  Globe,
  Star,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '@/components/seo/SEO'
import JsonLd from '@/components/seo/JsonLd'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Input from '@/components/common/Input'
import PhoneInput from '@/components/common/PhoneInput'
import EmailButton from '@/components/common/EmailButton'
import { notify } from '@/lib/toast'
import { getOrganizationSchema } from '@/lib/seo/schema'
import { submitContactMessage } from '@/lib/supabase/contact'
import {
  COMPANY_NAME,
  COMPANY_EMAIL,
  COMPANY_SERVICES,
  COMPANY_RESPONSE_TIME,
  COMPANY_LOCATION,
  COMPANY_TAGLINE,
  COMPANY_FOUNDER,
  ROUTES,
} from '@/lib/constants'

const contactReasons = [
  ...COMPANY_SERVICES,
  'Sponsorship',
  'Partnership',
  'Other',
]

const budgetOptions = [
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000+',
  'Not sure yet',
]

const highlights = [
  {
    icon: Rocket,
    title: 'Need a Website?',
    desc: 'Get a modern, fast web app built for you',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Code2,
    title: 'Custom Software',
    desc: 'Tailored solutions for your business',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Handshake,
    title: 'Sponsorship',
    desc: 'Partner with us and reach thousands',
    color: 'from-orange-500 to-red-500',
  },
]

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+92')
  const [service, setService] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      notify.error('Name required', 'Please enter your name')
      return
    }
    if (!message.trim()) {
      notify.error('Message required', 'Please tell us about your project')
      return
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify.error('Invalid email', 'Please enter a valid email or leave empty')
      return
    }

    const phoneDigits = phone.replace(/[^\d]/g, '')
    const hasPhone = phoneDigits.length > 2

    if (!email && !hasPhone) {
      notify.error(
        'Contact required',
        'Please provide either email or phone number'
      )
      return
    }

    setSending(true)

    const { success, error } = await submitContactMessage({
      name,
      email: email || undefined,
      phone: hasPhone ? phone : undefined,
      service: service || undefined,
      budget: budget || undefined,
      message,
    })

    if (!success) {
      setSending(false)
      notify.error('Failed to submit', error || 'Please try again')
      return
    }

    setSending(false)
    setSent(true)
    notify.success('Message sent!', "We'll get back to you soon")

    setTimeout(() => {
      setSent(false)
      setName('')
      setEmail('')
      setPhone('+92')
      setService('')
      setBudget('')
      setMessage('')
    }, 5000)
  }

  return (
    <>
      <SEO
        title={`Contact ${COMPANY_NAME} — Hire Us for Your Project`}
        description={`Get in touch with ${COMPANY_NAME} for custom software, web apps, or mobile apps. Email: ${COMPANY_EMAIL}. Free consultation available.`}
        keywords={[
          'contact Irfanz Solutions',
          'hire software developers',
          'custom software quote',
          'web development contact',
          'software company contact',
          'Irfanz Solutions email',
          'irfanzsolutions@gmail.com',
          'sponsorship software company',
        ]}
        url={ROUTES.CONTACT}
      />

      <JsonLd data={getOrganizationSchema()} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-300/40 text-sm mb-5">
              <span className="size-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-medium">Available for new projects</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Let's build something{' '}
              <span className="bg-linear-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                great together
              </span>
            </h1>

            <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto mb-6">
              Have a project in mind? Sponsorship inquiry? Custom software
              request? We'd love to hear from you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-xs text-blue-200 mr-1">Quick:</span>
              {highlights.map(({ icon: Icon, title }) => (
                <a
                  key={title}
                  href="#contact-form"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all cursor-pointer text-xs font-medium"
                >
                  <Icon className="size-3" />
                  {title}
                </a>
              ))}
            </div>

            <p className="text-xs text-blue-200">
              ⚡ Average response time:{' '}
              <span className="font-bold text-white">
                {COMPANY_RESPONSE_TIME}
              </span>
            </p>
          </div>
        </div>

        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-400/20 blur-3xl" />
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container-custom py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-3.5 text-amber-500 fill-amber-500" />
              <span>5.0 Client Rating</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-3.5 text-brand-500" />
              <span>Serving 20+ Countries</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-green-500" />
              <span>{COMPANY_RESPONSE_TIME} Response</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-brand-500" />
              <span>Free Consultation</span>
            </span>
          </div>
        </div>
      </section>

      <div className="container-custom py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          {/* INFO CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card
              padding="md"
              className="border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-800 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="size-9 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center">
                  <Mail className="size-4 text-brand-600 dark:text-brand-400" />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </span>
              </div>
              <EmailButton
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 break-all transition-colors cursor-pointer text-left"
                subject={`Inquiry from Contact Page`}
                title={`Contact Us`}
              >
                {COMPANY_EMAIL}
              </EmailButton>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Best way to reach us
              </p>
            </Card>

            <Card
              padding="md"
              className="border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-800 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="size-9 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center">
                  <Briefcase className="size-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {COMPANY_NAME}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                <MapPin className="size-3" />
                {COMPANY_LOCATION}
              </p>
            </Card>

            <Card
              padding="md"
              className="border border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-800 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="size-9 rounded-lg bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
                  <Clock className="size-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Response
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {COMPANY_RESPONSE_TIME}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Usually faster
              </p>
            </Card>
          </div>

          {/* FORM */}
          <div id="contact-form" className="scroll-mt-20">
            <Card
              padding="lg"
              className="border border-gray-200 dark:border-gray-800 shadow-lg"
            >
              <div className="flex items-start gap-3 mb-6">
                <div className="size-11 rounded-xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="size-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Send us a message
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fill the form below. We'll get back to you within{' '}
                    {COMPANY_RESPONSE_TIME.toLowerCase()}.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Your Name *"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="size-4" />}
                  required
                  disabled={sending || sent}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Email (optional)"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="size-4" />}
                    helperText="Email or phone — at least one required"
                    disabled={sending || sent}
                  />

                  <PhoneInput
                    label="Phone (optional)"
                    value={phone}
                    onChange={setPhone}
                    helperText="Select country code, then enter number"
                    disabled={sending || sent}
                    defaultCountry="PK"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 cursor-pointer">
                      Service Interested In
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      disabled={sending || sent}
                      className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a service (optional)</option>
                      {contactReasons.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 cursor-pointer">
                      Budget Range (optional)
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      disabled={sending || sent}
                      className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select budget (optional)</option>
                      {budgetOptions.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 cursor-pointer">
                    Your Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project. What are you building? What problem are you solving?"
                    rows={6}
                    required
                    disabled={sending || sent}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/40 transition-all resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={sending}
                  disabled={sent}
                  leftIcon={
                    !sending && !sent ? <Send className="size-4" /> : undefined
                  }
                >
                  {sent
                    ? 'Message sent!'
                    : sending
                      ? 'Sending...'
                      : 'Send Message'}
                </Button>

                {sent && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900">
                    <CheckCircle2 className="size-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800 dark:text-green-300">
                      <strong>Message saved!</strong> We've received your inquiry
                      and will respond within{' '}
                      {COMPANY_RESPONSE_TIME.toLowerCase()}.
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Or{' '}
                  <EmailButton
                    className="font-medium text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    subject={`Inquiry from Contact Page`}
                    title={`Contact Us`}
                  >
                    email us directly
                  </EmailButton>{' '}
                  at {COMPANY_EMAIL}
                </p>
              </form>
            </Card>
          </div>

          {/* EXTRA INFO */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {COMPANY_TAGLINE}
            </p>
            <Link
              to={ROUTES.ABOUT}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
            >
              Learn more about {COMPANY_NAME}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Founder Note */}
          <div className="mt-8 p-5 rounded-xl bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-900">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              <strong>Direct line to the founder:</strong> {COMPANY_FOUNDER}{' '}
              personally reviews every inquiry. Your project gets attention from
              day one — no middlemen, no delays.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}