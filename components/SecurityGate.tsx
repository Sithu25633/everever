
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { PIN_CODE } from '../constants';

interface Props {
  onUnlock: () => void;
}

const SecurityGate: React.FC<Props> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleInput = (val: string) => {
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === PIN_CODE) {
          localStorage.setItem('security_unlocked', 'true');
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center z-50 p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-xs flex flex-col items-center"
      >
        <div className={`p-4 rounded-full bg-zinc-900 border ${error ? 'border-red-500' : 'border-zinc-800'} mb-8`}>
          <Lock className={error ? 'text-red-500' : 'text-rose-500'} size={32} />
        </div>
        
        <h2 className="text-xl font-light tracking-[0.3em] uppercase mb-12">Enter Security Code</h2>
        
        <div className="flex gap-4 mb-16">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 
                ${pin.length > i ? 'bg-rose-500 border-rose-500' : 'border-zinc-700'}
                ${error ? 'bg-red-500 border-red-500' : ''}`} 
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'back'].map((num, i) => (
            <button
              key={i}
              onClick={() => {
                if (num === 'back') setPin(p => p.slice(0, -1));
                else if (num !== '') handleInput(num.toString());
              }}
              className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-xl font-medium active:scale-95 transition-transform"
            >
              {num === 'back' ? '←' : num}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityGate;
