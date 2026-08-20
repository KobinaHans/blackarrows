import { useState, type ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  CreditCard,
  FileStack,
  LayoutDashboard,
  LogOut,
  Menu,
  Printer,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  WalletCards,
} from 'lucide-react'
import { useAuth } from '../../../features/auth/AuthContext'

const NAV = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/issuance', label: 'Instant Issuance', icon: Sparkles },
  { to: '/cards', label: 'Card Management', icon: WalletCards },
  { to: '/batch', label: 'Batch Processing', icon: FileStack },
  { to: '/printing', label: 'Printing & Production', icon: Printer },
  { to: '/reports', label: 'Reports', icon: FileStack },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin', label: 'Administration', icon: Users },
  { to: '/configuration', label: 'Configuration', icon: Settings2 },
]

function SideNavItem({
  to,
  label,
  icon: Icon,
  end,
  collapsed,
}: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  collapsed: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-brand-50 text-brand-700 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-brand-600'
            : 'text-ink-700 hover:bg-canvas'
        }`
      }
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <header className="z-20 flex h-13 shrink-0 items-center gap-3 border-b border-line/70 bg-shell px-4 shadow-sm">
        <button
          aria-label="Toggle navigation"
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-lg p-2 text-ink-700 hover:bg-canvas"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
          aria-label="Go to home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <CreditCard className="h-4 w-4" />
          </span>
          <span className="text-base font-bold tracking-tight text-ink-900">
            BlueChip <span className="font-light text-ink-500">Card Issuance</span>
          </span>
        </button>
        <div className="mx-auto hidden w-full max-w-md items-center md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              placeholder="Search cards, customers, batches…"
              className="h-8 w-full rounded-full border border-line bg-canvas pl-9 pr-3 text-sm placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <button
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-ink-700 hover:bg-canvas"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-negative text-[10px] font-bold text-white">
              3
            </span>
          </button>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full p-1 hover:bg-canvas"
              aria-label="User menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {user?.name
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')}
              </span>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-shell p-2 shadow-popover">
                <div className="border-b border-line/60 px-3 py-2">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-ink-500">{user?.email}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-positive" /> {user?.roleLabel} ·{' '}
                    {user?.branch}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-700 hover:bg-canvas"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <nav
          className={`flex shrink-0 flex-col gap-0.5 border-r border-line/70 bg-shell p-2 transition-all ${collapsed ? 'w-14' : 'w-60'}`}
        >
          {NAV.map((item) => (
            <SideNavItem key={item.to} {...item} collapsed={collapsed} />
          ))}
          <div className="mt-auto border-t border-line/60 pt-2">
            <div
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-ink-400 ${collapsed ? 'justify-center' : ''}`}
            >
              <UserRound className="h-4 w-4 shrink-0" />
              {!collapsed && <span>v2.4.1 · PCI-DSS L1</span>}
            </div>
          </div>
        </nav>
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-line/60 bg-shell px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

export function PageContent({ children }: { children: ReactNode }) {
  return <div className="space-y-4 p-6">{children}</div>
}
