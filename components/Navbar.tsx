
import React from 'react';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '../constants';
import { AppSection } from '../types';

interface Props {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
}

const Navbar: React.FC<Props> = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50">
      <div className="max-w-md mx-auto bg-zinc-950/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id as AppSection)}
            className="relative flex-1 py-3 flex flex-col items-center justify-center gap-1 group"
          >
            {activeSection === item.id && (
              <motion.div
                layoutId="nav-bg"
                className="absolute inset-x-2 inset-y-1 bg-rose-600/10 rounded-2xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className={`transition-all duration-300 ${activeSection === item.id ? 'text-rose-500 scale-110' : 'text-zinc-500 group-active:scale-90'}`}>
              {item.icon}
            </div>
            <span className={`text-[9px] font-medium uppercase tracking-tighter ${activeSection === item.id ? 'text-rose-500' : 'text-zinc-600'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
