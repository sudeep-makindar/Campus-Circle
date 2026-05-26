import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Branch } from '../types';
import { X, MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import RetroIcon from './RetroIcon';

interface BranchModalProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BranchModal({ branch, isOpen, onClose }: BranchModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Esc Key to close + Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
      // Focus the close button first
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!branch) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container with CRT Power-On scale-from-0 trigger */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 280,
              damping: 22,
              mass: 0.85
            }}
            ref={modalRef}
            aria-modal="true"
            role="dialog"
            aria-labelledby="branch-modal-title"
            className="relative w-full max-w-[500px] border-4 border-black bg-[#faf3e0] text-[#1a1a2e] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10 rounded-none overflow-hidden"
          >
            {/* CRT Phosphor Screen Power-On Brightness Flash Overlay */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-white pointer-events-none z-50"
            />

            {/* CRT Quick Vertical White Line Scan Sweep */}
            <motion.div
              initial={{ left: '-10%' }}
              animate={{ left: '110%' }}
              transition={{ delay: 0.15, duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-y-0 w-[6px] bg-white pointer-events-none z-50 opacity-90 shadow-[0_0_10px_#ffffff,0_0_20px_#ffffff,0_0_35px_#ffffff]"
              style={{ transform: 'skewX(-10deg)' }}
            />

            {/* Scanlines inside modal context overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px]" />

            {/* Retro 8-bit Corner Badges */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 bg-[#FF6B35] border-r-2 border-b-2 border-black" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#FF6B35] border-l-2 border-b-2 border-black" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-[#4B0082] border-r-2 border-t-2 border-black" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4B0082] border-l-2 border-t-2 border-black" />

            {/* Header section with X button */}
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className="flex items-center space-x-3.5">
                <RetroIcon name={branch.representativeIcon} color={branch.colorTheme.iconColor} className="shadow-[1px_1px_0px_0px_#000]" />
                <div>
                  <div className="text-[10px] font-mono font-black text-[#C1440E] bg-[#FFBA08]/20 border border-[#FFBA08] px-2 py-0.5 rounded-none uppercase select-none shadow-[1px_1px_0px_#000]">
                    Verified Squad {branch.id.toUpperCase() === 'CSE' ? '⭐ MAIN' : 'COHORT'}
                  </div>
                  <h2 id="branch-modal-title" className="font-mono text-2xl font-black text-neutral-900 tracking-tight leading-none mt-1 select-none">
                    {branch.abbreviation}
                  </h2>
                </div>
              </div>

              {/* Pixel Art Styled Close button */}
              <button
                ref={closeButtonRef}
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 border-2 border-black bg-white hover:bg-[#FF6B35] hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[1px_1px_0px_rgba(0,0,0,1)] outline-none rounded-none focus:ring-2 focus:ring-[#4B0082]"
              >
                <X size={16} className="stroke-[3]" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-5 relative z-10 mt-2">
              
              {/* Introduction */}
              <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
                <p className="text-[11px] font-mono font-semibold text-neutral-800 leading-relaxed uppercase">
                  This branch community follows a verification-based access system to maintain an authentic and moderated student network.
                </p>
              </div>

              {/* Step 1 */}
              <div className="bg-white border-2 border-black p-4 relative shadow-[3px_3px_0px_#C1440E] mt-6">
                <div className="absolute -top-3 left-3 bg-[#FFBA08] border-2 border-black px-2 py-0.5 text-[9px] font-press shadow-[1px_1px_0px_#000] text-black">
                  STEP 1
                </div>
                <p className="text-xs font-sans font-medium text-neutral-700 leading-relaxed mt-1">
                  Join the <span className="font-bold text-neutral-900">Verification Group</span> and send your admission letter for branch verification. Once reviewed by the moderators, you can proceed to the official branch community.
                </p>
                <a
                  href={branch.verificationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3"
                >
                  <button
                    type="button"
                    className="w-full py-2.5 border-2 border-black bg-[#FFBA08] hover:bg-[#E0A800] text-neutral-950 font-mono text-[11px] font-black tracking-widest uppercase cursor-pointer select-none transition-all active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck size={16} className="stroke-[2.5]" />
                    <span>Join Verification Group</span>
                  </button>
                </a>
              </div>

              {/* Step 2 */}
              <div className="bg-white border-2 border-black p-4 relative shadow-[3px_3px_0px_#2D6A4F] mt-6">
                <div className="absolute -top-3 left-3 bg-[#52B788] border-2 border-black px-2 py-0.5 text-[9px] font-press shadow-[1px_1px_0px_#000] text-black">
                  STEP 2
                </div>
                <p className="text-xs font-sans font-medium text-neutral-700 leading-relaxed mt-1">
                  After verification, send a request to join the <span className="font-bold text-neutral-900">Official Branch Group</span> using the official invite link provided here.
                </p>
                
                {branch.officialLink ? (
                  <a
                    href={branch.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3"
                  >
                    <button
                      type="button"
                      className="w-full py-2.5 border-2 border-black bg-[#52B788] hover:bg-[#2D6A4F] hover:text-white text-neutral-950 font-mono text-[11px] font-black tracking-widest uppercase cursor-pointer select-none transition-all active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center space-x-2"
                    >
                      <MessageSquare size={16} className="stroke-[2.5]" />
                      <span>Join Official Group</span>
                    </button>
                  </a>
                ) : (
                  <div className="mt-3 w-full py-2.5 border-2 border-neutral-300 bg-neutral-100 text-neutral-400 font-mono text-[11px] font-bold tracking-widest uppercase select-none flex items-center justify-center space-x-2 cursor-not-allowed">
                    <MessageSquare size={16} className="stroke-[2.5]" />
                    <span>Link Pending Setup</span>
                  </div>
                )}
                
                <p className="text-[10px] text-[#C1440E] font-bold font-mono mt-3 uppercase leading-tight text-center bg-red-50 p-1.5 border border-red-200">
                  ⚠️ Please leave the verification group once added to the official branch community.
                </p>
              </div>

              {/* Status Verification Box */}
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-2 text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-tight text-center">
                <span>Verified students only</span>
                <span className="hidden sm:inline">•</span>
                <span>Moderated by branch admins</span>
                <span className="hidden sm:inline">•</span>
                <span>Anti-spam protected</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
