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

// Tab definitions matching the HTML reference exactly
const tabs = [
  { key: 'earnings', label: 'Earnings', iconPath: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-8.8c-1.17-.24-2.06-.33-2.06-.87s.47-.57 1.17-.57a1.36 1.36 0 0 1 1 .48.53.53 0 0 0 .39.18H15a.24.24 0 0 0 .23-.25c0-.78-1-1.72-2.23-2V7.3a.29.29 0 0 0-.3-.3h-1.4a.29.29 0 0 0-.29.3v.82a2.57 2.57 0 0 0-2.2 2.26c0 3.13 4.52 2.07 4.52 3.22 0 .53-.52.59-1.41.59a1.47 1.47 0 0 1-1.16-.57.61.61 0 0 0-.44-.19h-1.4a.24.24 0 0 0-.22.24c0 1.11 1.12 1.9 2.31 2.21v.82a.29.29 0 0 0 .29.3h1.39a.29.29 0 0 0 .29-.3v-.78c1.28-.23 2.32-1 2.32-2.33s-.92-2.09-2.3-2.39z' },
  { key: 'payouts', label: 'Payout Requests', iconPath: 'M21 18H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2zM3 9h18a1 1 0 0 0 .49-1.87l-9-5a1 1 0 0 0-1 0l-9 5A1 1 0 0 0 3 9zm9-4.86L17.14 7H6.86zM11 11v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-2 0zm-6 0v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-2 0zm14 5v-5a1 1 0 0 0-2 0v5a1 1 0 0 0 2 0z' },
  { key: 'statistics', label: 'Earning Statistics', iconPath: 'M22,7.48A.49.49,0,0,0,21.52,7H17a.48.48,0,0,0-.48.49.47.47,0,0,0,.14.34L18.2,9.38,14,13.59l-2.29-2.3a1,1,0,0,0-1.42,0L5,16.59V6A1,1,0,0,1,6,5H18c.72,0,.7.59,1.41.59a1,1,0,0,0,1-1C20.41,3.7,19.1,3,18,3H6A3,3,0,0,0,3,6V18a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V14.5a1,1,0,0,0-2,0V18a1,1,0,0,1-1,1H6a.24.24,0,0,1-.17-.41L11,13.41l2.29,2.3a1,1,0,0,0,1.42,0l4.91-4.91,1.55,1.56a.47.47,0,0,0,.34.14A.48.48,0,0,0,22,12Z' },
  { key: 'chargebacks', label: 'Chargebacks', iconPath: 'M14.34 6a6.61 6.61 0 0 0-4.7 2L5 12.59V8a1 1 0 0 0-2 0v8h8a1 1 0 0 0 0-2H6.41l4.64-4.64a4.66 4.66 0 0 1 8 3.3A4.62 4.62 0 0 1 17.64 16l-1.35 1.34A1 1 0 0 0 16 18a1 1 0 0 0 1 1 1 1 0 0 0 .71-.29l1.34-1.35a6.57 6.57 0 0 0 1.95-4.7A6.65 6.65 0 0 0 14.34 6z' },
  { key: 'referrals', label: 'Referrals', iconPath: 'M14.9,9.5A2.9,2.9,0,1,0,12,12.4,2.9,2.9,0,0,0,14.9,9.5Zm-4,0A1.1,1.1,0,1,1,12,10.6,1.1,1.1,0,0,1,10.9,9.5ZM8,16.5a.9.9,0,0,0,1.72.38,2.57,2.57,0,0,1,4.66,0,.9.9,0,0,0,1.72-.38A4.15,4.15,0,0,0,12,13.6,4.15,4.15,0,0,0,8,16.5ZM17,10a.5.5,0,0,0-.5.5.45.45,0,0,0,.15.35l3,3a.48.48,0,0,0,.7,0l3-3a.45.45,0,0,0,.15-.35A.5.5,0,0,0,23,10H21V6a3,3,0,0,0-3-3H6A3,3,0,0,0,3,6V18a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V16.5a1,1,0,0,0-2,0V18a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V6A1,1,0,0,1,6,5H18a1,1,0,0,1,1,1v4Z' },
];

export function DeclarationsPage() {
  const [activeTab, setActiveTab] = useState('statistics');

  return (
    <div className="b-statements">
      {/* ── Header row: title + help ── */}
      <div className="b-statements__header">
        <div className="b-statements__header-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          STATEMENTS
        </div>
        <a className="b-statements__help-btn" href="#">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14a1.35 1.35 0 1 0 1.35 1.35A1.34 1.34 0 0 0 12 14zm0-12a9 9 0 0 0-1 17.94V22a1 1 0 0 0 1 1c1.09 0 9-4.63 9-12a9 9 0 0 0-9-9zm1 18.28V19a1 1 0 0 0-1-1 7 7 0 1 1 7-7c0 4.06-3 7.35-6 9.28zM12.05 6a3.5 3.5 0 0 0-3.61 3.1.29.29 0 0 0 .28.31h1.59c.26 0 .35-.17.44-.43a1.2 1.2 0 0 1 1.3-.79c.64 0 1.17.23 1.17.88 0 1.1-2.35 1.68-2.35 3.55a.37.37 0 0 0 .35.38h1.59c.17 0 .29-.13.35-.38.33-1.3 2.4-1.67 2.4-3.71 0-1.76-1.65-2.91-3.51-2.91z" />
          </svg>
        </a>
      </div>

      <div className="b-statements__row">
        {/* ══════════ LEFT SIDEBAR (aside) ══════════ */}
        <div className="b-statements__aside">
          {/* Top creator badge */}
          <div className="g-box m-with-icon m-panel">
            <div className="g-box__header">
              <svg className="g-box__icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.67 2a.35.35 0 0 1 .66 0l2.07 6.34a.37.37 0 0 0 .34.24h6.69a.35.35 0 0 1 .21.64l-5.41 3.94a.33.33 0 0 0-.13.39l2.06 6.37a.35.35 0 0 1-.12.39.36.36 0 0 1-.42 0l-5.41-3.93a.36.36 0 0 0-.42 0l-5.41 3.93a.36.36 0 0 1-.42 0 .35.35 0 0 1-.12-.39l2.06-6.37a.33.33 0 0 0-.13-.39L2.36 9.22a.35.35 0 0 1 .21-.64h6.69a.37.37 0 0 0 .34-.24z" />
              </svg>
              <p>YOU ARE IN THE TOP <span contentEditable suppressContentEditableWarning className="editable">100</span>% OF ALL CREATORS!</p>
            </div>
          </div>

          {/* Balance wrapper */}
          <div className="balance-wrapper">
            <div className="g-box b-profile-collapsed">
              <div className="balance-block">
                {/* Current balance header */}
                <div className="g-box__header m-title" role="button">
                  <div className="b-statements__current-balance__title">
                    Current balance
                    <div className="b-statements__current-balance__value">
                      <span className="current-balance" contentEditable suppressContentEditableWarning>$3,726.12</span>
                    </div>
                  </div>
                  <span className="g-box__collapse-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7.25l-6.87 6.88a1 1 0 0 0-.3.7 1 1 0 0 0 1 1 1 1 0 0 0 .71-.29L12 10.08l5.46 5.46a1 1 0 0 0 .71.29 1 1 0 0 0 1-1 1 1 0 0 0-.3-.7z" />
                    </svg>
                  </span>
                </div>
                {/* Box content: pending + payout */}
                <div className="g-box__content">
                  <div className="g-box__subheader m-flex">
                    <div className="g-text-with-info-tip">
                      Pending balance
                      <span className="g-icon-info">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8a96a3">
                          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-5h-.18a.18.18 0 0 1-.18-.18l.67-2.71a.76.76 0 0 0 0-.21.87.87 0 0 0-.87-.86h-1.09a1 1 0 0 0-1 1 1 1 0 0 0 .57.9.21.21 0 0 1 .12.19.09.09 0 0 1 0 .05l-.59 2.38a1.36 1.36 0 0 0 0 .29A1.2 1.2 0 0 0 11.6 17h1.06a1.19 1.19 0 0 0 1.19-1.19A.81.81 0 0 0 13 15zm-.5-8a1.35 1.35 0 1 0 1.35 1.35A1.34 1.34 0 0 0 12.5 7z" />
                        </svg>
                      </span>
                    </div>
                    <div className="b-statements__pending-balance__value">
                      <span className="pending-balance" contentEditable suppressContentEditableWarning>$536.69</span>
                    </div>
                  </div>

                  {/* Payout select */}
                  <div className="g-select__wrapper">
                    <select className="g-select">
                      <option>Manual payouts</option>
                      <option>Automatic payouts</option>
                    </select>
                  </div>

                  <div className="b-statements__min-payout-summ">
                    Minimum withdrawal amount is $20
                  </div>

                  <div className="g-btn__wrapper">
                    <button type="button" className="g-btn m-rounded" id="request_withdrawal_button">
                      Request withdrawal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab navigation (visible on all screens in this replica) */}
          <div className="b-tabs__nav m-nv m-row-item">
            <ul className="b-tabs__nav__list">
              {tabs.map(tab => (
                <li key={tab.key} className="b-tabs__nav__item">
                  <a
                    href="#"
                    className={`b-tabs__nav__link${activeTab === tab.key ? ' m-current' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab(tab.key); }}
                  >
                    <div className="b-tabs__nav__icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d={tab.iconPath} />
                      </svg>
                    </div>
                    <span className="b-tabs__nav__text">{tab.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ══════════ RIGHT CONTENT ══════════ */}
        <div className="b-statements__content">
          {activeTab === 'statistics' && <EarningStatisticsTab />}
          {activeTab === 'earnings' && <EarningsTab />}
          {activeTab === 'payouts' && <PayoutRequestsTab />}
          {activeTab === 'chargebacks' && <ChargebacksTab />}
          {activeTab === 'referrals' && <ReferralsTab />}
        </div>
      </div>
    </div>
  );
}

/* ── Earning Statistics tab (default view from HTML ref) ── */
function EarningStatisticsTab() {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <h2 className="b-statements__title g-section-title">EARNING STATISTICS</h2>
        </div>
        <div className="col-md-6">
          <p className="b-statements__head-timezone">Date/Time shown in UTC time zone</p>
        </div>
      </div>

      <div className="b-stats-wrap">
        {/* All time row */}
        <div className="b-stats-row m-expanded">
          <div className="b-stats-row__head" style={{ paddingBottom: 0 }}>
            <div className="b-stats-row__month">All time</div>
            <div className="b-stats-row__total-net g-semibold">
              <span contentEditable suppressContentEditableWarning>$94,794.64</span>
            </div>
            <svg className="b-stats-row__arrow" width="16" height="16" viewBox="0 0 24 24" fill="#8a96a3">
              <path d="M12 16.75L5.13 9.87a1 1 0 0 1-.3-.7 1 1 0 0 1 1-1 1 1 0 0 1 .71.29L12 13.92l5.46-5.46a1 1 0 0 1 .71-.29 1 1 0 0 1 1 1 1 1 0 0 1-.3.7z" />
            </svg>
          </div>
        </div>

        {/* Monthly rows */}
        {monthlyData.map((m, i) => (
          <div key={i} className="b-stats-row">
            <div className="b-stats-row__head">
              <div className="b-stats-row__month">{m.month}</div>
              <div className="b-stats-row__total-net g-semibold">
                <span contentEditable suppressContentEditableWarning>{m.amount}</span>
              </div>
              <svg className="b-stats-row__arrow" width="16" height="16" viewBox="0 0 24 24" fill="#8a96a3">
                <path d="M12 16.75L5.13 9.87a1 1 0 0 1-.3-.7 1 1 0 0 1 1-1 1 1 0 0 1 .71.29L12 13.92l5.46-5.46a1 1 0 0 1 .71-.29 1 1 0 0 1 1 1 1 1 0 0 1-.3.7z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Earnings tab ── */
function EarningsTab() {
  const declData = [
    { date: 'May 23, 2025, 6:25am', amt: '$152.10', fee: '$30.42', net: '$121.68', desc: 'Tip from Roha K', statut: 'Paid' },
    { date: 'May 22, 2025, 8:55am', amt: '$190.74', fee: '$38.15', net: '$152.59', desc: 'Message from Rutor K', statut: 'Paid' },
    { date: 'May 21, 2025, 2:44am', amt: '$260.04', fee: '$52.01', net: '$208.03', desc: 'Message from Juandir W', statut: 'Paid' },
    { date: 'May 20, 2025, 11:04pm', amt: '$263.08', fee: '$52.62', net: '$210.46', desc: 'Message from Samantha V', statut: 'Paid' },
    { date: 'May 19, 2025, 4:12pm', amt: '$180.00', fee: '$36.00', net: '$144.00', desc: 'Subscription BigTipper99', statut: 'Paid' },
    { date: 'May 18, 2025, 9:30am', amt: '$100.00', fee: '$20.00', net: '$80.00', desc: 'Tip from JakeXO', statut: 'Paid' },
  ];

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <h2 className="b-statements__title g-section-title">EARNINGS</h2>
        </div>
        <div className="col-md-6">
          <p className="b-statements__head-timezone">Date/time shown in local time (UTC+01:00)</p>
        </div>
      </div>
      <div className="b-earnings-table">
        <div className="b-earnings-table__header">
          <div>DATE & TIME</div><div>AMOUNT</div><div>FEE</div><div>NET</div><div>DESCRIPTION</div><div>STATUS</div>
        </div>
        {declData.map((r, i) => (
          <div key={i} className="b-earnings-table__row">
            <div contentEditable suppressContentEditableWarning>{r.date}</div>
            <div contentEditable suppressContentEditableWarning>{r.amt}</div>
            <div contentEditable suppressContentEditableWarning>{r.fee}</div>
            <div contentEditable suppressContentEditableWarning>{r.net}</div>
            <div contentEditable suppressContentEditableWarning>{r.desc}</div>
            <div><span className="b-status-badge m-paid">✓ {r.statut}</span></div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Payout Requests tab ── */
function PayoutRequestsTab() {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <h2 className="b-statements__title g-section-title">PAYOUT REQUESTS</h2>
        </div>
        <div className="col-md-6">
          <p className="b-statements__head-timezone">Date/time shown in local time (UTC+01:00)</p>
        </div>
      </div>
      <div className="b-earnings-table">
        <div className="b-earnings-table__header">
          <div>DATE & TIME</div><div>AMOUNT</div><div>FEE</div><div>NET</div><div>STATUS</div><div></div>
        </div>
        <div className="b-empty-state">This list is empty</div>
      </div>
    </>
  );
}

/* ── Chargebacks tab ── */
function ChargebacksTab() {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <h2 className="b-statements__title g-section-title">CHARGEBACK DEDUCTIONS</h2>
        </div>
        <div className="col-md-6">
          <p className="b-statements__head-timezone">Date/time shown in UTC timezone</p>
        </div>
      </div>
      <div className="b-empty-state">No chargebacks</div>
    </>
  );
}

/* ── Referrals tab ── */
function ReferralsTab() {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <h2 className="b-statements__title g-section-title">REFERRAL EARNINGS STATEMENT</h2>
        </div>
        <div className="col-md-6">
          <p className="b-statements__head-timezone">Date/time shown in local time (UTC+01:00)</p>
        </div>
      </div>
      <div className="b-earnings-table">
        <div className="b-earnings-table__header" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}>
          <div>DATE & TIME</div><div>INVOICE</div><div>AMOUNT</div><div>STATUS</div>
        </div>
        <div className="b-empty-state">This list is empty</div>
      </div>
    </>
  );
}
