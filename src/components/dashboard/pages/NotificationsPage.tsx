import { useState } from 'react';

const notifData = [
  { name: 'Sophie M.', initials: 'SM', text: "s'est abonnée à vous", time: 'il y a 2 minutes', color: '#e91e8c', type: 'abonnements', unread: true },
  { name: 'BigTipper99', initials: 'BT', text: 'vous a envoyé un pourboire de $50.00', time: 'il y a 15 minutes', color: '#ff6b35', type: 'pourboire', unread: true },
  { name: 'JakeXO', initials: 'JX', text: 'a aimé votre publication "Nouveau contenu exclusif"', time: 'il y a 1 heure', color: '#00aff0', type: 'achats', unread: false },
  { name: 'Lisa_Fan', initials: 'LF', text: 'vous a envoyé un message', time: 'il y a 3 heures', color: '#7b2ff7', type: 'abonnements', unread: true },
  { name: 'Mark_VIP', initials: 'MV', text: 'a renouvelé son abonnement pour 3 mois', time: 'il y a 5 heures', color: '#2ecc71', type: 'abonnements', unread: false },
  { name: 'Camille', initials: 'CA', text: 'a commenté : "Wow incroyable ! 🔥"', time: 'Hier, 22h14', color: '#e74c3c', type: 'commentaires', unread: false },
  { name: 'OnlyFans', initials: 'OF', text: 'Votre paiement de $916.48 a été traité avec succès', time: 'Hier, 18h00', color: '#00aff0', type: 'achats', unread: false },
  { name: 'Roxy_K', initials: 'RK', text: 'a acheté votre publication PPV pour $25.00', time: 'Avant-hier', color: '#f39c12', type: 'achats', unread: false },
  { name: 'DevXPro', initials: 'DP', text: 'vous a envoyé un pourboire de $100.00 avec le message : "Contenu top !"', time: 'Il y a 3 jours', color: '#3498db', type: 'pourboire', unread: false },
  { name: 'Sophie M.', initials: 'SM', text: 'a taguée votre publication dans sa story', time: 'Il y a 4 jours', color: '#e91e8c', type: 'etiquettes', unread: false },
];

const filters = [
  { key: 'all', label: 'Tout' },
  { key: 'abonnements', label: 'Abonnements' },
  { key: 'achats', label: 'Achats' },
  { key: 'pourboire', label: 'Pourboire' },
  { key: 'etiquettes', label: 'Étiquettes' },
  { key: 'commentaires', label: 'Commentaires' },
];

export function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [readItems, setReadItems] = useState<Set<number>>(new Set());

  const filtered = activeFilter === 'all' ? notifData : notifData.filter(n => n.type === activeFilter);

  return (
    <div className="notif-layout">
      <div className="notif-center">
        <div className="notif-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <span className="notif-header-title">NOTIFICATIONS</span>
          </div>
          <div style={{ display: 'flex', gap: 14, color: '#888' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ cursor: 'pointer' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>

        <div className="notif-filters">
          {filters.map(f => (
            <div key={f.key} className={`notif-chip ${activeFilter === f.key ? 'active' : ''}`} onClick={() => setActiveFilter(f.key)}>
              {f.label}
            </div>
          ))}
        </div>

        {filtered.map((n, i) => {
          const isUnread = n.unread && !readItems.has(i);
          return (
            <div key={i} className={`notif-item ${isUnread ? 'unread' : ''}`} onClick={() => setReadItems(prev => new Set(prev).add(i))}>
              <div className="notif-av" style={{ background: n.color }}>{n.initials}</div>
              <div className="notif-body">
                <div className="notif-name" contentEditable suppressContentEditableWarning>{n.name}</div>
                <div className="notif-text">{n.text}</div>
                <div className="notif-time">{n.time}</div>
              </div>
              {isUnread && <div className="notif-dot" />}
            </div>
          );
        })}
      </div>

      <div className="home-right">
        <div className="profile-search-box" style={{ marginBottom: 14 }}>
          <input type="text" placeholder="Rechercher des utilisateurs ou des publi..." />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div className="ppv-widget">
          <div className="ppv-title">P-P-V MESSAGES</div>
          <div className="ppv-illustration">
            <svg width="100" height="80" viewBox="0 0 100 80">
              <rect x="15" y="20" width="50" height="38" rx="4" fill="#4a9fe8" opacity=".8"/>
              <polygon points="15,20 40,42 65,20" fill="#2980b9"/>
              <circle cx="72" cy="28" r="10" fill="#00c853" opacity=".9"/>
              <text x="69" y="32" fontSize="12" fill="white" fontWeight="bold">$</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
