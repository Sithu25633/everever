
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, X, Save } from 'lucide-react';
import { memoryService } from '../services/api';

const Letters: React.FC = () => {
  const [letters, setLetters] = useState<any[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const data = await memoryService.getLetters();
      setLetters(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newTitle || !newContent) return;
    try {
      await memoryService.saveLetter(newTitle, newContent);
      setIsWriting(false);
      setNewTitle('');
      setNewContent('');
      fetchLetters();
    } catch (e) {
      alert("Error saving letter");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-romantic text-rose-500">Our Letters</h2>
        <button onClick={() => setIsWriting(true)} className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-2xl border border-white/5 text-rose-500">
          <PenTool size={18} />
          <span className="text-sm font-medium">Write Letter</span>
        </button>
      </div>

      <AnimatePresence>
        {isWriting && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-[60] bg-black/95 flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => setIsWriting(false)} className="p-2 text-zinc-500"><X /></button>
              <h3 className="text-xl font-romantic text-rose-500">Writing to You...</h3>
              <button onClick={handleSave} className="p-2 text-rose-500"><Save /></button>
            </div>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Letter Title" className="bg-transparent text-2xl font-serif italic outline-none mb-6 border-b border-white/5 pb-2" />
            <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Pour your heart out here..." className="bg-transparent flex-1 resize-none outline-none text-zinc-300 leading-relaxed font-light text-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-32 bg-zinc-900 rounded-3xl animate-pulse" />)
        ) : letters.length === 0 ? (
          <div className="py-20 text-center opacity-30 flex flex-col items-center">
            <PenTool size={48} className="mb-4" />
            <p>No letters yet. Say something beautiful.</p>
          </div>
        ) : (
          letters.map((letter) => (
            <motion.div key={letter.id} className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-serif italic text-white/90">{letter.title}</h3>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{letter.date}</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{letter.content}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Letters;
