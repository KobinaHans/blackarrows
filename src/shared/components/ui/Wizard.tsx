import { Check } from 'lucide-react'

export function WizardSteps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step} className="flex items-center">
            {i > 0 && <span className={`mx-2 h-px w-8 sm:w-14 ${done || active ? 'bg-brand-500' : 'bg-line'}`} />}
            <span className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                  done
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : active
                      ? 'border-brand-500 bg-white text-brand-600'
                      : 'border-line bg-white text-ink-400'
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`hidden text-xs font-medium md:block ${active ? 'text-ink-900' : 'text-ink-400'}`}
              >
                {step}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
