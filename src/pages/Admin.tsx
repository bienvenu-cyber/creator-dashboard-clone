import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Users, CreditCard, Shield, ArrowLeft, Check, X, Zap, LogOut } from 'lucide-react';

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
  created_at: string;
  profiles?: { display_name: string; email: string };
}

export default function Admin() {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/dashboard'); return; }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    const [usersRes, subsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('*, profiles(display_name, email)').order('created_at', { ascending: false }),
    ]);
    if (usersRes.data) setUsers(usersRes.data);
    if (subsRes.data) setSubscriptions(subsRes.data as any);
    setLoading(false);
  };

  const updateSubscription = async (id: string, status: 'active' | 'inactive') => {
    const expiresAt = status === 'active' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;
    const { error } = await supabase.from('subscriptions').update({ status, expires_at: expiresAt }).eq('id', id);
    if (error) {
      toast.error('Erreur: ' + error.message);
    } else {
      toast.success(status === 'active' ? 'Abonnement activé !' : 'Abonnement désactivé.');
      loadData();
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

        <Tabs defaultValue="subscriptions">
          <TabsList>
            <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gestion des abonnements</CardTitle>
                <CardDescription>Approuvez ou refusez les paiements crypto.</CardDescription>
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
                          {sub.crypto_tx_hash && (
                            <p className="text-xs font-mono text-muted-foreground mt-1 truncate max-w-xs">
                              TX: {sub.crypto_tx_hash}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">{sub.amount}€ • {new Date(sub.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="flex gap-2">
                          {sub.status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => updateSubscription(sub.id, 'active')} className="gap-1">
                                <Check className="w-3 h-3" /> Approuver
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => updateSubscription(sub.id, 'inactive')} className="gap-1">
                                <X className="w-3 h-3" /> Refuser
                              </Button>
                            </>
                          )}
                          {sub.status === 'active' && (
                            <Button size="sm" variant="outline" onClick={() => updateSubscription(sub.id, 'inactive')}>
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
      </div>
    </div>
  );
}
