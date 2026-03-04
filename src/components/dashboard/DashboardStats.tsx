import { DashboardConfig } from '@/types/dashboard';
import { DollarSign, Users, MessageSquare, TrendingUp, Wallet, Star } from 'lucide-react';

interface Props {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

export function DashboardStats({ config, onConfigChange }: Props) {
  const stats = [
    { key: 'balance' as const, label: 'Balance', icon: Wallet, value: config.balance, color: '#00AFF0' },
    { key: 'pendingBalance' as const, label: 'Pending', icon: DollarSign, value: config.pendingBalance, color: '#f59e0b' },
    { key: 'subscribers' as const, label: 'Subscribers', icon: Users, value: config.subscribers, color: '#8b5cf6' },
    { key: 'fans' as const, label: 'Total Fans', icon: TrendingUp, value: config.fans, color: '#ec4899' },
    { key: 'tips' as const, label: 'Tips', icon: Star, value: config.tips, color: '#10b981' },
    { key: 'messages' as const, label: 'Messages', icon: MessageSquare, value: config.messages, color: '#6366f1' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="rounded-xl p-4 transition-all"
          style={{ background: '#141428', border: '1px solid #1e1e3a' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15` }}>
              <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
            </div>
            <span className="text-xs" style={{ color: '#8a8a9a' }}>{stat.label}</span>
          </div>
          <p className="text-lg font-bold" style={{ color: '#fff' }}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
