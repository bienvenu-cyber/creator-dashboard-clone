import { useState, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Camera, Save, FolderOpen, Plus, Settings, X, LogOut, Crown } from 'lucide-react';

import { OFSidebarNav } from '@/components/dashboard/OFSidebarNav';
import { OFMobileNav } from '@/components/dashboard/OFMobileNav';
import { PlusOverlay } from '@/components/dashboard/PlusOverlay';

interface SavedDashboard {
  id: string;
  name: string;
  config: any;
  created_at: string;
}

// Map route paths to page keys for active state
const routeToPage: Record<string, string> = {
  '/': 'home',
  '/my/notifications': 'notifications',
  '/my/chats': 'messages',
  '/my/collections/user-lists/subscribers/active': 'collections',
  '/my/vault/list/all': 'vault',
  '/my/queue': 'queue',
  '/my/statements/earnings': 'declarations',
  '/my/statistics/statements/earnings': 'statistics',
  '/my/statistics/overview/earnings': 'statistics',
  '/my/statistics/engagement/posts': 'statistics',
  '/my/statistics/reach/profile-visitors': 'statistics',
  '/my/statistics/fans/subscriptions': 'statistics',
};

export const pageToRoute: Record<string, string> = {
  home: '/',
  notifications: '/my/notifications',
  messages: '/my/chats',
  collections: '/my/collections/user-lists/subscribers/active',
  vault: '/my/vault/list/all',
  queue: '/my/queue',
  declarations: '/my/statements/earnings',
  statistics: '/my/statistics/overview/earnings',
  profile: '/u495354766',
};

export default function DashboardLayout() {
  const { user, signOut, hasActiveSubscription, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [plusOpen, setPlusOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState('My Dashboard');
  const [savedDashboards, setSavedDashboards] = useState<SavedDashboard[]>([]);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Willy denz');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Determine active page from current URL
  const activePage = location.pathname.startsWith('/u') 
    ? 'profile' 
    : routeToPage[location.pathname] || 'home';

  const navigateTo = (page: string) => {
    const route = pageToRoute[page];
    if (route) {
      navigate(route);
      setPlusOpen(false);
    }
  };

  const loadDashboards = async () => {
    const { data } = await supabase.from('dashboards').select('*').order('updated_at', { ascending: false });
    if (data) setSavedDashboards(data);
  };

  const handleExport = async () => {
    if (!dashboardRef.current) return;
    const canvas = await html2canvas(dashboardRef.current, { scale: 2, useCORS: true, backgroundColor: '#fff' });
    const link = document.createElement('a');
    link.download = `dashboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success('Screenshot exported!');
  };

  const handleSave = async () => {
    if (!user) { toast.error('Login required to save.'); return; }
    if (!hasActiveSubscription && !isAdmin) {
      toast.error('Subscription required to save.');
      return;
    }
    setSaving(true);
    try {
      const editableData: Record<string, string> = {};
      dashboardRef.current?.querySelectorAll('[contenteditable]').forEach((el, i) => {
        editableData[`field_${i}`] = (el as HTMLElement).innerText;
      });
      const config = { activePage, editableData, displayName, avatarUrl };

      if (currentDashboardId) {
        await supabase.from('dashboards').update({ name: dashboardName, config: config as any }).eq('id', currentDashboardId);
        toast.success('Dashboard updated!');
      } else {
        const { data } = await supabase.from('dashboards').insert({ name: dashboardName, config: config as any, user_id: user!.id }).select().single();
        if (data) setCurrentDashboardId(data.id);
        toast.success('Dashboard saved!');
      }
      loadDashboards();
    } catch {
      toast.error('Error saving dashboard.');
    }
    setSaving(false);
  };

  const loadDashboard = (dashboard: SavedDashboard) => {
    setDashboardName(dashboard.name);
    setCurrentDashboardId(dashboard.id);
    if (dashboard.config?.displayName) setDisplayName(dashboard.config.displayName);
    if (dashboard.config?.avatarUrl) setAvatarUrl(dashboard.config.avatarUrl);
    if (dashboard.config?.activePage) {
      const route = pageToRoute[dashboard.config.activePage];
      if (route) navigate(route);
    }
    setLoadDialogOpen(false);
    toast.success(`Dashboard "${dashboard.name}" loaded`);
  };

  const deleteDashboard = async (id: string) => {
    await supabase.from('dashboards').delete().eq('id', id);
    if (currentDashboardId === id) {
      setCurrentDashboardId(null);
      setDashboardName('My Dashboard');
    }
    loadDashboards();
    toast.success('Dashboard deleted');
  };

  return (
    <div ref={dashboardRef} className="of-app">
      <OFSidebarNav
        activePage={activePage}
        onPageChange={navigateTo}
        onPlusClick={() => setPlusOpen(!plusOpen)}
        avatarUrl={avatarUrl}
        displayName={displayName}
        onAvatarChange={setAvatarUrl}
      />

      <main className="of-main">
        <div className="of-page active">
          <Outlet context={{ avatarUrl, displayName, setDisplayName: (n: string) => setDisplayName(n), setAvatarUrl: (u: string) => setAvatarUrl(u) }} />
        </div>
      </main>

      <OFMobileNav
        activePage={activePage}
        onPageChange={navigateTo}
        onPlusClick={() => setPlusOpen(!plusOpen)}
        avatarUrl={avatarUrl}
        displayName={displayName}
      />

      {plusOpen && <PlusOverlay onClose={() => setPlusOpen(false)} onNavigate={navigateTo} />}

      {/* Toolbar FAB */}
      <div className="of-toolbar-fab">
        {toolbarOpen && (
          <div className="rounded-xl p-2 flex flex-col gap-1 shadow-2xl mb-2" style={{ background: '#fff', border: '1px solid #e0e0e0', minWidth: 160 }}>
            <ToolBtn icon={Camera} label="Screenshot" onClick={() => { handleExport(); setToolbarOpen(false); }} />
            <ToolBtn icon={Save} label={saving ? 'Saving...' : 'Save'} onClick={handleSave} />
            <ToolBtn icon={FolderOpen} label="Load" onClick={() => { loadDashboards(); setLoadDialogOpen(true); }} />
            <ToolBtn icon={Plus} label="New" onClick={() => { setCurrentDashboardId(null); setDashboardName('My Dashboard'); toast.success('New dashboard'); }} />
            {isAdmin && <ToolBtn icon={Settings} label="Admin" onClick={() => navigate('/admin')} />}
            {!hasActiveSubscription && !isAdmin && <ToolBtn icon={Crown} label="Premium" accent />}
            <div style={{ borderTop: '1px solid #e0e0e0', margin: '2px 0' }} />
            <ToolBtn icon={LogOut} label="Sign out" onClick={signOut} />
          </div>
        )}
        <button
          onClick={() => setToolbarOpen(!toolbarOpen)}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: '#00aff0', color: '#fff' }}
        >
          {toolbarOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>
      </div>

      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>My Dashboards</DialogTitle></DialogHeader>
          <div className="mb-3">
            <Input value={dashboardName} onChange={(e) => setDashboardName(e.target.value)} placeholder="Dashboard name" />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {savedDashboards.length === 0 ? (
              <p className="text-sm text-center py-4 text-muted-foreground">No saved dashboards</p>
            ) : savedDashboards.map(d => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50" style={{ background: currentDashboardId === d.id ? '#e8f7ff' : 'transparent' }}>
                <button className="text-left flex-1" onClick={() => loadDashboard(d)}>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString('en-US')}</p>
                </button>
                <Button size="sm" variant="ghost" onClick={() => deleteDashboard(d.id)}>
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToolBtn({ icon: Icon, label, onClick, accent }: { icon: any; label: string; onClick?: () => void; accent?: boolean }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium w-full text-left hover:bg-gray-50" style={{ color: accent ? '#00aff0' : '#333' }}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
