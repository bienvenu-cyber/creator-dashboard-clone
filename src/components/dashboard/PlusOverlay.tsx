import { useState } from 'react';

interface Props {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function PlusOverlay({ onClose, onNavigate }: Props) {
  const [darkMode, setDarkMode] = useState(false);

  const nav = (page: string) => { onNavigate(page); onClose(); };

  return (
    <div className="plus-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="plus-panel">
        <div className="plus-profile">
          <div className="plus-av">WD</div>
          <div>
            <div className="plus-name" contentEditable suppressContentEditableWarning>Willy Denz</div>
            <div className="plus-handle" contentEditable suppressContentEditableWarning>@u495354766</div>
            <div className="plus-stats">
              <span><strong contentEditable suppressContentEditableWarning>0</strong> Fans</span>
              <span style={{ marginLeft: 14 }}><strong contentEditable suppressContentEditableWarning>1</strong> Abonnements</span>
            </div>
          </div>
        </div>

        <div className="plus-menu">
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} label="Mon profil" onClick={() => nav('profile')} />
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} label="Mes références" />
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="8" width="20" height="14" rx="2"/><circle cx="7.5" cy="14" r="1.5"/><polyline points="2 18 7 13 11 16 14 13 22 19"/></svg>} label="Collections" onClick={() => nav('collections')} />
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} label="File d'attente" onClick={() => nav('queue')} />
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><rect x="14" y="13" width="7" height="6" rx="1.2" fill="white"/><path d="M16 13v-1.5a2 2 0 0 1 4 0V13"/></svg>} label="Dossier sécurisé" onClick={() => nav('vault')} />
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>} label="Paramètres" />
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/></svg>} label="Déclarations" onClick={() => nav('declarations')} />
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} label="Statistiques" onClick={() => nav('statistics')} />
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} label="Formulaires de libération" />
        </div>

        <div className="plus-divider" />
        <div className="plus-menu">
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} label="Vos cartes (pour vous abonner)" />
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>} label="Ajouter une banque (pour gagner)" />
        </div>

        <div className="plus-divider" />
        <div className="plus-menu">
          <MenuItem icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} label="Aide et support" />
          <div className="plus-menu-item plus-toggle-row" onClick={() => setDarkMode(!darkMode)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              Mode sombre
            </div>
            <div className={`toggle-switch ${darkMode ? 'on' : ''}`}>
              <div className="toggle-knob" />
            </div>
          </div>
        </div>

        <div className="plus-divider" />
        <div className="plus-menu">
          <div className="plus-menu-item plus-logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Déconnexion
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <div className="plus-menu-item" onClick={onClick}>
      <span style={{ width: 18, height: 18, flexShrink: 0 }}>{icon}</span>
      {label}
    </div>
  );
}
