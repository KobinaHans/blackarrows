import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

type ButtonVariant = 'emphasized' | 'default' | 'transparent' | 'negative' | 'positive'

const buttonStyles: Record<ButtonVariant, string> = {
  emphasized:
    'bg-brand-600 text-white border-brand-600 hover:bg-brand-700 hover:border-brand-700 active:bg-brand-800',
  default:
    'bg-white text-brand-600 border-line hover:bg-brand-50 hover:border-brand-400 active:bg-brand-100',
  transparent:
    'bg-transparent text-brand-600 border-transparent hover:bg-brand-50 active:bg-brand-100',
  negative:
    'bg-white text-negative border-negative/40 hover:bg-negative-bg/40 active:bg-negative-bg',
  positive:
    'bg-white text-positive border-positive/40 hover:bg-positive-bg/40 active:bg-positive-bg',
}

export function Button({
  variant = 'default',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:opacity-40 ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  )
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-8 w-full rounded border border-ink-400/60 bg-white px-2 text-sm text-ink-900 placeholder:text-ink-400 hover:border-brand-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-neutral-bg disabled:text-ink-400 ${className}`}
      {...props}
    />
  )
}

export function Select({
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`h-8 w-full cursor-pointer rounded border border-ink-400/60 bg-white px-2 text-sm text-ink-900 hover:border-brand-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-500">
        {label}
        {required && <span className="ml-0.5 text-negative">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-400">{hint}</span>}
    </label>
  )
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative w-64">
      <svg
        className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>
      <Input
        className="pl-8"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
