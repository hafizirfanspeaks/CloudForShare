import { useState, useEffect } from 'react'
import { X, Sparkles, Type, Upload, Link2, QrCode } from 'lucide-react'
import Button from '@/components/common/Button'
import { cn } from '@/lib/utils/cn'

const STORAGE_KEY = 'cloudforshare-onboarding-done'

const STEPS = [
  {
    icon: Type,
    title: 'Type anything',
    desc: 'The text area is your live notepad. Type, paste, and it saves automatically.',
  },
  {
    icon: Upload,
    title: 'Drop files anywhere',
    desc: 'Drag & drop files anywhere on the page. Or paste images with Ctrl+V.',
  },
  {
    icon: Link2,
    title: 'Share the link',
    desc: 'Copy the link and share it. Everyone sees the same content in real-time.',
  },
  {
    icon: QrCode,
    title: 'Scan with phone',
    desc: 'Click QR to show a scannable code. Perfect for moving files between devices.',
  },
]

export default function OnboardingTour() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) {
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  const current = STEPS[step]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center">
              <Sparkles className="size-3.5 text-brand-600 dark:text-brand-400" />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="size-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            aria-label="Close tour"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <div className="size-16 rounded-2xl bg-linear-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Icon className="size-8 text-white" strokeWidth={2} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {current.desc}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 pb-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                'h-1.5 rounded-full transition-all cursor-pointer',
                i === step
                  ? 'w-6 bg-brand-500'
                  : 'w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              )}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <Button variant="ghost" onClick={handleClose} fullWidth>
            Skip
          </Button>
          <Button onClick={handleNext} fullWidth>
            {step < STEPS.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </div>
      </div>
    </div>
  )
}