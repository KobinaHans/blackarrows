import { useState } from 'react'
import { CalendarClock, Download, FileBarChart2, FileSpreadsheet, FileText, Landmark, ShieldAlert } from 'lucide-react'
import { PageContent, PageHeader } from '../../shared/components/layout/AppShell'
import { Panel, StatusBadge } from '../../shared/components/ui/display'
import { Button, Select } from '../../shared/components/ui/primitives'
import { DataTable, type Column } from '../../shared/components/ui/DataTable'

interface ReportDef {
  id: string
  name: string
  category: 'Operational' | 'Regulatory' | 'Financial' | 'Compliance'
  schedule: string
  lastRun: string
  format: 'PDF' | 'XLSX' | 'CSV'
  icon: typeof FileText
}

const REPORTS: ReportDef[] = [
  { id: 'RPT-001', name: 'Daily Issuance Summary', category: 'Operational', schedule: 'Daily 06:00', lastRun: '2025-08-20 06:00', format: 'PDF', icon: FileBarChart2 },
  { id: 'RPT-002', name: 'Card Inventory & Stock', category: 'Operational', schedule: 'Weekly Mon', lastRun: '2025-08-18 06:00', format: 'XLSX', icon: FileSpreadsheet },
  { id: 'RPT-003', name: 'Bank of Ghana Returns', category: 'Regulatory', schedule: 'Monthly 1st', lastRun: '2025-08-01 05:00', format: 'XLSX', icon: Landmark },
  { id: 'RPT-004', name: 'AML Screening Exceptions', category: 'Compliance', schedule: 'Daily 07:00', lastRun: '2025-08-20 07:00', format: 'PDF', icon: ShieldAlert },
  { id: 'RPT-005', name: 'Interchange & Fee Revenue', category: 'Financial', schedule: 'Monthly 2nd', lastRun: '2025-08-02 05:30', format: 'XLSX', icon: FileSpreadsheet },
  { id: 'RPT-006', name: 'Print Production QC Log', category: 'Operational', schedule: 'Daily 18:00', lastRun: '2025-08-19 18:00', format: 'CSV', icon: FileText },
  { id: 'RPT-007', name: 'PCI-DSS Access Review', category: 'Compliance', schedule: 'Quarterly', lastRun: '2025-07-01 05:00', format: 'PDF', icon: ShieldAlert },
  { id: 'RPT-008', name: 'Branch SLA Performance', category: 'Operational', schedule: 'Weekly Mon', lastRun: '2025-08-18 06:30', format: 'PDF', icon: FileBarChart2 },
]

const categoryState = {
  Operational: 'info',
  Regulatory: 'critical',
  Financial: 'positive',
  Compliance: 'negative',
} as const

export function ReportsPage() {
  const [category, setCategory] = useState('All')
  const [generated, setGenerated] = useState<string | null>(null)

  const rows = REPORTS.filter((r) => category === 'All' || r.category === category)

  const columns: Column<ReportDef>[] = [
    {
      key: 'name',
      header: 'Report',
      render: (r) => (
        <span className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <r.icon className="h-4 w-4" />
          </span>
          <span>
            <span className="block font-medium">{r.name}</span>
            <span className="block text-xs text-ink-400">{r.id}</span>
          </span>
        </span>
      ),
    },
    { key: 'category', header: 'Category', render: (r) => <StatusBadge state={categoryState[r.category]}>{r.category}</StatusBadge> },
    {
      key: 'schedule',
      header: 'Schedule',
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-500">
          <CalendarClock className="h-3.5 w-3.5" /> {r.schedule}
        </span>
      ),
    },
    { key: 'lastRun', header: 'Last Run', render: (r) => <span className="text-xs text-ink-500">{r.lastRun}</span> },
    { key: 'format', header: 'Format', render: (r) => <span className="font-mono text-xs">{r.format}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        <Button variant="transparent" onClick={() => setGenerated(r.name)}>
          <Download className="h-3.5 w-3.5" /> Generate
        </Button>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Reports" subtitle="Scheduled and on-demand operational, regulatory and compliance reporting" />
      <PageContent>
        {generated && (
          <div className="flex items-center justify-between rounded-xl bg-positive-bg px-4 py-3 text-sm font-medium text-positive">
            <span>“{generated}” has been queued — you will be notified when it is ready for download.</span>
            <button className="text-xs underline" onClick={() => setGenerated(null)}>
              Dismiss
            </button>
          </div>
        )}
        <Panel
          title="Report Catalog"
          padded={false}
          actions={
            <Select className="w-40" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>All</option>
              <option>Operational</option>
              <option>Regulatory</option>
              <option>Financial</option>
              <option>Compliance</option>
            </Select>
          }
        >
          <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />
        </Panel>
      </PageContent>
    </>
  )
}
