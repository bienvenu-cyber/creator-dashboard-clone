import { DashboardConfig } from '@/types/dashboard';
import { EditableField } from './EditableField';
import { Wallet, Clock, Calendar, DollarSign, Users, TrendingUp, Star, MessageSquare } from 'lucide-react';

interface Props {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

export function OFStatsCards({ config, onConfigChange }: Props) {
  const mainCards = [
    {
      icon: Wallet,
      label: 'Current Balance',
      value: config.balance,
      key: 'balance' as const,
      color: '#00AFF0',
      sublabel: 'Available for withdrawal',
    },
    {
      icon: Clock,
      label: 'Pending Balance',
      value: config.pendingBalance,
      key: 'pendingBalance' as const,
      color: '#f59e0b',
      sublabel: 'Processing',
    },
    {
      icon: Calendar,
      label: 'Next Payment',
      value: config.nextPayment,
      key: 'nextPayment' as const,
      color: '#10b981',
      sublabel: config.nextPaymentDate,
    },
  ];

  const statCards = [
    { icon: Users, label: 'Active Subscribers', value: config.subscribers, key: 'subscribers' as const, color: '#8b5cf6' },
    { icon: TrendingUp, label: 'Total Fans', value: config.fans, key: 'fans' as const, color: '#ec4899' },
    { icon: Star, label: 'Tips Earned', value: config.tips, key: 'tips' as const, color: '#10b981' },
    { icon: MessageSquare, label: 'Message Earnings', value: config.messages, key: 'messages' as const, color: '#6366f1' },
    { icon: DollarSign, label: 'Referral Earnings', value: config.referrals, key: 'referrals' as const, color: '#f97316' },
    { icon: DollarSign, label: 'Total Earnings', value: config.totalEarnings, key: 'totalEarnings' as const, color: '#00AFF0' },
  ];

  return (
    <div className="space-y-4">
      {/* Main balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {mainCards.map((card) => (
          <div
            key={card.key}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: '#141428', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${card.color}15` }}
              >
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              <span className="text-[12px] font-medium" style={{ color: '#8e8e9a' }}>{card.label}</span>
            </div>
            <EditableField
              value={card.value}
              onChange={(v) => onConfigChange({ ...config, [card.key]: v })}
              className="text-[22px] sm:text-[24px] font-bold block"
              style={{ color: '#fff' }}
              tag="p"
            />
            <p className="text-[11px] mt-1" style={{ color: '#4a4a5a' }}>{card.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.key}
            className="rounded-xl p-3.5"
            style={{ background: '#141428', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              <span className="text-[10px] font-medium truncate" style={{ color: '#6b6b80' }}>{stat.label}</span>
            </div>
            <EditableField
              value={stat.value}
              onChange={(v) => onConfigChange({ ...config, [stat.key]: v })}
              className="text-[16px] font-bold block"
              style={{ color: '#fff' }}
              tag="p"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
