import { Link } from 'react-router-dom'
import {
  Code2,
  Smartphone,
  Cloud,
  Palette,
  Database,
  Server,
  Zap,
  Shield,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Rocket,
  Star,
  Globe,
  TrendingUp,
  Award,
  Heart,
  Lightbulb,
  Target,
  Briefcase,
} from 'lucide-react'
import SEO from '@/components/seo/SEO'
import JsonLd from '@/components/seo/JsonLd'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import EmailButton from '@/components/common/EmailButton'
import {
  getOrganizationSchema,
  getProfessionalServiceSchema,
} from '@/lib/seo/schema'
import {
  COMPANY_NAME,
  COMPANY_EMAIL,
  COMPANY_DESCRIPTION,
  COMPANY_TAGLINE,
  COMPANY_SERVICES,
  COMPANY_FOUNDER,
  COMPANY_FOUNDED_YEAR,
  COMPANY_LOCATION,
  COMPANY_RESPONSE_TIME,
  APP_NAME,
  ROUTES,
} from '@/lib/constants'

const services = [
  {
    icon: Code2,
    title: 'Web App Development',
    desc: 'Modern, scalable web applications using React, Next.js, and Node.js.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    desc: 'Cross-platform mobile apps with React Native and Flutter.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Cloud,
    title: 'SaaS Platforms',
    desc: 'Complete SaaS products from idea to launch with billing and auth.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    desc: 'Beautiful, user-focused interfaces designed to convert.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Database,
    title: 'Database & APIs',
    desc: 'Optimized databases and RESTful/GraphQL APIs.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: Server,
    title: 'Cloud & DevOps',
    desc: 'Deployment, scaling, and CI/CD on AWS, Vercel, and Supabase.',
    color: 'from-pink-500 to-rose-500',
  },
]

const values = [
  {
    icon: Zap,
    title: 'Fast Delivery',
    desc: 'Ship in weeks, not months. We move fast and deliver on time.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Quality First',
    desc: 'Clean, tested, production-ready code — every single time.',
    color: 'from-green-500 to-teal-500',
  },
  {
    icon: Heart,
    title: 'Client Focused',
    desc: 'Your goals drive every decision we make. Your success is ours.',
    color: 'from-pink-500 to-red-500',
  },
]

const stats = [
  { value: '50+', label: 'Projects Delivered', icon: Rocket },
  { value: '20+', label: 'Happy Clients', icon: Heart },
  { value: '20+', label: 'Countries Served', icon: Globe },
  { value: '5.0', label: 'Client Rating', icon: Star },
]

const process = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'We understand your goals, requirements, and vision.',
    icon: Lightbulb,
  },
  {
    step: '02',
    title: 'Planning',
    desc: 'We design the architecture, timeline, and milestones.',
    icon: Target,
  },
  {
    step: '03',
    title: 'Development',
    desc: "We build, test, and iterate until it's perfect.",
    icon: Code2,
  },
  {
    step: '04',
    title: 'Launch',
    desc: 'We deploy, monitor, and support your project.',
    icon: Rocket,
  },
]

const techStack = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'Tailwind CSS',
  'PostgreSQL',
  'MongoDB',
  'Supabase',
  'Firebase',
  'AWS',
  'Vercel',
  'Docker',
  'Git',
  'Figma',
  'React Native',
]

const achievements = [
  {
    icon: Award,
    title: 'Top Rated',
    desc: '5-star rating from clients',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    icon: TrendingUp,
    title: 'Growing Fast',
    desc: '20+ countries served',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Briefcase,
    title: 'Reliable',
    desc: '50+ successful projects',
    color: 'from-blue-500 to-cyan-500',
  },
]

export default function About() {
  return (
    <>
      <SEO
        title={`About ${COMPANY_NAME} — Software Development Company`}
        description={`${COMPANY_NAME} is a software development company building modern web apps, mobile apps, and SaaS platforms. Contact us at ${COMPANY_EMAIL} for custom software solutions.`}
        keywords={[
          'Irfanz Solutions',
          'software development company',
          'custom software',
          'web development',
          'mobile app development',
          'SaaS development',
          'hire developers',
          'software agency Pakistan',
          'Irfanz',
        ]}
        url={ROUTES.ABOUT}
      />

      <JsonLd data={[getOrganizationSchema(), getProfessionalServiceSchema()]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 size-72 rounded-full bg-blue-400 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 size-72 rounded-full bg-pink-400 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 size-96 rounded-full bg-purple-400 blur-3xl animate-pulse" />
        </div>

        <div className="container-custom py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
              <Sparkles className="size-3.5 text-yellow-300" />
              <span className="font-medium">Software Development Company</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              We build{' '}
              <span className="bg-linear-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                modern software
              </span>
              <br />
              that scales
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              {COMPANY_NAME} crafts web apps, mobile apps, and SaaS platforms
              that help businesses grow. From idea to launch — we've got you
              covered.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link to={ROUTES.CONTACT} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="size-5" />}
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-2xl"
                >
                  Start a Project
                </Button>
              </Link>

              <EmailButton
                className="w-full sm:w-auto"
                subject={`Inquiry about ${COMPANY_NAME}`}
                title={`Contact ${COMPANY_NAME}`}
              >
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  className="bg-transparent text-white border-white/30 hover:bg-white/10"
                  leftIcon={<Mail className="size-5" />}
                >
                  Email Us
                </Button>
              </EmailButton>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-blue-100">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {COMPANY_LOCATION}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Since {COMPANY_FOUNDED_YEAR}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {COMPANY_RESPONSE_TIME} response
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-3.5 fill-yellow-300 text-yellow-300" />
                5.0 rating
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      </section>

      {/* STATS */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950 -mt-8 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map(({ value, label, icon: Icon }) => (
              <Card
                key={label}
                padding="md"
                className="border border-gray-200 dark:border-gray-800 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="size-10 rounded-xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Icon className="size-5 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-bold bg-linear-to-r from-brand-500 to-purple-600 bg-clip-text text-transparent mb-1">
                  {value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {label}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 text-xs font-medium text-brand-700 dark:text-brand-300 mb-4">
              <Target className="size-3.5" />
              <span>Our Mission</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {COMPANY_TAGLINE}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {COMPANY_DESCRIPTION}
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 text-xs font-medium text-brand-700 dark:text-brand-300 mb-4">
              <Sparkles className="size-3.5" />
              <span>What we do</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Services we offer
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              End-to-end software development for startups and enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {services.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                <div className="relative">
                  <div
                    className={`size-12 rounded-xl bg-linear-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-12">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              Full list of our capabilities:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {COMPANY_SERVICES.map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-700 dark:hover:text-brand-300 transition-all cursor-default"
                >
                  <CheckCircle2 className="size-3 text-brand-500" />
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 text-xs font-medium text-brand-700 dark:text-brand-300 mb-4">
              <Rocket className="size-3.5" />
              <span>How we work</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Simple, transparent, and built for success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {process.map(({ step, title, desc, icon: Icon }, index) => (
              <div key={step} className="relative">
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-brand-500 to-purple-500 opacity-30" />
                )}
                <div className="relative text-center">
                  <div className="relative inline-flex">
                    <div className="size-16 rounded-2xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-xl relative z-10 mx-auto">
                      <Icon className="size-7 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 size-7 rounded-full bg-white dark:bg-gray-900 border-2 border-brand-500 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400 z-20">
                      {step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 text-xs font-medium text-brand-700 dark:text-brand-300 mb-4">
              <Heart className="size-3.5" />
              <span>Why us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why work with us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We're not just developers — we're your partners in success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {values.map(({ icon: Icon, title, desc, color }) => (
              <Card
                key={title}
                padding="lg"
                className="border border-gray-200 dark:border-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`size-16 rounded-2xl bg-linear-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <Icon className="size-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {achievements.map(({ icon: Icon, title, desc, color }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all"
                >
                  <div
                    className={`size-14 rounded-2xl bg-linear-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}
                  >
                    <Icon className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900 text-xs font-medium text-brand-700 dark:text-brand-300 mb-4">
              <Code2 className="size-3.5" />
              <span>Tech Stack</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technologies we use
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Modern tools to build future-proof software.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-700 dark:hover:text-brand-300 hover:scale-105 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="relative p-8 md:p-10 rounded-3xl bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden shadow-2xl">
              <div className="absolute -top-20 -right-20 size-64 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/20 blur-3xl" />

              <div className="relative text-center text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-semibold mb-4">
                  <Sparkles className="size-3.5" />
                  Featured Product
                </div>

                <h3 className="text-3xl md:text-5xl font-bold mb-4">
                  {APP_NAME}
                </h3>

                <p className="text-base md:text-lg text-blue-50 mb-6 max-w-2xl mx-auto">
                  Our flagship product — a modern file sharing platform with
                  real-time sync, no signup required, and beautiful design.
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {[
                    'Real-time sync',
                    'No signup',
                    'Free forever',
                    'PWA installable',
                    'Dark mode',
                    'QR sharing',
                  ].map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium border border-white/30"
                    >
                      <CheckCircle2 className="size-3" />
                      {feature}
                    </span>
                  ))}
                </div>

                <Link to={ROUTES.HOME}>
                  <Button
                    size="lg"
                    rightIcon={<ArrowRight className="size-5" />}
                    className="bg-white text-purple-700 hover:bg-blue-50 shadow-2xl"
                  >
                    Try {APP_NAME} Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="relative p-6 md:p-8 rounded-3xl bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border border-blue-100 dark:border-blue-900 overflow-hidden">
              <div className="absolute top-4 right-6 text-8xl font-serif text-brand-200 dark:text-brand-900/50 opacity-50 select-none pointer-events-none">
                "
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 relative">
                <div className="relative shrink-0">
                  <div className="size-24 md:size-28 rounded-3xl bg-linear-to-br from-brand-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {COMPANY_FOUNDER.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 size-9 rounded-full bg-white dark:bg-gray-900 border-4 border-brand-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="size-4 text-brand-500" />
                  </div>
                </div>

                <div className="text-center md:text-left flex-1">
                  <p className="text-xs text-brand-600 dark:text-brand-400 uppercase tracking-widest font-bold mb-1">
                    Founder & Lead Developer
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {COMPANY_FOUNDER}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 italic">
                    "I believe great software should be fast, beautiful, and
                    accessible to everyone. Every line of code we write is
                    focused on making your business better."
                  </p>
                  <EmailButton
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    subject={`Hi ${COMPANY_FOUNDER}`}
                    title={`Contact ${COMPANY_FOUNDER}`}
                  >
                    <Mail className="size-4" />
                    {COMPANY_EMAIL}
                  </EmailButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 bg-linear-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 size-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-96 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="container-custom text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
            <Rocket className="size-3.5 text-yellow-300" />
            <span>Let's work together</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4 max-w-2xl mx-auto">
            Have a project in mind?
          </h2>

          <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
            Let's build something great together. Free consultation, no
            commitment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link to={ROUTES.CONTACT}>
              <Button
                size="lg"
                className="bg-white text-brand-700 hover:bg-blue-50 shadow-2xl"
                rightIcon={<ArrowRight className="size-5" />}
              >
                Start a Project
              </Button>
            </Link>

            <EmailButton
              subject={`Project Inquiry — ${COMPANY_NAME}`}
              title={`Let's talk about your project`}
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white/30 hover:bg-white/10"
                leftIcon={<Mail className="size-5" />}
              >
                Email Us
              </Button>
            </EmailButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-blue-200">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {COMPANY_LOCATION}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {COMPANY_RESPONSE_TIME} response
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              5.0 rating
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe className="size-3.5" />
              Serving worldwide
            </span>
          </div>
        </div>
      </section>
    </>
  )
}