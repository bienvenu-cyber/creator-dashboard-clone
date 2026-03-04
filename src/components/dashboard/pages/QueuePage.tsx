import { useState, useMemo } from 'react';

const frMonths = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

export function QueuePage() {
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(2); // mars
  const [selectedDay, setSelectedDay] = useState(4);
  const [activeChip, setActiveChip] = useState(0);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const prevDays = new Date(calYear, calMonth, 0).getDate();
    const today = new Date();

    const days: { num: number; isOther: boolean; isToday: boolean }[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ num: prevDays - i, isOther: true, isToday: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && i === today.getDate();
      days.push({ num: i, isOther: false, isToday });
    }
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({ num: i, isOther: true, isToday: false });
    }
    return days;
  }, [calYear, calMonth]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  return (
    <div className="queue-layout">
      <div className="queue-cal-panel">
        <div className="queue-cal-header">
          <div className="queue-cal-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            FILE D'ATTENTE
          </div>
          <div style={{ display: 'flex', gap: 10, color: '#888' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </div>
        <div className="queue-month-nav">
          <button className="queue-nav-btn" onClick={prevMonth}>‹</button>
          <button className="queue-nav-btn" onClick={nextMonth}>›</button>
          <span className="queue-month-label">{frMonths[calMonth]} {calYear}</span>
        </div>
        <div className="queue-type-chips">
          {['Publications', 'Messages'].map((c, i) => (
            <div key={i} className={`queue-type-chip ${activeChip === i ? 'active' : ''}`} onClick={() => setActiveChip(i)}>{c}</div>
          ))}
        </div>
        <div className="queue-cal-grid">
          <div>
            {['L','M','M','J','V','S','D'].map(d => (
              <span key={d + Math.random()} className="cal-day-header-item">{d}</span>
            ))}
          </div>
          <div className="cal-days-grid">
            {calendarDays.map((d, i) => (
              <div
                key={i}
                className={`cal-day ${d.isOther ? 'other-month' : ''} ${d.isToday ? 'today' : ''}`}
                style={!d.isOther && d.num === selectedDay && !d.isToday ? { background: '#f0f9ff' } : {}}
                onClick={() => !d.isOther && setSelectedDay(d.num)}
              >
                <div className="cal-day-num">{d.num}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="queue-day-panel">
        <div className="queue-day-header">
          <button className="queue-nav-btn">&lt;</button>
          <span>{frMonths[calMonth]} {selectedDay}, {calYear}</span>
          <button className="queue-nav-btn">&gt;</button>
        </div>
        <div className="queue-day-add">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
        <div className="queue-day-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <div className="queue-day-empty-text">Il n'y a pas d'événements prévus pour cette journée</div>
        </div>
      </div>
    </div>
  );
}
