import { DashboardConfig } from '@/types/dashboard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, DollarSign, BarChart3, Activity } from 'lucide-react';

interface Props {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={e => onChange(e.target.value)} className="h-8 text-sm" />
    </div>
  );
}

export function DashboardEditor({ config, onConfigChange }: Props) {
  const update = (key: keyof DashboardConfig, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-6 pr-4">
        {/* Profile Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Profil</h3>
          </div>
          <div className="space-y-3">
            <Field label="Nom d'affichage" value={config.displayName} onChange={v => update('displayName', v)} />
            <Field label="Username" value={config.username} onChange={v => update('username', v)} />
            <div className="flex items-center justify-between">
              <Label className="text-xs">Vérifié</Label>
              <Switch checked={config.verified} onCheckedChange={v => update('verified', v)} />
            </div>
          </div>
        </div>

        <Separator />

        {/* Stats Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Statistiques</h3>
          </div>
          <div className="space-y-3">
            <Field label="Balance" value={config.balance} onChange={v => update('balance', v)} />
            <Field label="En attente" value={config.pendingBalance} onChange={v => update('pendingBalance', v)} />
            <Field label="Abonnés" value={config.subscribers} onChange={v => update('subscribers', v)} />
            <Field label="Total Fans" value={config.fans} onChange={v => update('fans', v)} />
            <Field label="Tips" value={config.tips} onChange={v => update('tips', v)} />
            <Field label="Messages" value={config.messages} onChange={v => update('messages', v)} />
            <Field label="Referrals" value={config.referrals} onChange={v => update('referrals', v)} />
          </div>
        </div>

        <Separator />

        {/* Earnings Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Revenus</h3>
          </div>
          <div className="space-y-3">
            <Field label="Total" value={config.totalEarnings} onChange={v => update('totalEarnings', v)} />
            <Field label="Abonnements" value={config.subscriptionEarnings} onChange={v => update('subscriptionEarnings', v)} />
            <Field label="Tips" value={config.tipEarnings} onChange={v => update('tipEarnings', v)} />
            <Field label="Messages" value={config.messageEarnings} onChange={v => update('messageEarnings', v)} />
            <Field label="Referrals" value={config.referralEarnings} onChange={v => update('referralEarnings', v)} />
          </div>
        </div>

        <Separator />

        {/* Activity Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Activité récente</h3>
          </div>
          {config.recentActivity.map((activity, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
              <Input value={activity.type} onChange={e => {
                const newActivity = [...config.recentActivity];
                newActivity[i] = { ...newActivity[i], type: e.target.value };
                update('recentActivity', newActivity);
              }} className="h-8 text-xs" placeholder="Type" />
              <Input value={activity.amount} onChange={e => {
                const newActivity = [...config.recentActivity];
                newActivity[i] = { ...newActivity[i], amount: e.target.value };
                update('recentActivity', newActivity);
              }} className="h-8 text-xs" placeholder="Montant" />
              <Input value={activity.time} onChange={e => {
                const newActivity = [...config.recentActivity];
                newActivity[i] = { ...newActivity[i], time: e.target.value };
                update('recentActivity', newActivity);
              }} className="h-8 text-xs" placeholder="Temps" />
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full text-xs mt-2"
            onClick={() => update('recentActivity', [...config.recentActivity, { type: 'Tip', amount: '$10.00', time: 'just now' }])}>
            + Ajouter une activité
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
