
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, User, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

interface Props {
  onLogin: () => void;
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Timeout safety: if server doesn't respond in 10s
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Server is not responding. Please check your VPS/Backend.');
      }
    }, 10000);

    try {
      if (isRegistering) {
        if (!username || !password) throw new Error('Fill in our love story details.');
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        await authService.register(username, password);
        const data = await authService.login(username, password);
        localStorage.setItem('auth_token', data.token);
        clearTimeout(timeout);
        onLogin();
      } else {
        const data = await authService.login(username, password);
        localStorage.setItem('auth_token', data.token);
        clearTimeout(timeout);
        onLogin();
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || 'The vault door is stuck. Check your connection.');
      setIsLoading(false);
    } finally {
      clearTimeout(timeout);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-rose-900/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-rose-800/20 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Decorative Floating Icon */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-24 h-24 bg-rose-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-rose-600/40 border border-white/20">
            <Heart className="text-white -rotate-12" size={40} fill="currentColor" />
          </div>
        </motion.div>

        {/* Main Glass Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl p-8 pt-16 rounded-[3rem] border border-white/10 shadow-3xl relative overflow-hidden">
          {/* Subtle Sparkle */}
          <Sparkles className="absolute top-8 right-8 text-rose-500/30" size={24} />

          <div className="text-center mb-8">
            <h2 className="text-4xl font-romantic text-white mb-2 tracking-wide">
              {isRegistering ? 'Our Beginning' : 'Back to You'}
            </h2>
            <p className="text-zinc-500 text-sm font-light uppercase tracking-[0.1em]">
              {isRegistering ? 'Create our private memory vault' : 'Access our shared love story'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all outline-none text-white placeholder:text-zinc-700"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:ring-1 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all outline-none text-white placeholder:text-zinc-700"
                  placeholder="Secret Password"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-6 focus:ring-1 focus:ring-rose-500/50 outline-none text-white placeholder:text-zinc-700"
                      placeholder="Confirm Secret"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="flex items-center gap-2 text-rose-400 text-xs font-medium bg-rose-500/10 py-3 rounded-2xl px-4 border border-rose-500/20"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden group bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-2xl py-4 font-semibold transition-all shadow-xl shadow-rose-900/20 active:scale-[0.98]"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Unlocking Vault...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegistering ? 'Start Our Journey' : 'Enter Our World'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-sm text-zinc-400 hover:text-rose-400 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
              {isRegistering 
                ? "Already have our key? Log In" 
                : "New here? Create Our Shared Vault"}
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Footer Decoration */}
      <div className="mt-8 text-zinc-700 text-[10px] uppercase tracking-[0.3em] font-medium">
        Encrypted Love Vault v2.0
      </div>
    </div>
  );
};

export default Auth;
