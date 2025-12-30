
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderPlus, ChevronRight, UploadCloud, CheckCircle2, Folder as FolderIcon, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import { memoryService } from '../services/api';

const Photos: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const fetchContent = async (path: string = '') => {
    setLoading(true);
    try {
      const data = await memoryService.getFiles('photos', path);
      // Filter out keep files
      setItems(data.filter((i: any) => i.name !== '.keep'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(currentPath);
  }, [currentPath]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      await memoryService.uploadFiles(files, 'photos', currentPath);
      setShowSuccess(true);
      await fetchContent(currentPath);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    try {
      await memoryService.createFolder('photos', newFolderName, currentPath);
      setNewFolderName('');
      setIsCreatingFolder(false);
      await fetchContent(currentPath);
    } catch (err) {
      alert("Could not create folder.");
    }
  };

  const navigateTo = (folderName: string) => {
    setCurrentPath(prev => prev ? `${prev}/${folderName}` : folderName);
  };

  const goBack = () => {
    const parts = currentPath.split('/');
    parts.pop();
    setCurrentPath(parts.join('/'));
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col gap-4 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-romantic text-rose-500">Our Photos</h2>
          <div className="flex gap-2">
            <button onClick={() => setIsCreatingFolder(true)} className="p-2 bg-zinc-900 rounded-xl border border-white/5 text-zinc-400">
              <FolderPlus size={20} />
            </button>
            <label className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 transition-colors px-4 py-2 rounded-2xl cursor-pointer">
              <Plus size={18} />
              <span className="text-sm font-medium">Upload</span>
              <input type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 overflow-x-auto whitespace-nowrap pb-2">
          <button onClick={() => setCurrentPath('')} className="hover:text-rose-500">Root</button>
          {currentPath.split('/').filter(Boolean).map((p, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={12} />
              <span className="text-zinc-300">{p}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isCreatingFolder && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-zinc-900/80 backdrop-blur-md p-6 rounded-3xl border border-rose-500/20">
            <h3 className="text-sm font-medium mb-4">Create New Folder</h3>
            <input 
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
              className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-rose-500 mb-4"
              placeholder="e.g. Vacation 2024" 
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsCreatingFolder(false)} className="px-4 py-2 text-zinc-500 text-sm">Cancel</button>
              <button onClick={handleCreateFolder} className="px-6 py-2 bg-rose-600 rounded-xl text-sm font-medium">Create</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUploading && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3">
            <UploadCloud className="text-rose-500 animate-bounce" />
            <span className="text-sm">Syncing memories to our cloud vault...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {currentPath && (
          <motion.div onClick={goBack} className="aspect-square rounded-3xl bg-zinc-900/50 border border-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors">
            <ChevronLeft className="text-zinc-500 mb-2" size={32} />
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Back</span>
          </motion.div>
        )}

        {loading ? (
          [1,2,3].map(i => <div key={i} className="aspect-square rounded-3xl bg-zinc-900 animate-pulse" />)
        ) : items.length === 0 && !currentPath ? (
          <div className="col-span-full py-20 text-center text-zinc-700 flex flex-col items-center">
            <ImageIcon size={48} className="mb-4 opacity-10" />
            <p className="text-sm">Our cloud vault is empty. Fill it with love.</p>
          </div>
        ) : (
          items.map((item, idx) => (
            item.isDirectory ? (
              <motion.div 
                key={idx} 
                onClick={() => navigateTo(item.name)}
                whileHover={{ scale: 1.02 }}
                className="aspect-square rounded-3xl bg-zinc-900/80 border border-white/5 flex flex-col items-center justify-center cursor-pointer group"
              >
                <FolderIcon className="text-rose-500/60 group-hover:text-rose-500 transition-colors mb-3" size={48} fill="currentColor" fillOpacity={0.1} />
                <span className="text-sm font-medium px-4 text-center truncate w-full">{item.name}</span>
              </motion.div>
            ) : (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="aspect-square rounded-3xl overflow-hidden bg-zinc-900 group"
              >
                <img src={item.url} alt="Memory" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" loading="lazy" />
              </motion.div>
            )
          ))
        )}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-xl shadow-green-900/40">
            <CheckCircle2 size={18} />
            <span className="font-medium">Photos synced to Cloud!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Photos;
