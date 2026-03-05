import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

// ── Helper: hex to rgba ──
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.length === 3 ? h[0]+h[0] : h.slice(0,2), 16);
  const g = parseInt(h.length === 3 ? h[1]+h[1] : h.slice(2,4), 16);
  const b = parseInt(h.length === 3 ? h[2]+h[2] : h.slice(4,6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function PeriodBox() {
  return (
    <div className="stats-period-box">
      <div>
        <div className="stats-period-title">Last 30 days</div>
        <div className="stats-period-sub" contentEditable suppressContentEditableWarning>Apr 23, 2025 – May 23, 2025 (local time UTC +02:00)</div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  );
}

// ── Dual chart: top earnings (blue) + bottom fans count (grey) ──
function DualChartCanvas({ topData, bottomData, onTopDataChange }: {
  topData: number[];
  bottomData: number[];
  onTopDataChange?: (data: number[]) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const PAD_L = 8, PAD_R = 50;
    ctx.clearRect(0, 0, W, H);

    const topH = H * 0.62;
    const botH = H * 0.38;
    const topMax = Math.max(...topData, 1);
    const botMax = Math.max(...bottomData, 1);

    const ptX = (i: number) => PAD_L + (i / (topData.length - 1)) * (W - PAD_L - PAD_R);
    const topPtY = (v: number) => topH * 0.08 + (1 - v / topMax) * topH * 0.84;
    const botPtY = (v: number) => topH + botH * 0.08 + (1 - v / botMax) * botH * 0.84;

    // Grid top
    ctx.strokeStyle = '#ebebeb'; ctx.lineWidth = 1;
    [topH * 0.3, topH * 0.6, topH * 0.9].forEach(y => {
      ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(W - PAD_R, y); ctx.stroke();
    });
    ctx.fillStyle = '#bbb'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('$200', W - PAD_R + 4, topH * 0.3 + 4);
    ctx.fillText('$100', W - PAD_R + 4, topH * 0.6 + 4);

    // Grid bottom
    [topH + botH * 0.35, topH + botH * 0.7].forEach(y => {
      ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(W - PAD_R, y); ctx.stroke();
    });
    ctx.fillText('300', W - PAD_R + 4, topH + botH * 0.35 + 4);
    ctx.fillText('150', W - PAD_R + 4, topH + botH * 0.7 + 4);

    // Top fill + line (blue)
    const gradTop = ctx.createLinearGradient(0, 0, 0, topH);
    gradTop.addColorStop(0, 'rgba(0,175,240,0.33)');
    gradTop.addColorStop(1, 'rgba(0,175,240,0.03)');
    ctx.beginPath(); ctx.moveTo(ptX(0), topH);
    topData.forEach((v, i) => ctx.lineTo(ptX(i), topPtY(v)));
    ctx.lineTo(ptX(topData.length - 1), topH); ctx.closePath();
    ctx.fillStyle = gradTop; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = '#00aff0'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    topData.forEach((v, i) => { i === 0 ? ctx.moveTo(ptX(i), topPtY(v)) : ctx.lineTo(ptX(i), topPtY(v)); });
    ctx.stroke();

    // Bottom fill + line (grey)
    const gradBot = ctx.createLinearGradient(0, topH, 0, H);
    gradBot.addColorStop(0, 'rgba(176,176,176,0.27)');
    gradBot.addColorStop(1, 'rgba(176,176,176,0.03)');
    ctx.beginPath(); ctx.moveTo(ptX(0), H);
    bottomData.forEach((v, i) => ctx.lineTo(ptX(i), botPtY(v)));
    ctx.lineTo(ptX(bottomData.length - 1), H); ctx.closePath();
    ctx.fillStyle = gradBot; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = '#b0b0b0'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    bottomData.forEach((v, i) => { i === 0 ? ctx.moveTo(ptX(i), botPtY(v)) : ctx.lineTo(ptX(i), botPtY(v)); });
    ctx.stroke();

    // Divider
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, topH); ctx.lineTo(W, topH); ctx.stroke();
  }, [topData, bottomData]);

  useEffect(() => { draw(); }, [draw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onTopDataChange) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const W = canvas.width, PAD_L = 8, PAD_R = 50;
    const ptX = (i: number) => PAD_L + (i / (topData.length - 1)) * (W - PAD_L - PAD_R);
    let closestIdx = 0, minDist = Infinity;
    topData.forEach((_, i) => { const d = Math.abs(x - ptX(i)); if (d < minDist) { minDist = d; closestIdx = i; } });
    if (minDist < 20) setDragging(closestIdx);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging === null || !onTopDataChange) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    const H = canvas.height, topH = H * 0.62;
    const topMax = Math.max(...topData, 1);
    const newValue = Math.max(0, Math.round((1 - (y - topH * 0.08) / (topH * 0.84)) * topMax));
    const newData = [...topData]; newData[dragging] = newValue; onTopDataChange(newData);
  };

  const handleMouseUp = () => setDragging(null);

  return (
    <div className="stats-chart-wrap">
      <canvas ref={canvasRef} width={620} height={200}
        style={{ width: '100%', height: 200, display: 'block', cursor: onTopDataChange ? 'pointer' : 'default' }}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

function ChartCanvas({ data, color = '#00aff0', onDataChange }: { data: number[]; color?: string; onDataChange?: (data: number[]) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = canvas.width, H = canvas.height, PAD = 12;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data, 1);
    const ptX = (i: number) => PAD + (i / (data.length - 1)) * (W - 2 * PAD);
    const ptY = (v: number) => H - PAD - (v / max) * (H - 2 * PAD);
    ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = 1;
    [H * 0.25, H * 0.5, H * 0.75].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); });
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, hexToRgba(color, 0.27));
    grad.addColorStop(1, hexToRgba(color, 0.02));
    ctx.beginPath(); ctx.moveTo(ptX(0), H);
    data.forEach((v, i) => ctx.lineTo(ptX(i), ptY(v)));
    ctx.lineTo(ptX(data.length - 1), H); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    data.forEach((v, i) => { i === 0 ? ctx.moveTo(ptX(i), ptY(v)) : ctx.lineTo(ptX(i), ptY(v)); });
    ctx.stroke();
    data.forEach((v, i) => {
      ctx.beginPath(); ctx.arc(ptX(i), ptY(v), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    });
  }, [data, color]);

  useEffect(() => { draw(); }, [draw]);

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onDataChange) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    const W = canvas.width, H = canvas.height, PAD = 12;
    const max = Math.max(...data, 1);
    const ptX = (i: number) => PAD + (i / (data.length - 1)) * (W - 2 * PAD);
    const ptY = (v: number) => H - PAD - (v / max) * (H - 2 * PAD);
    let closestIdx = 0, minDist = Infinity;
    data.forEach((v, i) => { const dist = Math.sqrt((x - ptX(i)) ** 2 + (y - ptY(v)) ** 2); if (dist < minDist) { minDist = dist; closestIdx = i; } });
    if (minDist < 20 || dragging !== null) {
      const newValue = Math.max(0, Math.round((H - PAD - y) / (H - 2 * PAD) * max));
      const newData = [...data]; newData[closestIdx] = newValue; onDataChange(newData);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onDataChange) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const W = canvas.width, PAD = 12;
    const ptX = (i: number) => PAD + (i / (data.length - 1)) * (W - 2 * PAD);
    let closestIdx = 0, minDist = Infinity;
    data.forEach((_, i) => { const d = Math.abs(x - ptX(i)); if (d < minDist) { minDist = d; closestIdx = i; } });
    if (minDist < 20) { setDragging(closestIdx); handleCanvasInteraction(e); }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => { if (dragging !== null) handleCanvasInteraction(e); };
  const handleMouseUp = () => setDragging(null);

  return (
    <div className="stats-chart-wrap">
      <canvas ref={canvasRef} width={600} height={140}
        style={{ width: '100%', height: 140, display: 'block', cursor: onDataChange ? 'pointer' : 'default' }}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

// ── Mini sparkline sidebar — utilise hexToRgba pour éviter le bug de couleur ──
function MiniSparkline({ data, color = '#00aff0' }: { data: number[]; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data, 1);
    const ptX = (i: number) => (i / (data.length - 1)) * W;
    const ptY = (v: number) => H - (v / max) * H * 0.85;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, hexToRgba(color, 0.33));
    grad.addColorStop(1, hexToRgba(color, 0.02));
    ctx.beginPath(); ctx.moveTo(ptX(0), H);
    data.forEach((v, i) => ctx.lineTo(ptX(i), ptY(v)));
    ctx.lineTo(ptX(data.length - 1), H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
    data.forEach((v, i) => { i === 0 ? ctx.moveTo(ptX(i), ptY(v)) : ctx.lineTo(ptX(i), ptY(v)); });
    ctx.stroke();
  }, [data, color]);
  return <canvas ref={canvasRef} width={80} height={32} style={{ width: 80, height: 32, display: 'block' }} />;
}

const sparkTotal         = [20,35,28,45,60,40,55,70,85,65,80,90,75,95,100];
const sparkSubscriptions = [5,8,6,10,12,9,14,11,16,13,18,15,20,17,22];
const sparkTips          = [10,20,15,25,18,30,22,35,28,40,32,38,30,42,35];
const sparkMessages      = [15,25,20,35,28,40,32,45,38,50,42,48,55,52,60];

const xlabelsStatements = ['Apr 23, 2025', 'Apr 30, 2025', 'May 8, 2025', 'May 15, 2025', 'May 22, 2025'];
const xlabels = ['Feb 17, 2026', 'Feb 20, 2026', 'Feb 23, 2026', 'Feb 26, 2026', 'Mar 01, 2026', 'Mar 04, 2026'];

const tabs = [
  { key: 'statements', label: 'STATEMENTS' },
  { key: 'overview', label: 'OVERVIEW' },
  { key: 'engagement', label: 'ENGAGEMENT' },
  { key: 'reach', label: 'REACH' },
  { key: 'fans', label: 'FANS' },
];

const defaultTopData    = [0,0,0,0,0,0,0,0,0,0,0,0,120,80,200,180,260,300,220,180,240,260,200,280,300,260,220,310,280,320];
const defaultBottomData = [80,90,100,85,95,110,120,100,115,130,120,140,130,150,160,145,155,165,150,160,170,155,165,175,160,170,180,165,175,185];
const defaultEngData    = [0,0,5,12,8,18,22,15,30,28,35,20,45,38,50,42,55,48,60,52,58,65,70,62,75,68,80,72,85,78];
const defaultReachData  = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,2];

const transactions = [
  { date: 'May 2, 2025',  time: '6:25 am',   amount: '$152.10', fee: '$30.42', net: '$121.68', desc: 'Tip from',                 name: 'Neha K' },
  { date: 'May 22, 2025', time: '8:55 am',   amount: '$190.74', fee: '$38.15', net: '$152.59', desc: 'Payment for message from', name: 'Rohit R' },
  { date: 'May 21, 2025', time: '2:44 am',   amount: '$260.04', fee: '$52.01', net: '$208.03', desc: 'Payment for message from', name: 'Juandre W' },
  { date: 'May 20, 2025', time: '11:04 pm',  amount: '$263.08', fee: '$52.62', net: '$210.46', desc: 'Payment for message from', name: 'Hamender K' },
  { date: 'May 19, 2025', time: '5:28 pm',   amount: '$268.24', fee: '$53.65', net: '$214.59', desc: 'Payment for message from', name: 'Shivali C' },
  { date: 'May 18, 2025', time: '3:13 am',   amount: '$207.89', fee: '$41.58', net: '$166.31', desc: 'Tip from',                 name: 'Grygorchuk V' },
];

export function StatisticsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = routeToTab[location.pathname] || 'overview';
  const [topData, setTopData] = useState(defaultTopData);
  const [bottomData] = useState(defaultBottomData);
  const [chartData, setChartData] = useState(defaultTopData);
  const [engChartData, setEngChartData] = useState(defaultEngData);
  const [reachChartData, setReachChartData] = useState(defaultReachData);

  return (
    <>
      <div className="stats-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          <span className="stats-header-title">STATISTICS</span>
        </div>
        <div className="stats-help">?</div>
      </div>
      <div className="stats-tabs">
        {tabs.map(t => (
          <div key={t.key} className={`stats-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => navigate(tabRoutes[t.key])}>
            {t.label}
          </div>
        ))}
      </div>
      <div className="stats-body">
        <div className="stats-main">
          {activeTab === 'statements' && (
            <StatementsTab topData={topData} bottomData={bottomData} onTopDataChange={setTopData} />
          )}
          {activeTab === 'overview' && <OverviewTab chartData={chartData} onChartDataChange={setChartData} />}
          {activeTab === 'engagement' && <EngagementTab chartData={engChartData} onChartDataChange={setEngChartData} />}
          {activeTab === 'reach' && <ReachTab chartData={reachChartData} onChartDataChange={setReachChartData} />}
          {activeTab === 'fans' && <FansTab />}
        </div>
        <div className="stats-right-col">
          <RightCol activeTab={activeTab} />
        </div>
      </div>
    </>
  );
}

function StatementsTab({ topData, bottomData, onTopDataChange }: {
  topData: number[];
  bottomData: number[];
  onTopDataChange: (d: number[]) => void;
}) {
  return (
    <>
      <div className="stats-period-box" style={{ marginBottom: 0 }}>
        <div>
          <div className="stats-period-title">Last 30 days</div>
          <div className="stats-period-sub" contentEditable suppressContentEditableWarning>
            Apr 23, 2025 – May 23, 2025 (local time UTC +02:00)
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      <div className="stats-chart-section" style={{ paddingBottom: 0 }}>
        <DualChartCanvas topData={topData} bottomData={bottomData} onTopDataChange={onTopDataChange} />
        <div className="stats-chart-xlabels">
          {xlabelsStatements.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto auto auto',
        padding: '10px 20px', borderBottom: '1px solid #f0f0f0',
        fontSize: 12, color: '#aaa', fontWeight: 500, gap: 16,
      }}>
        <span>Date</span>
        <span style={{ minWidth: 70, textAlign: 'right' }}>Amount</span>
        <span style={{ minWidth: 50, textAlign: 'right' }}>Fee</span>
        <span style={{ minWidth: 60, textAlign: 'right' }}>Net</span>
      </div>

      {transactions.map((tx, i) => (
        <div key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto auto',
            padding: '10px 20px 2px 20px', gap: 16, alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>
              <span style={{ color: '#cc2244' }}>{tx.date},</span> {tx.time}
            </span>
            <span style={{ fontSize: 13, color: '#111', minWidth: 70, textAlign: 'right' }} contentEditable suppressContentEditableWarning>{tx.amount}</span>
            <span style={{ fontSize: 13, color: '#888', minWidth: 50, textAlign: 'right' }} contentEditable suppressContentEditableWarning>{tx.fee}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111', minWidth: 60, textAlign: 'right' }} contentEditable suppressContentEditableWarning>{tx.net}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 10px 20px' }}>
            <span style={{ fontSize: 13, color: '#555' }}>
              {tx.desc} <span style={{ color: '#00aff0', cursor: 'pointer' }}>{tx.name}</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00aff0" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
      ))}
    </>
  );
}

function OverviewTab({ chartData, onChartDataChange }: { chartData: number[]; onChartDataChange: (d: number[]) => void }) {
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Earnings</div>
        <div className="stats-pill">Top highlights</div>
        <div className="stats-pill">Activity streak</div>
      </div>
      <PeriodBox />
      <div className="stats-chart-section">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="stats-chart-amount" contentEditable suppressContentEditableWarning>$1,146.03 <small>NET</small></div>
          <span style={{ fontSize: 11, color: '#8a8a9a' }}>Feb 17, 2026 - Mar 04, 2026</span>
        </div>
        <ChartCanvas data={chartData} onDataChange={onChartDataChange} />
        <div className="stats-chart-xlabels">{xlabels.map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <RadioTable />
    </>
  );
}

function RadioTable() {
  return (
    <div className="stats-radio-table">
      <div className="stats-radio-header"><span>Earnings</span><span style={{ minWidth: 60, textAlign: 'right' }}>Gross</span><span style={{ minWidth: 60, textAlign: 'right', marginLeft: 20 }}>Net</span></div>
      {[
        { label: 'Total', brut: '$1,432.53', net: '$1,146.03', checked: true },
        { label: 'Subscriptions', brut: '$0.00', net: '$0.00' },
        { label: 'Tips', brut: '$652.10', net: '$521.68' },
        { label: 'Posts', brut: '$0.00', net: '$0.00' },
        { label: 'Messages', brut: '$493.86', net: '$395.09' },
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

function EngagementTab({ chartData, onChartDataChange }: { chartData: number[]; onChartDataChange: (d: number[]) => void }) {
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Posts</div>
        <div className="stats-pill">Messages</div>
        <div className="stats-pill">Streaming</div>
        <div className="stats-pill">Stories</div>
      </div>
      <PeriodBox />
      <div className="stats-pills" style={{ borderTop: '1px solid #e0e0e0' }}>
        <div className="stats-pill active">Purchases</div>
        <div className="stats-pill">Tips</div>
        <div className="stats-pill">Views</div>
        <div className="stats-pill">Likes</div>
        <div className="stats-pill">Comments</div>
      </div>
      <div className="stats-chart-section">
        <ChartCanvas data={chartData} onDataChange={onChartDataChange} />
        <div className="stats-chart-xlabels">{xlabels.map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <div className="stats-eng-table">
        <div className="stats-eng-header"><span>Content</span><span>Views</span><span>Likes</span><span>Earnings</span></div>
        {[
          { label: 'Photo post – May 18', views: '142', likes: '38', rev: '$100.00' },
          { label: 'Video post – May 21', views: '289', likes: '74', rev: '$260.04' },
          { label: 'PPV Message – May 22', views: '95', likes: '21', rev: '$190.74' },
          { label: 'Photo post – May 23', views: '201', likes: '56', rev: '$152.10' },
          { label: 'Story – May 25', views: '318', likes: '102', rev: '$0.00' },
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

function ReachTab({ chartData, onChartDataChange }: { chartData: number[]; onChartDataChange: (d: number[]) => void }) {
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Profile visitors</div>
        <div className="stats-pill">Promotions</div>
        <div className="stats-pill">Trial links</div>
        <div className="stats-pill">Tracking links</div>
      </div>
      <PeriodBox />
      <div className="stats-pills" style={{ borderTop: '1px solid #e0e0e0' }}>
        <div className="stats-pill active">All</div>
        <div className="stats-pill">Guests</div>
        <div className="stats-pill">Users</div>
      </div>
      <div className="stats-chart-section">
        <div className="stats-portee-visitors"><strong contentEditable suppressContentEditableWarning>3</strong> Visitors</div>
        <ChartCanvas data={chartData} onDataChange={onChartDataChange} />
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
          <div className="stats-period-sub" contentEditable suppressContentEditableWarning>Feb 17, 2026 - Mar 04, 2026 (local time UTC+01:00)</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
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

function RightCol({ activeTab }: { activeTab: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Badge Top 1.8% */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        background: '#f0f8ff', borderRadius: 10,
        padding: '12px 14px', marginBottom: 18,
      }}>
        <span style={{ fontSize: 16, marginTop: 1 }}>⭐</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          YOU ARE IN THE TOP 1.8% OF ALL CREATORS!
        </span>
      </div>

      {/* Balances côte à côte */}
      <div style={{ display: 'flex', gap: 28, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111', lineHeight: 1.1 }} contentEditable suppressContentEditableWarning>$3,179.51</div>
          <div style={{ fontSize: 11, color: '#8a8a9a', marginTop: 2 }}>Current balance</div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#333', lineHeight: 1.1 }} contentEditable suppressContentEditableWarning>$457.96</div>
          <div style={{ fontSize: 11, color: '#8a8a9a', marginTop: 2 }}>Pending balance ⓘ</div>
        </div>
      </div>

      {/* Manual payouts */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Manual payouts</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div style={{ fontSize: 11, color: '#8a8a9a', marginBottom: 10 }}>Minimum withdrawal amount is $20</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <button style={{
          background: '#00aff0', color: '#fff', border: 'none', borderRadius: 6,
          padding: '9px 16px', fontWeight: 700, fontSize: 11,
          letterSpacing: '0.06em', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          REQUEST WITHDRAWAL
        </button>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #efefef', margin: '16px 0' }} />

      <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 16 }}>Earnings</div>

      {[
        { label: 'Total',         amount: '$7,543.44', pct: '+138.5%', color: '#888888', data: sparkTotal },
        { label: 'Subscriptions', amount: '$3,616.27', pct: '+192.9%', color: '#4caf50', data: sparkSubscriptions },
        { label: 'Tips',          amount: '$1,414.16', pct: '+85.5%',  color: '#9c27b0', data: sparkTips },
        { label: 'Messages',      amount: '$4,240.45', pct: '+111%',   color: '#00bcd4', data: sparkMessages },
      ].map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: 14, marginBottom: 4,
          borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none',
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 3 }}>{item.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }} contentEditable suppressContentEditableWarning>
                {item.amount}
              </span>
              <span style={{ fontSize: 11, color: '#4caf50', fontWeight: 600 }}>{item.pct}</span>
            </div>
          </div>
          <MiniSparkline data={item.data} color={item.color} />
        </div>
      ))}
    </div>
  );
}