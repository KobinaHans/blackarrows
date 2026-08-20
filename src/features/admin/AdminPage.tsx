import { useState } from 'react'
import { KeyRound, ShieldCheck, ShieldOff, UserPlus } from 'lucide-react'
import { PageContent, PageHeader } from '../../shared/components/layout/AppShell'
import { Panel, StatusBadge, statusOf } from '../../shared/components/ui/display'
import { Button, SearchInput } from '../../shared/components/ui/primitives'
import { DataTable, type Column } from '../../shared/components/ui/DataTable'
import { AUDIT_EVENTS, USERS } from '../../shared/data/mock'
import type { AuditEvent, UserAccount } from '../../shared/types'

const severityState = { Information: 'info', Warning: 'critical', Critical: 'negative' } as const

export function AdminPage() {
  const [tab, setTab] = useState<'users' | 'audit'>('users')
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<UserAccount[]>(USERS)

  const filteredUsers = users.filter((u) => {
    const q = query.toLowerCase()
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.group.toLowerCase().includes(q)
  })

  const toggleLock = (id: string) =>
    setUsers((us) =>
      us.map((u) => (u.id === id ? { ...u, status: u.status === 'Locked' ? 'Active' : 'Locked' } : u)),
    )

  const userColumns: Column<UserAccount>[] = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <span>
          <span className="block font-medium">{u.name}</span>
          <span className="block text-xs text-ink-400">{u.email}</span>
        </span>
      ),
    },
    { key: 'group', header: 'Group', render: (u) => u.group },
    {
      key: 'roles',
      header: 'Roles',
      render: (u) => (
        <span className="flex flex-wrap gap-1">
          {u.roles.map((r) => (
            <span key={r} className="rounded bg-neutral-bg px-1.5 py-0.5 font-mono text-[10px] text-ink-700">
              {r}
            </span>
          ))}
        </span>
      ),
    },
    { key: 'branch', header: 'Branch', render: (u) => u.branch },
    {
      key: 'mfa',
      header: 'MFA',
      render: (u) =>
        u.mfaEnabled ? (
          <ShieldCheck className="h-4 w-4 text-positive" aria-label="MFA enabled" />
        ) : (
          <ShieldOff className="h-4 w-4 text-negative" aria-label="MFA disabled" />
        ),
    },
    { key: 'lastLogin', header: 'Last Login', render: (u) => <span className="text-xs text-ink-500">{u.lastLogin}</span> },
    { key: 'status', header: 'Status', render: (u) => <StatusBadge state={statusOf(u.status)}>{u.status}</StatusBadge> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (u) => (
        <Button variant={u.status === 'Locked' ? 'positive' : 'transparent'} onClick={() => toggleLock(u.id)}>
          <KeyRound className="h-3.5 w-3.5" /> {u.status === 'Locked' ? 'Unlock' : 'Lock'}
        </Button>
      ),
    },
  ]

  const auditColumns: Column<AuditEvent>[] = [
    { key: 'time', header: 'Timestamp', render: (e) => <span className="font-mono text-xs">{e.timestamp}</span> },
    { key: 'actor', header: 'Actor', render: (e) => <span className="font-medium">{e.actor}</span> },
    { key: 'action', header: 'Action', render: (e) => <span className="font-mono text-xs">{e.action}</span> },
    { key: 'module', header: 'Module', render: (e) => e.module },
    { key: 'severity', header: 'Severity', render: (e) => <StatusBadge state={severityState[e.severity]}>{e.severity}</StatusBadge> },
    { key: 'details', header: 'Details', render: (e) => <span className="text-xs text-ink-500">{e.details}</span> },
  ]

  return (
    <>
      <PageHeader
        title="Administration"
        subtitle="User accounts, role assignments and the immutable audit trail"
        actions={
          <Button variant="emphasized">
            <UserPlus className="h-4 w-4" /> Invite User
          </Button>
        }
      />
      <PageContent>
        <div className="flex gap-1 border-b border-line/60">
          {(
            [
              ['users', `Users (${users.length})`],
              ['audit', `Audit Log (${AUDIT_EVENTS.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                tab === key ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:text-ink-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'users' ? (
          <Panel padded={false}>
            <div className="border-b border-line/60 px-4 py-3">
              <SearchInput value={query} onChange={setQuery} placeholder="Search users, groups…" />
            </div>
            <DataTable columns={userColumns} rows={filteredUsers} rowKey={(u) => u.id} emptyTitle="No users found" />
          </Panel>
        ) : (
          <Panel padded={false}>
            <DataTable columns={auditColumns} rows={AUDIT_EVENTS} rowKey={(e) => e.id} />
          </Panel>
        )}
      </PageContent>
    </>
  )
}
