import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('LOADING CAMPUS');
  const [dots, setDots] = useState('');

  // Slower progress to build tension and allow visual appreciation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment by random pixel increments for retro feel
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Sync cursor dots blinking
  useEffect(() => {
    const textInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 400);

    return () => clearInterval(textInterval);
  }, []);

  // When loading finishes, wait 600ms for appreciation and trigger slide wipe
  useEffect(() => {
    if (progress === 100) {
      const wait = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(wait);
    }
  }, [progress, onComplete]);

  // Pixel gate blocks for the block-by-block build up
  // We can render a grid representing the signature VITC monument and portal arch
  // Blocks will be visible if progress >= their required percentage
  const gateBlocks = [
    // Ground foundation
    { id: 1, x: 2, y: 9, w: 16, h: 1, req: 5, color: 'bg-neutral-700' },
    
    // Monument Pillar (right)
    { id: 2, x: 13, y: 7, w: 3, h: 2, req: 15, color: 'bg-orange-850' },
    { id: 3, x: 13, y: 5, w: 3, h: 2, req: 25, color: 'bg-orange-800' },
    { id: 4, x: 13, y: 3, w: 3, h: 2, req: 40, color: 'bg-orange-700' },
    { id: 5, x: 13, y: 1, w: 3, h: 2, req: 60, color: 'bg-orange-600' },
    { id: 6, x: 14, y: 0, w: 1, h: 1, req: 85, color: 'bg-amber-500' }, // VIT Pillar peak/logo node

    // Left Arch pillar & canopy
    { id: 7, x: 3, y: 5, w: 2, h: 4, req: 20, color: 'bg-amber-800' },
    { id: 8, x: 5, y: 5, w: 1, h: 4, req: 30, color: 'bg-neutral-650' },
    { id: 9, x: 3, y: 4, w: 6, h: 1, req: 45, color: 'bg-amber-700' }, // angled canopy base
    { id: 10, x: 5, y: 3, w: 5, h: 1, req: 55, color: 'bg-amber-600' }, // angled canopy mid
    { id: 11, x: 7, y: 2, w: 4, h: 1, req: 70, color: 'bg-neutral-100' }, // canopy roof
    
    // Security cabin inside
    { id: 12, x: 7, y: 6, w: 2, h: 3, req: 50, color: 'bg-white border border-neutral-800' },
    
    // Backing administrative buildings (silhouette)
    { id: 13, x: 6, y: 4, w: 3, h: 2, req: 65, color: 'bg-indigo-900/60' },
    { id: 14, x: 9, y: 3, w: 2, h: 3, req: 75, color: 'bg-indigo-900/40' },
    
    // Indian Flag waving behind
    { id: 15, x: 11, y: 2, w: 1, h: 4, req: 80, color: 'bg-yellow-800' }, // pole
    { id: 16, x: 10, y: 1, w: 1, h: 1, req: 90, color: 'bg-orange-500' }, // flag saffron
    { id: 17, x: 11, y: 1, w: 1, h: 1, req: 92, color: 'bg-white' },      // flag white
    { id: 18, x: 12, y: 1, w: 1, h: 1, req: 95, color: 'bg-green-600' },  // flag green
  ];

  return (
    <div className="fixed inset-0 bg-[#1A1A2E] z-50 flex flex-col items-center justify-center overflow-hidden font-mono text-white select-none">
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-50 animate-[pulse_2s_infinite]" />
      <div className="absolute inset-0 bg-radial-vignette opacity-30 pointer-events-none z-50" />

      <div className="w-[90%] max-w-[480px] border-4 border-[#FF6B35] bg-[#121222] p-6 relative shadow-[8px_8px_0px_0px_rgba(75,0,130,1)] rounded-none">
        {/* Retro screen details */}
        <div className="absolute top-2 left-3 text-[10px] text-amber-500 tracking-widest uppercase select-none font-bold animate-pulse">
          ▶ PLAY_ONBOARDING
        </div>
        <div className="absolute top-2 right-3 text-[10px] text-neutral-500">
          SYS_V20.25
        </div>

        {/* Console view area / CRT box */}
        <div className="aspect-video bg-[#0d0d1a] border-2 border-neutral-700 p-4 mb-6 relative overflow-hidden flex flex-col items-center justify-center rounded-sm">
          {/* Subtle raster grid background */}
          <div className="absolute inset-0 opacity-10 bg-grid-4 border-b border-neutral-800" />
          
          {/* Gate block render stage */}
          <div className="relative w-full h-[120px] max-w-[200px] border border-neutral-800/40 bg-[#090911]/80 rounded-sm">
            {/* Displaying horizontal & vertical helper lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-[1px] border-b border-neutral-800/20" />
              <div className="h-full w-[1px] border-r border-neutral-800/20" />
            </div>

            {/* Render blocks based on current loading progress */}
            {gateBlocks.map((block) => {
              const isActive = progress >= block.req;
              return (
                <div
                  key={block.id}
                  className={`absolute transition-all duration-300 ${block.color} ${
                    isActive 
                      ? 'opacity-100 scale-100 shadow-[0_0_4px_rgba(255,107,53,0.3)]' 
                      : 'opacity-0 scale-50'
                  }`}
                  style={{
                    left: `${block.x * 5}%`,
                    top: `${block.y * 10}%`,
                    width: `${block.w * 5}%`,
                    height: `${block.h * 10}%`,
                  }}
                />
              );
            })}

            {/* Light aura / neon scan line simulating pixel render */}
            <div 
              className="absolute left-0 right-0 h-[2px] bg-amber-400 opacity-60 pointer-events-none animate-[scan-line_2.5s_linear_infinite]"
              style={{
                boxShadow: '0 0 8px #FFBA08, 0 0 20px #FFBA08'
              }}
            />
          </div>

          <div className="mt-4 text-[11px] text-neutral-400 text-center tracking-wide flex items-center justify-center space-x-1 font-mono uppercase">
            <span>Building gate node: {progress}%</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs text-amber-500 font-bold tracking-widest pl-1 font-mono">
            <span className="w-2 h-2 bg-amber-500 animate-ping rounded-full" />
            <span>{loadingText}{dots}</span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-6 w-full border-2 border-white p-[2px] bg-neutral-900 flex items-center select-none overflow-hidden relative">
            <div className="absolute inset-0 bg-neutral-900 z-0" />
            {/* Horizontal progress representation broken down into chunky chunks */}
            <div className="relative h-full flex w-full space-x-[2px] z-10">
              {Array.from({ length: 15 }).map((_, index) => {
                const threshold = (index / 15) * 100;
                const isFilled = progress >= threshold;
                return (
                  <div
                    key={index}
                    className={`h-full flex-1 transition-colors duration-200 ${
                      isFilled 
                        ? 'bg-gradient-to-r from-[#FF6B35] to-[#C1440E]' 
                        : 'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>
            {/* Percentage text overlay */}
            <span className="absolute right-3.5 z-20 font-bold text-xs text-black mix-blend-difference drop-shadow-sm font-sans">
              {progress}%
            </span>
          </div>

          {/* Action log message */}
          <div className="text-[10px] text-neutral-500 text-center select-none pt-1">
            {progress < 30 && 'CONNECTING TO VITC COMMUNITY NET...'}
            {progress >= 30 && progress < 60 && 'PARSING BRANCH CHANNELS & COHORTS...'}
            {progress >= 60 && progress < 85 && 'ESTABLISHING SECURE GATE PROTOCOLS...'}
            {progress >= 85 && progress < 100 && 'ALMOST ONLINE... CHIPTUNES STABILIZED'}
            {progress === 100 && 'CAMPUS LOADED! BOOTING SYSTEM...'}
          </div>
        </div>
      </div>
      
      {/* Interactive Arcade Floor Grid Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}
