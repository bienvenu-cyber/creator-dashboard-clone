import { useState } from 'react';

// ── Monthly data from the Statements HTML reference ──
const monthlyData = [
  { month: 'mars, 2026', amount: '$4,262.80' },
  { month: 'février, 2026', amount: '$3,675.39' },
  { month: 'janvier, 2026', amount: '$4,034.04' },
  { month: 'décembre, 2025', amount: '$4,164.34' },
  { month: 'novembre, 2025', amount: '$4,200.48' },
  { month: 'octobre, 2025', amount: '$4,484.58' },
  { month: 'septembre, 2025', amount: '$3,176.90' },
  { month: 'août, 2025', amount: '$4,297.59' },
  { month: 'juillet, 2025', amount: '$4,130.29' },
  { month: 'juin, 2025', amount: '$3,292.64' },
  { month: 'mai, 2025', amount: '$3,666.73' },
  { month: 'avril, 2025', amount: '$3,256.44' },
  { month: 'mars, 2025', amount: '$4,261.27' },
  { month: 'février, 2025', amount: '$4,647.53' },
  { month: 'janvier, 2025', amount: '$4,343.23' },
  { month: 'décembre, 2024', amount: '$4,457.82' },
  { month: 'novembre, 2024', amount: '$4,589.60' },
  { month: 'octobre, 2024', amount: '$3,861.13' },
  { month: 'septembre, 2024', amount: '$3,280.34' },
  { month: 'août, 2024', amount: '$3,610.91' },
  { month: 'juillet, 2024', amount: '$4,551.28' },
  { month: 'juin, 2024', amount: '$3,270.04' },
  { month: 'mai, 2024', amount: '$4,603.30' },
  { month: 'avril, 2024', amount: '$2,675.89' },
];

// ── Earnings transactions (reference data) ──
const declData = [
  { date: 'May 23, 2025, 6:25am', amt: '$152.10', fee: '$30.42', net: '$121.68', desc: 'Tip from Roha K', statut: 'Paid' },
  { date: 'May 22, 2025, 8:55am', amt: '$190.74', fee: '$38.15', net: '$152.59', desc: 'Message from Rutor K', statut: 'Paid' },
  { date: 'May 21, 2025, 2:44am', amt: '$260.04', fee: '$52.01', net: '$208.03', desc: 'Message from Juandir W', statut: 'Paid' },
  { date: 'May 20, 2025, 11:04pm', amt: '$263.08', fee: '$52.62', net: '$210.46', desc: 'Message from Samantha V', statut: 'Paid' },
  { date: 'May 19, 2025, 4:12pm', amt: '$180.00', fee: '$36.00', net: '$144.00', desc: 'Subscription BigTipper99', statut: 'Paid' },
  { date: 'May 18, 2025, 9:30am', amt: '$100.00', fee: '$20.00', net: '$80.00', desc: 'Tip from JakeXO', statut: 'Paid' },
];

// ── SVG icons matching the OF reference ──
const IconFunds = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-8.8c-1.17-.24-2.06-.33-2.06-.87s.47-.57 1.17-.57a1.36 1.36 0 0 1 1 .48.53.53 0 0 0 .39.18H15a.24.24 0 0 0 .23-.25c0-.78-1-1.72-2.23-2V7.3a.29.29 0 0 0-.3-.3h-1.4a.29.29 0 0 0-.29.3v.82a2.57 2.57 0 0 0-2.2 2.26c0 3.13 4.52 2.07 4.52 3.22 0 .53-.52.59-1.41.59a1.47 1.47 0 0 1-1.16-.57.61.61 0 0 0-.44-.19h-1.4a.24.24 0 0 0-.22.24c0 1.11 1.12 1.9 2.31 2.21v.82a.29.29 0 0 0 .29.3h1.39a.29.29 0 0 0 .29-.3v-.78c1.28-.23 2.32-1 2.32-2.33s-.92-2.09-2.3-2.39z" />
  </svg>
);

const IconBank = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 18H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2zM3 9h18a1 1 0 0 0 .49-1.87l-9-5a1 1 0 0 0-1 0l-9 5A1 1 0 0 0 3 9zm9-4.86L17.14 7H6.86zM11 11v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-2 0zm-6 0v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-2 0zm14 5v-5a1 1 0 0 0-2 0v5a1 1 0 0 0 2 0z" />
  </svg>
);

const IconStatements = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22,7.48A.49.49,0,0,0,21.52,7H17a.48.48,0,0,0-.48.49.47.47,0,0,0,.14.34L18.2,9.38,14,13.59l-2.29-2.3a1,1,0,0,0-1.42,0L5,16.59V6A1,1,0,0,1,6,5H18c.72,0,.7.59,1.41.59a1,1,0,0,0,1-1C20.41,3.7,19.1,3,18,3H6A3,3,0,0,0,3,6V18a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V14.5a1,1,0,0,0-2,0V18a1,1,0,0,1-1,1H6a.24.24,0,0,1-.17-.41L11,13.41l2.29,2.3a1,1,0,0,0,1.42,0l4.91-4.91,1.55,1.56a.47.47,0,0,0,.34.14A.48.48,0,0,0,22,12Z" />
  </svg>
);

const IconUndo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.34 6a6.61 6.61 0 0 0-4.7 2L5 12.59V8a1 1 0 0 0-2 0v8h8a1 1 0 0 0 0-2H6.41l4.64-4.64a4.66 4.66 0 0 1 8 3.3A4.62 4.62 0 0 1 17.64 16l-1.35 1.34A1 1 0 0 0 16 18a1 1 0 0 0 1 1 1 1 0 0 0 .71-.29l1.34-1.35a6.57 6.57 0 0 0 1.95-4.7A6.65 6.65 0 0 0 14.34 6z" />
  </svg>
);

const IconReferrals = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.9,9.5A2.9,2.9,0,1,0,12,12.4,2.9,2.9,0,0,0,14.9,9.5Zm-4,0A1.1,1.1,0,1,1,12,10.6,1.1,1.1,0,0,1,10.9,9.5ZM8,16.5a.9.9,0,0,0,1.72.38,2.57,2.57,0,0,1,4.66,0,.9.9,0,0,0,1.72-.38A4.15,4.15,0,0,0,12,13.6,4.15,4.15,0,0,0,8,16.5ZM17,10a.5.5,0,0,0-.5.5.45.45,0,0,0,.15.35l3,3a.48.48,0,0,0,.7,0l3-3a.45.45,0,0,0,.15-.35A.5.5,0,0,0,23,10H21V6a3,3,0,0,0-3-3H6A3,3,0,0,0,3,6V18a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V16.5a1,1,0,0,0-2,0V18a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V6A1,1,0,0,1,6,5H18a1,1,0,0,1,1,1v4Z" />
  </svg>
);

const IconArrowDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8a96a3' }}>
    <path d="M12 16.75L5.13 9.87a1 1 0 0 1-.3-.7 1 1 0 0 1 1-1 1 1 0 0 1 .71.29L12 13.92l5.46-5.46a1 1 0 0 1 .71-.29 1 1 0 0 1 1 1 1 1 0 0 1-.3.7z" />
  </svg>
);

const IconDone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#8a96a3">
    <path d="M9 19.42l-5.71-5.71A1 1 0 0 1 3 13a1 1 0 0 1 1-1 1 1 0 0 1 .71.29L9 16.59l10.29-10.3A1 1 0 0 1 20 6a1 1 0 0 1 1 1 1 1 0 0 1-.29.71z" />
  </svg>
);

const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#8a96a3">
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-5h-.18a.18.18 0 0 1-.18-.18l.67-2.71a.76.76 0 0 0 0-.21.87.87 0 0 0-.87-.86h-1.09a1 1 0 0 0-1 1 1 1 0 0 0 .57.9.21.21 0 0 1 .12.19.09.09 0 0 1 0 .05l-.59 2.38a1.36 1.36 0 0 0 0 .29A1.2 1.2 0 0 0 11.6 17h1.06a1.19 1.19 0 0 0 1.19-1.19A.81.81 0 0 0 13 15zm-.5-8a1.35 1.35 0 1 0 1.35 1.35A1.34 1.34 0 0 0 12.5 7z" />
  </svg>
);

const sections = [
  { key: 'earnings', label: 'EARNINGS', icon: <IconFunds /> },
  { key: 'payout-requests', label: 'PAYOUT REQUESTS', icon: <IconBank /> },
  { key: 'statistics', label: 'EARNING STATISTICS', icon: <IconStatements /> },
  { key: 'chargebacks', label: 'CHARGEBACKS', icon: <IconUndo /> },
  { key: 'referrals', label: 'REFERRALS', icon: <IconReferrals /> },
];

export function DeclarationsPage() {
  const [activeSection, setActiveSection] = useState('statistics');

  return (
    <div className="decl-layout">
      <div className="decl-left">
        <div className="decl-header">
          <div className="decl-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            STATEMENTS
          </div>
          <div className="decl-help">?</div>
        </div>

        <div className="decl-alert">
          <span className="decl-alert-icon">⚠</span>
          <span>Please fill in your <a href="#">banking information</a></span>
        </div>

        <div className="decl-balance-box">
          <div className="decl-balance-row">
            <span className="decl-balance-label">CURRENT BALANCE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="decl-balance-val" contentEditable suppressContentEditableWarning>$3,726.12</span>
              <span className="decl-balance-toggle">⌃</span>
            </div>
          </div>
          <div className="decl-pending-row">
            <span className="decl-pending-label">
              PENDING BALANCE
              <IconInfo />
            </span>
            <span className="decl-pending-val" contentEditable suppressContentEditableWarning>$536.69</span>
          </div>
        </div>

        <select className="decl-payout-select">
          <option>Manual payouts</option>
          <option>Automatic payouts</option>
        </select>
        <div className="decl-payout-hint">Minimum withdrawal amount is $20</div>
        <button className="decl-withdraw-btn">REQUEST WITHDRAWAL</button>

        {sections.map(s => (
          <div
            key={s.key}
            className={`decl-section-item ${activeSection === s.key ? 'active-section' : ''}`}
            onClick={() => setActiveSection(s.key)}
          >
            {s.icon}
            <span className="decl-section-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="decl-right">
        {activeSection === 'earnings' && <EarningsSection />}
        {activeSection === 'payout-requests' && <PayoutRequestsSection />}
        {activeSection === 'statistics' && <EarningsStatsSection />}
        {activeSection === 'chargebacks' && <ChargebacksSection />}
        {activeSection === 'referrals' && <ReferralsSection />}
      </div>
    </div>
  );
}

function EarningsSection() {
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">EARNINGS</span>
        <span className="decl-right-sub">Date/time shown in local time (UTC+01:00)</span>
      </div>
      <div className="decl-table-header">
        <div>DATE & TIME</div><div>AMOUNT</div><div>FEE</div><div>NET</div><div>DESCRIPTION</div><div>STATUS</div>
      </div>
      {declData.map((r, i) => (
        <div key={i} className="decl-table-row">
          <div contentEditable suppressContentEditableWarning>{r.date}</div>
          <div contentEditable suppressContentEditableWarning>{r.amt}</div>
          <div contentEditable suppressContentEditableWarning>{r.fee}</div>
          <div contentEditable suppressContentEditableWarning>{r.net}</div>
          <div contentEditable suppressContentEditableWarning>{r.desc}</div>
          <div><span className="decl-status-badge decl-status-ok">✓ {r.statut}</span></div>
        </div>
      ))}
    </>
  );
}

function PayoutRequestsSection() {
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">PAYOUT REQUESTS</span>
        <span className="decl-right-sub">Date/time shown in local time (UTC+01:00)</span>
      </div>
      <div className="decl-table-header">
        <div>DATE & TIME</div><div>AMOUNT</div><div>FEE</div><div>NET</div><div>STATUS</div><div></div>
      </div>
      <div className="decl-empty-state">This list is empty</div>
    </>
  );
}

function EarningsStatsSection() {
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">EARNING STATISTICS</span>
        <span className="decl-right-sub">Date/Time shown in UTC time zone</span>
      </div>

      {/* All time row */}
      <div className="decl-alltime-row">
        <div className="decl-alltime-label">All time</div>
        <div className="decl-alltime-amount" contentEditable suppressContentEditableWarning>$94,794.64</div>
        <IconArrowDown />
      </div>

      {/* Monthly rows */}
      <div className="decl-monthly-list">
        {monthlyData.map((m, i) => (
          <div key={i} className="decl-monthly-row">
            <div className="decl-monthly-month">{m.month}</div>
            <div className="decl-monthly-amount" contentEditable suppressContentEditableWarning>{m.amount}</div>
            <IconArrowDown />
          </div>
        ))}
      </div>
    </>
  );
}

function ChargebacksSection() {
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">CHARGEBACK DEDUCTIONS</span>
        <span className="decl-right-sub">Date/time shown in UTC timezone</span>
      </div>
      <div className="decl-empty-state">No chargebacks</div>
    </>
  );
}

function ReferralsSection() {
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">REFERRAL EARNINGS STATEMENT</span>
        <span className="decl-right-sub">Date/time shown in local time (UTC+01:00)</span>
      </div>
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '10px 14px', borderBottom: '1px solid #e0e0e0', fontSize: 11, fontWeight: 600, color: '#8a8a9a', textTransform: 'uppercase' }}>
          <div>DATE & TIME</div><div>INVOICE</div><div>AMOUNT</div><div>STATUS</div>
        </div>
        <div style={{ padding: 40, textAlign: 'center', color: '#8a8a9a', fontSize: 13 }}>This list is empty</div>
      </div>
    </>
  );
}
