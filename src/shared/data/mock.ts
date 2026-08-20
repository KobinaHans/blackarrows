import type {
  AuditEvent,
  BatchJob,
  CardProduct,
  CardRecord,
  Kpi,
  PrintJob,
  UserAccount,
} from '../types'

export const BRANCHES = [
  'Accra Main',
  'Kumasi Adum',
  'Takoradi Harbour',
  'Tema Community 1',
  'Tamale Central',
  'Cape Coast',
]

export const CARD_PRODUCTS: CardProduct[] = [
  { id: 'PRD-001', name: 'Everyday Debit Classic', type: 'Debit', tier: 'Classic', network: 'Visa', annualFee: 0, currency: 'GHS', dailyLimit: 5000, status: 'Live', instantIssuance: true },
  { id: 'PRD-002', name: 'Premier Debit Gold', type: 'Debit', tier: 'Gold', network: 'Visa', annualFee: 120, currency: 'GHS', dailyLimit: 20000, status: 'Live', instantIssuance: true },
  { id: 'PRD-003', name: 'Infinite Debit', type: 'Debit', tier: 'Infinite', network: 'Visa', annualFee: 600, currency: 'GHS', dailyLimit: 100000, status: 'Live', instantIssuance: false },
  { id: 'PRD-004', name: 'World Credit Platinum', type: 'Credit', tier: 'Platinum', network: 'Mastercard', annualFee: 450, currency: 'GHS', dailyLimit: 50000, status: 'Live', instantIssuance: true },
  { id: 'PRD-005', name: 'Standard Credit Classic', type: 'Credit', tier: 'Classic', network: 'Mastercard', annualFee: 80, currency: 'GHS', dailyLimit: 8000, status: 'Live', instantIssuance: true },
  { id: 'PRD-006', name: 'GH-Link Everyday', type: 'Debit', tier: 'Classic', network: 'GH-Link', annualFee: 0, currency: 'GHS', dailyLimit: 3000, status: 'Live', instantIssuance: true },
  { id: 'PRD-007', name: 'Corporate Prepaid', type: 'Prepaid', tier: 'Gold', network: 'CPA-Azur', annualFee: 60, currency: 'GHS', dailyLimit: 15000, status: 'Live', instantIssuance: true },
  { id: 'PRD-008', name: 'Gift Prepaid', type: 'Prepaid', tier: 'Classic', network: 'GH-Link', annualFee: 0, currency: 'GHS', dailyLimit: 1000, status: 'Draft', instantIssuance: true },
]

const FIRST = ['Kofi', 'Ama', 'Kwame', 'Abena', 'Yaw', 'Efua', 'Kojo', 'Akosua', 'Kwesi', 'Adwoa', 'Nana', 'Esi', 'Kwabena', 'Afia', 'Fiifi', 'Araba', 'Kobina', 'Aba', 'Ekow', 'Maame']
const LAST = ['Mensah', 'Owusu', 'Boateng', 'Asante', 'Osei', 'Appiah', 'Adjei', 'Agyeman', 'Amoah', 'Darko', 'Ofori', 'Acheampong', 'Ankrah', 'Baah', 'Quartey', 'Tetteh', 'Sarpong', 'Frimpong', 'Gyasi', 'Danso']

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
}

const rnd = seeded(42)
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)]

const STATUSES = ['Active', 'Active', 'Active', 'Active', 'Pending Approval', 'In Production', 'Printed', 'Blocked', 'Expired', 'Closed'] as const
const NETWORKS = ['Visa', 'Visa', 'Mastercard', 'Mastercard', 'GH-Link', 'CPA-Azur'] as const
const TYPES = ['Debit', 'Debit', 'Debit', 'Credit', 'Prepaid'] as const
const TIERS = ['Classic', 'Classic', 'Gold', 'Platinum', 'Infinite'] as const

export const CARDS: CardRecord[] = Array.from({ length: 64 }, (_, i) => {
  const name = `${pick(FIRST)} ${pick(LAST)}`
  const issuedYear = 2023 + Math.floor(rnd() * 3)
  const issuedMonth = 1 + Math.floor(rnd() * 12)
  const issuedDay = 1 + Math.floor(rnd() * 28)
  return {
    id: `CRD-${String(10240 + i)}`,
    maskedPan: `${pick(['4','5'])}${Math.floor(rnd() * 900 + 100)} **** **** ${Math.floor(rnd() * 9000 + 1000)}`,
    holderName: name,
    customerId: `CIF-${String(700000 + Math.floor(rnd() * 99999))}`,
    network: pick(NETWORKS),
    type: pick(TYPES),
    tier: pick(TIERS),
    status: pick(STATUSES),
    branch: pick(BRANCHES),
    issuedAt: `${issuedYear}-${String(issuedMonth).padStart(2, '0')}-${String(issuedDay).padStart(2, '0')}`,
    expiresAt: `${issuedYear + 4}-${String(issuedMonth).padStart(2, '0')}`,
    virtual: rnd() < 0.2,
  }
})

export const BATCH_JOBS: BatchJob[] = [
  { id: 'BTH-2025-0198', fileName: 'ecobank_renewals_aug20.pgp', bank: 'Ecobank', records: 4820, processed: 4820, errors: 0, status: 'Completed', submittedBy: 'j.appiah', submittedAt: '2025-08-20 06:15', encryption: 'PGP' },
  { id: 'BTH-2025-0199', fileName: 'gtbank_new_issue_aug20.pgp', bank: 'GTBank', records: 12500, processed: 9340, errors: 12, status: 'Processing', submittedBy: 'a.mensah', submittedAt: '2025-08-20 08:02', encryption: 'PGP' },
  { id: 'BTH-2025-0200', fileName: 'absa_pin_regen_aug20.aes', bank: 'Absa', records: 860, processed: 860, errors: 3, status: 'Completed', submittedBy: 'system.sched', submittedAt: '2025-08-20 09:30', encryption: 'AES-256' },
  { id: 'BTH-2025-0201', fileName: 'stanchart_corporate_aug20.pgp', bank: 'Standard Chartered', records: 2140, processed: 0, errors: 0, status: 'Validating', submittedBy: 'k.osei', submittedAt: '2025-08-20 10:45', encryption: 'PGP' },
  { id: 'BTH-2025-0202', fileName: 'ecobank_replacements_aug19.pgp', bank: 'Ecobank', records: 310, processed: 118, errors: 118, status: 'Failed', submittedBy: 'j.appiah', submittedAt: '2025-08-19 22:10', encryption: 'PGP' },
  { id: 'BTH-2025-0203', fileName: 'gtbank_prepaid_load_aug20.aes', bank: 'GTBank', records: 5600, processed: 0, errors: 0, status: 'Queued', submittedBy: 'a.mensah', submittedAt: '2025-08-20 11:20', encryption: 'AES-256' },
]

export const PRINT_JOBS: PrintJob[] = [
  { id: 'PRT-88231', cardId: 'CRD-10262', holderName: 'Ama Boateng', printer: 'Datacard CD800', template: 'Visa Gold Horizon', status: 'Printing', branch: 'Accra Main', queuedAt: '2025-08-20 10:58', priority: 'Normal' },
  { id: 'PRT-88232', cardId: 'CRD-10251', holderName: 'Kwame Osei', printer: 'Entrust Sigma DS4', template: 'MC Platinum Onyx', status: 'Queued', branch: 'Accra Main', queuedAt: '2025-08-20 11:02', priority: 'High' },
  { id: 'PRT-88233', cardId: 'CRD-10244', holderName: 'Efua Adjei', printer: 'Evolis Avansia', template: 'GH-Link Classic', status: 'Quality Check', branch: 'Kumasi Adum', queuedAt: '2025-08-20 10:41', priority: 'Normal' },
  { id: 'PRT-88234', cardId: 'CRD-10239', holderName: 'Yaw Amoah', printer: 'Datacard CD800', template: 'Visa Classic Horizon', status: 'Completed', branch: 'Tema Community 1', queuedAt: '2025-08-20 09:55', priority: 'Normal' },
  { id: 'PRT-88235', cardId: 'CRD-10228', holderName: 'Akosua Darko', printer: 'Entrust Sigma DS4', template: 'MC Classic Onyx', status: 'Reprint', branch: 'Takoradi Harbour', queuedAt: '2025-08-20 09:12', priority: 'Emergency' },
  { id: 'PRT-88236', cardId: 'CRD-10218', holderName: 'Kojo Ofori', printer: 'Evolis Avansia', template: 'Prepaid Corporate', status: 'Queued', branch: 'Accra Main', queuedAt: '2025-08-20 11:15', priority: 'Normal' },
]

export const USERS: UserAccount[] = [
  { id: 'USR-001', name: 'Josephine Appiah', email: 'j.appiah@bluechip.africa', group: 'Card Operations Specialists', roles: ['CARD_OPERATIONS', 'BATCH_PROCESSOR'], branch: 'Accra Main', status: 'Active', mfaEnabled: true, lastLogin: '2025-08-20 10:44' },
  { id: 'USR-002', name: 'Kofi Osei-Bonsu', email: 'k.osei@bluechip.africa', group: 'Branch Operations', roles: ['BRANCH_ADMIN', 'OPERATIONS_MANAGER'], branch: 'Kumasi Adum', status: 'Active', mfaEnabled: true, lastLogin: '2025-08-20 09:31' },
  { id: 'USR-003', name: 'Abena Mensah', email: 'a.mensah@bluechip.africa', group: 'Card Operations Specialists', roles: ['BATCH_PROCESSOR'], branch: 'Accra Main', status: 'Active', mfaEnabled: true, lastLogin: '2025-08-20 08:00' },
  { id: 'USR-004', name: 'Daniel Quartey', email: 'd.quartey@bluechip.africa', group: 'Printing & Production', roles: ['PRINTING_OPERATOR'], branch: 'Accra Main', status: 'Active', mfaEnabled: true, lastLogin: '2025-08-20 07:12' },
  { id: 'USR-005', name: 'Naa Adjeley Tetteh', email: 'n.tetteh@bluechip.africa', group: 'Compliance & Audit', roles: ['COMPLIANCE_OFFICER', 'INTERNAL_AUDITOR'], branch: 'Accra Main', status: 'Active', mfaEnabled: true, lastLogin: '2025-08-19 17:48' },
  { id: 'USR-006', name: 'Samuel Gyasi', email: 's.gyasi@bluechip.africa', group: 'IT & System Administrators', roles: ['SYSTEM_ADMIN', 'USER_ADMIN'], branch: 'Accra Main', status: 'Active', mfaEnabled: true, lastLogin: '2025-08-20 06:03' },
  { id: 'USR-007', name: 'Linda Frimpong', email: 'l.frimpong@bluechip.africa', group: 'Customer Service Representatives', roles: ['CUSTOMER_SERVICE'], branch: 'Tema Community 1', status: 'Locked', mfaEnabled: false, lastLogin: '2025-08-14 12:20' },
  { id: 'USR-008', name: 'Yaw Ankrah', email: 'y.ankrah@bluechip.africa', group: 'Business Intelligence', roles: ['BI_SPECIALIST'], branch: 'Accra Main', status: 'Active', mfaEnabled: true, lastLogin: '2025-08-20 10:02' },
  { id: 'USR-009', name: 'Efua Sarpong', email: 'e.sarpong@bluechip.africa', group: 'Security Operations', roles: ['FRAUD_ANALYST', 'RISK_MANAGER'], branch: 'Accra Main', status: 'Active', mfaEnabled: true, lastLogin: '2025-08-20 05:47' },
  { id: 'USR-010', name: 'Michael Baah', email: 'm.baah@bluechip.africa', group: 'Executive Management', roles: ['EXECUTIVE_ADMIN'], branch: 'Accra Main', status: 'Active', mfaEnabled: true, lastLogin: '2025-08-19 16:30' },
  { id: 'USR-011', name: 'Grace Acheampong', email: 'g.acheampong@bluechip.africa', group: 'Configuration Administrators', roles: ['CONFIG_ADMIN'], branch: 'Accra Main', status: 'Pending', mfaEnabled: false, lastLogin: '—' },
]

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: 'AUD-99120', timestamp: '2025-08-20 11:18:04', actor: 'j.appiah', action: 'CARD_ISSUED', module: 'Card Issuance', severity: 'Information', details: 'Instant issuance CRD-10303 (Visa Gold) at Accra Main' },
  { id: 'AUD-99119', timestamp: '2025-08-20 11:02:41', actor: 'd.quartey', action: 'PRINT_PRIORITY_CHANGED', module: 'Printing', severity: 'Warning', details: 'PRT-88232 escalated to High priority' },
  { id: 'AUD-99118', timestamp: '2025-08-20 10:58:12', actor: 'system', action: 'BATCH_ERROR_THRESHOLD', module: 'Batch Processing', severity: 'Critical', details: 'BTH-2025-0202 exceeded 10% error threshold — auto-halted' },
  { id: 'AUD-99117', timestamp: '2025-08-20 10:44:55', actor: 'e.sarpong', action: 'CARD_BLOCKED', module: 'Fraud', severity: 'Warning', details: 'CRD-10287 blocked — velocity rule V-114 triggered' },
  { id: 'AUD-99116', timestamp: '2025-08-20 10:31:20', actor: 's.gyasi', action: 'USER_ROLE_ASSIGNED', module: 'Administration', severity: 'Information', details: 'USR-011 granted CONFIG_ADMIN (pending approval)' },
  { id: 'AUD-99115', timestamp: '2025-08-20 10:12:09', actor: 'n.tetteh', action: 'AML_SCREENING_OVERRIDE', module: 'Compliance', severity: 'Critical', details: 'Manual clearance of hit WLC-5521 with dual control' },
  { id: 'AUD-99114', timestamp: '2025-08-20 09:58:47', actor: 'k.osei', action: 'LIMIT_INCREASED', module: 'Card Management', severity: 'Information', details: 'CRD-10251 daily limit raised to GHS 25,000' },
  { id: 'AUD-99113', timestamp: '2025-08-20 09:30:00', actor: 'system.sched', action: 'BATCH_COMPLETED', module: 'Batch Processing', severity: 'Information', details: 'BTH-2025-0200 completed — 860 records, 3 exceptions' },
]

export const DASHBOARD_KPIS: Kpi[] = [
  { label: 'Cards Issued Today', value: '1,284', delta: 12.4, deltaLabel: 'vs. yesterday', state: 'positive' },
  { label: 'Avg. Issuance Time', value: '3m 42s', delta: -8.1, deltaLabel: 'vs. 7-day avg', state: 'positive' },
  { label: 'Active Batch Jobs', value: '3', delta: 0, deltaLabel: '1 failed today', state: 'critical' },
  { label: 'Print Queue Depth', value: '46', delta: 5.2, deltaLabel: 'vs. yesterday', state: 'neutral' },
  { label: 'Fraud Alerts (24h)', value: '7', delta: -22, deltaLabel: 'vs. yesterday', state: 'positive' },
  { label: 'SLA Compliance', value: '99.6%', delta: 0.2, deltaLabel: 'MTD', state: 'positive' },
]

export const ISSUANCE_TREND = [
  { month: 'Sep', instant: 8200, batch: 21000, virtual: 2400 },
  { month: 'Oct', instant: 9400, batch: 22400, virtual: 3100 },
  { month: 'Nov', instant: 10100, batch: 20800, virtual: 3900 },
  { month: 'Dec', instant: 12800, batch: 24500, virtual: 5200 },
  { month: 'Jan', instant: 11600, batch: 23100, virtual: 5900 },
  { month: 'Feb', instant: 12400, batch: 21900, virtual: 6800 },
  { month: 'Mar', instant: 13900, batch: 23800, virtual: 7600 },
  { month: 'Apr', instant: 14800, batch: 22600, virtual: 8900 },
  { month: 'May', instant: 16200, batch: 24100, virtual: 10200 },
  { month: 'Jun', instant: 17100, batch: 23400, virtual: 11800 },
  { month: 'Jul', instant: 18900, batch: 24900, virtual: 13400 },
  { month: 'Aug', instant: 20400, batch: 25600, virtual: 15100 },
]

export const NETWORK_SPLIT = [
  { name: 'Visa', value: 41 },
  { name: 'Mastercard', value: 33 },
  { name: 'GH-Link', value: 18 },
  { name: 'CPA-Azur', value: 8 },
]

export const BRANCH_PERFORMANCE = [
  { branch: 'Accra Main', issued: 412, sla: 99.8 },
  { branch: 'Kumasi Adum', issued: 286, sla: 99.1 },
  { branch: 'Tema Comm. 1', issued: 231, sla: 99.5 },
  { branch: 'Takoradi', issued: 174, sla: 98.7 },
  { branch: 'Tamale', issued: 118, sla: 99.9 },
  { branch: 'Cape Coast', issued: 63, sla: 100 },
]

export const CHANNEL_MIX = [
  { channel: 'Branch', week: 5200, prev: 4800 },
  { channel: 'Kiosk', week: 2100, prev: 1700 },
  { channel: 'Mobile', week: 3400, prev: 2600 },
  { channel: 'Agent', week: 1200, prev: 1350 },
  { channel: 'API', week: 900, prev: 620 },
]
