import { useRef } from 'react';

interface Props {
  activePage: string;
  onPageChange: (page: string) => void;
  onPlusClick: () => void;
  avatarUrl: string | null;
  displayName: string;
  onAvatarChange: (url: string) => void;
}

const menuItems = [
  { key: 'home', label: 'Home', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { key: 'notifications', label: 'Notifications', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { key: 'messages', label: 'Messages', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="13" y2="12"/><path d="M3 17l3 4h4"/></svg> },
  { key: 'collections', label: 'Collections', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="8" width="20" height="14" rx="2"/><circle cx="7.5" cy="14" r="1.5"/><polyline points="2 18 7 13 11 16 14 13 22 19"/><line x1="7" y1="5" x2="7" y2="8"/><line x1="12" y1="3" x2="12" y2="8"/><line x1="17" y1="5" x2="17" y2="8"/><line x1="5" y1="5" x2="9" y2="5"/><line x1="10" y1="3" x2="14" y2="3"/><line x1="15" y1="5" x2="19" y2="5"/></svg> },
  { key: 'vault', label: 'Vault', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="7.5" cy="9" r="1.5"/><polyline points="2 17 8 11 12 15 15 12 22 18"/><rect x="14" y="13" width="7" height="6" rx="1.2" fill="white" stroke="currentColor" strokeWidth="1.8"/><path d="M16 13v-1.5a2 2 0 0 1 4 0V13" strokeWidth="1.6"/></svg> },
  { key: 'queue', label: 'Queue', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14" strokeLinecap="round" strokeWidth="2.5"/><line x1="12" y1="14" x2="12.01" y2="14" strokeLinecap="round" strokeWidth="2.5"/><line x1="16" y1="14" x2="16.01" y2="14" strokeLinecap="round" strokeWidth="2.5"/><line x1="8" y1="18" x2="8.01" y2="18" strokeLinecap="round" strokeWidth="2.5"/><line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round" strokeWidth="2.5"/></svg> },
  { key: 'declarations', label: 'Statements', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="7" y1="18" x2="7" y2="13"/><line x1="12" y1="18" x2="12" y2="8"/><line x1="17" y1="18" x2="17" y2="11"/></svg> },
  { key: 'statistics', label: 'Statistics', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="3"/><polyline points="5 16 9 11 13 14 17 8"/><polyline points="15 8 17 8 17 10"/></svg> },
  { key: 'profile', label: 'My profile', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
  { key: 'plus', label: 'More', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="1" fill="currentColor" stroke="none"/></svg> },
];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
}

export function OFSidebarNav({ activePage, onPageChange, onPlusClick, avatarUrl, displayName, onAvatarChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAvatarChange(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <aside className="of-sidebar">
      <div className="sb-avatar-wrap">
        <div className="sb-avatar" onClick={() => fileRef.current?.click()}>
          {avatarUrl ? <img src={avatarUrl} alt="avatar" /> : getInitials(displayName)}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="sb-avatar-upload" onChange={handleFileChange} />
      </div>
      <nav className="sb-nav">
        {menuItems.map(item => (
          <div
            key={item.key}
            className={`sb-item ${activePage === item.key ? 'active' : ''}`}
            onClick={() => item.key === 'plus' ? onPlusClick() : onPageChange(item.key)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </nav>
      <button className="sb-new-post">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        NEW POST
      </button>
    </aside>
  );
}
