import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import type { Kpi } from '../../types'

type Semantic = 'positive' | 'negative' | 'critical' | 'info' | 'neutral'

const badgeStyles: Record<Semantic, string> = {
  positive: 'bg-positive-bg text-positive',
  negative: 'bg-negative-bg text-negative',
  critical: 'bg-critical-bg text-critical',
  info: 'bg-info-bg text-info',
  neutral: 'bg-neutral-bg text-neutral',
}

export function StatusBadge({ state, children }: { state: Semantic; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold ${badgeStyles[state]}`}
    >
      {children}
    </span>
  )
}

export function statusOf(status: string): Semantic {
  switch (status) {
    case 'Active':
    case 'Completed':
    case 'Live':
      return 'positive'
    case 'Failed':
    case 'Blocked':
    case 'Locked':
    case 'Closed':
      return 'negative'
    case 'Pending Approval':
    case 'Pending':
    case 'Reprint':
    case 'Expired':
    case 'Quality Check':
      return 'critical'
    case 'Processing':
    case 'Printing':
    case 'In Production':
    case 'Validating':
    case 'Printed':
      return 'info'
    default:
      return 'neutral'
  }
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className = '',
  padded = true,
}: {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <section className={`rounded-xl bg-shell shadow-tile ${className}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-line/60 px-4 py-3">
          <div>
            {title && <h2 className="text-base font-semibold text-ink-900">{title}</h2>}
            {subtitle && <p className="text-xs text-ink-500">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={padded ? 'p-4' : ''}>{children}</div>
    </section>
  )
}

export function KpiTile({ kpi }: { kpi: Kpi }) {
  const trendColor =
    kpi.state === 'positive'
      ? 'text-positive'
      : kpi.state === 'negative'
        ? 'text-negative'
        : kpi.state === 'critical'
          ? 'text-critical'
          : 'text-ink-500'
  const TrendIcon = kpi.delta > 0 ? TrendingUp : kpi.delta < 0 ? TrendingDown : Minus
  return (
    <div className="rounded-xl bg-shell p-4 shadow-tile transition-shadow hover:shadow-popover">
      <p className="text-xs font-medium text-ink-500">{kpi.label}</p>
      <p className="mt-2 text-2xl font-light text-ink-900">{kpi.value}</p>
      <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${trendColor}`}>
        <TrendIcon className="h-3.5 w-3.5" />
        {kpi.delta !== 0 && `${kpi.delta > 0 ? '+' : ''}${kpi.delta}%`} {kpi.deltaLabel}
      </p>
    </div>
  )
}

export function ProgressBar({ value, max, state = 'info' }: { value: number; max: number; state?: Semantic }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  const bar =
    state === 'positive'
      ? 'bg-positive'
      : state === 'negative'
        ? 'bg-negative'
        : state === 'critical'
          ? 'bg-critical'
          : 'bg-brand-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-neutral-bg">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-ink-500">{pct}%</span>
    </div>
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm font-semibold text-ink-700">{title}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  )
}
