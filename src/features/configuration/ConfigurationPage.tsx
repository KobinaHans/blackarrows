import { useState } from 'react'
import { Blocks, CreditCard, PlugZap, Save } from 'lucide-react'
import { PageContent, PageHeader } from '../../shared/components/layout/AppShell'
import { Panel, StatusBadge, statusOf } from '../../shared/components/ui/display'
import { Button } from '../../shared/components/ui/primitives'
import { DataTable, type Column } from '../../shared/components/ui/DataTable'
import { CARD_PRODUCTS } from '../../shared/data/mock'
import type { CardProduct } from '../../shared/types'

const INTEGRATIONS = [
  { name: 'Temenos T24 Core Banking', kind: 'Core Banking', status: 'Connected', latency: '42 ms' },
  { name: 'Visa DPS', kind: 'Payment Network', status: 'Connected', latency: '118 ms' },
  { name: 'Mastercard MDES', kind: 'Payment Network', status: 'Connected', latency: '96 ms' },
  { name: 'GhIPSS GH-Link Switch', kind: 'National Switch', status: 'Connected', latency: '35 ms' },
  { name: 'NIA Ghana Card Verification', kind: 'Identity / KYC', status: 'Connected', latency: '210 ms' },
  { name: 'World-Check One (AML)', kind: 'Compliance', status: 'Degraded', latency: '1.4 s' },
  { name: 'HSM Cluster (Thales payShield)', kind: 'Cryptography', status: 'Connected', latency: '4 ms' },
] as const

interface ToggleDef {
  key: string
  label: string
  hint: string
}

const FEATURE_TOGGLES: ToggleDef[] = [
  { key: 'instant', label: 'Instant issuance', hint: 'Allow branch-level card issuance within minutes' },
  { key: 'virtual', label: 'Virtual-first issuance', hint: 'Issue a virtual card immediately while the plastic prints' },
  { key: 'dualControl', label: 'Dual control for overrides', hint: 'Require a second approver for AML and limit overrides' },
  { key: 'autoHalt', label: 'Auto-halt failing batches', hint: 'Stop batch jobs that exceed a 10% error threshold' },
  { key: 'biometric', label: 'Biometric verification', hint: 'Fingerprint match against NIA during KYC' },
]

export function ConfigurationPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    instant: true,
    virtual: true,
    dualControl: true,
    autoHalt: true,
    biometric: false,
  })
  const [saved, setSaved] = useState(false)

  const productColumns: Column<CardProduct>[] = [
    { key: 'id', header: 'ID', render: (p) => <span className="font-mono text-xs">{p.id}</span> },
    { key: 'name', header: 'Product', render: (p) => <span className="font-medium">{p.name}</span> },
    { key: 'network', header: 'Network', render: (p) => p.network },
    { key: 'type', header: 'Type', render: (p) => `${p.type} · ${p.tier}` },
    { key: 'fee', header: 'Annual Fee', align: 'right', render: (p) => (p.annualFee === 0 ? 'Free' : `${p.currency} ${p.annualFee}`) },
    { key: 'limit', header: 'Daily Limit', align: 'right', render: (p) => `${p.currency} ${p.dailyLimit.toLocaleString()}` },
    {
      key: 'instant',
      header: 'Instant',
      render: (p) =>
        p.instantIssuance ? <StatusBadge state="positive">Yes</StatusBadge> : <StatusBadge state="neutral">No</StatusBadge>,
    },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge state={statusOf(p.status)}>{p.status}</StatusBadge> },
  ]

  return (
    <>
      <PageHeader
        title="Configuration"
        subtitle="Card products, platform feature flags and external integrations"
        actions={
          <Button variant="emphasized" onClick={() => setSaved(true)}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        }
      />
      <PageContent>
        {saved && (
          <div className="flex items-center justify-between rounded-xl bg-positive-bg px-4 py-3 text-sm font-medium text-positive">
            <span>Configuration saved. Changes propagate to all branches within 60 seconds.</span>
            <button className="text-xs underline" onClick={() => setSaved(false)}>
              Dismiss
            </button>
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Feature Flags" subtitle="Platform-wide behaviour switches">
            <ul className="divide-y divide-line/60">
              {FEATURE_TOGGLES.map((t) => (
                <li key={t.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <span>
                    <span className="flex items-center gap-2 text-sm font-medium text-ink-900">
                      <Blocks className="h-4 w-4 text-brand-600" /> {t.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-400">{t.hint}</span>
                  </span>
                  <button
                    role="switch"
                    aria-checked={toggles[t.key]}
                    aria-label={t.label}
                    onClick={() => setToggles((v) => ({ ...v, [t.key]: !v[t.key] }))}
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                      toggles[t.key] ? 'bg-brand-600' : 'bg-ink-400/50'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
                        toggles[t.key] ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Integrations" subtitle="Connected external systems and health" padded={false}>
            <ul className="divide-y divide-line/60">
              {INTEGRATIONS.map((i) => (
                <li key={i.name} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <PlugZap className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-ink-900">{i.name}</span>
                      <span className="block text-xs text-ink-400">{i.kind} · {i.latency}</span>
                    </span>
                  </span>
                  <StatusBadge state={i.status === 'Connected' ? 'positive' : 'critical'}>{i.status}</StatusBadge>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title="Card Products"
          subtitle="Product catalog with limits and issuance settings"
          padded={false}
          actions={
            <Button>
              <CreditCard className="h-4 w-4" /> New Product
            </Button>
          }
        >
          <DataTable columns={productColumns} rows={CARD_PRODUCTS} rowKey={(p) => p.id} />
        </Panel>
      </PageContent>
    </>
  )
}
