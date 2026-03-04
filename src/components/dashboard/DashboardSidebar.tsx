import { DashboardConfig } from '@/types/dashboard';
import { Home, BarChart3, MessageSquare, Users, Wallet, Settings, Bell, Star } from 'lucide-react';

interface Props {
  config: DashboardConfig;
}

const menuItems = [
  { icon: Home, label: 'Home', active: false },
  { icon: Bell, label: 'Notifications', active: false },
  { icon: MessageSquare, label: 'Messages', active: false },
  { icon: BarChart3, label: 'Statistics', active: true },
  { icon: Wallet, label: 'Statements', active: false },
  { icon: Users, label: 'My subscribers', active: false },
  { icon: Star, label: 'My referrals', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export function DashboardSidebar({ config }: Props) {
  return (
    <div className="w-[220px] flex-shrink-0 flex flex-col" style={{ background: '#141428', borderRight: '1px solid #1e1e3a' }}>
      {/* Logo */}
      <div className="p-4 border-b" style={{ borderColor: '#1e1e3a' }}>
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke="#00AFF0" strokeWidth="2" />
            <path d="M8 12L11 15L16 9" stroke="#00AFF0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-base font-bold" style={{ color: '#fff' }}>OnlyFans</span>
        </div>
      </div>

      {/* Profile */}
      <div className="p-4 border-b" style={{ borderColor: '#1e1e3a' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#00AFF0', color: '#fff' }}>
            {config.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#fff' }}>
              {config.displayName}
              {config.verified && (
                <span className="ml-1 text-xs" style={{ color: '#00AFF0' }}>✓</span>
              )}
            </p>
            <p className="text-xs truncate" style={{ color: '#8a8a9a' }}>{config.username}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-2">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg cursor-default transition-colors"
            style={{
              background: item.active ? '#00AFF015' : 'transparent',
              color: item.active ? '#00AFF0' : '#8a8a9a',
            }}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t" style={{ borderColor: '#1e1e3a' }}>
        <p className="text-xs" style={{ color: '#4a4a5a' }}>© 2026 OnlyFans</p>
      </div>
    </div>
  );
}
