import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardPreview } from '@/components/dashboard/DashboardPreview';
import { DashboardEditor } from '@/components/dashboard/DashboardEditor';
import { DashboardConfig, defaultDashboardConfig } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Save, LogOut, Zap, FolderOpen, Plus, Trash2, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    loadDashboards();
  }, [user]);

  const loadDashboards = async () => {
    const { data } = await supabase.from('dashboards').select('*').order('updated_at', { ascending: false });
    if (data) setSavedDashboards(data.map(d => ({ ...d, config: d.config as unknown as DashboardConfig })));
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
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="h-14 border-b border-border/50 bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm" style={{ fontFamily: 'Space Grotesk' }}>GhostDash</span>
          <span className="text-xs text-muted-foreground">/ Générateur</span>
        </div>
        <div className="flex items-center gap-2">
          {!hasActiveSubscription && !isAdmin && (
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => navigate('/subscribe')}>
              <Crown className="w-3 h-3" /> Activer Premium
            </Button>
          )}
          {isAdmin && (
            <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => navigate('/admin')}>
              Admin
            </Button>
          )}
          <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={signOut}>
            <LogOut className="w-3 h-3" /> Déconnexion
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left Panel - Editor */}
        <div className="w-[340px] border-r border-border/50 bg-card p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Input value={dashboardName} onChange={e => setDashboardName(e.target.value)} className="h-8 text-sm font-medium" />
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1 shrink-0">
              <Save className="w-3 h-3" /> {saving ? '...' : 'Sauver'}
            </Button>
          </div>

          <div className="flex gap-1 mb-4">
            <Button size="sm" variant="outline" className="gap-1 text-xs flex-1" onClick={newDashboard}>
              <Plus className="w-3 h-3" /> Nouveau
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1 text-xs flex-1">
                  <FolderOpen className="w-3 h-3" /> Charger ({savedDashboards.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mes Dashboards</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {savedDashboards.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucun dashboard sauvegardé</p>
                  ) : savedDashboards.map(d => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50">
                      <button className="text-left flex-1" onClick={() => loadDashboard(d)}>
                        <p className="text-sm font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
                      </button>
                      <Button size="sm" variant="ghost" onClick={() => deleteDashboard(d.id)}>
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <DashboardEditor config={config} onConfigChange={setConfig} />
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 p-6 overflow-auto bg-muted/30">
          <DashboardPreview config={config} onConfigChange={setConfig} />
        </div>
      </div>
    </div>
  );
}
