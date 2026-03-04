import { useNavigate } from 'react-router-dom';

export function GhostDashLanding() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: '#fff', color: '#111', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #4169E1, #1E3A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2a10 10 0 0 0-6.88 17.23l.9-1.52A8 8 0 1 1 20 12a8 8 0 0 1-2.02 5.31l.9 1.52A10 10 0 0 0 12 2z"/><circle cx="9" cy="13" r="1.5" fill="white"/><circle cx="15" cy="13" r="1.5" fill="white"/></svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
              <span style={{ color: '#4169E1' }}>Ghost</span><span style={{ color: '#1E3A8A' }}>Dash</span>
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#features" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>Features</a>
            <a href="#stats" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>Stats</a>
            <a href="#guide" style={{ fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>Guide</a>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'linear-gradient(135deg, #4169E1, #1E3A8A)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '.3px' }}
            >
              Start Now
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 80, background: 'linear-gradient(135deg, #292929 0%, #1a1a2e 50%, #292929 100%)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px', minWidth: 300 }}>
            <h2 style={{ fontSize: 48, fontWeight: 400, lineHeight: 1.2, marginBottom: 8, color: '#fff' }}>GhostDash until you</h2>
            <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>
              <span style={{ color: '#60A5FA' }}>Make it. 👌</span>
            </h1>
            <div style={{ width: 200, height: 4, background: 'linear-gradient(90deg, #4169E1, #60A5FA)', borderRadius: 2, marginBottom: 24 }} />
            <div style={{ maxWidth: 540, background: 'rgba(255,255,255,.08)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#d1d5db', marginBottom: 12 }}>
                GhostDash lets you <strong style={{ color: '#fff' }}>instantly create realistic dashboards</strong> for the world's biggest creator platforms—including OnlyFans, MYM, Shopify, Stripe, and more.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#d1d5db' }}>
                <strong style={{ color: '#fff' }}>Win more clients. Recruit top models. Secure new partnerships.</strong> All with powerful, professional dashboard presentations.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              style={{ background: '#60A5FA', color: '#1E3A8A', border: 'none', borderRadius: 28, padding: '16px 40px', fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: '.5px', transition: 'transform .2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Get started
            </button>
          </div>
          <div style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center', minWidth: 280 }}>
            <div style={{ width: 280, height: 500, background: 'linear-gradient(180deg, #4169E1 0%, #1E3A8A 100%)', borderRadius: 30, padding: 3, boxShadow: '0 30px 80px rgba(65,105,225,.4)' }}>
              <div style={{ width: '100%', height: '100%', background: '#1a1a2e', borderRadius: 28, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #4169E1, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>GD</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>GhostDash</div>
                    <div style={{ fontSize: 10, color: '#60A5FA' }}>Dashboard Preview</div>
                  </div>
                </div>
                {[
                  { label: 'Total Earnings', val: '$12,847.50', color: '#60A5FA' },
                  { label: 'Subscribers', val: '1,247', color: '#4169E1' },
                  { label: 'Messages', val: '3,891', color: '#93C5FD' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(65,105,225,.15)', borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.val}</div>
                  </div>
                ))}
                <div style={{ flex: 1, background: 'rgba(65,105,225,.1)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8 }}>Revenue Chart</div>
                  <svg width="100%" height="60" viewBox="0 0 200 60">
                    <polyline points="0,50 30,40 60,45 90,25 120,30 150,15 180,20 200,5" fill="none" stroke="#4169E1" strokeWidth="2.5" strokeLinejoin="round"/>
                    <linearGradient id="gfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4169E1" stopOpacity=".3"/><stop offset="100%" stopColor="#4169E1" stopOpacity="0"/></linearGradient>
                    <polygon points="0,50 30,40 60,45 90,25 120,30 150,15 180,20 200,5 200,60 0,60" fill="url(#gfill)"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" style={{ background: '#292929', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', background: '#292929', borderRadius: 20, padding: '40px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Not fake statistics.</h2>
          <div style={{ width: 200, height: 4, background: 'linear-gradient(90deg, #4169E1, #60A5FA)', borderRadius: 2, margin: '0 auto 40px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { num: '200K+', label: 'Screenshots Generated', icon: '📸' },
              { num: '50K+', label: 'Active Users', icon: '👥' },
              { num: '99.9%', label: 'Uptime', icon: '⚡' },
            ].map((s, i) => (
              <div key={i} style={{ padding: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#60A5FA', marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: 14, color: '#9CA3AF' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 40, color: '#111' }}>Everything you need</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { title: 'Pixel-Perfect Dashboards', desc: 'Every detail matches the real platform—fonts, spacing, colors, and layout.', icon: '🎨' },
              { title: 'Editable Statistics', desc: 'Click any number to edit it. Change earnings, subscribers, tips—everything.', icon: '✏️' },
              { title: 'Screenshot Export', desc: 'One-click export to PNG at 2x resolution. Ready for presentations.', icon: '📷' },
              { title: 'Multiple Pages', desc: 'Full dashboard with Home, Messages, Statistics, Profile, Vault, and more.', icon: '📄' },
              { title: 'Mobile Responsive', desc: 'Looks perfect on any device. Bottom nav on mobile, sidebar on desktop.', icon: '📱' },
              { title: 'Save & Load', desc: 'Save your custom dashboards and load them anytime. Never lose your work.', icon: '💾' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: 16, padding: 28, textAlign: 'left', border: '1px solid #e5e7eb', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(65,105,225,.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#111' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px', background: '#60A5FA', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1E3A8A', marginBottom: 12 }}>Limited seats.</h2>
          <p style={{ fontSize: 15, color: '#1E3A8A', lineHeight: 1.7, marginBottom: 28, opacity: .85 }}>
            Spaces are limited! We release new seats only when current users leave. This exclusivity keeps our tool secret and powerful. Don't miss your chance.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ background: '#1E3A8A', color: '#60A5FA', border: 'none', borderRadius: 28, padding: '16px 40px', fontSize: 16, fontWeight: 800, cursor: 'pointer', letterSpacing: '.5px' }}
          >
            Get started
          </button>
        </div>
      </section>

      {/* Guide Section */}
      <section id="guide" style={{ padding: '80px 24px', background: '#292929', color: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>The Ultimate OFM/ECOM Guide (FREE)</h3>
          <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 32 }}>
            Explore the GhostDash Blog for practical guides, case studies, and expert tips on OnlyFans Management (OFM), e-commerce, and dashboards. Find everything you need to win more clients and grow your agency.
          </p>
          <button style={{ background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: 28, padding: '14px 36px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Read Articles
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#292929', borderTop: '1px solid #374151', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #4169E1, #1E3A8A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2a10 10 0 0 0-6.88 17.23l.9-1.52A8 8 0 1 1 20 12a8 8 0 0 1-2.02 5.31l.9 1.52A10 10 0 0 0 12 2z"/><circle cx="9" cy="13" r="1.5" fill="white"/><circle cx="15" cy="13" r="1.5" fill="white"/></svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>GhostDash</span>
            </div>
            <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Pioneering the industry by empowering creators, agencies and businesses with convincing data to drive success.</p>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Quick Nav</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Home', 'Blog', 'Status', 'Contact'].map(l => (
                <a key={l} href="#" style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Connect</h4>
            <p style={{ fontSize: 13, color: '#9CA3AF' }}><strong>Email:</strong> support@ghostdash.com</p>
            <a href="#" style={{ fontSize: 13, color: '#60A5FA', textDecoration: 'none' }}>Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
