import { useState, useRef, useEffect } from 'react'
import { Phone, ChevronDown, Search, X } from 'lucide-react'
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  getCountryByCode,
  type Country,
} from '@/data/countries'
import { cn } from '@/lib/utils/cn'

interface PhoneInputProps {
  label?: string
  value: string // full phone with country code
  onChange: (value: string) => void
  error?: string
  helperText?: string
  disabled?: boolean
  defaultCountry?: string
}

export default function PhoneInput({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled,
  defaultCountry = DEFAULT_COUNTRY,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    getCountryByCode(defaultCountry)
  )
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Extract number from full value
  const numberOnly = value?.startsWith(selectedCountry.dialCode)
    ? value.slice(selectedCountry.dialCode.length)
    : value || ''

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [open])

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleNumberChange = (num: string) => {
    // Only allow digits, spaces, dashes, and parentheses
    const cleaned = num.replace(/[^\d\s\-()]/g, '')
    onChange(`${selectedCountry.dialCode}${cleaned}`)
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    onChange(`${country.dialCode}${numberOnly}`)
    setOpen(false)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 cursor-pointer">
          {label}
        </label>
      )}

      <div className="relative flex">
        {/* Country Selector */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setOpen((v) => !v)}
            disabled={disabled}
            aria-label="Select country"
            aria-expanded={open}
            className={cn(
              'h-11 px-2.5 sm:px-3 inline-flex items-center gap-1.5 rounded-l-lg border border-r-0 transition-all cursor-pointer',
              'bg-gray-50 dark:bg-gray-800',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              error
                ? 'border-red-400 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-700',
              open && 'bg-gray-100 dark:bg-gray-700',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <span className="text-base leading-none" aria-hidden="true">
              {selectedCountry.flag}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-mono">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown
              className={cn(
                'size-3.5 text-gray-500 transition-transform duration-200',
                open && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute top-full left-0 mt-1 w-72 max-h-80 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl z-50 overflow-hidden animate-fade-in">
              {/* Search */}
              <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country..."
                    className="w-full h-9 pl-8 pr-8 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-900/40 transition-all"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 size-5 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Country list */}
              <div className="max-h-60 overflow-y-auto py-1">
                {filteredCountries.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                    No country found
                  </p>
                ) : (
                  filteredCountries.map((country) => {
                    const isSelected = selectedCountry.code === country.code
                    return (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        <span
                          className="text-lg leading-none shrink-0"
                          aria-hidden="true"
                        >
                          {country.flag}
                        </span>
                        <span className="flex-1 text-sm truncate">
                          {country.name}
                        </span>
                        <span
                          className={cn(
                            'text-xs font-mono shrink-0',
                            isSelected
                              ? 'text-brand-600 dark:text-brand-400 font-semibold'
                              : 'text-gray-500 dark:text-gray-400'
                          )}
                        >
                          {country.dialCode}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>

              {/* Footer hint */}
              <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
                  {filteredCountries.length} of {COUNTRIES.length} countries
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="tel"
            inputMode="tel"
            value={numberOnly}
            onChange={(e) => handleNumberChange(e.target.value)}
            placeholder="300 1234567"
            disabled={disabled}
            autoComplete="tel-national"
            className={cn(
              'w-full h-11 pl-10 pr-3 rounded-r-lg border text-sm transition-all',
              'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-red-400 dark:border-red-600 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/40'
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:border-brand-500 focus:ring-brand-200 dark:focus:ring-brand-900/40',
              'disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed'
            )}
          />
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
}