import { useState } from 'react';

const feedPosts = [
  { av: 'OF', color: '#00aff0', name: 'OnlyFans', verified: true, handle: '@onlyfans', time: '5 hours ago', text: 'Ready to multiply your houseplants? @surfwithclaire walks you through the easiest pothos propagation ever—perfect for beginners and plant lovers alike. 🌿✨', hasVideo: true, likes: 1842, comments: 94 },
  { av: 'WD', color: 'linear-gradient(135deg,#00aff0,#0095cc)', name: 'Willy denz', verified: true, handle: '@u495354766', time: '3 days ago', text: "New post available for my subscribers! 🔥 Thank you for your continued support, it means a lot. Don't hesitate to share and leave a comment 💬", hasVideo: false, likes: 312, comments: 28 },
  { av: 'OF', color: '#ff6b35', name: 'OnlyFans Creators', verified: true, handle: '@creators', time: '5 days ago', text: "💡 Tip of the day: Post during peak hours (6pm–10pm) to maximize your visibility. Creators who post consistently see 3x faster growth.", hasVideo: false, likes: 4721, comments: 382 },
  { av: 'WD', color: 'linear-gradient(135deg,#00aff0,#0095cc)', name: 'Willy denz', verified: true, handle: '@u495354766', time: '1 week ago', text: 'Thank you to all my fans for this incredible first month! 🙏 I\'m preparing exclusive content coming very soon. Stay tuned 🎉', hasVideo: false, likes: 156, comments: 42 },
];

export function HomePage() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="home-layout">
      <div className="home-center">
        {/* Header */}
        <div className="home-header">
          <span className="home-header-title">HOME</span>
          <div style={{ display: 'flex', gap: 12, color: '#888' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </div>
        </div>

        {/* Composer */}
        <div className="home-composer">
          <div className="home-composer-input" contentEditable suppressContentEditableWarning data-placeholder="Compose new post..." />
          <div className="home-composer-tools">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#aaa' }}>Aa</span>
          </div>
        </div>

        {/* Filters */}
        <div className="home-filter-row">
          <div className={`home-filter-chip ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All</div>
          <div className={`home-filter-chip ${activeFilter === 'edit' ? 'active' : ''}`} onClick={() => setActiveFilter('edit')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </div>
        </div>

        {/* Story */}
        <div className="home-story-row">
          <div className="home-story-add">
            <div className="home-story-av">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00aff0,#0095cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>WD</div>
            </div>
            <div style={{ position: 'absolute', top: 8, left: 8, width: 20, height: 20, background: '#00aff0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: '#555', textAlign: 'center', fontWeight: 500 }}>Add to<br/>Story</div>
          </div>
        </div>

        {/* Feed */}
        {feedPosts.map((p, i) => (
          <div key={i} className="feed-post">
            <div className="feed-post-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="feed-post-av" style={{ background: p.color }}>{p.av}</div>
                <div>
                  <div className="feed-post-name">
                    {p.name}
                    {p.verified && <svg className="feed-post-verified" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                  </div>
                  <div className="feed-post-handle">{p.handle} · <span className="feed-post-time">{p.time}</span></div>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </div>
            <div className="feed-post-text" contentEditable suppressContentEditableWarning>{p.text}</div>
            {p.hasVideo && (
              <div className="feed-post-media">
                <div className="feed-post-play">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
            )}
            <div className="feed-post-actions">
              <button className="feed-act">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span contentEditable suppressContentEditableWarning>{p.likes}</span>
              </button>
              <button className="feed-act">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span contentEditable suppressContentEditableWarning>{p.comments}</span>
              </button>
              <button className="feed-act">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right sidebar */}
      <div className="home-right">
        <div className="profile-search-box" style={{ marginBottom: 14 }}>
          <input type="text" placeholder="Search users or posts..." />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <div className="profile-widget" style={{ marginBottom: 14 }}>
          <div className="profile-widget-body">
            <div className="abonnement-row">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8a8a9a', letterSpacing: '.5px', marginBottom: 6 }}>SUBSCRIPTION</div>
                <div className="abonnement-label">Subscription price and promotions</div>
                <div className="abonnement-sub">Free subscription</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
        <div className="profile-widget" style={{ marginBottom: 14 }}>
          <div className="profile-widget-body">
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8a8a9a', letterSpacing: '.5px', marginBottom: 8 }}>SCHEDULED EVENTS</div>
            <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6, marginBottom: 14 }}>You can now schedule posts, messages, and streams to boost your online presence</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div style={{ fontSize: 12, color: '#bbb', marginTop: 8 }}>You have no scheduled events.</div>
            </div>
          </div>
        </div>
        <div className="ppv-widget">
          <div className="ppv-title">P-P-V MESSAGES</div>
          <div className="ppv-illustration">
            <svg width="100" height="80" viewBox="0 0 100 80">
              <rect x="15" y="20" width="50" height="38" rx="4" fill="#4a9fe8" opacity=".8"/>
              <polygon points="15,20 40,42 65,20" fill="#2980b9"/>
              <circle cx="72" cy="28" r="10" fill="#00c853" opacity=".9"/>
              <text x="69" y="32" fontSize="12" fill="white" fontWeight="bold">$</text>
              <circle cx="85" cy="50" r="8" fill="#00aff0" opacity=".7"/>
              <text x="82" y="54" fontSize="11" fill="white" fontWeight="bold">$</text>
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#00aff0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#00aff0' }}>OnlyFans</span>
          </div>
        </div>
      </div>
    </div>
  );
}
