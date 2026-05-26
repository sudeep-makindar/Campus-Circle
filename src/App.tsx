import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Info, ShieldCheck, Gamepad2, ArrowRight, Link as LinkIcon, Rocket, Linkedin } from 'lucide-react';
import { BRANCHES_DATA } from './data';
import { Branch } from './types';
import LoadingScreen from './components/LoadingScreen';
import BranchCard from './components/BranchCard';
import BranchModal from './components/BranchModal';
import Header from './components/Header';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('about');
  const [isHovered, setIsHovered] = useState(false);

  const horizontalScrollRef = useRef<HTMLDivElement>(null);



  // Monitor Scroll for parallax calculations, scroll progress bar, and active section scrollspy
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Compute page scroll percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((currentScrollY / totalHeight) * 100);
      }

      // Scroll Spy for active navigation section
      const sections = ['hero', 'about', 'branches', 'conduct', 'footer'];
      const scrollPosition = currentScrollY + 200; // trigger offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (section === 'hero' || section === 'about') {
              setActiveSection('about');
            } else if (section === 'branches') {
              setActiveSection('branches');
            } else if (section === 'conduct') {
              setActiveSection('conduct');
            } else if (section === 'footer') {
              setActiveSection('support');
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially to capture current view state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler with offset for sticky header navigation
  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('about');
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 74; // Sticky header (64px) + Progress Bar (10px) offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Optimistic highlight
      if (sectionId === 'about') setActiveSection('about');
      else if (sectionId === 'branches') setActiveSection('branches');
      else if (sectionId === 'conduct') setActiveSection('conduct');
    }
  };

  // Filter Branches by search query and domain pill select
  const filteredBranches = BRANCHES_DATA.filter((branch) => {
    const matchesSearch = 
      branch.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedDomain === 'all') {
      return matchesSearch;
    }
    return matchesSearch && branch.domain === selectedDomain;
  });

  // Auto-scroll carousel continuous smooth scroll
  useEffect(() => {
    if (isHovered || !horizontalScrollRef.current || filteredBranches.length === 0) return;
    
    let animationFrameId: number;
    
    const scroll = () => {
      if (horizontalScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = horizontalScrollRef.current;
        // If reached the end, smoothly scroll back to start (or instant reset if infinite)
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          horizontalScrollRef.current.scrollTo({ left: 0 });
        } else {
          horizontalScrollRef.current.scrollLeft += 1; // 1px per frame (medium speed ~60px/s)
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, filteredBranches]);



  const handleOpenBranchModal = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1A1A2E] overflow-x-hidden selection:bg-[#FF6B35] selection:text-white">
      {/* 1. RETRO PROGRESS BAR (Fixed at Top) */}
      <div className="fixed top-0 left-0 right-0 h-2.5 bg-[#FAF3E0] z-45 border-b-2 border-black overflow-hidden pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-[#FF6B35] via-[#FFBA08] to-[#4B0082] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. LOADING SCREEN */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* NAVIGATION HEADER */}
          <Header
            activeSection={activeSection}
            onNavigate={handleNavigate}
          />


          {/* 3. HERO SECTION — VIT Gate pixel art with clean parallax */}
          <section id="hero" className="relative h-screen min-h-[640px] w-full flex items-center justify-center overflow-hidden border-b-4 border-black select-none">

            {/* === BG: VIT Gate Image (full bleed, slow parallax upward) === */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{ transform: `translateY(${scrollY * 0.35}px)`, willChange: 'transform' }}
            >
              <img
                src="/vit_gate.jpg"
                alt="VIT University Chennai Campus Gate"
                className="w-full h-full object-cover object-center select-none"
                style={{ filter: 'blur(3px)', transform: 'scale(1.06)' }}
                draggable={false}
              />
            </div>

            {/* === Dark overlay for text legibility === */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/30 to-black/65 pointer-events-none" />

            {/* === CRT Scanline overlay === */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)' }}
            />

            {/* === Animated pixel clouds (in the top sky zone of the gate image) === */}
            <motion.div
              className="absolute top-[6%] left-[-5%] z-20 pointer-events-none select-none"
              animate={{ x: ['0%', '110vw'] }}
              transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
              style={{ translateY: scrollY * 0.15 }}
            >
              <PixelCloud width={130} height={52} color="#ffffff" opacity={0.85} />
            </motion.div>

            <motion.div
              className="absolute top-[14%] right-[-10%] z-20 pointer-events-none select-none"
              animate={{ x: ['0%', '-120vw'] }}
              transition={{ duration: 80, repeat: Infinity, ease: 'linear', delay: 6 }}
              style={{ translateY: scrollY * 0.18 }}
            >
              <PixelCloud width={170} height={68} color="#dbeafe" opacity={0.7} />
            </motion.div>

            <motion.div
              className="absolute top-[22%] left-[30%] z-20 pointer-events-none select-none"
              animate={{ x: ['0%', '80vw'] }}
              transition={{ duration: 70, repeat: Infinity, ease: 'linear', delay: 18 }}
              style={{ translateY: scrollY * 0.12 }}
            >
              <PixelCloud width={95} height={38} color="#e0f2fe" opacity={0.6} />
            </motion.div>

            {/* === Hero Content (counter-parallax — rises slightly as you scroll) === */}
            <div
              className="relative z-30 flex flex-col items-center text-center gap-6 px-4 max-w-3xl mx-auto"
              style={{ transform: `translateY(${scrollY * -0.18}px)`, willChange: 'transform' }}
            >
              {/* Retro badge sticker */}
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: -3 }}
                transition={{ type: 'spring', damping: 8, stiffness: 180, delay: 0.1 }}
                whileHover={{ rotate: 3, scale: 1.08 }}
                className="inline-flex items-center gap-2 bg-[#FFBA08] text-[#1a1a2e] border-4 border-black px-4 py-2 font-press text-[9px] sm:text-[11px] shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase cursor-default"
              >
                🎓 VIT'C '30 — Freshman Squad
              </motion.div>

              {/* Headline — wipe reveal */}
              <motion.h1
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 1.0, ease: [0.77, 0, 0.175, 1], delay: 0.3 }}
                className="font-press text-3xl sm:text-4xl md:text-5xl text-white leading-tight uppercase drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]"
              >
                Welcome to{' '}
                <motion.span
                  className="text-[#ff6b35] inline-block"
                  animate={{ textShadow: ['2px 2px 0px #7f1d00', '5px 5px 0px #7f1d00', '2px 2px 0px #7f1d00'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Campus Circle
                </motion.span>
              </motion.h1>

              {/* Typewriter subtitle box */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.55 }}
                className="font-mono text-sm sm:text-base text-[#e2e0fc] max-w-xl bg-black/60 backdrop-blur-sm px-5 py-3 border-2 border-white/20 clip-path-pixel-corners"
              >
                <TypewriterText text="Your unofficial hub for freshers. Connect with your branch, find your squad, and dive into campus life." delay={900} />
              </motion.div>

              {/* CTA button row */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 items-center"
              >
                <motion.button
                  onClick={() => handleNavigate('branches')}
                  whileHover={{ scale: 1.05, y: -3, boxShadow: '7px 7px 0px rgba(0,0,0,1)' }}
                  whileTap={{ scale: 0.96, y: 2, boxShadow: '1px 1px 0px rgba(0,0,0,1)' }}
                  className="inline-flex items-center gap-3 bg-[#52B788] text-[#1a1a2e] border-4 border-black px-8 py-4 font-press text-[10px] sm:text-xs uppercase shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#2D6A4F] hover:text-white transition-colors cursor-pointer"
                >
                  Find My Branch <ArrowRight size={16} />
                </motion.button>

                <motion.button
                  onClick={() => handleNavigate('about')}
                  whileHover={{ scale: 1.05, y: -3, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.96, y: 2 }}
                  className="inline-flex items-center gap-2 bg-transparent text-white border-2 border-white/60 px-6 py-4 font-press text-[10px] sm:text-xs uppercase transition-colors cursor-pointer"
                >
                  Learn More <Info size={14} />
                </motion.button>
              </motion.div>

              {/* Scroll cue */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="flex flex-col items-center gap-1.5 mt-2"
              >
                <motion.div
                  animate={{ y: [0, 9, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center pt-1.5"
                >
                  <div className="w-1 h-2 bg-white/50 rounded-full" />
                </motion.div>
                <span className="font-press text-[7px] text-white/40 uppercase tracking-widest">Scroll</span>
              </motion.div>
            </div>

            {/* Bottom Jagged Divider */}
            <div
              className="absolute bottom-0 w-full h-10 bg-[#FAF3E0] z-40"
              style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 95% 100%, 90% 0, 85% 100%, 80% 0, 75% 100%, 70% 0, 65% 100%, 60% 0, 55% 100%, 50% 0, 45% 100%, 40% 0, 35% 100%, 30% 0, 25% 100%, 20% 0, 15% 100%, 10% 0, 5% 100%, 0 0)' }}
            />
          </section>


          {/* 4. ABOUT SECTION — VIT campus buildings as parallax bg */}
          <section id="about" className="relative py-24 px-4 overflow-hidden border-b-4 border-black bg-[#FAF3E0]">

            {/* Parallax Background — VIT campus buildings pixel art */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{ transform: `translateY(${(scrollY - (typeof window !== 'undefined' ? window.innerHeight : 800)) * 0.1}px)` }}
            >
              <img
                src="/vit_campus.jpg"
                alt="VIT Chennai Campus Buildings"
                className="w-full h-full object-cover object-center scale-110 select-none"
                draggable={false}
              />
            </div>
            {/* Warm amber overlay to match brand palette */}
            <div className="absolute inset-0 bg-[#FFF8F0]/88 z-0 select-none pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
              
              {/* Header with clip-path Mask Reveal Wipe on Scroll */}
              <motion.div
                initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
                whileInView={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-16"
              >
                <div className="flex items-center justify-center space-x-2 text-[#4B0082] mb-1">
                  <Gamepad2 size={16} className="animate-spin" />
                  <span className="font-press text-[9px] font-extrabold uppercase tracking-widest">
                    MISSION BOARD
                  </span>
                </div>
                <h2 className="font-press text-xl sm:text-2.5xl md:text-3.5xl text-neutral-900 tracking-tight uppercase leading-none mt-2">
                  What is Campus Circle?
                </h2>
                <div className="h-1 bg-black w-24 mx-auto mt-4 shadow-[2px_2px_0px_rgba(0,0,0,0.15)]" />
              </motion.div>

              {/* Grid of 3 Arcade styled Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1st Info Card: Student Run */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 18 }}
                  whileHover={{ y: -6, boxShadow: '8px 8px 0px rgba(0,0,0,1)' }}
                  className="bg-white border-4 border-black p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative group rounded-none shimmer-hover cursor-default"
                >
                  <motion.div
                    className="p-3 bg-[#4B0082] text-white border-2 border-black inline-block shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-none"
                    whileHover={{ rotate: 10, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Gamepad2 size={18} className="stroke-[2.5] relative top-[1px]" />
                  </motion.div>
                  <h3 className="font-press text-[11px] sm:text-xs text-neutral-900 font-black uppercase mt-5 tracking-tight">
                    Student-Run
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 mt-2.5 leading-relaxed font-medium">
                    Built by seniors at VIT Chennai who walked this gate before you. Crafting communities to connect and learn together officially.
                  </p>
                </motion.div>

                {/* 2nd Info Card: Branch Verified */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 18 }}
                  whileHover={{ y: -6, boxShadow: '8px 8px 0px rgba(0,0,0,1)' }}
                  className="bg-white border-4 border-black p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative group rounded-none shimmer-hover cursor-default"
                >
                  <motion.div
                    className="p-3 bg-[#FFBA08] text-[#1a1a2e] border-2 border-black inline-block shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-none"
                    whileHover={{ rotate: -10, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <LinkIcon size={18} className="stroke-[2.5]" />
                  </motion.div>
                  <h3 className="font-press text-[11px] sm:text-xs text-neutral-900 font-black uppercase mt-5 tracking-tight">
                    Branch Verified
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 mt-2.5 leading-relaxed font-medium">
                    No spam links, no dynamic ad hijackers. Every single WhatsApp community listed is curated, checked, and run safely for academic growth.
                  </p>
                </motion.div>

                {/* 3rd Info Card: Instant Access */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 18 }}
                  whileHover={{ y: -6, boxShadow: '8px 8px 0px rgba(0,0,0,1)' }}
                  className="bg-white border-4 border-black p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] relative group rounded-none shimmer-hover cursor-default"
                >
                  <motion.div
                    className="p-3 bg-[#52B788] text-white border-2 border-black inline-block shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-none"
                    whileHover={{ rotate: 10, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Rocket size={18} className="stroke-[2.5]" />
                  </motion.div>
                  <h3 className="font-press text-[11px] sm:text-xs text-neutral-900 font-black uppercase mt-5 tracking-tight">
                    Instant Access
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 mt-2.5 leading-relaxed font-medium">
                    Choose your department node, review details, and tap join to instantly enter the chat loop. No waiting, no manual forms.
                  </p>
                </motion.div>

              </div>
            </div>
          </section>

          {/* 5. BRANCH TILES SECTION */}
          <section id="branches" className="py-24 px-4 md:px-8 bg-neutral-950 text-white relative border-b-4 border-black">
            {/* Retro grid background texture */}
            <div className="absolute inset-0 bg-pixel-grid-dark opacity-40 pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10">
              
              {/* Header & Subtitle */}
              <div className="text-center mb-12">
                <span className="font-press text-[9px] text-[#FF6B35] font-black tracking-widest uppercase block select-none">
                  LEVEL 01 -- PLAYER MATCHING
                </span>
                <h2 className="font-press text-2xl sm:text-3.5xl text-white font-extrabold uppercase mt-2 drop-shadow-[2px_2px_0px_#C1440E]">
                  Find Your Branch
                </h2>
                <div className="h-1 bg-[#FF6B35] w-28 mx-auto mt-4 shadow-[2px_2px_0px_#4B0082]" />
              </div>

              {/* SEARCH BAR & DOMAIN FILTERS */}
              <div className="max-w-3xl mx-auto mb-16 space-y-6">
                
                {/* 8-bit Interactive Live Search Bar */}
                <div className="relative border-4 border-neutral-700 hover:border-[#FFBA08] transition-colors focus-within:border-[#FFBA08] bg-neutral-900 p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center">
                  <Search size={20} className="text-neutral-500 ml-2 mr-3" />
                  
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ENTER BRANCH ABBREVIATION OR KEYWORD..."
                    className="w-full bg-transparent border-none text-white font-mono text-sm uppercase placeholder-neutral-600 focus:outline-none focus:ring-0 mr-4 tracking-wider"
                  />
                  
                  {/* Blinking Underscore Terminal Accent */}
                  {searchQuery === '' && (
                    <span className="absolute left-[380px] hidden md:inline font-mono font-black text-amber-500 animate-pulse pointer-events-none text-sm select-none">
                      _
                    </span>
                  )}
                  
                  {/* Total match counter */}
                  <span className="bg-neutral-800 text-[10px] font-mono font-black text-[#FFF8F0] px-2.5 py-1 select-none border border-neutral-700 mr-1">
                    MATCH: {filteredBranches.length}
                  </span>
                </div>

                {/* Domain Pill Select Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    { id: 'all', label: 'All Branches' },
                    { id: 'cs-it', label: 'CS / IT' },
                    { id: 'ece-eee', label: 'ECE / EEE' },
                    { id: 'mech-civil', label: 'MECH / CIVIL' },
                    { id: 'other', label: 'Other' },
                  ].map((domain) => {
                    const isSelected = selectedDomain === domain.id;
                    return (
                      <button
                        key={domain.id}
                        onClick={() => setSelectedDomain(domain.id)}
                        className={`px-3 py-1.5 border-2 font-mono text-[10px] uppercase tracking-wider cursor-pointer font-black transition-all ${
                          isSelected 
                            ? 'bg-[#FF6B35] border-black text-white shadow-[2px_2px_0px_#000]' 
                            : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
                        } rounded-none`}
                      >
                        {domain.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* HORIZONTAL CAROUSEL (Desktop) OR WRAPPING GRID (Mobile) */}
              {filteredBranches.length > 0 ? (
                <div className="relative">


                  {/* Horizontal Container Layer */}
                  <div 
                    ref={horizontalScrollRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={() => setIsHovered(true)}
                    onTouchEnd={() => setIsHovered(false)}
                    className="flex md:overflow-x-auto gap-6 pb-6 hide-scrollbar flex-col md:flex-row px-1 items-center md:items-stretch"
                  >
                    {filteredBranches.map((branch, index) => (
                      <div 
                        key={branch.id}
                        className="md:flex-shrink-0"
                      >
                        <BranchCard
                          branch={branch}
                          index={index}
                          onClick={() => handleOpenBranchModal(branch)}
                        />
                      </div>
                    ))}
                  </div>


                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-neutral-800 max-w-lg mx-auto p-8 rounded-none bg-neutral-900/40">
                  <span className="text-3xl">👾</span>
                  <h3 className="font-press text-xs font-bold text-[#FF6B35] mt-4 uppercase">
                    NO NODES MATCHED!
                  </h3>
                  <p className="font-mono text-xs text-neutral-500 mt-2.5">
                    No branch nodes or groups found matching "{searchQuery}". Try searching with shorter terms (e.g., 'CSE').
                  </p>
                </div>
              )}

            </div>
          </section>

          {/* 6. OUTRO DISCIPLINE BOX */}
          <section id="conduct" className="bg-[#FAF3E0] py-14 px-4 border-b-4 border-black">
            <div className="max-w-2xl mx-auto border-4 border-black bg-white p-6 shadow-[5px_5px_0px_rgba(0,0,0,1)] relative rounded-none">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-[#FF6B35] border-2 border-black text-white inline-block shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                  <ShieldCheck size={20} className="stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-press text-[11px] text-neutral-900 font-extrabold uppercase select-none">
                    Community Code of Conduct
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 mt-2 leading-relaxed">
                    By entering any WhatsApp node or community listing, you represent yours as a true VITC '30 student. These slots exist purely for academic help, peer collaboration, hostel alignment, and social support. No ragging, political arguments, bulk spamming, or harassment is tolerated. Let's keep VITC glorious!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. DETAILED DETAILS MODAL */}
          <BranchModal 
            branch={selectedBranch}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />



          {/* 8. FOOTER WITH FLOATING STARS */}
          <footer id="footer" className="bg-[#12121e] text-neutral-400 pt-16 pb-20 px-4 border-t-4 border-black relative overflow-hidden">
            {/* Tiny Floating Pixel Stars background */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
              {Array.from({ length: 12 }).map((_, index) => {
                const randomTop = Math.floor(Math.random() * 85) + 5;
                const randomLeft = Math.floor(Math.random() * 90) + 5;
                const animDuration = Math.random() * 3 + 1.5;
                return (
                  <div 
                    key={index}
                    className="absolute w-1 h-1 bg-amber-400 rounded-full animate-[star-blink_2.5s_infinite]"
                    style={{
                      top: `${randomTop}%`,
                      left: `${randomLeft}%`,
                      animationDuration: `${animDuration}s`,
                      boxShadow: '0 0 3px #FFBA08'
                    }}
                  />
                );
              })}
            </div>

            <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
              <h3 className="font-press text-xs text-white uppercase select-none tracking-widest">
                CAMPUS CIRCLE
              </h3>
              
              <div className="h-0.5 bg-neutral-800 w-16 mx-auto shadow-sm" />

              <p className="text-xs font-sans text-neutral-500 font-medium tracking-wide">
                Made with ❤️ by Campus Circle | VIT Chennai – '30
              </p>

              <div className="text-[10px] font-mono text-neutral-600 max-w-md mx-auto leading-relaxed uppercase">
                ⚠️ DISCLAIMER: This micro onboarding site is not affiliated with Vellore Institute of Technology (VIT) officially. Student-run, student-moderated program. All brand names belong entirely to their respecting academic registrar.
              </div>
            </div>
            {/* Creators LinkedIn Links */}
            <div className="absolute bottom-10 right-4 md:bottom-12 md:right-8 z-20 flex items-center gap-3">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Made by</span>
              <a href="https://www.linkedin.com/in/sudeep-makindar/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-[#FFBA08] transition-colors" title="Sudeep Makindar">
                <Linkedin size={18} />
              </a>
              <a href="https://www.linkedin.com/in/ramnnn/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-[#FFBA08] transition-colors" title="Ramnnn">
                <Linkedin size={18} />
              </a>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
}

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 28);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return (
    <span>
      {displayedText}
      <span className={`inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle ${isTyping ? 'animate-pulse' : 'opacity-0'}`} />
    </span>
  );
};

/** Pixel-art style blocky cloud SVG */
const PixelCloud = ({ width = 100, height = 40, color = '#ffffff', opacity = 1 }: { width?: number; height?: number; color?: string; opacity?: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 40"
      style={{ imageRendering: 'pixelated', display: 'block', opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pixel cloud built with rect tiles for chunky retro look */}
      <rect x="20" y="20" width="60" height="16" fill={color} />
      <rect x="12" y="24" width="76" height="12" fill={color} />
      <rect x="28" y="12" width="28" height="12" fill={color} />
      <rect x="52" y="16" width="20" height="8" fill={color} />
      <rect x="16" y="28" width="68" height="8" fill={color} />
      <rect x="36" y="8" width="12" height="8" fill={color} />
    </svg>
  );
};
