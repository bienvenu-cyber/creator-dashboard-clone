import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, Shield, Camera, BarChart3, Users, ArrowRight, Check, Star } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'Métriques réalistes', desc: 'Revenus, abonnés, tips — tout est personnalisable et réaliste.' },
  { icon: Camera, title: 'Export HD', desc: 'Capture d\'écran en un clic. Qualité pixel-perfect.' },
  { icon: Shield, title: '100% Sécurisé', desc: 'Vos données restent privées. Aucun partage.' },
  { icon: Users, title: 'Multi-dashboards', desc: 'Créez et sauvegardez autant de dashboards que vous voulez.' },
];

const testimonials = [
  { name: 'Sarah M.', text: 'Incroyable ! Mes screenshots sont indiscernables des vrais.', stars: 5 },
  { name: 'Alex K.', text: 'Le meilleur outil du marché. Interface parfaite.', stars: 5 },
  { name: 'Jordan L.', text: 'Support rapide et résultat impeccable.', stars: 5 },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>GhostDash</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Connexion</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gap-1">
                Commencer <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" /> Nouveau : Export en 4K
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Créez des dashboards
              <br />
              <span className="text-primary">OnlyFans</span> réalistes
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Générez des captures d'écran de dashboards OnlyFans avec des métriques personnalisables. 
              Pixel-perfect. Indétectable.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-base px-8 gap-2">
                  Commencer maintenant <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#pricing">
                <Button size="lg" variant="outline" className="text-base px-8">
                  Voir les prix
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Dashboard Preview Mock */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden"
          >
            <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">onlyfans.com/my/statistics</span>
            </div>
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Balance', value: '$12,847.50' },
                { label: 'Subscribers', value: '2,341' },
                { label: 'Tips', value: '$3,420.00' },
                { label: 'Messages', value: '$1,890.00' },
              ].map((stat) => (
                <div key={stat.label} className="of-stat-card text-center">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce qu'il vous faut</h2>
            <p className="text-muted-foreground text-lg">Des outils puissants pour des résultats parfaits.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tarif simple</h2>
          <p className="text-muted-foreground text-lg mb-10">Un seul plan. Tout inclus. Paiement crypto.</p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-primary bg-card p-8 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-lg">
              POPULAIRE
            </div>
            <h3 className="text-2xl font-bold mb-1">Premium</h3>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-5xl font-bold">100€</span>
              <span className="text-muted-foreground">/mois</span>
            </div>
            <ul className="text-left space-y-3 mb-8">
              {[
                'Dashboards illimités',
                'Export HD & 4K',
                'Toutes les métriques',
                'Sauvegarde cloud',
                'Support prioritaire',
                'Paiement crypto accepté',
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/auth">
              <Button size="lg" className="w-full text-base">
                S'abonner maintenant
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">Paiement en crypto • Activation sous 24h</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Ce que disent nos clients</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border border-border/50"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm mb-4">"{t.text}"</p>
                <p className="text-sm font-semibold">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">GhostDash</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 GhostDash. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
