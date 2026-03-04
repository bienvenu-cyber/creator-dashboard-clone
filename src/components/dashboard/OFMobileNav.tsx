interface Props {
  activePage: string;
  onPageChange: (page: string) => void;
  onPlusClick: () => void;
}

const mobileItems = [
  { key: 'home', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { key: 'notifications', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { key: 'plus-btn', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
  { key: 'messages', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="13" y2="12"/><path d="M3 17l3 4h4"/></svg> },
  { key: 'profile', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
];

export function OFMobileNav({ activePage, onPageChange, onPlusClick }: Props) {
  return (
    <nav className="of-mobile-nav">
      {mobileItems.map(item => (
        <button
          key={item.key}
          className={`of-mobile-nav-item ${activePage === item.key ? 'active' : ''} ${item.key === 'plus-btn' ? 'plus' : ''}`}
          onClick={() => item.key === 'plus-btn' ? onPlusClick() : onPageChange(item.key)}
        >
          {item.icon}
        </button>
      ))}
    </nav>
  );
}
