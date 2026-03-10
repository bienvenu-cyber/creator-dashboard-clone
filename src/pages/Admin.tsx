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
import { Users, CreditCard, Shield, ArrowLeft, Check, X, Zap, LogOut, Eye, Settings, Search, Download, Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

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
  expires_at: string | null;
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

interface Stats {
  totalRevenue: number;
  activeUsers: number;
  pendingRequests: number;
  conversionRate: number;
  expiringThisWeek: number;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    activeUsers: 0,
    pendingRequests: 0,
    conversionRate: 0,
    expiringThisWeek: 0,
  });

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
    if (subsRes.data) {
      const subs = subsRes.data as any;
      setSubscriptions(subs);

      // Calculate stats
      const totalRevenue = subs.reduce((sum: number, s: Subscription) =>
        s.status === 'active' ? sum + Number(s.amount) : sum, 0
      );
      const activeUsers = subs.filter((s: Subscription) => s.status === 'active').length;
      const pendingRequests = subs.filter((s: Subscription) => s.status === 'pending').length;
      const conversionRate = usersRes.data.length > 0 ? (activeUsers / usersRes.data.length) * 100 : 0;

      // Expiring this week
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      const expiringThisWeek = subs.filter((s: Subscription) =>
        s.status === 'active' &&
        s.expires_at &&
        new Date(s.expires_at) <= oneWeekFromNow &&
        new Date(s.expires_at) > new Date()
      ).length;

      setStats({ totalRevenue, activeUsers, pendingRequests, conversionRate, expiringThisWeek });
    }
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

  const getDaysUntilExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const extendSubscription = async (subId: string, days: number) => {
    const sub = subscriptions.find(s => s.id === subId);
    if (!sub) return;

    const currentExpiry = sub.expires_at ? new Date(sub.expires_at) : new Date();
    const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);

    const { error } = await supabase.from('subscriptions').update({
      expires_at: newExpiry.toISOString(),
      status: 'active'
    }).eq('id', subId);

    if (error) {
      toast.error('Error: ' + error.message);
    } else {
      toast.success(`Extended by ${days} days`);
      loadData();
    }
  };

  const exportData = () => {
    const data = subscriptions.map(s => ({
      email: (s as any).profiles?.email,
      status: s.status,
      amount: s.amount,
      crypto: s.crypto_currency,
      created: new Date(s.created_at).toLocaleDateString(),
      expires: s.expires_at ? new Date(s.expires_at).toLocaleDateString() : 'Never',
    }));

    const csv = [
      ['Email', 'Status', 'Amount', 'Crypto', 'Created', 'Expires'],
      ...data.map(d => [d.email, d.status, d.amount, d.crypto, d.created, d.expires])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghostdash-subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data exported!');
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscriptions = subscriptions.filter(s =>
    (s as any).profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-lg flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-xs" onClick={signOut}>
          <LogOut className="w-3 h-3" /> Déconnexion
        </Button>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        >
          <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalRevenue}€</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-orange-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.conversionRate.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">Conversion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expiring Soon Alert */}
        {stats.expiringThisWeek > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <p className="text-sm font-medium">
                    <span className="text-orange-500">{stats.expiringThisWeek}</span> subscription{stats.expiringThisWeek > 1 ? 's' : ''} expiring within 7 days
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="pending">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="pending">En attente ({stats.pendingRequests})</TabsTrigger>
              <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm" onClick={exportData} className="gap-2">
                <Download className="w-4 h-4" /> Export
              </Button>
            </div>
          </div>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demandes en attente</CardTitle>
                <CardDescription>Vérifiez les screenshots et approuvez les paiements.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                ) : filteredSubscriptions.filter(s => s.status === 'pending').length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
                ) : (
                  <div className="space-y-4">
                        {filteredSubscriptions.filter(s => s.status === 'pending').map((sub, idx) => (
                          <motion.div
                            key={sub.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 rounded-lg border border-border/50 bg-gradient-to-r from-card to-card/50 hover:border-primary/30 transition-all"
                          >
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
                                className="gap-1 bg-green-500 hover:bg-green-600"
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
                          </motion.div>
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
                ) : filteredSubscriptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun abonnement trouvé.</p>
                ) : (
                  <div className="space-y-3">
                        {filteredSubscriptions.map((sub, idx) => {
                          const daysLeft = getDaysUntilExpiry(sub.expires_at);
                          const isExpiringSoon = daysLeft !== null && daysLeft < 7 && daysLeft > 0;

                          return (
                            <motion.div
                              key={sub.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className={`flex items-center justify-between p-4 rounded-lg border ${isExpiringSoon ? 'border-orange-500/30 bg-orange-500/5' : 'border-border/50 bg-card/50'}`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">{(sub as any).profiles?.display_name || 'Utilisateur'}</span>
                                  <Badge variant={statusColor(sub.status) as any}>{sub.status}</Badge>
                                  {isExpiringSoon && (
                                    <Badge variant="outline" className="text-orange-500 border-orange-500/50">
                                      <Clock className="w-3 h-3 mr-1" /> {daysLeft} days left
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{(sub as any).profiles?.email}</p>
                                <p className="text-xs text-muted-foreground">
                                  {sub.amount}€ • {sub.crypto_currency} • {new Date(sub.created_at).toLocaleDateString('fr-FR')}
                                  {sub.expires_at && ` • Expires: ${new Date(sub.expires_at).toLocaleDateString('fr-FR')}`}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {sub.status === 'active' && (
                                  <>
                                    <Button size="sm" variant="outline" onClick={() => extendSubscription(sub.id, 30)} className="gap-1">
                                      <Calendar className="w-3 h-3" /> +30d
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => rejectSubscription(sub.id)} className="text-destructive hover:text-destructive">
                                      Désactiver
                                    </Button>
                                  </>
                                )}
                                {sub.status === 'inactive' && (
                                  <Button size="sm" variant="outline" onClick={() => extendSubscription(sub.id, 30)}>
                                    Réactiver
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
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
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucun utilisateur trouvé.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredUsers.map((u, idx) => (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="flex items-center justify-between p-3 border-b border-border/50 last:border-0 hover:bg-muted/30 rounded transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium">{u.display_name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString('fr-FR')}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
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
