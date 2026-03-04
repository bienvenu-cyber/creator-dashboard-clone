import { useState } from 'react';

const collItems = [
  { name: 'Suivant', sub: '1 utilisateur · 25 posts', active: true },
  { name: 'Fans', sub: 'vide' },
  { name: 'Amis', sub: 'vide' },
  { name: 'Au Silence', sub: 'vide' },
  { name: 'Récent (dernières 24 heures)', sub: 'Aucun nouvel abonné au cours des dernières 24 he...' },
  { name: 'Marqué', sub: 'vide' },
  { name: 'Restreints', sub: 'vide' },
  { name: 'Bloqués', sub: 'vide' },
];

export function CollectionsPage() {
  const [activeItem, setActiveItem] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [activeMidTab, setActiveMidTab] = useState(0);

  return (
    <div className="coll-layout">
      {/* Left panel */}
      <div className="coll-left">
        <div className="coll-left-header">
          <div className="coll-left-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            COLLECTIONS
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </div>
        <div className="coll-tabs">
          {["LISTES D'UTILISATEURS", 'SIGNETS', 'ÉTIQUETTES DE P...'].map((t, i) => (
            <div key={i} className={`coll-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{t}</div>
          ))}
        </div>
        <div className="coll-order-row">
          <span>ORDRE PERSONNALISÉ</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </div>
        {collItems.map((c, i) => (
          <div key={i} className={`coll-list-item ${activeItem === i ? 'active' : ''}`} onClick={() => setActiveItem(i)}>
            <div>
              <div className="coll-list-name" contentEditable suppressContentEditableWarning>{c.name}</div>
              <div className="coll-list-sub" contentEditable suppressContentEditableWarning>{c.sub}</div>
            </div>
            {i === 0 && (
              <div className="coll-list-icon">
                <svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Middle panel */}
      <div className="coll-mid">
        <div className="coll-mid-header">
          <div className="coll-mid-title">SUIVANT</div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div className="coll-mid-tabs">
          {['UTILISATEURS', 'PUBLICATIONS'].map((t, i) => (
            <div key={i} className={`coll-mid-tab ${activeMidTab === i ? 'active' : ''}`} onClick={() => setActiveMidTab(i)}>{t}</div>
          ))}
        </div>
        <div className="coll-mid-filter">
          <span>RÉCENT</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
        <div className="coll-status-chips">
          <div className="coll-chip active">Tout 1</div>
          <div className="coll-chip sel">Actifs 1</div>
          <div className="coll-chip">Expirés 0</div>
          <div className="coll-chip">Attention requise 0</div>
        </div>
        {/* Fan card */}
        <div className="coll-fan-card">
          <div className="coll-fan-banner">
            <span style={{ fontSize: 11, color: '#fff', opacity: .8, fontWeight: 600, letterSpacing: 1 }}>OnlyFans</span>
          </div>
          <div className="coll-fan-body">
            <div className="coll-fan-av">
              <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', padding: '0 4px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }} contentEditable suppressContentEditableWarning>OnlyFans Cre...</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#00aff0"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div style={{ fontSize: 12, color: '#8a8a9a' }} contentEditable suppressContentEditableWarning>@onlyfanscreators</div>
              </div>
            </div>
            <div className="coll-fan-actions">
              <button className="coll-fan-btn outline" contentEditable suppressContentEditableWarning>ABONNÉ</button>
              <button className="coll-fan-btn outline" contentEditable suppressContentEditableWarning>GRATUITEMENT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
