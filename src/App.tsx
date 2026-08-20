import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './features/auth/AuthContext'
import { LoginPage } from './features/auth/LoginPage'
import { AppShell } from './shared/components/layout/AppShell'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { IssuancePage } from './features/issuance/IssuancePage'
import { CardsPage } from './features/cards/CardsPage'
import { BatchPage } from './features/batch/BatchPage'
import { PrintingPage } from './features/printing/PrintingPage'
import { ReportsPage } from './features/reports/ReportsPage'
import { AnalyticsPage } from './features/analytics/AnalyticsPage'
import { AdminPage } from './features/admin/AdminPage'
import { ConfigurationPage } from './features/configuration/ConfigurationPage'

function ProtectedRoutes() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <AppShell />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/issuance" element={<IssuancePage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/batch" element={<BatchPage />} />
            <Route path="/printing" element={<PrintingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/configuration" element={<ConfigurationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
