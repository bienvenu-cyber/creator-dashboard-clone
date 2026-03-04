import { useState } from 'react';

const collItems = [
  { name: 'Following', sub: '1 user · 25 posts', active: true },
  { name: 'Fans', sub: 'empty' },
  { name: 'Friends', sub: 'empty' },
  { name: 'Muted', sub: 'empty' },
  { name: 'Recent (last 24 hours)', sub: 'No new subscribers in the last 24 hours...' },
  { name: 'Bookmarked', sub: 'empty' },
  { name: 'Restricted', sub: 'empty' },
  { name: 'Blocked', sub: 'empty' },
];

export function CollectionsPage() {
  const [activeItem, setActiveItem] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [activeMidTab, setActiveMidTab] = useState(0);

  return (
    <div className="coll-layout">
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
          {['USER LISTS', 'BOOKMARKS', 'POST TAGS'].map((t, i) => (
            <div key={i} className={`coll-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{t}</div>
          ))}
        </div>
        <div className="coll-order-row">
          <span>CUSTOM ORDER</span>
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

      <div className="coll-mid">
        <div className="coll-mid-header">
          <div className="coll-mid-title">FOLLOWING</div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div className="coll-mid-tabs">
          {['USERS', 'POSTS'].map((t, i) => (
            <div key={i} className={`coll-mid-tab ${activeMidTab === i ? 'active' : ''}`} onClick={() => setActiveMidTab(i)}>{t}</div>
          ))}
        </div>
        <div className="coll-mid-filter">
          <span>RECENT</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
        <div className="coll-status-chips">
          <div className="coll-chip active">All 1</div>
          <div className="coll-chip sel">Active 1</div>
          <div className="coll-chip">Expired 0</div>
          <div className="coll-chip">Attention required 0</div>
        </div>
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
              <button className="coll-fan-btn outline" contentEditable suppressContentEditableWarning>SUBSCRIBED</button>
              <button className="coll-fan-btn outline" contentEditable suppressContentEditableWarning>FREE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
