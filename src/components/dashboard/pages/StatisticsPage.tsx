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

function PeriodBox() {
  return (
    <div className="stats-period-box">
      <div>
        <div className="stats-period-title">Last 30 days</div>
        <div className="stats-period-sub" contentEditable suppressContentEditableWarning>Feb 17, 2026 - Mar 04, 2026 (local time UTC+01:00)</div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  );
}

function ChartCanvas({ data, color = '#00aff0', onDataChange }: { data: number[]; color?: string; onDataChange?: (data: number[]) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height, PAD = 12;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data, 1);
    const ptX = (i: number) => PAD + (i / (data.length - 1)) * (W - 2 * PAD);
    const ptY = (v: number) => H - PAD - (v / max) * (H - 2 * PAD);

    ctx.strokeStyle = '#f0f0f0'; ctx.lineWidth = 1;
    [H * 0.25, H * 0.5, H * 0.75].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); });

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '44'); grad.addColorStop(1, color + '05');
    ctx.beginPath(); ctx.moveTo(ptX(0), H);
    data.forEach((v, i) => ctx.lineTo(ptX(i), ptY(v)));
    ctx.lineTo(ptX(data.length - 1), H); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    data.forEach((v, i) => { i === 0 ? ctx.moveTo(ptX(i), ptY(v)) : ctx.lineTo(ptX(i), ptY(v)); });
    ctx.stroke();

    data.forEach((v, i) => {
      ctx.beginPath(); ctx.arc(ptX(i), ptY(v), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    });
  }, [data, color]);

  useEffect(() => { draw(); }, [draw]);

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onDataChange) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const W = canvas.width, H = canvas.height, PAD = 12;
    const max = Math.max(...data, 1);
    const ptX = (i: number) => PAD + (i / (data.length - 1)) * (W - 2 * PAD);
    const ptY = (v: number) => H - PAD - (v / max) * (H - 2 * PAD);

    // Find closest point
    let closestIdx = 0;
    let minDist = Infinity;
    data.forEach((v, i) => {
      const dx = x - ptX(i);
      const dy = y - ptY(v);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    });

    // Update value based on y position
    if (minDist < 20 || dragging !== null) {
      const newValue = Math.max(0, Math.round((H - PAD - y) / (H - 2 * PAD) * max));
      const newData = [...data];
      newData[closestIdx] = newValue;
      onDataChange(newData);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onDataChange) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const x = (e.clientX - rect.left) * scaleX;

    const W = canvas.width, PAD = 12;
    const ptX = (i: number) => PAD + (i / (data.length - 1)) * (W - 2 * PAD);

    let closestIdx = 0;
    let minDist = Infinity;
    data.forEach((_, i) => {
      const dist = Math.abs(x - ptX(i));
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    });

    if (minDist < 20) {
      setDragging(closestIdx);
      handleCanvasInteraction(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging !== null) {
      handleCanvasInteraction(e);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div className="stats-chart-wrap">
      <canvas
        ref={canvasRef}
        width={600}
        height={140}
        style={{ width: '100%', height: 140, display: 'block', cursor: onDataChange ? 'pointer' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

const xlabels = ['Feb 17, 2026', 'Feb 20, 2026', 'Feb 23, 2026', 'Feb 26, 2026', 'Mar 01, 2026', 'Mar 04, 2026'];

const tabs = [
  { key: 'statements', label: 'STATEMENTS' },
  { key: 'overview', label: 'OVERVIEW' },
  { key: 'engagement', label: 'ENGAGEMENT' },
  { key: 'reach', label: 'REACH' },
  { key: 'fans', label: 'FANS' },
];

const defaultChartData = [0,0,0,0,0,0,0,0,0,0,0,0,120,80,200,180,260,300,220,180,240,260,200,280,300,260,220,310,280,320];
const defaultEngData = [0,0,5,12,8,18,22,15,30,28,35,20,45,38,50,42,55,48,60,52,58,65,70,62,75,68,80,72,85,78];
const defaultReachData = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,2];

export function StatisticsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = routeToTab[location.pathname] || 'overview';
  const [chartData, setChartData] = useState(defaultChartData);
  const [engChartData, setEngChartData] = useState(defaultEngData);
  const [reachChartData, setReachChartData] = useState(defaultReachData);

  const handleTabChange = (key: string) => {
    navigate(tabRoutes[key]);
  };

  return (
    <>
      <div className="stats-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          <span className="stats-header-title">STATISTICS</span>
        </div>
        <div className="stats-help">?</div>
      </div>
      <div className="stats-alert">
        <span className="decl-alert-icon">⚠</span>
        <span>Please fill in your <a href="#">banking information</a></span>
      </div>
      <div className="stats-tabs">
        {tabs.map(t => (
          <div key={t.key} className={`stats-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => handleTabChange(t.key)}>
            {t.label}
          </div>
        ))}
      </div>
      <div className="stats-body">
        <div className="stats-main">
          {activeTab === 'statements' && <StatementsTab chartData={chartData} onChartDataChange={setChartData} />}
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

function StatementsTab({ chartData, onChartDataChange }: { chartData: number[]; onChartDataChange: (d: number[]) => void }) {
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Earnings</div>
        <div className="stats-pill">Chargebacks</div>
      </div>
      <PeriodBox />
      <div className="stats-inception-row">
        <span>Since Inception</span>
        <span contentEditable suppressContentEditableWarning>$1,146.03</span>
      </div>
      <div className="stats-chart-section">
        <ChartCanvas data={chartData} onDataChange={onChartDataChange} />
        <div className="stats-chart-xlabels">{xlabels.map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <RadioTable />
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
    <>
      <div className="stats-rw-balance">
        <div><div className="lbl">Current balance</div><div className="big" contentEditable suppressContentEditableWarning>$0.00</div></div>
        <div><div className="lbl">Pending balance ⓘ</div><div className="sml" contentEditable suppressContentEditableWarning>$0.00</div></div>
      </div>
      <select className="stats-select"><option>Manual payouts</option><option>Automatic payouts</option></select>
      <div style={{ fontSize: 11, color: '#8a8a9a', marginBottom: 8 }}>Minimum withdrawal amount is $20</div>
      <button className="btn-withdraw-sm">REQUEST WITHDRAWAL</button>
      <hr className="stats-rw-divider" />
      <div className="stats-rw-title">Earnings</div>
      <div style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 12 }}>No earnings during the selected period</div>
      <div className="stats-rw-grid">
        <div className="stats-rw-item"><label>Profile visitors</label><div className="val" contentEditable suppressContentEditableWarning>3</div></div>
        <div className="stats-rw-item"><label>Subscription earnings</label><div className="val" contentEditable suppressContentEditableWarning>$0.00</div></div>
      </div>
      <hr className="stats-rw-divider" />
      <div className="stats-rw-title">Revenue breakdown</div>
      <div className="stats-rw-grid">
        <div className="stats-rw-item"><label>Tips</label><div className="val" contentEditable suppressContentEditableWarning>$521.68</div></div>
        <div className="stats-rw-item"><label>Messages</label><div className="val" contentEditable suppressContentEditableWarning>$395.09</div></div>
        <div className="stats-rw-item"><label>Posts</label><div className="val" contentEditable suppressContentEditableWarning>$0.00</div></div>
        <div className="stats-rw-item"><label>Streams</label><div className="val" contentEditable suppressContentEditableWarning>$0.00</div></div>
      </div>
    </>
  );
}
