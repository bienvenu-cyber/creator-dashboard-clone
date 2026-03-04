import { useState } from 'react';

const categories = [
  { name: 'All media', sub: 'empty' },
  { name: 'Stories', sub: 'empty' },
  { name: 'Posts', sub: 'empty' },
  { name: 'Messages', sub: 'empty' },
  { name: 'Streams', sub: 'empty' },
  { name: 'Uploads', sub: 'empty' },
];

export function VaultPage() {
  const [activeCat, setActiveCat] = useState(0);

  return (
    <div className="vault-layout">
      <div className="vault-left">
        <div className="vault-left-header">
          <div className="vault-left-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            VAULT
          </div>
          <div style={{ display: 'flex', gap: 12, color: '#888' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </div>
        <div className="vault-order-row">
          <span>DEFAULT</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </div>
        {categories.map((c, i) => (
          <div key={i} className={`vault-cat-item ${activeCat === i ? 'active' : ''}`} onClick={() => setActiveCat(i)}>
            <div>
              <div className="vault-cat-name" contentEditable suppressContentEditableWarning>{c.name}</div>
              <div className="vault-cat-sub">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="vault-right">
        <div className="vault-right-header">ALL MEDIA</div>
        <div className="vault-empty">
          <div className="vault-empty-icon">
            <svg width="80" height="80" viewBox="0 0 120 100" fill="none">
              <rect x="10" y="20" width="55" height="45" rx="4" fill="#dde3ea" stroke="#c8d0d8" strokeWidth="1.5"/>
              <circle cx="28" cy="38" r="8" fill="#b8c4ce"/>
              <rect x="50" y="10" width="55" height="45" rx="4" fill="#e8edf2" stroke="#d0d8e0" strokeWidth="1.5"/>
              <rect x="35" y="48" width="50" height="40" rx="4" fill="#dde3ea" stroke="#c8d0d8" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="vault-empty-text">This category is empty</div>
        </div>
      </div>
    </div>
  );
}
