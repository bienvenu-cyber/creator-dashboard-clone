import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Check, Copy, ArrowLeft, Bitcoin, Zap } from 'lucide-react';

const CRYPTO_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

export default function Subscribe() {
  const { user, hasActiveSubscription } = useAuth();
  const navigate = useNavigate();
  const [txHash, setTxHash] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(CRYPTO_ADDRESS);
    setCopied(true);
    toast.success('Adresse copiée !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!txHash.trim()) {
      toast.error('Veuillez entrer le hash de transaction.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('subscriptions').insert({
      user_id: user!.id,
      status: 'pending',
      amount: 100,
      currency: 'EUR',
      payment_method: 'crypto',
      crypto_tx_hash: txHash.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error('Erreur: ' + error.message);
    } else {
      toast.success('Paiement soumis ! Activation sous 24h après vérification.');
      navigate('/dashboard');
    }
  };

  if (hasActiveSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Abonnement actif</CardTitle>
            <CardDescription>Vous avez déjà un abonnement premium actif.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/dashboard')}>
              Aller au générateur
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <Button variant="ghost" size="sm" className="w-fit gap-1 mb-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-3 h-3" /> Retour
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>Abonnement Premium</CardTitle>
              <CardDescription>100€/mois • Paiement crypto</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Send crypto */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</div>
              <h3 className="text-sm font-semibold">Envoyez 100€ en crypto</h3>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Bitcoin className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">Adresse Bitcoin (BTC)</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background p-2 rounded-lg break-all border border-border/50">
                  {CRYPTO_ADDRESS}
                </code>
                <Button size="sm" variant="outline" onClick={copyAddress} className="shrink-0">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Step 2: Paste tx hash */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</div>
              <h3 className="text-sm font-semibold">Collez le hash de transaction</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Transaction Hash (TX ID)</Label>
              <Input
                value={txHash}
                onChange={e => setTxHash(e.target.value)}
                placeholder="0x..."
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* Step 3: Submit */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</div>
              <h3 className="text-sm font-semibold">Soumettez et attendez la validation</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              L'admin vérifiera votre paiement et activera votre compte sous 24h.
            </p>
            <Button onClick={handleSubmit} disabled={submitting} className="w-full">
              {submitting ? 'Envoi en cours...' : 'Soumettre le paiement'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
