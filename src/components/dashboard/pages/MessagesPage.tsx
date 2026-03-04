import { useState, useRef, useEffect } from 'react';

const threads = [
  { name: 'Sophie M.', initials: 'SM', preview: 'I was thinking about something like...', time: '2m', color: '#e91e8c', unread: 3, online: true, convo: [
    { from: 'them', text: "Hey! I love your content so much 💕" },
    { from: 'me', text: 'Thank you so much, that really means a lot!' },
    { from: 'them', text: 'Can you make custom content for me? 🙏' },
    { from: 'me', text: "Of course! Send me the details and we'll discuss" },
    { from: 'them', text: 'I was thinking about something like...' },
  ]},
  { name: 'BigTipper99', initials: 'BT', preview: "I sent you a tip!", time: '15m', color: '#ff6b35', unread: 0, online: false, convo: [
    { from: 'them', text: "Hello! I just sent you a $50 tip 💸" },
    { from: 'me', text: "Wow thank you so much, you're too generous! 🙏🔥" },
    { from: 'them', text: 'You really deserve it, your content is top notch' },
    { from: 'me', text: 'That motivates me even more to create! Thanks 💪' },
  ]},
  { name: 'JakeXO', initials: 'JX', preview: 'That last post was incredible', time: '1h', color: '#00aff0', unread: 1, online: true, convo: [
    { from: 'them', text: 'Your latest post was absolutely incredible 🔥🔥' },
    { from: 'me', text: "Thanks Jake! I put a lot of effort into that one 😊" },
    { from: 'them', text: "It clearly shows. Can't wait to see more!" },
  ]},
  { name: 'Lisa_Fan', initials: 'LF', preview: "When's your next stream?", time: '3h', color: '#7b2ff7', unread: 0, online: false, convo: [
    { from: 'them', text: 'Hey! Are you planning a stream soon? 🎥' },
    { from: 'me', text: "Yes! I'm planning something for next week" },
    { from: 'them', text: "Awesome! Can't wait 🥳" },
  ]},
  { name: 'Mark_VIP', initials: 'MV', preview: 'Subscription renewed, keep it up!', time: '5h', color: '#2ecc71', unread: 0, online: false, convo: [
    { from: 'them', text: "Just renewed my subscription for 3 months 💪" },
    { from: 'me', text: "Thanks Mark, you're an amazing fan! Exclusive content on the way 🚀" },
  ]},
  { name: 'Roxy_K', initials: 'RK', preview: 'Thanks for the custom content!', time: 'Yesterday', color: '#f39c12', unread: 0, online: false, convo: [
    { from: 'them', text: 'Thank you so much for the custom content 😍' },
    { from: 'me', text: "My pleasure Roxy! Come back anytime 😊" },
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
          <span className="msg-sort-label">RECENT</span>
        </div>
        <div className="msg-filter-row">
          <div className="msg-filter-chip active">All</div>
          <div className="msg-filter-chip">Unread</div>
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

      <div className="msg-chat">
        <div className="msg-chat-head">
          <div className="msg-chat-head-info">
            <div className="msg-thread-av" style={{ background: active.color, position: 'relative' }}>
              {active.initials}
              {active.online && <div className="msg-thread-online" />}
            </div>
            <div>
              <div className="msg-chat-head-name" contentEditable suppressContentEditableWarning>{active.name}</div>
              <div className="msg-chat-head-sub">{active.online ? '🟢 Online' : 'Offline'}</div>
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
            placeholder="Write a message..."
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
