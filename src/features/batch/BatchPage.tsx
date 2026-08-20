import { useMemo, useState, type DragEvent } from 'react'
import { FileUp, Lock, Play, RotateCcw, UploadCloud } from 'lucide-react'
import { PageContent, PageHeader } from '../../shared/components/layout/AppShell'
import { Panel, ProgressBar, StatusBadge, statusOf } from '../../shared/components/ui/display'
import { Button, Field, Select } from '../../shared/components/ui/primitives'
import { DataTable, type Column } from '../../shared/components/ui/DataTable'
import { Modal } from '../../shared/components/ui/Modal'
import { BATCH_JOBS } from '../../shared/data/mock'
import type { BatchJob } from '../../shared/types'

export function BatchPage() {
  const [jobs, setJobs] = useState<BatchJob[]>(BATCH_JOBS)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [fileName, setFileName] = useState('')
  const [bank, setBank] = useState('Ecobank')
  const [encryption, setEncryption] = useState<'PGP' | 'AES-256'>('PGP')
  const [dragOver, setDragOver] = useState(false)

  const stats = useMemo(() => {
    const total = jobs.reduce((n, j) => n + j.records, 0)
    const errors = jobs.reduce((n, j) => n + j.errors, 0)
    const active = jobs.filter((j) => j.status === 'Processing' || j.status === 'Validating' || j.status === 'Queued').length
    return { total, errors, active }
  }, [jobs])

  const submitUpload = () => {
    if (!fileName) return
    setJobs((js) => [
      {
        id: `BTH-2025-0${200 + js.length}`,
        fileName,
        bank,
        records: Math.floor(500 + Math.random() * 9000),
        processed: 0,
        errors: 0,
        status: 'Queued',
        submittedBy: 'you',
        submittedAt: '2025-08-20 11:32',
        encryption,
      },
      ...js,
    ])
    setUploadOpen(false)
    setFileName('')
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) setFileName(f.name)
  }

  const rerun = (id: string) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, status: 'Queued', processed: 0, errors: 0 } : j)))

  const start = (id: string) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, status: 'Processing', processed: Math.floor(j.records * 0.4) } : j)))

  const columns: Column<BatchJob>[] = [
    { key: 'id', header: 'Batch ID', render: (b) => <span className="font-medium text-brand-600">{b.id}</span> },
    {
      key: 'file',
      header: 'File',
      render: (b) => (
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-ink-400" />
          <span className="font-mono text-xs">{b.fileName}</span>
        </span>
      ),
    },
    { key: 'bank', header: 'Bank', render: (b) => b.bank },
    { key: 'records', header: 'Records', align: 'right', render: (b) => b.records.toLocaleString() },
    { key: 'progress', header: 'Progress', render: (b) => <ProgressBar value={b.processed} max={b.records} state={b.status === 'Failed' ? 'negative' : b.status === 'Completed' ? 'positive' : 'info'} /> },
    {
      key: 'errors',
      header: 'Errors',
      align: 'right',
      render: (b) =>
        b.errors > 0 ? <span className="font-semibold text-negative">{b.errors}</span> : <span className="text-ink-400">0</span>,
    },
    { key: 'status', header: 'Status', render: (b) => <StatusBadge state={statusOf(b.status)}>{b.status}</StatusBadge> },
    { key: 'submitted', header: 'Submitted', render: (b) => <span className="text-xs text-ink-500">{b.submittedAt} · {b.submittedBy}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (b) => (
        <span className="inline-flex gap-1">
          {b.status === 'Queued' && (
            <Button variant="transparent" onClick={() => start(b.id)}>
              <Play className="h-3.5 w-3.5" /> Start
            </Button>
          )}
          {b.status === 'Failed' && (
            <Button variant="transparent" onClick={() => rerun(b.id)}>
              <RotateCcw className="h-3.5 w-3.5" /> Re-run
            </Button>
          )}
        </span>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Batch Processing"
        subtitle="Encrypted bulk issuance, renewals and PIN generation"
        actions={
          <Button variant="emphasized" onClick={() => setUploadOpen(true)}>
            <UploadCloud className="h-4 w-4" /> Upload Batch File
          </Button>
        }
      />
      <PageContent>
        <div className="grid grid-cols-3 gap-4">
          {[
            ['Records today', stats.total.toLocaleString()],
            ['Active jobs', String(stats.active)],
            ['Exceptions', String(stats.errors)],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-shell p-4 shadow-tile">
              <p className="text-xs font-medium text-ink-500">{l}</p>
              <p className="mt-1 text-2xl font-light">{v}</p>
            </div>
          ))}
        </div>

        <Panel title="Batch Jobs" subtitle="All files are encrypted at rest and in transit" padded={false}>
          <DataTable columns={columns} rows={jobs} rowKey={(b) => b.id} />
        </Panel>
      </PageContent>

      <Modal
        open={uploadOpen}
        title="Upload Batch File"
        onClose={() => setUploadOpen(false)}
        footer={
          <>
            <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button variant="emphasized" disabled={!fileName} onClick={submitUpload}>
              <FileUp className="h-4 w-4" /> Submit for Validation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <button
            type="button"
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => setFileName(`manual_batch_${Date.now() % 10000}.pgp`)}
            className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors ${
              dragOver ? 'border-brand-500 bg-brand-50' : 'border-line hover:border-brand-300'
            }`}
          >
            <UploadCloud className="h-8 w-8 text-brand-500" />
            <p className="mt-2 text-sm font-medium">
              {fileName || 'Drop an encrypted batch file here, or click to browse'}
            </p>
            <p className="mt-1 text-xs text-ink-400">.pgp or .aes · max 200 MB · schema v3.2</p>
          </button>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Originating bank">
              <Select value={bank} onChange={(e) => setBank(e.target.value)}>
                <option>Ecobank</option>
                <option>GTBank</option>
                <option>Absa</option>
                <option>Standard Chartered</option>
              </Select>
            </Field>
            <Field label="Encryption">
              <Select value={encryption} onChange={(e) => setEncryption(e.target.value as 'PGP' | 'AES-256')}>
                <option>PGP</option>
                <option>AES-256</option>
              </Select>
            </Field>
          </div>
        </div>
      </Modal>
    </>
  )
}
