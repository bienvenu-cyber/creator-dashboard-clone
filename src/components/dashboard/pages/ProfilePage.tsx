import { useState } from 'react';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="profile-page-wrap">
      <div className="profile-main-col">
        <div className="profile-cover-new" />
        <div style={{ background: '#fff', flex: 1 }}>
          <div className="profile-header-row">
            <div className="profile-av-new">WD</div>
            <div className="profile-header-actions">
              <button className="profile-edit-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                MODIFIEZ LE PROFIL
              </button>
              <div className="profile-share-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </div>
            </div>
          </div>

          <div className="profile-name-row">
            <span className="profile-name-new" contentEditable suppressContentEditableWarning>Willy denz</span>
            <svg className="profile-verified" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>

          <div className="profile-handle-status">
            <span contentEditable suppressContentEditableWarning>@u495354766</span>
            <span>·</span>
            <div className="profile-status-dot" />
            <span className="profile-status-text">Disponible</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>

          <div className="profile-bio-new" contentEditable suppressContentEditableWarning>its denz</div>

          <button className="profile-social-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            AJOUTER DES LIENS SOCIAUX
          </button>

          {/* Stories */}
          <div className="profile-stories-row">
            <div className="profile-story-item">
              <div className="profile-story-thumb">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b0b8c4" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><polyline points="12 8 12 12 14 14"/></svg>
                <div style={{ position: 'absolute', bottom: 4, left: 4 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#00aff0,#0095cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700, border: '2px solid #fff' }}>WD</div>
                </div>
              </div>
              <div className="profile-story-label">Archive de<br/>story</div>
            </div>
            <div className="profile-story-item">
              <div className="profile-story-thumb" style={{ border: '2px dashed #ccc', background: '#f9f9f9' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00aff0" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <div className="profile-story-label">Créer un<br/>highlight</div>
            </div>
          </div>

          {/* Subscription */}
          <div className="profile-sub-section">
            <div>
              <div className="profile-sub-label">ABONNEMENT</div>
              <div className="profile-sub-value">Prix d'abonnement et promotions</div>
              <div className="profile-sub-sub">Abonnement gratuit</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>

          {/* Tabs */}
          <div className="profile-tabs-new">
            {['PAS DE POSTS', 'NON MÉDIAS'].map((t, i) => (
              <div key={i} className={`profile-tab-new ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>{t}</div>
            ))}
          </div>
          <div className="profile-empty-posts">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            <div style={{ color: '#00aff0', fontWeight: 600, cursor: 'pointer' }}>CRÉER UNE NOUVELLE PUBLICATION</div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="profile-right-col">
        <div className="profile-search-box">
          <input type="text" placeholder="Rechercher la publication de l'utilisateur" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>

        <div className="profile-widget">
          <div className="profile-widget-header">
            <span className="profile-widget-title">SPOTIFY</span>
          </div>
          <div className="profile-widget-body">
            <button className="spotify-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="10" fill="none"/><path d="M8 12.5c2.7-1.4 5.6-1.7 8.3-.7M7 9.3c3.3-1.7 7-2 10.3-.8M9 15.6c2-1 4.2-1.3 6.3-.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
              SE CONNECTER AVEC SPOTIFY
            </button>
          </div>
        </div>

        <div className="profile-widget" style={{ marginBottom: 14 }}>
          <div className="profile-widget-body">
            <div className="abonnement-row">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8a8a9a', letterSpacing: '.5px', marginBottom: 6 }}>ABONNEMENT</div>
                <div className="abonnement-label">Prix d'abonnement et promotions</div>
                <div className="abonnement-sub">Abonnement gratuit</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
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
            </svg>
          </div>
        </div>
        <div className="profile-footer-links">
          <span>Privacy</span><span>·</span><span>Cookie Notice</span><span>·</span><span>Terms of Service</span>
        </div>
      </div>
    </div>
  );
}
