import { DashboardConfig } from '@/types/dashboard';
import { EditableField } from './EditableField';

interface Props {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const typeColors: Record<string, string> = {
  Subscription: '#00AFF0',
  Tip: '#10b981',
  Message: '#8b5cf6',
};

const typeIcons: Record<string, string> = {
  Subscription: '♻',
  Tip: '⭐',
  Message: '💬',
};

export function OFRecentActivity({ config, onConfigChange }: Props) {
  const updateActivity = (index: number, field: string, value: string) => {
    const updated = [...config.recentActivity];
    updated[index] = { ...updated[index], [field]: value };
    onConfigChange({ ...config, recentActivity: updated });
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#141428', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="px-4 lg:px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-[14px] font-semibold" style={{ color: '#fff' }}>Recent Activity</h3>
        <button className="text-[12px] font-medium" style={{ color: '#00AFF0' }}>View all</button>
      </div>

      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {config.recentActivity.map((activity, i) => {
          const color = typeColors[activity.type] || '#6b6b80';
          const icon = typeIcons[activity.type] || '📋';
          return (
            <div
              key={i}
              className="flex items-center justify-between px-4 lg:px-5 py-3 hover:bg-white/[0.02] transition-colors"
              style={{ borderBottom: i < config.recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] flex-shrink-0"
                  style={{ background: `${color}15` }}
                >
                  {icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium" style={{ color: '#fff' }}>{activity.type}</span>
                    <EditableField
                      value={activity.username}
                      onChange={(v) => updateActivity(i, 'username', v)}
                      className="text-[11px]"
                      style={{ color: '#00AFF0' }}
                    />
                  </div>
                  <EditableField
                    value={activity.time}
                    onChange={(v) => updateActivity(i, 'time', v)}
                    className="text-[11px]"
                    style={{ color: '#6b6b80' }}
                  />
                </div>
              </div>
              <EditableField
                value={`+${activity.amount}`}
                onChange={(v) => updateActivity(i, 'amount', v.replace('+', ''))}
                className="text-[14px] font-semibold"
                style={{ color: '#10b981' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
