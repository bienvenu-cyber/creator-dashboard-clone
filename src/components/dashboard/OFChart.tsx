import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardConfig } from '@/types/dashboard';

interface Props {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const periods = ['7D', '30D', '90D', '1Y', 'ALL'];

export function OFChart({ config, onConfigChange }: Props) {
  return (
    <div
      className="rounded-xl p-4 lg:p-5"
      style={{ background: '#141428', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold" style={{ color: '#fff' }}>Earnings Overview</h3>
          <p className="text-[11px] mt-0.5" style={{ color: '#6b6b80' }}>Revenue over time</p>
        </div>
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => onConfigChange({ ...config, selectedPeriod: period })}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium transition-all"
              style={{
                background: config.selectedPeriod === period ? '#00AFF0' : 'transparent',
                color: config.selectedPeriod === period ? '#fff' : '#6b6b80',
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[180px] lg:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={config.chartData}>
            <defs>
              <linearGradient id="ofGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00AFF0" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#00AFF0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b6b80', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6b6b80', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: '#1b1b2f',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                color: '#fff',
                fontSize: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Earnings']}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#00AFF0"
              fill="url(#ofGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#00AFF0', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
