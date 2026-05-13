import { useState, useEffect } from 'react';

export default function NavClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const tlv = new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 3 * 3600000);
      setTime(tlv.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--dim)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ animation: 'blink 1.4s steps(2) infinite' }}>●</span>
      {time} TLV
    </div>
  );
}
