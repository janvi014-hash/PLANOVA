import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STICKERS = [
  '⭐', '🌟', '✨', '⚡', '🔥', '🎉', '🎊', '🎈', '💖', '💗', 
  '🌸', '🌷', '🌺', '🍀', '🌿', '🌱', '🍄', '🦋', '🐝', '🐞',
  '🌙', '☀️', '🌈', '☁️', '❄️', '🌊', '💧', '🎨', '🎭', '🎪',
  '📚', '📖', '💡', '📌', '🎯', '🏆', '🥇', '🚀', '🛸', '🛰️'
];

interface StickerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sticker: string) => void;
  isPro: boolean;
  onUpgradePrompt: () => void;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ isOpen, onClose, onSelect, isPro, onUpgradePrompt }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 dark:border-slate-800"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
              <span className="text-2xl">✨</span> Decorate
            </h3>
            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-5 gap-3 max-h-[300px] overflow-y-auto no-scrollbar p-2">
            {STICKERS.map((sticker, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!isPro) {
                    onUpgradePrompt();
                  } else {
                    onSelect(sticker);
                    onClose();
                  }
                }}
                className={`text-3xl hover:scale-125 transition-transform relative group flex items-center justify-center aspect-square ${!isPro ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
              >
                {sticker}
                {!isPro && (
                  <div className="absolute inset-0 bg-slate-900/10 dark:bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                    <svg className="w-4 h-4 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {!isPro && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
              <p className="text-xs text-amber-800 dark:text-amber-400 font-bold text-center">
                Stickers are a Pro feature! Unlock them to customize your workspace.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickerPicker;
