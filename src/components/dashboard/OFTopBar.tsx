import { DashboardConfig } from '@/types/dashboard';
import { Bell, Search } from 'lucide-react';

interface Props {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

export function OFTopBar({ config, onConfigChange }: Props) {
  return (
    <div
      className="flex items-center justify-between px-4 lg:px-6 h-[56px] flex-shrink-0"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Left: page title */}
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mr-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#00AFF0" />
            <circle cx="16" cy="16" r="5" fill="#fff"/>
          </svg>
        </div>
        <div>
          <h1 className="text-[16px] lg:text-[18px] font-semibold" style={{ color: '#fff' }}>Statements</h1>
          <p className="text-[11px] lg:text-[12px]" style={{ color: '#6b6b80' }}>Your earnings overview</p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Search className="w-3.5 h-3.5" style={{ color: '#6b6b80' }} />
          <span className="text-[12px]" style={{ color: '#6b6b80' }}>Search...</span>
        </div>
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <Bell className="w-4 h-4" style={{ color: '#8e8e9a' }} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: '#00AFF0', color: '#fff' }}>3</span>
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ background: '#00AFF0', color: '#fff' }}
        >
          {config.displayName.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
