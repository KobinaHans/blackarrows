import { useMemo, useState } from 'react'
import { Ban, Download, RefreshCcw, Smartphone } from 'lucide-react'
import { PageContent, PageHeader } from '../../shared/components/layout/AppShell'
import { Panel, StatusBadge, statusOf } from '../../shared/components/ui/display'
import { Button, Select, SearchInput } from '../../shared/components/ui/primitives'
import { DataTable, type Column } from '../../shared/components/ui/DataTable'
import { Modal } from '../../shared/components/ui/Modal'
import { CARDS } from '../../shared/data/mock'
import type { CardRecord, CardStatus } from '../../shared/types'

const ALL_STATUSES: CardStatus[] = [
  'Active',
  'Pending Approval',
  'In Production',
  'Printed',
  'Blocked',
  'Expired',
  'Closed',
]

export function CardsPage() {
  const [cards, setCards] = useState<CardRecord[]>(CARDS)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [network, setNetwork] = useState('All')
  const [selected, setSelected] = useState<CardRecord | null>(null)

  const filtered = useMemo(
    () =>
      cards.filter((c) => {
        const q = query.toLowerCase()
        return (
          (status === 'All' || c.status === status) &&
          (network === 'All' || c.network === network) &&
          (!q ||
            c.holderName.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            c.customerId.toLowerCase().includes(q) ||
            c.maskedPan.includes(q))
        )
      }),
    [cards, query, status, network],
  )

  const setCardStatus = (id: string, next: CardStatus) => {
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, status: next } : c)))
    setSelected((s) => (s && s.id === id ? { ...s, status: next } : s))
  }

  const columns: Column<CardRecord>[] = [
    { key: 'id', header: 'Card ID', render: (c) => <span className="font-medium text-brand-600">{c.id}</span> },
    { key: 'pan', header: 'PAN', render: (c) => <span className="font-mono text-xs">{c.maskedPan}</span> },
    { key: 'holder', header: 'Card Holder', render: (c) => c.holderName },
    { key: 'product', header: 'Product', render: (c) => `${c.network} ${c.type} ${c.tier}` },
    {
      key: 'form',
      header: 'Form',
      render: (c) =>
        c.virtual ? (
          <span className="inline-flex items-center gap-1 text-xs text-ink-500">
            <Smartphone className="h-3.5 w-3.5" /> Virtual
          </span>
        ) : (
          <span className="text-xs text-ink-500">Physical</span>
        ),
    },
    { key: 'branch', header: 'Branch', render: (c) => c.branch },
    { key: 'expires', header: 'Expires', render: (c) => c.expiresAt },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge state={statusOf(c.status)}>{c.status}</StatusBadge> },
  ]

  return (
    <>
      <PageHeader
        title="Card Management"
        subtitle={`${filtered.length.toLocaleString()} of ${cards.length.toLocaleString()} cards`}
        actions={
          <Button>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />
      <PageContent>
        <Panel padded={false}>
          <div className="flex flex-wrap items-center gap-2 border-b border-line/60 px-4 py-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Search by name, ID, PAN…" />
            <Select className="w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>All</option>
              {ALL_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <Select className="w-40" value={network} onChange={(e) => setNetwork(e.target.value)}>
              <option>All</option>
              <option>Visa</option>
              <option>Mastercard</option>
              <option>GH-Link</option>
              <option>CPA-Azur</option>
            </Select>
          </div>
          <DataTable
            columns={columns}
            rows={filtered}
            rowKey={(c) => c.id}
            onRowClick={setSelected}
            emptyTitle="No cards match your filters"
            emptyHint="Adjust the search text or filters above"
          />
        </Panel>
      </PageContent>

      <Modal
        open={Boolean(selected)}
        title={selected ? `${selected.id} — ${selected.holderName}` : ''}
        onClose={() => setSelected(null)}
        footer={
          selected && (
            <>
              {selected.status === 'Blocked' ? (
                <Button variant="positive" onClick={() => setCardStatus(selected.id, 'Active')}>
                  <RefreshCcw className="h-4 w-4" /> Unblock Card
                </Button>
              ) : (
                selected.status === 'Active' && (
                  <Button variant="negative" onClick={() => setCardStatus(selected.id, 'Blocked')}>
                    <Ban className="h-4 w-4" /> Block Card
                  </Button>
                )
              )}
              <Button variant="emphasized" onClick={() => setSelected(null)}>
                Close
              </Button>
            </>
          )
        }
      >
        {selected && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {(
              [
                ['PAN', selected.maskedPan],
                ['Customer', `${selected.holderName} (${selected.customerId})`],
                ['Product', `${selected.network} ${selected.type} ${selected.tier}`],
                ['Form factor', selected.virtual ? 'Virtual' : 'Physical'],
                ['Branch', selected.branch],
                ['Issued', selected.issuedAt],
                ['Expires', selected.expiresAt],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-ink-400">{k}</dt>
                <dd className="mt-0.5 font-medium text-ink-900">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs text-ink-400">Status</dt>
              <dd className="mt-0.5">
                <StatusBadge state={statusOf(selected.status)}>{selected.status}</StatusBadge>
              </dd>
            </div>
          </dl>
        )}
      </Modal>
    </>
  )
}
