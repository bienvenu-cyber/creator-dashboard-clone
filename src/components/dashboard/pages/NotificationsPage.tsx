import { useState } from 'react';

const notifData = [
  { name: 'Sophie M.', initials: 'SM', text: 'subscribed to you', time: '2 minutes ago', color: '#e91e8c', type: 'subscriptions', unread: true },
  { name: 'BigTipper99', initials: 'BT', text: 'sent you a $50.00 tip', time: '15 minutes ago', color: '#ff6b35', type: 'tips', unread: true },
  { name: 'JakeXO', initials: 'JX', text: 'liked your post "New exclusive content"', time: '1 hour ago', color: '#00aff0', type: 'purchases', unread: false },
  { name: 'Lisa_Fan', initials: 'LF', text: 'sent you a message', time: '3 hours ago', color: '#7b2ff7', type: 'subscriptions', unread: true },
  { name: 'Mark_VIP', initials: 'MV', text: 'renewed their subscription for 3 months', time: '5 hours ago', color: '#2ecc71', type: 'subscriptions', unread: false },
  { name: 'Camille', initials: 'CA', text: 'commented: "Wow incredible! 🔥"', time: 'Yesterday, 10:14pm', color: '#e74c3c', type: 'comments', unread: false },
  { name: 'OnlyFans', initials: 'OF', text: 'Your payment of $916.48 has been processed successfully', time: 'Yesterday, 6:00pm', color: '#00aff0', type: 'purchases', unread: false },
  { name: 'Roxy_K', initials: 'RK', text: 'purchased your PPV post for $25.00', time: '2 days ago', color: '#f39c12', type: 'purchases', unread: false },
  { name: 'DevXPro', initials: 'DP', text: 'sent you a $100.00 tip with message: "Top content!"', time: '3 days ago', color: '#3498db', type: 'tips', unread: false },
  { name: 'Sophie M.', initials: 'SM', text: 'tagged your post in their story', time: '4 days ago', color: '#e91e8c', type: 'tags', unread: false },
];

const filters = [
  { key: 'all', label: 'All' },
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'purchases', label: 'Purchases' },
  { key: 'tips', label: 'Tips' },
  { key: 'tags', label: 'Tags' },
  { key: 'comments', label: 'Comments' },
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
          <input type="text" placeholder="Search users or posts..." />
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
