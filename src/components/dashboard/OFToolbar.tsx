import { useState } from 'react';
import { Camera, Save, FolderOpen, Plus, Settings, X, LogOut, Crown } from 'lucide-react';
import { DashboardConfig } from '@/types/dashboard';

interface Props {
  onExport: () => void;
  onSave: () => void;
  onLoad: () => void;
  onNew: () => void;
  onSignOut: () => void;
  onAdmin?: () => void;
  onSubscribe?: () => void;
  saving: boolean;
  isAdmin: boolean;
  hasSubscription: boolean;
}

export function OFToolbar({ onExport, onSave, onLoad, onNew, onSignOut, onAdmin, onSubscribe, saving, isAdmin, hasSubscription }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex flex-col items-end gap-2">
      {expanded && (
        <div
          className="rounded-xl p-2 flex flex-col gap-1 shadow-2xl animate-in slide-in-from-bottom-2"
          style={{ background: '#1b1b2f', border: '1px solid rgba(255,255,255,0.1)', minWidth: '160px' }}
        >
          <ToolbarBtn icon={Camera} label="Screenshot" onClick={() => { onExport(); setExpanded(false); }} />
          <ToolbarBtn icon={Save} label={saving ? 'Saving...' : 'Save'} onClick={onSave} disabled={saving} />
          <ToolbarBtn icon={FolderOpen} label="Load" onClick={onLoad} />
          <ToolbarBtn icon={Plus} label="New" onClick={onNew} />
          {isAdmin && onAdmin && <ToolbarBtn icon={Settings} label="Admin" onClick={onAdmin} />}
          {!hasSubscription && !isAdmin && onSubscribe && (
            <ToolbarBtn icon={Crown} label="Premium" onClick={onSubscribe} accent />
          )}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '2px 0' }} />
          <ToolbarBtn icon={LogOut} label="Sign Out" onClick={onSignOut} />
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        style={{ background: '#00AFF0', color: '#fff' }}
      >
        {expanded ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </button>
    </div>
  );
}

function ToolbarBtn({ icon: Icon, label, onClick, disabled, accent }: {
  icon: any; label: string; onClick: () => void; disabled?: boolean; accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors w-full text-left disabled:opacity-50"
      style={{
        color: accent ? '#00AFF0' : '#c0c0d0',
        background: 'transparent',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
