import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Branch } from '../types';
import RetroIcon from './RetroIcon';

interface BranchCardProps {
  branch: Branch;
  index: number;
  onClick: () => void;
}

export default function BranchCard({ branch, index, onClick }: BranchCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [shimmerPos, setShimmerPos] = useState({ x: 0, y: 0 });
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Pure React 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Map to angles (max 12deg tilt for pleasant aesthetic and high-end feel)
    const degX = -(mouseY / (height / 2)) * 12;
    const degY = (mouseX / (width / 2)) * 12;
    
    setRotateX(degX);
    setRotateY(degY);

    // Track cursor pos for custom golden/indigo shimmer sweep
    const shimmerX = ((e.clientX - rect.left) / width) * 100;
    const shimmerY = ((e.clientY - rect.top) / height) * 100;
    setShimmerPos({ x: shimmerX, y: shimmerY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const domainBadgeText = {
    'cs-it': 'CS / IT',
    'ece-eee': 'ECE / EEE',
    'mech-civil': 'MECH / CIVIL',
    'other': 'OTHER COHORT'
  }[branch.domain];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.05 // cascaded entry wave!
      }}
      className="p-1 select-none flex-shrink-0 w-80 snap-start"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          transform: isHovered 
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)` 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        className={`relative h-[240px] border-4 border-black bg-neutral-900 overflow-hidden cursor-pointer select-none flex flex-col justify-between p-5 transition-shadow duration-300 ${
          isHovered ? `${branch.colorTheme.border} ${branch.colorTheme.glow}` : 'border-neutral-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
        } group rounded-none`}
      >
        {/* Shimmer sweep follow-mouse gradient layer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle 120px at ${shimmerPos.x}% ${shimmerPos.y}%, rgba(255,255,255,0.8), transparent)`
          }}
        />

        {/* Diagonal Scanlines Grid texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] group-hover:opacity-10 transition-opacity duration-300" />

        {/* 8-bit Retro corner stickers (4px chunk layout) */}
        <div className={`absolute top-0 left-0 w-2.5 h-2.5 border-r-2 border-b-2 border-black z-10 ${isHovered ? 'bg-[#FFBA08]' : 'bg-neutral-800'}`} />
        <div className={`absolute top-0 right-0 w-2.5 h-2.5 border-l-2 border-b-2 border-black z-10 ${isHovered ? 'bg-[#FFBA08]' : 'bg-neutral-800'}`} />
        <div className={`absolute bottom-0 left-0 w-2.5 h-2.5 border-r-2 border-t-2 border-black z-10 ${isHovered ? 'bg-[#FF6B35]' : 'bg-neutral-800'}`} />
        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-l-2 border-t-2 border-black z-10 ${isHovered ? 'bg-[#FF6B35]' : 'bg-neutral-800'}`} />

        {/* Top Section: Abbreviation & Theme Icon */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            {/* Domain tag */}
            <span className={`inline-block text-[8px] font-mono px-1.5 py-0.5 font-bold uppercase tracking-wider mb-2 border border-black ${branch.colorTheme.badgeBg} text-white shadow-[1px_1px_0px_rgba(0,0,0,1)]`}>
              {domainBadgeText}
            </span>
            <h3 className="font-mono text-xl text-white font-black tracking-wide leading-none select-none mt-1">
              {branch.abbreviation}
            </h3>
          </div>
          <RetroIcon name={branch.representativeIcon} color={branch.colorTheme.iconColor} />
        </div>

        {/* Center Section: Full Description */}
        <div className="mt-3 relative z-10 flex-grow">
          <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-3">
            <span className="font-bold text-white block mb-0.5 leading-tight">{branch.name}</span>
            {branch.description}
          </p>
        </div>

        {/* Bottom Section: CTA "Insert Coin" feel */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-3 mt-2 relative z-10 select-none">
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-500 group-hover:text-amber-500 transition-colors duration-200 uppercase">
            {isHovered ? '★ JOIN WHATSAPP' : 'INSERT COIN...'}
          </span>
          <div className="flex items-center space-x-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="text-[9px] font-mono text-neutral-400 group-hover:text-white transition-colors uppercase">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Chiptune visual pulse border when hovering */}
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 pointer-events-none transition-colors" />
      </div>
    </motion.div>
  );
}
