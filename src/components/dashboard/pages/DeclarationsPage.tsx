import { useState } from 'react';

const declData = [
  { date: '23 mai 2025, 6h25', amt: '$152,10', fee: '$30,42', net: '$121,68', desc: 'Pourboire de Roha K', statut: 'Payé' },
  { date: '22 mai 2025, 8h55', amt: '$190,74', fee: '$38,15', net: '$152,59', desc: 'Message de Rutor K', statut: 'Payé' },
  { date: '21 mai 2025, 2h44', amt: '$260,04', fee: '$52,01', net: '$208,03', desc: 'Message de Juandir W', statut: 'Payé' },
  { date: '20 mai 2025, 23h04', amt: '$263,08', fee: '$52,62', net: '$210,46', desc: 'Message de Samantha V', statut: 'Payé' },
  { date: '19 mai 2025, 16h12', amt: '$180,00', fee: '$36,00', net: '$144,00', desc: 'Abonnement BigTipper99', statut: 'Payé' },
  { date: '18 mai 2025, 9h30', amt: '$100,00', fee: '$20,00', net: '$80,00', desc: 'Pourboire de JakeXO', statut: 'Payé' },
];

const sections = [
  { key: 'revenus', label: 'REVENUS', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { key: 'demandes', label: 'DEMANDES DE PAIEMENT', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { key: 'statistiques', label: 'STATISTIQUES SUR LES GAINS', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { key: 'retraits', label: 'RETRAITS DE PRÉLÈVEMENT', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.85"/></svg> },
  { key: 'references', label: 'RÉFÉRENCES', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
];

const gainsColors = [
  { label: 'Abonnements', color: '#00aff0' },
  { label: 'Des pourboires', color: '#7b2ff7' },
  { label: 'Publications', color: '#ff6b35' },
  { label: 'Messages', color: '#e91e8c' },
  { label: 'Références', color: '#ccc' },
  { label: 'Streams', color: '#f39c12' },
];

export function DeclarationsPage() {
  const [activeSection, setActiveSection] = useState('revenus');

  return (
    <div className="decl-layout">
      {/* Left panel */}
      <div className="decl-left">
        <div className="decl-header">
          <div className="decl-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            RELEVÉS
          </div>
          <div className="decl-help">?</div>
        </div>

        <div className="decl-alert">
          <span className="decl-alert-icon">⚠</span>
          <span>Veuillez remplir vos <a href="#">informations bancaires</a></span>
        </div>

        <div className="decl-balance-box">
          <div className="decl-balance-row">
            <span className="decl-balance-label">SOLDE COURANT</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="decl-balance-val" contentEditable suppressContentEditableWarning>$0.00</span>
              <span className="decl-balance-toggle">⌃</span>
            </div>
          </div>
          <div className="decl-pending-row">
            <span className="decl-pending-label">
              FONDS EN ATTENTE
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <span className="decl-pending-val" contentEditable suppressContentEditableWarning>$0.00</span>
          </div>
        </div>

        <select className="decl-payout-select">
          <option>Paiements manuels</option>
          <option>Paiements automatiques</option>
        </select>
        <div className="decl-payout-hint">Le montant minimum de retrait est de $20</div>
        <button className="decl-withdraw-btn">DEMANDE DE RETRAIT</button>

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

      {/* Right panel */}
      <div className="decl-right">
        {activeSection === 'revenus' && <RevenusSection />}
        {activeSection === 'demandes' && <DemandesSection />}
        {activeSection === 'statistiques' && <StatistiquesSection />}
        {activeSection === 'retraits' && <RetraitsSection />}
        {activeSection === 'references' && <ReferencesSection />}
      </div>
    </div>
  );
}

function RevenusSection() {
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">REVENUS</span>
        <span className="decl-right-sub">Date/heure affichée en heure locale (UTC+01:00)</span>
      </div>
      <div className="decl-table-header">
        <div>DATE ET HEURE</div><div>MONTANT</div><div>HONORAIRES</div><div>NET</div><div>DESCRIPTION</div><div>STATUT</div>
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

function DemandesSection() {
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">DEMANDES DE PAIEMENT</span>
        <span className="decl-right-sub">Date/heure affichée en heure locale (UTC+01:00)</span>
      </div>
      <div className="decl-table-header">
        <div>DATE ET HEURE</div><div>MONTANT</div><div>HONORAIRES</div><div>NET</div><div>STATUT</div><div></div>
      </div>
      <div className="decl-empty-state">Cette liste est vide</div>
    </>
  );
}

function StatistiquesSection() {
  const bars = [20,35,18,50,40,28,60,45,55,70,38,48,65,80,55,90,70,60,85,75,68,92,78,88,95,82,70,100,88,95];
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">STATISTIQUES SUR LES GAINS</span>
        <span className="decl-right-sub">Date/heure affichée dans le fuseau horaire UTC</span>
      </div>
      <div className="gains-period-box">
        <div className="gains-period-row">
          <span className="gains-period-label">Depuis Inception</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="gains-period-val" contentEditable suppressContentEditableWarning>$1 146,03</span>
            <span style={{ cursor: 'pointer', color: '#00aff0' }}>⌃</span>
          </div>
        </div>
        <div className="gains-chart-area">
          {bars.map((h, i) => <div key={i} className="gains-bar" style={{ height: `${h}%`, opacity: .6 }} />)}
        </div>
        <div className="gains-x-labels">
          <span>04 mars 26</span><span>04 mars 26</span><span>04 mars 26</span><span>04 mars 26</span><span>04 mars 26</span>
        </div>
        <div className="gains-date-selector">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00aff0" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          De <strong style={{ color: '#000', margin: '0 4px' }} contentEditable suppressContentEditableWarning>4 mars 2026</strong> Pour <strong style={{ color: '#000', margin: '0 4px' }} contentEditable suppressContentEditableWarning>4 mars 2026</strong>
        </div>
        {[
          { label: 'Abonnements', color: '#00aff0' },
          { label: 'Des pourboires', color: '#7b2ff7' },
          { label: 'Publications', color: '#ff6b35' },
          { label: 'Messages', color: '#e91e8c' },
          { label: 'Références', color: '#ccc' },
          { label: 'Streams', color: '#f39c12' },
        ].map((g, i) => (
          <div key={i} className="gains-line">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="gains-dot" style={{ background: g.color }} />
              {g.label}
            </div>
            <span contentEditable suppressContentEditableWarning>$0.00</span>
            <span contentEditable suppressContentEditableWarning>$0.00</span>
          </div>
        ))}
        <div className="gains-total-row">
          <span>TOTAL</span>
          <span style={{ color: '#8a8a9a', fontSize: 12 }}>BRUT <span contentEditable suppressContentEditableWarning>$0.00</span></span>
          <span>NET <span contentEditable suppressContentEditableWarning>$0.00</span></span>
        </div>
      </div>
    </>
  );
}

function RetraitsSection() {
  const bars = [20,35,18,50,40,28,60,45,55,70,38,48,65,80,55,90,70,60,85,75,68,92,78,88,95,82,70,100,88,95];
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">RETRAITS DE PRÉLÈVEMENT</span>
        <span className="decl-right-sub">Date/heure affichée dans le fuseau horaire UTC</span>
      </div>
      <div className="gains-period-box">
        <div className="gains-period-row">
          <span className="gains-period-label">Depuis Inception</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="gains-period-val" contentEditable suppressContentEditableWarning>$1 146,03</span>
          </div>
        </div>
        <div className="gains-chart-area">
          {bars.map((h, i) => <div key={i} className="gains-bar" style={{ height: `${h}%`, opacity: .6 }} />)}
        </div>
        <div className="gains-x-labels">
          <span>04 mars 26</span><span>04 mars 26</span><span>04 mars 26</span><span>04 mars 26</span><span>04 mars 26</span>
        </div>
        <div className="gains-total-row">
          <span>TOTAL</span>
          <span style={{ color: '#8a8a9a', fontSize: 12 }}>BRUT <span contentEditable suppressContentEditableWarning>$0.00</span></span>
          <span>NET <span contentEditable suppressContentEditableWarning>$0.00</span></span>
        </div>
      </div>
    </>
  );
}

function ReferencesSection() {
  return (
    <>
      <div className="decl-right-header">
        <span className="decl-right-title">RELEVÉ DES REVENUS DE RÉFÉRENCE</span>
        <span className="decl-right-sub">Date/heure affichée en heure locale (UTC+01:00)</span>
      </div>
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '10px 14px', borderBottom: '1px solid #e0e0e0', fontSize: 11, fontWeight: 600, color: '#8a8a9a', textTransform: 'uppercase' }}>
          <div>DATE ET HEURE</div><div>FACTURE</div><div>MONTANT</div><div>STATUT</div>
        </div>
        <div style={{ padding: 40, textAlign: 'center', color: '#8a8a9a', fontSize: 13 }}>Cette liste est vide</div>
      </div>
    </>
  );
}
