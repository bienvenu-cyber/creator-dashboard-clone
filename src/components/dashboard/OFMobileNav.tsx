import { Home, BarChart3, MessageSquare, Wallet, Menu } from 'lucide-react';

interface Props {
  activeItem?: string;
}

const tabs = [
  { icon: Home, label: 'Home', key: 'home' },
  { icon: BarChart3, label: 'Stats', key: 'statistics' },
  { icon: Wallet, label: 'Earnings', key: 'statements' },
  { icon: MessageSquare, label: 'Messages', key: 'messages' },
  { icon: Menu, label: 'More', key: 'more' },
];

export function OFMobileNav({ activeItem = 'statements' }: Props) {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: '#1b1b2f',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: '56px',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeItem;
        return (
          <button
            key={tab.key}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
            style={{ color: isActive ? '#00AFF0' : '#6b6b80' }}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
