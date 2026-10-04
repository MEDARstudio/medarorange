import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface SecretAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SECRET_PIN = '010904';

const SecretAuthModal: React.FC<SecretAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === SECRET_PIN) {
      setError(false);
      setCode('');
      onSuccess();
    } else {
      setError(true);
      setCode('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#101017] border border-white/15 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
        >
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff4b26]/10 blur-[60px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#ff4b26]/15 border border-[#ff4b26]/30 flex items-center justify-center text-[#ff4b26]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#ff4b26] font-semibold block">
                Secret Console
              </span>
              <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                Administrator Authentication
              </h3>
            </div>
          </div>

          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Administrative console reserved for Medar Studio leadership. Please enter your security PIN to unlock the content management system.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                Secure Access PIN
              </label>
              <input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="••••••"
                maxLength={10}
                autoFocus
                className={`w-full bg-[#161622] border ${
                  error ? 'border-red-500 text-red-400' : 'border-white/15 text-white'
                } px-4 py-3 text-center tracking-[0.4em] font-mono text-lg focus:outline-none focus:border-[#ff4b26] transition-colors`}
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-xs text-red-400 font-mono">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Incorrect PIN. Access denied.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#ff4b26] hover:bg-white text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(255,75,38,0.3)]"
            >
              <span>Unlock Studio CMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Encrypted Session</span>
            </span>
            <span>Medar Studio Admin</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SecretAuthModal;
