import { useState, useRef, useEffect, useCallback } from 'react';

function PeriodBox() {
  return (
    <div className="stats-period-box">
      <div>
        <div className="stats-period-title">Derniers 30 jours</div>
        <div className="stats-period-sub" contentEditable suppressContentEditableWarning>févr. 17, 2026 - mars 04, 2026 (heure locale UTC+01:00)</div>
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
  const [editing, setEditing] = useState(false);

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

  const handleInputChange = (index: number, value: string) => {
    if (!onDataChange) return;
    const num = parseInt(value) || 0;
    const newData = [...data];
    newData[index] = num;
    onDataChange(newData);
  };

  return (
    <>
      <div className="stats-chart-wrap">
        <canvas ref={canvasRef} width={600} height={140} style={{ width: '100%', height: 140, display: 'block' }} />
      </div>
      {onDataChange && (
        <>
          <button className="chart-edit-toggle" onClick={() => setEditing(!editing)}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            {editing ? 'Masquer' : 'Modifier données'}
          </button>
          {editing && (
            <div className="chart-data-editor">
              {data.map((v, i) => (
                <input
                  key={i}
                  className="chart-data-input"
                  type="number"
                  value={v}
                  onChange={(e) => handleInputChange(i, e.target.value)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

const xlabels = ['févr. 17, 2026', 'févr. 20, 2026', 'févr. 23, 2026', 'févr. 26, 2026', 'mars 01, 2026', 'mars 04, 2026'];

const tabs = [
  { key: 'releves', label: 'RELEVÉS' },
  { key: 'overview', label: "VUE D'ENSEMBLE" },
  { key: 'engagement', label: 'ENGAGEMENT' },
  { key: 'portee', label: 'PORTÉE' },
  { key: 'fans', label: '- DES FANS' },
];

const defaultChartData = [0,0,0,0,0,0,0,0,0,0,0,0,120,80,200,180,260,300,220,180,240,260,200,280,300,260,220,310,280,320];
const defaultEngData = [0,0,5,12,8,18,22,15,30,28,35,20,45,38,50,42,55,48,60,52,58,65,70,62,75,68,80,72,85,78];
const defaultPorteeData = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,2];

export function StatisticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState(defaultChartData);
  const [engChartData, setEngChartData] = useState(defaultEngData);
  const [porteeChartData, setPorteeChartData] = useState(defaultPorteeData);

  return (
    <>
      <div className="stats-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          <span className="stats-header-title">STATISTIQUES</span>
        </div>
        <div className="stats-help">?</div>
      </div>
      <div className="stats-alert">
        <span className="decl-alert-icon">⚠</span>
        <span>Veuillez remplir vos <a href="#">informations bancaires</a></span>
      </div>
      <div className="stats-tabs">
        {tabs.map(t => (
          <div key={t.key} className={`stats-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </div>
        ))}
      </div>
      <div className="stats-body">
        <div className="stats-main">
          {activeTab === 'releves' && <RelevesTab chartData={chartData} onChartDataChange={setChartData} />}
          {activeTab === 'overview' && <OverviewTab chartData={chartData} onChartDataChange={setChartData} />}
          {activeTab === 'engagement' && <EngagementTab chartData={engChartData} onChartDataChange={setEngChartData} />}
          {activeTab === 'portee' && <PorteeTab chartData={porteeChartData} onChartDataChange={setPorteeChartData} />}
          {activeTab === 'fans' && <FansTab />}
        </div>
        <div className="stats-right-col">
          <RightCol activeTab={activeTab} />
        </div>
      </div>
    </>
  );
}

function RelevesTab({ chartData, onChartDataChange }: { chartData: number[]; onChartDataChange: (d: number[]) => void }) {
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Revenus</div>
        <div className="stats-pill">Chargebacks</div>
      </div>
      <PeriodBox />
      <div className="stats-inception-row">
        <span>Depuis Inception</span>
        <span contentEditable suppressContentEditableWarning>$1 146,03</span>
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
        <div className="stats-pill active">Revenus</div>
        <div className="stats-pill">Principaux points forts</div>
        <div className="stats-pill">Série d'activités</div>
      </div>
      <PeriodBox />
      <div className="stats-chart-section">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="stats-chart-amount" contentEditable suppressContentEditableWarning>$1 146,03 <small>NET</small></div>
          <span style={{ fontSize: 11, color: '#8a8a9a' }}>févr. 17, 2026 - mars 04, 2026</span>
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
      <div className="stats-radio-header"><span>Revenus</span><span style={{ minWidth: 60, textAlign: 'right' }}>Brut</span><span style={{ minWidth: 60, textAlign: 'right', marginLeft: 20 }}>Net</span></div>
      {[
        { label: 'Total', brut: '$1 432,53', net: '$1 146,03', checked: true },
        { label: 'Abonnements', brut: '$0,00', net: '$0,00' },
        { label: 'Des pourboires', brut: '$652,10', net: '$521,68' },
        { label: 'Publications', brut: '$0,00', net: '$0,00' },
        { label: 'Messages', brut: '$493,86', net: '$395,09' },
        { label: 'Références', brut: '$0,00', net: '$0,00' },
        { label: 'Streams', brut: '$0,00', net: '$0,00' },
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
        <div className="stats-pill active">Publications</div>
        <div className="stats-pill">Messages</div>
        <div className="stats-pill">Streaming</div>
        <div className="stats-pill">Des histoires</div>
      </div>
      <PeriodBox />
      <div className="stats-pills" style={{ borderTop: '1px solid #e0e0e0' }}>
        <div className="stats-pill active">Achats</div>
        <div className="stats-pill">Des pourboires</div>
        <div className="stats-pill">Vues</div>
        <div className="stats-pill">J'aime</div>
        <div className="stats-pill">Commentaires</div>
      </div>
      <div className="stats-chart-section">
        <ChartCanvas data={chartData} onDataChange={onChartDataChange} />
        <div className="stats-chart-xlabels">{xlabels.map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <div className="stats-eng-table">
        <div className="stats-eng-header"><span>Contenu</span><span>Vues</span><span>J'aime</span><span>Revenus</span></div>
        {[
          { label: 'Post photo – 18 mai', vues: '142', likes: '38', rev: '$100,00' },
          { label: 'Post vidéo – 21 mai', vues: '289', likes: '74', rev: '$260,04' },
          { label: 'Message PPV – 22 mai', vues: '95', likes: '21', rev: '$190,74' },
          { label: 'Post photo – 23 mai', vues: '201', likes: '56', rev: '$152,10' },
          { label: 'Story – 25 mai', vues: '318', likes: '102', rev: '$0,00' },
        ].map((r, i) => (
          <div key={i} className="stats-eng-row">
            <span className="stats-eng-label" contentEditable suppressContentEditableWarning>{r.label}</span>
            <span className="stats-eng-val" contentEditable suppressContentEditableWarning>{r.vues}</span>
            <span className="stats-eng-val" contentEditable suppressContentEditableWarning>{r.likes}</span>
            <span className="stats-eng-val bold" contentEditable suppressContentEditableWarning>{r.rev}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function PorteeTab({ chartData, onChartDataChange }: { chartData: number[]; onChartDataChange: (d: number[]) => void }) {
  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Visiteurs du profil</div>
        <div className="stats-pill">Promotions</div>
        <div className="stats-pill">Liens d'essai</div>
        <div className="stats-pill">Liens de suivi</div>
      </div>
      <PeriodBox />
      <div className="stats-pills" style={{ borderTop: '1px solid #e0e0e0' }}>
        <div className="stats-pill active">Tout</div>
        <div className="stats-pill">Invités</div>
        <div className="stats-pill">Utilisateurs</div>
      </div>
      <div className="stats-chart-section">
        <div className="stats-portee-visitors"><strong contentEditable suppressContentEditableWarning>3</strong> Visiteurs</div>
        <ChartCanvas data={chartData} onDataChange={onChartDataChange} />
        <div className="stats-chart-xlabels">{xlabels.map((l, i) => <span key={i}>{l}</span>)}</div>
      </div>
      <div className="stats-eng-table">
        <div className="stats-eng-header"><span>Stat</span><span>Invités</span><span>Utilisateurs</span><span>Total</span></div>
        <div className="stats-eng-row"><span className="stats-eng-label">Visiteurs du profil</span><span className="stats-eng-val" contentEditable suppressContentEditableWarning>3</span><span className="stats-eng-val" contentEditable suppressContentEditableWarning>0</span><span className="stats-eng-val bold" contentEditable suppressContentEditableWarning>3</span></div>
        <div className="stats-eng-row"><span className="stats-eng-label">Durée de la vue</span><span className="stats-eng-val" contentEditable suppressContentEditableWarning>0h:00min</span><span className="stats-eng-val" contentEditable suppressContentEditableWarning>0h:00min</span><span className="stats-eng-val bold" contentEditable suppressContentEditableWarning>0h:00min</span></div>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Principaux pays</div>
        <div className="stats-eng-header"><span>Pays</span><span>Invités</span><span>Utilisateurs</span><span>Total</span></div>
        {[
          { pays: '🇫🇷 France', inv: '3', users: '0', total: '3' },
          { pays: '🇺🇸 États-Unis', inv: '1', users: '1', total: '2' },
          { pays: '🇨🇦 Canada', inv: '1', users: '0', total: '1' },
        ].map((r, i) => (
          <div key={i} className="stats-eng-row">
            <span className="stats-eng-label" contentEditable suppressContentEditableWarning>{r.pays}</span>
            <span className="stats-eng-val" contentEditable suppressContentEditableWarning>{r.inv}</span>
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
    { init: 'BT', color: '#ff6b35', name: 'BigTipper99', joined: '18 jan. 2026', spent: '$652,10', msgs: 12, tips: 8 },
    { init: 'RK', color: '#f39c12', name: 'Roxy_K', joined: '02 fév. 2026', spent: '$263,08', msgs: 7, tips: 3 },
    { init: 'JX', color: '#00aff0', name: 'JakeXO', joined: '14 fév. 2026', spent: '$190,74', msgs: 5, tips: 6 },
    { init: 'LF', color: '#7b2ff7', name: 'Lisa_Fan', joined: '20 fév. 2026', spent: '$152,10', msgs: 18, tips: 2 },
    { init: 'MV', color: '#2ecc71', name: 'Mark_VIP', joined: '01 mars 2026', spent: '$100,00', msgs: 3, tips: 4 },
  ];

  return (
    <>
      <div className="stats-pills">
        <div className="stats-pill active">Abonnements</div>
        <div className="stats-pill">Meilleurs ventilateurs</div>
      </div>
      <div className="stats-period-box">
        <div>
          <div className="stats-period-title">Derniers 30 jours</div>
          <div className="stats-period-sub" contentEditable suppressContentEditableWarning>févr. 17, 2026 - mars 04, 2026 (heure locale UTC+01:00)</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div className="stats-pills" style={{ borderTop: '1px solid #e0e0e0' }}>
        <div className="stats-pill active">Tout</div>
        <div className="stats-pill">Renouvelle</div>
        <div className="stats-pill">Nouveaux abonnés</div>
      </div>
      <div className="stats-eng-table" style={{ padding: '0 20px' }}>
        <div className="stats-eng-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
          <span>Fan</span><span>Abonné depuis</span><span>Dépensé</span><span>Messages</span>
        </div>
        {fans.map((f, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="stats-fans-av" style={{ background: f.color }}>{f.init}</div>
              <div>
                <div className="stats-fans-name" contentEditable suppressContentEditableWarning>{f.name}</div>
                <div className="stats-fans-sub">{f.tips} pourboire{f.tips > 1 ? 's' : ''}</div>
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
        <div><div className="lbl">Solde courant</div><div className="big" contentEditable suppressContentEditableWarning>$0.00</div></div>
        <div><div className="lbl">Fonds en attente ⓘ</div><div className="sml" contentEditable suppressContentEditableWarning>$0.00</div></div>
      </div>
      <select className="stats-select"><option>Paiements manuels</option><option>Paiements automatiques</option></select>
      <div style={{ fontSize: 11, color: '#8a8a9a', marginBottom: 8 }}>Le montant minimum de retrait est de $20</div>
      <button className="btn-withdraw-sm">DEMANDE DE RETRAIT</button>
      <hr className="stats-rw-divider" />
      <div className="stats-rw-title">Revenus</div>
      <div style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 12 }}>Aucun revenu pendant la période sélectionnée</div>
      <div className="stats-rw-grid">
        <div className="stats-rw-item"><label>Visiteurs du profil</label><div className="val" contentEditable suppressContentEditableWarning>3</div></div>
        <div className="stats-rw-item"><label>Revenus des abonnements</label><div className="val" contentEditable suppressContentEditableWarning>$0.00</div></div>
      </div>
      <hr className="stats-rw-divider" />
      <div className="stats-rw-item" style={{ marginBottom: 8 }}><label>Nouveaux abonnements/renouvellements</label><div className="val" contentEditable suppressContentEditableWarning>0 / 0</div></div>
      <hr className="stats-rw-divider" />
      <div className="stats-rw-title" style={{ marginTop: 8 }}>Publications</div>
      <div style={{ fontSize: 12, color: '#8a8a9a', marginBottom: 10 }}>Aucune activité de publication pendant la période sélectionnée</div>
      <div className="stats-rw-title">Messages</div>
      <div style={{ fontSize: 12, color: '#8a8a9a' }}>Aucune activité de messagerie pendant la période sélectionnée</div>

      {activeTab === 'engagement' && (
        <>
          <div className="stats-rw" style={{ marginTop: 14 }}>
            <div className="stats-rw-title">Sommaire</div>
            <div className="stats-rw-grid">
              <div className="stats-rw-item"><label>Total vues</label><div className="val" contentEditable suppressContentEditableWarning>1 045</div></div>
              <div className="stats-rw-item"><label>Total j'aime</label><div className="val" contentEditable suppressContentEditableWarning>291</div></div>
              <div className="stats-rw-item"><label>Commentaires</label><div className="val" contentEditable suppressContentEditableWarning>47</div></div>
              <div className="stats-rw-item"><label>Achats PPV</label><div className="val" contentEditable suppressContentEditableWarning>12</div></div>
            </div>
          </div>
          <div className="stats-rw">
            <div className="stats-rw-title">Poste supérieur</div>
            <div style={{ fontSize: 12.5, color: '#111', fontWeight: 500, marginBottom: 4 }} contentEditable suppressContentEditableWarning>Post vidéo – 21 mai</div>
            <div className="stats-rw-grid">
              <div className="stats-rw-item"><label>Vues</label><div className="val" contentEditable suppressContentEditableWarning>289</div></div>
              <div className="stats-rw-item"><label>Revenus</label><div className="val" contentEditable suppressContentEditableWarning>$260,04</div></div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'fans' && (
        <>
          <div className="stats-rw" style={{ marginTop: 14 }}>
            <div className="stats-rw-title">Sommaire</div>
            <div className="stats-rw-grid">
              <div className="stats-rw-item"><label>Total abonnés</label><div className="val" contentEditable suppressContentEditableWarning>5</div></div>
              <div className="stats-rw-item"><label>Nouveaux abonnés</label><div className="val" contentEditable suppressContentEditableWarning>2</div></div>
              <div className="stats-rw-item"><label>Renouvellements</label><div className="val" contentEditable suppressContentEditableWarning>3</div></div>
              <div className="stats-rw-item"><label>Revenus abonnements</label><div className="val" contentEditable suppressContentEditableWarning>$0.00</div></div>
            </div>
          </div>
          <div className="stats-rw">
            <div className="stats-rw-title">Ventilateur supérieur</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ff6b35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>BT</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }} contentEditable suppressContentEditableWarning>BigTipper99</div>
                <div style={{ fontSize: 12, color: '#8a8a9a' }} contentEditable suppressContentEditableWarning>$652,10 dépensés · 8 pourboires</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
