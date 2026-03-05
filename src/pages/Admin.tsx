import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Users, CreditCard, Shield, ArrowLeft, Check, X, Zap, LogOut, Eye, Settings } from 'lucide-react';

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  created_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  amount: number;
  crypto_tx_hash: string | null;
  crypto_currency: string | null;
  crypto_address: string | null;
  created_at: string;
  profiles?: { display_name: string; email: string };
}

interface AdminSettings {
  id: string;
  telegram_username: string;
  btc_address: string;
  eth_address: string;
  usdt_address: string;
}

export default function Admin() {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [showScreenshot, setShowScreenshot] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/dashboard'); return; }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    const [usersRes, subsRes, settingsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('*, profiles(display_name, email)').order('created_at', { ascending: false }),
      (supabase as any).from('admin_settings').select('*').single(),
    ]);
    if (usersRes.data) setUsers(usersRes.data);
    if (subsRes.data) setSubscriptions(subsRes.data as any);
    if (settingsRes.data) setSettings(settingsRes.data);
    setLoading(false);
  };

  const viewScreenshot = async (fileName: string) => {
    const { data } = await supabase.storage.from('payment-screenshots').createSignedUrl(fileName, 3600);
    if (data) {
      setScreenshotUrl(data.signedUrl);
      setShowScreenshot(true);
    } else {
      toast.error('Screenshot not found');
    }
  };

  const approveSubscription = async (sub: Subscription) => {
    try {
      // Générer un mot de passe aléatoire
      const newPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);

      // Mettre à jour le mot de passe du user
      const { error: pwdError } = await supabase.auth.admin.updateUserById(sub.user_id, {
        password: newPassword
      });

      if (pwdError) throw pwdError;

      // Activer l'abonnement
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const { error: subError } = await supabase.from('subscriptions').update({
        status: 'active',
        expires_at: expiresAt
      }).eq('id', sub.id);

      if (subError) throw subError;

      toast.success(`Approved! Password: ${newPassword} (copy this!)`);

      // TODO: Envoyer email avec les accès
      console.log('Email:', (sub as any).profiles?.email);
      console.log('Password:', newPassword);

      loadData();
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    }
  };

  const rejectSubscription = async (id: string) => {
    const { error } = await supabase.from('subscriptions').update({ status: 'inactive' }).eq('id', id);
    if (error) {
      toast.error('Error: ' + error.message);
    } else {
      toast.success('Subscription rejected');
      loadData();
    }
  };

  const updateSettings = async () => {
    if (!settings) return;
    const { error } = await (supabase as any).from('admin_settings').update({
      telegram_username: settings.telegram_username,
      btc_address: settings.btc_address,
      eth_address: settings.eth_address,
      usdt_address: settings.usdt_address,
    }).eq('id', settings.id);

    if (error) {
      toast.error('Error: ' + error.message);
    } else {
      toast.success('Settings updated!');
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border/50 bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={signOut}>
          <LogOut className="w-3 h-3" /> Déconnexion
        </Button>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">Utilisateurs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'active').length}</p>
                  <p className="text-xs text-muted-foreground">Abonnés actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{subscriptions.filter(s => s.status === 'pending').length}</p>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">En attente ({subscriptions.filter(s => s.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="subscriptions">Tous les abonnements</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demandes en attente</CardTitle>
                <CardDescription>Vérifiez les screenshots et approuvez les paiements.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                ) : subscriptions.filter(s => s.status === 'pending').length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.filter(s => s.status === 'pending').map(sub => (
                      <div key={sub.id} className="p-4 rounded-lg border border-border/50 bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{(sub as any).profiles?.email}</span>
                              <Badge variant="secondary">Pending</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                              <div>💰 Amount: {sub.amount}€</div>
                              <div>🪙 Crypto: {sub.crypto_currency || 'N/A'}</div>
                              <div>📅 Date: {new Date(sub.created_at).toLocaleDateString('fr-FR')}</div>
                              <div>📍 Address: {sub.crypto_address?.slice(0, 20)}...</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {sub.crypto_tx_hash && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewScreenshot(sub.crypto_tx_hash!)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" /> View Screenshot
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => approveSubscription(sub)}
                            className="gap-1"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectSubscription(sub.id)}
                            className="gap-1"
                          >
                            <X className="w-3 h-3" /> Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tous les abonnements</CardTitle>
                <CardDescription>Historique complet des abonnements.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                ) : subscriptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun abonnement pour le moment.</p>
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{(sub as any).profiles?.display_name || 'Utilisateur'}</span>
                            <Badge variant={statusColor(sub.status) as any}>{sub.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{(sub as any).profiles?.email}</p>
                          <p className="text-xs text-muted-foreground">{sub.amount}€ • {sub.crypto_currency} • {new Date(sub.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="flex gap-2">
                          {sub.status === 'active' && (
                            <Button size="sm" variant="outline" onClick={() => rejectSubscription(sub.id)}>
                              Désactiver
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Settings
                </CardTitle>
                <CardDescription>Configure crypto addresses and Telegram.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Telegram Username</label>
                      <Input
                        value={settings.telegram_username}
                        onChange={(e) => setSettings({ ...settings, telegram_username: e.target.value })}
                        placeholder="@your_telegram"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Bitcoin Address</label>
                      <Input
                        value={settings.btc_address || ''}
                        onChange={(e) => setSettings({ ...settings, btc_address: e.target.value })}
                        placeholder="bc1q..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ethereum Address</label>
                      <Input
                        value={settings.eth_address || ''}
                        onChange={(e) => setSettings({ ...settings, eth_address: e.target.value })}
                        placeholder="0x..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">USDT Address (TRC20)</label>
                      <Input
                        value={settings.usdt_address || ''}
                        onChange={(e) => setSettings({ ...settings, usdt_address: e.target.value })}
                        placeholder="TR..."
                      />
                    </div>
                    <Button onClick={updateSettings}>Save Settings</Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Utilisateurs</CardTitle>
                <CardDescription>Liste de tous les utilisateurs inscrits.</CardDescription>
              </CardHeader>
              <CardContent>
                {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{u.display_name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Screenshot Dialog */}
        <Dialog open={showScreenshot} onOpenChange={setShowScreenshot}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Payment Screenshot</DialogTitle>
            </DialogHeader>
            {screenshotUrl && (
              <img src={screenshotUrl} alt="Payment proof" className="w-full rounded-lg" />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
