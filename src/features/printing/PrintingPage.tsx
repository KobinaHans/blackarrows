import { useMemo, useState } from 'react'
import { CheckCheck, Flame, Printer, RotateCcw } from 'lucide-react'
import { PageContent, PageHeader } from '../../shared/components/layout/AppShell'
import { Panel, StatusBadge, statusOf } from '../../shared/components/ui/display'
import { Button, Select } from '../../shared/components/ui/primitives'
import { DataTable, type Column } from '../../shared/components/ui/DataTable'
import { PRINT_JOBS } from '../../shared/data/mock'
import type { PrintJob, PrintStatus } from '../../shared/types'

const PRINTERS = [
  { name: 'Datacard CD800', state: 'Online', utilization: 72, supplies: 'Ribbon 64%' },
  { name: 'Entrust Sigma DS4', state: 'Online', utilization: 45, supplies: 'Ribbon 31%' },
  { name: 'Evolis Avansia', state: 'Maintenance', utilization: 0, supplies: 'Laminate 12%' },
] as const

export function PrintingPage() {
  const [jobs, setJobs] = useState<PrintJob[]>(PRINT_JOBS)
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = useMemo(
    () => jobs.filter((j) => statusFilter === 'All' || j.status === statusFilter),
    [jobs, statusFilter],
  )

  const setJobStatus = (id: string, next: PrintStatus) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, status: next } : j)))

  const columns: Column<PrintJob>[] = [
    { key: 'id', header: 'Job ID', render: (j) => <span className="font-medium text-brand-600">{j.id}</span> },
    { key: 'card', header: 'Card', render: (j) => j.cardId },
    { key: 'holder', header: 'Card Holder', render: (j) => j.holderName },
    { key: 'printer', header: 'Printer', render: (j) => j.printer },
    { key: 'template', header: 'Template', render: (j) => <span className="text-xs text-ink-500">{j.template}</span> },
    {
      key: 'priority',
      header: 'Priority',
      render: (j) =>
        j.priority === 'Emergency' ? (
          <StatusBadge state="negative">
            <Flame className="h-3 w-3" /> Emergency
          </StatusBadge>
        ) : j.priority === 'High' ? (
          <StatusBadge state="critical">High</StatusBadge>
        ) : (
          <span className="text-xs text-ink-500">Normal</span>
        ),
    },
    { key: 'status', header: 'Status', render: (j) => <StatusBadge state={statusOf(j.status)}>{j.status}</StatusBadge> },
    { key: 'queued', header: 'Queued At', render: (j) => <span className="text-xs text-ink-500">{j.queuedAt}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (j) => (
        <span className="inline-flex gap-1">
          {j.status === 'Quality Check' && (
            <Button variant="positive" onClick={() => setJobStatus(j.id, 'Completed')}>
              <CheckCheck className="h-3.5 w-3.5" /> Pass QC
            </Button>
          )}
          {(j.status === 'Reprint' || j.status === 'Completed') && j.status === 'Reprint' && (
            <Button variant="transparent" onClick={() => setJobStatus(j.id, 'Queued')}>
              <RotateCcw className="h-3.5 w-3.5" /> Requeue
            </Button>
          )}
        </span>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Printing & Production"
        subtitle="Print queue, embossing and quality control across branch printers"
      />
      <PageContent>
        <div className="grid gap-4 md:grid-cols-3">
          {PRINTERS.map((p) => (
            <div key={p.name} className="rounded-xl bg-shell p-4 shadow-tile">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Printer className="h-4 w-4 text-brand-600" /> {p.name}
                </span>
                <StatusBadge state={p.state === 'Online' ? 'positive' : 'critical'}>{p.state}</StatusBadge>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-ink-500">
                <div className="flex justify-between">
                  <span>Utilization</span>
                  <span className="font-medium text-ink-900">{p.utilization}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-neutral-bg">
                  <div
                    className={`h-full rounded-full ${p.utilization > 60 ? 'bg-critical' : 'bg-brand-500'}`}
                    style={{ width: `${p.utilization}%` }}
                  />
                </div>
                <div className="flex justify-between pt-1">
                  <span>Supplies</span>
                  <span className="font-medium text-ink-900">{p.supplies}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Panel
          title="Print Queue"
          padded={false}
          actions={
            <Select className="w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All</option>
              <option>Queued</option>
              <option>Printing</option>
              <option>Quality Check</option>
              <option>Completed</option>
              <option>Reprint</option>
            </Select>
          }
        >
          <DataTable
            columns={columns}
            rows={filtered}
            rowKey={(j) => j.id}
            emptyTitle="No print jobs in this state"
          />
        </Panel>
      </PageContent>
    </>
  )
}
