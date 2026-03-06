import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ── Route mapping ──
const tabRoutes: Record<string, string> = {
  statements: '/my/statistics/statements/earnings',
  overview: '/my/statistics/overview/earnings',
  engagement: '/my/statistics/engagement/posts',
  reach: '/my/statistics/reach/profile-visitors',
  fans: '/my/statistics/fans/subscriptions',
};
const routeToTab: Record<string, string> = {
  '/my/statistics/statements/earnings': 'statements',
  '/my/statistics/overview/earnings': 'overview',
  '/my/statistics/engagement/posts': 'engagement',
  '/my/statistics/reach/profile-visitors': 'reach',
  '/my/statistics/fans/subscriptions': 'fans',
};

const tabs = [
  { key: 'statements', label: 'Statements' },
  { key: 'overview', label: 'Overview' },
  { key: 'engagement', label: 'Engagement' },
  { key: 'reach', label: 'Reach' },
  { key: 'fans', label: 'Fans' },
];

// ── Helpers ──
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Arrow icon for percentage badges ──
function ArrowUpIcon() {
  return (
    <svg fill="#74DE94" width={14} height={14} style={{ marginTop: 1 }} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <path d="M196,64V168a4,4,0,0,1-8,0V73.65625L66.82812,194.82812a3.99957,3.99957,0,0,1-5.65625-5.65625L182.34375,68H88a4,4,0,0,1,0-8H192A4.0002,4.0002,0,0,1,196,64Z"
        stroke="#74DE94" strokeWidth={16} strokeLinejoin="round" fill="#74DE94" />
    </svg>
  );
}

function PercentBadge({ value }: { value: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      background: 'rgba(53,208,99,0.08)', color: '#35d063',
      borderRadius: 8, padding: '0 6px', fontSize: 12, fontWeight: 500, marginLeft: 5,
    }}>
      <ArrowUpIcon />
      <span contentEditable suppressContentEditableWarning>{value}</span>
    </span>
  );
}

// ── Transactions data (30 rows from the reference) ──
const transactions = [
  { date: 'Mar 6, 2026,', time: '9:54 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Subscription from', name: 'Shivali C' },
  { date: 'Mar 6, 2026,', time: '4:10 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Parth P' },
  { date: 'Mar 5, 2026,', time: '6:17 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Tip from', name: 'Grygorchuk V' },
  { date: 'Mar 5, 2026,', time: '2:04 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Bruno S' },
  { date: 'Mar 4, 2026,', time: '1:53 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Subscription from', name: 'Neha K' },
  { date: 'Mar 4, 2026,', time: '11:07 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Tip from', name: 'Morne H' },
  { date: 'Mar 3, 2026,', time: '9:18 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Juandre W' },
  { date: 'Mar 3, 2026,', time: '7:42 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Hamender K' },
  { date: 'Mar 2, 2026,', time: '3:28 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Tip from', name: 'Rohit R' },
  { date: 'Feb 25, 2026,', time: '4:04 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Ahmad F' },
  { date: 'Feb 24, 2026,', time: '7:56 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Tip from', name: 'Parth P' },
  { date: 'Feb 23, 2026,', time: '12:46 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Subscription from', name: 'Morne H' },
  { date: 'Feb 22, 2026,', time: '11:01 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Goran F' },
  { date: 'Feb 21, 2026,', time: '11:18 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Subscription from', name: 'Maksym T' },
  { date: 'Feb 20, 2026,', time: '4:02 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Pablo C' },
  { date: 'Feb 19, 2026,', time: '7:15 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Bruno S' },
  { date: 'Feb 18, 2026,', time: '11:49 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Neha K' },
  { date: 'Feb 17, 2026,', time: '2:33 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Tip from', name: 'Rohit R' },
  { date: 'Feb 16, 2026,', time: '11:07 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Juandre W' },
  { date: 'Feb 15, 2026,', time: '11:05 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Hamender K' },
  { date: 'Feb 14, 2026,', time: '2:06 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Subscription from', name: 'Ahmad F' },
  { date: 'Feb 13, 2026,', time: '6:50 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Tip from', name: 'Grygorchuk V' },
  { date: 'Feb 12, 2026,', time: '8:31 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Shivali C' },
  { date: 'Feb 11, 2026,', time: '3:19 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Morne H' },
  { date: 'Feb 10, 2026,', time: '10:44 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Tip from', name: 'Pablo C' },
  { date: 'Feb 9, 2026,', time: '1:28 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Subscription from', name: 'Goran F' },
  { date: 'Feb 8, 2026,', time: '5:55 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Parth P' },
  { date: 'Feb 7, 2026,', time: '9:32 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Payment for message from', name: 'Maksym T' },
  { date: 'Feb 6, 2026,', time: '11:21 pm', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Tip from', name: 'Neha K' },
  { date: 'Feb 5, 2026,', time: '4:07 am', amount: '$0.00', fee: '$0.00', net: '$0.00', msg: 'Tip from', name: 'Maksym T' },
];

// ── Chart canvas (line chart with area fill) ──
function ChartCanvas({ data, color = '#4A4A4A', height = 140 }: { data: number[]; color?: string; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = canvas.width, H = canvas.height, PAD = 12;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data, 1);
    const ptX = (i: number) => PAD + (i / (data.length - 1)) * (W - 2 * PAD);
    const ptY = (v: number) => H - PAD - (v / max) * (H - 2 * PAD);
    // grid
    ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = 1;
    [H * 0.25, H * 0.5, H * 0.75].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); });
    // area
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, hexToRgba(color, 0.18));
    grad.addColorStop(1, hexToRgba(color, 0.01));
    ctx.beginPath(); ctx.moveTo(ptX(0), H);
    data.forEach((v, i) => ctx.lineTo(ptX(i), ptY(v)));
    ctx.lineTo(ptX(data.length - 1), H); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    // line
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    data.forEach((v, i) => { i === 0 ? ctx.moveTo(ptX(i), ptY(v)) : ctx.lineTo(ptX(i), ptY(v)); });
    ctx.stroke();
  }, [data, color, height]);
  useEffect(() => { draw(); }, [draw]);
  return (
    <canvas ref={canvasRef} width={620} height={height}
      style={{ width: '100%', height, display: 'block' }} />
  );
}

// ── Mini sparkline for sidebar ──
function MiniSparkline({ data, color = '#4A4A4A' }: { data: number[]; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data, 1);
    const ptX = (i: number) => (i / (data.length - 1)) * W;
    const ptY = (v: number) => H - (v / max) * H * 0.85;
    // line only (matching reference's Highcharts style)
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    data.forEach((v, i) => { i === 0 ? ctx.moveTo(ptX(i), ptY(v)) : ctx.lineTo(ptX(i), ptY(v)); });
    ctx.stroke();
    // dots
    data.forEach((v, i) => {
      ctx.beginPath(); ctx.arc(ptX(i), ptY(v), 2, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
    });
  }, [data, color]);
  return <canvas ref={canvasRef} width={132} height={50} style={{ width: 132, height: 50, display: 'block' }} />;
}

// Sparkline data matching reference pattern
const sparkTotal = [0,0,0,0,0,0,52,46,0,0,0,0,0,24,15,33,0,0,0,0,18,0,49,0,9,0,0,0,0,0];
const sparkSubs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const sparkTips = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
const sparkMsgs = [0,0,0,0,0,0,52,46,0,0,0,0,0,24,15,27,0,0,0,0,18,0,49,0,9,0,0,0,0,0];

const xlabels = ['Feb 4, 2026', 'Feb 11, 2026', 'Feb 18, 2026', 'Feb 25, 2026', 'Mar 4, 2026'];

// ── Main component ──
export function StatisticsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = routeToTab[location.pathname] || 'statements';

  return (
    <>
      {/* Header */}
      <div className="stats-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 11H7.41l5.3-5.29A1 1 0 0 0 13 5a1 1 0 0 0-1-1 1 1 0 0 0-.71.29L3.59 12l7.7 7.71A1 1 0 0 0 12 20a1 1 0 0 0 1-1 1 1 0 0 0-.29-.71L7.41 13H19a1 1 0 0 0 0-2z" />
          </svg>
          <span className="stats-header-title">Statistics</span>
        </div>
        <div className="stats-help">?</div>
      </div>

      {/* Main tabs */}
      <div className="stats-tabs">
        {tabs.map(t => (
          <div key={t.key}
            className={`stats-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => navigate(tabRoutes[t.key])}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="stats-body">
        <div className="stats-main">
          {activeTab === 'statements' && <StatementsTab />}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'engagement' && <EngagementTab />}
          {activeTab === 'reach' && <ReachTab />}
          {activeTab === 'fans' && <FansTab />}
        </div>
        <div className="stats-right-col">
          <Sidebar />
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════
//  STATEMENTS TAB (pixel-perfect from reference)
// ══════════════════════════════════════════════
function StatementsTab() {
  const [subTab, setSubTab] = useState('earnings');
  const [filter, setFilter] = useState('all');

  const subTabs = [
    { key: 'earnings', label: 'Earnings' },
    { key: 'payout-requests', label: 'Payout Requests' },
    { key: 'chargebacks', label: 'Chargebacks' },
    { key: 'referrals', label: 'Referrals' },
  ];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'subscriptions', label: 'Subscriptions' },
    { key: 'tips', label: 'Tips' },
    { key: 'posts', label: 'Posts' },
    { key: 'messages', label: 'Messages' },
    { key: 'streams', label: 'Streams' },
  ];

  return (
    <>
      {/* Sub-tabs (rounded pills) */}
      <div className="stats-pills" style={{ borderBottom: '1px solid #e8e8e8' }}>
        {subTabs.map(s => (
          <div key={s.key}
            className={`stats-pill ${subTab === s.key ? 'active' : ''}`}
            onClick={() => setSubTab(s.key)}
          >
            {s.label}
          </div>
        ))}
      </div>

      {subTab === 'earnings' && (
        <>
          {/* Period dropdown */}
          <div className="stats-period-box" style={{ borderTop: 0 }}>
            <div>
              <div className="stats-period-title" contentEditable suppressContentEditableWarning>Last 30 days</div>
              <div className="stats-period-sub" contentEditable suppressContentEditableWarning>
                Feb 4, 2026 - Mar 6, 2026 (local time UTC +01:00)
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8a96a3' }}>
                <path d="M12 16.75L5.13 9.87a1 1 0 0 1-.3-.7 1 1 0 0 1 1-1 1 1 0 0 1 .71.29L12 13.92l5.46-5.46a1 1 0 0 1 .71-.29 1 1 0 0 1 1 1 1 1 0 0 1-.3.7z" />
              </svg>
            </div>
          </div>

          {/* Filter pills */}
          <div className="stats-pills">
            {filters.map(f => (
              <div key={f.key}
                className={`stats-pill ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </div>
            ))}
          </div>

          {/* Summary value */}
          <div style={{ padding: '10px 20px', marginBottom: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center' }}>
              <span contentEditable suppressContentEditableWarning>$0.25</span>
              <span style={{ color: '#8a96a3', fontWeight: 400, fontSize: 14, marginLeft: 8 }}>
                (<span contentEditable suppressContentEditableWarning>$0.31</span> Gross)
              </span>
              <PercentBadge value="0%" />
            </div>
          </div>

          {/* Chart */}
          <div style={{ padding: '0 20px 0' }}>
            <ChartCanvas data={sparkTotal} color="#4A4A4A" height={120} />
            <div className="stats-chart-xlabels">
              {xlabels.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </div>

          {/* Transactions table */}
          <div className="stats-tx-table">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                  <th style={thStyle}>Date & time</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Fee</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Net</th>
                  <th style={thStyle}>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={tdDateStyle}>
                      <strong>
                        <span contentEditable suppressContentEditableWarning>{tx.date}</span>
                        <span contentEditable suppressContentEditableWarning>{tx.time}</span>
                      </strong>
                    </td>
                    <td style={tdAmountStyle}>
                      <span contentEditable suppressContentEditableWarning>{tx.amount}</span>
                    </td>
                    <td style={tdFeeStyle}>{tx.fee}</td>
                    <td style={tdNetStyle}>
                      <strong><span contentEditable suppressContentEditableWarning>{tx.net}</span></strong>
                    </td>
                    <td style={tdDescStyle}>
                      <span>
                        <span contentEditable suppressContentEditableWarning>{tx.msg}</span>{' '}
                        <a href="javascript:void(0)" style={{ color: '#00aff0', textDecoration: 'none' }}
                          contentEditable suppressContentEditableWarning>{tx.name}</a>
                      </span>
                      <span style={{ marginLeft: 8, display: 'inline-flex' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#8a96a3">
                          <path d="M9 19.42l-5.71-5.71A1 1 0 0 1 3 13a1 1 0 0 1 1-1 1 1 0 0 1 .71.29L9 16.59l10.29-10.3A1 1 0 0 1 20 6a1 1 0 0 1 1 1 1 1 0 0 1-.29.71z" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {subTab === 'payout-requests' && (
        <div style={{ padding: 40, textAlign: 'center', color: '#8a96a3', fontSize: 14 }}>
          This list is empty
        </div>
      )}
      {subTab === 'chargebacks' && (
        <div style={{ padding: 40, textAlign: 'center', color: '#8a96a3', fontSize: 14 }}>
          This list is empty
        </div>
      )}
      {subTab === 'referrals' && (
        <div style={{ padding: 40, textAlign: 'center', color: '#8a96a3', fontSize: 14 }}>
          This list is empty
        </div>
      )}
    </>
  );
}

// Table cell styles matching the reference
const thStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 11, fontWeight: 600, color: '#8a96a3',
  textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.3px',
};
const tdDateStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, color: '#111', whiteSpace: 'nowrap',
};
const tdAmountStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, color: '#111', textAlign: 'right',
};
const tdFeeStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, color: '#8a96a3', textAlign: 'right',
};
const tdNetStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, color: '#111', textAlign: 'right', fontWeight: 600,
};
const tdDescStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, color: '#111', display: 'flex', alignItems: 'center',
};

// ══════════════════════════════════════════════
//  OVERVIEW TAB
// ══════════════════════════════════════════════
function OverviewTab() {
  const defaultData = [0,0,0,0,0,0,52,46,0,0,0,0,0,24,15,33,0,0,0,0,18,0,49,0,9,0,0,0,0,0];
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Earnings</div>
        <div className="stats-pill">Top highlights</div>
        <div className="stats-pill">Activity streak</div>
      </div>
      <div className="stats-period-box">
        <div>
          <div className="stats-period-title">Last 30 days</div>
          <div className="stats-period-sub" contentEditable suppressContentEditableWarning>Feb 4, 2026 – Mar 6, 2026 (local time UTC +01:00)</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8a96a3' }}>
          <path d="M12 16.75L5.13 9.87a1 1 0 0 1-.3-.7 1 1 0 0 1 1-1 1 1 0 0 1 .71.29L12 13.92l5.46-5.46a1 1 0 0 1 .71-.29 1 1 0 0 1 1 1 1 1 0 0 1-.3.7z" />
        </svg>
      </div>
      <div className="stats-chart-section">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="stats-chart-amount" contentEditable suppressContentEditableWarning>$0.25 <small>NET</small></div>
          <span style={{ fontSize: 11, color: '#8a96a3' }}>Feb 4, 2026 - Mar 6, 2026</span>
        </div>
        <ChartCanvas data={defaultData} color="#00aff0" />
        <div className="stats-chart-xlabels">{xlabels.map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <RadioTable />
    </>
  );
}

function RadioTable() {
  return (
    <div className="stats-radio-table">
      <div className="stats-radio-header">
        <span>Earnings</span>
        <span style={{ minWidth: 60, textAlign: 'right' }}>Gross</span>
        <span style={{ minWidth: 60, textAlign: 'right', marginLeft: 20 }}>Net</span>
      </div>
      {[
        { label: 'Total', brut: '$0.31', net: '$0.25', checked: true },
        { label: 'Subscriptions', brut: '$0.06', net: '$0.05' },
        { label: 'Tips', brut: '$0.00', net: '$0.00' },
        { label: 'Posts', brut: '$0.00', net: '$0.00' },
        { label: 'Messages', brut: '$0.25', net: '$0.20' },
        { label: 'Referrals', brut: '$0.00', net: '$0.00' },
        { label: 'Streams', brut: '$0.00', net: '$0.00' },
      ].map((r, i) => (
        <div key={i} className="stats-radio-row">
          <input type="radio" name="rev-radio" defaultChecked={r.checked} />
          <span className="stats-radio-label" contentEditable suppressContentEditableWarning>{r.label}</span>
          <span className="stats-radio-brut" contentEditable suppressContentEditableWarning>{r.brut}</span>
          <span className="stats-radio-net" contentEditable suppressContentEditableWarning>{r.net}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════
//  ENGAGEMENT TAB
// ══════════════════════════════════════════════
function EngagementTab() {
  const defaultData = [0,0,5,12,8,18,22,15,30,28,35,20,45,38,50,42,55,48,60,52,58,65,70,62,75,68,80,72,85,78];
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Posts</div>
        <div className="stats-pill">Messages</div>
        <div className="stats-pill">Streaming</div>
        <div className="stats-pill">Stories</div>
      </div>
      <div className="stats-period-box">
        <div>
          <div className="stats-period-title">Last 30 days</div>
          <div className="stats-period-sub" contentEditable suppressContentEditableWarning>Feb 4, 2026 – Mar 6, 2026 (local time UTC +01:00)</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8a96a3' }}>
          <path d="M12 16.75L5.13 9.87a1 1 0 0 1-.3-.7 1 1 0 0 1 1-1 1 1 0 0 1 .71.29L12 13.92l5.46-5.46a1 1 0 0 1 .71-.29 1 1 0 0 1 1 1 1 1 0 0 1-.3.7z" />
        </svg>
      </div>
      <div className="stats-pills" style={{ borderTop: '1px solid #e0e0e0' }}>
        <div className="stats-pill active">Purchases</div>
        <div className="stats-pill">Tips</div>
        <div className="stats-pill">Views</div>
        <div className="stats-pill">Likes</div>
        <div className="stats-pill">Comments</div>
      </div>
      <div className="stats-chart-section">
        <ChartCanvas data={defaultData} />
        <div className="stats-chart-xlabels">{xlabels.map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <div className="stats-eng-table">
        <div className="stats-eng-header"><span>Content</span><span>Views</span><span>Likes</span><span>Earnings</span></div>
        {[
          { label: 'Photo post – Feb 18', views: '142', likes: '38', rev: '$0.00' },
          { label: 'Video post – Feb 21', views: '289', likes: '74', rev: '$0.00' },
          { label: 'PPV Message – Feb 22', views: '95', likes: '21', rev: '$0.00' },
          { label: 'Photo post – Feb 23', views: '201', likes: '56', rev: '$0.00' },
          { label: 'Story – Feb 25', views: '318', likes: '102', rev: '$0.00' },
        ].map((r, i) => (
          <div key={i} className="stats-eng-row">
            <span className="stats-eng-label" contentEditable suppressContentEditableWarning>{r.label}</span>
            <span className="stats-eng-val" contentEditable suppressContentEditableWarning>{r.views}</span>
            <span className="stats-eng-val" contentEditable suppressContentEditableWarning>{r.likes}</span>
            <span className="stats-eng-val bold" contentEditable suppressContentEditableWarning>{r.rev}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════
//  REACH TAB
// ══════════════════════════════════════════════
function ReachTab() {
  const defaultData = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,2];
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Profile visitors</div>
        <div className="stats-pill">Promotions</div>
        <div className="stats-pill">Trial links</div>
        <div className="stats-pill">Tracking links</div>
      </div>
      <div className="stats-period-box">
        <div>
          <div className="stats-period-title">Last 30 days</div>
          <div className="stats-period-sub" contentEditable suppressContentEditableWarning>Feb 4, 2026 – Mar 6, 2026 (local time UTC +01:00)</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8a96a3' }}>
          <path d="M12 16.75L5.13 9.87a1 1 0 0 1-.3-.7 1 1 0 0 1 1-1 1 1 0 0 1 .71.29L12 13.92l5.46-5.46a1 1 0 0 1 .71-.29 1 1 0 0 1 1 1 1 1 0 0 1-.3.7z" />
        </svg>
      </div>
      <div className="stats-pills" style={{ borderTop: '1px solid #e0e0e0' }}>
        <div className="stats-pill active">All</div>
        <div className="stats-pill">Guests</div>
        <div className="stats-pill">Users</div>
      </div>
      <div className="stats-chart-section">
        <div className="stats-portee-visitors"><strong contentEditable suppressContentEditableWarning>3</strong> Visitors</div>
        <ChartCanvas data={defaultData} />
        <div className="stats-chart-xlabels">{xlabels.map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <div className="stats-eng-table">
        <div className="stats-eng-header"><span>Stat</span><span>Guests</span><span>Users</span><span>Total</span></div>
        <div className="stats-eng-row"><span className="stats-eng-label">Profile visitors</span><span className="stats-eng-val" contentEditable suppressContentEditableWarning>3</span><span className="stats-eng-val" contentEditable suppressContentEditableWarning>0</span><span className="stats-eng-val bold" contentEditable suppressContentEditableWarning>3</span></div>
        <div className="stats-eng-row"><span className="stats-eng-label">View duration</span><span className="stats-eng-val" contentEditable suppressContentEditableWarning>0h:00min</span><span className="stats-eng-val" contentEditable suppressContentEditableWarning>0h:00min</span><span className="stats-eng-val bold" contentEditable suppressContentEditableWarning>0h:00min</span></div>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Top countries</div>
        <div className="stats-eng-header"><span>Country</span><span>Guests</span><span>Users</span><span>Total</span></div>
        {[
          { country: '🇫🇷 France', guests: '3', users: '0', total: '3' },
          { country: '🇺🇸 United States', guests: '1', users: '1', total: '2' },
          { country: '🇨🇦 Canada', guests: '1', users: '0', total: '1' },
        ].map((r, i) => (
          <div key={i} className="stats-eng-row">
            <span className="stats-eng-label" contentEditable suppressContentEditableWarning>{r.country}</span>
            <span className="stats-eng-val" contentEditable suppressContentEditableWarning>{r.guests}</span>
            <span className="stats-eng-val" contentEditable suppressContentEditableWarning>{r.users}</span>
            <span className="stats-eng-val bold" contentEditable suppressContentEditableWarning>{r.total}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════
//  FANS TAB
// ══════════════════════════════════════════════
function FansTab() {
  const fans = [
    { init: 'BT', color: '#ff6b35', name: 'BigTipper99', joined: 'Jan 18, 2026', spent: '$652.10', msgs: 12, tips: 8 },
    { init: 'RK', color: '#f39c12', name: 'Roxy_K', joined: 'Feb 02, 2026', spent: '$263.08', msgs: 7, tips: 3 },
    { init: 'JX', color: '#00aff0', name: 'JakeXO', joined: 'Feb 14, 2026', spent: '$190.74', msgs: 5, tips: 6 },
    { init: 'LF', color: '#7b2ff7', name: 'Lisa_Fan', joined: 'Feb 20, 2026', spent: '$152.10', msgs: 18, tips: 2 },
    { init: 'MV', color: '#2ecc71', name: 'Mark_VIP', joined: 'Mar 01, 2026', spent: '$100.00', msgs: 3, tips: 4 },
  ];
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Subscriptions</div>
        <div className="stats-pill">Top fans</div>
      </div>
      <div className="stats-period-box">
        <div>
          <div className="stats-period-title">Last 30 days</div>
          <div className="stats-period-sub" contentEditable suppressContentEditableWarning>Feb 4, 2026 - Mar 6, 2026 (local time UTC+01:00)</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8a96a3' }}>
          <path d="M12 16.75L5.13 9.87a1 1 0 0 1-.3-.7 1 1 0 0 1 1-1 1 1 0 0 1 .71.29L12 13.92l5.46-5.46a1 1 0 0 1 .71-.29 1 1 0 0 1 1 1 1 1 0 0 1-.3.7z" />
        </svg>
      </div>
      <div className="stats-pills" style={{ borderTop: '1px solid #e0e0e0' }}>
        <div className="stats-pill active">All</div>
        <div className="stats-pill">Renewing</div>
        <div className="stats-pill">New subscribers</div>
      </div>
      <div className="stats-eng-table" style={{ padding: '0 20px' }}>
        <div className="stats-eng-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
          <span>Fan</span><span>Subscribed since</span><span>Spent</span><span>Messages</span>
        </div>
        {fans.map((f, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="stats-fans-av" style={{ background: f.color }}>{f.init}</div>
              <div>
                <div className="stats-fans-name" contentEditable suppressContentEditableWarning>{f.name}</div>
                <div className="stats-fans-sub">{f.tips} tip{f.tips > 1 ? 's' : ''}</div>
              </div>
            </div>
            <span style={{ fontSize: 13, color: '#555' }} contentEditable suppressContentEditableWarning>{f.joined}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }} contentEditable suppressContentEditableWarning>{f.spent}</span>
            <span style={{ fontSize: 13, color: '#555' }} contentEditable suppressContentEditableWarning>{f.msgs}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════
//  SIDEBAR (pixel-perfect from reference)
// ══════════════════════════════════════════════
function Sidebar() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Top creator badge */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        background: 'rgba(0,145,234,0.06)', borderRadius: 0,
        padding: '12px 14px', marginBottom: 0,
        borderBottom: '1px solid #e8e8e8',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#f5a623" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M17.52,21a1,1,0,0,1-.52-.15l-5-3.1-5,3.1a1,1,0,0,1-.55.15,1,1,0,0,1-1-1,1,1,0,0,1,0-.24l1.4-5.71L2.42,10.26A1,1,0,0,1,3,8.5l5.86-.43,2.22-5.45A1,1,0,0,1,12,2a1,1,0,0,1,.93.63l2.22,5.45L21,8.5a1,1,0,0,1,.93,1h0a1,1,0,0,1-.36.77l-4.49,3.79,1.4,5.71s0,.08,0,.12,0,.08,0,.12A1,1,0,0,1,17.52,21Z" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#111', lineHeight: 1.4 }}>
          YOU ARE IN THE TOP <span contentEditable suppressContentEditableWarning style={{ fontWeight: 700 }}>100</span>% OF ALL CREATORS!
        </span>
      </div>

      {/* Balances */}
      <div style={{ padding: '16px 14px', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111', lineHeight: 1.1, cursor: 'pointer' }}
              contentEditable suppressContentEditableWarning>$3,718.16</div>
            <div style={{ fontSize: 12, color: '#8a96a3', marginTop: 4 }}>Current balance</div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#8a96a3', lineHeight: 1.1, cursor: 'pointer' }}
              contentEditable suppressContentEditableWarning>$535.54</div>
            <div style={{ fontSize: 12, color: '#8a96a3', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              Pending balance
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#8a96a3">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-5h-.18a.18.18 0 0 1-.18-.18l.67-2.71a.76.76 0 0 0 0-.21.87.87 0 0 0-.87-.86h-1.09a1 1 0 0 0-1 1 1 1 0 0 0 .57.9.21.21 0 0 1 .12.19.09.09 0 0 1 0 .05l-.59 2.38a1.36 1.36 0 0 0 0 .29A1.2 1.2 0 0 0 11.6 17h1.06a1.19 1.19 0 0 0 1.19-1.19A.81.81 0 0 0 13 15zm-.5-8a1.35 1.35 0 1 0 1.35 1.35A1.34 1.34 0 0 0 12.5 7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Manual payouts */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid #e8e8e8', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Manual payouts</div>
            <div style={{ fontSize: 12, color: '#8a96a3', marginTop: 2 }}>Minimum withdrawal amount is $20</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#8a96a3' }}>
            <path d="M12 16.75L5.13 9.87a1 1 0 0 1-.3-.7 1 1 0 0 1 1-1 1 1 0 0 1 .71.29L12 13.92l5.46-5.46a1 1 0 0 1 .71-.29 1 1 0 0 1 1 1 1 1 0 0 1-.3.7z" />
          </svg>
        </div>
      </div>

      {/* Request withdrawal button */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{
          background: '#00aff0', color: '#fff', border: 'none', borderRadius: 1000,
          padding: '10px 20px', fontWeight: 600, fontSize: 14,
          cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Request withdrawal
        </button>
      </div>

      {/* Earnings section */}
      <div style={{ padding: '16px 14px 0' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 12, borderBottom: '1px solid #e8e8e8', paddingBottom: 10 }}>
          Earnings
        </div>

        {[
          { label: 'Total', amount: '$0.00', pct: '0%', data: sparkTotal },
          { label: 'Subscriptions', amount: '$0.06', pct: '0%', data: sparkSubs },
          { label: 'Tips', amount: '$0.00', pct: '0%', data: sparkTips },
          { label: 'Messages', amount: '$0.00', pct: '0%', data: sparkMsgs },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none',
            cursor: 'pointer',
          }}>
            <div>
              <div style={{ fontSize: 12, color: '#8a96a3', marginBottom: 3 }}>{item.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }} contentEditable suppressContentEditableWarning>
                  {item.amount}
                </span>
                <PercentBadge value={item.pct} />
              </div>
            </div>
            <MiniSparkline data={item.data} color="#4A4A4A" />
          </div>
        ))}
      </div>
    </div>
  );
}
