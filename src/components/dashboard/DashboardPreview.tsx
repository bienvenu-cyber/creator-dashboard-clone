import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Camera, Download } from 'lucide-react';
import { DashboardConfig } from '@/types/dashboard';
import { DashboardStats } from './DashboardStats';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardChart } from './DashboardChart';

interface Props {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

export function DashboardPreview({ config, onConfigChange }: Props) {
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#1a1a2e',
    });
    const link = document.createElement('a');
    link.download = `dashboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Aperçu du Dashboard</h2>
        <Button onClick={handleExport} size="sm" className="gap-2">
          <Camera className="w-4 h-4" /> Capturer
        </Button>
      </div>

      <div
        ref={dashboardRef}
        className="of-dashboard rounded-xl overflow-hidden border border-border/50 shadow-2xl"
        style={{ background: '#1a1a2e', color: '#fff' }}
      >
        <div className="flex">
          {/* Sidebar */}
          <DashboardSidebar config={config} />

          {/* Main Content */}
          <div className="flex-1 p-6" style={{ background: '#0d0d1a' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold" style={{ color: '#fff' }}>Statements</h1>
                <p className="text-sm" style={{ color: '#8a8a9a' }}>Your earnings overview</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#00AFF0', color: '#fff' }}>
                  Current Period
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <DashboardStats config={config} onConfigChange={onConfigChange} />

            {/* Chart */}
            <DashboardChart config={config} />

            {/* Recent Activity */}
            <div className="mt-6 rounded-xl p-4" style={{ background: '#141428' }}>
              <h3 className="text-sm font-medium mb-3" style={{ color: '#fff' }}>Recent Activity</h3>
              <div className="space-y-2">
                {(config.recentActivity || [
                  { type: 'Subscription', amount: '$15.00', time: '2 min ago' },
                  { type: 'Tip', amount: '$50.00', time: '15 min ago' },
                  { type: 'Message', amount: '$5.00', time: '1 hour ago' },
                ]).map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#1e1e3a' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                        style={{ background: activity.type === 'Tip' ? '#00AFF020' : '#ffffff10', color: activity.type === 'Tip' ? '#00AFF0' : '#8a8a9a' }}>
                        {activity.type[0]}
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: '#fff' }}>{activity.type}</p>
                        <p className="text-xs" style={{ color: '#8a8a9a' }}>{activity.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#00d97e' }}>+{activity.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
