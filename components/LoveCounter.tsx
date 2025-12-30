
import React, { useState, useEffect } from 'react';
import { RELATIONSHIP_START_DATE } from '../constants';

const LoveCounter: React.FC = () => {
  const [time, setTime] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const start = new Date(RELATIONSHIP_START_DATE).getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = now - start;

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({ days: d, hours: h, minutes: m, seconds: s });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-12">
      <div className="text-center">
        <h2 className="text-xl font-romantic text-rose-500 mb-2">Since We Became Us</h2>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest">July 29th, 2024</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {[
          { label: 'Days', value: time.days },
          { label: 'Hours', value: time.hours },
          { label: 'Mins', value: time.minutes },
          { label: 'Secs', value: time.seconds }
        ].map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-zinc-900 border border-rose-500/20 flex items-center justify-center text-3xl font-bold text-white mb-2 shadow-inner">
              {unit.value}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">{unit.label}</span>
          </div>
        ))}
      </div>

      <div className="pt-8 text-center px-8">
        <p className="text-zinc-400 italic text-sm">"Every second with you feels like a beautiful dream I never want to wake up from."</p>
      </div>
    </div>
  );
};

export default LoveCounter;
