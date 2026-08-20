import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Fingerprint, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Button, Field, Input, Select } from '../../shared/components/ui/primitives'
import { BRANCHES } from '../../shared/data/mock'
import { ROLE_OPTIONS, useAuth } from './AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('j.appiah@bluechip.africa')
  const [password, setPassword] = useState('••••••••••')
  const [roleIdx, setRoleIdx] = useState(3)
  const [branch, setBranch] = useState(BRANCHES[0])
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const submitCredentials = (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Enter your corporate e-mail and password.')
      return
    }
    setError('')
    setStep('mfa')
  }

  const submitMfa = (e: FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Enter the 6-digit code from your authenticator.')
      return
    }
    const option = ROLE_OPTIONS[roleIdx]
    login({
      name: email
        .split('@')[0]
        .split('.')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' '),
      email,
      role: option.role,
      roleLabel: option.label,
      branch,
    })
    navigate('/')
  }

  return (
    <div className="flex min-h-full items-stretch bg-canvas">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500 lg:flex">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-white/5" />
        <div className="relative max-w-lg px-12 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <CreditCard className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-bold tracking-tight">BlueChip Enterprise</p>
              <p className="text-sm text-brand-100">Instant Card Issuance Platform</p>
            </div>
          </div>
          <h1 className="mt-10 text-4xl font-light leading-tight">
            Issue cards in <span className="font-semibold">minutes</span>, not weeks.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-brand-100">
            End-to-end issuance, batch processing, printing and lifecycle management for banks
            across Africa — with PCI-DSS Level 1 controls built in.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-6 text-center">
            {[
              ['24–48h', 'Issuance SLA'],
              ['99.99%', 'Uptime'],
              ['1M+', 'Daily transactions'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-white/10 px-3 py-4 backdrop-blur">
                <dt className="text-xl font-semibold">{v}</dt>
                <dd className="mt-1 text-xs text-brand-100">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl bg-shell p-8 shadow-tile">
            {step === 'credentials' ? (
              <form onSubmit={submitCredentials} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">Sign in</h2>
                  <p className="mt-1 text-xs text-ink-500">
                    Use your corporate identity. SSO via SAML / Azure AD is enforced for
                    production tenants.
                  </p>
                </div>
                <Field label="Corporate e-mail" required>
                  <Input
                    type="email"
                    value={email}
                    autoComplete="username"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field label="Password" required>
                  <Input
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
                <Field label="Sign in as (demo role)">
                  <Select value={roleIdx} onChange={(e) => setRoleIdx(Number(e.target.value))}>
                    {ROLE_OPTIONS.map((o, i) => (
                      <option key={o.role} value={i}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Branch">
                  <Select value={branch} onChange={(e) => setBranch(e.target.value)}>
                    {BRANCHES.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </Select>
                </Field>
                {error && <p className="text-xs font-medium text-negative">{error}</p>}
                <Button type="submit" variant="emphasized" className="w-full">
                  <LockKeyhole className="h-4 w-4" /> Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={submitMfa} className="space-y-4">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <Fingerprint className="h-5 w-5 text-brand-600" /> Two-factor verification
                  </h2>
                  <p className="mt-1 text-xs text-ink-500">
                    MFA is mandatory for all user groups. Enter the 6-digit TOTP code — any code
                    works in this demo.
                  </p>
                </div>
                <Field label="Authenticator code" required>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    className="text-center text-lg tracking-[0.5em]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </Field>
                {error && <p className="text-xs font-medium text-negative">{error}</p>}
                <Button type="submit" variant="emphasized" className="w-full">
                  <ShieldCheck className="h-4 w-4" /> Verify & sign in
                </Button>
                <Button
                  type="button"
                  variant="transparent"
                  className="w-full"
                  onClick={() => setStep('credentials')}
                >
                  Back
                </Button>
              </form>
            )}
          </div>
          <p className="mt-4 text-center text-[11px] text-ink-400">
            Protected by adaptive MFA · Sessions time out per role policy · All activity audited
          </p>
        </div>
      </div>
    </div>
  )
}
