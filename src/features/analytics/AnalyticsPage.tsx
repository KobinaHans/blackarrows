import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageContent, PageHeader } from '../../shared/components/layout/AppShell'
import { Panel } from '../../shared/components/ui/display'
import { BRANCH_PERFORMANCE, ISSUANCE_TREND } from '../../shared/data/mock'

const FUNNEL = [
  { stage: 'Applications', count: 24800 },
  { stage: 'KYC Verified', count: 23100 },
  { stage: 'Approved', count: 21400 },
  { stage: 'Issued', count: 20900 },
  { stage: 'Activated', count: 18700 },
]

const FRAUD_TREND = [
  { week: 'W28', alerts: 34, confirmed: 6 },
  { week: 'W29', alerts: 41, confirmed: 9 },
  { week: 'W30', alerts: 29, confirmed: 4 },
  { week: 'W31', alerts: 52, confirmed: 12 },
  { week: 'W32', alerts: 38, confirmed: 7 },
  { week: 'W33', alerts: 27, confirmed: 3 },
]

export function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" subtitle="Portfolio intelligence, issuance funnels and fraud signal trends" />
      <PageContent>
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Issuance Funnel" subtitle="Last 30 days, all channels">
            <div className="space-y-2.5">
              {FUNNEL.map((f, i) => {
                const pct = Math.round((f.count / FUNNEL[0].count) * 100)
                return (
                  <div key={f.stage}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium text-ink-700">{f.stage}</span>
                      <span className="tabular-nums text-ink-500">
                        {f.count.toLocaleString()} · {pct}%
                      </span>
                    </div>
                    <div className="h-4 overflow-hidden rounded bg-neutral-bg">
                      <div
                        className="h-full rounded bg-brand-500"
                        style={{ width: `${pct}%`, opacity: 1 - i * 0.13 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title="Fraud Signals" subtitle="Weekly alerts vs. confirmed fraud">
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={FRAUD_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="alerts" name="Alerts" stroke="#e76500" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="confirmed" name="Confirmed" stroke="#d20a0a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="Branch Performance" subtitle="Cards issued today with SLA compliance">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={BRANCH_PERFORMANCE} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="branch" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="issued" name="Cards issued" fill="#0070f2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="12-Month Issuance Trend" subtitle="Instant vs. batch vs. virtual issuance volume">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={ISSUANCE_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="instant" name="Instant" stroke="#0070f2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="batch" name="Batch" stroke="#256f3a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="virtual" name="Virtual" stroke="#e76500" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </PageContent>
    </>
  )
}
