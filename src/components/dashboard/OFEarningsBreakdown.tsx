import { DashboardConfig } from '@/types/dashboard';
import { EditableField } from './EditableField';

interface Props {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

export function OFEarningsBreakdown({ config, onConfigChange }: Props) {
  const items = [
    { label: 'Subscriptions', value: config.subscriptionEarnings, key: 'subscriptionEarnings' as const, color: '#00AFF0', pct: 69 },
    { label: 'Tips', value: config.tipEarnings, key: 'tipEarnings' as const, color: '#10b981', pct: 18 },
    { label: 'Messages', value: config.messageEarnings, key: 'messageEarnings' as const, color: '#8b5cf6', pct: 10 },
    { label: 'Referrals', value: config.referralEarnings, key: 'referralEarnings' as const, color: '#f97316', pct: 3 },
  ];

  return (
    <div
      className="rounded-xl p-4 lg:p-5"
      style={{ background: '#141428', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h3 className="text-[14px] font-semibold mb-4" style={{ color: '#fff' }}>Earnings Breakdown</h3>

      {/* Progress bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-4">
        {items.map((item) => (
          <div key={item.key} style={{ width: `${item.pct}%`, background: item.color }} />
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-[12px]" style={{ color: '#8e8e9a' }}>{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <EditableField
                value={item.value}
                onChange={(v) => onConfigChange({ ...config, [item.key]: v })}
                className="text-[13px] font-semibold"
                style={{ color: '#fff' }}
              />
              <span className="text-[11px] w-8 text-right" style={{ color: '#6b6b80' }}>{item.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
