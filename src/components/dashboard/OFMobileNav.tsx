interface Props {
  activePage: string;
  onPageChange: (page: string) => void;
  onPlusClick: () => void;
  avatarUrl: string | null;
  displayName: string;
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
}

const mobileItems = [
  { key: 'home', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { key: 'notifications', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { key: 'plus-btn', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
  { key: 'messages', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { key: 'profile', icon: null },
];

export function OFMobileNav({ activePage, onPageChange, onPlusClick, avatarUrl, displayName }: Props) {
  return (
    <nav className="of-mobile-nav">
      {mobileItems.map(item => (
        <button
          key={item.key}
          className={`of-mobile-nav-item ${activePage === item.key ? 'active' : ''} ${item.key === 'plus-btn' ? 'plus' : ''}`}
          onClick={() => item.key === 'plus-btn' ? onPlusClick() : onPageChange(item.key)}
        >
          {item.key === 'profile' ? (
            <div className="mobile-nav-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>
          ) : item.key === 'plus-btn' ? (
            <div className="mobile-nav-plus-icon">
              {item.icon}
            </div>
          ) : (
            item.icon
          )}
        </button>
      ))}
    </nav>
  );
}
