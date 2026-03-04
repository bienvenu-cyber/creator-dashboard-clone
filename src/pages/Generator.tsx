import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardConfig, defaultDashboardConfig } from '@/types/dashboard';
import { toast } from 'sonner';
import { OFSidebar } from '@/components/dashboard/OFSidebar';
import { OFMobileNav } from '@/components/dashboard/OFMobileNav';
import { OFTopBar } from '@/components/dashboard/OFTopBar';
import { OFStatsCards } from '@/components/dashboard/OFStatsCards';
import { OFChart } from '@/components/dashboard/OFChart';
import { OFEarningsBreakdown } from '@/components/dashboard/OFEarningsBreakdown';
import { OFRecentActivity } from '@/components/dashboard/OFRecentActivity';
import { OFToolbar } from '@/components/dashboard/OFToolbar';
import html2canvas from 'html2canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface SavedDashboard {
  id: string;
  name: string;
  config: DashboardConfig;
  created_at: string;
}

export default function Generator() {
  const { user, signOut, hasActiveSubscription, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<DashboardConfig>(defaultDashboardConfig);
  const [dashboardName, setDashboardName] = useState('Mon Dashboard');
  const [savedDashboards, setSavedDashboards] = useState<SavedDashboard[]>([]);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    loadDashboards();
  }, [user]);

  const loadDashboards = async () => {
    const { data } = await supabase.from('dashboards').select('*').order('updated_at', { ascending: false });
    if (data) setSavedDashboards(data.map(d => ({ ...d, config: d.config as unknown as DashboardConfig })));
  };

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0f0f1a',
    });
    const link = document.createElement('a');
    link.download = `onlyfans-dashboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Screenshot exported!');
  };

  const handleSave = async () => {
    if (!hasActiveSubscription && !isAdmin) {
      toast.error('Abonnement requis pour sauvegarder.');
      return;
    }
    setSaving(true);
    try {
      if (currentDashboardId) {
        await supabase.from('dashboards').update({ name: dashboardName, config: config as any }).eq('id', currentDashboardId);
        toast.success('Dashboard mis à jour !');
      } else {
        const { data } = await supabase.from('dashboards').insert({ name: dashboardName, config: config as any, user_id: user!.id }).select().single();
        if (data) setCurrentDashboardId(data.id);
        toast.success('Dashboard sauvegardé !');
      }
      loadDashboards();
    } catch {
      toast.error('Erreur lors de la sauvegarde.');
    }
    setSaving(false);
  };

  const loadDashboard = (dashboard: SavedDashboard) => {
    setConfig(dashboard.config);
    setDashboardName(dashboard.name);
    setCurrentDashboardId(dashboard.id);
    setLoadDialogOpen(false);
    toast.success(`Dashboard "${dashboard.name}" chargé`);
  };

  const deleteDashboard = async (id: string) => {
    await supabase.from('dashboards').delete().eq('id', id);
    if (currentDashboardId === id) {
      setCurrentDashboardId(null);
      setConfig(defaultDashboardConfig);
      setDashboardName('Mon Dashboard');
    }
    loadDashboards();
    toast.success('Dashboard supprimé');
  };

  const newDashboard = () => {
    setConfig(defaultDashboardConfig);
    setDashboardName('Mon Dashboard');
    setCurrentDashboardId(null);
    toast.success('Nouveau dashboard créé');
  };

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen flex"
      style={{ background: '#0f0f1a', color: '#fff', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Sidebar - desktop */}
      <OFSidebar config={config} onConfigChange={setConfig} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <OFTopBar config={config} onConfigChange={setConfig} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
          <div className="max-w-[1200px] mx-auto space-y-4 lg:space-y-5">
            {/* Stats */}
            <OFStatsCards config={config} onConfigChange={setConfig} />

            {/* Chart + Earnings Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
              <div className="lg:col-span-2">
                <OFChart config={config} onConfigChange={setConfig} />
              </div>
              <div>
                <OFEarningsBreakdown config={config} onConfigChange={setConfig} />
              </div>
            </div>

            {/* Recent Activity */}
            <OFRecentActivity config={config} onConfigChange={setConfig} />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <OFMobileNav />

      {/* Toolbar FAB */}
      <OFToolbar
        onExport={handleExport}
        onSave={handleSave}
        onLoad={() => setLoadDialogOpen(true)}
        onNew={newDashboard}
        onSignOut={signOut}
        onAdmin={isAdmin ? () => navigate('/admin') : undefined}
        onSubscribe={!hasActiveSubscription && !isAdmin ? () => navigate('/subscribe') : undefined}
        saving={saving}
        isAdmin={isAdmin}
        hasSubscription={hasActiveSubscription}
      />

      {/* Load Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent style={{ background: '#1b1b2f', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#fff' }}>Mes Dashboards</DialogTitle>
          </DialogHeader>
          <div className="mb-3">
            <Input
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="Nom du dashboard"
              className="text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {savedDashboards.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#6b6b80' }}>Aucun dashboard sauvegardé</p>
            ) : savedDashboards.map(d => (
              <div
                key={d.id}
                className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: currentDashboardId === d.id ? 'rgba(0,175,240,0.1)' : 'transparent' }}
              >
                <button className="text-left flex-1" onClick={() => loadDashboard(d)}>
                  <p className="text-sm font-medium" style={{ color: '#fff' }}>{d.name}</p>
                  <p className="text-xs" style={{ color: '#6b6b80' }}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
                </button>
                <Button size="sm" variant="ghost" onClick={() => deleteDashboard(d.id)}>
                  <Trash2 className="w-3 h-3" style={{ color: '#ef4444' }} />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
