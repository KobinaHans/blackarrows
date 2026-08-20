export type CardNetwork = 'Visa' | 'Mastercard' | 'GH-Link' | 'CPA-Azur'
export type CardType = 'Debit' | 'Credit' | 'Prepaid'
export type CardTier = 'Classic' | 'Gold' | 'Platinum' | 'Infinite'
export type CardStatus =
  | 'Active'
  | 'Pending Approval'
  | 'In Production'
  | 'Printed'
  | 'Blocked'
  | 'Expired'
  | 'Closed'

export interface CardRecord {
  id: string
  maskedPan: string
  holderName: string
  customerId: string
  network: CardNetwork
  type: CardType
  tier: CardTier
  status: CardStatus
  branch: string
  issuedAt: string
  expiresAt: string
  virtual: boolean
}

export type BatchStatus = 'Queued' | 'Validating' | 'Processing' | 'Completed' | 'Failed'

export interface BatchJob {
  id: string
  fileName: string
  bank: string
  records: number
  processed: number
  errors: number
  status: BatchStatus
  submittedBy: string
  submittedAt: string
  encryption: 'PGP' | 'AES-256'
}

export type PrintStatus = 'Queued' | 'Printing' | 'Quality Check' | 'Completed' | 'Reprint'

export interface PrintJob {
  id: string
  cardId: string
  holderName: string
  printer: 'Datacard CD800' | 'Entrust Sigma DS4' | 'Evolis Avansia'
  template: string
  status: PrintStatus
  branch: string
  queuedAt: string
  priority: 'Normal' | 'High' | 'Emergency'
}

export type RoleName =
  | 'EXECUTIVE_ADMIN'
  | 'SYSTEM_ADMIN'
  | 'CONFIG_ADMIN'
  | 'ISSUER_ADMIN'
  | 'BRANCH_ADMIN'
  | 'USER_ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'COMPLIANCE_OFFICER'
  | 'CARD_OPERATIONS'
  | 'BATCH_PROCESSOR'
  | 'PRINTING_OPERATOR'
  | 'CUSTOMER_SERVICE'
  | 'FRAUD_ANALYST'
  | 'RISK_MANAGER'
  | 'BI_SPECIALIST'
  | 'INTERNAL_AUDITOR'
  | 'VIEWER'
  | 'TRAINEE'

export interface UserAccount {
  id: string
  name: string
  email: string
  group: string
  roles: RoleName[]
  branch: string
  status: 'Active' | 'Locked' | 'Pending'
  mfaEnabled: boolean
  lastLogin: string
}

export interface AuditEvent {
  id: string
  timestamp: string
  actor: string
  action: string
  module: string
  severity: 'Information' | 'Warning' | 'Critical'
  details: string
}

export interface CardProduct {
  id: string
  name: string
  type: CardType
  tier: CardTier
  network: CardNetwork
  annualFee: number
  currency: string
  dailyLimit: number
  status: 'Live' | 'Draft' | 'Retired'
  instantIssuance: boolean
}

export interface Kpi {
  label: string
  value: string
  delta: number
  deltaLabel: string
  state: 'positive' | 'negative' | 'critical' | 'neutral'
}

export interface IssuanceApplication {
  customerName: string
  customerId: string
  idType: string
  idNumber: string
  phone: string
  email: string
  branch: string
  productId: string
  embossName: string
  delivery: 'Branch Pickup' | 'Courier' | 'Virtual Only'
  pinMethod: 'SMS OTP' | 'Branch PIN Pad' | 'Mobile App'
}
