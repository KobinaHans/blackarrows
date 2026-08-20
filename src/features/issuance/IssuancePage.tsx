import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Nfc,
  ShieldCheck,
  Sparkles,
  Wifi,
} from 'lucide-react'
import { PageContent, PageHeader } from '../../shared/components/layout/AppShell'
import { Panel, StatusBadge } from '../../shared/components/ui/display'
import { Button, Field, Input, Select } from '../../shared/components/ui/primitives'
import { WizardSteps } from '../../shared/components/ui/Wizard'
import { BRANCHES, CARD_PRODUCTS } from '../../shared/data/mock'
import type { CardProduct, IssuanceApplication } from '../../shared/types'
import { useAuth } from '../auth/AuthContext'

const STEPS = ['Customer & KYC', 'Card Product', 'Personalization', 'Review & Issue']

const emptyApp: IssuanceApplication = {
  customerName: '',
  customerId: '',
  idType: 'Ghana Card',
  idNumber: '',
  phone: '',
  email: '',
  branch: BRANCHES[0],
  productId: '',
  embossName: '',
  delivery: 'Branch Pickup',
  pinMethod: 'SMS OTP',
}

const tierGradient: Record<CardProduct['tier'], string> = {
  Classic: 'from-slate-600 to-slate-800',
  Gold: 'from-amber-500 to-amber-700',
  Platinum: 'from-zinc-400 to-zinc-600',
  Infinite: 'from-ink-900 to-black',
}

function CardPreview({ product, embossName }: { product?: CardProduct; embossName: string }) {
  return (
    <div
      className={`relative aspect-[1.586] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-popover ${product ? tierGradient[product.tier] : 'from-brand-600 to-brand-800'}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold tracking-wide">BlueChip</span>
        <Wifi className="h-5 w-5 rotate-90 opacity-80" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="flex h-8 w-11 items-center justify-center rounded bg-gradient-to-br from-yellow-200 to-yellow-400">
          <Nfc className="h-4 w-4 text-yellow-800" />
        </span>
      </div>
      <p className="mt-4 font-mono text-lg tracking-[0.18em]">5312 •••• •••• 0184</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wider opacity-70">Card Holder</p>
          <p className="text-sm font-medium uppercase tracking-wide">
            {embossName || 'YOUR NAME HERE'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wider opacity-70">Valid Thru</p>
          <p className="text-sm font-medium">08/29</p>
        </div>
      </div>
      <p className="absolute bottom-4 right-5 text-sm font-bold italic opacity-90">
        {product?.network ?? 'Visa'}
      </p>
    </div>
  )
}

export function IssuancePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [app, setApp] = useState<IssuanceApplication>({ ...emptyApp, branch: user?.branch ?? BRANCHES[0] })
  const [issued, setIssued] = useState<string | null>(null)

  const product = useMemo(() => CARD_PRODUCTS.find((p) => p.id === app.productId), [app.productId])
  const set = <K extends keyof IssuanceApplication>(key: K, value: IssuanceApplication[K]) =>
    setApp((a) => ({ ...a, [key]: value }))

  const stepValid = [
    Boolean(app.customerName && app.idNumber && app.phone),
    Boolean(app.productId),
    Boolean(app.embossName),
    true,
  ][step]

  const issue = () => {
    setIssued(`CRD-${Math.floor(10000 + Math.random() * 89999)}`)
  }

  if (issued) {
    return (
      <>
        <PageHeader title="Instant Card Issuance" subtitle="Application → Approval → Production → Delivery" />
        <PageContent>
          <Panel className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 className="h-14 w-14 text-positive" />
              <h2 className="mt-4 text-2xl font-bold">Card issued successfully</h2>
              <p className="mt-2 max-w-md text-sm text-ink-500">
                Card <span className="font-semibold text-ink-900">{issued}</span> for{' '}
                <span className="font-semibold text-ink-900">{app.customerName}</span> has been
                created, KYC-cleared and routed to the {app.branch} print queue. PIN delivery via{' '}
                {app.pinMethod}.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <StatusBadge state="positive">KYC Verified</StatusBadge>
                <StatusBadge state="positive">AML Screened</StatusBadge>
                <StatusBadge state="info">In Production</StatusBadge>
              </div>
              <div className="mt-8 flex gap-2">
                <Button variant="emphasized" onClick={() => navigate('/printing')}>
                  Track in Print Queue
                </Button>
                <Button
                  onClick={() => {
                    setIssued(null)
                    setApp({ ...emptyApp, branch: user?.branch ?? BRANCHES[0] })
                    setStep(0)
                  }}
                >
                  Issue Another Card
                </Button>
              </div>
            </div>
          </Panel>
        </PageContent>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Instant Card Issuance"
        subtitle="Application → Approval → Production → Delivery"
      />
      <PageContent>
        <Panel padded={false}>
          <div className="flex justify-center border-b border-line/60 px-4 py-4">
            <WizardSteps steps={STEPS} current={step} />
          </div>

          <div className="p-6">
            {step === 0 && (
              <div className="grid max-w-3xl gap-4 md:grid-cols-2">
                <Field label="Full legal name" required>
                  <Input
                    value={app.customerName}
                    placeholder="e.g. Ama Serwaa Boateng"
                    onChange={(e) => {
                      set('customerName', e.target.value)
                      set('embossName', e.target.value.toUpperCase())
                    }}
                  />
                </Field>
                <Field label="Existing CIF (optional)" hint="Leave blank to create a new customer">
                  <Input
                    value={app.customerId}
                    placeholder="CIF-7XXXXX"
                    onChange={(e) => set('customerId', e.target.value)}
                  />
                </Field>
                <Field label="ID type" required>
                  <Select value={app.idType} onChange={(e) => set('idType', e.target.value)}>
                    <option>Ghana Card</option>
                    <option>Passport</option>
                    <option>Driver's License</option>
                    <option>Voter ID</option>
                  </Select>
                </Field>
                <Field label="ID number" required>
                  <Input
                    value={app.idNumber}
                    placeholder="GHA-XXXXXXXXX-X"
                    onChange={(e) => set('idNumber', e.target.value)}
                  />
                </Field>
                <Field label="Mobile number" required>
                  <Input
                    value={app.phone}
                    placeholder="+233 XX XXX XXXX"
                    onChange={(e) => set('phone', e.target.value)}
                  />
                </Field>
                <Field label="E-mail">
                  <Input
                    type="email"
                    value={app.email}
                    placeholder="customer@example.com"
                    onChange={(e) => set('email', e.target.value)}
                  />
                </Field>
                <Field label="Issuing branch">
                  <Select value={app.branch} onChange={(e) => set('branch', e.target.value)}>
                    {BRANCHES.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </Select>
                </Field>
                <div className="flex items-end">
                  <div className="flex items-center gap-2 rounded-lg bg-positive-bg/60 px-3 py-2 text-xs font-medium text-positive">
                    <ShieldCheck className="h-4 w-4" />
                    Real-time KYC &amp; AML screening runs automatically on submit
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {CARD_PRODUCTS.filter((p) => p.status === 'Live').map((p) => {
                  const selected = app.productId === p.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => set('productId', p.id)}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                          : 'border-line bg-white hover:border-brand-300 hover:shadow-tile'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                          <CreditCard className="h-5 w-5" />
                        </span>
                        {p.instantIssuance && (
                          <StatusBadge state="info">
                            <Sparkles className="h-3 w-3" /> Instant
                          </StatusBadge>
                        )}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-ink-900">{p.name}</p>
                      <p className="text-xs text-ink-500">
                        {p.network} · {p.type} · {p.tier}
                      </p>
                      <dl className="mt-3 grid grid-cols-2 gap-1 text-xs">
                        <dt className="text-ink-400">Annual fee</dt>
                        <dd className="text-right font-medium">
                          {p.annualFee === 0 ? 'Free' : `${p.currency} ${p.annualFee}`}
                        </dd>
                        <dt className="text-ink-400">Daily limit</dt>
                        <dd className="text-right font-medium">
                          {p.currency} {p.dailyLimit.toLocaleString()}
                        </dd>
                      </dl>
                    </button>
                  )
                })}
              </div>
            )}

            {step === 2 && (
              <div className="grid max-w-4xl gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <Field
                    label="Emboss name"
                    required
                    hint="Max 26 characters, printed on the card front"
                  >
                    <Input
                      value={app.embossName}
                      maxLength={26}
                      onChange={(e) => set('embossName', e.target.value.toUpperCase())}
                    />
                  </Field>
                  <Field label="Delivery method">
                    <Select
                      value={app.delivery}
                      onChange={(e) => set('delivery', e.target.value as IssuanceApplication['delivery'])}
                    >
                      <option>Branch Pickup</option>
                      <option>Courier</option>
                      <option>Virtual Only</option>
                    </Select>
                  </Field>
                  <Field label="PIN delivery">
                    <Select
                      value={app.pinMethod}
                      onChange={(e) => set('pinMethod', e.target.value as IssuanceApplication['pinMethod'])}
                    >
                      <option>SMS OTP</option>
                      <option>Branch PIN Pad</option>
                      <option>Mobile App</option>
                    </Select>
                  </Field>
                </div>
                <div className="flex items-start justify-center">
                  <CardPreview product={product} embossName={app.embossName} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid max-w-4xl gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-ink-900">Application summary</h3>
                  <dl className="space-y-2 text-sm">
                    {(
                      [
                        ['Customer', app.customerName],
                        ['ID', `${app.idType} · ${app.idNumber}`],
                        ['Contact', `${app.phone}${app.email ? ` · ${app.email}` : ''}`],
                        ['Branch', app.branch],
                        ['Product', product ? `${product.name} (${product.network} ${product.tier})` : '—'],
                        ['Emboss name', app.embossName],
                        ['Delivery', app.delivery],
                        ['PIN method', app.pinMethod],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-line/50 pb-2">
                        <dt className="text-ink-400">{k}</dt>
                        <dd className="text-right font-medium text-ink-900">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 space-y-2">
                    {[
                      'KYC identity verification — passed',
                      'AML / sanctions screening — no hits',
                      'Credit bureau check — not required for this product',
                      'Approval workflow — auto-approved (within branch limit)',
                    ].map((line) => (
                      <p key={line} className="flex items-center gap-2 text-xs text-ink-500">
                        <BadgeCheck className="h-4 w-4 shrink-0 text-positive" /> {line}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex items-start justify-center">
                  <CardPreview product={product} embossName={app.embossName} />
                </div>
              </div>
            )}
          </div>

          <footer className="flex items-center justify-between border-t border-line/60 px-6 py-3">
            <Button
              variant="transparent"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button variant="emphasized" disabled={!stepValid} onClick={() => setStep((s) => s + 1)}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="emphasized" onClick={issue}>
                <Sparkles className="h-4 w-4" /> Issue Card Now
              </Button>
            )}
          </footer>
        </Panel>
      </PageContent>
    </>
  )
}
