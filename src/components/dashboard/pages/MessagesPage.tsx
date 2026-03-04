import { useState, useRef, useEffect } from 'react';

const threads = [
  { name: 'Sophie M.', initials: 'SM', preview: 'Je pensais à quelque chose comme...', time: '2m', color: '#e91e8c', unread: 3, online: true, convo: [
    { from: 'them', text: "Hey ! J'adore tellement ton contenu 💕" },
    { from: 'me', text: 'Merci beaucoup, ça me touche vraiment !' },
    { from: 'them', text: 'Tu peux faire un contenu perso pour moi ? 🙏' },
    { from: 'me', text: 'Bien sûr ! Envoie-moi les détails et on en discute' },
    { from: 'them', text: 'Je pensais à quelque chose comme...' },
  ]},
  { name: 'BigTipper99', initials: 'BT', preview: "Je t'ai envoyé un pourboire !", time: '15m', color: '#ff6b35', unread: 0, online: false, convo: [
    { from: 'them', text: "Hello ! Je viens de t'envoyer un pourboire de $50 💸" },
    { from: 'me', text: 'Waouh merci infiniment, tu es trop généreux ! 🙏🔥' },
    { from: 'them', text: 'Tu le mérites vraiment, ton contenu est au top' },
    { from: 'me', text: 'Ça me motive encore plus à créer ! Merci 💪' },
  ]},
  { name: 'JakeXO', initials: 'JX', preview: 'Cette dernière publication était incroyable', time: '1h', color: '#00aff0', unread: 1, online: true, convo: [
    { from: 'them', text: 'Ta dernière publication était absolument incroyable 🔥🔥' },
    { from: 'me', text: "Merci Jake ! J'ai mis beaucoup d'effort là-dedans 😊" },
    { from: 'them', text: 'Ça se voit clairement. Hâte de voir la suite !' },
  ]},
  { name: 'Lisa_Fan', initials: 'LF', preview: "C'est quand ton prochain stream ?", time: '3h', color: '#7b2ff7', unread: 0, online: false, convo: [
    { from: 'them', text: 'Salut ! Tu prévois un stream bientôt ? 🎥' },
    { from: 'me', text: 'Oui ! Je prévois quelque chose pour la semaine prochaine' },
    { from: 'them', text: "Génial ! J'ai hâte 🥳" },
  ]},
  { name: 'Mark_VIP', initials: 'MV', preview: 'Abonnement renouvelé, continue !', time: '5h', color: '#2ecc71', unread: 0, online: false, convo: [
    { from: 'them', text: "Je viens de renouveler mon abonnement pour 3 mois 💪" },
    { from: 'me', text: 'Merci Mark, tu es un super fan ! Contenu exclusif en route 🚀' },
  ]},
  { name: 'Roxy_K', initials: 'RK', preview: 'Merci pour le contenu perso !', time: 'Hier', color: '#f39c12', unread: 0, online: false, convo: [
    { from: 'them', text: 'Merci beaucoup pour le contenu personnalisé 😍' },
    { from: 'me', text: 'Avec plaisir Roxy ! Reviens quand tu veux 😊' },
  ]},
];

export function MessagesPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [messages, setMessages] = useState(threads.map(t => [...t.convo]));
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [activeIdx, messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    setMessages(prev => {
      const copy = prev.map(m => [...m]);
      copy[activeIdx].push({ from: 'me', text: input.trim() });
      return copy;
    });
    setInput('');
  };

  const active = threads[activeIdx];

  return (
    <div className="msg-layout">
      {/* Thread list */}
      <div className="msg-list-panel">
        <div className="msg-list-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '.5px' }}>MESSAGES</span>
          </div>
          <div style={{ display: 'flex', gap: 12, color: '#888' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ cursor: 'pointer' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
        <div className="msg-sort-row">
          <span className="msg-sort-label">RÉCENT</span>
        </div>
        <div className="msg-filter-row">
          <div className="msg-filter-chip active">Tout</div>
          <div className="msg-filter-chip">Non lus</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {threads.map((t, i) => (
            <div key={i} className={`msg-thread ${activeIdx === i ? 'active' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="msg-thread-av" style={{ background: t.color }}>
                {t.initials}
                {t.online && <div className="msg-thread-online" />}
              </div>
              <div className="msg-thread-info">
                <div className="msg-thread-name">{t.name}</div>
                <div className="msg-thread-preview">{t.preview}</div>
              </div>
              <div className="msg-thread-meta">
                <span className="msg-thread-time">{t.time}</span>
                {t.unread > 0 && <div className="msg-unread-badge">{t.unread}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="msg-chat">
        <div className="msg-chat-head">
          <div className="msg-chat-head-info">
            <div className="msg-thread-av" style={{ background: active.color, position: 'relative' }}>
              {active.initials}
              {active.online && <div className="msg-thread-online" />}
            </div>
            <div>
              <div className="msg-chat-head-name" contentEditable suppressContentEditableWarning>{active.name}</div>
              <div className="msg-chat-head-sub">{active.online ? '🟢 En ligne' : 'Hors ligne'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, color: '#aaa' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </div>
        </div>
        <div className="msg-chat-body" ref={bodyRef}>
          {messages[activeIdx].map((m, i) => (
            <div key={i} className={`msg-bubble ${m.from === 'me' ? 'me' : 'them'}`} contentEditable suppressContentEditableWarning>{m.text}</div>
          ))}
        </div>
        <div className="msg-chat-input">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" style={{ cursor: 'pointer', flexShrink: 0 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <input
            type="text"
            placeholder="Écrire un message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMsg(); }}
          />
          <button className="msg-send-btn" onClick={sendMsg}>↑</button>
        </div>
      </div>
    </div>
  );
}
