import { useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertTriangle, ArrowRight, Info, ShieldAlert } from 'lucide-react'
import { PageContent, PageHeader } from '../../shared/components/layout/AppShell'
import { KpiTile, Panel, StatusBadge, statusOf } from '../../shared/components/ui/display'
import { Button } from '../../shared/components/ui/primitives'
import { DataTable, type Column } from '../../shared/components/ui/DataTable'
import {
  AUDIT_EVENTS,
  BATCH_JOBS,
  CHANNEL_MIX,
  DASHBOARD_KPIS,
  ISSUANCE_TREND,
  NETWORK_SPLIT,
} from '../../shared/data/mock'
import type { AuditEvent, BatchJob } from '../../shared/types'
import { useAuth } from '../auth/AuthContext'

const PIE_COLORS = ['#0070f2', '#36a41d', '#e76500', '#7858ff']

const batchColumns: Column<BatchJob>[] = [
  { key: 'id', header: 'Batch ID', render: (b) => <span className="font-medium text-brand-600">{b.id}</span> },
  { key: 'bank', header: 'Bank', render: (b) => b.bank },
  { key: 'records', header: 'Records', align: 'right', render: (b) => b.records.toLocaleString() },
  { key: 'status', header: 'Status', render: (b) => <StatusBadge state={statusOf(b.status)}>{b.status}</StatusBadge> },
]

const severityIcon = (s: AuditEvent['severity']) =>
  s === 'Critical' ? (
    <ShieldAlert className="h-4 w-4 shrink-0 text-negative" />
  ) : s === 'Warning' ? (
    <AlertTriangle className="h-4 w-4 shrink-0 text-critical" />
  ) : (
    <Info className="h-4 w-4 shrink-0 text-info" />
  )

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  return (
    <>
      <PageHeader
        title={`Good day, ${user?.name.split(' ')[0]}`}
        subtitle={`${user?.roleLabel} · ${user?.branch} · Wednesday, 20 Aug 2025`}
        actions={
          <Button variant="emphasized" onClick={() => navigate('/issuance')}>
            Issue a Card <ArrowRight className="h-4 w-4" />
          </Button>
        }
      />
      <PageContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {DASHBOARD_KPIS.map((kpi) => (
            <KpiTile key={kpi.label} kpi={kpi} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Panel
            title="Issuance Volume — Trailing 12 Months"
            subtitle="Instant vs. batch vs. virtual issuance"
            className="xl:col-span-2"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={ISSUANCE_TREND} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="gInstant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0070f2" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0070f2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gVirtual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7858ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7858ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e8eb" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#758ca4' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#758ca4' }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #d9d9d9', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="batch" name="Batch" stroke="#a9b4be" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="instant" name="Instant" stroke="#0070f2" fill="url(#gInstant)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="virtual" name="Virtual" stroke="#7858ff" fill="url(#gVirtual)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>

          <Panel title="Portfolio by Network" subtitle="Share of active cards">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={NETWORK_SPLIT}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={2}
                >
                  {NETWORK_SPLIT.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #d9d9d9', fontSize: 12 }} formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Panel
            title="Recent Batch Jobs"
            className="xl:col-span-2"
            padded={false}
            actions={
              <Button variant="transparent" onClick={() => navigate('/batch')}>
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            }
          >
            <DataTable
              columns={batchColumns}
              rows={BATCH_JOBS.slice(0, 5)}
              rowKey={(b) => b.id}
              onRowClick={() => navigate('/batch')}
            />
          </Panel>

          <Panel title="Activity Stream" subtitle="Latest audited events">
            <ul className="space-y-3">
              {AUDIT_EVENTS.slice(0, 6).map((ev) => (
                <li key={ev.id} className="flex items-start gap-2.5">
                  {severityIcon(ev.severity)}
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-ink-700">
                      {ev.action.replaceAll('_', ' ')}
                    </p>
                    <p className="truncate text-xs text-ink-500">{ev.details}</p>
                    <p className="text-[11px] text-ink-400">
                      {ev.timestamp} · {ev.actor}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel title="Weekly Channel Mix" subtitle="Issuance requests by originating channel">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CHANNEL_MIX} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e8eb" vertical={false} />
              <XAxis dataKey="channel" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#758ca4' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#758ca4' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #d9d9d9', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="prev" name="Previous week" fill="#a9b4be" radius={[4, 4, 0, 0]} barSize={22} />
              <Bar dataKey="week" name="This week" fill="#0070f2" radius={[4, 4, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </PageContent>
    </>
  )
}
