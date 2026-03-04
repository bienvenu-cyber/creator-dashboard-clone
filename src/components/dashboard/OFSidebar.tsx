import { DashboardConfig } from '@/types/dashboard';
import { EditableField } from './EditableField';
import {
  Home, Bell, MessageSquare, Bookmark, List, Users,
  BarChart3, Wallet, Archive, Clock, CreditCard, Settings, HelpCircle
} from 'lucide-react';

interface Props {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
  activeItem?: string;
}

const menuItems = [
  { icon: Home, label: 'Home', key: 'home' },
  { icon: Bell, label: 'Notifications', key: 'notifications', badge: '3' },
  { icon: MessageSquare, label: 'Messages', key: 'messages', badge: '12' },
  { icon: Bookmark, label: 'Bookmarks', key: 'bookmarks' },
  { icon: List, label: 'Lists', key: 'lists' },
  { icon: Users, label: 'My subscribers', key: 'subscribers' },
  { icon: BarChart3, label: 'Statistics', key: 'statistics' },
  { icon: Wallet, label: 'Statements', key: 'statements' },
  { icon: Archive, label: 'Vault', key: 'vault' },
  { icon: Clock, label: 'Queue', key: 'queue' },
  { icon: CreditCard, label: 'Add card', key: 'addcard' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', key: 'settings' },
  { icon: HelpCircle, label: 'Help & Support', key: 'help' },
];

export function OFSidebar({ config, onConfigChange, activeItem = 'statements' }: Props) {
  return (
    <div
      className="hidden lg:flex w-[240px] flex-shrink-0 flex-col h-full"
      style={{ background: '#1b1b2f', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#00AFF0" />
          <path d="M16 8C11.58 8 8 11.58 8 16s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.4c-3.53 0-6.4-2.87-6.4-6.4S12.47 9.6 16 9.6s6.4 2.87 6.4 6.4-2.87 6.4-6.4 6.4z" fill="#fff"/>
          <circle cx="16" cy="16" r="3" fill="#fff"/>
          <path d="M16 11v2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="text-[17px] font-bold tracking-tight" style={{ color: '#fff', fontFamily: 'Inter, sans-serif' }}>
          OnlyFans
        </span>
      </div>

      {/* Profile */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: '#00AFF0', color: '#fff' }}
          >
            {config.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <EditableField
                value={config.displayName}
                onChange={(v) => onConfigChange({ ...config, displayName: v })}
                className="text-[13px] font-semibold truncate"
                style={{ color: '#fff' }}
              />
              {config.verified && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#00AFF0">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              )}
            </div>
            <EditableField
              value={config.username}
              onChange={(v) => onConfigChange({ ...config, username: v })}
              className="text-[12px] truncate block"
              style={{ color: '#6b6b80' }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = item.key === activeItem;
          return (
            <div
              key={item.key}
              className="flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all relative"
              style={{
                color: isActive ? '#00AFF0' : '#8e8e9a',
                background: isActive ? 'rgba(0,175,240,0.08)' : 'transparent',
              }}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full" style={{ background: '#00AFF0' }} />
              )}
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="text-[13px] font-medium flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={{ background: '#00AFF0', color: '#fff' }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {bottomItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-colors"
            style={{ color: '#6b6b80' }}
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span className="text-[13px]">{item.label}</span>
          </div>
        ))}
        <div className="px-5 py-3">
          <p className="text-[11px]" style={{ color: '#3a3a4a' }}>© 2026 OnlyFans</p>
        </div>
      </div>
    </div>
  );
}
