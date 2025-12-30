
import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { memoryService } from '../services/api';

const Counter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const Home: React.FC = () => {
  const [stats, setStats] = useState({ photos: 0, letters: 0, videos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await memoryService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 py-8">
      <header className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-romantic text-rose-500"
        >
          Subodasanak mage manika ❤
        </motion.h1>
        <p className="text-zinc-400 font-light tracking-wide italic">Every moment with you is a gift.</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/80 p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center"
        >
          <span className="text-rose-500 mb-2 text-xl">📸</span>
          <h3 className="text-2xl font-bold">
            {loading ? "..." : <Counter value={stats.photos} />}
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Photos Shared</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-zinc-900/80 p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center"
        >
          <span className="text-rose-500 mb-2 text-xl">💌</span>
          <h3 className="text-2xl font-bold">
            {loading ? "..." : <Counter value={stats.letters} />}
          </h3>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Love Letters</p>
        </motion.div>
      </div>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative rounded-3xl overflow-hidden aspect-[16/9] group border border-white/5"
      >
        <img 
          src="https://picsum.photos/seed/love_memory/800/450" 
          alt="Featured Memory" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6">
          <p className="text-xs uppercase tracking-widest text-rose-500 mb-1 font-semibold">Featured Story</p>
          <p className="text-sm font-medium text-white/90">Our journey together has just begun, and it's already beautiful.</p>
        </div>
      </motion.div>

      <section className="bg-rose-950/20 rounded-3xl p-6 border border-rose-900/30">
        <h3 className="text-[10px] text-rose-500 uppercase tracking-widest mb-4">Daily Inspiration</h3>
        <p className="text-lg font-serif italic text-white/80">"I love you not only for what you are, but for what I am when I am with you."</p>
      </section>
    </div>
  );
};

export default Home;
