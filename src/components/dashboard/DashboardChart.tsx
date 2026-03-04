import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardConfig } from '@/types/dashboard';

interface Props {
  config: DashboardConfig;
}

export function DashboardChart({ config }: Props) {
  return (
    <div className="mt-6 rounded-xl p-4" style={{ background: '#141428', border: '1px solid #1e1e3a' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium" style={{ color: '#fff' }}>Earnings Overview</h3>
        <div className="flex gap-2">
          {['7D', '30D', '90D', 'ALL'].map((period, i) => (
            <button
              key={period}
              className="px-3 py-1 rounded-md text-xs font-medium transition-colors"
              style={{
                background: i === 1 ? '#00AFF0' : 'transparent',
                color: i === 1 ? '#fff' : '#8a8a9a',
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={config.chartData}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00AFF0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00AFF0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="name" tick={{ fill: '#8a8a9a', fontSize: 12 }} axisLine={{ stroke: '#1e1e3a' }} />
            <YAxis tick={{ fill: '#8a8a9a', fontSize: 12 }} axisLine={{ stroke: '#1e1e3a' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#1a1a2e', border: '1px solid #1e1e3a', borderRadius: 8, color: '#fff' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Earnings']}
            />
            <Area type="monotone" dataKey="earnings" stroke="#00AFF0" fill="url(#earningsGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
