
import React from 'react';
import { motion } from 'framer-motion';

const Splash: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-rose-600 mb-6"
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
        <h1 className="text-3xl font-romantic text-white tracking-widest">Niwaduwak</h1>
        <div className="mt-2 w-12 h-[1px] bg-rose-600/50" />
      </motion.div>
    </div>
  );
};

export default Splash;
